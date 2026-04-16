import { EmptyState, PageHeader, Panel, Toolbar } from "@metriq/ui";

export default function EmployerComparePage() {
  return (
    <>
      <PageHeader
        title="Compare"
        description="Side-by-side evidence and rubric deltas for decision-ready comparisons."
      />

      <div className="mt-6 grid gap-4">
        <Toolbar left={null} right={null} />
        <Panel title="Comparison grid" description="Evidence-first comparison across candidates/submissions.">
          <EmptyState
            title="Select submissions to compare"
            description="Start from Review or Pipeline to compare two or more submissions."
          />
        </Panel>
      </div>
    </>
  );
}

