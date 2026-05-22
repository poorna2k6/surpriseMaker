import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Film,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Edit3,
  Copy,
  Trash2,
  Play,
  Download,
  RefreshCw,
  Mic,
  Music,
  Zap,
  Type,
  Image,
  Video,
  Layers,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import clsx from 'clsx';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_PRESETS = [
  {
    id: 'classic',
    label: 'Classic Romance',
    icon: '💍',
    description: 'Timeless elegance with soft fades and warm tones',
  },
  {
    id: 'dreamy',
    label: 'Dreamy Film',
    icon: '🎞️',
    description: 'Cinematic grain, light leaks, and poetic pacing',
  },
  {
    id: 'minimal',
    label: 'Elegant Minimal',
    icon: '✨',
    description: 'Clean cuts, white space, and refined typography',
  },
  {
    id: 'storybook',
    label: 'Heartfelt Storybook',
    icon: '📖',
    description: 'Warm narrative feel with illustrated chapter breaks',
  },
  {
    id: 'joyful',
    label: 'Joyful Celebration',
    icon: '🎉',
    description: 'Upbeat energy, vibrant colors, fun transitions',
  },
];

const MUSIC_MOODS = [
  'Soft Piano',
  'Acoustic',
  'Cinematic Orchestral',
  'Upbeat Joyful',
  'Indian Romantic',
];

const PACING_OPTIONS = [
  { id: 'slow', label: 'Slow & Tender', desc: 'Lingering moments' },
  { id: 'balanced', label: 'Balanced', desc: 'Natural rhythm' },
  { id: 'lively', label: 'Lively', desc: 'Energetic flow' },
];

const SCENE_TYPE_ICONS = {
  title: Type,
  photos: Image,
  text: MessageSquare,
  video: Video,
  transition: Layers,
  message: MessageSquare,
};

const TRANSITION_OPTIONS = ['Fade', 'Dissolve', 'Slide', 'Zoom', 'Wipe'];

const GENERATION_STEPS = [
  'Preparing scenes',
  'Applying transitions',
  'Adding music',
  'Rendering',
  'Complete',
];

const INITIAL_SCENES = [
  {
    id: 'scene-1',
    number: 1,
    type: 'title',
    title: 'Opening Title',
    description: 'Fade in, couple names, wedding date',
    duration: 5,
    transition: 'Fade',
    caption: 'Two hearts, one beautiful story.',
    expanded: false,
  },
  {
    id: 'scene-2',
    number: 2,
    type: 'photos',
    title: 'The Beginning',
    description: 'Wedding day photos',
    duration: 15,
    transition: 'Dissolve',
    caption: 'The day it all began.',
    expanded: false,
  },
  {
    id: 'scene-3',
    number: 3,
    type: 'photos',
    title: 'First Year',
    description: 'Candid moments 2019–2020',
    duration: 20,
    transition: 'Slide',
    caption: 'Every first – first home, first trip, first ordinary Tuesday.',
    expanded: false,
  },
  {
    id: 'scene-4',
    number: 4,
    type: 'photos',
    title: 'Anniversary Milestones',
    description: 'Anniversary photo collage',
    duration: 15,
    transition: 'Zoom',
    caption: 'Each year more beautiful than the last.',
    expanded: false,
  },
  {
    id: 'scene-5',
    number: 5,
    type: 'photos',
    title: 'Our Adventures',
    description: 'Trip photos',
    duration: 20,
    transition: 'Wipe',
    caption: 'The world is better when we explore it together.',
    expanded: false,
  },
  {
    id: 'scene-6',
    number: 6,
    type: 'message',
    title: 'Love Letter',
    description: 'Text slide with animated message',
    duration: 8,
    transition: 'Fade',
    caption: 'From my heart to yours — always and forever.',
    expanded: false,
  },
  {
    id: 'scene-7',
    number: 7,
    type: 'photos',
    title: 'Closing',
    description: 'Recent photo + anniversary wishes',
    duration: 10,
    transition: 'Dissolve',
    caption: "Here's to forever.",
    expanded: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    draft: { label: 'Draft', color: 'text-purple-300 border-purple-700/50 bg-purple-900/30' },
    generating: { label: 'Generating…', color: 'text-yellow-300 border-yellow-700/50 bg-yellow-900/30' },
    complete: { label: 'Complete', color: 'text-green-300 border-green-700/50 bg-green-900/30' },
  };
  const c = config[status] || config.draft;
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border', c.color)}>
      {status === 'generating' && <Loader2 size={11} className="animate-spin" />}
      {status === 'complete' && <CheckCircle2 size={11} />}
      {c.label}
    </span>
  );
}

function SceneThumbnail({ type }) {
  const gradients = {
    title: 'from-purple-900 via-pink-900 to-purple-800',
    photos: 'from-violet-900 via-purple-800 to-indigo-900',
    text: 'from-rose-900 via-purple-900 to-violet-800',
    video: 'from-indigo-900 via-purple-900 to-pink-900',
    transition: 'from-purple-800 via-violet-900 to-purple-800',
    message: 'from-pink-900 via-rose-900 to-purple-900',
  };
  const Icon = SCENE_TYPE_ICONS[type] || Image;
  return (
    <div className={clsx('w-16 h-11 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center', gradients[type] || gradients.photos)}>
      <Icon size={16} className="text-purple-300 opacity-70" />
    </div>
  );
}

function SceneCard({ scene, index, onUpdate, onDuplicate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = SCENE_TYPE_ICONS[scene.type] || Image;

  return (
    <motion.div layout className="glass rounded-2xl overflow-hidden border border-purple-800/30">
      {/* Main row */}
      <div className="flex items-center gap-3 p-3">
        {/* Drag handle */}
        <div className="text-purple-600 cursor-grab active:cursor-grabbing flex-shrink-0">
          <GripVertical size={16} />
        </div>

        {/* Scene number */}
        <div className="w-6 h-6 rounded-full bg-purple-800/60 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-purple-300">{scene.number}</span>
        </div>

        {/* Thumbnail */}
        <SceneThumbnail type={scene.type} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon size={12} className="text-purple-400 flex-shrink-0" />
            <input
              value={scene.title}
              onChange={(e) => onUpdate(scene.id, { title: e.target.value })}
              className="bg-transparent text-sm font-medium text-purple-100 w-full outline-none focus:text-white placeholder-purple-500"
            />
          </div>
          <p className="text-[11px] text-purple-400 truncate mt-0.5">{scene.description}</p>
        </div>

        {/* Duration badge */}
        <span className="text-[11px] text-purple-300 bg-purple-900/50 border border-purple-700/40 px-2 py-0.5 rounded-full flex-shrink-0">
          {scene.duration}s
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onDuplicate(scene.id)}
            className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors rounded-lg hover:bg-purple-800/30"
            title="Duplicate"
          >
            <Copy size={13} />
          </button>
          <button
            onClick={() => onDelete(scene.id)}
            className="p-1.5 text-purple-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors rounded-lg hover:bg-purple-800/30"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-purple-800/20 space-y-3">
              {/* Photo previews */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-lg skeleton flex-shrink-0 border border-purple-800/30"
                  />
                ))}
                <button className="w-14 h-14 rounded-lg border border-dashed border-purple-700/50 flex items-center justify-center text-purple-500 hover:text-purple-300 hover:border-purple-500 transition-colors flex-shrink-0">
                  <Plus size={16} />
                </button>
              </div>

              {/* Caption edit */}
              <div>
                <label className="text-[11px] text-purple-400 uppercase tracking-wider mb-1 block">Caption</label>
                <textarea
                  value={scene.caption}
                  onChange={(e) => onUpdate(scene.id, { caption: e.target.value })}
                  rows={2}
                  className="w-full glass-light rounded-xl px-3 py-2 text-sm text-purple-100 placeholder-purple-500 outline-none focus:border-purple-500 resize-none border border-purple-800/30 focus:border-purple-500/60"
                />
              </div>

              {/* Transition selector */}
              <div>
                <label className="text-[11px] text-purple-400 uppercase tracking-wider mb-1.5 block">Transition</label>
                <div className="flex gap-2 flex-wrap">
                  {TRANSITION_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => onUpdate(scene.id, { transition: t })}
                      className={clsx(
                        'px-3 py-1 rounded-full text-xs border transition-all duration-150',
                        scene.transition === t
                          ? 'bg-purple-600/50 border-purple-500 text-purple-100'
                          : 'border-purple-800/40 text-purple-400 hover:border-purple-600 hover:text-purple-200'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration slider */}
              <div>
                <label className="text-[11px] text-purple-400 uppercase tracking-wider mb-1 block">
                  Duration: <span className="text-purple-200">{scene.duration}s</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={60}
                  value={scene.duration}
                  onChange={(e) => onUpdate(scene.id, { duration: parseInt(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GenerationProgress({ progress, currentStep }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-purple-200 font-semibold">Generating Your Video…</h3>
        <span className="text-lg font-bold gradient-text">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-purple-900/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {GENERATION_STEPS.map((step, i) => {
          const stepProgress = (i / (GENERATION_STEPS.length - 1)) * 100;
          const isDone = progress > stepProgress;
          const isCurrent = currentStep === i;
          return (
            <div key={step} className="flex items-center gap-3">
              <div className={clsx(
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                isDone ? 'bg-green-500/80' : isCurrent ? 'bg-purple-500/80' : 'bg-purple-900/60'
              )}>
                {isDone ? (
                  <CheckCircle2 size={12} className="text-white" />
                ) : isCurrent ? (
                  <Loader2 size={11} className="animate-spin text-white" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                )}
              </div>
              <span className={clsx(
                'text-sm transition-colors',
                isDone ? 'text-green-300' : isCurrent ? 'text-purple-200' : 'text-purple-500'
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function SuccessState({ onTryAnother }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <Card glow className="text-center space-y-4 py-8">
        {/* Celebration */}
        <div className="flex justify-center gap-3 text-2xl animate-bounce">
          <span>🎉</span><span>💕</span><span>🎊</span>
        </div>
        <h3 className="font-display text-2xl gradient-text">Your video is ready!</h3>
        <p className="text-purple-300 text-sm max-w-xs mx-auto">
          A beautiful anniversary video crafted from your memories and love story.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button icon={Download} size="lg">
            Download Video
          </Button>
          <Button variant="secondary" icon={RotateCcw} onClick={onTryAnother}>
            Try Another Version
          </Button>
        </div>

        {/* Compare versions */}
        <div className="pt-4 border-t border-purple-800/30">
          <p className="text-xs text-purple-500 mb-3">Compare versions</p>
          <div className="flex gap-3 justify-center">
            {['Version A', 'Version B'].map((v) => (
              <button
                key={v}
                className="px-4 py-2 glass-light rounded-xl text-sm text-purple-300 hover:text-purple-100 border border-purple-700/30 hover:border-purple-500/50 transition-all"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VideoBuilder() {
  const videoProject = useStore(s => s.videoProject);
  const setVideoProject = useStore(s => s.setVideoProject);
  const isGenerating = useStore(s => s.isGenerating);
  const generationProgress = useStore(s => s.generationProgress);
  const setIsGenerating = useStore(s => s.setIsGenerating);
  const setGenerationProgress = useStore(s => s.setGenerationProgress);

  // Local state
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [selectedMood, setSelectedMood] = useState('Soft Piano');
  const [pacing, setPacing] = useState('balanced');
  const [aiNarration, setAiNarration] = useState(false);
  const [voiceNote, setVoiceNote] = useState(false);
  const [scenes, setScenes] = useState(INITIAL_SCENES);
  const [narrationOpen, setNarrationOpen] = useState(false);
  const [narrationScript, setNarrationScript] = useState(
    'From the first moment our eyes met to the beautiful life we have built together — this is our story. Every photograph a memory, every memory a treasure. Five years of laughter, adventure, quiet evenings, and boundless love. Happy Anniversary, my love.'
  );
  const [generationStep, setGenerationStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const generationRef = useRef(null);

  const status = isComplete ? 'complete' : isGenerating ? 'generating' : 'draft';
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  // Generation simulation
  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setIsComplete(false);
    setGenerationProgress(0);
    setGenerationStep(0);

    let progress = 0;
    generationRef.current = setInterval(() => {
      progress += Math.random() * 4 + 1.5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(generationRef.current);
        setGenerationProgress(100);
        setGenerationStep(4);
        setTimeout(() => {
          setIsGenerating(false);
          setIsComplete(true);
          setVideoProject({ status: 'complete' });
        }, 600);
        return;
      }
      setGenerationProgress(Math.round(progress));
      setGenerationStep(Math.min(3, Math.floor((progress / 100) * 4)));
    }, 120);
  };

  const handleTryAnother = () => {
    setIsComplete(false);
    setGenerationProgress(0);
    setGenerationStep(0);
  };

  useEffect(() => () => clearInterval(generationRef.current), []);

  const updateScene = (id, partial) =>
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)));

  const duplicateScene = (id) => {
    const src = scenes.find((s) => s.id === id);
    if (!src) return;
    const newScene = { ...src, id: `scene-${Date.now()}`, number: scenes.length + 1, title: `${src.title} (copy)` };
    setScenes((prev) => [...prev, newScene]);
  };

  const deleteScene = (id) =>
    setScenes((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, number: i + 1 })));

  const addScene = () => {
    const newScene = {
      id: `scene-${Date.now()}`,
      number: scenes.length + 1,
      type: 'photos',
      title: `Scene ${scenes.length + 1}`,
      description: 'New scene',
      duration: 10,
      transition: 'Fade',
      caption: '',
      expanded: true,
    };
    setScenes((prev) => [...prev, newScene]);
  };

  return (
    <div className="min-h-dvh bg-[#0d0618] pb-8">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 glass border-b border-purple-900/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center glow-rose flex-shrink-0">
              <Film size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl gradient-text leading-tight">Video Builder</h1>
              <p className="text-[11px] text-purple-400">
                {scenes.length} scenes · {Math.floor(totalDuration / 60)}m {totalDuration % 60}s total
              </p>
            </div>
          </div>
          <StatusBadge status={status} />
          <Button
            icon={isGenerating ? Loader2 : Film}
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={isComplete}
            size="md"
          >
            {isGenerating ? 'Generating…' : isComplete ? 'Generated ✓' : 'Generate Video'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Section 1: Style Configuration ── */}
        <Card>
          <h2 className="font-display text-lg text-purple-100 mb-4">Style Configuration</h2>

          {/* Style Presets */}
          <div className="mb-5">
            <label className="text-xs text-purple-400 uppercase tracking-wider mb-2.5 block">Style Preset</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {STYLE_PRESETS.map((preset) => (
                <motion.button
                  key={preset.id}
                  onClick={() => {
                    setSelectedStyle(preset.id);
                    setVideoProject({ style: preset.label });
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={clsx(
                    'p-3 rounded-xl text-left border transition-all duration-200',
                    selectedStyle === preset.id
                      ? 'border-purple-500 bg-purple-600/20 glow-violet'
                      : 'border-purple-800/40 hover:border-purple-600/60 hover:bg-purple-900/30'
                  )}
                >
                  <div className="text-xl mb-1.5">{preset.icon}</div>
                  <p className="text-xs font-semibold text-purple-100 leading-tight mb-0.5">{preset.label}</p>
                  <p className="text-[10px] text-purple-400 leading-snug">{preset.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Music Mood */}
          <div className="mb-5">
            <label className="text-xs text-purple-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 block">
              <Music size={12} /> Music Mood
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSIC_MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => {
                    setSelectedMood(mood);
                    setVideoProject({ musicMood: mood });
                  }}
                  className={clsx(
                    'px-3.5 py-1.5 rounded-full text-sm border transition-all duration-150',
                    selectedMood === mood
                      ? 'bg-pink-600/40 border-pink-500 text-pink-200'
                      : 'border-purple-800/40 text-purple-300 hover:border-purple-600 hover:text-purple-100'
                  )}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Pacing */}
          <div className="mb-5">
            <label className="text-xs text-purple-400 uppercase tracking-wider mb-2.5 block">Pacing</label>
            <div className="grid grid-cols-3 gap-2">
              {PACING_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setPacing(opt.id);
                    setVideoProject({ pacing: opt.id });
                  }}
                  className={clsx(
                    'p-3 rounded-xl border text-center transition-all duration-150',
                    pacing === opt.id
                      ? 'border-violet-500 bg-violet-600/20 text-violet-100'
                      : 'border-purple-800/40 text-purple-300 hover:border-purple-600'
                  )}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-[11px] text-purple-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Narration toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setAiNarration((v) => !v)}
                className={clsx(
                  'relative w-10 h-6 rounded-full transition-all duration-200',
                  aiNarration ? 'bg-purple-600' : 'bg-purple-900/60 border border-purple-700/50'
                )}
              >
                <div className={clsx(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200',
                  aiNarration ? 'left-4.5' : 'left-0.5'
                )} />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-purple-200">
                <Volume2 size={14} className="text-purple-400" />
                AI Narration
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setVoiceNote((v) => !v)}
                className={clsx(
                  'relative w-10 h-6 rounded-full transition-all duration-200',
                  voiceNote ? 'bg-pink-600' : 'bg-purple-900/60 border border-purple-700/50'
                )}
              >
                <div className={clsx(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200',
                  voiceNote ? 'left-4.5' : 'left-0.5'
                )} />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-purple-200">
                <Mic size={14} className="text-pink-400" />
                Voice Note
              </div>
            </label>
          </div>
        </Card>

        {/* ── Section 2: Scene Builder ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-lg text-purple-100">Video Scenes</h2>
              <p className="text-xs text-purple-400">{scenes.length} scenes configured</p>
            </div>
            <Button icon={Plus} variant="secondary" size="sm" onClick={addScene}>
              Add Scene
            </Button>
          </div>

          {/* AI generation buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="ghost" size="sm" icon={Sparkles}>
              Auto-generate Scene Titles
              {/* AI MESSAGE GENERATION */}
            </Button>
            <Button variant="ghost" size="sm" icon={Mic}>
              Auto-generate Narration
              {/* AI NARRATION GENERATION */}
            </Button>
            <Button variant="ghost" size="sm" icon={RefreshCw}>
              Regenerate All
            </Button>
          </div>

          {/* Scene list */}
          <div className="space-y-2">
            {scenes.map((scene, index) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={index}
                onUpdate={updateScene}
                onDuplicate={duplicateScene}
                onDelete={deleteScene}
              />
            ))}
          </div>
        </div>

        {/* ── Section 3: Narration Script ── */}
        <Card>
          <button
            onClick={() => setNarrationOpen((v) => !v)}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-2">
              <Mic size={16} className="text-purple-400" />
              <h2 className="font-display text-lg text-purple-100">Narration Script</h2>
            </div>
            {narrationOpen ? (
              <ChevronUp size={16} className="text-purple-400" />
            ) : (
              <ChevronDown size={16} className="text-purple-400" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {narrationOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <textarea
                    value={narrationScript}
                    onChange={(e) => setNarrationScript(e.target.value)}
                    rows={5}
                    placeholder="Your narration script will appear here…"
                    className="w-full glass-light rounded-xl px-4 py-3 text-sm text-purple-100 placeholder-purple-500 outline-none resize-none border border-purple-800/30 focus:border-purple-500/60 leading-relaxed"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-purple-500">{narrationScript.length} characters</p>
                    <Button variant="secondary" size="sm" icon={Sparkles}>
                      Generate with AI
                      {/* AI NARRATION GENERATION: generate spoken script here */}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* ── Section 4: Generation ── */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <GenerationProgress progress={generationProgress} currentStep={generationStep} />
            </motion.div>
          )}
          {isComplete && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <SuccessState onTryAnother={handleTryAnother} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
