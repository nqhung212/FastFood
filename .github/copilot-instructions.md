<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Project snapshot: TestJS (single-page JS/HTML demo)

This repository is a minimal single-file web demo. The primary source to read and edit is `quanlybanhang.html` at the repo root. The project contains no build system, package.json, or test harness — edits are intended to be simple HTML/CSS/JS changes that run in a browser.

What an AI agent must know to be productive

- Single entry point: `quanlybanhang.html`. All UI, data handling, and scripts are expected to be inside this file. Search and modify this file for feature changes, bug fixes, or UI updates.
- No server-side code: there are no backend services, so assume all data is ephemeral and stored only in-memory or in the DOM unless you are explicitly instructed to add persistence.
- No build/test tooling: changes should be conservative and self-contained. When adding new files (JS/CSS), update `quanlybanhang.html` to reference them with relative paths.

Project-specific patterns and examples

- Inline script usage: the repository places JavaScript directly in the HTML (see the `<script>` block in `quanlybanhang.html`). Keep logic modular inside named functions and avoid anonymous global code where possible.
- DOM-driven data: look for id-based selectors and table/grid markup to understand data flow. When adding new UI elements, follow the existing id/class naming style used in `quanlybanhang.html`.
- Minimal dependency surface: do not introduce external CDNs or packages without request. If a dependency is required, add a short note explaining why and update the README (or create one) describing the new workflow.

Developer workflows (what to run locally)

- Open `quanlybanhang.html` directly in a browser for quick testing. On Windows, double-click the file or use a local static server (e.g., `python -m http.server` in the repo root) if you need fetch/XHR to work.

When editing

- Small UI/JS fixes: edit `quanlybanhang.html` directly. Keep scripts in the `<script>` tag unless the change is large — then create `js/` and `css/` folders and reference those files from the HTML.
- Adding features: prefer adding modular functions and attaching event listeners to elements by id. For state, prefer a single top-level object to avoid scattering globals.
- Backwards compatibility: preserve existing element ids, table structure, and form field names unless you update all references in the file.

Quality and safety constraints for automated edits

- Avoid removing or renaming HTML ids/inputs without updating all references in the file.
- Do not add network calls, analytics, or telemetry without explicit instructions.
- Keep edits minimal and focused: a single PR should change one feature/bugfix. If multiple files are added, include a short README update.

Files to inspect for context

- `quanlybanhang.html` — primary file with UI and scripts.

If you need more context

- Ask the repository owner whether they want to migrate JS into modules and whether to add tooling (npm, bundlers). For larger refactors, request permission first.

Ready for review

If any section is unclear or you'd like more examples from the code, tell me which part of `quanlybanhang.html` you'd like summarized and I'll extract inline examples.
