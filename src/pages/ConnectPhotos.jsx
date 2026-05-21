import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, CloudUpload, Images, ChevronRight,
  Check, LogOut, RefreshCw, AlertCircle, User, FolderOpen,
} from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Google OAuth config ──────────────────────────────────────────────────────
// GOOGLE OAUTH: sign in and consent flow here
const GOOGLE_CLIENT_ID = '836889327596-cda7k0kcq1jdvp57h92hjlsdme674vu9.apps.googleusercontent.com';
const PHOTOS_SCOPE = 'https://www.googleapis.com/auth/photoslibrary.readonly';

// ─── Google Photos API helpers ────────────────────────────────────────────────
// GOOGLE PHOTOS ALBUM FETCH: load albums here
async function apiFetchAlbums(token) {
  const res = await fetch(
    'https://photoslibrary.googleapis.com/v1/albums?pageSize=50',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(
      new Error(err?.error?.message || `HTTP ${res.status}`),
      { status: res.status }
    );
  }
  const data = await res.json();
  return data.albums || [];
}

// SHARED ALBUM IMPORT: integrate shared source picker here
async function apiFetchSharedAlbums(token) {
  const res = await fetch(
    'https://photoslibrary.googleapis.com/v1/sharedAlbums?pageSize=50',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.sharedAlbums || [];
}

// GOOGLE PHOTOS PICKER API: launch picker here
async function apiFetchAlbumMedia(token, albumId, pageSize = 100) {
  const res = await fetch(
    'https://photoslibrary.googleapis.com/v1/mediaItems:search',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ albumId, pageSize }),
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.mediaItems || [];
}

async function apiGetUserInfo(token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// ─── useGoogleAuth hook ───────────────────────────────────────────────────────
function useGoogleAuth() {
  const [gisReady, setGisReady] = useState(!!window.google?.accounts?.oauth2);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.google?.accounts?.oauth2) { setGisReady(true); return; }
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => setGisReady(true));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => setGisReady(true);
    s.onerror = () => setError('Could not load Google Sign-In. Check your connection and try refreshing.');
    document.head.appendChild(s);
  }, []);

  const signIn = useCallback(() => {
    if (!window.google?.accounts?.oauth2) {
      setError('Google Sign-In not ready yet. Please wait a moment and try again.');
      return;
    }
    setLoading(true);
    setError(null);

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: `${PHOTOS_SCOPE} openid email profile`,
      callback: async (response) => {
        if (response.error) {
          setError(
            response.error === 'access_denied'
              ? 'Access denied. Make sure your Google account is added as a Test User in Google Cloud Console → OAuth consent screen → Test users.'
              : `Sign-in failed: ${response.error}`
          );
          setLoading(false);
          return;
        }
        setAccessToken(response.access_token);
        const info = await apiGetUserInfo(response.access_token).catch(() => null);
        setUserInfo(info);
        setLoading(false);
      },
      error_callback: (err) => {
        if (err.type !== 'popup_closed') {
          setError(`Sign-in error: ${err.type}`);
        }
        setLoading(false);
      },
    });

    client.requestToken();
  }, [gisReady]);

  const signOut = useCallback(() => {
    if (accessToken) window.google?.accounts?.oauth2?.revoke(accessToken, () => {});
    setAccessToken(null);
    setUserInfo(null);
  }, [accessToken]);

  return { gisReady, accessToken, userInfo, loading, error, signIn, signOut };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PHOTO_GRADIENTS = [
  'from-pink-800 to-rose-900', 'from-violet-800 to-purple-900',
  'from-sky-800 to-indigo-900', 'from-amber-800 to-orange-900',
  'from-teal-800 to-cyan-900', 'from-fuchsia-800 to-pink-900',
  'from-emerald-800 to-teal-900', 'from-indigo-800 to-violet-900',
];

// ─── AlbumCard ────────────────────────────────────────────────────────────────
function AlbumCard({ album, selected, onToggle }) {
  const gradient = PHOTO_GRADIENTS[
    Math.abs((album.id.charCodeAt(0) || 0) + (album.id.charCodeAt(2) || 0)) % PHOTO_GRADIENTS.length
  ];
  const coverUrl = album.coverPhotoBaseUrl
    ? `${album.coverPhotoBaseUrl}=w300-h200-c`
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      className="cursor-pointer rounded-2xl overflow-hidden border-2 transition-colors duration-200"
      style={{ borderColor: selected ? 'rgba(244,114,182,0.7)' : 'rgba(168,85,247,0.12)' }}
    >
      {/* Thumbnail */}
      <div className={`h-28 bg-gradient-to-br ${gradient} relative`}>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={album.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center shadow-lg"
            >
              <Check size={14} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-3 bg-[#1a0a2e]">
        <p className="text-purple-100 text-sm font-medium truncate mb-1">{album.title}</p>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
            album._source === 'Shared Album'
              ? 'bg-pink-900/60 text-pink-300 border-pink-700/40'
              : 'bg-violet-900/60 text-violet-300 border-violet-700/40'
          }`}>
            {album._source || 'My Photos'}
          </span>
          <span className="text-purple-500 text-[11px]">
            {album.mediaItemsCount ?? '?'} items
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ConnectPhotos() {
  const navigate = useNavigate();
  const addConnectedAccount = useStore(s => s.addConnectedAccount);
  const setSelectedAlbums = useStore(s => s.setSelectedAlbums);
  const addMediaItems = useStore(s => s.addMediaItems);

  const { gisReady, accessToken, userInfo, loading: authLoading, error: authError, signIn, signOut } = useGoogleAuth();

  const [albums, setAlbums] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [albumsError, setAlbumsError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Load albums once authenticated
  useEffect(() => {
    if (!accessToken) return;
    setAlbumsLoading(true);
    setAlbumsError(null);

    Promise.all([
      apiFetchAlbums(accessToken).catch(err => { throw err; }),
      apiFetchSharedAlbums(accessToken).catch(() => []),
    ])
      .then(([mine, shared]) => {
        const all = [
          ...mine.map(a => ({ ...a, _source: 'My Photos' })),
          ...shared.map(a => ({ ...a, _source: 'Shared Album' })),
        ];
        setAlbums(all);
        addConnectedAccount({
          id: userInfo?.sub || 'google-user',
          email: userInfo?.email || '',
          name: userInfo?.name || 'Google Account',
          avatarUrl: userInfo?.picture || null,
          connected: true,
        });
      })
      .catch(err => setAlbumsError(err.message))
      .finally(() => setAlbumsLoading(false));
  }, [accessToken]);

  const reloadAlbums = () => {
    if (!accessToken) return;
    setAlbumsLoading(true);
    setAlbumsError(null);
    Promise.all([apiFetchAlbums(accessToken), apiFetchSharedAlbums(accessToken)])
      .then(([m, s]) => setAlbums([
        ...m.map(a => ({ ...a, _source: 'My Photos' })),
        ...s.map(a => ({ ...a, _source: 'Shared Album' })),
      ]))
      .catch(err => setAlbumsError(err.message))
      .finally(() => setAlbumsLoading(false));
  };

  const toggleAlbum = id => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleImport = async () => {
    if (!selectedIds.size) return;
    setImporting(true);
    const chosen = albums.filter(a => selectedIds.has(a.id));
    setSelectedAlbums(chosen);

    const allItems = [];
    for (const album of chosen) {
      const items = await apiFetchAlbumMedia(accessToken, album.id).catch(() => []);
      items.forEach(item => allItems.push({
        id: item.id,
        url: item.baseUrl ? `${item.baseUrl}=w1200` : null,
        thumbnailUrl: item.baseUrl ? `${item.baseUrl}=w300-h300-c` : null,
        type: item.mimeType?.startsWith('video') ? 'video' : 'photo',
        dateTaken: item.mediaMetadata?.creationTime || null,
        sourceAlbum: album.id,
        sourceLabel: album._source,
        filename: item.filename,
        tags: [],
        status: 'optional',
      }));
    }
    addMediaItems(allItems);
    setImporting(false);
    setImportDone(true);
  };

  // Drag & drop
  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (!files.length) return;
    const items = files.map((f, i) => ({
      id: `local-${Date.now()}-${i}`,
      url: URL.createObjectURL(f),
      thumbnailUrl: URL.createObjectURL(f),
      type: f.type.startsWith('video') ? 'video' : 'photo',
      dateTaken: null,
      sourceAlbum: 'local-upload',
      sourceLabel: 'Uploaded',
      filename: f.name,
      tags: [],
      status: 'optional',
    }));
    addMediaItems(items);
    setUploadedCount(c => c + items.length);
  }, [addMediaItems]);

  const handleFileInput = e => {
    const files = Array.from(e.target.files || []).filter(
      f => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (!files.length) return;
    const items = files.map((f, i) => ({
      id: `local-${Date.now()}-${i}`,
      url: URL.createObjectURL(f),
      thumbnailUrl: URL.createObjectURL(f),
      type: f.type.startsWith('video') ? 'video' : 'photo',
      dateTaken: null,
      sourceAlbum: 'local-upload',
      sourceLabel: 'Uploaded',
      filename: f.name,
      tags: [],
      status: 'optional',
    }));
    addMediaItems(items);
    setUploadedCount(c => c + items.length);
  };

  return (
    <div className="min-h-dvh bg-[#0d0618] p-4 md:p-8 safe-bottom-nav">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl gradient-text font-semibold mb-1">
            Connect Your Photos
          </h1>
          <p className="text-purple-400 text-sm">
            Sign in with Google to browse your albums — only what you choose is imported.
          </p>
        </motion.div>

        {/* ── Google Auth Card ─────────────────────────────────────────────── */}
        <Card>
          <div className="p-5">
            {!accessToken ? (
              <div className="flex flex-col items-center text-center gap-5">
                {/* Google logo */}
                <div className="w-16 h-16 rounded-2xl bg-white/8 border border-purple-800/30 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>

                <div>
                  <h3 className="text-purple-100 font-semibold text-lg mb-1">Connect Google Photos</h3>
                  <p className="text-purple-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Sign in to browse your albums and select the memories that matter most.
                  </p>
                </div>

                {authError && (
                  <div className="w-full flex items-start gap-3 p-3 rounded-xl bg-red-900/30 border border-red-700/40 text-left">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-sm leading-relaxed">{authError}</p>
                  </div>
                )}

                <button
                  onClick={signIn}
                  disabled={!gisReady || authLoading}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 active:bg-gray-200 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {authLoading ? 'Signing in…' : 'Sign in with Google'}
                </button>

                <p className="text-purple-600 text-xs">
                  Only selected photos are used &nbsp;·&nbsp; Nothing stored on any server
                </p>
              </div>
            ) : (
              /* Connected */
              <div className="flex items-center gap-4">
                {userInfo?.picture
                  ? <img src={userInfo.picture} alt={userInfo.name} className="w-12 h-12 rounded-full ring-2 ring-purple-500/50" />
                  : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><User size={22} className="text-white" /></div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <CheckCircle2 size={15} className="text-green-400 flex-shrink-0" />
                    <span className="text-purple-100 font-semibold text-sm truncate">{userInfo?.name || 'Google Account'}</span>
                  </div>
                  <p className="text-purple-400 text-xs truncate">{userInfo?.email}</p>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-light text-purple-400 hover:text-purple-200 text-xs transition-colors"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* ── Albums ───────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {accessToken && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen size={17} className="text-purple-400" />
                  <h2 className="text-purple-100 font-semibold text-sm">
                    {albumsLoading ? 'Loading your albums…' : `${albums.length} Albums found`}
                  </h2>
                </div>
                {!albumsLoading && (
                  <button
                    onClick={reloadAlbums}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-200 text-xs transition-colors"
                  >
                    <RefreshCw size={11} /> Refresh
                  </button>
                )}
              </div>

              {/* Loading skeletons */}
              {albumsLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden">
                      <div className="h-28 skeleton" />
                      <div className="p-3 bg-[#1a0a2e] space-y-2">
                        <div className="h-3 skeleton rounded-full w-3/4" />
                        <div className="h-2 skeleton rounded-full w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {albumsError && (
                <div className="p-4 rounded-2xl bg-red-900/20 border border-red-700/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-400" />
                    <p className="text-red-300 text-sm font-semibold">Could not load albums</p>
                  </div>
                  <p className="text-red-400/80 text-xs font-mono">{albumsError}</p>
                  <div className="mt-2 p-3 bg-purple-900/20 rounded-xl">
                    <p className="text-purple-300 text-xs font-semibold mb-1">Troubleshooting</p>
                    <ul className="text-purple-400 text-xs space-y-1 list-disc list-inside">
                      <li>Ensure <strong>Google Photos Library API</strong> is enabled in Google Cloud Console</li>
                      <li>Your Google account must be added as a <strong>Test user</strong> under OAuth consent screen</li>
                      <li>New Google Cloud projects (post-2024) may need a billing account for Photos API access</li>
                    </ul>
                  </div>
                  <p className="text-purple-500 text-xs">You can still use the manual upload below.</p>
                </div>
              )}

              {/* Empty */}
              {!albumsLoading && !albumsError && albums.length === 0 && (
                <div className="text-center py-10">
                  <Images size={32} className="mx-auto mb-2 text-purple-700" />
                  <p className="text-purple-500 text-sm">No albums found in this Google account.</p>
                </div>
              )}

              {/* Album grid */}
              {!albumsLoading && albums.length > 0 && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {albums.map(album => (
                      <AlbumCard
                        key={album.id}
                        album={album}
                        selected={selectedIds.has(album.id)}
                        onToggle={() => toggleAlbum(album.id)}
                      />
                    ))}
                  </div>

                  {/* Import bar */}
                  <div className="flex items-center justify-between p-4 glass rounded-2xl">
                    <p className="text-purple-300 text-sm">
                      {selectedIds.size === 0
                        ? 'Tap albums to select'
                        : `${selectedIds.size} album${selectedIds.size > 1 ? 's' : ''} selected`}
                    </p>
                    <Button
                      variant={importDone ? 'secondary' : 'primary'}
                      size="md"
                      disabled={selectedIds.size === 0 || importing}
                      loading={importing}
                      icon={importDone ? CheckCircle2 : Check}
                      onClick={handleImport}
                    >
                      {importing ? 'Importing…' : importDone ? 'Imported ✓' : 'Import Selected'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Manual Upload ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CloudUpload size={17} className="text-purple-400" />
            <h2 className="text-purple-100 font-semibold text-sm">Upload Directly</h2>
            <span className="text-purple-600 text-xs">— no sign-in needed</span>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input-connect').click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-pink-400 bg-pink-900/10'
                : 'border-purple-800/50 hover:border-purple-600/50 hover:bg-purple-900/5'
            }`}
          >
            <input
              id="file-input-connect"
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileInput}
            />
            <CloudUpload size={32} className={`mx-auto mb-3 transition-colors ${dragActive ? 'text-pink-400' : 'text-purple-600'}`} />
            <p className="text-purple-300 text-sm font-medium mb-1">
              {dragActive ? 'Drop to add' : 'Drop photos & videos here'}
            </p>
            <p className="text-purple-500 text-xs">or click to select files from your device</p>
            {uploadedCount > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-green-400 text-xs font-semibold"
              >
                ✓ {uploadedCount} file{uploadedCount > 1 ? 's' : ''} added
              </motion.p>
            )}
          </div>
        </div>

        {/* ── Continue CTA ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {(importDone || uploadedCount > 0) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => navigate('/memories')}
              >
                Continue to Memories
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
