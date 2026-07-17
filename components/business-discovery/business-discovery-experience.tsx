"use client"

import { useEffect, useMemo, useState } from "react"
import { Brain, CheckCircle2, Clock3, PlayCircle, Save, Sparkles, Target } from "lucide-react"
import { PublicButtonLink, PublicCard, PublicContainer, PublicSection, PublicSectionHeader } from "@/components/aios"
import { BusinessBlueprintViewer } from "@/components/business-blueprint"
import { analyzeDiscovery, getDiscoveryQuestions, getNextQuestionId, getQuestionById, type DiscoveryAnswers, type DiscoverySessionDraft, type DiscoveryStage } from "@/src/features/business-discovery"

const STORAGE_KEY = "aios.business-discovery.session.v1"

function stageLabel(stage: DiscoveryStage): string {
  if (stage === "welcome") {
    return "Welcome"
  }
  if (stage === "interview") {
    return "Adaptive Interview"
  }
  if (stage === "review") {
    return "Review"
  }
  return "Approved"
}

function parseDraft(raw: string | null): DiscoverySessionDraft | undefined {
  if (!raw) {
    return undefined
  }

  try {
    return JSON.parse(raw) as DiscoverySessionDraft
  } catch {
    return undefined
  }
}

export function BusinessDiscoveryExperience() {
  const [stage, setStage] = useState<DiscoveryStage>("welcome")
  const [answers, setAnswers] = useState<DiscoveryAnswers>({})
  const [questionHistory, setQuestionHistory] = useState<string[]>([])
  const [currentQuestionId, setCurrentQuestionId] = useState<string | undefined>(undefined)
  const [draftSavedAt, setDraftSavedAt] = useState<string | undefined>(undefined)
  const [currentInput, setCurrentInput] = useState("")

  const questions = useMemo(() => getDiscoveryQuestions(), [])
  const analysis = useMemo(() => analyzeDiscovery(answers), [answers])
  const currentQuestion = currentQuestionId ? getQuestionById(currentQuestionId) : undefined

  const answeredCount = Object.values(answers).filter((value) => value.trim().length > 0).length
  const progress = Math.max(4, Math.min(100, Math.round((answeredCount / questions.length) * 100)))

  useEffect(() => {
    if (stage !== "interview") {
      return
    }

    if (currentQuestionId) {
      return
    }

    const nextQuestionId = getNextQuestionId(answers, questionHistory)
    setCurrentQuestionId(nextQuestionId)
  }, [answers, currentQuestionId, questionHistory, stage])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const draft = parseDraft(window.localStorage.getItem(STORAGE_KEY))
    if (!draft) {
      return
    }

    setDraftSavedAt(draft.savedAt)
  }, [])

  const interviewComplete = stage === "interview" && !currentQuestionId

  function saveDraft(nextStage = stage) {
    if (typeof window === "undefined") {
      return
    }

    const payload: DiscoverySessionDraft = {
      stage: nextStage,
      answers,
      questionHistory,
      currentQuestionId,
      savedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setDraftSavedAt(payload.savedAt)
  }

  function resumeDraft() {
    if (typeof window === "undefined") {
      return
    }

    const draft = parseDraft(window.localStorage.getItem(STORAGE_KEY))
    if (!draft) {
      return
    }

    setStage(draft.stage)
    setAnswers(draft.answers)
    setQuestionHistory(Array.from(draft.questionHistory))
    setCurrentQuestionId(draft.currentQuestionId)
    setDraftSavedAt(draft.savedAt)
  }

  function startInterview() {
    setStage("interview")
    const nextQuestionId = getNextQuestionId(answers, questionHistory)
    setCurrentQuestionId(nextQuestionId)
  }

  function submitCurrentAnswer(answerValue: string) {
    if (!currentQuestionId) {
      return
    }

    const value = answerValue.trim()
    if (!value) {
      return
    }

    const nextAnswers = {
      ...answers,
      [currentQuestionId]: value,
    }

    const nextHistory = questionHistory.includes(currentQuestionId)
      ? questionHistory
      : [...questionHistory, currentQuestionId]

    const nextQuestionId = getNextQuestionId(nextAnswers, nextHistory)

    setAnswers(nextAnswers)
    setQuestionHistory(nextHistory)
    setCurrentInput("")
    setCurrentQuestionId(nextQuestionId)

    if (!nextQuestionId) {
      setStage("review")
    }
  }

  function skipCurrentQuestion() {
    if (!currentQuestionId) {
      return
    }

    const nextHistory = questionHistory.includes(currentQuestionId)
      ? questionHistory
      : [...questionHistory, currentQuestionId]

    const nextQuestionId = getNextQuestionId(answers, nextHistory)
    setQuestionHistory(nextHistory)
    setCurrentQuestionId(nextQuestionId)

    if (!nextQuestionId) {
      setStage("review")
    }
  }

  function approveBlueprint() {
    setStage("approved")
    saveDraft("approved")
  }

  return (
    <div className="space-y-8">
      <PublicSection>
        <PublicContainer>
          <PublicCard variant="floating" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="public-caption text-[color:var(--public-color-text-soft)]">M10.0 Intelligent Business Discovery</p>
                <h1 className="public-h2 mt-2">Let&apos;s get to know your business</h1>
                <p className="public-body mt-3 max-w-3xl text-[color:var(--public-color-text-soft)]">
                  AIOS runs an adaptive executive interview to understand your operating model and generate a live Business Blueprint.
                </p>
              </div>
              <span className="public-chip flex items-center gap-2"><Clock3 size={14} /> 15-20 minutes</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[color:var(--public-color-text-soft)]">
                <span>{stageLabel(stage)}</span>
                <span>{progress}% complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--public-color-muted)]">
                <div className="h-full rounded-full bg-[var(--public-color-primary)] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" className="public-button public-button-secondary" onClick={() => saveDraft()}>
                <Save size={16} /> Save and resume later
              </button>
              {draftSavedAt ? (
                <button type="button" className="public-button public-button-secondary" onClick={resumeDraft}>
                  <PlayCircle size={16} /> Resume saved draft ({new Date(draftSavedAt).toLocaleString()})
                </button>
              ) : null}
              <PublicButtonLink href="/pilot" variant="secondary">Back to Pilot</PublicButtonLink>
            </div>
          </PublicCard>
        </PublicContainer>
      </PublicSection>

      {stage === "welcome" ? (
        <PublicSection>
          <PublicContainer>
            <div className="grid gap-4 md:grid-cols-3">
              <PublicCard variant="feature" className="space-y-2">
                <span className="public-chip"><Brain size={14} /> Adaptive interview</span>
                <h2 className="public-h4">Conversational discovery</h2>
                <p className="public-body">Questions adapt to previous answers. AIOS explores your business model like a strategy consultant.</p>
              </PublicCard>
              <PublicCard variant="feature" className="space-y-2">
                <span className="public-chip"><Sparkles size={14} /> Live blueprint</span>
                <h2 className="public-h4">Business Blueprint in real time</h2>
                <p className="public-body">See organization, systems, goals, and KPI structure form while you answer.</p>
              </PublicCard>
              <PublicCard variant="feature" className="space-y-2">
                <span className="public-chip"><Target size={14} /> Actionable output</span>
                <h2 className="public-h4">Recommendations included</h2>
                <p className="public-body">AIOS proposes dashboards, reports, operators, integrations, and automation opportunities.</p>
              </PublicCard>
            </div>
            <div className="mt-6">
              <button type="button" className="public-button public-button-primary" onClick={startInterview}>Start Discovery</button>
            </div>
          </PublicContainer>
        </PublicSection>
      ) : null}

      {stage === "interview" ? (
        <PublicSection>
          <PublicContainer>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <PublicCard variant="floating" className="space-y-4">
                <PublicSectionHeader
                  eyebrow="Adaptive AI Conversation"
                  title={currentQuestion ? currentQuestion.prompt : "Interview complete"}
                  body={currentQuestion?.hint ?? "AIOS has enough context to move to review."}
                />

                {currentQuestion ? (
                  <>
                    <p className="public-small">Topic: {currentQuestion.topic}</p>
                    <div className="space-y-3">
                      {currentQuestion.options?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {currentQuestion.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              className="public-chip"
                              onClick={() => {
                                setCurrentInput(option)
                                submitCurrentAnswer(option)
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      <textarea
                        className="public-input min-h-[132px]"
                        placeholder={currentQuestion.placeholder ?? "Type your answer"}
                        value={currentInput}
                        onChange={(event) => setCurrentInput(event.target.value)}
                      />
                      <div className="flex flex-wrap gap-3">
                        <button type="button" className="public-button public-button-primary" onClick={() => submitCurrentAnswer(currentInput)}>
                          Save answer
                        </button>
                        <button type="button" className="public-button public-button-secondary" onClick={skipCurrentQuestion}>
                          Skip for now
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    Adaptive interview complete. Move to review to approve the generated Business Blueprint.
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <p className="public-caption">Conversation so far</p>
                  <div className="max-h-[240px] space-y-2 overflow-auto pr-1">
                    {questionHistory.length ? (
                      questionHistory.map((questionId) => {
                        const question = getQuestionById(questionId)
                        if (!question || !answers[questionId]) {
                          return null
                        }

                        return (
                          <div key={questionId} className="rounded-xl border border-[var(--public-color-border)] bg-[var(--public-color-surface)] p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--public-color-text-soft)]">{question.topic}</p>
                            <p className="mt-1 text-sm font-medium text-[color:var(--public-color-text)]">{question.prompt}</p>
                            <p className="mt-2 text-sm text-[color:var(--public-color-text-soft)]">{answers[questionId]}</p>
                          </div>
                        )
                      })
                    ) : (
                      <p className="public-small">No answers yet.</p>
                    )}
                  </div>
                </div>

                {interviewComplete ? (
                  <button type="button" className="public-button public-button-primary" onClick={() => setStage("review")}>Continue to review</button>
                ) : null}
              </PublicCard>

              <PublicCard variant="floating" className="space-y-4">
                <PublicSectionHeader
                  eyebrow="Live Blueprint"
                  title="AIOS learning preview"
                  body="This preview updates as answers are captured so stakeholders can validate direction early."
                />
                <BusinessBlueprintViewer
                  blueprint={analysis.blueprint}
                  completionScore={analysis.validation.completionScore}
                  validationIssues={analysis.validation.issues}
                />
              </PublicCard>
            </div>
          </PublicContainer>
        </PublicSection>
      ) : null}

      {stage === "review" ? (
        <PublicSection>
          <PublicContainer>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <PublicCard variant="floating" className="space-y-4">
                <PublicSectionHeader
                  eyebrow="Review Before Approval"
                  title="Business Summary"
                  body={analysis.businessSummary}
                />
                <dl className="grid gap-2 rounded-2xl border border-[var(--public-color-border)] bg-[var(--public-color-surface)] p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-semibold">Detected Industry</dt>
                    <dd>{analysis.detectedIndustry.industry} / {analysis.detectedIndustry.subIndustry}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-semibold">Detected Revenue Model</dt>
                    <dd>{analysis.detectedIndustry.businessModel}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-semibold">Business Confidence Score</dt>
                    <dd>{analysis.detectedIndustry.confidence}%</dd>
                  </div>
                </dl>

                <div className="grid gap-3 md:grid-cols-2">
                  <PublicCard variant="feature" className="space-y-2">
                    <p className="public-caption">Suggested KPIs</p>
                    <ul className="space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                      {analysis.detectedIndustry.suggestedKpis.slice(0, 5).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </PublicCard>
                  <PublicCard variant="feature" className="space-y-2">
                    <p className="public-caption">Suggested Integrations</p>
                    <ul className="space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                      {analysis.recommendations.integrations.slice(0, 5).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </PublicCard>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <PublicCard variant="feature" className="space-y-2">
                    <p className="public-caption">Suggested Dashboards</p>
                    <ul className="space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                      {analysis.recommendations.dashboards.slice(0, 5).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </PublicCard>
                  <PublicCard variant="feature" className="space-y-2">
                    <p className="public-caption">Suggested AI Operators</p>
                    <ul className="space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                      {analysis.recommendations.aiOperators.slice(0, 5).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </PublicCard>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <PublicCard variant="feature" className="space-y-2">
                    <p className="public-caption">Missing Information</p>
                    <ul className="space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                      {(analysis.missingInformation.length ? analysis.missingInformation : ["No critical gaps detected"]).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </PublicCard>
                  <PublicCard variant="feature" className="space-y-2">
                    <p className="public-caption">Conflicts and Suggestions</p>
                    <ul className="space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                      {[...analysis.conflicts, ...analysis.suggestions].length
                        ? [...analysis.conflicts, ...analysis.suggestions].map((item) => <li key={item}>{item}</li>)
                        : <li>No conflicts detected</li>}
                    </ul>
                  </PublicCard>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" className="public-button public-button-secondary" onClick={() => setStage("interview")}>
                    Continue interview
                  </button>
                  <button type="button" className="public-button public-button-primary" onClick={approveBlueprint}>
                    Approve and generate Business Blueprint
                  </button>
                </div>
              </PublicCard>

              <PublicCard variant="floating" className="space-y-4">
                <PublicSectionHeader
                  eyebrow="Live Blueprint"
                  title="Final preview before approval"
                  body="Validate structure, confidence, and section quality before promoting this blueprint as the AIOS foundation."
                />
                <BusinessBlueprintViewer
                  blueprint={analysis.blueprint}
                  completionScore={analysis.validation.completionScore}
                  validationIssues={analysis.validation.issues}
                />
              </PublicCard>
            </div>
          </PublicContainer>
        </PublicSection>
      ) : null}

      {stage === "approved" ? (
        <PublicSection>
          <PublicContainer>
            <PublicCard variant="floating" className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={14} /> Business Blueprint approved
              </div>
              <PublicSectionHeader
                eyebrow="Foundation Ready"
                title="AIOS can now initialize the platform from your approved Business Blueprint"
                body="The discovery output is now ready to seed Business Memory, role-based intelligence, recommended dashboards, integration sequencing, and automation planning."
              />
              <div className="grid gap-3 md:grid-cols-2">
                <PublicCard variant="feature">
                  <p className="public-caption">Business Memory Structure</p>
                  <ul className="mt-2 space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                    {analysis.recommendations.businessMemoryStructure.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </PublicCard>
                <PublicCard variant="feature">
                  <p className="public-caption">Automation Opportunities</p>
                  <ul className="mt-2 space-y-1 text-sm text-[color:var(--public-color-text-soft)]">
                    {analysis.recommendations.automationOpportunities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </PublicCard>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="public-button public-button-secondary" onClick={() => setStage("review")}>Back to review</button>
                <PublicButtonLink href="/modules" size="lg">Continue to modules</PublicButtonLink>
              </div>
            </PublicCard>
          </PublicContainer>
        </PublicSection>
      ) : null}
    </div>
  )
}
