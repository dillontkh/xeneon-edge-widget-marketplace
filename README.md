# Corsair Xeneon Edge Widget Marketplace

A community-driven marketplace for Corsair Xeneon Edge iframe widgets.

## How it Works
This marketplace is a **read-only** view of the widgets stored in the `widgets/` directory of this repository. There is no central database or registry file; the website automatically discovers new widgets by scanning the folder structure at build time.

## Contributing a Widget
We welcome community contributions via Pull Requests!

### 1. Create your widget folder
Create a new directory under `widgets/` with a unique name (e.g., `widgets/my-widget/`).

### 2. Add the required files
Every widget folder **must** contain exactly these 3 files:
1. `widget.html`: Your standalone web app (contained in a single pair of `<html>` tags).
2. `thumbnail.png`: A screenshot or preview image of your widget.
3. `metadata.json`: Information about your widget.

#### metadata.json Schema:
```json
{
  "publisher": "Your Name or GitHub Username",
  "widget-name": "The Display Title",
  "description": "A short description of what your widget does."
}
```

### 3. Submit a PR
Push your changes to a branch and open a Pull Request. Once merged, your widget will automatically appear on the marketplace!

---

## Local Development
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. View at `http://localhost:5173`
