/*
 *  configure.js
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

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Funzione per cercare un eseguibile nel PATH
function findExecutable(exe) {
    const envPath = process.env.PATH || '';
    const envExt = process.env.PATHEXT || '';
    const pathDirs = envPath.split(path.delimiter);
    const pathExts = envExt.split(path.delimiter);

    for (const dir of pathDirs) {
        // Rimuove eventuali virgolette che potrebbero essere presenti nel PATH su Windows
        const cleanDir = dir.replace(/^"|"$/g, '');
        
        try {
            const fullPath = path.join(cleanDir, exe);
            if (fs.existsSync(fullPath)) return fullPath;
            
            for (const ext of pathExts) {
                const fullPathExt = fullPath + ext;
                if (fs.existsSync(fullPathExt)) return fullPathExt;
            }
        } catch (e) {
            // Ignora errori di accesso a directory protette o path invalidi
            continue;
        }
    }
    return null;
}

try {
    // Cerchiamo Ninja nel sistema
    let ninjaPath = findExecutable('ninja');

    // Se non lo troviamo nel PATH standard, proviamo percorsi comuni di Chocolatey o Emscripten
    if (!ninjaPath) {
        const commonPaths = [
            'C:/ProgramData/chocolatey/bin/ninja.exe',
            'C:/ProgramData/chocolatey/lib/ninja/tools/ninja.exe'
        ];
        
        for (const p of commonPaths) {
            if (fs.existsSync(p)) {
                ninjaPath = p;
                break;
            }
        }
    }

    if (!ninjaPath) {
        console.warn("⚠️ Ninja not found in system PATH. Trying to use 'make' (MinGW/Unix Makefiles) instead...");
        console.log("Executing: emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release -S .");
        execSync(`emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release -S .`, { stdio: 'inherit' });
    } else {
        console.log(`✅ Ninja found at: ${ninjaPath}`);
        // Normalizza il percorso per CMake
        const ninjaPathFixed = ninjaPath.split(path.sep).join('/');
        const cmd = `emcmake cmake -B build -GNinja -DCMAKE_BUILD_TYPE=Release -S . -DCMAKE_MAKE_PROGRAM="${ninjaPathFixed}"`;
        console.log(`Executing: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    }

} catch (error) {
    console.error("❌ Configuration failed.");
    console.error(error);
    process.exit(1);
}
