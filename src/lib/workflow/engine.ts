import { Workflow, WorkflowRunResult, WorkflowStepExecutionResult } from '../types';

export class WorkflowExecutionEngine {
  /**
   * Validates if workflow has valid steps, unique orders, and non-empty parameters.
   */
  public validate(workflow: Workflow): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!workflow.name || workflow.name.trim().length < 2) {
      errors.push('Workflow name must have at least 2 characters.');
    }
    if (!workflow.steps || workflow.steps.length === 0) {
      errors.push('Workflow must contain at least one step.');
    }

    const seenOrders = new Set<number>();
    workflow.steps.forEach((step, idx) => {
      if (seenOrders.has(step.order)) {
        errors.push(`Duplicate step order ${step.order} at step #${idx + 1}.`);
      }
      seenOrders.add(step.order);
      if (!step.title || step.title.trim().length === 0) {
        errors.push(`Step #${idx + 1} is missing a descriptive title.`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Executes workflow steps deterministically with simulated latencies and realistic state outputs.
   */
  public async execute(workflow: Workflow, stopAtHumanApproval = false): Promise<WorkflowRunResult> {
    const sortedSteps = [...workflow.steps].sort((a, b) => a.order - b.order);
    const runId = `run-${Date.now()}`;
    const startedAt = new Date().toISOString();
    const stepResults: WorkflowStepExecutionResult[] = [];
    let overallStatus: 'completed' | 'halted_at_human_review' | 'failed' = 'completed';

    for (const step of sortedSteps) {
      const stepStartTime = Date.now();
      let outputText = '';
      let status: WorkflowStepExecutionResult['status'] = 'success';

      switch (step.type) {
        case 'trigger_inbound_call':
        case 'trigger_form_submit':
          outputText = `Trigger event received: Payload parsed successfully from ${step.config.source || 'Inbound Webhook'}.`;
          break;

        case 'ai_intent_extraction':
          outputText = `Intent identified as "Appointment Scheduling". Entities: { patient: "Ananya Sharma", department: "General Medicine", urgency: "Normal", language: "English/Telugu" }.`;
          break;

        case 'voice_call_initiation':
          outputText = `Dispatched MEOW Voice Agent (Telugu/English). Call duration: 42s. Caller confirmed slot tomorrow at 5:30 PM.`;
          break;

        case 'human_supervisor_approval':
          if (stopAtHumanApproval) {
            status = 'requires_human_approval';
            outputText = `Execution halted at human oversight gate. Awaiting supervisor authorization for high-priority dispatch.`;
            overallStatus = 'halted_at_human_review';
          } else {
            outputText = `Supervisor policy check passed automatically (Rule threshold satisfied). Proceeding.`;
          }
          break;

        case 'calendar_slot_reserve':
          outputText = `Slot locked on Clinic Master Calendar: Dr. Rao (17:30 - 18:00 IST). Reservation ID: #SLOT-9842.`;
          break;

        case 'crm_contact_update':
          outputText = `HubSpot / CRM contact created & synced: ID #LEAD-7749. Opportunity stage updated to "Appointment Confirmed".`;
          break;

        case 'sms_whatsapp_notification':
          outputText = `Dispatched bilingual WhatsApp confirmation template with Google Maps pin & cancellation link. Delivery receipt: 200 OK.`;
          break;

        default:
          outputText = `Executed custom integration step "${step.title}" successfully.`;
      }

      const latencyMs = Math.max(120, Math.floor(Math.random() * 380) + 100);

      stepResults.push({
        stepId: step.id,
        stepType: step.type,
        status,
        output: outputText,
        timestamp: new Date().toISOString(),
        latencyMs,
      });

      if (status === 'requires_human_approval') {
        break; // Stop further execution until human approves
      }
    }

    return {
      runId,
      workflowId: workflow.id,
      status: overallStatus,
      startedAt,
      finishedAt: new Date().toISOString(),
      stepResults,
    };
  }
}

export const workflowExecutionEngine = new WorkflowExecutionEngine();
