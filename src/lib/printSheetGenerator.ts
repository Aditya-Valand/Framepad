/**
 * POLAMUSE — PRINT SHEET GENERATOR
 * ============================================================
 * Bin-packs mixed-size polaroid orders onto minimum A4 sheets.
 * Generates 300 DPI PNG with cut marks ready to send to print shop.
 *
 * Algorithm: Shelf First Fit Decreasing (SFFD)
 *   - Sorts items largest → smallest (area)
 *   - Fills each shelf left→right before starting a new row
 *   - Opens a new sheet only when the current one is full
 *   - Groups by finish (glossy / matte) — never mixes on one sheet
 *
 * Rendering approach:
 *   - Each design has a pixel-perfect PNG pre-rendered by the browser
 *     and uploaded to Cloudinary as `export_url` on save.
 *   - The sheet generator simply downloads those PNGs and places them
 *     at the correct position/size on the A4 canvas — no server-side
 *     design rendering needed.
 */

import { createCanvas, loadImage, type CanvasRenderingContext2D } from 'canvas'
import { sql } from '@/lib/db'
import path from 'path'
import fs from 'fs'

// ============================================================
// CONSTANTS
// ============================================================

const DPI         = 300
const MM_TO_PX    = DPI / 25.4          // 11.811 px/mm

const A4_W_MM     = 210
const A4_H_MM     = 297

const MARGIN_MM   = 5
const GAP_MM      = 3
const USABLE_W_MM = A4_W_MM - MARGIN_MM * 2   // 200mm
const USABLE_H_MM = A4_H_MM - MARGIN_MM * 2   // 287mm

const CUT_LEN_MM  = 4
const CUT_GAP_MM  = 1

const A4_W_PX     = Math.round(A4_W_MM * MM_TO_PX)   // 2480
const A4_H_PX     = Math.round(A4_H_MM * MM_TO_PX)   // 3508

const mmPx = (mm: number) => Math.round(mm * MM_TO_PX)

const SHEETS_DIR = path.join(process.cwd(), '.next', 'print-sheets')


// ============================================================
// TYPES
// ============================================================

export interface PrintItem {
  orderItemId:    string
  designId:       string
  exportUrl:      string | null   // pre-rendered PNG on Cloudinary
  widthMm:        number
  heightMm:       number
  finish:         'glossy' | 'matte'
  sizeSlug:       string
  templateSlug:   string
  orderNumber:    string
}

interface PlacedItem extends PrintItem {
  xMm:         number
  yMm:         number
  sheetIndex:  number
}

interface Shelf {
  yMm:         number
  heightMm:    number
  nextXMm:     number
}

interface Sheet {
  index:       number
  finish:      'glossy' | 'matte'
  items:       PlacedItem[]
  shelves:     Shelf[]
  usedAreaMm2: number
  totalAreaMm2: number
}

export interface GenerateResult {
  sheets:        SheetResult[]
  totalSheets:   number
  itemsPlaced:   number
  areaSavedPct:  number
}

export interface SheetResult {
  sheetIndex:     number
  sheetDbId:      string
  sheetUrl:       string
  finish:         string
  itemCount:      number
  efficiency:     number
  placedItems:    { orderItemId: string; position: string }[]
}


// ============================================================
// STEP 1 — FETCH PENDING ITEMS (with export_url from designs)
// ============================================================

export async function fetchPendingItems(): Promise<PrintItem[]> {
  const rows = await sql`
    SELECT
      oi.id                    AS order_item_id,
      oi.design_id,
      COALESCE(d.export_url, oi.design_snapshot_url, d.thumbnail_url)
                               AS export_url,
      pf.slug                  AS finish,
      ps.slug                  AS size_slug,
      psc.item_width_mm        AS width_mm,
      psc.item_height_mm       AS height_mm,
      t.slug                   AS template_slug,
      o.order_number,
      oi.quantity
    FROM order_items oi
    JOIN orders        o   ON o.id   = oi.order_id
    JOIN print_finishes pf ON pf.id  = oi.print_finish_id
    JOIN print_sizes   ps  ON ps.id  = oi.print_size_id
    JOIN print_sheet_configs psc
      ON psc.print_size_id = oi.print_size_id
      AND psc.paper_size   = 'A4'
    LEFT JOIN designs  d   ON d.id   = oi.design_id
    LEFT JOIN templates t  ON t.id   = d.template_id
    WHERE oi.print_status = 'pending'
      AND oi.print_sheet_id IS NULL
      AND o.status IN ('confirmed', 'processing')
    ORDER BY pf.slug, oi.created_at ASC`

  const items: PrintItem[] = []
  for (const row of rows) {
    for (let q = 0; q < (row.quantity as number); q++) {
      items.push({
        orderItemId:  row.order_item_id as string,
        designId:     (row.design_id as string) || '',
        exportUrl:    (row.export_url as string) || null,
        widthMm:      Number(row.width_mm),
        heightMm:     Number(row.height_mm),
        finish:       row.finish as 'glossy' | 'matte',
        sizeSlug:     row.size_slug as string,
        templateSlug: (row.template_slug as string) ?? 'unknown',
        orderNumber:  row.order_number as string,
      })
    }
  }
  return items
}


// ============================================================
// STEP 2 — BIN PACKING (Shelf First Fit Decreasing)
// ============================================================

export function packIntoSheets(items: PrintItem[]): Sheet[] {
  if (items.length === 0) return []

  const byFinish = new Map<string, PrintItem[]>()
  for (const item of items) {
    const group = byFinish.get(item.finish) ?? []
    group.push(item)
    byFinish.set(item.finish, group)
  }

  const allSheets: Sheet[] = []
  let sheetIndex = 0

  for (const [finish, groupItems] of byFinish) {
    const sorted = [...groupItems].sort(
      (a, b) => (b.widthMm * b.heightMm) - (a.widthMm * a.heightMm)
    )

    const sheets: Sheet[] = []
    const newSheet = (): Sheet => ({
      index:        sheetIndex++,
      finish:       finish as 'glossy' | 'matte',
      items:        [],
      shelves:      [{ yMm: MARGIN_MM, heightMm: 0, nextXMm: MARGIN_MM }],
      usedAreaMm2:  0,
      totalAreaMm2: USABLE_W_MM * USABLE_H_MM,
    })

    sheets.push(newSheet())

    for (const item of sorted) {
      let placed = false
      for (const sheet of sheets) {
        const pos = findPosition(sheet, item)
        if (pos) { placeOnSheet(sheet, item, pos); placed = true; break }
      }
      if (!placed) {
        const sheet = newSheet()
        sheets.push(sheet)
        const pos = findPosition(sheet, item)
        if (pos) placeOnSheet(sheet, item, pos)
        else console.warn(`Item ${item.orderItemId} too large for A4 — skipped`)
      }
    }
    allSheets.push(...sheets)
  }
  return allSheets
}

function findPosition(sheet: Sheet, item: PrintItem): { xMm: number; yMm: number } | null {
  const iw = item.widthMm, ih = item.heightMm
  if (iw > USABLE_W_MM || ih > USABLE_H_MM) return null

  for (const shelf of sheet.shelves) {
    if (shelf.nextXMm + iw <= A4_W_MM - MARGIN_MM &&
        shelf.yMm + Math.max(shelf.heightMm, ih) <= A4_H_MM - MARGIN_MM) {
      return { xMm: shelf.nextXMm, yMm: shelf.yMm }
    }
  }

  const last = sheet.shelves[sheet.shelves.length - 1]
  const newY = last.yMm + last.heightMm + GAP_MM
  if (newY + ih <= A4_H_MM - MARGIN_MM) {
    sheet.shelves.push({ yMm: newY, heightMm: 0, nextXMm: MARGIN_MM })
    return { xMm: MARGIN_MM, yMm: newY }
  }
  return null
}

function placeOnSheet(sheet: Sheet, item: PrintItem, pos: { xMm: number; yMm: number }) {
  const shelf = sheet.shelves.find(s => s.yMm === pos.yMm)!
  const placed: PlacedItem = { ...item, xMm: pos.xMm, yMm: pos.yMm, sheetIndex: sheet.index }
  sheet.items.push(placed)
  sheet.usedAreaMm2 += item.widthMm * item.heightMm
  shelf.nextXMm = pos.xMm + item.widthMm + GAP_MM
  shelf.heightMm = Math.max(shelf.heightMm, item.heightMm)
}


// ============================================================
// STEP 3 — RENDER A4 SHEET (download pre-rendered PNGs + compose)
// ============================================================

export async function renderSheet(sheet: Sheet): Promise<Buffer> {
  const canvas = createCanvas(A4_W_PX, A4_H_PX)
  const ctx = canvas.getContext('2d')

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, A4_W_PX, A4_H_PX)

  // Printable area boundary (light dashed, for reference)
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)'
  ctx.lineWidth = 0.5
  ctx.setLineDash([mmPx(2), mmPx(2)])
  ctx.strokeRect(mmPx(MARGIN_MM), mmPx(MARGIN_MM), mmPx(USABLE_W_MM), mmPx(USABLE_H_MM))
  ctx.setLineDash([])

  // Draw each design at its position
  for (const item of sheet.items) {
    const x = mmPx(item.xMm)
    const y = mmPx(item.yMm)
    const w = mmPx(item.widthMm)
    const h = mmPx(item.heightMm)

    try {
      if (!item.exportUrl) throw new Error('No export URL')
      const img = await loadImage(item.exportUrl)
      ctx.drawImage(img, x, y, w, h)
    } catch (err) {
      // Placeholder — print shop will see this needs attention
      console.error(`Failed to load export for ${item.orderItemId}:`, err)
      ctx.fillStyle = '#F5F0E8'
      ctx.fillRect(x, y, w, h)
      ctx.fillStyle = '#B5A99E'
      ctx.font = `${mmPx(3.5)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('EXPORT MISSING', x + w / 2, y + h / 2 - mmPx(2))
      ctx.font = `${mmPx(2.5)}px sans-serif`
      ctx.fillText(item.orderItemId.slice(0, 8), x + w / 2, y + h / 2 + mmPx(3))
    }

    // Subtle border for cutting reference
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.lineWidth = 0.5
    ctx.strokeRect(x, y, w, h)

    // Cut marks at corners
    drawCutMarks(ctx, x, y, w, h)
  }

  // Footer info
  drawSheetFooter(ctx, sheet)

  return canvas.toBuffer('image/png')
}


// ============================================================
// STEP 4 — PERSIST TO DB (local file, no Cloudinary for sheets)
// ============================================================

async function persistSheet(sheet: Sheet, sheetUrl: string, configId: string): Promise<string> {
  const [dbSheet] = await sql`
    INSERT INTO print_sheets (
      print_finish_id, print_size_id, config_id, paper_size,
      capacity, items_count, is_full,
      sheet_url, sheet_dpi, sheet_width_px, sheet_height_px,
      status, generated_at
    )
    SELECT
      pf.id, ps.id, ${configId}, 'A4',
      ${sheet.items.length}, ${sheet.items.length}, TRUE,
      ${sheetUrl}, ${DPI}, ${A4_W_PX}, ${A4_H_PX},
      'generated', NOW()
    FROM print_finishes pf, print_sizes ps
    WHERE pf.slug = ${sheet.finish}
      AND ps.slug = ${sheet.items[0]?.sizeSlug ?? 'classic'}
    RETURNING id`

  for (let i = 0; i < sheet.items.length; i++) {
    const it = sheet.items[i]
    const col = Math.round((it.xMm - MARGIN_MM) / (it.widthMm + GAP_MM))
    const rowIdx = sheet.shelves.findIndex(s => s.yMm === it.yMm)
    await sql`
      INSERT INTO print_sheet_items (sheet_id, order_item_id, position, col, row, design_snapshot_url)
      VALUES (${dbSheet.id}, ${it.orderItemId}, ${i + 1}, ${col}, ${rowIdx}, ${it.exportUrl || 'pending'})`
  }

  const ids = sheet.items.map(i => i.orderItemId)
  await sql`
    UPDATE order_items SET print_status = 'assigned_to_sheet', print_sheet_id = ${dbSheet.id}, updated_at = NOW()
    WHERE id = ANY(${ids})`

  return dbSheet.id as string
}


// ============================================================
// MAIN ENTRY POINT
// ============================================================

export async function generatePrintSheets(
  finishFilter?: 'glossy' | 'matte'
): Promise<GenerateResult> {
  console.log('🖨️  Starting print sheet generation...')

  let items = await fetchPendingItems()
  if (finishFilter) items = items.filter(i => i.finish === finishFilter)

  if (items.length === 0) {
    return { sheets: [], totalSheets: 0, itemsPlaced: 0, areaSavedPct: 0 }
  }

  // Warn about items missing export URLs
  const missing = items.filter(i => !i.exportUrl)
  if (missing.length > 0) {
    console.warn(`⚠️  ${missing.length} items have no export_url — they will show placeholders`)
  }

  console.log(`📦 ${items.length} items to pack`)

  const sheets = packIntoSheets(items)
  console.log(`📄 Packed into ${sheets.length} sheets`)

  // Ensure output directory
  if (!fs.existsSync(SHEETS_DIR)) fs.mkdirSync(SHEETS_DIR, { recursive: true })

  const [configRow] = await sql`
    SELECT psc.id FROM print_sheet_configs psc WHERE psc.paper_size = 'A4' LIMIT 1`
  const configId = configRow?.id ?? ''

  const results: SheetResult[] = []

  for (const sheet of sheets) {
    console.log(`  Rendering sheet ${sheet.index + 1}/${sheets.length}...`)

    const buffer = await renderSheet(sheet)

    const filename = `sheet-${Date.now()}-${sheet.index}.png`
    const filepath = path.join(SHEETS_DIR, filename)
    fs.writeFileSync(filepath, buffer)

    const sheetUrl = `/api/admin/print-sheets/download/${filename}`
    const sheetDbId = await persistSheet(sheet, sheetUrl, configId)

    const efficiency = Number(((sheet.usedAreaMm2 / sheet.totalAreaMm2) * 100).toFixed(1))
    results.push({
      sheetIndex:  sheet.index,
      sheetDbId,
      sheetUrl,
      finish:      sheet.finish,
      itemCount:   sheet.items.length,
      efficiency,
      placedItems: sheet.items.map(it => ({
        orderItemId: it.orderItemId,
        position: `(${it.xMm.toFixed(1)}, ${it.yMm.toFixed(1)})mm`,
      })),
    })
    console.log(`  ✓ Sheet ${sheet.index + 1} saved → ${filename}`)
  }

  const areaSavedPct = items.length > 1
    ? Number((((items.length - sheets.length) / items.length) * 100).toFixed(1))
    : 0

  console.log(`✅ Done. ${sheets.length} sheets. Paper saved: ~${areaSavedPct}%`)
  return { sheets: results, totalSheets: sheets.length, itemsPlaced: items.length, areaSavedPct }
}


// ============================================================
// REGENERATE A SINGLE SHEET
// ============================================================

export async function regenerateSheet(sheetId: string): Promise<{ success: boolean; sheetUrl?: string }> {
  const sheetItems = await sql`
    SELECT
      psi.order_item_id,
      oi.design_id,
      COALESCE(d.export_url, oi.design_snapshot_url, d.thumbnail_url) AS export_url,
      ps.slug AS size_slug,
      pf.slug AS finish,
      psc.item_width_mm AS width_mm,
      psc.item_height_mm AS height_mm,
      t.slug AS template_slug,
      o.order_number
    FROM print_sheet_items psi
    JOIN order_items oi ON oi.id = psi.order_item_id
    JOIN orders o ON o.id = oi.order_id
    JOIN print_sizes ps ON ps.id = oi.print_size_id
    JOIN print_finishes pf ON pf.id = oi.print_finish_id
    JOIN print_sheet_configs psc ON psc.print_size_id = ps.id AND psc.paper_size = 'A4'
    LEFT JOIN designs d ON d.id = oi.design_id
    LEFT JOIN templates t ON t.id = d.template_id
    WHERE psi.sheet_id = ${sheetId}
    ORDER BY psi.position`

  if (sheetItems.length === 0) return { success: false }

  const items: PrintItem[] = sheetItems.map(row => ({
    orderItemId:  row.order_item_id as string,
    designId:     (row.design_id as string) || '',
    exportUrl:    (row.export_url as string) || null,
    widthMm:      Number(row.width_mm),
    heightMm:     Number(row.height_mm),
    finish:       row.finish as 'glossy' | 'matte',
    sizeSlug:     row.size_slug as string,
    templateSlug: (row.template_slug as string) ?? 'unknown',
    orderNumber:  row.order_number as string,
  }))

  const sheets = packIntoSheets(items)
  if (sheets.length === 0) return { success: false }

  if (!fs.existsSync(SHEETS_DIR)) fs.mkdirSync(SHEETS_DIR, { recursive: true })
  const buffer = await renderSheet(sheets[0])
  const filename = `sheet-${Date.now()}-regen.png`
  fs.writeFileSync(path.join(SHEETS_DIR, filename), buffer)

  const sheetUrl = `/api/admin/print-sheets/download/${filename}`
  await sql`
    UPDATE print_sheets SET sheet_url = ${sheetUrl}, generated_at = NOW(), updated_at = NOW()
    WHERE id = ${sheetId}`

  return { success: true, sheetUrl }
}


// ============================================================
// HELPERS
// ============================================================

function drawCutMarks(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const cl = mmPx(CUT_LEN_MM)
  const cg = mmPx(CUT_GAP_MM)

  ctx.strokeStyle = '#000000'
  ctx.lineWidth = Math.round(0.25 * MM_TO_PX)
  ctx.setLineDash([])

  const L = (cx: number, cy: number, hDir: 1 | -1, vDir: 1 | -1) => {
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + hDir * cl, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + vDir * cl); ctx.stroke()
  }

  L(x - cg, y - cg, -1, -1)
  L(x + w + cg, y - cg, 1, -1)
  L(x - cg, y + h + cg, -1, 1)
  L(x + w + cg, y + h + cg, 1, 1)
}

function drawSheetFooter(ctx: CanvasRenderingContext2D, sheet: Sheet) {
  const footerY = A4_H_PX - mmPx(MARGIN_MM) + mmPx(1.5)
  const fontSize = mmPx(2.5)
  ctx.fillStyle = '#9A8878'
  ctx.font = `${fontSize}px monospace`
  ctx.textAlign = 'left'

  const eff = ((sheet.usedAreaMm2 / sheet.totalAreaMm2) * 100).toFixed(1)
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  ctx.fillText(
    `POLAMUSE · Sheet ${String(sheet.index + 1).padStart(3, '0')} · ${sheet.items.length} items · ${sheet.finish.toUpperCase()} · Efficiency: ${eff}% · ${date}`,
    mmPx(MARGIN_MM), footerY
  )

  const orderNums = [...new Set(sheet.items.map(i => i.orderNumber))].join('  ')
  ctx.textAlign = 'right'
  ctx.fillText(`Orders: ${orderNums}`, A4_W_PX - mmPx(MARGIN_MM), footerY)
}
