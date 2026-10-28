import { describe, it, expect } from 'vitest';
import { calculateTimelineDates, isTaskOverdue, groupTasksByPhase, calculateProgress } from '../lib/dateUtils';

describe('Timeline Date Calculations', () => {
  const mockReferenceDate = new Date('2026-11-01T00:00:00Z');

  it('calculates due dates backward from event date without falling in past', () => {
    // Event is 90 days away from reference date
    const eventDate = '2027-01-30';
    const rawTasks = [
      { id: '1', phase: 'Planning', daysBeforeEvent: 60, task: 'Book Caterer', priority: 'high' as const },
      { id: '2', phase: 'Invitations', daysBeforeEvent: 30, task: 'Send Invites', priority: 'medium' as const },
      { id: '3', phase: 'Final', daysBeforeEvent: 7, task: 'Final Guest Count', priority: 'high' as const },
    ];

    const result = calculateTimelineDates(rawTasks, eventDate, mockReferenceDate);

    expect(result.wasCompressed).toBe(false);
    expect(result.timeline.length).toBe(3);

    // Ensure all due dates are >= referenceDate
    result.timeline.forEach((task) => {
      const taskDate = new Date(task.dueDate);
      expect(taskDate.getTime()).toBeGreaterThanOrEqual(mockReferenceDate.getTime());
    });
  });

  it('compresses the timeline and flags notice when event date is too close', () => {
    // Event is only 10 days away
    const eventDate = '2026-11-11';
    // Tasks originally scheduled 60, 30, and 15 days before
    const rawTasks = [
      { id: '1', phase: 'Planning', daysBeforeEvent: 60, task: 'Book Caterer', priority: 'high' as const },
      { id: '2', phase: 'Invitations', daysBeforeEvent: 30, task: 'Send Invites', priority: 'medium' as const },
      { id: '3', phase: 'Final', daysBeforeEvent: 15, task: 'Final Tasting', priority: 'high' as const },
    ];

    const result = calculateTimelineDates(rawTasks, eventDate, mockReferenceDate);

    expect(result.wasCompressed).toBe(true);
    expect(result.compressionNotice).toBeDefined();

    // Verify all compressed tasks fall between reference date and event date
    const eventDateTime = new Date(eventDate).getTime();
    result.timeline.forEach((task) => {
      const taskDate = new Date(task.dueDate).getTime();
      expect(taskDate).toBeGreaterThanOrEqual(mockReferenceDate.getTime());
      expect(taskDate).toBeLessThanOrEqual(eventDateTime);
    });
  });

  it('correctly identifies overdue tasks against a reference date', () => {
    expect(isTaskOverdue('2026-10-15', false, mockReferenceDate)).toBe(true);
    expect(isTaskOverdue('2026-11-15', false, mockReferenceDate)).toBe(false);
    // Completed tasks are never overdue
    expect(isTaskOverdue('2026-10-15', true, mockReferenceDate)).toBe(false);
  });

  it('calculates progress percentage correctly', () => {
    const tasks = [
      { id: '1', phase: 'P1', daysBeforeEvent: 10, dueDate: '2026-11-05', task: 'Task 1', priority: 'high' as const, completed: true },
      { id: '2', phase: 'P1', daysBeforeEvent: 5, dueDate: '2026-11-08', task: 'Task 2', priority: 'medium' as const, completed: false },
      { id: '3', phase: 'P2', daysBeforeEvent: 2, dueDate: '2026-11-10', task: 'Task 3', priority: 'low' as const, completed: true },
      { id: '4', phase: 'P2', daysBeforeEvent: 1, dueDate: '2026-11-11', task: 'Task 4', priority: 'medium' as const, completed: false },
    ];

    const progress = calculateProgress(tasks);
    expect(progress.total).toBe(4);
    expect(progress.completed).toBe(2);
    expect(progress.percent).toBe(50);
  });
});
