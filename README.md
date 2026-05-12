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

### Build Requirements
* [Emscripten SDK](https://emscripten.org/)
* [CMake](https://cmake.org/)
* [Ninja](https://ninja-build.org/)
* Node.js (v18+)

### Development Commands

```bash
# 1. Install dependencies
npm install

# 2. Initialize submodule (ARToolKit5 source)
git submodule update --init --recursive

# 3. Generate the TypeScript file (Requires Emscripten environment active)
npm run generate

# 4. Build the final package (Transpile to JS + .d.ts)
npm run build
```

The generated source file is located at `src/generated/artoolkit_constants.ts`.

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.