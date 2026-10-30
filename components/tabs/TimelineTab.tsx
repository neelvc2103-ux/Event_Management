'use client';

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Flag,
  ListTodo,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';
import { TimelineTask } from '@/types';
import { formatDate, getDaysRemaining } from '@/lib/formatters';
import { groupTasksByPhase, calculateProgress, isTaskOverdue } from '@/lib/dateUtils';

interface TimelineTabProps {
  timeline: TimelineTask[];
  eventDate: string;
  onToggleTask: (taskId: string) => void;
}

export function TimelineTab({ timeline, eventDate, onToggleTask }: TimelineTabProps) {
  const countdown = React.useMemo(() => getDaysRemaining(eventDate), [eventDate]);
  const progress = React.useMemo(() => calculateProgress(timeline), [timeline]);
  const grouped = React.useMemo(() => groupTasksByPhase(timeline), [timeline]);

  // Dynamic Dependency Tracking (Per SME instructions)
  const isVenueLocked = React.useMemo(() => {
    const venueTask = timeline.find((t) => {
      const lower = t.task.toLowerCase();
      return lower.includes('venue') || lower.includes('hall') || lower.includes('resort') || lower.includes('ground');
    });
    return venueTask ? venueTask.completed : true;
  }, [timeline]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Countdown & Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-card border border-border rounded-2xl p-6 shadow-sm">
        {/* Countdown Box */}
        <div className="sm:col-span-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shrink-0">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Event Countdown
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {countdown.label}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target Date: {formatDate(eventDate)}
            </p>
          </div>
        </div>

        {/* Progress Box */}
        <div className="sm:col-span-7 space-y-2 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="text-foreground">Checklist Progress</span>
            <span className="text-primary">{progress.percent}% Completed</span>
          </div>

          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>
              {progress.completed} of {progress.total} tasks completed
            </span>
            {progress.overdue > 0 && (
              <span className="inline-flex items-center gap-1 text-destructive font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {progress.overdue} task(s) overdue
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grouped Tasks by Phase */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([phaseName, tasks]) => {
          const phaseCompleted = tasks.filter((t) => t.completed).length;
          return (
            <div
              key={phaseName}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Phase Header */}
              <div className="px-6 py-4 bg-muted/40 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ListTodo className="w-4 h-4 text-primary" />
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    {phaseName}
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  {phaseCompleted}/{tasks.length} done
                </span>
              </div>

              {/* Tasks List */}
              <div className="divide-y divide-border/60">
                {tasks.map((task) => {
                  const overdue = isTaskOverdue(task.dueDate, task.completed);
                  return (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`w-full text-left p-4 sm:px-6 flex items-start gap-3.5 hover:bg-muted/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        task.completed ? 'opacity-60 bg-muted/10' : ''
                      } ${overdue ? 'bg-destructive/5' : ''}`}
                    >
                      {/* Checkbox Icon */}
                      <span className="mt-0.5 shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary fill-primary/20" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </span>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`text-xs sm:text-sm font-semibold text-foreground leading-snug ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {task.task}
                          </p>

                          {/* Overdue Badge */}
                          {overdue && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/25">
                              <AlertCircle className="w-3 h-3" />
                              Overdue
                            </span>
                          )}

                          {/* Priority Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              task.priority === 'high'
                                ? 'bg-destructive/10 text-destructive'
                                : task.priority === 'medium'
                                ? 'bg-accent/20 text-accent-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Dynamic Task Dependency Badges (SME Recommended) */}
                          {(() => {
                            const lower = task.task.toLowerCase();
                            const isAnchor = lower.includes('venue') || lower.includes('hall') || lower.includes('resort') || lower.includes('ground');
                            const isDownstream = lower.includes('invit') || lower.includes('cater') || lower.includes('decor') || lower.includes('print') || lower.includes('sound');

                            if (isAnchor) {
                              return (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                                  <GitBranch className="w-2.5 h-2.5 text-primary" />
                                  <span>Core Anchor Task</span>
                                </span>
                              );
                            }

                            if (isDownstream && !task.completed) {
                              if (!isVenueLocked) {
                                return (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25 flex items-center gap-1">
                                    <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                    <span>Prerequisite: Lock Venue First</span>
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>Prerequisite Cleared</span>
                                  </span>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>

                        {/* Due Date & Milestone Info */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            Due: {formatDate(task.dueDate)}
                          </span>
                          <span>•</span>
                          <span>
                            {task.daysBeforeEvent > 0
                              ? `${task.daysBeforeEvent} days before event`
                              : 'Event day'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
