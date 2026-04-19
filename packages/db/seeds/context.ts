import type { Candidate, Company, Rubric, RubricCriterion, Simulation, Workspace } from "../src/types";

/** Populated across ordered seed steps; used to wire submissions and evaluations. */
export type SeedContext = {
  acme: Company;
  metriqDemo: Company;
  workspaces: Workspace[];
  wsEng: Workspace;
  wsGtm: Workspace;
  candidates: Candidate[];
  simBugHunt: Simulation;
  simApiDesign: Simulation;
  simPrReview: Simulation;
  rubricRows: Rubric[];
  criteria: RubricCriterion[];
};
