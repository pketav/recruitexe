"use client"

import { useState } from "react"
import { Bot, CheckCircle2, Loader2, Play, Save, ShieldCheck, Workflow } from "lucide-react"

import type { AutomationRule } from "@/lib/demo/recruitexe-data"
import { legacyTheme } from "@/lib/legacy-theme"

type RuleAction = {
  applicationId: string
  candidateName: string
  candidateCode: string
  jobTitle: string
  ruleId: string
  previousStatus: string
  nextStatus: string
  aiScore: string
}

type AutomationRulesWorkspaceProps = {
  organizationName: string
  initialRules: AutomationRule[]
}

export function AutomationRulesWorkspace({ organizationName, initialRules }: AutomationRulesWorkspaceProps) {
  const [rules, setRules] = useState(initialRules)
  const [actions, setActions] = useState<RuleAction[]>([])
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)

  function toggleRule(ruleId: AutomationRule["id"]) {
    setRules((currentRules) =>
      currentRules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    )
  }

  async function saveRules() {
    setSaving(true)
    setStatus("")
    setError("")

    try {
      const result = await persistRules()
      setRules(result.rules ?? rules)
      setStatus("Automation rules saved in Supabase organization settings.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save rules.")
    } finally {
      setSaving(false)
    }
  }

  async function persistRules() {
    const response = await fetch("/api/hr/automation-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules: rules.map(({ id, enabled }) => ({ id, enabled })) }),
    })
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error ?? "Unable to save rules.")
    }

    return result
  }

  async function runRules() {
    setRunning(true)
    setStatus("")
    setError("")

    try {
      const saved = await persistRules()
      setRules(saved.rules ?? rules)

      const response = await fetch("/api/hr/automation-rules/run", { method: "POST" })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to run rules.")
      }

      setActions(result.actions ?? [])
      setStatus(
        result.actionCount
          ? `${result.actionCount} automation actions applied across ${result.totalApplications} applications. Current toggles were saved before run.`
          : "Current toggles saved. Rules checked; no application needed a status change right now.",
      )
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Unable to run rules.")
    } finally {
      setRunning(false)
    }
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
                <Workflow className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: legacyTheme.text }}>Automation Rules</h2>
                <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>
                  {organizationName} ke AI screening ke baad auto decision rules.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveRules}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-bold disabled:opacity-70"
                style={{ borderColor: legacyTheme.divider, color: legacyTheme.primary }}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
              <button
                onClick={runRules}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)] disabled:opacity-70"
                style={{ background: legacyTheme.primary }}
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Run Rules
              </button>
            </div>
          </div>

          {status ? (
            <p className="mt-4 rounded-lg border px-4 py-3 text-sm font-semibold" style={{ borderColor: "rgba(40, 199, 111, 0.24)", background: "rgba(40, 199, 111, 0.08)", color: legacyTheme.success }}>
              {status}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" style={{ color: legacyTheme.primary }} />
            <h3 className="font-bold" style={{ color: legacyTheme.text }}>Safe Automation</h3>
          </div>
          <div className="space-y-3 text-sm" style={{ color: legacyTheme.textSoft }}>
            <p>Rules Supabase organization settings me store hote hain.</p>
            <p>Secrets ya Gemini key frontend me expose nahi hoti.</p>
            <p>Runner idempotent hai: repeat run duplicate rows create nahi karta.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {rules.map((rule) => (
          <article key={rule.id} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold" style={{ color: legacyTheme.text }}>{rule.title}</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: legacyTheme.textSoft }}>{rule.description}</p>
              </div>
              <button
                onClick={() => toggleRule(rule.id)}
                className="relative h-7 w-12 rounded-full transition"
                style={{ background: rule.enabled ? legacyTheme.primary : "rgba(47, 43, 61, 0.16)" }}
                aria-pressed={rule.enabled}
                aria-label={`${rule.title} ${rule.enabled ? "enabled" : "disabled"}`}
              >
                <span
                  className="absolute top-1 h-5 w-5 rounded-full bg-white transition"
                  style={{ left: rule.enabled ? 24 : 4 }}
                />
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                ["Trigger", rule.trigger],
                ["Condition", rule.condition],
                ["Action", rule.action],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg p-3" style={{ background: legacyTheme.body }}>
                  <p className="text-xs font-bold uppercase" style={{ color: legacyTheme.textMuted }}>{label}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: legacyTheme.text }}>{value}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <div className="mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5" style={{ color: legacyTheme.primary }} />
          <h3 className="font-bold" style={{ color: legacyTheme.text }}>Latest Automation Actions</h3>
        </div>
        {actions.length ? (
          <div className="space-y-3">
            {actions.map((action) => (
              <div key={`${action.applicationId}-${action.ruleId}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4" style={{ borderColor: legacyTheme.divider }}>
                <div>
                  <p className="font-semibold" style={{ color: legacyTheme.text }}>
                    {action.candidateName} · {action.jobTitle}
                  </p>
                  <p className="text-sm" style={{ color: legacyTheme.textSoft }}>
                    {action.previousStatus} → {action.nextStatus} · {action.aiScore} · {action.ruleId}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5" style={{ color: legacyTheme.success }} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: legacyTheme.textSoft }}>
            Run rules to see the latest automation decisions.
          </p>
        )}
      </section>
    </section>
  )
}
