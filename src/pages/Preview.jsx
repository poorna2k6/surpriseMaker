import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Edit3,
  Film,
  BookOpen,
  Layers,
  Play,
  ChevronLeft,
  ChevronRight,
  Image,
  Clock,
  FileText,
  Heart,
  Zap,
  ArrowRight,
  RotateCcw,
  Type,
  MessageSquare,
} from 'lucide-react';
import clsx from 'clsx';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'video',    label: 'Video Preview',  icon: Film },
  { id: 'album',    label: 'Album Preview',  icon: BookOpen },
  { id: 'combined', label: 'Combined View',  icon: Layers },
];

const MOCK_SCENES = [
  { id: 1, title: 'Opening Title',         type: 'title',   duration: 5,  gradient: 'from-purple-900 via-pink-900 to-purple-800' },
  { id: 2, title: 'The Beginning',         type: 'photos',  duration: 15, gradient: 'from-violet-900 via-purple-800 to-indigo-900' },
  { id: 3, title: 'First Year',            type: 'photos',  duration: 20, gradient: 'from-indigo-900 via-purple-900 to-blue-900' },
  { id: 4, title: 'Anniversary Milestones', type: 'photos', duration: 15, gradient: 'from-rose-900 via-purple-900 to-violet-900' },
  { id: 5, title: 'Our Adventures',        type: 'photos',  duration: 20, gradient: 'from-purple-900 via-indigo-900 to-violet-900' },
  { id: 6, title: 'Love Letter',           type: 'message', duration: 8,  gradient: 'from-pink-900 via-rose-900 to-purple-900' },
  { id: 7, title: 'Closing',               type: 'photos',  duration: 10, gradient: 'from-violet-900 via-purple-900 to-pink-900' },
];

const MOCK_ALBUM_PAGES = [
  { id: 1, title: 'Cover',                  isCover: true,    photoCount: 1 },
  { id: 2, title: 'The Beginning',          isCover: false,   photoCount: 4 },
  { id: 3, title: 'Our First Year',         isCover: false,   photoCount: 6 },
  { id: 4, title: 'Adventures Together',    isCover: false,   photoCount: 5 },
  { id: 5, title: 'Anniversary Moments',    isCover: false,   photoCount: 8 },
  { id: 6, title: 'A Final Surprise',       isCover: false,   isSurprise: true, photoCount: 1 },
];

const QUICK_STATS = [
  { label: 'Photos',   value: 48,  icon: Image },
  { label: 'Scenes',   value: 7,   icon: Film },
  { label: 'Pages',    value: 6,   icon: BookOpen },
  { label: 'Messages', value: 3,   icon: MessageSquare },
];

const RECENT_CHANGES = [
  { icon: Film,        text: 'Added "Love Letter" scene',      time: '2 min ago' },
  { icon: Type,        text: 'Updated Opening Title caption',  time: '5 min ago' },
  { icon: BookOpen,    text: 'Added 3 photos to First Year',   time: '12 min ago' },
  { icon: MessageSquare, text: 'Generated AI narration script', time: '18 min ago' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SceneTypeIcon({ type }) {
  const map = {
    title:   Type,
    photos:  Image,
    message: MessageSquare,
  };
  const Icon = map[type] || Image;
  return <Icon size={11} className="text-purple-400" />;
}

// Video Preview Tab
function VideoPreviewTab() {
  const [activeScene, setActiveScene] = useState(null);
  const totalDuration = MOCK_SCENES.reduce((s, sc) => s + sc.duration, 0);
  const minutes = Math.floor(totalDuration / 60);
  const seconds = totalDuration % 60;

  return (
    <div className="space-y-4">
      {/* Main video area + scene sidebar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Video player placeholder */}
        <div className="flex-1">
          <Card padding="none" className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#0d0618] relative flex flex-col items-center justify-center">
              {/* Active scene preview */}
              {activeScene ? (
                <div className={clsx('absolute inset-0 bg-gradient-to-br opacity-60 transition-all duration-500', activeScene.gradient)} />
              ) : null}

              {/* Play button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer glow-rose"
              >
                <Play size={24} className="text-white ml-1 fill-white" />
              </motion.div>

              {/* Overlay text */}
              <p className="relative z-10 mt-4 text-sm text-purple-300 text-center px-4">
                {activeScene
                  ? `Scene: ${activeScene.title}`
                  : 'Full video will render after generation'}
              </p>

              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 glass rounded-full text-xs text-purple-200">
                <Clock size={11} />
                ~{minutes}:{seconds.toString().padStart(2, '0')} total
              </div>

              {/* Style / music labels */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="px-2 py-0.5 glass rounded-full text-[10px] text-purple-300 border border-purple-700/30">
                  Classic Romance
                </span>
                <span className="px-2 py-0.5 glass rounded-full text-[10px] text-purple-300 border border-purple-700/30">
                  Soft Piano
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Scene list sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Scenes</p>
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
            {MOCK_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene.id === activeScene?.id ? null : scene)}
                className={clsx(
                  'w-full flex items-center gap-2 p-2 rounded-xl border transition-all duration-150 text-left',
                  activeScene?.id === scene.id
                    ? 'border-purple-500/60 bg-purple-600/20 text-purple-100'
                    : 'border-purple-800/30 hover:border-purple-700/50 hover:bg-purple-900/20 text-purple-300'
                )}
              >
                {/* Scene thumbnail */}
                <div className={clsx('w-10 h-7 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center', scene.gradient)}>
                  <SceneTypeIcon type={scene.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{scene.title}</p>
                  <p className="text-[10px] text-purple-500">{scene.duration}s</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Album Preview Tab
function AlbumPreviewTab() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (next) => {
    setDirection(next > currentPage ? 1 : -1);
    setCurrentPage(Math.max(0, Math.min(MOCK_ALBUM_PAGES.length - 1, next)));
  };

  const page = MOCK_ALBUM_PAGES[currentPage];

  return (
    <div className="space-y-4">
      {/* Album flip view */}
      <div className="max-w-md mx-auto">
        <div className="relative aspect-[4/3]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60, rotateY: direction * 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 22 }}
              style={{ perspective: 900 }}
              className="absolute inset-0 glass rounded-2xl overflow-hidden border border-purple-700/30 shadow-2xl"
            >
              {page.isCover ? (
                <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-violet-900 gap-3">
                  <Heart size={28} className="text-pink-300 fill-pink-300 animate-heartbeat" />
                  <p className="font-display text-2xl gradient-text">Our 5 Years</p>
                  <p className="text-xs text-purple-300">A Love Story</p>
                </div>
              ) : page.isSurprise ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 p-8">
                  <div className="text-3xl">🔐</div>
                  <p className="font-display text-lg text-purple-200">{page.title}</p>
                  <p className="text-xs text-purple-400 text-center">Unlocks when you share ✨</p>
                </div>
              ) : (
                <div className="h-full p-5 flex flex-col gap-3">
                  <p className="font-display text-sm gradient-text font-semibold">{page.title}</p>
                  <div className="flex-1 grid grid-cols-2 gap-1.5">
                    {[...Array(Math.min(page.photoCount, 4))].map((_, i) => (
                      <div key={i} className="skeleton rounded-lg" />
                    ))}
                  </div>
                  <div className="text-[11px] text-purple-400">{page.photoCount} photos</div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-2 rounded-full glass border border-purple-700/30 text-purple-300 hover:text-purple-100 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-purple-300">
            Page {currentPage + 1} of {MOCK_ALBUM_PAGES.length}
          </span>
          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === MOCK_ALBUM_PAGES.length - 1}
            className="p-2 rounded-full glass border border-purple-700/30 text-purple-300 hover:text-purple-100 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-2">
          {MOCK_ALBUM_PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={clsx(
                'rounded-full transition-all duration-200',
                i === currentPage ? 'w-4 h-2 bg-pink-400' : 'w-2 h-2 bg-purple-700 hover:bg-purple-500'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Combined View Tab
function CombinedViewTab() {
  const totalDuration = MOCK_SCENES.reduce((s, sc) => s + sc.duration, 0);
  const totalPhotos = MOCK_ALBUM_PAGES.reduce((s, p) => s + (p.photoCount || 0), 0);

  return (
    <div className="space-y-4">
      {/* Side by side previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mini video */}
        <Card padding="sm" hover>
          <p className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
            <Film size={13} className="text-pink-400" /> Video
          </p>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#0d0618] flex items-center justify-center relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
              <Play size={16} className="text-white fill-white ml-0.5" />
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-purple-400 glass px-1.5 py-0.5 rounded-full">
              {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <p className="text-[11px] text-purple-400 mt-2">Classic Romance · Soft Piano</p>
        </Card>

        {/* Mini album */}
        <Card padding="sm" hover>
          <p className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
            <BookOpen size={13} className="text-violet-400" /> Album
          </p>
          <div className="aspect-video rounded-xl glass-light flex items-center justify-center overflow-hidden relative border border-purple-800/30">
            <div className="text-center">
              <p className="font-display text-base gradient-text">Our 5 Years</p>
              <p className="text-[11px] text-purple-400 mt-0.5">A Love Story</p>
            </div>
          </div>
          <p className="text-[11px] text-purple-400 mt-2">Dark Cinematic · {MOCK_ALBUM_PAGES.length} pages</p>
        </Card>
      </div>

      {/* Combined stats */}
      <Card>
        <p className="text-xs text-purple-400 uppercase tracking-wider mb-3">Combined Summary</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Photos used', value: totalPhotos, icon: Image },
            { label: 'Duration', value: `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`, icon: Clock },
            { label: 'Album pages', value: MOCK_ALBUM_PAGES.length, icon: BookOpen },
            { label: 'Chapters', value: MOCK_ALBUM_PAGES.length - 1, icon: Layers },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center p-3 glass-light rounded-xl border border-purple-800/20">
              <Icon size={16} className="text-purple-400 mx-auto mb-1" />
              <p className="text-lg font-bold gradient-text">{value}</p>
              <p className="text-[11px] text-purple-400">{label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Preview() {
  const navigate = useNavigate();
  const { videoProject, albumProject } = useStore();
  const [activeTab, setActiveTab] = useState('video');

  return (
    <div className="min-h-dvh bg-[#0d0618] pb-24">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 glass border-b border-purple-900/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600 to-violet-700 flex items-center justify-center glow-rose flex-shrink-0">
              <Eye size={18} className="text-white" />
            </div>
            <h1 className="font-display text-xl gradient-text">Preview Your Surprise</h1>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => navigate('/video')}>
            Edit
          </Button>
          <Button size="sm" icon={Zap} onClick={() => navigate('/output')}>
            Generate
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Tab Switcher ── */}
        <div className="flex gap-1 p-1 glass rounded-2xl border border-purple-800/30">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white shadow-lg'
                    : 'text-purple-300 hover:text-purple-100 hover:bg-purple-900/30'
                )}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {activeTab === 'video' && <VideoPreviewTab />}
            {activeTab === 'album' && <AlbumPreviewTab />}
            {activeTab === 'combined' && <CombinedViewTab />}
          </motion.div>
        </AnimatePresence>

        {/* ── Edit Summary ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_STATS.map(({ label, value, icon: Icon }) => (
            <Card key={label} padding="sm" className="text-center">
              <Icon size={16} className="text-purple-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold gradient-text">{value}</p>
              <p className="text-xs text-purple-400">{label}</p>
            </Card>
          ))}
        </div>

        {/* Recent changes */}
        <Card>
          <h3 className="text-sm font-semibold text-purple-200 mb-3">Recent Changes</h3>
          <div className="space-y-2">
            {RECENT_CHANGES.map(({ icon: Icon, text, time }, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-purple-900/60 flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className="text-purple-400" />
                </div>
                <p className="text-sm text-purple-200 flex-1">{text}</p>
                <span className="text-[11px] text-purple-500 flex-shrink-0">{time}</span>
              </div>
            ))}
          </div>

          {/* Go back section links */}
          <div className="mt-4 pt-4 border-t border-purple-800/20 flex flex-wrap gap-2">
            {[
              { label: 'Edit Video', path: '/video' },
              { label: 'Edit Album', path: '/album' },
              { label: 'Edit Messages', path: '/messages' },
              { label: 'Edit Timeline', path: '/timeline' },
            ].map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="px-3 py-1.5 text-xs text-purple-300 border border-purple-800/40 rounded-lg hover:border-purple-600/60 hover:text-purple-100 hover:bg-purple-900/20 transition-all"
              >
                {label} →
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Fixed Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:left-60 glass border-t border-purple-900/40 safe-bottom">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            icon={RotateCcw}
            size="md"
            className="flex-shrink-0"
          >
            Try Another Style
          </Button>
          <Button
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            fullWidth
            onClick={() => navigate('/output')}
            className="text-base"
          >
            Generate Surprise
          </Button>
        </div>
      </div>
    </div>
  );
}
