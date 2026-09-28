/*
 *  gen_version.js
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
 *  artoolkit5-constants is distributed in the hope it will be useful, but
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
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');
const defaultOutputPath = path.resolve(__dirname, '../src/generated/version.ts');
const outputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultOutputPath;

try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const version = pkg.version;

    if (!version || typeof version !== 'string') {
        console.error('❌ package.json does not contain a valid version string.');
        process.exit(1);
    }

    const tsContent = `/**\n * GENERATED FILE - DO NOT EDIT\n */\n\nexport const VERSION: string = '${version}';\nexport const ARTOOLKIT_CONSTANTS_VERSION: string = VERSION;\n`;

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, tsContent, { encoding: 'utf8' });
    console.log(`✅ Version constants generated at: ${outputPath} (${version})`);
} catch (error) {
    console.error('❌ Error generating version file:', error);
    process.exit(1);
}
