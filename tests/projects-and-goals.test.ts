import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/db';

describe('MEOW Projects, Memory Vault & Resume Engine', () => {
  it('should retrieve seeded projects including flagship career and clinic goals', async () => {
    const projects = await db.getProjects();
    expect(projects.length).toBeGreaterThanOrEqual(2);

    const careerProj = projects.find((p) => p.segment === 'personal');
    expect(careerProj).toBeDefined();
    expect(careerProj?.assignedEmployee.name).toBe('Alex');
    expect(careerProj?.steps.length).toBe(4);
    expect(careerProj?.artifacts.length).toBeGreaterThanOrEqual(1);

    const businessProj = projects.find((p) => p.segment === 'business');
    expect(businessProj).toBeDefined();
    expect(businessProj?.assignedEmployee.name).toContain('Sara');
  });

  it('should add, update, and manage a new project lifecycle', async () => {
    const newProj = await db.addProject({
      title: 'Summer 2026 Residency Research',
      prompt: 'Identify top teaching hospitals in Bengaluru and prepare application draft',
      segment: 'personal',
      assignedEmployee: {
        name: 'Alex',
        role: 'Research Specialist',
        avatar: 'Alex',
      },
      status: 'planning',
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Research Hospitals',
          description: 'Gather top 5 accredited institutions',
          status: 'completed',
          outputSummary: 'Identified 5 teaching hospitals',
        },
      ],
      artifacts: [
        {
          id: 'art-test',
          type: 'report',
          title: 'Hospital Register',
          content: 'Manipal, Fortis, Apollo, Aster, Sakra',
        },
      ],
    });

    expect(newProj.id).toBeDefined();
    expect(newProj.title).toBe('Summer 2026 Residency Research');

    const updated = await db.updateProject(newProj.id, {
      status: 'completed',
    });
    expect(updated?.status).toBe('completed');

    const fetched = await db.getProject(newProj.id);
    expect(fetched?.status).toBe('completed');

    const deleted = await db.deleteProject(newProj.id);
    expect(deleted).toBe(true);
  });

  it('should manage memory vault items seamlessly', async () => {
    const initialMemories = await db.getMemories();
    expect(initialMemories.length).toBeGreaterThanOrEqual(1);

    const added = await db.addMemory({
      key: 'Test Goal',
      value: 'Achieve 10,000 active students on MEOW platform',
      category: 'career',
    });
    expect(added.id).toBeDefined();

    const updated = await db.updateMemory(added.id, {
      value: 'Achieve 25,000 active students on MEOW platform',
    });
    expect(updated?.value).toContain('25,000');

    const deleted = await db.deleteMemory(added.id);
    expect(deleted).toBe(true);
  });

  it('should retrieve and manage tailored career resumes', async () => {
    const resumes = await db.getResumes();
    expect(resumes.length).toBeGreaterThanOrEqual(1);

    const first = resumes[0];
    expect(first.fullName).toBe('Ram Nivas Attanti');
    expect(first.atsScore).toBeGreaterThanOrEqual(90);
    expect(first.skills.length).toBeGreaterThan(5);
    expect(first.experience.length).toBeGreaterThan(0);
  });

  it('should include projects, memories, and resumes in database stats', async () => {
    const stats = await db.getStats();
    expect(stats.collections.projects).toBeGreaterThanOrEqual(2);
    expect(stats.collections.memories).toBeGreaterThanOrEqual(4);
    expect(stats.collections.resumes).toBeGreaterThanOrEqual(1);
  });
});

