---
tools: []
name: product-ux
model: inherit
description: Owns UX strategy, sitemap, and product flows for Metriq's audition-centered proof-of-work hiring experience.
is_background: true
---

Metriq is a **proof-of-work hiring platform**. The UX system is built around **auditions** (multi-stage work evaluations), **evidence** (candidate artifacts), and **structured evaluation** (rubrics + breakdowns). This document defines the product-level UX blueprint that all UI and backend implementation should follow.

---

### 1. Employer UX

#### Sitemap (Employer)
- **Roles**
  - Role list
  - Role detail (overview + active audition + candidate funnel)
  - Create role
  - Edit role (MVP: basic fields only)
- **Auditions**
  - Audition list (by role)
  - Audition detail (stage map + rubric + candidate progress)
  - Audition builder (stages + blocks + rules)
  - Rubric builder (criteria + scoring)
- **Candidates**
  - Candidate list (per audition)
  - Candidate review (artifact-first)
  - Candidate comparison (shortlist view)
  - Hiring decision (decision packet + outcome)
 
#### Key objects (Employer)
- **Role**: title, level/seniority tag, location/remote tag, role narrative (what you’ll do), success definition, capability tags, status (draft/active/closed).
- **Audition**: name, roleId, version, status (draft/live/closed), stage order, candidate progression/time rules, rubricId.
- **Stage**: title, objective (what this proves), estimated time, optional time limit rules, blocks[] (lab/work sample/reasoning), required artifacts, submission rules.
- **Rubric**: criteria[] (name, intent, scoring scale, evidence prompts), optional simple weights (later), red-flag tags (MVP: advisory).
- **Candidate (employer view)**: audition participation state (invited/in-progress/submitted/evaluated/shortlisted/declined/hired), artifacts, evaluations.

#### Core flows (Employer)

##### Create role
- Outcome: role exists in **draft** with a single next step: build an audition.

- **Roles list**
  - Purpose: manage roles; answer “what are we hiring for, and what needs attention?”
  - Data shown: role rows (status, active audition status, candidate counts by state, last activity).
  - Actions: create role; open role; close role (MVP: mark closed).
  - User goal: pick the right role quickly and see whether hiring is moving.
- **Create role**
  - Purpose: capture role context needed to design the audition.
  - Data shown: role fields + “what candidates will see” preview.
  - Actions: save draft; continue to build audition; cancel.
  - User goal: define success and capabilities so the audition reflects real work.
- **Role detail (overview)**
  - Purpose: answer “what’s the plan and how are candidates flowing?”
  - Data shown: role narrative; active audition; funnel counts; recent activity; rubric summary (if attached).
  - Actions: create/open audition; view candidates; edit role; close role.
  - User goal: orchestrate hiring work, not manage records.

##### Build audition
- Outcome: audition moves from **draft** to **live** with stages, blocks, and rubric.

- **Audition list (by role)**
  - Purpose: answer “which audition version is live and healthy?”
  - Data shown: audition rows (version/status, stage count, rubric attached, candidate counts, updated date).
  - Actions: create audition; open; close.
  - User goal: select the correct audition and understand its state.
- **Audition detail (overview)**
  - Purpose: answer “is this audition structured well and running smoothly?”
  - Data shown: stage map (ordered + estimates); progression/time rules; rubric summary; candidate progress distribution.
  - Actions: open builder; open rubric; view candidates; go live/close.
  - User goal: see structure + operational status at a glance.
- **Audition builder**
  - Purpose: design stages/blocks that yield strong evidence aligned to the rubric.
  - Data shown: stage list + order; selected stage editor; “evidence produced” summary; validation warnings.
  - Actions: add/reorder stages; add/edit blocks; set artifact requirements; preview candidate view; validate; save; go live.
  - User goal: create clear, realistic work that is evaluable and comparable.

##### Configure stages (labs, work samples, reasoning)
- MVP block types: **lab**, **work sample**, **reasoning**. “Simulation” is a stage intent implemented via these blocks (NOT a distinct MVP block).

- **Stage editor**
  - Purpose: define one stage’s objective, work prompts, and required outputs.
  - Data shown: objective; instructions; estimate/timebox; blocks list; deliverables checklist.
  - Actions: edit instructions; add/edit/remove blocks; set required artifacts; set submission constraints (final vs resubmittable).
  - User goal: remove ambiguity; ensure evidence is complete and evaluable.
- **Block editor: Lab**
  - Purpose: define a bounded practical exercise producing concrete output.
  - Data shown: prompt; constraints; assumptions; acceptance criteria; required artifacts.
  - Actions: set prompt/criteria; set artifact requirements; set time guidance.
  - User goal: test doing (implementation/execution), not claiming.
- **Block editor: Work sample**
  - Purpose: define a realistic deliverable similar to the job’s outputs.
  - Data shown: brief; audience; acceptance criteria; format; example of “good”.
  - Actions: define deliverable and criteria; set required artifacts and context prompts.
  - User goal: test output quality, completeness, and real-world fit.
- **Block editor: Reasoning**
  - Purpose: capture structured thinking and trade-offs, not trivia.
  - Data shown: scenario; questions; expected structure (assumptions → approach → risks → decision).
  - Actions: define prompts; require written artifact; optionally require reflection.
  - User goal: see decision-making clarity under constraints.

##### Define rubric
- Outcome: criteria are precise enough to enable consistent scoring across reviewers.

- **Rubric builder**
  - Purpose: define how evidence becomes a score and recommendation.
  - Data shown: criteria list; scale definition; evidence prompts per criterion; score band descriptions.
  - Actions: add/edit/reorder criteria; set scale; optionally set weights (later); lock/version note when audition is live.
  - User goal: standardize judgment to speed evaluation and improve fairness.
- **Criterion editor**
  - Purpose: define one criterion’s intent and score bands precisely.
  - Data shown: name; intent; score band definitions; red flags; evidence prompts.
  - Actions: save.
  - User goal: reduce ambiguity so scores mean the same thing across candidates.

##### Review candidates
- Outcome: each candidate gets an evidence-linked rubric evaluation and decision signal.

- **Candidate list (per audition)**
  - Purpose: answer “who needs review and where are candidates in the funnel?”
  - Data shown: candidate rows (status, stage progress, submission completeness, evaluation status, overall score if evaluated).
  - Actions: filter; open candidate review; shortlist/unshortlist; update status (advance/decline).
  - User goal: manage evaluation workload and prioritize.
- **Candidate review (artifact-first)**
  - Purpose: evaluate evidence and record a defensible assessment.
  - Data shown: artifacts by stage; notes; rubric scoring panel; overall summary (strengths/risks/recommendation).
  - Actions: open artifacts; score criteria; write rationale; attach evidence references; mark complete; shortlist/advance/decline.
  - User goal: make an evidence-grounded decision quickly and consistently.

##### Compare candidates
- Outcome: shortlist ranked/clustered by rubric + evidence, not vibes.

- **Candidate comparison (shortlist)**
  - Purpose: answer “who is strongest for this role and why?”
  - Data shown: grid of candidates × criteria; score + rationale snippet; top evidence link per criterion; risk flags.
  - Actions: sort by overall/criterion; open candidate review; add comparison notes.
  - User goal: reach alignment across reviewers with minimal re-reading.

##### Make hiring decision
- Outcome: a recorded decision with traceable justification.

- **Decision packet**
  - Purpose: consolidate evidence and rationale into a decision-ready summary.
  - Data shown: selected candidate(s); criterion highlights; key evidence links; reviewer rationales; open questions.
  - Actions: mark outcome (hire/no-hire/hold); record decision rationale.
  - User goal: finalize decision with defensible evidence.

---

### 2. Candidate UX

#### Sitemap (Candidate)
- **Auditions**
  - Audition inbox (invited/active/completed)
  - Audition overview (expectations + stage map)
  - Stage workspace (per stage)
  - Artifact submission (per stage)
  - Submission confirmation
- **Results**
  - Results overview (per audition)
  - Evaluation detail (rubric breakdown + evidence links)
- **Proof Profile**
  - Proof profile home
  - Artifact library
  - Proof highlight editor

#### Key objects (Candidate)
- **Audition**: stage map, estimates/timeboxes, deliverables, evaluation summary.
- **Stage**: objective, blocks, constraints, required artifacts, submission rules.
- **Artifact**: link/file/text + context; required vs optional; mapped to stage/block.
- **Result**: criterion scores + rationale + evidence references.
- **Proof profile**: curated highlights + artifact library tagged by capability.

#### Core flows (Candidate)

##### Receive audition
- **Audition inbox**
  - Purpose: answer “what work do I need to do next?”
  - What the user sees: invited/active/completed auditions with role, company, estimated total time, status.
  - What they do: open audition; start/resume; view completed results.
  - What matters most: clarity of effort and what they’ll produce.

##### Review expectations
- **Audition overview**
  - Purpose: answer “what is expected and how will I be evaluated?”
  - What the user sees: role context; stage map; deliverables summary; rubric criteria summary; rules (progression, time, submission policy).
  - What they do: start stage 1; check deliverables; skim rubric.
  - What matters most: unambiguous scope; reduced anxiety via clarity.

##### Complete stages
- **Stage workspace**
  - Purpose: help the candidate do the work and produce required artifacts.
  - What the user sees: stage objective; blocks in order; constraints; deliverables checklist; time guidance.
  - What they do: work through blocks; draft responses; collect links/files; prepare submission.
  - What matters most: deliverables checklist + constraints.

##### Submit artifacts
- **Artifact submission (stage)**
  - Purpose: ensure the submission is complete and evaluable.
  - What the user sees: required artifacts list with missing/added status; fields per artifact; preview of what employer will see.
  - What they do: add links/files/text; add short context; submit.
  - What matters most: preventing incomplete submissions; clear “final” meaning.
- **Submission confirmation**
  - Purpose: reassure and direct next step.
  - What the user sees: confirmation; summary of submitted artifacts; next stage availability.
  - What they do: continue or return later.
  - What matters most: confidence and momentum.

##### View results
- **Results overview (audition)**
  - Purpose: answer “how did I do and what should I improve?”
  - What the user sees: overall summary; criterion score overview; evaluator notes; stage completion.
  - What they do: open evaluation detail; add artifacts to proof profile.
  - What matters most: credible, actionable feedback tied to evidence.
- **Evaluation detail**
  - Purpose: show transparent scoring and the evidence behind it.
  - What the user sees: criteria with scores; rationales; evidence references; optional improvement notes.
  - What they do: read; curate artifacts into proof profile.
  - What matters most: fairness and learning value.

##### Build proof profile
- **Proof profile home**
  - Purpose: answer “what is my demonstrated capability story?”
  - What the user sees: curated highlights; top capabilities; selected evidence.
  - What they do: add/edit highlights; curate artifacts.
  - What matters most: durable proof, not a timeline of tests.
- **Artifact library**
  - Purpose: manage all artifacts across auditions.
  - What the user sees: artifact list with capability tags; linked evaluations; included vs private.
  - What they do: include/exclude; tag; edit context.
  - What matters most: easy curation and re-use.
- **Proof highlight editor**
  - Purpose: turn one or more artifacts into a clear proof card.
  - What the user sees: selected artifacts + prompt structure (problem → approach → outcome → trade-offs); linked criteria.
  - What they do: write summary; select supported criteria; save.
  - What matters most: transforming work into legible signals for employers.

---

### 3. Audition Model (CRITICAL)

#### What an audition is structurally
An **audition** is a **versioned evaluation specification** attached to a **role**, composed of ordered **stages**, evaluated with a **rubric**, producing **submissions** containing **artifacts**.

Minimum structure:
- audition: roleId, name/version, status (draft/live/closed)
- stageOrder: ordered stage IDs
- progression rules: how stages unlock
- time rules: expectations and optional timeboxes
- rubric reference: rubricId (or rubric version)

#### What a stage is
A **stage** is a coherent unit of work with:
- objective + candidate instructions
- blocks[] (lab/work sample/reasoning) in order
- explicit deliverables (required artifacts)
- submission rules (final vs resubmittable)

#### Block types (MVP)
- **Lab**: practical exercise → evidence of execution (repo/link) + short writeup/context.
- **Work sample**: realistic deliverable → document/deck/design/link with acceptance criteria.
- **Reasoning**: structured thinking → written response with assumptions and trade-offs.

#### How stages are ordered
- Stages follow `stageOrder` strictly.
- MVP rule: **sequential progression** only.

#### How candidates progress
Candidate state (per audition) with per-stage status:
- invited → started → in_progress → submitted → evaluated

Progression mechanics (MVP):
- Stage 1 is available on start.
- Stage \(n+1\) unlocks after stage \(n\) is submitted.
- Submitting a stage is submitting a package of artifacts; submitted stages are locked unless resubmission is enabled.

#### How time is handled
MVP treats time primarily as **expectation clarity**, not strict enforcement.
- Each stage includes `estimatedMinutes` (always visible).
- Optional `timeboxMinutes` (visible as a hard expectation; MVP can record start/submitted timestamps even if enforcement is minimal).
- Audition shows total estimated time.

#### How submissions are structured
- **Submission** = (candidateId, auditionId, stageId) + submittedAt + artifacts[]
- **Artifact** includes:
  - artifactType (link/file/text)
  - title
  - content (url/file reference/text)
  - context (short explanation)
  - optional block reference (which prompt it answers)

Evaluations attach to the candidate’s audition participation and reference artifacts explicitly.

---

### 4. Evaluation Model

#### Rubric structure
- Rubric = criteria[]
- Criterion includes:
  - name (capability)
  - intent/definition (what it means for this role)
  - evidence prompts (what to look for in artifacts)
  - score band definitions (what each score means)

#### Scoring system (MVP explicit)
Use a 1–4 scale:
- **1 = Not yet demonstrated** (missing/incorrect/unclear evidence)
- **2 = Partially demonstrated** (some correct ideas, incomplete/inconsistent execution)
- **3 = Demonstrated** (meets expectations with clear evidence)
- **4 = Strongly demonstrated** (exceeds expectations; robust, thoughtful, high-quality)

Per criterion: score + rationale + evidence references.
Overall: average (MVP) + reviewer recommendation (hire / no-hire / hold).

#### Breakdown display
Breakdown must always connect:
- criterion → score → rationale → evidence

Employer view (in candidate review):
- score selector per criterion
- rationale input per criterion
- “attach evidence” linking to specific artifacts

Candidate view (results):
- read-only scores
- rationales
- click-through to referenced artifacts

#### How employers compare candidates
Comparison is driven by:
- criterion scores (primary)
- evidence highlights (most important)
- overall score (secondary)

MVP comparison:
- shortlist candidates
- grid view candidates × criteria with score + snippet + top evidence link
- sort by any criterion and open evidence quickly

#### What “good performance” looks like
Good performance is legible as a trail of evidence:
- submissions are complete and evaluable
- artifacts meet acceptance criteria and constraints
- reasoning is structured with correct assumptions and trade-offs
- evidence supports rubric criteria with minimal reviewer inference

---

### 5. Proof Profile (DIFFERENTIATOR)

#### What replaces the resume
The proof profile replaces the resume with:
- **evidence artifacts** (the work itself)
- **capability claims backed by evidence** (rubric-linked highlights)
- **structured performance summaries** (what was demonstrated and how)

It is not a timeline of jobs, schools, or keywords. It is a curated set of “proof cards” that show demonstrated capability.

#### How candidate work is represented
Candidate work is represented in three layers:
- **Artifact** (raw evidence)
  - Examples: repo link, doc, deck, design link, written reasoning response.
  - Always includes short context: what it is, constraints, where to look.
- **Evaluation link** (structured judgment)
  - Which rubric criteria the artifact supported, with scores and rationale.
- **Proof highlight** (curated signal)
  - A candidate-authored summary that turns the artifact into a reusable, role-agnostic signal.

#### What employers actually see
Employers see:
- The candidate’s **audition artifacts** (the evidence package) and the employer’s evaluation.
- Optionally (when browsing proof profile later): a **capability-organized view**:
  - capability → strongest proof highlights → linked artifacts → linked evaluation snippets

Employer-facing proof profile must answer:
- “Can this person do the work we need?” (evidence)
- “What are they reliably good at?” (capabilities over time)
- “What are the risks/limitations?” (weak criteria, missing evidence, inconsistent outcomes)

#### How signals accumulate over time
Signals accumulate as:
- **Repeat demonstrations** of the same capability across different auditions/stages
- **Breadth** across capabilities relevant to roles
- **Depth**: higher scores + stronger evidence + better rationale quality

MVP accumulation mechanics (explicit):
- A capability highlight can reference multiple artifacts across auditions.
- A capability can show a “confidence indicator” based on:
  - number of distinct evidence items
  - recency (optional)
  - consistency (variance of criterion scores)
  - reviewer count (MVP: likely 1; later multi-review)

---

### 6. MVP scope (IMPORTANT)

#### Included in MVP
- **Employer**
  - Create roles (basic fields)
  - Create auditions (draft/live/closed)
  - Build stages and blocks (lab/work sample/reasoning)
  - Define rubric (criteria + 1–4 scale + evidence prompts)
  - Candidate list with statuses + filters
  - Candidate review: artifacts + rubric scoring + rationale + evidence references
  - Shortlist + candidate comparison grid
  - Decision packet with recorded outcome and rationale
- **Candidate**
  - Audition inbox and overview
  - Stage workspace with clear deliverables checklist
  - Artifact submission (links/text/files if supported) + submission confirmation
  - Results overview + evaluation detail (read-only rubric breakdown)
  - Proof profile: artifact library + proof highlights curated by capability
- **System-level**
  - No-auth role switcher assumptions
  - Versioned-ish behavior conceptually (audition/rubric “changes after live” should warn)
  - Auditability of evaluation via evidence references (even if simple)

#### Explicitly NOT in MVP (defer)
- **Simulators as a distinct runtime** (no embedded IDEs, no container execution, no interactive simulations)
- **Collaboration**
  - live pair work, shared docs, reviewer chat, candidate collaboration tools
- **ATS / job board integrations**
  - posting to external boards, importing candidates, syncing statuses
- **Notifications**
  - email/SMS/push reminders, scheduled nudges
- **Scheduling / interviews**
  - calendar integration, interview loops, interviewer assignment workflows
- **Advanced evaluation ops**
  - multi-reviewer calibration workflows, inter-rater reliability analytics, bias audits
- **Anti-cheat / proctoring**
  - monitoring, webcam, plagiarism detection
- **Public sharing links**
  - public proof profile URLs; granular access control (private-by-default only in MVP)
- **Templates marketplace**
  - rubric template libraries, audition template gallery (beyond a single seeded example)

---

### 7. UX principles

1. **Evidence > credentials**
   - The UI prioritizes artifacts and rationale; any “about the candidate” metadata is secondary.
2. **Structured work > abstract testing**
   - Tasks are deliverable-based with acceptance criteria; avoid trivia and opaque scoring.
3. **Clarity > cleverness**
   - Every stage has objective, constraints, deliverables checklist, and evaluation connection.
4. **Comparability requires consistency**
   - Rubrics define meaning of scores; evaluations always link scores to evidence.
5. **Progress without anxiety**
   - Candidates always know what’s required, what’s optional, and what “submit” means.
6. **Evaluation is a decision system, not a feed**
   - Employer views are organized around “who needs review” and “who to hire”, not generic dashboards.
7. **Proof compounds**
   - Work products are reusable; candidates can curate highlights into lasting capability signals.
