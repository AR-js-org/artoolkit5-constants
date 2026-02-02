# ARToolKit5 Constants Generator

This repository provides an automated way to generate **TypeScript** definitions for **ARToolKit5** constants.

It uses a metadata-extraction approach: instead of parsing C++ headers with error-prone regex, we compile a minimal **WebAssembly** extractor using **Embind**. This extractor is then executed in a Node.js environment to generate a static, fully typed TypeScript file that acts as the "Single Source of Truth" for the WebARKit ecosystem.



## Why this project?

* **Guaranteed Sync:** Constants are exactly what the C++ core uses.
* **Zero Runtime Overhead:** Constants are exported as a static TS file. No need to load the heavy WASM module just to check a configuration flag.
* **Modularity:** Enables lightweight packages to depend on ARToolKit definitions without pulling in the entire tracking library.

## Project Structure

* `src/constants_extractor.cpp`: The C++ binder that exposes macros via `emscripten::constant`.
* `tools/gen_constants.js`: Node.js script that instantiates the WASM and exports values to TS format.
* `third_party/WebARKitLib`: Submodule containing the ARToolKit5 core source code.

## Requirements

* [Emscripten SDK](https://emscripten.org/)
* [CMake](https://cmake.org/)
* [Ninja](https://ninja-build.org/) (or another compatible build generator)
* [Node.js](https://nodejs.org/) (v18+)

## Build and Generation

To generate the `artoolkit_constants.ts` file, follow these steps:

1.  **Initialize submodules:**
    ```bash
    git submodule update --init --recursive
    ```

2.  **Configure the build with Emscripten:**
    Use the Visual Studio Developer Command Prompt (or any environment with Ninja/CMake in PATH):
    ```bash
    mkdir build && cd build
    emcmake cmake -G Ninja ..
    ```

3.  **Run the generation:**
    ```bash
    ninja generate_ts
    ```

The generated file will be located at `src/generated/artoolkit_constants.ts`.

## Usage

You can import the constants directly into your TypeScript project:

```typescript
import { AR_MATRIX_CODE_DETECTION } from './src/generated/artoolkit_constants';

// Example: checking detection mode
if (currentMode === AR_MATRIX_CODE_DETECTION) {
    console.log("Matrix code detection is active.");
}