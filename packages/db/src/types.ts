import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Uuid = string;

export type CandidateTable = {
  id: Generated<Uuid>;
  email: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  created_at: Generated<Timestamp>;
};

export type CompanyTable = {
  id: Generated<Uuid>;
  name: string;
  created_at: Generated<Timestamp>;
};

export type EmployerTable = {
  id: Generated<Uuid>;
  company_id: Uuid;
  email: string;
  full_name: string;
  created_at: Generated<Timestamp>;
};

export type SimulationTable = {
  id: Generated<Uuid>;
  title: string;
  summary: string;
  simulation_type: string;
  difficulty: string;
  estimated_minutes: number;
  skills: string[] | null;
  created_at: Generated<Timestamp>;
};

export type SimulationSectionTable = {
  id: Generated<Uuid>;
  simulation_id: Uuid;
  position: number;
  title: string;
  prompt: string;
  required_artifacts: unknown | null;
};

export type RubricTable = {
  id: Generated<Uuid>;
  simulation_id: Uuid;
  title: string;
  created_at: Generated<Timestamp>;
};

export type RubricCriterionTable = {
  id: Generated<Uuid>;
  rubric_id: Uuid;
  position: number;
  name: string;
  description: string | null;
  weight: string;
  max_score: number;
};

export type SubmissionTable = {
  id: Generated<Uuid>;
  simulation_id: Uuid;
  candidate_id: Uuid;
  status: string;
  started_at: Timestamp;
  submitted_at: Timestamp | null;
  created_at: Generated<Timestamp>;
};

export type SubmissionArtifactTable = {
  id: Generated<Uuid>;
  submission_id: Uuid;
  kind: string;
  label: string;
  content: string;
  created_at: Generated<Timestamp>;
};

export type EvaluationTable = {
  id: Generated<Uuid>;
  submission_id: Uuid;
  overall_score: string;
  summary: string | null;
  evaluated_at: Timestamp;
  created_at: Generated<Timestamp>;
};

export type ScoreBreakdownTable = {
  id: Generated<Uuid>;
  evaluation_id: Uuid;
  criterion_id: Uuid;
  score: string;
  notes: string | null;
};

export type Database = {
  candidate: CandidateTable;
  company: CompanyTable;
  employer: EmployerTable;
  simulation: SimulationTable;
  simulation_section: SimulationSectionTable;
  rubric: RubricTable;
  rubric_criterion: RubricCriterionTable;
  submission: SubmissionTable;
  submission_artifact: SubmissionArtifactTable;
  evaluation: EvaluationTable;
  score_breakdown: ScoreBreakdownTable;
};

export type Candidate = Selectable<CandidateTable>;
export type NewCandidate = Insertable<CandidateTable>;
export type CandidateUpdate = Updateable<CandidateTable>;

export type Company = Selectable<CompanyTable>;
export type NewCompany = Insertable<CompanyTable>;
export type CompanyUpdate = Updateable<CompanyTable>;

export type Employer = Selectable<EmployerTable>;
export type NewEmployer = Insertable<EmployerTable>;
export type EmployerUpdate = Updateable<EmployerTable>;

export type Simulation = Selectable<SimulationTable>;
export type NewSimulation = Insertable<SimulationTable>;
export type SimulationUpdate = Updateable<SimulationTable>;

export type SimulationSection = Selectable<SimulationSectionTable>;
export type NewSimulationSection = Insertable<SimulationSectionTable>;
export type SimulationSectionUpdate = Updateable<SimulationSectionTable>;

export type Rubric = Selectable<RubricTable>;
export type NewRubric = Insertable<RubricTable>;
export type RubricUpdate = Updateable<RubricTable>;

export type RubricCriterion = Selectable<RubricCriterionTable>;
export type NewRubricCriterion = Insertable<RubricCriterionTable>;
export type RubricCriterionUpdate = Updateable<RubricCriterionTable>;

export type Submission = Selectable<SubmissionTable>;
export type NewSubmission = Insertable<SubmissionTable>;
export type SubmissionUpdate = Updateable<SubmissionTable>;

export type SubmissionArtifact = Selectable<SubmissionArtifactTable>;
export type NewSubmissionArtifact = Insertable<SubmissionArtifactTable>;
export type SubmissionArtifactUpdate = Updateable<SubmissionArtifactTable>;

export type Evaluation = Selectable<EvaluationTable>;
export type NewEvaluation = Insertable<EvaluationTable>;
export type EvaluationUpdate = Updateable<EvaluationTable>;

export type ScoreBreakdown = Selectable<ScoreBreakdownTable>;
export type NewScoreBreakdown = Insertable<ScoreBreakdownTable>;
export type ScoreBreakdownUpdate = Updateable<ScoreBreakdownTable>;

