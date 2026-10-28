'use client';

import React, { useState } from 'react';
import {
  Calendar,
  IndianRupee,
  MapPin,
  Users,
  Share2,
  Printer,
  Sparkles,
  PieChart,
  CalendarCheck,
  Store,
  Lightbulb,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
} from 'lucide-react';
import { EventPlan, BudgetData, TimelineTask, VendorItem, IdeaSectionKey } from '@/types';
import { formatINR, formatDate, getDaysRemaining } from '@/lib/formatters';
import { BudgetTab } from './tabs/BudgetTab';
import { TimelineTab } from './tabs/TimelineTab';
import { VendorsTab } from './tabs/VendorsTab';
import { IdeasTab } from './tabs/IdeasTab';
import { ChatDrawer } from './ChatDrawer';

import { PdfDossierModal } from './PdfDossierModal';

interface PlanDashboardProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  onEditForm: () => void;
}

export function PlanDashboard({ plan, onUpdatePlan, onEditForm }: PlanDashboardProps) {
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'vendors' | 'ideas'>('budget');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const countdown = React.useMemo(() => getDaysRemaining(plan.formData.eventDate), [plan.formData.eventDate]);

  // Tab 1: Budget update
  const handleUpdateBudget = (newBudget: BudgetData) => {
    onUpdatePlan({
      ...plan,
      budget: newBudget,
      updatedAt: new Date().toISOString(),
    });
  };

  // Tab 2: Toggle timeline task
  const handleToggleTask = (taskId: string) => {
    const updatedTimeline = plan.timeline.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdatePlan({
      ...plan,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    });
  };

  // Tab 3: Update vendor
  const handleUpdateVendor = (index: number, updatedVendor: VendorItem) => {
    const updatedVendors = [...plan.vendors];
    updatedVendors[index] = updatedVendor;
    onUpdatePlan({
      ...plan,
      vendors: updatedVendors,
      updatedAt: new Date().toISOString(),
    });
  };

  // Tab 4: Regenerate idea section
  const handleRegenerateSection = async (section: IdeaSectionKey, userFeedback?: string) => {
    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          section,
          userFeedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate section');
      }

      const resData = await response.json();
      const updatedIdeas = {
        ...plan.ideas,
        [section]: resData.data,
      };

      onUpdatePlan({
        ...plan,
        ideas: updatedIdeas,
        updatedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      console.error('Failed to regenerate section:', e);
      alert(`Could not regenerate: ${e.message}`);
    }
  };

  // Export PDF: Open luxury printable dossier
  const handleExportPDF = () => {
    setIsPdfModalOpen(true);
  };

  // WhatsApp Share Text
  const handleShareWhatsApp = () => {
    const lines = [
      `🎉 *${plan.formData.eventName}* - Event Plan`,
      `📅 *Date:* ${formatDate(plan.formData.eventDate)} (${countdown.label})`,
      `📍 *Location:* ${plan.venueDetails?.name ? `${plan.venueDetails.name}, ` : ''}${plan.formData.city}`,
      `💰 *Total Budget:* ${formatINR(plan.budget.total)} | 👥 *Guests:* ${plan.formData.guestCount}`,
      ...(plan.muhuratDetails ? [`🕉️ *Shubh Muhurat:* ${plan.muhuratDetails.shubhMuhurat}`] : []),
      '',
      `📊 *Budget Allocation:*`,
      ...plan.budget.categories.map((c) => `• ${c.name}: ${formatINR(c.amount)} (${c.percentage}%)`),
      '',
      `🗓️ *Next Milestones:*`,
      ...plan.timeline
        .filter((t) => !t.completed)
        .slice(0, 4)
        .map((t) => `• [${formatDate(t.dueDate)}] ${t.task}`),
      '',
      `🤝 *Vendors Status:* ${plan.vendors.filter((v) => v.isBooked).length}/${plan.vendors.length} Booked`,
      '',
      `Plan generated via *EventCraft* 🇮🇳`,
    ];

    const shareText = lines.join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (plan.venueDetails?.name || plan.formData.venueName || 'Banquet Hall') + ' ' + plan.formData.city
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Celebratory Header Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden print-card">
        {/* Subtle festive background wash */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Row: Badges & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                {plan.formData.eventType === 'wedding' ? '💍 Big Fat Indian Wedding' : plan.formData.eventType === 'birthday' ? '🎂 Birthday Bash' : '🪔 Community Utsav'}
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground border border-accent/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent-foreground" />
                {countdown.label} • Time to get ready! 🎉
              </span>
              {plan.civicCompliance && (
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                  <span>🔊 10 PM Sound Curfew</span>
                  <span className="opacity-75">(Plan an indoor after-party!)</span>
                </span>
              )}
              {plan.formData.presetVibes && plan.formData.presetVibes.length > 0 && (
                <span className="hidden md:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  ✨ Vibe: {plan.formData.presetVibes.join(' & ')}
                </span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 no-print">
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Share WhatsApp Summary with Family"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied & Opening WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Share with Family</span>
                  </>
                )}
              </button>

              <button
                id="export-pdf-dossier-btn"
                onClick={handleExportPDF}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                title="Open Printable Master Dossier"
              >
                <Printer className="w-4 h-4 text-accent" />
                <span>Print Master Plan</span>
              </button>

              <button
                onClick={onEditForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Edit Form Inputs"
              >
                <Edit3 className="w-4 h-4" />
                <span>✏️ Tweak Details</span>
              </button>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
              <span>{plan.formData.eventName}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-xs sm:text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                <Calendar className="w-4 h-4 text-primary" />
                {formatDate(plan.formData.eventDate)}
              </span>
              <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                <MapPin className="w-4 h-4 text-accent" />
                {plan.formData.locality ? `${plan.formData.locality}, ` : ''}{plan.formData.city}
              </span>
              <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                <Users className="w-4 h-4 text-primary" />
                {plan.formData.guestCount} guests
              </span>
              <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                <IndianRupee className="w-4 h-4 text-accent" />
                <strong className="text-foreground">{formatINR(plan.budget.total)} total</strong>
              </span>
            </div>
          </div>

          {/* REAL VENUE & AUSPICIOUS MUHURAT BADGES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Real Venue Profile */}
            {plan.venueDetails && (
              <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-start justify-between gap-3 shadow-sm">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                      📍 Real Verified Venue
                    </span>
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                      ★ {plan.venueDetails.rating}/5.0
                    </span>
                    {plan.venueDetails.pricingTier && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        • {plan.venueDetails.pricingTier}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-foreground leading-snug">
                    {plan.venueDetails.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {plan.venueDetails.address}
                  </p>
                  {plan.venueDetails.highlights && plan.venueDetails.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {plan.venueDetails.highlights.map((hl, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-primary shrink-0 flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps ↗</span>
                </a>
              </div>
            )}

            {/* Auspicious Muhurat Card */}
            {plan.muhuratDetails ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
                  🕉️ Auspicious Shubh Muhurat & Pheras
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  {plan.muhuratDetails.shubhMuhurat}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  Nakshatra: {plan.muhuratDetails.nakshatra}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  📸 Pro tip: Godhuli bela golden light gives the best candid wedding photography!
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                  🎉 Party Flow & Energy
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Non-Stop Fun & Smooth Coordination
                </h4>
                <p className="text-xs text-muted-foreground">
                  Detailed timeline countdown with sound curfew checkpoints ready in tab 2.
                </p>
              </div>
            )}
          </div>

          {/* Planning Summary */}
          {plan.summary && (
            <div className="pt-4 border-t border-border/60">
              <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-medium bg-muted/30 p-3.5 rounded-2xl border border-border/40">
                {showFullSummary
                  ? plan.summary
                  : `${plan.summary.slice(0, 240)}${plan.summary.length > 240 ? '...' : ''}`}
              </div>
              {plan.summary.length > 240 && (
                <button
                  type="button"
                  onClick={() => setShowFullSummary(!showFullSummary)}
                  className="mt-2 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 no-print"
                >
                  <span>{showFullSummary ? 'Show less' : 'Read full planning gameplan'}</span>
                  {showFullSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          )}

          {/* REAL-WORLD DAY-OF SURVIVAL KIT (Human Event Planner Touch) */}
          <div className="pt-2 no-print">
            <details className="group rounded-2xl border border-border bg-secondary/30 p-4 transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-2">
                  <span className="text-base">🎒</span>
                  <span>Planner’s Day-Of Survival Kit & Hacks (Don’t skip this!)</span>
                </span>
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-xs">
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <p className="font-bold text-foreground">🩹 Emergency Pouch</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Safety pins, double-sided tape, Band-aids, mints & flat sandals under the stage.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <p className="font-bold text-foreground">🍛 Hungry Cousin Rule</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Tell caterer to pack 20 snack boxes before dinner rush for the squad running around!</p>
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <p className="font-bold text-foreground">⚡ Charger Captain</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Appoint 1 trustworthy cousin to hold power banks for the bride & groom’s phones.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <p className="font-bold text-foreground">💵 Shagun Envelope Stash</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Keep 15 small envelopes ready with ₹100/₹500 for dholwalas, drivers & helpers.</p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (No print) */}
      <div className="border-b border-border no-print">
        <nav role="tablist" aria-label="Event Plan Views" className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-px">
          {[
            { id: 'budget', label: 'Band, Baaja, Budget', icon: PieChart, badge: formatINR(plan.budget.total) },
            { id: 'timeline', label: 'Countdown Checklist', icon: CalendarCheck, badge: `${plan.timeline.filter((t) => t.completed).length}/${plan.timeline.length}` },
            { id: 'vendors', label: 'Real Local Vendors', icon: Store, badge: `${plan.vendors.filter((v) => v.isBooked).length}/${plan.vendors.length}` },
            { id: 'ideas', label: 'Food, Themes & Quirks', icon: Sparkles, badge: undefined },
          ].map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-3 px-3 sm:px-2 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{label}</span>
                {badge && (
                  <span
                    className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Content (Normal view) */}
      <div className="no-print">
        <div
          role="tabpanel"
          id="tabpanel-budget"
          aria-labelledby="tab-budget"
          hidden={activeTab !== 'budget'}
        >
          {activeTab === 'budget' && (
            <BudgetTab budget={plan.budget} onUpdateBudget={handleUpdateBudget} />
          )}
        </div>
        <div
          role="tabpanel"
          id="tabpanel-timeline"
          aria-labelledby="tab-timeline"
          hidden={activeTab !== 'timeline'}
        >
          {activeTab === 'timeline' && (
            <TimelineTab
              timeline={plan.timeline}
              eventDate={plan.formData.eventDate}
              onToggleTask={handleToggleTask}
            />
          )}
        </div>
        <div
          role="tabpanel"
          id="tabpanel-vendors"
          aria-labelledby="tab-vendors"
          hidden={activeTab !== 'vendors'}
        >
          {activeTab === 'vendors' && (
            <VendorsTab vendors={plan.vendors} onUpdateVendor={handleUpdateVendor} />
          )}
        </div>
        <div
          role="tabpanel"
          id="tabpanel-ideas"
          aria-labelledby="tab-ideas"
          hidden={activeTab !== 'ideas'}
        >
          {activeTab === 'ideas' && (
            <IdeasTab ideas={plan.ideas} onRegenerateSection={handleRegenerateSection} />
          )}
        </div>
      </div>

      {/* Printable Full Report View: Rendered only when printing */}
      <div className="hidden print:block space-y-8">
        {/* Print Section 1: Budget */}
        <div className="print-card p-6 bg-white border border-gray-300 rounded-xl space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">1. Budget Allocation (Total: {formatINR(plan.budget.total)})</h2>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Allocation</th>
                <th className="py-2 px-3">Amount (INR)</th>
                <th className="py-2 px-3">Inclusions</th>
              </tr>
            </thead>
            <tbody>
              {plan.budget.categories.map((c, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-3 font-bold">{c.name}</td>
                  <td className="py-2 px-3">{c.percentage}%</td>
                  <td className="py-2 px-3 font-mono">{formatINR(c.amount)}</td>
                  <td className="py-2 px-3 text-gray-600">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Section 2: Timeline */}
        <div className="print-card p-6 bg-white border border-gray-300 rounded-xl space-y-4 print-page-break">
          <h2 className="text-xl font-bold border-b pb-2">2. Execution Timeline & Milestones</h2>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Due Date</th>
                <th className="py-2 px-3">Phase</th>
                <th className="py-2 px-3">Action Task</th>
                <th className="py-2 px-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {plan.timeline.map((t, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-3">{t.completed ? '[✓] Done' : '[ ] Pending'}</td>
                  <td className="py-2 px-3">{formatDate(t.dueDate)}</td>
                  <td className="py-2 px-3 font-semibold">{t.phase}</td>
                  <td className="py-2 px-3">{t.task}</td>
                  <td className="py-2 px-3 uppercase text-[10px]">{t.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Section 3: Vendors */}
        <div className="print-card p-6 bg-white border border-gray-300 rounded-xl space-y-4 print-page-break">
          <h2 className="text-xl font-bold border-b pb-2">3. Vendor Directory & Checklist</h2>
          <div className="grid grid-cols-2 gap-4">
            {plan.vendors.map((v, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>{v.category}</span>
                  <span>{formatINR(v.estimatedCost)}</span>
                </div>
                <div className="text-gray-500">Book By: {formatDate(v.bookBy)} | {v.isBooked ? 'Booked' : 'Not Booked'}</div>
                <ul className="list-disc pl-4 text-gray-700 pt-1 space-y-0.5">
                  {v.checklist.slice(0, 2).map((c, ci) => (
                    <li key={ci}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Print Section 4: Ideas & Menu */}
        <div className="print-card p-6 bg-white border border-gray-300 rounded-xl space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">4. Personalized Themes & Menu</h2>
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-sm mb-1">Themes:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {plan.ideas.themes.map((th, i) => (
                  <li key={i}><strong>{th.name}:</strong> {th.description}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Menu Spread:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {plan.ideas.menu.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Assistant Drawer */}
      <ChatDrawer plan={plan} onApplyPlanUpdate={onUpdatePlan} />

      {/* Official Luxury Printable PDF Dossier Modal */}
      <PdfDossierModal
        plan={plan}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
}
