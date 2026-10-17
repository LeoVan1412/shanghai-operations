"use strict";
const fs = require("node:fs"), path = require("node:path");
const { spawnSync } = require("node:child_process");
const { root } = require("./build");
const tests = ["test_operations_mod.js", "test_service_planner.js", "test_dispatch_core.js", "test_dispatch_index.js", "test_expansion_core.js", "test_expansion_transaction.js", "test_dispatch_safety.js"];
const results = [];
for (const script of tests) {
  const run = spawnSync(process.execPath, [path.join(root, "source/scripts", script)], { encoding: "utf8", timeout: 60000, maxBuffer: 4 * 1024 * 1024, cwd: root });
  const passed = !run.error && run.status === 0;
  results.push({ script, passed, exitCode: run.status });
  console.log((passed ? "PASS " : "FAIL ") + script);
  if (!passed) {
    process.stderr.write(run.stderr || run.stdout || String(run.error));
    process.exitCode = 1;
  }
}
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/offline-tests.json"), JSON.stringify({ nodeVersion: process.version, scope: "Synthetic own-code tests only; no loaded-game run", tests: results, passed: results.every(r => r.passed) }, null, 2) + "\n");
