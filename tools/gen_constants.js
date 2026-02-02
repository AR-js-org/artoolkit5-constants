import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url'; // Aggiungi questa importazione

// Recuperiamo i path dagli argomenti passati da CMake
const wasmModulePath = path.resolve(process.argv[2]);
const outputPath = path.resolve(process.argv[3]);

async function generate() {
    try {
        // Convertiamo il percorso assoluto di Windows in un URL file://
        const moduleUrl = pathToFileURL(wasmModulePath).href;

        // Usiamo l'URL per l'import dinamico
        const { default: ARToolKitModule } = await import(moduleUrl);
        const instance = await ARToolKitModule();

        // ... resto dello script invariato ...
        const allKeys = Object.keys(instance);
        const constants = allKeys.filter(key =>
            key.startsWith('AR_') && typeof instance[key] !== 'function'
        );

        let tsContent = `/**\n * GENERATED FILE - DO NOT EDIT\n * Generated on: ${new Date().toISOString()}\n */\n\n`;

        constants.forEach(key => {
            const value = instance[key];
            const type = typeof value === 'number' ? 'number' : 'any';
            tsContent += `export const ${key}: ${type} = ${JSON.stringify(value)};\n`;
        });

        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(outputPath, tsContent);

        console.log(`✅ TypeScript constants generated at: ${outputPath}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error generating constants:", error);
        process.exit(1);
    }
}

generate();