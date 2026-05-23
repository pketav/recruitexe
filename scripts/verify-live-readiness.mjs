import { spawnSync } from "node:child_process"

const productionUrl = process.env.LIVE_BASE_URL || process.env.SMOKE_BASE_URL || "https://fincoopers-hrms-clean.vercel.app"

function runStep(label, command, args, env = {}) {
  console.log(`\n${label}`)

  const result = spawnSync(command, args, {
    env: { ...process.env, ...env },
    shell: false,
    stdio: "inherit",
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

runStep("Active app security scan", "npm", ["run", "verify:security"])
runStep("Production product smoke", "npm", ["run", "verify:smoke"], {
  SMOKE_BASE_URL: productionUrl,
})

console.log(`\nLive readiness passed for ${productionUrl}.`)
