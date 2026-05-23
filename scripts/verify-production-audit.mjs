import { spawnSync } from "node:child_process"

const result = spawnSync("npm", ["audit", "--omit=dev", "--workspace=@fincoopers/web", "--json"], {
  encoding: "utf8",
  shell: false,
})

const output = result.stdout || result.stderr

if (!output) {
  console.error("npm audit produced no output.")
  process.exit(result.status ?? 1)
}

let report

try {
  report = JSON.parse(output)
} catch {
  console.error(output)
  process.exit(result.status ?? 1)
}

const counts = report.metadata?.vulnerabilities ?? {}
const high = Number(counts.high ?? 0)
const critical = Number(counts.critical ?? 0)
const moderate = Number(counts.moderate ?? 0)
const low = Number(counts.low ?? 0)

if (high || critical) {
  console.error(`Production audit failed: ${critical} critical, ${high} high vulnerabilities.`)
  process.exit(1)
}

console.log(`Production audit passed: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low.`)

if (moderate || low) {
  console.log("Non-blocking advisories remain. Review npm audit output before dependency upgrade work.")
}
