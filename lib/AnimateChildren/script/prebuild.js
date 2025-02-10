const fs = require('fs');
const path = require('path');

// Read all files in the src directory (modify this path as needed)
const placeholder = 'localhost:3000/docs';
const actualDocsLink = 'https://example.com/docs';

replacePlaceholderInFiles('./src');

function replacePlaceholderInFiles(dir) {
  fs
    .readdirSync(dir)
    .forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        replacePlaceholderInFiles(filePath); // Recurse for directories
      } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(placeholder)) {
          const updatedContent = content.replace(placeholder, actualDocsLink);
          fs.writeFileSync(filePath, updatedContent, 'utf8');
          console.log(`Updated: ${filePath}`);
        }
      }
    });
}
