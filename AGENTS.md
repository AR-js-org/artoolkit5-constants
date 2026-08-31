# artoolkit5-constants

Generates TypeScript constants from the ARToolKit5 (WebARKitLib) C headers, so
that every project in the ecosystem reads the same integers from one place
instead of hardcoding them.

The package publishes **numbers only**. No engine code, no WebAssembly binary.

## How it works

```
third_party/WebARKitLib/include/AR/*.h    C headers (submodule, LGPLv3)
  src/constants_extractor.cpp             Embind: registers each constant
    build/constants_extractor.js          Emscripten output
      tools/gen_constants.js              loads it, reads the values
        src/generated/artoolkit_constants.ts
          dist/                           tsc output — published
```

`gen_constants.js` **executes** the compiled module and reads properties off it.
It does not parse text. So the values always come from the headers as the
compiler saw them — a constant cannot be silently mistyped into existence.

## Building

```bash
npm run build:docker
```

This is the supported way. It builds inside the pinned Emscripten image, which
is the same image CI runs in.

**Do not use `npm run build` with a local Emscripten** unless you have
deliberately matched the pinned version. It will appear to work and then fail
CI. See "The sync check" below for why.

`npm run build` (without Docker) exists for that deliberate case, and is what
runs *inside* the container.

### The version pin

The version lives in `.emscripten-version` and appears in two places:

| Where | How |
|---|---|
| `npm run build:docker` | reads the file, uses it as the image tag |
| `.github/workflows/ci.yml` | `container:` tag, asserted against the file every run |

CI cannot read the file to choose its container — `container:` resolves before
checkout — so the tag is written out there too. **Change both together.** The
first CI step fails loudly if they drift.

### The sync check

`dist/` is **committed**. CI rebuilds it and fails if the result differs from
what is in the repository.

This is the constraint that shapes everything else. It means a build on an
unpinned toolchain does not merely risk being different — it produces a pull
request that cannot pass, for reasons unrelated to the change in it.

After any change that affects output, run `npm run build:docker` and commit what
it produces.

## Repository conventions

### Generated files

- **Never hand-edit** `src/generated/` or `dist/`. Edit
  `src/constants_extractor.cpp` and rebuild.
- `src/generated/*.ts` is **gitignored**; `dist/` is **committed**. That
  asymmetry is deliberate but surprising — the sync check therefore watches
  `dist/`.
- Generated output is LF, enforced by `.gitattributes`. The sync check runs on
  Linux, so CRLF would fail it for reasons unrelated to your change.

### `.gitignore`

`*.js` is ignored wholesale, with `!tools/*.js` re-including the build tooling.
A new script in `tools/` is covered; a `.js` file anywhere else is not, and will
be silently skipped by `git add`.

### Adding a constant

1. Confirm it exists in `third_party/WebARKitLib/include/AR/`. **Read the
   header — do not transcribe a value from documentation, an issue, or another
   project.**
2. Register it in `src/constants_extractor.cpp`. `#define`s need `+ 0` to force
   an int, matching the surrounding style.
3. `npm run build:docker`.
4. Commit the regenerated `dist/`.
5. Record it in `CHANGELOG.md` under `Unreleased`.

### Exporting a constant is not a claim that it works

`AR_LABELING_THRESH_MODE_AUTO_ADAPTIVE` is exported, but
`AR_DISABLE_THRESH_MODE_AUTO_ADAPTIVE=1` in the upstream build compiles its
`case` out — passing it silently degrades to `MANUAL`.

When a constant is known not to function, say so in `CHANGELOG.md` rather than
removing it. Consumers need to know the difference between "absent" and
"present but inert", and removing an export is a breaking change.

### Licence headers

Every source file carries one. See
[`.agents/skills/license-header-adder`](.agents/skills/license-header-adder/SKILL.md)
— there are three variants, and which applies depends on whether the file
actually touches LGPLv3 code.

### Git

- Branch from `dev`. PRs target `dev`; `main` is release-ready code.
- [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`,
  `docs:`, `ci:`, `chore:`, `refactor:`, `test:`. `!` before the colon for
  breaking changes.

## Licensing

The package is MIT. The constants are extracted from WebARKitLib headers, which
are LGPLv3, but only the extracted values are published — no WebARKitLib code is
distributed.

`src/constants_extractor.cpp` is the one file that `#include`s those headers, and
it is a build-time tool that never ships.
