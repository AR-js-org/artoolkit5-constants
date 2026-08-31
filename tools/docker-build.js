/**
 * Runs the full build inside the pinned Emscripten image.
 *
 * The version comes from `.emscripten-version`, which CI asserts against the
 * `emcc` in its own container. That single file is what stops the local
 * toolchain and CI's from drifting apart — and they must not drift, because CI
 * regenerates the constants and fails if the result differs from what is
 * committed.
 *
 *   npm run build:docker
 *
 * Node spawns docker directly rather than going through a shell, so Windows
 * paths are passed through untouched: no MSYS path translation, no quoting.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const VERSION_FILE = '.emscripten-version';

let version;
try {
    version = readFileSync(VERSION_FILE, 'utf8').trim();
} catch {
    console.error(`Could not read ${VERSION_FILE}. Run this from the repository root.`);
    process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
    console.error(`${VERSION_FILE} should contain a version like 4.0.17, but holds "${version}".`);
    process.exit(1);
}

const image = `emscripten/emsdk:${version}`;

// A configure run leaves absolute host paths in build/CMakeCache.txt. Reusing a
// cache written outside the container makes CMake fail on paths that do not
// exist here, so the build always starts from clean.
const build = 'npm run clean && npm run build';

console.log(`Building in ${image}\n`);

const result = spawnSync(
    'docker',
    ['run', '--rm', '-v', `${process.cwd()}:/src`, '-w', '/src', image, 'bash', '-c', build],
    { stdio: 'inherit' }
);

if (result.error) {
    console.error(`Could not run docker: ${result.error.message}`);
    console.error('Is Docker installed and running?');
    process.exit(1);
}

process.exit(result.status ?? 1);
