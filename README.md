# ARToolKit5 Constants

[![npm version](https://img.shields.io/npm/v/@AR-js-org/artoolkit5-constants.svg)](https://www.npmjs.com/package/@AR-js-org/artoolkit5-constants)
[![CI](https://github.com/AR-js-org/artoolkit5-constants/actions/workflows/ci.yml/badge.svg)](https://github.com/AR-js-org/artoolkit5-constants/actions)
[![GitHub stars](https://img.shields.io/github/stars/AR-js-org/artoolkit5-constants)](https://github.com/AR-js-org/artoolkit5-constants/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/AR-js-org/artoolkit5-constants)](https://github.com/AR-js-org/artoolkit5-constants/network)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**Zero-dependency, auto-generated TypeScript definitions for ARToolKit5 constants.**

This package provides a strict "Single Source of Truth" for the ARToolKit ecosystem. Instead of manually maintaining magic numbers in JavaScript, we extract values directly from the C++ source code using a WebAssembly extractor.

## 📦 Installation

```bash
npm install @ar-js-org/artoolkit5-constants
```

## 🚀 Usage

This library exports constants individually to support **tree-shaking**. You have two ways to use them depending on your preference.

### 1. Named Imports (Recommended)
Import only what you need. This allows bundlers (Webpack, Rollup, Vite) to remove unused code, keeping your application lightweight.

```typescript
import {
    AR_PIXEL_FORMAT_RGBA,
    AR_MATRIX_CODE_DETECTION
} from '@ar-js-org/artoolkit5-constants';

// Example: Configuring ARController
const config = {
    pixelFormat: AR_PIXEL_FORMAT_RGBA,
    detectionMode: AR_MATRIX_CODE_DETECTION
};

if (config.pixelFormat === AR_PIXEL_FORMAT_RGBA) {
    console.log("Using RGBA format");
}
```

### 2. Namespace Import (Grouped Style)
If you prefer accessing constants via a global object (similar to how Enums work or legacy ARToolKit structure), use the `import * as` syntax:

```typescript
import * as AR from '@ar-js-org//artoolkit5-constants';

// Now you can access everything under 'AR'
console.log(AR.AR_LOG_LEVEL_ERROR); // Output: 3
console.log(AR.AR_TEMPLATE_MATCHING_MONO); // Output: 1

function setLogLevel(level: number) {
    if (level === AR.AR_LOG_LEVEL_DEBUG) {
        // enable debug tools
    }
}
```

## 🛠 How it Works (For Contributors)

This project uses a unique build pipeline to ensure accuracy:
1.  **C++ Source**: It links against the `WebARKitLib` submodule.
2.  **Embind Extraction**: A minimal C++ program exposes macros and enums via WebAssembly.
3.  **Generation**: A Node.js script loads the WASM, reads the values, and generates a static `.ts` file.

### Building (recommended: Docker)

The generated constants are **committed**, and CI regenerates them and fails if
the result differs from what is in the repository. A build therefore has to use
the same toolchain CI does, or it produces a pull request that cannot pass.

`npm run build:docker` guarantees that. It builds inside the pinned Emscripten
image — the same one CI runs in — so nothing depends on what happens to be
installed locally:

```bash
git submodule update --init --recursive
npm install
npm run build:docker
```

Docker is the only requirement; the image supplies Emscripten, CMake and Node.

#### The version pin

The Emscripten version lives in [`.emscripten-version`](.emscripten-version) and
is used in two places:

| Where | How |
|---|---|
| `npm run build:docker` | reads the file and uses it as the image tag |
| `.github/workflows/ci.yml` | `container:` tag, asserted against the file on every run |

CI cannot read the file to choose its container — `container:` is resolved
before the repository is checked out — so the tag is written out there as well.
The first CI step compares `emcc --version` against the file and fails if they
have drifted, which means **the two must be changed together**.

### Building without Docker

Possible, but you are responsible for matching the pinned version. You will need
[Emscripten](https://emscripten.org/) (exactly the version in
`.emscripten-version`), [CMake](https://cmake.org/), optionally
[Ninja](https://ninja-build.org/) — the build falls back to Makefiles without it
— and Node.js 18+.

```bash
git submodule update --init --recursive
npm install
npm run build          # configure -> extractor -> generate -> TypeScript
```

The generated source file is written to `src/generated/artoolkit_constants.ts`.

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.