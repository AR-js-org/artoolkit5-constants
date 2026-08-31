---
name: license-header-adder
description: Adds the artoolkit5-constants MIT license header to source files. Use when creating new source files, or when auditing the repository for files missing a header.
---

# License Header Adder

Applies the project's MIT license header to source files in `artoolkit5-constants`.

The project lives in [AR-js-org](https://github.com/AR-js-org) and follows
[AR.js's licence](https://github.com/AR-js-org/AR.js/blob/master/LICENSE).

## Template

`resources/HEADER.txt`, with two substitutions:

- `{{FILENAME}}` — the target file's **basename** (`gen_constants.js`, not
  `tools/gen_constants.js`).
- `{{LINEAGE}}` — one of the three blocks below. **Choosing the right one is the
  point of this skill**; see "Which lineage block" for why they differ.

## Which lineage block

This package publishes **extracted integer values only** — no engine code, no
WebAssembly binary. So the LGPLv3 lineage is not uniform across the repository,
and stating it where it does not apply is as wrong as omitting it where it does.

### A. Build tooling — no lineage block

`tools/*.js`

These never touch WebARKitLib. They configure CMake, run Docker, and read values
out of an already-compiled module. Substitute `{{LINEAGE}}` with a single blank
comment line:

```
 *
```

### B. `src/constants_extractor.cpp`

The one file that `#include`s the LGPLv3 headers.

```
 *
 *  This file includes headers from ARToolkit5 (WebARKitLib), which is licensed
 *  under the GNU Lesser General Public License v3.0. It is a build-time tool;
 *  no WebARKitLib code is distributed in the published package.
 *
```

### C. `src/index.ts`

Ships to consumers, and re-exports values derived from those headers.

```
 *
 *  The constants re-exported here are extracted at build time from ARToolkit5
 *  (WebARKitLib) headers, which are licensed under the GNU Lesser General
 *  Public License v3.0. Only the extracted values are published; no
 *  WebARKitLib code is included.
 *
```

## Applies to

- `.ts` files in `src/` (excluding `src/generated/`)
- `.cpp` and `.h` files in `src/`
- `.js` files in `tools/`

## Rules

1. **Insert at the very top of the file**, followed by one blank line before the
   first line of code.
2. **Skip files that already have a header.** Detect by checking whether the
   first block comment contains `Copyright (c)`. Never stack a second one.
3. **Do not modify** `src/generated/`, `dist/`, `build/`, `node_modules/`,
   `third_party/`, or any vendored code. Generated files are rewritten on every
   build, so a header added there is lost and would churn the sync check.
4. **Do not apply to** `.json`, `.md`, `.yml`, or data files.
5. **Config files** (`tsconfig.json`, `CMakeLists.txt`) are out of scope — no
   meaningful authorship.
6. **Year** is fixed at `2026` in the template. Do not bump per-file on edit;
   change the template and reapply repo-wide.
7. **Author line**: keep `Walter Perdan @kalwalt` unless a file has a different
   principal author, in which case add them rather than replacing.

## After applying

`src/index.ts` is compiled by `tsc`, and `removeComments` is **not** set — so its
header is copied into `dist/index.js` and `dist/index.d.ts`. `dist/` is committed
and CI fails if it is stale, so:

```bash
npm run build:docker
```

and commit the regenerated output. Headers on `tools/*.js` and the `.cpp` do not
affect `dist/`.

## Copyright attribution

The copyright holder is **`AR-js-org`** — the organisation, not an individual.
Individual credit belongs on the `Author(s):` line.

This deliberately differs from `AR-js-org/AR.js`, whose LICENSE reads
`Copyright (c) 2020 AR.js`. New projects in the organisation attribute the org.

## Difference from artoolkit5-ts

The equivalent skill in `artoolkit5-ts` uses a single header stating that the
library *wraps a WebAssembly build of* ARToolkit5 (WebARKitLib). That wording is
correct there — that package ships the binary.

**Do not copy it here.** This package wraps nothing and ships no binary. Reusing
that sentence would overstate what a consumer takes on.
