import { describe, it, expect } from 'vitest';
import { workflowExecutionEngine } from '../src/lib/workflow/engine';
import { initialWorkflows } from '../src/lib/store';
import { Workflow } from '../src/lib/types';

describe('WorkflowExecutionEngine', () => {
  it('validates a correct workflow', () => {
    const validWf = initialWorkflows[0];
    const validation = workflowExecutionEngine.validate(validWf);
    expect(validation.valid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('detects duplicate step orders', () => {
    const brokenWf: Workflow = {
      id: 'wf-broken',
      name: 'Broken Order Workflow',
      description: 'Test wf',
      trigger: 'Manual',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [
        {
          id: 'step-1',
          type: 'trigger_form_submit',
          title: 'Trigger',
          description: 'Desc',
          config: {},
          order: 1,
        },
        {
          id: 'step-2',
          type: 'crm_contact_update',
          title: 'Sync',
          description: 'Desc',
          config: {},
          order: 1, // Duplicate order
        },
      ],
    };

    const validation = workflowExecutionEngine.validate(brokenWf);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes('Duplicate step order'))).toBe(true);
  });

  it('executes a workflow and pauses at human supervisor gate when requested', async () => {
    const wf = initialWorkflows[0];
    const runResult = await workflowExecutionEngine.execute(wf, true);

    expect(runResult.status).toBe('halted_at_human_review');
    expect(runResult.stepResults.length).toBe(4); // Stops at Step 4 (human supervisor approval)
    const haltedStep = runResult.stepResults[runResult.stepResults.length - 1];
    expect(haltedStep.status).toBe('requires_human_approval');
  });

  it('completes all steps when human approval pause is bypassed', async () => {
    const wf = initialWorkflows[0];
    const runResult = await workflowExecutionEngine.execute(wf, false);

    expect(runResult.status).toBe('completed');
    expect(runResult.stepResults.length).toBe(wf.steps.length);
  });
});
