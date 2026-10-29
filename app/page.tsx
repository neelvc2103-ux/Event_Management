'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/Navbar';
import { LandingHero } from '@/components/LandingHero';
import { MultiStepForm } from '@/components/MultiStepForm';
import { LoadingPlanState } from '@/components/LoadingPlanState';
import { PlanDashboard } from '@/components/PlanDashboard';
import { SavedPlansDrawer } from '@/components/SavedPlansDrawer';
import { DigitalPassModal } from '@/components/DigitalPassModal';
import { decodeShareTokenToPlan } from '@/lib/shareUtils';
import { EventFormData, EventPlan } from '@/types';
import {
  getAllPlans,
  savePlan,
  deletePlan,
  getActivePlan,
  createSamplePlan,
  SAMPLE_INPUTS,
} from '@/lib/storage';

export default function Home() {
  const [view, setView] = useState<'landing' | 'form' | 'loading' | 'plan'>('landing');
  const [plans, setPlans] = useState<EventPlan[]>([]);
  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [formPrefill, setFormPrefill] = useState<EventFormData | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isGlobalPassOpen, setIsGlobalPassOpen] = useState(false);
  const [sharedNotice, setSharedNotice] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize plans from localStorage on mount & check URL params (?share=, ?planId=, ?view=pass)
  useEffect(() => {
    const saved = getAllPlans();
    setPlans(saved);

    const active = getActivePlan();
    if (active) {
      setActivePlan(active);
    }

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shareToken = urlParams.get('share');
      const planId = urlParams.get('planId');
      const viewParam = urlParams.get('view');

      if (viewParam === 'pass') {
        setIsGlobalPassOpen(true);
      }

      if (shareToken) {
        decodeShareTokenToPlan(shareToken).then((sharedPlan) => {
          if (sharedPlan) {
            savePlan(sharedPlan);
            setActivePlan(sharedPlan);
            setPlans(getAllPlans());
            setView('plan');
            setSharedNotice(`Loaded co-planner shared plan: "${sharedPlan.formData.eventName}"`);
            triggerConfetti();
          }
        });
      } else if (planId) {
        const found = saved.find((p) => p.id === planId);
        if (found) {
          setActivePlan(found);
          setView('plan');
        } else {
          fetch(`/api/share?id=${encodeURIComponent(planId)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.plan) {
                savePlan(data.plan);
                setActivePlan(data.plan);
                setPlans(getAllPlans());
                setView('plan');
                setSharedNotice(`Loaded cloud plan: "${data.plan.formData.eventName}"`);
                triggerConfetti();
              }
            })
            .catch(() => {});
        }
      }
    }

    // Check dark mode
    const isDark =
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B1E3F', '#F59E0B', '#D97706', '#065F46', '#E2725B'],
      });
    } catch {
      // ignore
    }
  };

  // Launch plan creation
  const handleStartPlanning = () => {
    setFormPrefill(null);
    setView('form');
  };

  // Load a sample scenario
  const handleSelectSample = (sampleKey: keyof typeof SAMPLE_INPUTS) => {
    const sample = createSamplePlan(sampleKey);
    savePlan(sample);
    setActivePlan(sample);
    setPlans(getAllPlans());
    setView('plan');
    triggerConfetti();
  };

  // Submit form and generate plan via API
  const handleFormSubmit = async (formData: EventFormData) => {
    setView('loading');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate your event plan.');
      }

      const generatedPlan: EventPlan = data;
      savePlan(generatedPlan);
      setActivePlan(generatedPlan);
      setPlans(getAllPlans());
      setView('plan');
      triggerConfetti();
    } catch (err: any) {
      console.error('Error generating plan:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setView('form');
    }
  };

  // Update existing plan
  const handleUpdatePlan = (updatedPlan: EventPlan) => {
    savePlan(updatedPlan);
    setActivePlan(updatedPlan);
    setPlans(getAllPlans());
  };

  // Delete plan
  const handleDeletePlan = (id: string) => {
    deletePlan(id);
    const updated = getAllPlans();
    setPlans(updated);
    if (activePlan?.id === id) {
      if (updated.length > 0) {
        setActivePlan(updated[0]);
      } else {
        setActivePlan(null);
        setView('landing');
      }
    }
  };

  // Switch to selected plan
  const handleSelectSavedPlan = (plan: EventPlan) => {
    setActivePlan(plan);
    setView('plan');
  };

  // Re-open form with active plan's parameters
  const handleEditActiveForm = () => {
    if (activePlan) {
      setFormPrefill(activePlan.formData);
      setView('form');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenSavedPlans={() => setIsSavedDrawerOpen(true)}
        onNewPlan={handleStartPlanning}
        onOpenVipPass={() => setIsGlobalPassOpen(true)}
        savedPlansCount={plans.length}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {sharedNotice && (
          <div className="max-w-4xl mx-auto mt-4 px-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
              <span className="flex items-center gap-2">
                <span>✨</span>
                <span>{sharedNotice}</span>
              </span>
              <button
                onClick={() => setSharedNotice(null)}
                className="font-bold underline text-xs ml-2 hover:opacity-80"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="max-w-3xl mx-auto mt-4 px-4">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="font-bold ml-2 underline text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {view === 'landing' && (
          <LandingHero
            onStartPlanning={handleStartPlanning}
            onSelectSample={handleSelectSample}
            onOpenVipPass={() => setIsGlobalPassOpen(true)}
          />
        )}

        {view === 'form' && (
          <MultiStepForm
            initialData={formPrefill}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              if (activePlan) {
                setView('plan');
              } else {
                setView('landing');
              }
            }}
          />
        )}

        {view === 'loading' && <LoadingPlanState />}

        {view === 'plan' && activePlan && (
          <PlanDashboard
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
            onEditForm={handleEditActiveForm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-background/50 py-6 text-center text-xs text-muted-foreground no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} EventCraft. Crafted with pride for Indian Celebrations.</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => {
                if (plans.length > 0) setIsSavedDrawerOpen(true);
                else handleStartPlanning();
              }}
              className="hover:text-foreground transition-colors"
            >
              My Plans ({plans.length})
            </button>
            <span>•</span>
            <span className="text-primary font-bold">INR ₹ Formatted</span>
            <span>•</span>
            <span>Zero-Past Timelines</span>
          </div>
        </div>
      </footer>

      {/* Saved Plans Drawer */}
      <SavedPlansDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        plans={plans}
        activePlanId={activePlan?.id || null}
        onSelectPlan={handleSelectSavedPlan}
        onDeletePlan={handleDeletePlan}
        onNewPlan={() => {
          setIsSavedDrawerOpen(false);
          handleStartPlanning();
        }}
      />

      {/* Global VIP Pass & Badge Modal */}
      <DigitalPassModal
        plan={activePlan || createSamplePlan('gujarati_wedding')}
        isOpen={isGlobalPassOpen}
        onClose={() => setIsGlobalPassOpen(false)}
      />
    </div>
  );
}
