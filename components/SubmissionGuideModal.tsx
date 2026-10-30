'use client';

import React, { useState } from 'react';
import {
  X,
  Video,
  FileText,
  Linkedin,
  CheckCircle2,
  Copy,
  Check,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Scale,
  Ticket,
  Printer,
  MessageCircle,
} from 'lucide-react';

interface SubmissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmissionGuideModal({ isOpen, onClose }: SubmissionGuideModalProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  if (!isOpen) return null;

  const videoScript = `🎬 PROMPTWARS CHALLENGE 5 - VIDEO WALKTHROUGH SCRIPT (2-3 Minutes):

1. INTRO (0:00 - 0:25):
   • "Hello everyone! This is my submission for PromptWars Challenge 5: Celebration & Event Planner."
   • "Organizing Indian celebrations involves chaos—budgets, vendors, 10 PM sound curfews, and unexpected changes. Today, I'm showcasing our solution built with Next.js, Google Gemini, and Anthropic Claude."

2. REAL-WORLD SCENARIO SELECTION (0:25 - 0:50):
   • Click "Explore Royal Wedding Sample" or fill in a 350-guest Gujarati Wedding in Bhuj with ₹15 Lakhs budget.
   • Show the instant synthesis: "Notice our AI generates backward-calculated timelines with zero past dates, realistic FSSAI vendors, and an exact 100% mathematical budget allocation."

3. THE CORE PROBLEM - 20% INFLATION & TRADE-OFF SIMULATOR (0:50 - 1:25) [HIGHLIGHT THIS!]:
   • Click "⚖️ Trade-Offs & 20% Spike" button.
   • Say: "As emphasized in the explainer session, event planning is about adapting to changes. When vendor rates spike by 20% or 50 surprise guests arrive, users shouldn't start from scratch."
   • Switch between "Food First (Gastronomy)" and "Decor First", show the live before-and-after ledger, and click "Apply Rebalanced Plan".

4. VENDOR QUOTATION MATRIX & HIDDEN CHARGE AUDITOR (1:25 - 1:55) [HIGHLIGHT THIS!]:
   • Open "Real Local Vendors" tab.
   • Click "Compare 3 Quotes & Audit Hidden Costs" on Catering.
   • Show the 3 competing packages, the Hidden Cost Watchlist (+18% GST extra, generator fuel), and the SME Negotiation Questions. Lock an approved quote.

5. DAY-OF OPERATIONS, VIP PASS & WHATSAPP (1:55 - 2:30):
   • Show the "VIP Pass & Badge" with scannable gate QR codes.
   • Show "WhatsApp RSVP Dispatcher" generating instant pre-filled segmented messages.
   • Show "One-Click Editorial PDF" for family elders with 3-tier payment tranches.

6. CONCLUSION (2:30 - 2:45):
   • "All code is clean, fully typed, backed by 46 unit tests, and deployed live with zero hardcoded API keys. Thank you!"`;

  const linkedinPost = `🚀 Excited to submit for PromptWars Virtual Challenge 5: Celebration & Event Planner! 🇮🇳✨

Planning a grand Indian celebration—whether a royal Gujarati wedding in Bhuj or a society Ganesh Pandal in Mumbai—often involves chaos across budgets, vendors, and changing requirements.

Instead of an AI that simply suggests generic party themes, we built an intelligent, intent-driven Event Command Center focused on execution and dynamic adaptation:

🌟 KEY ARCHITECTURE & HIGHLIGHTS:
1. ⚖️ What-If Scenario & Trade-Off Engine: Handles unexpected 20% cost spikes or +50 surprise guests without restarting from scratch—empowering families to balance Gastronomy vs. Scenography.
2. 📊 Vendor Quotation Matrix & Hidden Cost Auditor: Compares competing vendor quotes side-by-side, flags unquoted taxes/overtime fees, and provides negotiation questions.
3. 🎟️ VIP Gate Pass & Access Badges: Scannable QR passes tailored for family hosts, guests, and vendor loading crews.
4. 💬 WhatsApp RSVP Dispatcher: Generates segmented pre-filled invitations with embedded digital passes.
5. 📄 One-Click Editorial PDF: Formatted ledgers for Family Elders with 3-stage payment tranches (25% token, 50% midway, 25% final settlement).
6. 🔒 Engineering Rigor: Next.js 14, multi-provider LLM adapter (Gemini API & Claude API), Zod validation, and 46 passing unit tests with zero mathematical budget drift.

Huge thanks to Google for Developers, Hack2skill, and the PromptWars team for an incredible challenge!

#PromptWars #BuildWithAI #VibeCoding #GoogleForDevelopers #Nextjs #GenAI #Hack2Skill`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print-bg">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
        className="bg-card w-full max-w-4xl rounded-3xl shadow-2xl border border-border flex flex-col my-auto max-h-[94vh] overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary text-white shadow-sm">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 id="guide-modal-title" className="text-base font-bold text-foreground flex items-center gap-2">
                <span>PromptWars Challenge 5 Submission Guide</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Explainer Session Aligned
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Everything you need to score maximum points in the evaluation rubric
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Submission Checklist */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mandatory Submission Checklist (Per Jitesh & Srinivas):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1">
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <p className="font-bold text-foreground">1. Live Deployed Link</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Vercel live URL working smoothly on mobile & desktop.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <p className="font-bold text-foreground">2. Clean GitHub Repository</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Clean commits, zero hardcoded keys, 46 passing unit tests.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <p className="font-bold text-foreground">3. Video Walkthrough (2-3 Min)</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Showcases 20% Inflation simulator, quotation matrix, and VIP passes.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <p className="font-bold text-foreground">4. LinkedIn Post & Prompt Architecture</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Explains how GenAI (Gemini/Claude) is integrated with intent.</p>
              </div>
            </div>
          </div>

          {/* Video Script Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                <Video className="w-4 h-4 text-primary" />
                <span>Ready-To-Use Video Walkthrough Script:</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(videoScript, setCopiedScript)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all shadow-sm"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied Script!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-muted/50 border border-border/80 font-mono text-[11px] text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {videoScript}
            </pre>
          </div>

          {/* LinkedIn Post Copy Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>Ready-To-Post LinkedIn Writeup:</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(linkedinPost, setCopiedPost)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all shadow-sm"
              >
                {copiedPost ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied Post!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Copy LinkedIn Post</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-muted/50 border border-border/80 font-mono text-[11px] text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {linkedinPost}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/40 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Top 400 finishers earn Prompt Credits redeemable on the PromptWars Swag Store! 🎁
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
