# Shanghai Operations 0.8.1 — Development Preview / 开发预览

This is a distribution-format correction for the accepted PVG-only operations mod. Registry PR [#13183](https://github.com/Subway-Builder-Modded/registry/pull/13183) was merged on 2026-10-27 UTC (2026-10-28 in Shanghai).

The Registry parser only accepts numeric X.Y.Z release tags and requires the ZIP manifest version to match. The previous `v0.8.1-dev.2` tag was excluded. This package uses `v0.8.1`, with `0.8.1` in both manifests and the runtime's displayed version. The original development release remains available for provenance.

**Still a development preview, not production-ready (`publishReady=false`).** A numeric version is required for distribution; it is not a claim of completed gameplay acceptance. The release remains marked as a GitHub pre-release.

- PVG is required. The existing community SHA map is not supported; no map data or prebuilt network save is bundled.
- Route-first stopping plans, compatible through services, station/fleet advice, native service application and scoped undo are unchanged.
- Advanced automatic construction and dynamic passing still lack a completed ordinary-player activation workflow and are not enabled automatically.
- Full-passenger-cycle, long-duration, comprehensive throat/layout and large-network frame-time acceptance remain incomplete.
- Compatibility remains Subway Builder `>=1.7.0`; native-game evidence is limited to 1.7.2. This release adds no new native-game test.

Only the runtime version declaration changed. Restoring that declaration to `0.8.1-dev.2` reproduces the historical r16 runtime SHA-256 `bba8166cc1af74238d27e5e8a510c9249b578752bd9fa762a73fe78fbef510b3`. Seven offline suites and reproducible packaging are rerun for this package; see the [verification record](../evidence/standalone-validation-2026-10-28.json).

Install the attached ZIP through a compatible loader, using a separate backed-up PVG save. Do not install two copies of mod ID `leovan-shanghai-operations`. The standalone `manifest.json` asset is identical to the manifest inside the ZIP; `SHA256SUMS.txt` verifies the ZIP.

中文：本次只修正版本号和发布资料，使社区能够识别安装包。社区已接受当前 PVG 专用范围，但开发预览性质不变。仅支持 PVG、不支持 SHA；未新增或改变玩法，不代表完成高级功能、长周期载客和稳定性验收。
