import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  CloudUpload,
  Images,
  PlusCircle,
  Tag,
  Sparkles,
  ChevronRight,
  Check,
  Image,
} from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ALBUMS = [
  { id: 'a1', title: 'Our Wedding',           count: 248, source: 'My Photos',    gradient: 'from-pink-700 to-rose-900'     },
  { id: 'a2', title: 'Honeymoon Bali 2019',   count: 156, source: 'My Photos',    gradient: 'from-violet-700 to-purple-900' },
  { id: 'a3', title: 'Family Christmas 2021', count: 89,  source: 'Shared Album', gradient: 'from-sky-700 to-indigo-900'   },
  { id: 'a4', title: 'Anniversary Trip 2022', count: 67,  source: 'My Photos',    gradient: 'from-amber-700 to-orange-900' },
  { id: 'a5', title: 'Random Moments',        count: 423, source: 'My Photos',    gradient: 'from-teal-700 to-cyan-900'    },
  { id: 'a6', title: 'Couple Selfies',        count: 112, source: 'My Photos',    gradient: 'from-fuchsia-700 to-pink-900' },
];

const ALL_TAGS = ['spouse', 'me', 'couple', 'family', 'anniversary', 'trip', 'favorite'];

const PHOTO_GRADIENTS = [
  'from-pink-800 to-rose-900',
  'from-violet-800 to-purple-900',
  'from-sky-800 to-indigo-900',
  'from-amber-800 to-orange-900',
  'from-teal-800 to-cyan-900',
  'from-fuchsia-800 to-pink-900',
  'from-emerald-800 to-teal-900',
  'from-red-800 to-rose-900',
  'from-indigo-800 to-violet-900',
  'from-yellow-800 to-amber-900',
  'from-cyan-800 to-sky-900',
  'from-lime-800 to-green-900',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SourceChip({ label }) {
  const cls =
    label === 'My Photos'
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      : label === 'Shared Album'
      ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
      : 'bg-sky-500/20 text-sky-300 border-sky-500/30';
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cls}`}>
      {label}
    </span>
  );
}

function TagChip({ tag, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-pink-500/30 text-pink-200 border-pink-400/50'
          : 'bg-white/5 text-purple-400 border-purple-700/40 hover:bg-white/10 hover:text-purple-300'
      }`}
    >
      {tag}
    </button>
  );
}

function DropZone({ fileCount, onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer?.files ?? []).filter(
        (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
      );
      if (files.length) onFilesSelected(files.length);
    },
    [onFilesSelected]
  );

  const handleInput = useCallback(
    (e) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length) onFilesSelected(files.length);
    },
    [onFilesSelected]
  );

  return (
    <label
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-pink-400/70 bg-pink-500/10'
          : 'border-purple-600/40 hover:border-purple-500/60 hover:bg-purple-500/5'
      }`}
    >
      <input type="file" accept="image/*,video/*" multiple className="sr-only" onChange={handleInput} />
      <motion.div
        animate={isDragging ? { scale: 1.15 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <CloudUpload size={40} className={isDragging ? 'text-pink-400' : 'text-purple-500'} />
      </motion.div>
      <div className="text-center">
        <p className="text-purple-200 font-medium text-sm">
          {fileCount > 0
            ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected`
            : 'Drop photos or videos here'}
        </p>
        <p className="text-purple-500 text-xs mt-1">or click to select files</p>
      </div>
      {fileCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full px-3 py-1 text-xs font-medium"
        >
          <Check size={12} />
          {fileCount} file{fileCount > 1 ? 's' : ''} ready to import
        </motion.div>
      )}
    </label>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConnectPhotos() {
  const navigate = useNavigate();
  const { addConnectedAccount, setSelectedAlbums, addMediaItems } = useStore();

  const [isConnected, setIsConnected]         = useState(false);
  const [isConnecting, setIsConnecting]       = useState(false);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState(new Set());
  const [isImported, setIsImported]           = useState(false);
  const [isImporting, setIsImporting]         = useState(false);
  const [uploadedCount, setUploadedCount]     = useState(0);
  const [photoTags, setPhotoTags]             = useState({});
  const [isAutoTagging, setIsAutoTagging]     = useState(false);

  // ── Connect (demo) ──────────────────────────────────────────────────────────
  const handleConnect = async () => {
    setIsConnecting(true);
    // GOOGLE OAUTH: sign in and consent flow here
    await new Promise((r) => setTimeout(r, 1400));
    addConnectedAccount({
      id: 'demo',
      email: 'demo@gmail.com',
      name: 'Demo User',
      avatarUrl: null,
      connected: true,
    });
    setIsConnected(true);
    setIsConnecting(false);
  };

  // ── Album toggle ────────────────────────────────────────────────────────────
  const toggleAlbum = (id) => {
    setSelectedAlbumIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Import ──────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (selectedAlbumIds.size === 0) return;
    setIsImporting(true);
    // GOOGLE PHOTOS ALBUM FETCH: load albums here
    const selected = MOCK_ALBUMS.filter((a) => selectedAlbumIds.has(a.id));
    setSelectedAlbums(selected);
    await new Promise((r) => setTimeout(r, 1800));
    const mockItems = Array.from({ length: 12 }, (_, i) => ({
      id: `photo-${i}`,
      albumId: selected[0]?.id ?? 'a1',
      type: 'image',
      url: null,
      thumbnailUrl: null,
      date: new Date(2019 + Math.floor(i / 2), i % 12, (i % 28) + 1),
    }));
    addMediaItems(mockItems);
    setIsImporting(false);
    setIsImported(true);
  };

  // ── Tag toggle ──────────────────────────────────────────────────────────────
  const toggleTag = (photoId, tag) => {
    setPhotoTags((prev) => {
      const current = new Set(prev[photoId] ?? []);
      current.has(tag) ? current.delete(tag) : current.add(tag);
      return { ...prev, [photoId]: current };
    });
  };

  // ── Auto-tag (demo) ─────────────────────────────────────────────────────────
  const handleAutoTag = async () => {
    setIsAutoTagging(true);
    // FACE GROUP ASSIST: integrate people grouping if available here
    await new Promise((r) => setTimeout(r, 2000));
    const suggested = {};
    for (let i = 0; i < 12; i++) {
      suggested[`photo-${i}`] = new Set(ALL_TAGS.slice(0, 2 + (i % 3)));
    }
    setPhotoTags(suggested);
    setIsAutoTagging(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0618] px-4 pb-28 pt-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className="font-display text-4xl font-semibold gradient-text">Connect Your Photos</h1>
          <p className="text-purple-300 text-sm">
            Select albums from Google Photos to import memories
          </p>
          <p className="text-purple-500 text-xs flex items-center justify-center gap-1.5">
            <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
            Only albums you select will be accessed. Your photos never leave your browser session.
          </p>
        </motion.div>

        {/* ── Section 1: Connect Account ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="lg">
            <AnimatePresence mode="wait">
              {isConnected ? (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-purple-100 font-medium text-sm">Connected as demo@gmail.com</p>
                      <p className="text-purple-400 text-xs">Google Photos access granted</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={PlusCircle} onClick={() => {}}>
                    Add Another Account
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="disconnected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-5 py-2"
                >
                  {/* Google logo */}
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-purple-100 font-medium">Sign in to Google Photos</p>
                    <p className="text-purple-400 text-xs">Browse your albums and shared photos</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    loading={isConnecting}
                    onClick={handleConnect}
                  >
                    {isConnecting ? 'Connecting…' : 'Connect Google Photos'}
                  </Button>
                  <p className="text-purple-600 text-[11px] italic">Demo mode — no real OAuth required</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* ── Section 2: Manual Upload ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Or upload photos directly
          </h2>
          <DropZone fileCount={uploadedCount} onFilesSelected={setUploadedCount} />
        </motion.div>

        {/* ── Section 3: Album Selection ───────────────────────────────────────── */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              key="albums"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-purple-200 font-semibold flex items-center gap-2">
                  <Images size={18} className="text-purple-400" />
                  Your Albums
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                    {MOCK_ALBUMS.length}
                  </span>
                </h2>
                {selectedAlbumIds.size > 0 && (
                  <span className="text-xs text-pink-300 font-medium">
                    {selectedAlbumIds.size} selected
                  </span>
                )}
              </div>

              {/* Album grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {MOCK_ALBUMS.map((album, idx) => {
                  const isSelected = selectedAlbumIds.has(album.id);
                  return (
                    <motion.button
                      key={album.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.06 }}
                      onClick={() => toggleAlbum(album.id)}
                      className={`relative rounded-2xl overflow-hidden text-left cursor-pointer transition-all duration-200 border-2 ${
                        isSelected
                          ? 'border-pink-400 glow-rose'
                          : 'border-transparent hover:border-purple-500/50'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className={`h-28 bg-gradient-to-br ${album.gradient} relative`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <Image size={28} className="absolute bottom-2 right-2 text-white/25" />
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-pink-500/25 flex items-center justify-center"
                            >
                              <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                                <Check size={14} className="text-white" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Info */}
                      <div className="glass p-2.5 space-y-1.5">
                        <p className="text-purple-100 text-xs font-semibold leading-tight line-clamp-1">
                          {album.title}
                        </p>
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-purple-400 text-[10px]">{album.count} photos</span>
                          <SourceChip label={album.source} />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Import CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-purple-400 text-sm">
                  {selectedAlbumIds.size === 0
                    ? 'Tap albums to select them'
                    : `Selected: ${selectedAlbumIds.size} album${selectedAlbumIds.size > 1 ? 's' : ''}`}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  icon={ChevronRight}
                  iconPosition="right"
                  disabled={selectedAlbumIds.size === 0}
                  loading={isImporting}
                  onClick={handleImport}
                >
                  {isImporting ? 'Importing…' : 'Import Selected Albums'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Section 4: Photo Tagging ─────────────────────────────────────────── */}
        <AnimatePresence>
          {isImported && (
            <motion.div
              key="tagging"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold gradient-text">Tag Your Photos</h2>
                  <p className="text-purple-400 text-xs mt-0.5">Help us find the best moments</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Sparkles}
                  loading={isAutoTagging}
                  onClick={handleAutoTag}
                >
                  {isAutoTagging ? 'Analysing…' : 'Auto-suggest Tags'}
                </Button>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => {
                  const grad = PHOTO_GRADIENTS[i % PHOTO_GRADIENTS.length];
                  const tags = photoTags[`photo-${i}`] ?? new Set();
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass rounded-xl overflow-hidden"
                    >
                      <div className={`h-24 bg-gradient-to-br ${grad}`} />
                      <div className="p-2 flex flex-wrap gap-1">
                        {ALL_TAGS.map((tag) => (
                          <TagChip
                            key={tag}
                            tag={tag}
                            active={tags.has(tag)}
                            onClick={() => toggleTag(`photo-${i}`, tag)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* FACE GROUP ASSIST: integrate people grouping if available here */}
              <p className="text-purple-600 text-[11px] text-center italic">
                Face grouping integration point — placeholder for people-based clustering
              </p>

              <div className="flex justify-center pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={() => navigate('/memories')}
                >
                  Continue to Memories
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
