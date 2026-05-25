-- ============================================================
-- SYNC template_print_mapping with updated print_sheet_configs
-- Run AFTER the print_sheet_configs updates
-- ============================================================

-- Sync items_per_sheet from print_sheet_configs into template_print_mapping
UPDATE template_print_mapping tpm
SET items_per_sheet = psc.items_per_sheet,
    updated_at = NOW()
FROM print_sheet_configs psc
WHERE psc.print_size_id = tpm.print_size_id
  AND psc.paper_size = 'A4'
  AND tpm.items_per_sheet != psc.items_per_sheet;

-- Concert ticket: switch from 5x7 to concert size
UPDATE template_print_mapping
SET print_size_id = (SELECT id FROM print_sizes WHERE slug = 'concert'),
    items_per_sheet = 4,
    updated_at = NOW()
WHERE template_id = 'concert-ticket'
  AND print_size_id = (SELECT id FROM print_sizes WHERE slug = '5x7');

-- Verify
SELECT tpm.template_id, tpm.template_name, ps.slug as size_slug, ps.name as size_name,
       tpm.items_per_sheet, psc.items_per_sheet as config_per_sheet
FROM template_print_mapping tpm
JOIN print_sizes ps ON ps.id = tpm.print_size_id
LEFT JOIN print_sheet_configs psc ON psc.print_size_id = tpm.print_size_id AND psc.paper_size = 'A4'
ORDER BY tpm.template_name;
