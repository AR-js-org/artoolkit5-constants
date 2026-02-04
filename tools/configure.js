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
