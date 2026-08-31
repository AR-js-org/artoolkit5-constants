# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-08-31

Constant coverage grows from 55 to 62. Every *mode* group in `arConfig.h` is now
generated; what remains are tuning defaults and limits, not enumerations.

### Added

- `arLabelingMode`: `AR_LABELING_WHITE_REGION` (0), `AR_LABELING_BLACK_REGION`
  (1) and `AR_DEFAULT_LABELING_MODE` (1). Labeling mode selects between
  black-bordered markers on a white background and white-bordered markers on a
  black background. `setLabelingMode` was already callable in
  `artoolkit5-wasm`, but had no valid argument exported, so only the default was
  reachable.
- `arMarkerExtractionMode`: `AR_USE_TRACKING_HISTORY` (0),
  `AR_NOUSE_TRACKING_HISTORY` (1), `AR_USE_TRACKING_HISTORY_V2` (2) and
  `AR_DEFAULT_MARKER_EXTRACTION_MODE` (2).

### Notes

The two `_DEFAULT_` values are aliases in the C headers —
`AR_DEFAULT_LABELING_MODE` is `AR_LABELING_BLACK_REGION` and
`AR_DEFAULT_MARKER_EXTRACTION_MODE` is `AR_USE_TRACKING_HISTORY_V2`. They are
resolved by the compiler during extraction rather than transcribed, so they
cannot drift from the headers.

### Still missing

The remaining ungenerated `arConfig.h` values are tuning defaults and limits
rather than mode enumerations: `AR_PATT_RATIO`, `AR_AREA_MIN` / `AR_AREA_MAX`,
`AR_SQUARE_MAX`, `AR_CHAIN_MAX`, `AR_PATT_SIZE1` / `AR_PATT_SIZE1_MAX`,
`AR_PATT_NUM_MAX`, `AR_CONFIDENCE_CUTOFF_DEFAULT`, the
`AR_LABELING_THRESH_ADAPTIVE_*` and `AR_LABELING_THRESH_AUTO_INTERVAL_DEFAULT`
tuning values, `AR_PATT_CONTRAST_THRESH1` / `2`, `AR_PATT_SAMPLE_FACTOR1` / `2`
and `AR_LABELING_32_BIT`.

`AR_PATT_RATIO` (0.5) is the most likely to be wanted next: it is the default a
consumer needs in order to document what `setPattRatio` does when left alone.

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

[Unreleased]: https://github.com/AR-js-org/artoolkit5-constants/compare/0.3.0...HEAD
[0.3.0]: https://github.com/AR-js-org/artoolkit5-constants/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/AR-js-org/artoolkit5-constants/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/AR-js-org/artoolkit5-constants/tree/0.1.0
