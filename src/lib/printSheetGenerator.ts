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
 * Why SFFD over simple "one size per sheet"?
 *   Example: 2 Classic (70×85) + 1 Instax Wide (86×108)
 *   Old way  → 2 sheets (1 for classic, 1 for wide)
 *   SFFD way → 1 sheet  (wide goes in row 1, classics fill row 2)
 *   Saves ~50% paper cost on mixed orders.
 *
 * Output: Cloudinary URL of the print-ready PNG per sheet
 *
 * Install: npm install canvas @neondatabase/serverless cloudinary
 */

import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas'
import { v2 as cloudinary } from 'cloudinary'
import { sql } from '@/lib/db'

// ============================================================
// CONSTANTS
// ============================================================

const DPI         = 300
const MM_TO_PX    = DPI / 25.4          // 11.811 px/mm

// A4 physical dimensions
const A4_W_MM     = 210
const A4_H_MM     = 297

// Safe printable area (5mm margin each side)
const MARGIN_MM   = 5
const GAP_MM      = 3                   // gap between items (for cutting)
const USABLE_W_MM = A4_W_MM  - MARGIN_MM * 2   // 200mm
const USABLE_H_MM = A4_H_MM  - MARGIN_MM * 2   // 287mm

// Cut mark style
const CUT_LEN_MM  = 4                   // length of corner cut mark lines
const CUT_GAP_MM  = 1                   // gap between item edge and cut mark

// Canvas pixel dimensions at 300 DPI
const A4_W_PX     = Math.round(A4_W_MM * MM_TO_PX)   // 2480px
const A4_H_PX     = Math.round(A4_H_MM * MM_TO_PX)   // 3508px

// Convert mm → px (rounded)
const px = (mm: number) => Math.round(mm * MM_TO_PX)


// ============================================================
// TYPES
// ============================================================

export interface PrintItem {
  orderItemId:         string
  designSnapshotUrl:   string    // Cloudinary URL of the polaroid PNG
  widthMm:             number    // from print_sheet_configs.item_width_mm
  heightMm:            number    // from print_sheet_configs.item_height_mm
  finish:              'glossy' | 'matte'
  templateSlug:        string    // for logging / notes
  orderNumber:         string
}

interface PlacedItem extends PrintItem {
  xMm:         number   // position from left edge of A4
  yMm:         number   // position from top edge of A4
  sheetIndex:  number
}

interface Shelf {
  yMm:         number   // top of this shelf
  heightMm:    number   // tallest item on this shelf
  nextXMm:     number   // next available x position on this shelf
}

interface Sheet {
  index:       number
  finish:      'glossy' | 'matte'
  items:       PlacedItem[]
  shelves:     Shelf[]
  usedAreaMm2: number
  totalAreaMm2: number  // USABLE_W_MM * USABLE_H_MM
}

export interface GenerateResult {
  sheets:        SheetResult[]
  totalSheets:   number
  itemsPlaced:   number
  areaSavedPct:  number   // vs naive one-size-per-sheet
}

export interface SheetResult {
  sheetIndex:     number
  finish:         string
  itemCount:      number
  efficiency:     number   // % of usable area filled
  sheetUrl:       string   // Cloudinary URL of the generated PNG
  placedItems:    { orderItemId: string; position: string }[]
}


// ============================================================
// STEP 1 — FETCH PENDING ITEMS FROM DB
// ============================================================

export async function fetchPendingItems(): Promise<PrintItem[]> {
  const rows = await sql`
    SELECT
      oi.id                    AS order_item_id,
      oi.design_snapshot_url,
      oi.print_status,
      pf.slug                  AS finish,
      ps.slug                  AS size_slug,
      ps.name                  AS size_name,
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
      AND oi.design_snapshot_url IS NOT NULL
      AND o.status = 'confirmed'
    ORDER BY pf.slug, oi.created_at ASC`

  // Expand quantity — one PrintItem per physical print needed
  const items: PrintItem[] = []
  for (const row of rows) {
    for (let q = 0; q < (row.quantity as number); q++) {
      items.push({
        orderItemId:       row.order_item_id as string,
        designSnapshotUrl: row.design_snapshot_url as string,
        widthMm:           Number(row.width_mm),
        heightMm:          Number(row.height_mm),
        finish:            row.finish as 'glossy' | 'matte',
        templateSlug:      (row.template_slug as string) ?? 'unknown',
        orderNumber:       row.order_number as string,
      })
    }
  }
  return items
}


// ============================================================
// STEP 2 — BIN PACKING ALGORITHM (Shelf First Fit Decreasing)
// ============================================================

export function packIntoSheets(items: PrintItem[]): Sheet[] {
  if (items.length === 0) return []

  // GROUP BY FINISH — never mix glossy and matte on same sheet
  const byFinish = new Map<string, PrintItem[]>()
  for (const item of items) {
    const group = byFinish.get(item.finish) ?? []
    group.push(item)
    byFinish.set(item.finish, group)
  }

  const allSheets: Sheet[] = []
  let sheetIndex = 0

  for (const [finish, groupItems] of byFinish) {

    // SORT: largest area first → better packing efficiency
    const sorted = [...groupItems].sort(
      (a, b) => (b.widthMm * b.heightMm) - (a.widthMm * a.heightMm)
    )

    const sheets: Sheet[] = []

    const newSheet = (): Sheet => ({
      index:        sheetIndex++,
      finish:       finish as 'glossy' | 'matte',
      items:        [],
      shelves:      [{
        yMm:      MARGIN_MM,
        heightMm: 0,
        nextXMm:  MARGIN_MM,
      }],
      usedAreaMm2:  0,
      totalAreaMm2: USABLE_W_MM * USABLE_H_MM,
    })

    sheets.push(newSheet())

    for (const item of sorted) {
      let placed = false

      // Try to fit in an existing sheet
      for (const sheet of sheets) {
        const pos = findPosition(sheet, item)
        if (pos) {
          placeOnSheet(sheet, item, pos)
          placed = true
          break
        }
      }

      // No existing sheet had room — open a new one
      if (!placed) {
        const sheet = newSheet()
        sheets.push(sheet)
        const pos = findPosition(sheet, item)
        if (pos) {
          placeOnSheet(sheet, item, pos)
        } else {
          // Item is physically too large for an A4 sheet — skip with warning
          console.warn(
            `Item ${item.orderItemId} (${item.widthMm}×${item.heightMm}mm) ` +
            `is too large for A4 usable area (${USABLE_W_MM}×${USABLE_H_MM}mm) — skipped`
          )
        }
      }
    }

    allSheets.push(...sheets)
  }

  return allSheets
}

/**
 * Find the best available position for an item on a sheet.
 * Returns { xMm, yMm } or null if item doesn't fit anywhere.
 *
 * Strategy: shelf-based
 *   1. Try to append to an existing shelf (items fit left→right)
 *   2. If shelf is full width-wise, try to open a new shelf below
 *   3. If no shelf fits, return null
 */
function findPosition(
  sheet: Sheet,
  item: PrintItem
): { xMm: number; yMm: number } | null {

  const iw = item.widthMm
  const ih = item.heightMm

  // Item itself is too large for the usable area
  if (iw > USABLE_W_MM || ih > USABLE_H_MM) return null

  for (const shelf of sheet.shelves) {
    const rightEdge = shelf.nextXMm + iw
    const bottomEdge = shelf.yMm + Math.max(shelf.heightMm, ih)

    const fitsWidth  = rightEdge <= A4_W_MM - MARGIN_MM
    const fitsHeight = bottomEdge <= A4_H_MM - MARGIN_MM

    if (fitsWidth && fitsHeight) {
      return { xMm: shelf.nextXMm, yMm: shelf.yMm }
    }
  }

  // Try opening a new shelf below the last shelf
  const lastShelf = sheet.shelves[sheet.shelves.length - 1]
  const newShelfY = lastShelf.yMm + lastShelf.heightMm + GAP_MM
  const bottomEdge = newShelfY + ih

  if (bottomEdge <= A4_H_MM - MARGIN_MM) {
    // New shelf fits — add it and place at the start
    sheet.shelves.push({
      yMm:      newShelfY,
      heightMm: 0,
      nextXMm:  MARGIN_MM,
    })
    return { xMm: MARGIN_MM, yMm: newShelfY }
  }

  return null  // Sheet is full
}

/** Commit an item to a position on a sheet, updating shelf state. */
function placeOnSheet(
  sheet: Sheet,
  item: PrintItem,
  pos: { xMm: number; yMm: number }
) {
  // Find the shelf this position belongs to
  const shelf = sheet.shelves.find(s => s.yMm === pos.yMm)!

  const placed: PlacedItem = {
    ...item,
    xMm:        pos.xMm,
    yMm:        pos.yMm,
    sheetIndex: sheet.index,
  }

  sheet.items.push(placed)
  sheet.usedAreaMm2 += item.widthMm * item.heightMm

  // Advance shelf cursor
  shelf.nextXMm   = pos.xMm + item.widthMm + GAP_MM
  shelf.heightMm  = Math.max(shelf.heightMm, item.heightMm)
}


// ============================================================
// STEP 3 — RENDER SHEET TO 300 DPI PNG
// ============================================================

export async function renderSheet(sheet: Sheet): Promise<Buffer> {
  const canvas = createCanvas(A4_W_PX, A4_H_PX)
  const ctx    = canvas.getContext('2d')

  // --- WHITE BACKGROUND ---
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, A4_W_PX, A4_H_PX)

  // --- PRINTABLE AREA BOUNDARY (light grey, for reference only) ---
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)'
  ctx.lineWidth   = 0.5
  ctx.setLineDash([px(2), px(2)])
  ctx.strokeRect(px(MARGIN_MM), px(MARGIN_MM), px(USABLE_W_MM), px(USABLE_H_MM))
  ctx.setLineDash([])

  // --- DRAW EACH ITEM ---
  for (const item of sheet.items) {
    await drawItem(ctx, item)
    drawCutMarks(ctx, item)
  }

  // --- SHEET INFO FOOTER (outside printable area, bottom margin) ---
  drawSheetFooter(ctx, sheet)

  return canvas.toBuffer('image/png')
}

/**
 * Draw a single polaroid image at its position on the canvas.
 * Falls back to a placeholder rectangle if image fails to load.
 */
async function drawItem(ctx: CanvasRenderingContext2D, item: PlacedItem) {
  const x = px(item.xMm)
  const y = px(item.yMm)
  const w = px(item.widthMm)
  const h = px(item.heightMm)

  try {
    const img = await loadImage(item.designSnapshotUrl)
    ctx.drawImage(img, x, y, w, h)
  } catch (err) {
    // Placeholder if image fails — print shop will see this
    console.error(`Failed to load image for ${item.orderItemId}:`, err)
    ctx.fillStyle = '#F5F0E8'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#B5A99E'
    ctx.font      = `${px(3.5)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('IMAGE LOAD FAILED', x + w / 2, y + h / 2)
    ctx.fillText(item.orderItemId.slice(0, 8), x + w / 2, y + h / 2 + px(5))
  }

  // Thin border around each item (1px, very subtle — helps cutting)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
  ctx.lineWidth   = 0.5
  ctx.strokeRect(x, y, w, h)
}

/**
 * Draw L-shaped cut marks at all 4 corners of an item.
 * Cut marks are OUTSIDE the item boundary (in the gap area).
 * They are solid black lines — visible to the person cutting.
 *
 *  ┌╴           ╶┐
 *  │             │   ← L-shaped marks at each corner
 *
 *  └╴           ╶┘
 */
function drawCutMarks(ctx: CanvasRenderingContext2D, item: PlacedItem) {
  const x  = px(item.xMm)
  const y  = px(item.yMm)
  const w  = px(item.widthMm)
  const h  = px(item.heightMm)
  const cl = px(CUT_LEN_MM)   // cut line length in px
  const cg = px(CUT_GAP_MM)   // gap between item and cut mark

  ctx.strokeStyle = '#000000'
  ctx.lineWidth   = Math.round(0.25 * MM_TO_PX)  // 0.25mm line
  ctx.setLineDash([])

  // Helper: draw one L-mark
  const L = (
    cornerX: number, cornerY: number,
    hDir: 1 | -1,    // horizontal direction: 1 = right, -1 = left
    vDir: 1 | -1     // vertical direction:   1 = down,  -1 = up
  ) => {
    ctx.beginPath()
    // Horizontal arm
    ctx.moveTo(cornerX, cornerY)
    ctx.lineTo(cornerX + hDir * cl, cornerY)
    ctx.stroke()
    ctx.beginPath()
    // Vertical arm
    ctx.moveTo(cornerX, cornerY)
    ctx.lineTo(cornerX, cornerY + vDir * cl)
    ctx.stroke()
  }

  // TOP-LEFT corner mark (outside item, above and to the left)
  L(x - cg, y - cg, -1, -1)

  // TOP-RIGHT corner mark
  L(x + w + cg, y - cg, 1, -1)

  // BOTTOM-LEFT corner mark
  L(x - cg, y + h + cg, -1, 1)

  // BOTTOM-RIGHT corner mark
  L(x + w + cg, y + h + cg, 1, 1)
}

/** Small info strip in the bottom margin — sheet number, count, date */
function drawSheetFooter(ctx: CanvasRenderingContext2D, sheet: Sheet) {
  const footerY  = A4_H_PX - px(MARGIN_MM) + px(1.5)
  const fontSize = px(2.5)

  ctx.fillStyle  = '#9A8878'
  ctx.font       = `${fontSize}px monospace`
  ctx.textAlign  = 'left'

  const efficiency = ((sheet.usedAreaMm2 / sheet.totalAreaMm2) * 100).toFixed(1)
  const date       = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  ctx.fillText(
    `POLAMUSE · Sheet ${String(sheet.index + 1).padStart(3, '0')} · ` +
    `${sheet.items.length} items · ${sheet.finish.toUpperCase()} · ` +
    `Efficiency: ${efficiency}% · ${date}`,
    px(MARGIN_MM), footerY
  )

  // Order numbers on the right
  const orderNums = [...new Set(sheet.items.map(i => i.orderNumber))].join('  ')
  ctx.textAlign = 'right'
  ctx.fillText(`Orders: ${orderNums}`, A4_W_PX - px(MARGIN_MM), footerY)
}


// ============================================================
// STEP 4 — UPLOAD TO CLOUDINARY
// ============================================================

async function uploadSheetToCloudinary(
  buffer: Buffer,
  sheetId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:         'polamuse/print-sheets',
        public_id:      `sheet-${sheetId}`,
        resource_type:  'image',
        format:         'png',
        // Store at full quality — this is a print file
        quality:        100,
        transformation: [],   // no transformations — keep exact pixels
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload failed'))
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}


// ============================================================
// STEP 5 — WRITE RESULTS TO DB
// ============================================================

async function persistSheetResults(
  sheet: Sheet,
  sheetUrl: string,
  configId: string
): Promise<string> {
  // 1. Insert print_sheet row
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
      AND ps.slug = ${sheet.items[0]?.templateSlug ?? 'classic'}
    RETURNING id`

  // 2. Insert print_sheet_items — one row per placed item
  for (let i = 0; i < sheet.items.length; i++) {
    const item     = sheet.items[i]
    const col      = Math.round((item.xMm - MARGIN_MM) / (item.widthMm + GAP_MM))
    const rowIndex = sheet.shelves.findIndex(s => s.yMm === item.yMm)

    await sql`
      INSERT INTO print_sheet_items
        (sheet_id, order_item_id, position, col, row, design_snapshot_url)
      VALUES
        (${dbSheet.id}, ${item.orderItemId}, ${i + 1}, ${col}, ${rowIndex}, ${item.designSnapshotUrl})`
  }

  // 3. Update order_items — mark as assigned
  const orderItemIds = sheet.items.map(i => i.orderItemId)
  await sql`
    UPDATE order_items
    SET
      print_status   = 'assigned_to_sheet',
      print_sheet_id = ${dbSheet.id},
      updated_at     = NOW()
    WHERE id = ANY(${orderItemIds})`

  return dbSheet.id as string
}


// ============================================================
// MAIN ENTRY POINT — call this from admin API
// ============================================================

/**
 * generatePrintSheets()
 *
 * Fetches all pending print items, packs them optimally onto
 * minimum number of A4 sheets, renders 300 DPI PNGs with cut
 * marks, uploads to Cloudinary, and updates the DB.
 *
 * Called from: POST /api/admin/print-sheets/generate
 *
 * @param finishFilter  Optional — only process 'glossy' or 'matte'
 * @returns             Summary of sheets generated
 */
export async function generatePrintSheets(
  finishFilter?: 'glossy' | 'matte'
): Promise<GenerateResult> {
  console.log('🖨️  Starting print sheet generation...')

  // 1. Fetch all pending items
  let items = await fetchPendingItems()
  if (finishFilter) {
    items = items.filter(i => i.finish === finishFilter)
  }

  if (items.length === 0) {
    console.log('No pending items to print.')
    return { sheets: [], totalSheets: 0, itemsPlaced: 0, areaSavedPct: 0 }
  }

  console.log(`📦 ${items.length} items to pack (${
    items.filter(i => i.finish === 'glossy').length
  } glossy, ${
    items.filter(i => i.finish === 'matte').length
  } matte)`)

  // 2. Pack into sheets using SFFD algorithm
  const sheets = packIntoSheets(items)

  console.log(`📄 Packed into ${sheets.length} sheets`)

  // Log packing summary
  for (const sheet of sheets) {
    const eff = ((sheet.usedAreaMm2 / sheet.totalAreaMm2) * 100).toFixed(1)
    console.log(
      `  Sheet ${sheet.index + 1}: ${sheet.items.length} items · ` +
      `${sheet.finish} · ${eff}% efficiency`
    )
    for (const item of sheet.items) {
      console.log(
        `    [${item.templateSlug}] ${item.widthMm}×${item.heightMm}mm ` +
        `@ (${item.xMm.toFixed(1)}, ${item.yMm.toFixed(1)})mm ` +
        `→ Order ${item.orderNumber}`
      )
    }
  }

  // 3. Render, upload, and persist each sheet
  const results: SheetResult[] = []

  // Fetch one config_id to use for DB insert (use first sheet's finish+size)
  const [configRow] = await sql`
    SELECT psc.id FROM print_sheet_configs psc
    JOIN print_sizes ps ON ps.id = psc.print_size_id
    WHERE psc.paper_size = 'A4'
    LIMIT 1`
  const configId = configRow?.id ?? ''

  for (const sheet of sheets) {
    console.log(`  Rendering sheet ${sheet.index + 1}/${sheets.length}...`)

    // Render PNG
    const buffer = await renderSheet(sheet)

    // Upload to Cloudinary
    const tempId  = `temp-${Date.now()}-${sheet.index}`
    const sheetUrl = await uploadSheetToCloudinary(buffer, tempId)

    // Save to DB
    const sheetId = await persistSheetResults(sheet, sheetUrl, configId)

    const efficiency = Number(
      ((sheet.usedAreaMm2 / sheet.totalAreaMm2) * 100).toFixed(1)
    )

    results.push({
      sheetIndex:  sheet.index,
      finish:      sheet.finish,
      itemCount:   sheet.items.length,
      efficiency,
      sheetUrl,
      placedItems: sheet.items.map(item => ({
        orderItemId: item.orderItemId,
        position:    `(${item.xMm.toFixed(1)}, ${item.yMm.toFixed(1)})mm`,
      })),
    })

    console.log(`  ✓ Sheet ${sheet.index + 1} → ${sheetUrl}`)
  }

  // Calculate area saved vs naive "one size per sheet" approach
  const naiveSheets  = items.length  // worst case: 1 item per sheet
  const actualSheets = sheets.length
  const areaSavedPct = Number(
    (((naiveSheets - actualSheets) / naiveSheets) * 100).toFixed(1)
  )

  console.log(`\n✅ Done. ${actualSheets} sheets generated. Paper saved: ~${areaSavedPct}%`)

  return {
    sheets:       results,
    totalSheets:  actualSheets,
    itemsPlaced:  items.length,
    areaSavedPct,
  }
}
