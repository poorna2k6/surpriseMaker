import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  X,
  LayoutGrid,
  AlignLeft,
  SlidersHorizontal,
  RefreshCw,
  Scissors,
  Check,
  Tag,
  Trash2,
  ChevronRight,
  ImageOff,
  Layers,
} from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Mock data ────────────────────────────────────────────────────────────────

const TAG_OPTIONS = ['couple', 'me', 'spouse', 'family', 'anniversary', 'trip', 'favorite', 'candid', 'milestone'];

const GRADIENTS = [
  'from-pink-800 via-rose-900 to-purple-950',
  'from-violet-800 via-purple-900 to-indigo-950',
  'from-sky-800 via-indigo-900 to-violet-950',
  'from-amber-800 via-orange-900 to-red-950',
  'from-teal-800 via-cyan-900 to-sky-950',
  'from-fuchsia-800 via-pink-900 to-rose-950',
  'from-emerald-800 via-teal-900 to-cyan-950',
  'from-red-800 via-rose-900 to-pink-950',
  'from-indigo-800 via-violet-900 to-purple-950',
  'from-yellow-800 via-amber-900 to-orange-950',
];

const ALBUMS = ['Our Wedding', 'Honeymoon Bali', 'Anniversary Trip', 'Random Moments', 'Couple Selfies', 'Family'];
const FILTERS = ['All', 'Favorites', 'Must Include', 'Couple', 'Trips', 'Anniversaries', 'Videos'];

function makeMemory(i) {
  const year = 2019 + Math.floor(i / 3);
  const month = (i * 3) % 12;
  const day = (i * 7 % 27) + 1;
  const tagCount = 1 + (i % 3);
  const tags = TAG_OPTIONS.slice(i % TAG_OPTIONS.length, i % TAG_OPTIONS.length + tagCount);
  const statuses = ['optional', 'favorite', 'mustInclude', 'optional', 'optional', 'favorite'];
  return {
    id: `mem-${i}`,
    date: new Date(year, month, day),
    album: ALBUMS[i % ALBUMS.length],
    gradient: GRADIENTS[i % GRADIENTS.length],
    height: [140, 180, 160, 200, 150, 170][i % 6],
    tags,
    status: statuses[i % statuses.length],
    note: i % 5 === 0 ? 'One of my favourite moments' : '',
    isVideo: i % 7 === 0,
  };
}

const MOCK_MEMORIES = Array.from({ length: 24 }, (_, i) => makeMemory(i));

const QUICK_PICKS = {
  bestAnniversary: [0, 4, 8, 12],
  suggestedFavorites: [1, 5, 9],
  hiddenGems: [2, 6, 10, 14],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-purple-500/30 text-purple-100 border-purple-400/60'
          : 'bg-transparent text-purple-400 border-purple-700/40 hover:border-purple-500/50 hover:text-purple-300'
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
  if (status === 'favorite')
    return (
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-pink-500/80 flex items-center justify-center backdrop-blur-sm">
        <Heart size={11} className="text-white fill-white" />
      </div>
    );
  if (status === 'mustInclude')
    return (
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-500/80 flex items-center justify-center backdrop-blur-sm">
        <Star size={11} className="text-white fill-white" />
      </div>
    );
  return null;
}

function MemoryCard({ memory, isSelected, onSelect, onAction }) {
  const [hovered, setHovered] = useState(false);
  const dateStr = memory.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
        isSelected ? 'border-pink-400' : 'border-transparent'
      }`}
      style={{ height: memory.height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(memory.id)}
    >
      {/* Image placeholder */}
      <div className={`absolute inset-0 bg-gradient-to-br ${memory.gradient}`} />

      {/* Video indicator */}
      {memory.isVideo && (
        <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-0.5 text-[10px] text-white font-medium backdrop-blur-sm">
          VIDEO
        </div>
      )}

      {/* Status badge */}
      <StatusBadge status={memory.status} />

      {/* Selection check */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center shadow-md">
          <Check size={13} className="text-white" />
        </div>
      )}

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onAction(memory.id, 'favorite'); }}
              className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-pink-500/40 transition-colors"
              title="Favorite"
            >
              <Heart size={14} className="text-pink-300" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAction(memory.id, 'mustInclude'); }}
              className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-amber-500/40 transition-colors"
              title="Must Include"
            >
              <Star size={14} className="text-amber-300" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAction(memory.id, 'removed'); }}
              className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-red-500/40 transition-colors"
              title="Remove"
            >
              <X size={14} className="text-red-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2.5 pt-6">
        <div className="flex items-end justify-between gap-1">
          <div className="flex flex-wrap gap-1">
            {memory.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
                {t}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-white/60 flex-shrink-0">{dateStr}</span>
        </div>
        {memory.note && (
          <p className="text-[10px] text-white/70 mt-0.5 line-clamp-1 italic">{memory.note}</p>
        )}
        <p className="text-[9px] text-white/40 mt-0.5">{memory.album}</p>
      </div>
    </motion.div>
  );
}

function TimelineCard({ memory }) {
  const dateStr = memory.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <div className="flex-shrink-0 w-36 rounded-xl overflow-hidden glass">
      <div className={`h-24 bg-gradient-to-br ${memory.gradient}`} />
      <div className="p-2">
        <p className="text-purple-300 text-[10px]">{dateStr}</p>
        <div className="flex flex-wrap gap-0.5 mt-1">
          {memory.tags.slice(0, 1).map((t) => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickPickSection({ title, ids, onHighlight }) {
  return (
    <div className="space-y-2">
      <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {ids.map((i) => (
          <button
            key={i}
            onClick={() => onHighlight(`mem-${i}`)}
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${MOCK_MEMORIES[i]?.gradient ?? ''} hover:ring-2 hover:ring-pink-400/60 transition-all`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Memories() {
  const navigate = useNavigate();
  const { updateMediaItemStatus } = useStore();

  const [view, setView]                 = useState('grid');   // 'grid' | 'timeline'
  const [activeFilter, setActiveFilter] = useState('All');
  const [memories, setMemories]         = useState(MOCK_MEMORIES);
  const [selectedIds, setSelectedIds]   = useState(new Set());
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [highlightedId, setHighlightedId]   = useState(null);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (activeFilter === 'All') return memories;
    const map = {
      'Favorites':    (m) => m.status === 'favorite',
      'Must Include': (m) => m.status === 'mustInclude',
      'Couple':       (m) => m.tags.includes('couple'),
      'Trips':        (m) => m.tags.includes('trip'),
      'Anniversaries':(m) => m.tags.includes('anniversary'),
      'Videos':       (m) => m.isVideo,
    };
    return memories.filter(map[activeFilter] ?? (() => true));
  }, [memories, activeFilter]);

  // ── Select ──────────────────────────────────────────────────────────────────
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(filtered.map((m) => m.id)));
  };
  const clearSelection = () => setSelectedIds(new Set());

  // ── Action (hover buttons) ──────────────────────────────────────────────────
  const handleAction = (id, status) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    updateMediaItemStatus(id, status);
  };

  // ── Batch actions ───────────────────────────────────────────────────────────
  const batchTag = (status) => {
    setMemories((prev) =>
      prev.map((m) => (selectedIds.has(m.id) ? { ...m, status } : m))
    );
    clearSelection();
  };

  const batchRemove = () => {
    setMemories((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    clearSelection();
  };

  // ── Timeline grouping ───────────────────────────────────────────────────────
  const byYear = useMemo(() => {
    const map = {};
    filtered.forEach((m) => {
      const y = m.date.getFullYear();
      if (!map[y]) map[y] = [];
      map[y].push(m);
    });
    return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b));
  }, [filtered]);

  const anniversaryYears = new Set([2020, 2021, 2022, 2023, 2024]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0618] pb-28">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0d0618]/90 backdrop-blur-xl border-b border-purple-900/40 px-4 py-3">
        <div className="max-w-5xl mx-auto space-y-3">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold gradient-text">Your Memories</h1>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-medium">
                {memories.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 transition-colors ${view === 'grid' ? 'bg-purple-500/30 text-purple-200' : 'text-purple-500 hover:text-purple-300'}`}
                  title="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView('timeline')}
                  className={`p-2 transition-colors ${view === 'timeline' ? 'bg-purple-500/30 text-purple-200' : 'text-purple-500 hover:text-purple-300'}`}
                  title="Timeline view"
                >
                  <AlignLeft size={16} />
                </button>
              </div>
              {/* Quick picks panel toggle */}
              <button
                onClick={() => setQuickPanelOpen((v) => !v)}
                className={`p-2 rounded-xl transition-all ${quickPanelOpen ? 'bg-purple-500/30 text-purple-200' : 'glass text-purple-500 hover:text-purple-300'}`}
                title="Quick Picks"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-5 flex gap-5">
        {/* ── Main content ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* ── Batch actions bar ─────────────────────────────────────────── */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="glass rounded-2xl p-3 mb-4 flex flex-wrap items-center gap-2"
              >
                <span className="text-purple-300 text-sm font-medium">
                  {selectedIds.size} selected
                </span>
                <div className="flex-1" />
                <button
                  onClick={selectedIds.size === filtered.length ? clearSelection : selectAll}
                  className="text-xs text-purple-400 hover:text-purple-200 transition-colors underline underline-offset-2"
                >
                  {selectedIds.size === filtered.length ? 'Deselect All' : 'Select All'}
                </button>
                <Button size="sm" variant="ghost" icon={Tag} onClick={() => batchTag('favorite')}>
                  Favorite
                </Button>
                <Button size="sm" variant="ghost" icon={Star} onClick={() => batchTag('mustInclude')}>
                  Must Include
                </Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={batchRemove}>
                  Remove
                </Button>
                <button onClick={clearSelection} className="p-1.5 rounded-lg hover:bg-white/10 text-purple-400 hover:text-purple-200 transition-colors">
                  <X size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Empty state ───────────────────────────────────────────────── */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-5 py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-purple-900/40 flex items-center justify-center">
                <ImageOff size={36} className="text-purple-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-2xl font-semibold gradient-text">No memories yet</h3>
                <p className="text-purple-400 text-sm">Connect your photos to start building your story</p>
              </div>
              <Button variant="primary" size="md" icon={ChevronRight} iconPosition="right" onClick={() => navigate('/connect-photos')}>
                Connect Photos
              </Button>
            </motion.div>
          )}

          {/* ── Grid view ─────────────────────────────────────────────────── */}
          {view === 'grid' && filtered.length > 0 && (
            <div className="columns-2 sm:columns-3 gap-3 space-y-3">
              {filtered.map((memory, idx) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                  className="break-inside-avoid mb-3"
                >
                  <MemoryCard
                    memory={memory}
                    isSelected={selectedIds.has(memory.id)}
                    onSelect={toggleSelect}
                    onAction={handleAction}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Timeline view ─────────────────────────────────────────────── */}
          {view === 'timeline' && filtered.length > 0 && (
            <div className="space-y-8">
              {byYear.map(([year, items]) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20" />
                    <h3 className="font-display text-xl font-semibold gradient-text">{year}</h3>
                    {anniversaryYears.has(Number(year)) && (
                      <span className="text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
                        Anniversary Year
                      </span>
                    )}
                    <span className="text-purple-600 text-xs">{items.length} memories</span>
                  </div>
                  <div className="ml-6 pl-4 border-l border-purple-800/50">
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {items.map((m) => (
                        <TimelineCard key={m.id} memory={m} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>

        {/* ── Quick Picks sidebar (desktop) ──────────────────────────────────── */}
        <AnimatePresence>
          {quickPanelOpen && (
            <motion.aside
              initial={{ opacity: 0, x: 24, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 240 }}
              exit={{ opacity: 0, x: 24, width: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="hidden lg:block flex-shrink-0 overflow-hidden"
            >
              <div className="glass rounded-2xl p-4 space-y-5 sticky top-24">
                <h3 className="text-purple-200 font-semibold text-sm">Quick Picks</h3>

                <QuickPickSection
                  title="Best Anniversary Picks"
                  ids={QUICK_PICKS.bestAnniversary}
                  onHighlight={setHighlightedId}
                />
                <QuickPickSection
                  title="Suggested Favorites"
                  ids={QUICK_PICKS.suggestedFavorites}
                  onHighlight={setHighlightedId}
                />
                <QuickPickSection
                  title="Hidden Gems"
                  ids={QUICK_PICKS.hiddenGems}
                  onHighlight={setHighlightedId}
                />

                <div className="space-y-2 pt-1">
                  <Button variant="ghost" size="sm" icon={RefreshCw} fullWidth onClick={() => {}}>
                    Refresh Suggestions
                  </Button>
                  <Button variant="secondary" size="sm" icon={Scissors} fullWidth onClick={() => {}}>
                    Re-curate
                  </Button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Quick Picks bottom sheet ──────────────────────────────────── */}
      <AnimatePresence>
        {quickPanelOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass rounded-t-3xl p-5 space-y-4 border-t border-purple-700/40"
          >
            <div className="w-10 h-1 rounded-full bg-purple-600/50 mx-auto" />
            <h3 className="text-purple-200 font-semibold text-sm">Quick Picks</h3>
            <QuickPickSection
              title="Best Anniversary Picks"
              ids={QUICK_PICKS.bestAnniversary}
              onHighlight={setHighlightedId}
            />
            <QuickPickSection
              title="Suggested Favorites"
              ids={QUICK_PICKS.suggestedFavorites}
              onHighlight={setHighlightedId}
            />
            <div className="flex gap-2 pb-safe">
              <Button variant="ghost" size="sm" icon={RefreshCw} fullWidth onClick={() => setQuickPanelOpen(false)}>
                Refresh
              </Button>
              <Button variant="secondary" size="sm" icon={Scissors} fullWidth onClick={() => setQuickPanelOpen(false)}>
                Re-curate
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Continue CTA ──────────────────────────────────────────────────────── */}
      <div className="fixed bottom-20 right-4 z-30">
        <Button
          variant="primary"
          size="md"
          icon={ChevronRight}
          iconPosition="right"
          onClick={() => navigate('/timeline')}
        >
          Timeline
        </Button>
      </div>
    </div>
  );
}
