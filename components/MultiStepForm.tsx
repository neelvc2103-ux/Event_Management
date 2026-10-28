'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Cake,
  Building2,
  Calendar,
  Users,
  MapPin,
  IndianRupee,
  Home,
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import { EventFormData, EventType, VenueType, BirthdayCategory } from '@/types';
import { formatINR } from '@/lib/formatters';
import { getRealCityData } from '@/lib/realIndiaDatabase';

interface MultiStepFormProps {
  initialData?: EventFormData | null;
  onSubmit: (formData: EventFormData) => void;
  onCancel: () => void;
}

const PRESET_VIBES = [
  'Traditional',
  'Royal',
  'Modern',
  'Minimalist',
  'Fun & Playful',
  'Eco-Friendly',
  'Bollywood Glamour',
  'Intimate & Cozy',
];

const POPULAR_INDIAN_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Bhuj',
  'Hyderabad',
  'Kolkata',
  'Surat',
  'Goa',
  'Chennai',
  'Chandigarh',
  'Lucknow',
];

const WEDDING_SUB_EVENTS = [
  { id: 'engagement', label: 'Engagement / Roka' },
  { id: 'mehendi', label: 'Mehendi Ceremony' },
  { id: 'haldi', label: 'Haldi / Pithi' },
  { id: 'sangeet', label: 'Sangeet & Dance' },
  { id: 'wedding_ceremony', label: 'Wedding / Pheras' },
  { id: 'reception', label: 'Grand Reception' },
];

const COMMUNITY_TYPES = [
  { id: 'ganesh_utsav', label: 'Ganesh Utsav' },
  { id: 'navratri_garba', label: 'Navratri & Garba' },
  { id: 'diwali_milan', label: 'Diwali Milan' },
  { id: 'society_annual_day', label: 'Society Annual Day' },
  { id: 'college_fest', label: 'College Fest' },
  { id: 'other_community', label: 'Other Community Event' },
];

const VENUE_OPTIONS: Array<{ id: VenueType; label: string; icon: string }> = [
  { id: 'banquet_hall', label: 'Banquet Hall', icon: '🏛️' },
  { id: 'outdoor', label: 'Open Lawn / Farmhouse', icon: '🌿' },
  { id: 'indoor', label: 'Indoor Lounge / Hotel', icon: '🏨' },
  { id: 'society_ground', label: 'Society Ground / Clubhouse', icon: '🏘️' },
  { id: 'home', label: 'Home / Terrace', icon: '🏡' },
];

export function MultiStepForm({ initialData, onSubmit, onCancel }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<EventFormData>(() => {
    if (initialData) return initialData;

    // Default 90 days in the future
    const defaultDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    return {
      eventType: 'wedding',
      eventName: '',
      eventDate: defaultDate,
      guestCount: 200,
      city: 'Mumbai',
      totalBudget: 1500000,
      venueType: 'banquet_hall',
      vibe: '',
      presetVibes: ['Traditional', 'Royal'],
      weddingSubEvents: ['engagement', 'mehendi', 'haldi', 'sangeet', 'wedding_ceremony', 'reception'],
      communityType: 'ganesh_utsav',
      birthdayCategory: 'kids',
      mustHaves: '',
      culturalPreferences: '',
      notes: '',
    };
  });

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleSubEvent = (subId: string) => {
    const current = formData.weddingSubEvents || [];
    const updated = current.includes(subId)
      ? current.filter((id) => id !== subId)
      : [...current, subId];
    updateField('weddingSubEvents', updated);
  };

  const togglePresetVibe = (vibe: string) => {
    const current = formData.presetVibes || [];
    const updated = current.includes(vibe)
      ? current.filter((v) => v !== vibe)
      : [...current, vibe];
    updateField('presetVibes', updated);
  };

  // Step Validations
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.eventName.trim()) errs.eventName = 'Please enter an event name';
    if (!formData.eventDate) errs.eventDate = 'Please choose a target event date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.guestCount || formData.guestCount < 1) {
      errs.guestCount = 'Please enter a valid guest count';
    }
    if (!formData.city.trim()) errs.city = 'Please enter a city name';
    if (!formData.totalBudget || formData.totalBudget < 1000) {
      errs.totalBudget = 'Budget must be at least ₹1,000';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
          <span className={currentStep >= 1 ? 'text-primary font-bold' : ''}>
            1. Event Type & Dates
          </span>
          <span className={currentStep >= 2 ? 'text-primary font-bold' : ''}>
            2. Budget & Venue
          </span>
          <span className={currentStep >= 3 ? 'text-primary font-bold' : ''}>
            3. Vibe & Traditions
          </span>
        </div>
        {/* Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label={`Planning step ${currentStep} of 3`}
          className="w-full h-2 bg-muted rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">What celebration are we planning?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the occasion to tailor India-first rituals, menus, and timelines.
              </p>
            </div>

            {/* Event Type Grid */}
            <div role="radiogroup" aria-label="Select Event Type" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: 'wedding', label: 'Wedding', icon: Heart },
                { type: 'birthday', label: 'Birthday', icon: Cake },
                { type: 'community', label: 'Community Fest', icon: Building2 },
                { type: 'other', label: 'Other Event', icon: Sparkles },
              ].map(({ type, label, icon: Icon }) => {
                const isSelected = formData.eventType === type;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    key={type}
                    onClick={() => updateField('eventType', type as EventType)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm font-bold'
                        : 'border-border bg-card hover:bg-muted text-foreground'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs sm:text-sm">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-event configuration */}
            {formData.eventType === 'wedding' && (
              <div role="group" aria-label="Select Wedding Ceremonies" className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Select Wedding Ceremonies
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {WEDDING_SUB_EVENTS.map((sub) => {
                    const isChecked = (formData.weddingSubEvents || []).includes(sub.id);
                    return (
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isChecked}
                        key={sub.id}
                        onClick={() => toggleSubEvent(sub.id)}
                        className={`text-xs p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                          isChecked
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border bg-card text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <span>{sub.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.eventType === 'community' && (
              <div role="radiogroup" aria-label="Festival or Community Type" className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Festival / Community Type
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMUNITY_TYPES.map((comm) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.communityType === comm.id}
                      key={comm.id}
                      onClick={() => updateField('communityType', comm.id)}
                      className={`text-xs p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                        formData.communityType === comm.id
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{comm.label}</span>
                      {formData.communityType === comm.id && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.eventType === 'birthday' && (
              <div role="radiogroup" aria-label="Celebrant Category" className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Celebrant Category
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'kids', label: "Kid's Birthday (Magic, Games, Themes)" },
                    { id: 'adult', label: 'Adult / Milestone Birthday' },
                  ].map((cat) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.birthdayCategory === cat.id}
                      key={cat.id}
                      onClick={() => updateField('birthdayCategory', cat.id as BirthdayCategory)}
                      className={`text-xs p-3 rounded-lg border text-center transition-all ${
                        formData.birthdayCategory === cat.id
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Event Name */}
            <div>
              <label htmlFor="form-event-name" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Event Name / Title *
              </label>
              <input
                id="form-event-name"
                type="text"
                required
                maxLength={100}
                aria-required="true"
                aria-invalid={!!errors.eventName}
                aria-describedby={errors.eventName ? 'form-event-name-error' : undefined}
                value={formData.eventName}
                onChange={(e) => updateField('eventName', e.target.value)}
                placeholder="e.g. Aarav & Diya’s Wedding / Reyansh's 5th Birthday / Society Ganesh Utsav"
                className={`w-full px-4 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.eventName ? 'border-destructive ring-1 ring-destructive' : 'border-input'
                }`}
              />
              {errors.eventName && (
                <p id="form-event-name-error" role="alert" className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.eventName}
                </p>
              )}
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="form-event-date" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Event Target Date *
              </label>
              <div className="relative">
                <input
                  id="form-event-date"
                  type="date"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.eventDate}
                  aria-describedby="form-event-date-desc"
                  value={formData.eventDate}
                  onChange={(e) => updateField('eventDate', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.eventDate ? 'border-destructive ring-1 ring-destructive' : 'border-input'
                  }`}
                />
              </div>
              <p id="form-event-date-desc" className="text-[11px] text-muted-foreground mt-1">
                Timelines are dynamically calculated backward from this date to ensure no past deadlines.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Guests, City & Budget</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tailored for Indian market rates and realistic vendor pricing.
              </p>
            </div>

            {/* Guest Count */}
            <div>
              <label htmlFor="form-guest-count" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Estimated Guest Count *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  id="form-guest-count"
                  type="number"
                  min="1"
                  max="100000"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.guestCount}
                  aria-describedby={errors.guestCount ? 'form-guest-count-error' : undefined}
                  value={formData.guestCount || ''}
                  onChange={(e) => updateField('guestCount', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 250"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.guestCount && (
                <p id="form-guest-count-error" role="alert" className="text-xs text-destructive mt-1">{errors.guestCount}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="form-city" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                City / Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  id="form-city"
                  type="text"
                  required
                  maxLength={100}
                  aria-required="true"
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'form-city-error' : undefined}
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="e.g. Mumbai, Ahmedabad, Bhuj, Delhi NCR..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.city && <p id="form-city-error" role="alert" className="text-xs text-destructive mt-1">{errors.city}</p>}

              {/* Popular City Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {POPULAR_INDIAN_CITIES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => {
                      updateField('city', c);
                      const cityDb = getRealCityData(c);
                      updateField('locality', cityDb.popularLocalities[0]);
                      updateField('venueName', cityDb.venues[0]?.name || '');
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      formData.city.toLowerCase().includes(c.toLowerCase())
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                        : 'border-border bg-card hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Real Locality / Neighborhood Selector */}
            {(() => {
              const currentCityData = getRealCityData(formData.city);
              return (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Locality / Area in {formData.city || 'City'}
                  </label>
                  <input
                    type="text"
                    value={formData.locality || ''}
                    onChange={(e) => updateField('locality', e.target.value)}
                    placeholder="e.g. Mirzapar Road, Juhu, Baner, Station Road..."
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {currentCityData.popularLocalities.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground">Popular Areas:</span>
                      {currentCityData.popularLocalities.map((loc) => (
                        <button
                          type="button"
                          key={loc}
                          onClick={() => updateField('locality', loc)}
                          className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-colors ${
                            formData.locality === loc
                              ? 'border-accent bg-accent/20 text-accent-foreground font-semibold'
                              : 'border-border bg-card text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Real Venue Selector / Recommendations */}
            {(() => {
              const currentCityData = getRealCityData(formData.city);
              return (
                <div className="space-y-2 p-4 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                      Recommended Verified Venues in {formData.city || 'City'}
                    </label>
                    <span className="text-[11px] font-semibold text-primary">Real Verified Properties</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCityData.venues.map((v) => {
                      const isSelected = formData.venueName === v.name;
                      return (
                        <button
                          type="button"
                          role="button"
                          aria-pressed={isSelected}
                          key={v.id}
                          onClick={() => {
                            updateField('venueName', v.name);
                            updateField('locality', v.locality);
                          }}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
                              : 'border-border bg-card hover:border-primary/40'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-foreground leading-snug">{v.name}</h4>
                            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                              ★ {v.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                            {v.locality} • {v.capacity}
                          </p>
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {v.pricingTier} Tier
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Venue Name Input */}
                  <div className="pt-2">
                    <input
                      type="text"
                      value={formData.venueName || ''}
                      onChange={(e) => updateField('venueName', e.target.value)}
                      placeholder="Or enter a specific venue name / society address..."
                      className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              );
            })()}

            {/* Total Budget in INR */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="form-total-budget" className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Total Budget in INR (₹) *
                </label>
                <span className="text-sm font-bold text-primary">
                  {formatINR(formData.totalBudget)}
                </span>
              </div>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  id="form-total-budget"
                  type="number"
                  step="5000"
                  min="1000"
                  max="1000000000"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.totalBudget}
                  aria-describedby={errors.totalBudget ? 'form-total-budget-error' : undefined}
                  value={formData.totalBudget || ''}
                  onChange={(e) => updateField('totalBudget', parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 1500000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
              {errors.totalBudget && (
                <p id="form-total-budget-error" role="alert" className="text-xs text-destructive mt-1">{errors.totalBudget}</p>
              )}

              {/* Quick Budget Presets */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                {[
                  { label: '₹30k', val: 30000 },
                  { label: '₹1 Lakh', val: 100000 },
                  { label: '₹2 Lakh', val: 200000 },
                  { label: '₹5 Lakh', val: 500000 },
                  { label: '₹15 Lakh', val: 1500000 },
                  { label: '₹25 Lakh', val: 2500000 },
                  { label: '₹50 Lakh', val: 5000000 },
                ].map(({ label, val }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => updateField('totalBudget', val)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      formData.totalBudget === val
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Venue Type */}
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Venue Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VENUE_OPTIONS.map((v) => {
                  const isSelected = formData.venueType === v.id;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      key={v.id}
                      onClick={() => updateField('venueType', v.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted text-foreground'
                      }`}
                    >
                      <span className="text-xl">{v.icon}</span>
                      <span className="text-xs sm:text-sm">{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Theme, Traditions & Must-Haves</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Personalize every detail: regional rites, Jain/Veg cuisine, sound curfew, and vibes.
              </p>
            </div>

            {/* Vibe / Theme Chips */}
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Select Aesthetic & Vibe Chips
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_VIBES.map((vibe) => {
                  const isSelected = (formData.presetVibes || []).includes(vibe);
                  return (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isSelected}
                      key={vibe}
                      onClick={() => togglePresetVibe(vibe)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? 'border-accent bg-accent/20 text-accent-foreground font-semibold'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {vibe}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Free-text Vibe */}
            <div>
              <label htmlFor="form-vibe" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Describe Your Vibe / Theme (Optional)
              </label>
              <input
                id="form-vibe"
                type="text"
                maxLength={500}
                value={formData.vibe}
                onChange={(e) => updateField('vibe', e.target.value)}
                placeholder="e.g. Sunlit marigold Haldi, high-energy Bollywood sangeet with Dhol, midnight dessert station"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Cultural & Religious Preferences */}
            <div>
              <label htmlFor="form-cultural-prefs" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Cultural / Religious Traditions & Dietary Preferences
              </label>
              <textarea
                id="form-cultural-prefs"
                rows={2}
                maxLength={1000}
                value={formData.culturalPreferences}
                onChange={(e) => updateField('culturalPreferences', e.target.value)}
                placeholder="e.g. Gujarati Jain food counters, strict muhurat timings, Halal meat preparation, Vedic priest rites, eco-friendly visarjan..."
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                We respect your authentic customs without stereotyping.
              </p>
            </div>

            {/* Must-Haves */}
            <div>
              <label htmlFor="form-must-haves" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Non-Negotiable Must-Haves
              </label>
              <input
                id="form-must-haves"
                type="text"
                maxLength={1000}
                value={formData.mustHaves}
                onChange={(e) => updateField('mustHaves', e.target.value)}
                placeholder="e.g. Drone photography, live Jalebi counter, police sound permission, magic show for kids"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="form-notes" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Special Logistics or Notes (Optional)
              </label>
              <textarea
                id="form-notes"
                rows={2}
                maxLength={1500}
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="e.g. Elderly guests requiring wheelchair ramps, guest shuttles from train station, 10 PM sound curfew adherence..."
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs sm:text-sm font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors px-2"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-maroon-800 text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                Generate Event Plan
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
