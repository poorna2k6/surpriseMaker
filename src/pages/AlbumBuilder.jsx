import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Lock,
  Unlock,
  Download,
  Share2,
  Link2,
  Image,
  LayoutGrid,
  Layers,
  Square,
  Heart,
  Sparkles,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Constants ────────────────────────────────────────────────────────────────

const COVER_STYLES = [
  { id: 'elegant-white',    label: 'Elegant White',    swatch: 'from-gray-100 to-white',            textColor: 'text-gray-800' },
  { id: 'dark-cinematic',   label: 'Dark Cinematic',   swatch: 'from-gray-900 to-black',             textColor: 'text-gray-100' },
  { id: 'vintage-film',     label: 'Vintage Film',     swatch: 'from-amber-800 to-yellow-900',       textColor: 'text-amber-100' },
  { id: 'floral-romance',   label: 'Floral Romance',   swatch: 'from-rose-300 to-pink-500',          textColor: 'text-white' },
  { id: 'minimal-modern',   label: 'Minimal Modern',   swatch: 'from-violet-900 to-purple-800',      textColor: 'text-purple-100' },
];

const LAYOUT_OPTIONS = [
  { id: 'grid',    icon: LayoutGrid, label: 'Grid' },
  { id: 'collage', icon: Layers,     label: 'Collage' },
  { id: 'single',  icon: Square,     label: 'Single' },
];

const INITIAL_PAGES = [
  {
    id: 'page-cover',
    number: 1,
    isCover: true,
    title: 'Cover',
    photoCount: 1,
    layout: 'single',
    caption: '',
    loveNote: '',
    showLoveNote: false,
    isLocked: false,
    isSurprise: false,
  },
  {
    id: 'page-2',
    number: 2,
    isCover: false,
    title: 'The Beginning',
    photoCount: 4,
    layout: 'grid',
    caption: 'Where it all started — the day we said yes to forever.',
    loveNote: '',
    showLoveNote: false,
    isLocked: false,
    isSurprise: false,
  },
  {
    id: 'page-3',
    number: 3,
    isCover: false,
    title: 'Our First Year',
    photoCount: 6,
    layout: 'collage',
    caption: 'Every first we shared made us more us.',
    loveNote: 'I still remember the way you looked at me that morning.',
    showLoveNote: true,
    isLocked: false,
    isSurprise: false,
  },
  {
    id: 'page-4',
    number: 4,
    isCover: false,
    title: 'Adventures Together',
    photoCount: 5,
    layout: 'collage',
    caption: 'The world is better when we explore it side by side.',
    loveNote: '',
    showLoveNote: false,
    isLocked: false,
    isSurprise: false,
  },
  {
    id: 'page-5',
    number: 5,
    isCover: false,
    title: 'Anniversary Moments',
    photoCount: 8,
    layout: 'grid',
    caption: 'Five years of celebrations, big and small.',
    loveNote: '',
    showLoveNote: false,
    isLocked: false,
    isSurprise: false,
  },
  {
    id: 'page-6',
    number: 6,
    isCover: false,
    title: 'A Final Surprise',
    photoCount: 1,
    layout: 'single',
    caption: '',
    loveNote: 'You are the greatest adventure I have ever chosen.',
    showLoveNote: true,
    isLocked: true,
    isSurprise: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhotoPlaceholder({ count, layout }) {
  const gridClass = {
    grid: 'grid-cols-2',
    collage: 'grid-cols-3',
    single: 'grid-cols-1',
  }[layout] || 'grid-cols-2';

  const displayCount = Math.min(count, layout === 'single' ? 1 : layout === 'grid' ? 4 : 3);

  return (
    <div className={clsx('grid gap-1.5', gridClass)}>
      {[...Array(displayCount)].map((_, i) => (
        <div
          key={i}
          className={clsx(
            'skeleton rounded-lg border border-purple-800/20',
            layout === 'single' ? 'aspect-[4/3]' : 'aspect-square'
          )}
        />
      ))}
    </div>
  );
}

function AlbumPageCard({ page, onUpdate }) {
  return (
    <Card className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-800/60 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-purple-300">{page.number}</span>
          </div>
          {page.isSurprise ? (
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-pink-400" />
              <span className="text-sm font-semibold text-purple-100">{page.title}</span>
              <span className="text-sm">✨</span>
            </div>
          ) : (
            <input
              value={page.title}
              onChange={(e) => onUpdate(page.id, { title: e.target.value })}
              className="bg-transparent text-sm font-semibold text-purple-100 outline-none w-full"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {!page.isSurprise && (
            <span className="text-[11px] text-purple-400 bg-purple-900/50 border border-purple-700/40 px-2 py-0.5 rounded-full">
              {page.photoCount} photo{page.photoCount !== 1 ? 's' : ''}
            </span>
          )}

          {/* Layout selector */}
          {!page.isSurprise && !page.isCover && (
            <div className="flex gap-1">
              {LAYOUT_OPTIONS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => onUpdate(page.id, { layout: id })}
                  title={label}
                  className={clsx(
                    'p-1.5 rounded-lg transition-all duration-150',
                    page.layout === id
                      ? 'bg-purple-600/40 text-purple-200'
                      : 'text-purple-500 hover:text-purple-300 hover:bg-purple-800/30'
                  )}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Surprise locked page */}
      {page.isSurprise ? (
        <div className="flex flex-col items-center justify-center py-6 border border-dashed border-pink-700/40 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-full bg-pink-900/40 flex items-center justify-center animate-heartbeat">
            <Lock size={18} className="text-pink-400" />
          </div>
          <p className="text-sm font-medium text-purple-200">This page is a surprise ✨</p>
          <p className="text-xs text-purple-400 text-center max-w-[200px]">
            Locked until you share the final album with them.
          </p>
          <button
            onClick={() => onUpdate(page.id, { isLocked: !page.isLocked })}
            className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-200 transition-colors mt-1"
          >
            {page.isLocked ? <Unlock size={12} /> : <Lock size={12} />}
            {page.isLocked ? 'Preview surprise' : 'Lock again'}
          </button>
          {!page.isLocked && (
            <div className="w-full px-4 pt-2">
              <textarea
                value={page.loveNote}
                onChange={(e) => onUpdate(page.id, { loveNote: e.target.value })}
                rows={3}
                placeholder="Write your surprise message…"
                className="w-full glass-light rounded-xl px-3 py-2 text-sm text-purple-100 placeholder-purple-500 outline-none resize-none border border-pink-800/30 focus:border-pink-500/50"
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Cover special design */}
          {page.isCover ? (
            <div className="relative h-28 rounded-xl bg-gradient-to-br from-purple-900 via-pink-900 to-violet-900 overflow-hidden flex items-center justify-center border border-purple-700/30">
              <div className="text-center">
                <p className="font-display text-lg gradient-text">Our 5 Years</p>
                <p className="text-xs text-purple-300 mt-0.5">A Love Story</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          ) : (
            <PhotoPlaceholder count={page.photoCount} layout={page.layout} />
          )}

          {/* Caption */}
          {!page.isCover && (
            <textarea
              value={page.caption}
              onChange={(e) => onUpdate(page.id, { caption: e.target.value })}
              rows={2}
              placeholder="Add a caption for this chapter…"
              className="w-full glass-light rounded-xl px-3 py-2 text-sm text-purple-100 placeholder-purple-500 outline-none resize-none border border-purple-800/30 focus:border-purple-500/60"
            />
          )}

          {/* Love note toggle */}
          {!page.isCover && (
            <div>
              <button
                onClick={() => onUpdate(page.id, { showLoveNote: !page.showLoveNote })}
                className={clsx(
                  'flex items-center gap-1.5 text-xs transition-colors',
                  page.showLoveNote ? 'text-pink-400' : 'text-purple-400 hover:text-purple-200'
                )}
              >
                <Heart size={12} className={page.showLoveNote ? 'fill-pink-400' : ''} />
                {page.showLoveNote ? 'Hide love note' : 'Add love note'}
              </button>
              <AnimatePresence initial={false}>
                {page.showLoveNote && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <textarea
                        value={page.loveNote}
                        onChange={(e) => onUpdate(page.id, { loveNote: e.target.value })}
                        rows={2}
                        placeholder="Write a private love note for this page…"
                        className="w-full rounded-xl px-3 py-2 text-sm text-pink-100 placeholder-pink-600/50 outline-none resize-none border border-pink-800/40 focus:border-pink-600/60 bg-pink-950/30"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Add photos button */}
          <div className="flex items-center gap-2 pt-1">
            <Button variant="ghost" size="sm" icon={Image}>
              Add Photos
            </Button>
            <button
              onClick={() => onUpdate(page.id, { photoCount: page.photoCount + 1 })}
              className="p-1.5 text-purple-500 hover:text-purple-300 hover:bg-purple-800/30 rounded-lg transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Album Preview Flip View ──────────────────────────────────────────────────

function AlbumPreview({ pages, selectedCoverStyle }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const page = pages[currentPage];

  const goTo = (next) => {
    setDirection(next > currentPage ? 1 : -1);
    setCurrentPage(next);
  };

  const coverStyle = COVER_STYLES.find((c) => c.id === selectedCoverStyle) || COVER_STYLES[0];

  return (
    <div className="space-y-4">
      {/* Preview book */}
      <div className="relative aspect-[4/3] max-w-sm mx-auto">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, rotateY: direction * 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: direction * -40, rotateY: direction * -15 }}
            transition={{ duration: 0.35, type: 'spring', stiffness: 280, damping: 24 }}
            style={{ perspective: 800 }}
            className={clsx(
              'absolute inset-0 rounded-2xl overflow-hidden border border-purple-700/30 shadow-2xl',
              page.isCover
                ? `bg-gradient-to-br ${coverStyle.swatch}`
                : 'bg-[#1a0a2e]'
            )}
          >
            {page.isCover ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center animate-heartbeat">
                  <Heart size={24} className="text-pink-300 fill-pink-300" />
                </div>
                <p className={clsx('font-display text-3xl font-bold', coverStyle.textColor)}>Our 5 Years</p>
                <p className={clsx('text-sm opacity-70', coverStyle.textColor)}>A Love Story</p>
              </div>
            ) : page.isSurprise ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
                <Lock size={28} className="text-pink-400" />
                <p className="font-display text-xl text-purple-200">A Final Surprise</p>
                <p className="text-xs text-purple-400 text-center">This page reveals itself when shared 💕</p>
              </div>
            ) : (
              <div className="p-5 h-full flex flex-col gap-3">
                <p className="font-display text-sm gradient-text font-semibold">{page.title}</p>
                <div className="flex-1 grid grid-cols-2 gap-1.5">
                  {[...Array(Math.min(page.photoCount, 4))].map((_, i) => (
                    <div key={i} className="skeleton rounded-lg" />
                  ))}
                </div>
                {page.caption && (
                  <p className="text-[11px] text-purple-300 leading-relaxed line-clamp-2">{page.caption}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => goTo(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="p-2 rounded-full glass border border-purple-700/30 text-purple-300 hover:text-purple-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-purple-300 min-w-[80px] text-center">
          Page {currentPage + 1} of {pages.length}
        </span>
        <button
          onClick={() => goTo(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage === pages.length - 1}
          className="p-2 rounded-full glass border border-purple-700/30 text-purple-300 hover:text-purple-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={clsx(
              'rounded-full transition-all duration-200',
              i === currentPage
                ? 'w-4 h-2 bg-pink-400'
                : 'w-2 h-2 bg-purple-700 hover:bg-purple-500'
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AlbumBuilder() {
  const { albumProject, setAlbumProject } = useStore();

  const [selectedCoverStyle, setSelectedCoverStyle] = useState('dark-cinematic');
  const [coverTitle, setCoverTitle] = useState('Our 5 Years');
  const [coverSubtitle, setCoverSubtitle] = useState('A Love Story');
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [previewOpen, setPreviewOpen] = useState(false);

  const updatePage = (id, partial) =>
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));

  const addPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      number: pages.length + 1,
      isCover: false,
      title: `Chapter ${pages.length}`,
      photoCount: 4,
      layout: 'grid',
      caption: '',
      loveNote: '',
      showLoveNote: false,
      isLocked: false,
      isSurprise: false,
    };
    setPages((prev) => [...prev, newPage]);
  };

  const selectedCoverStyleObj = COVER_STYLES.find((c) => c.id === selectedCoverStyle) || COVER_STYLES[0];

  return (
    <div className="min-h-dvh bg-[#0d0618] pb-8">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 glass border-b border-purple-900/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center glow-violet flex-shrink-0">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl gradient-text leading-tight">Album Builder</h1>
              <p className="text-[11px] text-purple-400">{pages.length} pages · {selectedCoverStyleObj.label}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs border border-purple-700/50 text-purple-300 bg-purple-900/30">
            {selectedCoverStyleObj.label}
          </span>
          <Button
            variant="secondary"
            icon={BookOpen}
            size="md"
            onClick={() => setPreviewOpen((v) => !v)}
          >
            {previewOpen ? 'Hide Preview' : 'Preview Album'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Section 1: Album Settings ── */}
        <Card>
          <h2 className="font-display text-lg text-purple-100 mb-4">Album Settings</h2>

          {/* Cover Style */}
          <div className="mb-5">
            <label className="text-xs text-purple-400 uppercase tracking-wider mb-2.5 block">Cover Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {COVER_STYLES.map((style) => (
                <motion.button
                  key={style.id}
                  onClick={() => {
                    setSelectedCoverStyle(style.id);
                    setAlbumProject({ coverStyle: style.label });
                  }}
                  whileTap={{ scale: 0.96 }}
                  className={clsx(
                    'p-3 rounded-xl border transition-all duration-200 text-left',
                    selectedCoverStyle === style.id
                      ? 'border-purple-500 glow-violet bg-purple-600/10'
                      : 'border-purple-800/40 hover:border-purple-600/60'
                  )}
                >
                  {/* Swatch */}
                  <div className={clsx('w-full aspect-[3/2] rounded-lg bg-gradient-to-br mb-2', style.swatch)} />
                  <p className="text-xs font-medium text-purple-100">{style.label}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Cover Text Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs text-purple-400 uppercase tracking-wider mb-1.5 block">Cover Title</label>
              <input
                value={coverTitle}
                onChange={(e) => setCoverTitle(e.target.value)}
                placeholder="Our 5 Years"
                className="w-full glass-light rounded-xl px-4 py-2.5 text-sm text-purple-100 placeholder-purple-500 outline-none border border-purple-800/30 focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-xs text-purple-400 uppercase tracking-wider mb-1.5 block">Cover Subtitle</label>
              <input
                value={coverSubtitle}
                onChange={(e) => setCoverSubtitle(e.target.value)}
                placeholder="A Love Story"
                className="w-full glass-light rounded-xl px-4 py-2.5 text-sm text-purple-100 placeholder-purple-500 outline-none border border-purple-800/30 focus:border-purple-500/60"
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div>
            <label className="text-xs text-purple-400 uppercase tracking-wider mb-1.5 block">Cover Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-16 skeleton rounded-xl border border-purple-800/30 flex items-center justify-center">
                <Image size={18} className="text-purple-600" />
              </div>
              <Button variant="ghost" size="sm" icon={Image}>
                Choose Cover Photo
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Section 2: Album Pages ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-lg text-purple-100">Album Pages</h2>
              <p className="text-xs text-purple-400">{pages.length} pages configured</p>
            </div>
            <Button icon={Plus} variant="secondary" size="sm" onClick={addPage}>
              Add Page
            </Button>
          </div>

          <div className="space-y-3">
            {pages.map((page) => (
              <AlbumPageCard key={page.id} page={page} onUpdate={updatePage} />
            ))}
          </div>
        </div>

        {/* ── Section 3: Album Preview ── */}
        <AnimatePresence>
          {previewOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card glow>
                <h2 className="font-display text-lg text-purple-100 mb-4 text-center">Album Preview</h2>
                <AlbumPreview pages={pages} selectedCoverStyle={selectedCoverStyle} />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Section 4: Export ── */}
        <Card>
          <h2 className="font-display text-lg text-purple-100 mb-4">Export & Share</h2>
          {/* VIDEO GENERATION / EXPORT: connect rendering service here */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 glass-light rounded-xl border border-purple-800/30 hover:border-purple-600/50 hover:bg-purple-900/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-800/40 flex items-center justify-center group-hover:bg-purple-700/40 transition-colors">
                <FileText size={18} className="text-purple-300" />
              </div>
              <span className="text-sm font-medium text-purple-200">Export as PDF</span>
              <span className="text-[11px] text-purple-500">High-res print quality</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 glass-light rounded-xl border border-purple-800/30 hover:border-purple-600/50 hover:bg-purple-900/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-800/40 flex items-center justify-center group-hover:bg-purple-700/40 transition-colors">
                <Link2 size={18} className="text-purple-300" />
              </div>
              <span className="text-sm font-medium text-purple-200">Generate Share Link</span>
              <span className="text-[11px] text-purple-500">Private, expires in 7 days</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 glass-light rounded-xl border border-purple-800/30 hover:border-purple-600/50 hover:bg-purple-900/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-800/40 flex items-center justify-center group-hover:bg-purple-700/40 transition-colors">
                <Download size={18} className="text-purple-300" />
              </div>
              <span className="text-sm font-medium text-purple-200">Download Album</span>
              <span className="text-[11px] text-purple-500">ZIP with all pages</span>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-purple-950/50 border border-purple-800/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
            <p className="text-xs text-purple-400">Your album is private. Nothing is exported without your action.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
