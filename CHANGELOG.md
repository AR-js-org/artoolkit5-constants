# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-08-13

Constant coverage grows from 38 to 55. Barcode (matrix code) marker support is now
possible using this package alone — previously it was not, because `setMatrixCodeType`
had no valid argument exported.

### Added

- **Combined pattern detection modes** — `AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX` (3) and
  `AR_TEMPLATE_MATCHING_MONO_AND_MATRIX` (4). These allow pattern and barcode markers to
  be detected simultaneously, the only way to mix marker families in one scene.
- **All eleven `AR_MATRIX_CODE_TYPE` values** — `AR_MATRIX_CODE_3x3`, `_3x3_PARITY65`,
  `_3x3_HAMMING63`, `_4x4`, `_4x4_BCH_13_9_3`, `_4x4_BCH_13_5_5`, `_5x5`,
  `_5x5_BCH_22_12_5`, `_5x5_BCH_22_7_7`, `_6x6` and `_GLOBAL_ID`.
- **`AR_LABELING_THRESH_MODE_AUTO_BRACKETING`** — the fifth member of the
  `AR_LABELING_THRESH_MODE` enum, previously omitted. See the note below.
- **Defaults for every configurable mode** — `AR_DEFAULT_PATTERN_DETECTION_MODE`,
  `AR_MATRIX_CODE_TYPE_DEFAULT` and `AR_LABELING_THRESH_MODE_DEFAULT`, matching the
  existing `AR_DEFAULT_DEBUG_MODE` / `AR_DEFAULT_IMAGE_PROC_MODE` convention.

### Changed

- `AR_PIXEL_FORMAT` is now emitted as flat constants rather than an Embind `enum_<T>`
  registration, matching every other enum-derived group in the extractor. **Generated
  output is byte-for-byte identical** — verified by building both forms and diffing —
  so this is a C++ source consistency change with no effect on consumers.

### Fixed

- CI now runs on the `dev` branch. Triggers previously listed `master`, which no longer
  exists after the rename to `main`, so no pull request targeting `dev` had ever been
  validated.

### Notes

`AR_LABELING_THRESH_MODE_AUTO_ADAPTIVE` is exported but **does not work in the current
WebARKitLib build**: `AR_DISABLE_THRESH_MODE_AUTO_ADAPTIVE` is set to `1` in `config.h`,
so its `case` label in `arCreateHandle.c` is compiled out and passing it falls through to
`default:` — logging *"Unknown or unsupported labeling threshold mode requested. Set to
manual."* and silently degrading to `MANUAL`. `AUTO_BRACKETING`, newly added here, has no
such guard and is fully implemented. The constant is left exported to avoid a breaking
change, since the disable flag is a build-time decision that may change.

### Still missing

`AR_LABELING_WHITE_REGION`, `AR_LABELING_BLACK_REGION`, `AR_DEFAULT_LABELING_MODE` and the
`arMarkerExtractionMode` group are not yet generated.

## [0.1.0]

Initial release.

[0.2.0]: https://github.com/AR-js-org/artoolkit5-constants/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/AR-js-org/artoolkit5-constants/releases/tag/v0.1.0
