import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Star, X, LayoutGrid, AlignLeft, SlidersHorizontal,
  Check, Tag, Trash2, ChevronRight, Images, Upload, Play,
} from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';

const GRADIENTS = [
  'from-pink-800 via-rose-900 to-purple-950',
  'from-violet-800 via-purple-900 to-indigo-950',
  'from-sky-800 via-indigo-900 to-violet-950',
  'from-amber-800 via-orange-900 to-red-950',
  'from-teal-800 via-cyan-900 to-sky-950',
  'from-fuchsia-800 via-pink-900 to-rose-950',
  'from-emerald-800 via-teal-900 to-cyan-950',
  'from-red-800 via-rose-900 to-pink-950',
];

const FILTERS = ['All', 'Favorites', 'Must Include', 'Photos', 'Videos'];

function gradientFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

function heightFor(id) {
  const sizes = [140, 160, 180, 150, 170, 200];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 17 + id.charCodeAt(i)) & 0xffffffff;
  return sizes[Math.abs(h) % sizes.length];
}

// ─── MemoryCard ───────────────────────────────────────────────────────────────
function MemoryCard({ item, tagged, isSelected, onSelect, onStatusChange }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const status = tagged?.status || item.status || 'optional';
  const tags = tagged?.tags?.length ? tagged.tags : item.tags;
  const isVideo = item.type === 'video';
  const thumb = !imgError && (item.thumbnailUrl || item.url);
  const gradient = gradientFor(item.id);
  const height = heightFor(item.id);

  const dateStr = item.dateTaken
    ? new Date(item.dateTaken).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : item.sourceLabel || 'Uploaded';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
        isSelected ? 'border-pink-400' : 'border-transparent'
      }`}
      style={{ height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(item.id)}
    >
      {/* Thumbnail / gradient background */}
      {thumb ? (
        <img
          src={thumb}
          alt={item.filename || 'Memory'}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Video badge */}
      {isVideo && (
        <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 backdrop-blur-sm">
          <Play size={10} className="text-white fill-white" />
        </div>
      )}

      {/* Status badge */}
      {status === 'favorite' && (
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-pink-500/90 flex items-center justify-center">
          <Heart size={11} className="text-white fill-white" />
        </div>
      )}
      {status === 'mustInclude' && (
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-500/90 flex items-center justify-center">
          <Star size={11} className="text-white fill-white" />
        </div>
      )}

      {/* Selected check */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center shadow">
          <Check size={12} className="text-white" />
        </div>
      )}

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
          >
            <button
              onClick={e => { e.stopPropagation(); onStatusChange(item.id, status === 'favorite' ? 'optional' : 'favorite'); }}
              className={`w-9 h-9 rounded-full glass flex items-center justify-center transition-colors ${status === 'favorite' ? 'bg-pink-500/60' : 'hover:bg-pink-500/40'}`}
            >
              <Heart size={15} className="text-pink-300" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onStatusChange(item.id, status === 'mustInclude' ? 'optional' : 'mustInclude'); }}
              className={`w-9 h-9 rounded-full glass flex items-center justify-center transition-colors ${status === 'mustInclude' ? 'bg-amber-500/60' : 'hover:bg-amber-500/40'}`}
            >
              <Star size={15} className="text-amber-300" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onStatusChange(item.id, 'removed'); }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-red-500/40 transition-colors"
            >
              <X size={15} className="text-red-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 pt-5">
        <div className="flex items-end justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map(t => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/15 text-white/80">
                {t}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-white/60 flex-shrink-0">{dateStr}</span>
        </div>
        {item.sourceLabel && (
          <p className="text-[9px] text-white/40 mt-0.5">{item.sourceLabel}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-6 py-20 text-center px-6"
    >
      <div className="w-24 h-24 rounded-full bg-purple-900/40 border border-purple-700/30 flex items-center justify-center">
        <Images size={40} className="text-purple-600" />
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold gradient-text mb-2">No memories yet</h3>
        <p className="text-purple-400 text-sm max-w-xs mx-auto leading-relaxed">
          Import photos from Google Photos or upload directly from your device to start building your anniversary story.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" icon={Images} onClick={() => navigate('/connect')}>
          Connect Photos
        </Button>
        <Button variant="secondary" icon={Upload} onClick={() => navigate('/connect')}>
          Upload Directly
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Memories() {
  const navigate = useNavigate();

  // Read real data from store
  const mediaItems = useStore(s => s.mediaItems);
  const taggedMedia = useStore(s => s.taggedMedia);
  const updateMediaItemStatus = useStore(s => s.updateMediaItemStatus);
  const tagMediaItem = useStore(s => s.tagMediaItem);
  const removeMediaItem = useStore(s => s.removeMediaItem);

  const [view, setView] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [quickOpen, setQuickOpen] = useState(false);

  // Merge store tagged state on top of raw items (removed items hidden)
  const visibleItems = useMemo(() =>
    mediaItems.filter(item => (taggedMedia[item.id]?.status || item.status) !== 'removed'),
    [mediaItems, taggedMedia]
  );

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return visibleItems;
    return visibleItems.filter(item => {
      const status = taggedMedia[item.id]?.status || item.status;
      if (activeFilter === 'Favorites') return status === 'favorite';
      if (activeFilter === 'Must Include') return status === 'mustInclude';
      if (activeFilter === 'Photos') return item.type !== 'video';
      if (activeFilter === 'Videos') return item.type === 'video';
      return true;
    });
  }, [visibleItems, taggedMedia, activeFilter]);

  // Group by year for timeline view
  const byYear = useMemo(() => {
    const map = {};
    filtered.forEach(item => {
      const y = item.dateTaken ? new Date(item.dateTaken).getFullYear() : 'Unknown';
      if (!map[y]) map[y] = [];
      map[y].push(item);
    });
    return Object.entries(map).sort(([a], [b]) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return Number(b) - Number(a);
    });
  }, [filtered]);

  const toggleSelect = id => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleStatusChange = (id, status) => {
    if (status === 'removed') {
      removeMediaItem(id);
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } else {
      updateMediaItemStatus(id, status);
    }
  };

  const batchStatus = status => {
    selectedIds.forEach(id => {
      if (status === 'removed') removeMediaItem(id);
      else updateMediaItemStatus(id, status);
    });
    setSelectedIds(new Set());
  };

  const hasPhotos = visibleItems.length > 0;

  return (
    <div className="min-h-screen bg-[#0d0618] pb-28">

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0d0618]/90 backdrop-blur-xl border-b border-purple-900/40 px-4 py-3">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold gradient-text">Your Memories</h1>
              {hasPhotos && (
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {visibleItems.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasPhotos && (
                <div className="flex glass rounded-xl overflow-hidden">
                  <button onClick={() => setView('grid')}
                    className={`p-2 transition-colors ${view === 'grid' ? 'bg-purple-500/30 text-purple-200' : 'text-purple-500 hover:text-purple-300'}`}>
                    <LayoutGrid size={16} />
                  </button>
                  <button onClick={() => setView('timeline')}
                    className={`p-2 transition-colors ${view === 'timeline' ? 'bg-purple-500/30 text-purple-200' : 'text-purple-500 hover:text-purple-300'}`}>
                    <AlignLeft size={16} />
                  </button>
                </div>
              )}
              <button onClick={() => navigate('/connect')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-purple-300 hover:text-purple-100 text-xs transition-colors">
                <Upload size={13} /> Add Photos
              </button>
            </div>
          </div>

          {hasPhotos && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeFilter === f
                      ? 'bg-purple-500/30 text-purple-100 border-purple-400/60'
                      : 'bg-transparent text-purple-400 border-purple-700/40 hover:border-purple-500/50'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-5">

        {/* No photos imported yet */}
        {!hasPhotos && <EmptyState navigate={navigate} />}

        {hasPhotos && (
          <>
            {/* Batch action bar */}
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-2xl p-3 mb-4 flex flex-wrap items-center gap-2"
                >
                  <span className="text-purple-300 text-sm font-medium">{selectedIds.size} selected</span>
                  <div className="flex-1" />
                  <button onClick={() => setSelectedIds(new Set(filtered.map(i => i.id)))}
                    className="text-xs text-purple-400 hover:text-purple-200 transition-colors">
                    Select All
                  </button>
                  <Button size="sm" variant="ghost" icon={Heart} onClick={() => batchStatus('favorite')}>Favorite</Button>
                  <Button size="sm" variant="ghost" icon={Star} onClick={() => batchStatus('mustInclude')}>Must Include</Button>
                  <Button size="sm" variant="danger" icon={Trash2} onClick={() => batchStatus('removed')}>Remove</Button>
                  <button onClick={() => setSelectedIds(new Set())} className="p-1.5 rounded-lg hover:bg-white/10 text-purple-400">
                    <X size={15} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter empty */}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-purple-500">
                <p className="text-sm">No memories match this filter.</p>
                <button onClick={() => setActiveFilter('All')} className="text-purple-400 text-sm underline mt-2">Show all</button>
              </div>
            )}

            {/* Grid view */}
            {view === 'grid' && filtered.length > 0 && (
              <div className="columns-2 sm:columns-3 gap-3">
                {filtered.map((item, idx) => (
                  <div key={item.id} className="break-inside-avoid mb-3">
                    <MemoryCard
                      item={item}
                      tagged={taggedMedia[item.id]}
                      isSelected={selectedIds.has(item.id)}
                      onSelect={toggleSelect}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Timeline view */}
            {view === 'timeline' && filtered.length > 0 && (
              <div className="space-y-8">
                {byYear.map(([year, items]) => (
                  <div key={year}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20 flex-shrink-0" />
                      <h3 className="font-display text-xl font-semibold gradient-text">{year}</h3>
                      <span className="text-purple-600 text-xs">{items.length} photos</span>
                    </div>
                    <div className="ml-6 pl-4 border-l border-purple-800/50">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {items.map(item => {
                          const [imgErr, setImgErr] = useState(false);
                          const thumb = !imgErr && (item.thumbnailUrl || item.url);
                          return (
                            <div key={item.id} className="flex-shrink-0 w-36 rounded-xl overflow-hidden glass">
                              <div className={`h-24 relative bg-gradient-to-br ${gradientFor(item.id)}`}>
                                {thumb && (
                                  <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover"
                                    onError={() => setImgErr(true)} />
                                )}
                              </div>
                              <div className="p-2">
                                <p className="text-purple-400 text-[10px] truncate">
                                  {item.dateTaken ? new Date(item.dateTaken).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : item.filename}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Continue CTA */}
            <div className="mt-10 flex justify-end">
              <Button variant="primary" icon={ChevronRight} iconPosition="right" onClick={() => navigate('/timeline')}>
                Build Timeline
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
