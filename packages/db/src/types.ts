import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Uuid = string;

export type CandidateTable = {
  id: Generated<Uuid>;
  email: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  user_id: Uuid | null;
  created_at: Generated<Timestamp>;
};

export type CompanyTable = {
  id: Generated<Uuid>;
  name: string;
  slug: string;
  organization_id: Uuid | null;
  created_at: Generated<Timestamp>;
};

export type WorkspaceTable = {
  id: Generated<Uuid>;
  company_id: Uuid;
  slug: string;
  name: string;
  seat_limit: number | null;
  seats_used: number | null;
  status: string;
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
  simulation_id: Uuid | null;
  candidate_id: Uuid;
  status: string;
  started_at: Timestamp;
  submitted_at: Timestamp | null;
  created_at: Generated<Timestamp>;
  audition_id: Uuid | null;
  audition_stage_id: string | null;
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

export type AuditionTable = {
  id: Generated<Uuid>;
  workspace_id: Uuid;
  title: string;
  status: string;
  level: string | null;
  template: string | null;
  timebox_minutes: number | null;
  definition: unknown;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};

export type AuditionInviteTable = {
  id: Generated<Uuid>;
  token: string;
  audition_id: Uuid;
  workspace_id: Uuid;
  email: string | null;
  expires_at: Timestamp | null;
  created_at: Generated<Timestamp>;
};

export type AuditionApplicationTable = {
  id: Generated<Uuid>;
  audition_id: Uuid;
  workspace_id: Uuid;
  candidate_id: Uuid;
  status: string;
  invite_id: Uuid | null;
  created_at: Generated<Timestamp>;
};

export type WorkspaceMembershipTable = {
  id: Generated<Uuid>;
  workspace_id: Uuid;
  email: string;
  name: string | null;
  role: string;
  user_id: Uuid | null;
  created_at: Generated<Timestamp>;
};

/** Better Auth + plugins — column names match migrations (camelCase identifiers). */
export type AuthUserTable = {
  id: Generated<Uuid>;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Timestamp | null;
  stripeCustomerId: string | null;
};

export type BaSessionTable = {
  id: Generated<Uuid>;
  expiresAt: Timestamp;
  token: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ipAddress: string | null;
  userAgent: string | null;
  userId: Uuid;
  activeOrganizationId: string | null;
  impersonatedBy: string | null;
};

export type BaAccountTable = {
  id: Generated<Uuid>;
  accountId: string;
  providerId: string;
  userId: Uuid;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Timestamp | null;
  refreshTokenExpiresAt: Timestamp | null;
  scope: string | null;
  password: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type BaVerificationTable = {
  id: Generated<Uuid>;
  identifier: string;
  value: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type BaOrganizationTable = {
  id: Generated<Uuid>;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Timestamp;
  metadata: string | null;
  stripeCustomerId: string | null;
};

export type BaMemberTable = {
  id: Generated<Uuid>;
  organizationId: Uuid;
  userId: Uuid;
  role: string;
  createdAt: Timestamp;
};

export type BaInvitationTable = {
  id: Generated<Uuid>;
  organizationId: Uuid;
  email: string;
  role: string | null;
  status: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  inviterId: Uuid;
};

export type BaApiKeyTable = {
  id: Generated<Uuid>;
  configId: string;
  name: string | null;
  start: string | null;
  referenceId: string;
  prefix: string | null;
  key: string;
  refillInterval: number | null;
  refillAmount: number | null;
  lastRefillAt: Timestamp | null;
  enabled: boolean | null;
  rateLimitEnabled: boolean | null;
  rateLimitTimeWindow: number | null;
  rateLimitMax: number | null;
  requestCount: number | null;
  remaining: number | null;
  lastRequest: Timestamp | null;
  expiresAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  permissions: string | null;
  metadata: string | null;
};

export type BaSubscriptionTable = {
  id: Generated<Uuid>;
  plan: string;
  referenceId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
  periodStart: Timestamp | null;
  periodEnd: Timestamp | null;
  trialStart: Timestamp | null;
  trialEnd: Timestamp | null;
  cancelAtPeriodEnd: boolean | null;
  cancelAt: Timestamp | null;
  canceledAt: Timestamp | null;
  endedAt: Timestamp | null;
  seats: number | null;
  billingInterval: string | null;
  stripeScheduleId: string | null;
};

export type CompanyEntitlementTable = {
  company_id: Uuid;
  plan_key: string;
  subscription_status: string;
  limits: unknown;
  features: unknown;
  updated_at: Generated<Timestamp>;
};

export type NotificationTable = {
  id: Generated<Uuid>;
  candidate_id: Uuid | null;
  employer_id: Uuid | null;
  workspace_id: Uuid | null;
  category: string;
  title: string;
  body: string;
  link_href: string | null;
  read_at: Timestamp | null;
  metadata: unknown | null;
  created_at: Generated<Timestamp>;
};

export type Database = {
  auth_user: AuthUserTable;
  session: BaSessionTable;
  account: BaAccountTable;
  verification: BaVerificationTable;
  organization: BaOrganizationTable;
  member: BaMemberTable;
  invitation: BaInvitationTable;
  apikey: BaApiKeyTable;
  subscription: BaSubscriptionTable;
  candidate: CandidateTable;
  company: CompanyTable;
  workspace: WorkspaceTable;
  employer: EmployerTable;
  audition: AuditionTable;
  audition_invite: AuditionInviteTable;
  audition_application: AuditionApplicationTable;
  workspace_membership: WorkspaceMembershipTable;
  company_entitlement: CompanyEntitlementTable;
  notification: NotificationTable;
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

export type Workspace = Selectable<WorkspaceTable>;
export type NewWorkspace = Insertable<WorkspaceTable>;
export type WorkspaceUpdate = Updateable<WorkspaceTable>;

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

export type Audition = Selectable<AuditionTable>;
export type NewAudition = Insertable<AuditionTable>;
export type AuditionUpdate = Updateable<AuditionTable>;

export type NotificationRow = Selectable<NotificationTable>;
export type NewNotification = Insertable<NotificationTable>;
export type NotificationUpdate = Updateable<NotificationTable>;

