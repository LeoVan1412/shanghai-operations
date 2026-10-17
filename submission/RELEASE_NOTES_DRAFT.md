# Shanghai Operations 0.8.1-dev.2 — independent project preview

Prepared 2026-10-15. Release draft material; no stable release is claimed.

This project extracts the existing PVG operations candidate into its own repository, with self-contained build tools, seven synthetic regression suites, provenance, data attribution and a reproducible review package.

The bundled runtime is unchanged from the r16-tested candidate:

`bba8166cc1af74238d27e5e8a510c9249b578752bd9fa762a73fe78fbef510b3`

Repository metadata and package documentation now refer to the independent project. The archive includes a separate data-licence notice for the unchanged anonymous exclusion geometry.

The visible workflow covers route selection, stopping/through-service choices, station and fleet advice, native new-service application and scoped undo. Advanced automatic construction/passing remains development-only. PVG is required; SHA compatibility and full operating acceptance are incomplete.

See [acceptance status](../docs/ACCEPTANCE_STATUS.md) before testing with an independent backup. This packaging work adds no new loaded-game evidence.
