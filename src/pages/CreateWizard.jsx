import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  User,
  Heart,
  Palette,
  Music,
  Film,
  BookOpen,
  Layers,
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  CalendarDays,
  Star,
  Mic,
  Volume2,
  SkipForward,
  ArrowRight,
} from 'lucide-react';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StarsBackground from '../components/ui/StarsBackground';
import useStore from '../store/useStore';
import {
  calculateNextAnniversary,
  calculateYearsTogether,
  formatDateForDisplay,
} from '../utils/dateUtils';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 7;

const TONES = ['Romantic', 'Funny', 'Reflective', 'Grateful', 'Dreamy', 'Cinematic', 'Mixed'];

const LANGUAGES = ['English', 'Telugu', 'Hindi', 'Mixed'];

const MUSIC_MOODS = [
  { label: 'Soft Piano', emoji: '🎹' },
  { label: 'Acoustic', emoji: '🎸' },
  { label: 'Cinematic Orchestral', emoji: '🎻' },
  { label: 'Upbeat Joyful', emoji: '🎵' },
  { label: 'Indian Romantic', emoji: '🪗' },
];

const VIDEO_STYLES = [
  'Classic Romance',
  'Dreamy Film',
  'Elegant Minimal',
  'Heartfelt Storybook',
  'Joyful Celebration',
];

const MEMORY_EMPHASES = [
  'Anniversary Milestones',
  'Trips',
  'Couple Candid Moments',
  'Family Moments',
  'Fun Memories',
  'Mixed',
];

const CREATE_TYPES = [
  {
    value: 'Video only',
    icon: Film,
    title: 'Video Only',
    description: 'A cinematic anniversary video from your photos, music, and messages.',
    gradient: 'from-purple-500/20 to-violet-600/10',
    border: 'border-purple-500/40',
    activeBorder: 'border-purple-400',
    activeGlow: 'glow-violet',
  },
  {
    value: 'Album only',
    icon: BookOpen,
    title: 'Album Only',
    description: 'A beautifully designed photo album with captions and chapters.',
    gradient: 'from-pink-500/20 to-rose-600/10',
    border: 'border-pink-500/40',
    activeBorder: 'border-pink-400',
    activeGlow: 'glow-rose',
  },
  {
    value: 'Both',
    icon: Star,
    title: 'Both',
    description: 'The full experience — a cinematic video AND a beautiful album. Recommended.',
    gradient: 'from-violet-500/20 to-pink-600/10',
    border: 'border-violet-500/40',
    activeBorder: 'border-violet-400',
    activeGlow: 'glow-violet',
    badge: 'Recommended',
  },
];

// ─── Animation Variants ────────────────────────────────────────────────────────

const slideVariants = {
  enterFromRight: { x: 60, opacity: 0 },
  enterFromLeft: { x: -60, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exitToLeft: { x: -60, opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exitToRight: { x: 60, opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Styled text input with glass look */
function GlassInput({ label, value, onChange, type = 'text', placeholder, optional, hint, max }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-purple-300 text-sm font-medium flex items-center gap-2">
        {label}
        {optional && (
          <span className="text-purple-600 text-xs font-normal">(optional)</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        max={max}
        className="glass rounded-xl px-4 py-3 text-purple-100 placeholder-purple-600 text-sm outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 w-full border border-purple-700/30"
        style={{ colorScheme: 'dark' }}
      />
      {hint && <p className="text-purple-600 text-xs">{hint}</p>}
    </div>
  );
}

/** Multi-select pill chip */
function Chip({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
        selected
          ? 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 border-pink-400/60 text-white glow-rose'
          : 'glass border-purple-700/40 text-purple-300 hover:border-purple-500/60 hover:text-purple-200',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

/** Single-select pill chip */
function RadioChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
        selected
          ? 'bg-gradient-to-r from-violet-600/80 to-purple-700/80 border-violet-400/60 text-white glow-violet'
          : 'glass border-purple-700/40 text-purple-300 hover:border-purple-500/60 hover:text-purple-200',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

/** Toggle switch */
function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-purple-200 text-sm font-medium">{label}</p>
        {description && <p className="text-purple-500 text-xs mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 border',
          checked
            ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-400/40'
            : 'bg-[#2d1b4e] border-purple-700/40',
        ].join(' ')}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
          animate={{ left: checked ? '1.5rem' : '0.125rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function StepCoupleInfo({ profile, update }) {
  return (
    <div className="flex flex-col gap-5">
      <GlassInput
        label="Your Name"
        value={profile.name}
        onChange={(v) => update({ name: v })}
        placeholder="e.g. Priya"
      />
      <GlassInput
        label="Your Spouse's Name"
        value={profile.spouseName}
        onChange={(v) => update({ spouseName: v })}
        placeholder="e.g. Arjun"
      />
      <GlassInput
        label="Nickname / Term of Endearment"
        value={profile.nickname}
        onChange={(v) => update({ nickname: v })}
        placeholder="e.g. my love, janu, darling"
        optional
      />
    </div>
  );
}

function StepAnniversaryDetails({ profile, update }) {
  const handleWeddingDateChange = (dateStr) => {
    if (!dateStr) {
      update({ weddingDate: null, nextAnniversaryDate: null, yearsTogether: 0 });
      return;
    }
    const parsed = parseISO(dateStr);
    const next = calculateNextAnniversary(parsed);
    const years = calculateYearsTogether(parsed);
    update({
      weddingDate: parsed,
      nextAnniversaryDate: next,
      yearsTogether: years,
    });
  };

  const handleNextAnniversaryChange = (dateStr) => {
    if (!dateStr) return;
    update({ nextAnniversaryDate: parseISO(dateStr) });
  };

  const weddingDateStr = profile.weddingDate instanceof Date && !isNaN(profile.weddingDate)
    ? format(profile.weddingDate, 'yyyy-MM-dd')
    : '';

  const nextAnnivStr = profile.nextAnniversaryDate instanceof Date && !isNaN(profile.nextAnniversaryDate)
    ? format(profile.nextAnniversaryDate, 'yyyy-MM-dd')
    : '';

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex flex-col gap-5">
      <GlassInput
        label="Wedding Date"
        type="date"
        value={weddingDateStr}
        onChange={handleWeddingDateChange}
        max={today}
      />

      {profile.weddingDate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center">
              <Heart size={18} className="text-pink-300" />
            </div>
            <div>
              <p className="text-purple-200 font-medium text-sm">Your Anniversary</p>
              <p className="text-purple-500 text-xs">
                {formatDateForDisplay(profile.weddingDate)}
              </p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/30 text-pink-200 text-xs font-semibold">
                {profile.yearsTogether} Beautiful{' '}
                {profile.yearsTogether === 1 ? 'Year' : 'Years'}
              </span>
            </div>
          </div>
          {profile.nextAnniversaryDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays size={14} className="text-purple-400" />
              <span className="text-purple-300">Next anniversary: </span>
              <span className="text-purple-100 font-medium">
                {formatDateForDisplay(profile.nextAnniversaryDate)}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {weddingDateStr && (
        <GlassInput
          label="Next Anniversary Date"
          type="date"
          value={nextAnnivStr}
          onChange={handleNextAnniversaryChange}
          hint="Auto-calculated — edit if needed"
        />
      )}
    </div>
  );
}

function StepToneLanguage({ profile, update }) {
  const toggleTone = (tone) => {
    const current = profile.tone || [];
    const next = current.includes(tone)
      ? current.filter((t) => t !== tone)
      : [...current, tone];
    if (next.length > 0) update({ tone: next });
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-purple-300 text-sm font-medium mb-3">
          Tone <span className="text-purple-600 text-xs font-normal">(select all that fit)</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {TONES.map((t) => (
            <Chip
              key={t}
              label={t}
              selected={(profile.tone || []).includes(t)}
              onToggle={() => toggleTone(t)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-purple-300 text-sm font-medium mb-3">Language</p>
        <div className="flex flex-wrap gap-2.5">
          {LANGUAGES.map((lang) => (
            <RadioChip
              key={lang}
              label={lang}
              selected={profile.language === lang}
              onClick={() => update({ language: lang })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepMusicStyle({ profile, update }) {
  return (
    <div className="flex flex-col gap-7">
      {/* Music mood */}
      <div>
        <p className="text-purple-300 text-sm font-medium mb-3">Music Mood</p>
        <div className="flex flex-col gap-2">
          {MUSIC_MOODS.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => update({ musicMood: m.label })}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left',
                profile.musicMood === m.label
                  ? 'glass border-purple-400/60 text-purple-100 glow-violet'
                  : 'glass border-purple-800/30 text-purple-300 hover:border-purple-600/40',
              ].join(' ')}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="font-medium text-sm">{m.label}</span>
              {profile.musicMood === m.label && (
                <Check size={15} className="ml-auto text-purple-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Video style */}
      <div>
        <p className="text-purple-300 text-sm font-medium mb-3">Video Style</p>
        <div className="flex flex-wrap gap-2.5">
          {VIDEO_STYLES.map((s) => (
            <RadioChip
              key={s}
              label={s}
              selected={profile.videoStyle === s}
              onClick={() => update({ videoStyle: s })}
            />
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-4">
        <Toggle
          label="Include AI Narration"
          description="Auto-generated voice narration over your video"
          checked={profile.includeNarration}
          onChange={(v) => update({ includeNarration: v })}
        />
        <div className="h-px bg-purple-900/40" />
        <Toggle
          label="Include Voice Note"
          description="Record a personal voice message to include"
          checked={profile.includeUserVoice}
          onChange={(v) => update({ includeUserVoice: v })}
        />
      </div>
    </div>
  );
}

function StepCreateType({ profile, update }) {
  return (
    <div className="flex flex-col gap-4">
      {CREATE_TYPES.map((ct) => {
        const Icon = ct.icon;
        const isSelected = profile.createType === ct.value;
        return (
          <motion.button
            key={ct.value}
            type="button"
            onClick={() => update({ createType: ct.value })}
            whileTap={{ scale: 0.98 }}
            className={[
              `relative w-full text-left rounded-2xl p-5 border transition-all duration-200 bg-gradient-to-br ${ct.gradient}`,
              isSelected ? `${ct.activeBorder} ${ct.activeGlow}` : ct.border,
            ].join(' ')}
          >
            {ct.badge && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-600/70 to-purple-600/70 border border-pink-500/40 text-white text-[10px] font-semibold uppercase tracking-wide">
                  {ct.badge}
                </span>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl glass flex items-center justify-center flex-shrink-0">
                <Icon size={20} className={isSelected ? 'text-purple-200' : 'text-purple-400'} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold mb-1 ${isSelected ? 'text-purple-100' : 'text-purple-300'}`}>
                  {ct.title}
                </p>
                <p className="text-purple-400 text-sm leading-relaxed pr-16">{ct.description}</p>
              </div>
              {isSelected && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Check size={13} className="text-white" />
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function StepMemoryPreferences({ profile, update }) {
  const toggleEmphasis = (item) => {
    const current = profile.memoryEmphasis || [];
    const next = current.includes(item)
      ? current.filter((e) => e !== item)
      : [...current, item];
    if (next.length > 0) update({ memoryEmphasis: next });
  };

  return (
    <div>
      <p className="text-purple-400 text-sm mb-5 leading-relaxed">
        Which types of memories do you want to feature most?{' '}
        <span className="text-purple-600">Select all that apply.</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {MEMORY_EMPHASES.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={(profile.memoryEmphasis || []).includes(item)}
            onToggle={() => toggleEmphasis(item)}
          />
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-purple-500 text-xs uppercase tracking-wide flex-shrink-0">{label}</span>
      <span className="text-purple-200 text-sm text-right">{value || '—'}</span>
    </div>
  );
}

function StepReview({ profile, onConnect, onSkip }) {
  const weddingDateDisplay = profile.weddingDate instanceof Date && !isNaN(profile.weddingDate)
    ? formatDateForDisplay(profile.weddingDate)
    : null;

  const nextAnnivDisplay = profile.nextAnniversaryDate instanceof Date && !isNaN(profile.nextAnniversaryDate)
    ? formatDateForDisplay(profile.nextAnniversaryDate)
    : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Summary card */}
      <div className="glass rounded-2xl p-5 flex flex-col gap-5">
        {/* Couple Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-purple-400" />
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest">
              Couple Details
            </p>
          </div>
          <div className="space-y-2.5">
            <SummaryRow label="Your name" value={profile.name} />
            <SummaryRow label="Spouse's name" value={profile.spouseName} />
            {profile.nickname && (
              <SummaryRow label="Nickname" value={profile.nickname} />
            )}
          </div>
        </div>

        <div className="h-px bg-purple-900/40" />

        {/* Anniversary Date */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={14} className="text-purple-400" />
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest">
              Anniversary Date
            </p>
          </div>
          <div className="space-y-2.5">
            <SummaryRow label="Wedding date" value={weddingDateDisplay} />
            <SummaryRow label="Years together" value={profile.yearsTogether ? `${profile.yearsTogether} years` : null} />
            <SummaryRow label="Next anniversary" value={nextAnnivDisplay} />
          </div>
        </div>

        <div className="h-px bg-purple-900/40" />

        {/* Style Choices */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={14} className="text-purple-400" />
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest">
              Style Choices
            </p>
          </div>
          <div className="space-y-2.5">
            <SummaryRow label="Tone" value={(profile.tone || []).join(', ')} />
            <SummaryRow label="Language" value={profile.language} />
            <SummaryRow label="Music" value={profile.musicMood} />
            <SummaryRow label="Video style" value={profile.videoStyle} />
            <SummaryRow label="Create type" value={profile.createType} />
            <SummaryRow label="AI narration" value={profile.includeNarration ? 'Yes' : 'No'} />
            <SummaryRow label="Voice note" value={profile.includeUserVoice ? 'Yes' : 'No'} />
          </div>
        </div>

        <div className="h-px bg-purple-900/40" />

        {/* Memory Focus */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Camera size={14} className="text-purple-400" />
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest">
              Memory Focus
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(profile.memoryEmphasis || []).map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-full glass border border-purple-700/30 text-purple-300 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <Button
        variant="primary"
        size="lg"
        icon={ArrowRight}
        iconPosition="right"
        fullWidth
        onClick={onConnect}
      >
        Connect Google Photos &amp; Start
      </Button>

      {/* Secondary */}
      <button
        type="button"
        onClick={onSkip}
        className="text-purple-500 text-sm text-center hover:text-purple-300 transition-colors py-1"
      >
        Skip for now, use manual upload
      </button>
    </div>
  );
}

// ─── Wizard Step Metadata ─────────────────────────────────────────────────────

const STEP_META = [
  {
    icon: User,
    title: 'About You Two',
    description: 'A few details so this surprise feels truly personal',
  },
  {
    icon: CalendarDays,
    title: 'Anniversary Details',
    description: 'When did your beautiful story begin?',
  },
  {
    icon: Palette,
    title: 'Tone & Language',
    description: 'How do you want this surprise to feel?',
  },
  {
    icon: Music,
    title: 'Music & Style',
    description: 'Set the mood for your cinematic story',
  },
  {
    icon: Layers,
    title: 'What to Create',
    description: 'Choose the format for your anniversary surprise',
  },
  {
    icon: Camera,
    title: 'Memory Preferences',
    description: 'What kinds of memories matter most?',
  },
  {
    icon: Sparkles,
    title: 'Review & Connect',
    description: 'Everything looks great — ready to start?',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateWizard() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, currentStep, setCurrentStep, setHasCompletedSetup } =
    useStore((s) => ({
      userProfile: s.userProfile,
      setUserProfile: s.setUserProfile,
      currentStep: s.currentStep,
      setCurrentStep: s.setCurrentStep,
      setHasCompletedSetup: s.setHasCompletedSetup,
    }));

  // Local direction state for slide animation
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const stepIndex = currentStep; // 0-based
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TOTAL_STEPS - 1;

  const goNext = useCallback(() => {
    if (stepIndex < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep(stepIndex + 1);
    }
  }, [stepIndex, setCurrentStep]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setDirection(-1);
      setCurrentStep(stepIndex - 1);
    }
  }, [stepIndex, setCurrentStep]);

  const handleConnect = () => {
    setHasCompletedSetup(true);
    navigate('/connect');
  };

  const handleSkip = () => {
    setHasCompletedSetup(true);
    navigate('/memories');
  };

  const meta = STEP_META[stepIndex];
  const MetaIcon = meta.icon;
  const progressPct = ((stepIndex + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="relative min-h-dvh bg-[#0d0618] flex flex-col">
      <StarsBackground />

      {/* ── Header & Progress ─────────────────────────────────────────────────── */}
      <div className="relative z-10 px-4 pt-4 pb-2 safe-top">
        {/* Step counter */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-purple-500 text-xs font-medium uppercase tracking-widest">
            Step {stepIndex + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-purple-500 text-xs">
            {Math.round(progressPct)}% complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-purple-900/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {STEP_META.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === stepIndex ? 20 : 6,
                backgroundColor:
                  i < stepIndex
                    ? '#a855f7'
                    : i === stepIndex
                    ? '#f472b6'
                    : '#4c1d95',
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* ── Scrollable Step Area ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={slideVariants}
            initial={direction > 0 ? 'enterFromRight' : 'enterFromLeft'}
            animate="center"
            exit={direction > 0 ? 'exitToLeft' : 'exitToRight'}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="px-4 pt-6 pb-32 max-w-lg mx-auto">
              {/* Step heading */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0">
                  <MetaIcon size={18} className="text-pink-300" />
                </div>
                <div>
                  <h1 className="font-display text-2xl gradient-text font-semibold leading-tight">
                    {meta.title}
                  </h1>
                </div>
              </div>
              <p className="text-purple-400 text-sm mb-8 leading-relaxed">{meta.description}</p>

              {/* Step content */}
              {stepIndex === 0 && (
                <StepCoupleInfo profile={userProfile} update={setUserProfile} />
              )}
              {stepIndex === 1 && (
                <StepAnniversaryDetails profile={userProfile} update={setUserProfile} />
              )}
              {stepIndex === 2 && (
                <StepToneLanguage profile={userProfile} update={setUserProfile} />
              )}
              {stepIndex === 3 && (
                <StepMusicStyle profile={userProfile} update={setUserProfile} />
              )}
              {stepIndex === 4 && (
                <StepCreateType profile={userProfile} update={setUserProfile} />
              )}
              {stepIndex === 5 && (
                <StepMemoryPreferences profile={userProfile} update={setUserProfile} />
              )}
              {stepIndex === 6 && (
                <StepReview
                  profile={userProfile}
                  onConnect={handleConnect}
                  onSkip={handleSkip}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation ─────────────────────────────────────────────────── */}
      {stepIndex < TOTAL_STEPS - 1 && (
        <div className="relative z-10 px-4 py-4 safe-bottom border-t border-purple-900/30 glass">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            {/* Back */}
            {!isFirst ? (
              <Button
                variant="ghost"
                size="md"
                icon={ChevronLeft}
                iconPosition="left"
                onClick={goBack}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex-1" />

            {/* Skip (only for optional steps 3-6) */}
            {stepIndex >= 2 && stepIndex <= 5 && (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1 text-purple-500 text-sm hover:text-purple-300 transition-colors"
              >
                <SkipForward size={14} />
                <span>Skip</span>
              </button>
            )}

            {/* Next */}
            <Button
              variant="primary"
              size="md"
              icon={ChevronRight}
              iconPosition="right"
              onClick={goNext}
            >
              {stepIndex === TOTAL_STEPS - 2 ? 'Review' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
