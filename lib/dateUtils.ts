import { TimelineTask } from '@/types';

export interface TimelineAdjustmentResult {
  timeline: TimelineTask[];
  wasCompressed: boolean;
  compressionNotice?: string;
  totalDaysRemaining: number;
}

export type RawTimelineInput = {
  id?: string;
  phase: string;
  daysBeforeEvent: number;
  task: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  completed?: boolean;
};

/**
 * Calculates and sanitizes timeline task dates backward from the event date.
 * Guarantees:
 * 1. Due dates NEVER fall in the past.
 * 2. If the event date is very close (e.g., < 30 days), the timeline is automatically compressed
 *    and distributed evenly across the remaining days.
 * 3. Dates are formatted as YYYY-MM-DD strings.
 */
export function calculateTimelineDates(
  tasks: RawTimelineInput[],
  eventDateStr: string,
  referenceDate: Date = new Date()
): TimelineAdjustmentResult {
  if (!tasks || tasks.length === 0) {
    return { timeline: [], wasCompressed: false, totalDaysRemaining: 0 };
  }

  const today = new Date(referenceDate);
  if (isNaN(today.getTime())) today.setTime(Date.now());
  today.setHours(0, 0, 0, 0);

  let eventDate = new Date(eventDateStr);
  if (isNaN(eventDate.getTime())) {
    eventDate = new Date(today);
  }
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const totalDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let wasCompressed = false;

  // Sort tasks by daysBeforeEvent descending (furthest out to nearest)
  const sortedTasks = [...tasks].sort((a, b) => b.daysBeforeEvent - a.daysBeforeEvent);

  const maxDaysBefore = sortedTasks.length > 0 ? sortedTasks[0].daysBeforeEvent : 0;

  // Check if any task would fall in the past or if total window is shorter than recommended
  const needsCompression = maxDaysBefore > totalDaysRemaining || totalDaysRemaining < 21;

  const adjustedTimeline: TimelineTask[] = sortedTasks.map((task, index) => {
    let daysBefore = task.daysBeforeEvent;

    if (needsCompression) {
      wasCompressed = true;
      // Proportional compression: scale daysBeforeEvent to fit in [0, totalDaysRemaining]
      if (maxDaysBefore > 0 && totalDaysRemaining > 0) {
        const ratio = daysBefore / maxDaysBefore;
        // Distribute within remaining days, leaving some buffer for final tasks
        daysBefore = Math.round(ratio * Math.max(1, totalDaysRemaining - 1));
      } else {
        // Event is today or tomorrow; stagger sequentially
        daysBefore = Math.max(0, totalDaysRemaining - index);
      }
    }

    // Ensure daysBefore never exceeds totalDaysRemaining (which would put it in the past)
    if (daysBefore > totalDaysRemaining) {
      daysBefore = Math.max(0, totalDaysRemaining - 1);
      wasCompressed = true;
    }

    // Calculate actual due date: eventDate - daysBefore
    const dueTime = new Date(eventDate);
    dueTime.setDate(dueTime.getDate() - daysBefore);

    // If still in the past due to edge cases, clamp to today
    if (dueTime.getTime() < today.getTime()) {
      dueTime.setTime(today.getTime());
      wasCompressed = true;
    }

    const yyyy = dueTime.getFullYear();
    const mm = String(dueTime.getMonth() + 1).padStart(2, '0');
    const dd = String(dueTime.getDate()).padStart(2, '0');
    const formattedDueDate = `${yyyy}-${mm}-${dd}`;

    return {
      id: task.id || `task-${index + 1}-${Math.random().toString(36).substring(2, 6)}`,
      phase: task.phase || 'General Planning',
      daysBeforeEvent: daysBefore,
      dueDate: formattedDueDate,
      task: task.task,
      priority: task.priority || 'medium',
      completed: task.completed ?? false,
    };
  });

  // Re-sort chronologically by due date ascending
  adjustedTimeline.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  let compressionNotice: string | undefined;
  if (wasCompressed) {
    if (totalDaysRemaining <= 7) {
      compressionNotice = `Accelerated Rush Plan: Your event is in ${totalDaysRemaining} day(s). All critical milestones have been compressed into rapid high-priority sprints!`;
    } else {
      compressionNotice = `Fast-Track Plan: Optimized for ${totalDaysRemaining} days remaining. All vendor bookings and tasks have been adjusted to ensure no deadlines fall in the past.`;
    }
  }

  return {
    timeline: adjustedTimeline,
    wasCompressed,
    compressionNotice,
    totalDaysRemaining,
  };
}

/**
 * Checks if a task is overdue
 */
export function isTaskOverdue(dueDateStr: string, completed?: boolean, referenceDate: Date = new Date()): boolean {
  if (completed) return false;
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  return due.getTime() < today.getTime();
}

/**
 * Group timeline tasks by phase name
 */
export function groupTasksByPhase(timeline: TimelineTask[]): Record<string, TimelineTask[]> {
  const groups: Record<string, TimelineTask[]> = {};
  for (const task of timeline) {
    const phase = task.phase || 'General Planning';
    if (!groups[phase]) {
      groups[phase] = [];
    }
    groups[phase].push(task);
  }
  return groups;
}

/**
 * Compute progress statistics
 */
export function calculateProgress(timeline: TimelineTask[]): {
  total: number;
  completed: number;
  overdue: number;
  percent: number;
} {
  if (!timeline || timeline.length === 0) {
    return { total: 0, completed: 0, overdue: 0, percent: 0 };
  }

  const total = timeline.length;
  const completed = timeline.filter((t) => t.completed).length;
  const overdue = timeline.filter((t) => isTaskOverdue(t.dueDate, t.completed)).length;
  const percent = Math.round((completed / total) * 100);

  return { total, completed, overdue, percent };
}
