import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Recuperiamo i path dagli argomenti passati da CMake
const wasmModulePath = path.resolve(process.argv[2]);
const outputPath = path.resolve(process.argv[3]);

async function generate() {
    try {
        const moduleUrl = pathToFileURL(wasmModulePath).href;
        const { default: ARToolKitModule } = await import(moduleUrl);
        const instance = await ARToolKitModule();

        let tsContent = `/**\n * GENERATED FILE - DO NOT EDIT\n * Generated on: ${new Date().toISOString()}\n */\n\n`;

        const allKeys = Object.keys(instance);

        allKeys.forEach(key => {
            const item = instance[key];

            // 1. Costanti numeriche semplici (es. AR_DEBUG_ENABLE: 1)
            if (key.startsWith('AR_') && typeof item === 'number') {
                tsContent += `export const ${key}: number = ${item};\n`;
            }

                // 2. ENUM di Embind (es. AR_PIXEL_FORMAT)
                // Embind espone gli enum come 'function' (il costruttore della classe)
            // che ha proprietà statiche attaccate.
            else if (key.startsWith('AR_') && (typeof item === 'object' || typeof item === 'function') && item !== null) {

                // Iteriamo sulle proprietà statiche dell'Enum (es. AR_PIXEL_FORMAT_RGB)
                Object.keys(item).forEach(enumKey => {
                    const enumValueObj = item[enumKey];

                    // Verifichiamo che sia un oggetto con una proprietà '.value' numerica
                    // Embind wrappa i valori enum così: { value: 0, ... }
                    if (enumValueObj && typeof enumValueObj === 'object' && typeof enumValueObj.value === 'number') {
                        // Esportiamo "appiattendo" il nome, es: AR_PIXEL_FORMAT_RGB = 0
                        tsContent += `export const ${enumKey}: number = ${enumValueObj.value};\n`;
                    }
                });
            }
        });

        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, tsContent);
        console.log(`✅ TypeScript constants generated at: ${outputPath}`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error generating constants:", error);
        process.exit(1);
    }
}

generate();