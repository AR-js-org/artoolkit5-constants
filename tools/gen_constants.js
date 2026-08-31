/*
 *  gen_constants.js
 *  artoolkit5-constants
 *
 *  This file is part of artoolkit5-constants - AR-js-org.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  artoolkit5-constants is distributed in the hope that it will be useful, but
 *  WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. See the MIT License
 *  for more details.
 *
 *  You should have received a copy of the MIT License along with
 *  artoolkit5-constants. If not, see <https://opensource.org/licenses/MIT>.
 *
 *  Copyright (c) 2026 AR-js-org
 *
 *  Author(s): Walter Perdan @kalwalt https://github.com/kalwalt
 *
 */

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

        let tsContent = `/**\n * GENERATED FILE - DO NOT EDIT\n */\n\n`;

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