# Functional verification — 2026-10-30

The final build passed 69 real-Chrome functional checks, two mobile-layout checks at 390 px, and all 11 Node regression suites. No uncaught page errors were observed during the combined browser run.

## Browser coverage

| Group | Checks | Verified behavior |
| --- | ---: | --- |
| Core local workflows | 20 | Billing totals, price memory, draft restoration and spreadsheet export; Chinese TXT/DOCX import and PDF output; spreadsheet import and SUM; PDF text/workbook conversion; 13 distinct template layouts and paper-size export; amount handling; complete barcode text; document differences; missing ID-card validation. |
| Document and image workflows | 14 | XLSX formula/value export and error handling; DOCX bold/table/image preservation; multi-image PDF; PDF-to-PPT files and editor preview; PPT image export; PDF images entering the scanner queue; seal/signature transparency; images inserted into Word; absent-key billing OCR; two-sided ID-card export; a real colorful image inside a rendered PPTX. |
| Billing, print preparation and service adapters | 13 | Actual PNG/PDF billing output; invoice, Word and template print preparation; tabular paste; CSV escaping; simulated AI connection, OCR, conversion, contract success/failure; speech text/language passed to the browser API. |
| Presentations and watermarks | 13 | Real two-page wide PPTX, portrait PPTX and legacy binary PPT preview/export; source graphics; cancellation and malformed files; PDF watermark retaining original text and page geometry; visible selected color; real PNG watermark with original dimensions. |
| Vector output and template transitions | 9 | Exported QR SVG independently decoded to the original URL, mixed Chinese/digits and emoji text; full Code128 SVG; invalid-input clearing; safe vector watermark parameters; music/guitar back to handwriting; all 169 directed template-switch combinations; composition grid reaching the lower printable area. |

QR validation used an independent jsQR 1.4.0 decoder against rasterizations of the actual exported SVG, rather than checking only whether a file existed. DOCX and PPTX exports were opened as ZIP packages and inspected for their text, tables, styles and media. PDF output was parsed and rendered again for geometry and content checks.

## Repeating the local regression suites

Run every `tests/*regression.cjs` file with Node.js. The suites cover core geometry, formulas, AI errors, PDF render ordering, presentation limits and output, scan export, SVG, template switching/layouts, Unicode PDF rendering and watermarks.

## Practical limits

- AI service calls were simulated; no real API credential or paid request was used.
- Print content and page settings were checked; no physical printer was used. Speech API parameters were checked without verifying speaker audio.
- Browser testing used Chrome on Windows, including a mobile-sized viewport; this is not physical-iPhone or every-browser certification.
- Presentation and Unicode text PDFs use rendered page images; their text is not searchable. PDF watermarks preserve the original page content underneath their overlay.
- Complex presentation objects and advanced Office formatting can differ from desktop Office. Review the preview and the supported scope in the README before relying on a conversion.
