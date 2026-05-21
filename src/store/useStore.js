import { create } from 'zustand';

const initialState = {
  // User profile
  userProfile: {
    name: '',
    spouseName: '',
    nickname: '',
    weddingDate: null,         // Date object
    nextAnniversaryDate: null, // Date object
    yearsTogether: 0,
    tone: ['Romantic'],        // array of tone strings
    language: 'English',
    musicMood: 'Soft Piano',
    videoStyle: 'Classic Romance',
    includeNarration: false,
    includeUserVoice: false,
    createType: 'Both',        // 'Video only' | 'Album only' | 'Both'
    memoryEmphasis: ['Mixed'],
  },

  // Connected accounts
  connectedAccounts: [],  // array of { id, email, name, avatarUrl, connected }
  selectedAlbums: [],     // array of albumSource objects

  // Media items
  mediaItems: [],         // array of mediaItem objects
  taggedMedia: {},        // { [id]: { tags, status, note, favorite, mustInclude } }

  // Timeline
  timelineChapters: [],   // array of timelineChapter objects

  // Messages
  savedMessages: [],
  messagePrompts: [],

  // Video project
  videoProject: {
    id: null,
    version: 1,
    style: 'Classic Romance',
    musicMood: 'Soft Piano',
    pacing: 'medium',
    scenes: [],
    narrationScript: '',
    status: 'draft',
    downloadUrl: null,
  },

  // Album project
  albumProject: {
    id: null,
    version: 1,
    coverStyle: 'Elegant White',
    chapters: [],
    status: 'draft',
    exportUrl: null,
  },

  // PWA install state
  pwaInstall: {
    canInstall: false,
    isInstalled: false,
    deferredPrompt: null,
    platform: 'unknown',
    showIOSInstructions: false,
  },

  // App state
  currentStep: 0,          // wizard step
  hasCompletedSetup: false,
  isGenerating: false,
  generationProgress: 0,
};

const useStore = create((set) => ({
  ...initialState,

  // ─── User Profile ────────────────────────────────────────────────────────────

  setUserProfile: (partial) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...partial },
    })),

  // ─── Connected Accounts ──────────────────────────────────────────────────────

  addConnectedAccount: (account) => {
    // GOOGLE OAUTH: sign in and consent flow here
    set((state) => ({
      connectedAccounts: [
        ...state.connectedAccounts.filter((a) => a.id !== account.id),
        account,
      ],
    }));
  },

  removeConnectedAccount: (id) =>
    set((state) => ({
      connectedAccounts: state.connectedAccounts.filter((a) => a.id !== id),
    })),

  setSelectedAlbums: (albums) => {
    // GOOGLE PHOTOS ALBUM FETCH: load albums here
    set({ selectedAlbums: albums });
  },

  // ─── Media Items ─────────────────────────────────────────────────────────────

  addMediaItems: (items) => {
    // GOOGLE PHOTOS PICKER API: launch picker here
    set((state) => {
      const existingIds = new Set(state.mediaItems.map((m) => m.id));
      const newItems = items.filter((item) => !existingIds.has(item.id));
      return { mediaItems: [...state.mediaItems, ...newItems] };
    });
  },

  removeMediaItem: (id) =>
    set((state) => {
      const { [id]: _removed, ...remainingTagged } = state.taggedMedia;
      return {
        mediaItems: state.mediaItems.filter((m) => m.id !== id),
        taggedMedia: remainingTagged,
      };
    }),

  tagMediaItem: (id, tags) =>
    set((state) => ({
      taggedMedia: {
        ...state.taggedMedia,
        [id]: {
          ...state.taggedMedia[id],
          tags,
        },
      },
    })),

  /**
   * status: 'favorite' | 'mustInclude' | 'optional' | 'removed'
   */
  updateMediaItemStatus: (id, status) =>
    set((state) => ({
      taggedMedia: {
        ...state.taggedMedia,
        [id]: {
          ...state.taggedMedia[id],
          status,
          // Derive convenience booleans from status
          favorite: status === 'favorite',
          mustInclude: status === 'mustInclude',
        },
      },
    })),

  addMediaNote: (id, note) =>
    set((state) => ({
      taggedMedia: {
        ...state.taggedMedia,
        [id]: {
          ...state.taggedMedia[id],
          note,
        },
      },
    })),

  // ─── Timeline ────────────────────────────────────────────────────────────────

  setTimelineChapters: (chapters) => set({ timelineChapters: chapters }),

  addTimelineChapter: (chapter) =>
    set((state) => ({
      timelineChapters: [...state.timelineChapters, chapter],
    })),

  updateTimelineChapter: (id, partial) =>
    set((state) => ({
      timelineChapters: state.timelineChapters.map((ch) =>
        ch.id === id ? { ...ch, ...partial } : ch
      ),
    })),

  removeTimelineChapter: (id) =>
    set((state) => ({
      timelineChapters: state.timelineChapters.filter((ch) => ch.id !== id),
    })),

  reorderTimelineChapters: (newOrder) =>
    set({ timelineChapters: newOrder }),

  // ─── Messages ────────────────────────────────────────────────────────────────

  saveMessage: (message) => {
    // AI MESSAGE GENERATION: generate text here
    set((state) => ({
      savedMessages: [
        ...state.savedMessages.filter((m) => m.id !== message.id),
        message,
      ],
    }));
  },

  removeMessage: (id) =>
    set((state) => ({
      savedMessages: state.savedMessages.filter((m) => m.id !== id),
    })),

  // ─── Video Project ────────────────────────────────────────────────────────────

  setVideoProject: (partial) => {
    // VIDEO GENERATION / EXPORT: connect rendering service here
    set((state) => ({
      videoProject: { ...state.videoProject, ...partial },
    }));
  },

  // ─── Album Project ────────────────────────────────────────────────────────────

  setAlbumProject: (partial) =>
    set((state) => ({
      albumProject: { ...state.albumProject, ...partial },
    })),

  // ─── PWA Install ─────────────────────────────────────────────────────────────

  setPwaInstall: (partial) =>
    set((state) => ({
      pwaInstall: { ...state.pwaInstall, ...partial },
    })),

  // ─── App State ───────────────────────────────────────────────────────────────

  setCurrentStep: (step) => set({ currentStep: step }),

  setHasCompletedSetup: (bool) => set({ hasCompletedSetup: bool }),

  setIsGenerating: (bool) => set({ isGenerating: bool }),

  setGenerationProgress: (n) => set({ generationProgress: n }),

  // ─── Reset ───────────────────────────────────────────────────────────────────

  reset: () => set({ ...initialState }),
}));

export default useStore;
