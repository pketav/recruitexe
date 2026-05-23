import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const root = process.cwd()
const scanRoot = join(root, "apps", "web")
const ignoredDirectories = new Set(["node_modules", ".next", "dist", "build", "out", ".vercel"])
const ignoredFiles = new Set(["package-lock.json"])
const sourceExtensions = new Set([
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
])

const checks = [
  {
    name: "JWT literal",
    pattern: /eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}/,
  },
  {
    name: "Postgres connection string",
    pattern: /postgres(?:ql)?:\/\/[^"'`\s]+/i,
  },
  {
    name: "Hardcoded Supabase project URL",
    pattern: /https:\/\/[a-z0-9]{20}\.supabase\.co/i,
  },
  {
    name: "Obvious password literal",
    pattern: /(password|pwd|secret)\s*[:=]\s*["'`][^"'`]{8,}["'`]/i,
  },
  {
    name: "Service role token literal",
    pattern: /(service[_-]?role|serverAccessToken)\s*[:=]\s*["'`][^"'`]{12,}["'`]/i,
  },
]

function extensionOf(filePath) {
  const match = filePath.match(/\.[^.]+$/)

  return match?.[0] ?? ""
}

function collectFiles(directory) {
  const files = []

  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) {
      continue
    }

    const absolutePath = join(directory, entry)
    const stats = statSync(absolutePath)

    if (stats.isDirectory()) {
      files.push(...collectFiles(absolutePath))
      continue
    }

    if (!stats.isFile() || ignoredFiles.has(entry) || !sourceExtensions.has(extensionOf(entry))) {
      continue
    }

    files.push(absolutePath)
  }

  return files
}

const findings = []

for (const filePath of collectFiles(scanRoot)) {
  const content = readFileSync(filePath, "utf8")

  for (const check of checks) {
    const match = content.match(check.pattern)

    if (!match) {
      continue
    }

    const lineNumber = content.slice(0, match.index).split("\n").length

    findings.push({
      check: check.name,
      file: relative(root, filePath),
      line: lineNumber,
    })
  }
}

if (findings.length) {
  console.error("Active app security scan failed:")
  for (const finding of findings) {
    console.error(`- ${finding.check}: ${finding.file}:${finding.line}`)
  }
  process.exit(1)
}

console.log("Active app security scan passed.")
