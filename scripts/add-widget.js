import fs from 'fs';
import path from 'path';

function addWidget(folderName, title, description, publisher, html) {
  const widgetDir = path.join('widgets', folderName);

  if (!fs.existsSync(widgetDir)) {
    fs.mkdirSync(widgetDir, { recursive: true });
  }

  // Write HTML file
  fs.writeFileSync(path.join(widgetDir, 'widget.html'), html);

  // Write metadata.json
  const metadata = {
    publisher,
    "widget-name": title,
    description
  };
  fs.writeFileSync(path.join(widgetDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

  // Create empty thumbnail placeholder
  fs.writeFileSync(path.join(widgetDir, 'thumbnail.png'), '');

  console.log(`Successfully created widget folder: ${widgetDir}`);
  console.log(`Don't forget to replace thumbnail.png with a real screenshot!`);
}

const [,, folderName, title, description, publisher, html] = process.argv;

if (!folderName || !title || !description || !publisher || !html) {
  console.log('Usage: node scripts/add-widget.js <folder-name> <title> <description> <publisher> <html>');
  process.exit(1);
}

addWidget(folderName, title, description, publisher, html);
