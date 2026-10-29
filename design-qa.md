# English Lab capsule and glass design verification

Source visual truth: screenshots/liquid-glass/glass-target.png (1486 x 1058).
Implementation: screenshots/liquid-glass/glass-desktop.png (1440 x 1024, CSS viewport 1440 x 1024).
Full comparison: screenshots/liquid-glass/glass-comparison.png.
Focused comparison: screenshots/liquid-glass/glass-controls-comparison.png.
Additional captures: screenshots/liquid-glass/glass-mobile.png (390 x 844), screenshots/liquid-glass/glass-tablet.png (1024 x 768), screenshots/liquid-glass/glass-dark.png (1024 x 768).

## State and normalization

Desktop: light appearance, expanded sidebar, l1-01, rush definition preview open, details collapsed. The mock was resized to 1440 x 1024 for the combined comparison; its aspect ratio differs by less than 0.2 percent. The implementation capture is 1 image pixel per CSS pixel. The real progress is 50 percent, whereas the mock contains illustrative 25 percent. No test data was substituted for learning records.

## Findings and comparison history

1. First desktop capture showed the article column too narrow and smaller than the selected reference (P2). Increased the desktop type scale, widened the article column, and aligned heading/body offsets. Final desktop capture and combined comparison show the same sidebar/content/toolbar hierarchy and three-line first paragraph.
2. Blurred word preview produced a rectangular compositing halo and a duplicate hover tooltip (P1). Changed the text popover to an opaque, thick surface with a glass-like edge/shadow and suppressed the hover tooltip while a definition is open. The final capture has no rectangular halo or duplicate tooltip.
3. Mobile back/panel icons were squeezed by button padding (P2). Restored zero padding for mobile icon buttons and disabled SVG flex shrinking. The 390px capture confirms readable icons and a toolbar inside the viewport.
4. Left navigation and primary buttons now use the same full capsule radius. Focused controls comparison confirms semicircular ends for both. No actionable P0/P1/P2 findings remain for this selected scope.

## Required fidelity surfaces

- Typography: existing reading serif and system UI font preserved; desktop title/body emphasis aligned to reference. Mobile text scales down and reflows. The mock's exact font is not identified, so system font metrics remain a minor P3 difference.
- Layout: floating 260px sidebar, continuous paper surface, optional inspector hidden initially, capsule controls, and four-group reading toolbar. Original navigation entries and the full article remain available; they exceed the illustrative mock's content.
- Colors/materials: warm paper, pale blue selected capsule, blue primary action, separate navigation/control/panel tokens. Dark, reduced-transparency, higher-contrast, and unsupported-backdrop fallbacks implemented. The sidebar deliberately has a quieter background than the generated mock.
- Assets: existing product mark and icon system retained. No new photographs or illustrations are required by this reading screen. The visual reference is a design guide, not used as a flat screenshot in the application.
- Copy: original article, translations and learning functions retained. Actual saved status, vocabulary count and progress replace the mock's illustrative values.

## Interactions checked in the in-app browser

- Sidebar expand; reader remains associated with article library.
- Word lookup, saved status, more definitions expansion, Escape dismissal.
- Font settings open; increase to 105 percent and return to 100 percent.
- Paragraph translation visibly expands into Chinese text.
- Light/dark interface switching and responsive 390/1024/1440px layouts.
- No document horizontal overflow at 1024px; toolbar buttons remain within viewport.
- Browser error logs checked: none.

Validation: 228 unit tests passed, ESLint passed, production build passed. The standalone Playwright regression script was adapted to the new toolbar workflow but was not executed in this run; verification used the in-app browser. Actual iPad hardware and native Apple Liquid Glass rendering were not tested. This implementation uses web materials inspired by the selected reference.

## Follow-up polish

P3: system-font/icon metrics and the sidebar's neutral material differ slightly from the generated concept. Neither changes the requested capsule geometry or reading workflow.

final result: passed
