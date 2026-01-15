const fs = require('fs');
const path = require('path');

// Patterns to replace for dark mode support
const replacements = [
    // Main page wrappers - specific patterns first
    { from: /min-h-screen bg-gray-50 py/g, to: 'min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 py' },
    { from: /min-h-screen bg-gray-50 flex/g, to: 'min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 flex' },
    { from: /className="min-h-screen bg-gray-50"/g, to: 'className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200"' },
    { from: /bg-gray-50 py-8">/g, to: 'bg-background-light dark:bg-dark-bg transition-colors duration-200 py-8">' },
    { from: /className="bg-gray-50 py/g, to: 'className="bg-background-light dark:bg-dark-bg transition-colors duration-200 py' },
    { from: /className="bg-gray-50"/g, to: 'className="bg-background-light dark:bg-dark-bg transition-colors duration-200"' },

    // Headers and breadcrumbs
    { from: /className="bg-white border-b"/g, to: 'className="bg-white dark:bg-dark-card border-b dark:border-dark-border transition-colors"' },

    // Content boxes
    { from: /className="bg-white rounded-lg shadow-sm p-/g, to: 'className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-' },
    { from: /className="bg-white rounded-lg p-/g, to: 'className="bg-white dark:bg-dark-card rounded-lg dark:border dark:border-dark-border transition-colors p-' },
    { from: /className="bg-white rounded-lg shadow-sm overflow-hidden"/g, to: 'className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border overflow-hidden transition-colors"' },
    { from: /className="bg-white rounded-lg overflow-hidden shadow-sm/g, to: 'className="bg-white dark:bg-dark-card rounded-lg overflow-hidden shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors' },
    { from: /className="bg-white rounded-xl shadow-sm/g, to: 'className="bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors' },
    { from: /className="bg-white rounded-2xl shadow-lg p-/g, to: 'className="bg-white dark:bg-dark-card rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-dark-border transition-colors p-' },
    { from: /className="bg-white rounded-3xl shadow-2xl/g, to: 'className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl dark:shadow-none dark:border dark:border-dark-border transition-colors' },

    // Text colors
    { from: /text-gray-900"/g, to: 'text-gray-900 dark:text-gray-100"' },
    { from: /text-gray-800"/g, to: 'text-gray-800 dark:text-gray-200"' },
    { from: /text-gray-700"/g, to: 'text-gray-700 dark:text-gray-300"' },
    { from: /text-gray-600"/g, to: 'text-gray-600 dark:text-gray-400"' },
    { from: /text-gray-500"/g, to: 'text-gray-500 dark:text-gray-400"' },

    // Borders
    { from: /border-gray-200"/g, to: 'border-gray-200 dark:border-dark-border"' },
    { from: /border-gray-300"/g, to: 'border-gray-300 dark:border-dark-border"' },

    // Inner boxes (bg-gray-50 inside content)
    { from: /className="p-4 bg-gray-50 rounded/g, to: 'className="p-4 bg-gray-50 dark:bg-dark-border/50 rounded' },
    { from: /className="bg-gray-50 p-/g, to: 'className="bg-gray-50 dark:bg-dark-border/50 p-' },
    { from: /className="bg-gray-100 rounded/g, to: 'className="bg-gray-100 dark:bg-dark-border rounded' },

    // Hover states
    { from: /hover:bg-gray-50"/g, to: 'hover:bg-gray-50 dark:hover:bg-dark-border"' },
    { from: /hover:bg-gray-100"/g, to: 'hover:bg-gray-100 dark:hover:bg-dark-border"' },

    // Additional patterns for remaining files
    { from: /className="bg-white rounded-lg shadow-sm">/g, to: 'className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors">' },
    { from: /className="bg-white shadow-sm rounded-lg/g, to: 'className="bg-white dark:bg-dark-card shadow-sm dark:shadow-none dark:border dark:border-dark-border rounded-lg transition-colors' },
    { from: /className="bg-white rounded-lg"/g, to: 'className="bg-white dark:bg-dark-card rounded-lg dark:border dark:border-dark-border transition-colors"' },
    { from: /className="bg-white"/g, to: 'className="bg-white dark:bg-dark-card transition-colors"' },
];

function findPageFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip node_modules and .next
            if (item !== 'node_modules' && item !== '.next' && item !== 'api') {
                files.push(...findPageFiles(fullPath));
            }
        } else if (item === 'page.tsx' || item === 'loading.tsx' || item === 'not-found.tsx' || item === 'error.tsx') {
            files.push(fullPath);
        }
    }

    return files;
}

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    for (const { from, to } of replacements) {
        const newContent = content.replace(from, to);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated: ${filePath}`);
        return true;
    }
    return false;
}

// Run
const appDir = path.join(__dirname, 'app');
const files = findPageFiles(appDir);
let updatedCount = 0;

console.log(`Found ${files.length} page files`);

for (const file of files) {
    if (updateFile(file)) {
        updatedCount++;
    }
}

console.log(`\nUpdated ${updatedCount} files`);
