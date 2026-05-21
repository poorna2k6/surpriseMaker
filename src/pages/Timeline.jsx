import { useState, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Wand2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  GripVertical,
  Pencil,
  Image,
  Trash2,
  Check,
  X,
  Calendar,
  RefreshCw,
  Layers,
} from 'lucide-react';
import useStore from '../store/useStore';
import CountdownTimer from '../components/ui/CountdownTimer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Mock data ────────────────────────────────────────────────────────────────

const THUMB_GRADIENTS = [
  'from-pink-800 to-rose-900',
  'from-violet-800 to-purple-900',
  'from-sky-800 to-indigo-900',
  'from-amber-800 to-orange-900',
  'from-teal-800 to-cyan-900',
  'from-fuchsia-800 to-pink-900',
  'from-emerald-800 to-teal-900',
  'from-red-800 to-rose-900',
];

const INITIAL_CHAPTERS = [
  {
    id: 'ch-1',
    number: 1,
    title: 'The Beginning',
    dateRange: 'June 2019',
    caption: 'The day everything changed — our wedding day and the start of our honeymoon in Bali.',
    photoCount: 6,
    tags: ['wedding', 'honeymoon'],
  },
  {
    id: 'ch-2',
    number: 2,
    title: 'First Year Together',
    dateRange: '2019 – 2020',
    caption: 'Building our home, our routines, and our life. Every ordinary moment was extraordinary.',
    photoCount: 4,
    tags: ['daily life', 'milestones'],
  },
  {
    id: 'ch-3',
    number: 3,
    title: 'First Anniversary',
    dateRange: 'June 2020',
    caption: 'One whole year of love. We celebrated quietly but deeply.',
    photoCount: 3,
    tags: ['anniversary', '1 year'],
  },
  {
    id: 'ch-4',
    number: 4,
    title: 'Adventures & Memories',
    dateRange: '2020 – 2021',
    caption: 'Road trips, spontaneous weekends away, and the joy of discovering new places together.',
    photoCount: 5,
    tags: ['travel', 'adventures'],
  },
  {
    id: 'ch-5',
    number: 5,
    title: 'Second Anniversary',
    dateRange: 'June 2021',
    caption: 'Two years strong. We laughed, we cried, and we danced in the kitchen at midnight.',
    photoCount: 3,
    tags: ['anniversary', '2 years'],
  },
  {
    id: 'ch-6',
    number: 6,
    title: 'Growing Together',
    dateRange: '2021 – 2022',
    caption: 'New challenges, new joys, and the quiet understanding that only comes with time.',
    photoCount: 4,
    tags: ['growth', 'daily life'],
  },
  {
    id: 'ch-7',
    number: 7,
    title: 'Third Anniversary',
    dateRange: 'June 2022',
    caption: 'Three years. More in love than ever, and more ourselves than ever before.',
    photoCount: 3,
    tags: ['anniversary', '3 years'],
  },
  {
    id: 'ch-8',
    number: 8,
    title: 'Recent Highlights',
    dateRange: '2023 – 2024',
    caption: 'The latest chapter of our story — still being written, still full of wonder.',
    photoCount: 6,
    tags: ['recent', 'highlights'],
  },
  {
    id: 'ch-9',
    number: 9,
    title: 'A Message For You',
    dateRange: 'Now & Always',
    caption: 'From my heart to yours — everything I want you to know, everything I feel.',
    photoCount: 2,
    tags: ['message', 'love'],
  },
];

const TIMELINE_MODES = ['Auto', 'Manual', 'Hybrid'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhotoThumb({ index }) {
  const grad = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];
  return (
    <div
      className={`flex-shrink-0 w-20 h-16 rounded-xl bg-gradient-to-br ${grad} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}

function ChapterCard({ chapter, onUpdate, onDelete, onReorder }) {
  const [expanded, setExpanded]     = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(chapter.title);
  const [captionDraft, setCaptionDraft] = useState(chapter.caption);
  const [editingCaption, setEditingCaption] = useState(false);
  const titleRef = useRef(null);

  const commitTitle = () => {
    onUpdate(chapter.id, { title: titleDraft.trim() || chapter.title });
    setEditingTitle(false);
  };

  const commitCaption = () => {
    onUpdate(chapter.id, { caption: captionDraft });
    setEditingCaption(false);
  };

  return (
    <motion.div layout className="relative">
      {/* Timeline dot + line */}
      <div className="absolute left-0 top-5 flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20 z-10" />
        <div className="w-px flex-1 bg-purple-800/50 mt-1" />
      </div>

      <div className="ml-7 pb-6">
        <Card padding="md" className="group">
          {/* Card header */}
          <div className="flex items-start gap-3">
            {/* Drag handle */}
            <div
              className="mt-0.5 cursor-grab active:cursor-grabbing text-purple-700 hover:text-purple-400 transition-colors flex-shrink-0"
              title="Drag to reorder"
            >
              <GripVertical size={18} />
            </div>

            {/* Chapter number badge */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <span className="text-purple-300 text-xs font-semibold">{chapter.number}</span>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={titleRef}
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
                    autoFocus
                    className="flex-1 bg-transparent border-b border-purple-400/60 text-purple-100 font-semibold text-sm outline-none py-0.5 min-w-0"
                  />
                  <button onClick={commitTitle} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
                  <button onClick={() => setEditingTitle(false)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingTitle(true); setTimeout(() => titleRef.current?.focus(), 50); }}
                  className="group/title flex items-center gap-1.5 text-left"
                >
                  <span className="text-purple-100 font-semibold text-sm">{chapter.title}</span>
                  <Pencil size={12} className="text-purple-600 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                </button>
              )}
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar size={11} className="text-purple-600" />
                <span className="text-purple-500 text-xs">{chapter.dateRange}</span>
              </div>
            </div>

            {/* Chapter actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => {}}
                className="p-1.5 rounded-lg text-purple-500 hover:text-purple-300 hover:bg-white/5 transition-all"
                title="Edit chapter"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {}}
                className="p-1.5 rounded-lg text-purple-500 hover:text-purple-300 hover:bg-white/5 transition-all"
                title="Add photos"
              >
                <Image size={14} />
              </button>
              <button
                onClick={() => onDelete(chapter.id)}
                className="p-1.5 rounded-lg text-purple-700 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Delete chapter"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1.5 rounded-lg text-purple-500 hover:text-purple-300 hover:bg-white/5 transition-all"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  {/* Thumbnail strip */}
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {Array.from({ length: chapter.photoCount }, (_, i) => (
                      <PhotoThumb key={i} index={chapter.number * 3 + i} />
                    ))}
                    <button className="flex-shrink-0 w-20 h-16 rounded-xl border-2 border-dashed border-purple-700/50 hover:border-purple-500/70 flex items-center justify-center text-purple-600 hover:text-purple-400 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Caption */}
                  {editingCaption ? (
                    <div className="space-y-2">
                      <textarea
                        value={captionDraft}
                        onChange={(e) => setCaptionDraft(e.target.value)}
                        rows={3}
                        autoFocus
                        className="w-full bg-purple-900/20 border border-purple-700/50 rounded-xl px-3 py-2 text-purple-200 text-xs resize-none outline-none focus:border-purple-500/70 transition-colors"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={commitCaption}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingCaption(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingCaption(true)}
                      className="w-full text-left group/caption"
                    >
                      <p className="text-purple-400 text-xs leading-relaxed group-hover/caption:text-purple-300 transition-colors">
                        {chapter.caption}
                      </p>
                      <p className="text-purple-700 text-[10px] mt-1 group-hover/caption:text-purple-500 transition-colors">
                        Tap to edit caption
                      </p>
                    </button>
                  )}

                  {/* Tag chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {chapter.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-700/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Timeline() {
  const navigate = useNavigate();
  const { timelineChapters, setTimelineChapters, addTimelineChapter, updateTimelineChapter, removeTimelineChapter, userProfile } =
    useStore();

  const [chapters, setChapters]       = useState(INITIAL_CHAPTERS);
  const [mode, setMode]               = useState('Auto');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isAutoCurating, setIsAutoCurating] = useState(false);

  const targetDate = userProfile.nextAnniversaryDate ?? new Date(new Date().getFullYear() + 1, 5, 15);

  // ── Add chapter ─────────────────────────────────────────────────────────────
  const handleAddChapter = () => {
    const newChapter = {
      id: `ch-${Date.now()}`,
      number: chapters.length + 1,
      title: 'New Chapter',
      dateRange: 'Enter dates',
      caption: 'Add a caption for this chapter.',
      photoCount: 0,
      tags: [],
    };
    setChapters((prev) => [...prev, newChapter]);
  };

  // ── Update chapter ──────────────────────────────────────────────────────────
  const handleUpdate = (id, partial) => {
    setChapters((prev) => prev.map((ch) => (ch.id === id ? { ...ch, ...partial } : ch)));
  };

  // ── Delete chapter ──────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
  };

  // ── Regenerate (demo) ───────────────────────────────────────────────────────
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((r) => setTimeout(r, 1600));
    setChapters(INITIAL_CHAPTERS.map((ch) => ({ ...ch })));
    setIsRegenerating(false);
  };

  // ── Auto-curate (demo) ──────────────────────────────────────────────────────
  const handleAutoCurate = async () => {
    setIsAutoCurating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAutoCurating(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0618] pb-28">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="bg-[#0d0618]/90 backdrop-blur-xl border-b border-purple-900/40 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="font-display text-3xl font-semibold gradient-text">Anniversary Timeline</h1>
              <div className="mt-1">
                <CountdownTimer targetDate={targetDate} compact />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                icon={Wand2}
                loading={isAutoCurating}
                onClick={handleAutoCurate}
              >
                {isAutoCurating ? 'Curating…' : 'Auto-Curate'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleAddChapter}
              >
                Add Chapter
              </Button>
            </div>
          </div>

          {/* Mode selector */}
          <div className="flex items-center gap-2">
            <span className="text-purple-500 text-xs">Mode:</span>
            <div className="flex glass rounded-xl overflow-hidden">
              {TIMELINE_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                    mode === m
                      ? 'bg-purple-500/30 text-purple-100'
                      : 'text-purple-500 hover:text-purple-300 hover:bg-white/5'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline ──────────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <AnimatePresence>
          {chapters.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-20 text-center"
            >
              <Layers size={40} className="text-purple-700" />
              <div>
                <p className="font-display text-2xl gradient-text font-semibold">No chapters yet</p>
                <p className="text-purple-500 text-sm mt-1">Click "Add Chapter" or use Auto-Curate to build your timeline</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reorderable chapters */}
        <Reorder.Group
          axis="y"
          values={chapters}
          onReorder={setChapters}
          className="relative"
        >
          {/* Vertical timeline line */}
          <div className="absolute left-[5px] top-5 bottom-0 w-px bg-gradient-to-b from-purple-600/60 via-purple-800/40 to-transparent" />

          {chapters.map((chapter) => (
            <Reorder.Item key={chapter.id} value={chapter} className="list-none">
              <ChapterCard
                chapter={chapter}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Bottom controls */}
        {chapters.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center">
            <Button
              variant="ghost"
              size="md"
              icon={RefreshCw}
              loading={isRegenerating}
              onClick={handleRegenerate}
              fullWidth
            >
              {isRegenerating ? 'Regenerating…' : 'Regenerate Timeline'}
            </Button>
            <Button
              variant="ghost"
              size="md"
              icon={Plus}
              onClick={handleAddChapter}
              fullWidth
            >
              Add Chapter
            </Button>
          </div>
        )}

        {/* Continue */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/messages')}
          >
            Continue to Messages
          </Button>
        </div>
      </div>
    </div>
  );
}
