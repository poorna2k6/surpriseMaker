import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Copy,
  Save,
  Trash2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Pencil,
  BookOpen,
  Check,
  Layers,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Romantic',
  'Funny',
  'Reflective',
  'Grateful',
  'Future Dreams',
  'Short Captions',
  'Narration',
];

const OUTPUT_LENGTHS = [
  { id: 'short',     label: 'Short',     desc: '1–2 sentences' },
  { id: 'medium',    label: 'Medium',    desc: 'Paragraph' },
  { id: 'letter',    label: 'Letter',    desc: 'Full letter' },
  { id: 'narration', label: 'Narration', desc: 'Script' },
];

const TONE_SUGGESTIONS = ['Heartfelt', 'Playful', 'Poetic', 'Simple', 'Nostalgic', 'Hopeful'];

const PROMPTS_BY_CATEGORY = {
  Romantic: [
    { id: 'r1', text: 'What I love most about you is…' },
    { id: 'r2', text: 'When I think of you, I remember…' },
    { id: 'r3', text: 'Since the day we got married, you have…' },
    { id: 'r4', text: 'Every morning I wake up and feel lucky because…' },
  ],
  Funny: [
    { id: 'f1', text: "The most ridiculous thing we've ever done together is…" },
    { id: 'f2', text: 'I knew you were the one when you laughed at…' },
    { id: 'f3', text: "The habit of yours I've learned to secretly love is…" },
    { id: 'f4', text: 'If our relationship had a theme song it would be…' },
  ],
  Reflective: [
    { id: 'rf1', text: 'The memory that still makes me smile is…' },
    { id: 'rf2', text: 'The best thing about our journey is…' },
    { id: 'rf3', text: 'The hardest moment we got through together was…' },
    { id: 'rf4', text: 'Looking back on these years, what surprises me most is…' },
  ],
  Grateful: [
    { id: 'g1', text: 'I am grateful for you because…' },
    { id: 'g2', text: 'You make everything better simply by…' },
    { id: 'g3', text: 'The small things you do that mean the world to me…' },
    { id: 'g4', text: 'Thank you for always being there when…' },
  ],
  'Future Dreams': [
    { id: 'fd1', text: 'In the next year, I dream we will…' },
    { id: 'fd2', text: 'In ten years I picture us…' },
    { id: 'fd3', text: 'The adventure I want us to go on next is…' },
    { id: 'fd4', text: 'The promise I want to make you today is…' },
  ],
  'Short Captions': [
    { id: 'sc1', text: 'Us, always.' },
    { id: 'sc2', text: 'Every chapter, with you.' },
    { id: 'sc3', text: 'The best years of my life.' },
    { id: 'sc4', text: 'Home is wherever you are.' },
  ],
  Narration: [
    { id: 'n1', text: 'This is the story of two people who chose each other…' },
    { id: 'n2', text: 'It started with a single moment, and grew into…' },
    { id: 'n3', text: 'Every photo in this album holds a memory. Let me take you through them…' },
    { id: 'n4', text: 'If these photos could speak, they would say…' },
  ],
};

const DEMO_GENERATED = {
  short:
    'From the very first moment, you made the ordinary feel extraordinary. Every day with you is my favourite day.',
  medium:
    'There are five years worth of moments in this album, and yet none of them do justice to what I feel for you. You've been my adventure, my comfort, my home. Watching you laugh, seeing you grow, sharing every quiet Tuesday — that's the love story I'll never stop wanting to tell.',
  letter:
    'My love,\n\nFive years ago I stood across from you and made a promise. I didn't fully understand then how much that promise would shape me. Every year since, I have watched you become more yourself — braver, kinder, more dazzling than I thought possible.\n\nYou have been with me through every storm and every sunrise. You have held my hand in hospitals, danced with me in parking lots, and talked me out of my worst ideas — and into my best ones.\n\nI love you not just for who you are, but for who I become when I'm with you.\n\nAlways yours.',
  narration:
    'The year was 2019. Two people stood at the edge of a new life, ready to jump — together. What follows is a love story told in photographs: ordinary moments that turned out to be anything but ordinary. Each image is a heartbeat. Each chapter, a year of choosing each other. This is our story.',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-purple-500/30 text-purple-100 border-purple-400/60 glow-violet'
          : 'bg-transparent text-purple-400 border-purple-700/40 hover:border-purple-500/50 hover:text-purple-300'
      }`}
    >
      {label}
    </button>
  );
}

function PromptCard({ prompt, onUse, onGenerate }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card
      padding="md"
      hover
      onClick={() => setExpanded((v) => !v)}
      className="cursor-pointer"
    >
      <p className="text-purple-200 text-sm leading-relaxed">{prompt.text}</p>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" icon={Pencil} onClick={(e) => { e.stopPropagation(); onUse(prompt.text); }}>
                Use This
              </Button>
              <Button size="sm" variant="ghost" icon={Wand2} onClick={(e) => { e.stopPropagation(); onGenerate(prompt.text); }}>
                Generate with AI
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function GeneratedMessageCard({ message, outputLength, onCopy, onSave, onInsert, onRegenerate, onToneChange, isCopied }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 space-y-4 border border-purple-500/20"
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-pink-400" />
        <span className="text-pink-300 text-xs font-semibold uppercase tracking-wider">AI Generated</span>
        <div className="flex-1" />
        <span className="text-purple-500 text-[10px] uppercase tracking-wide">{outputLength}</span>
      </div>

      {/* Message text */}
      <p className="text-purple-100 text-sm leading-relaxed whitespace-pre-line">{message}</p>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" icon={isCopied ? Check : Copy} onClick={onCopy}>
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
        <Button size="sm" variant="secondary" icon={Save} onClick={onSave}>
          Save
        </Button>
        <Button size="sm" variant="ghost" icon={Layers} onClick={onInsert}>
          Insert into Chapter
        </Button>
        <Button size="sm" variant="ghost" icon={RefreshCw} onClick={onRegenerate}>
          Regenerate
        </Button>
      </div>

      {/* Tone change */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-purple-500 text-xs self-center">Tone:</span>
        {TONE_SUGGESTIONS.slice(0, 4).map((t) => (
          <button
            key={t}
            onClick={() => onToneChange(t)}
            className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-700/40 text-purple-400 hover:text-purple-200 hover:border-purple-500/60 transition-all cursor-pointer"
          >
            {t}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function SavedMessageCard({ msg, onDelete, onInsert }) {
  const categoryColour = {
    Romantic: 'text-pink-300 bg-pink-500/15 border-pink-500/30',
    Funny: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    Reflective: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
    Grateful: 'text-green-300 bg-green-500/15 border-green-500/30',
    'Future Dreams': 'text-violet-300 bg-violet-500/15 border-violet-500/30',
    'Short Captions': 'text-purple-300 bg-purple-500/15 border-purple-500/30',
    Narration: 'text-orange-300 bg-orange-500/15 border-orange-500/30',
  };
  const cls = categoryColour[msg.category] ?? 'text-purple-300 bg-purple-500/15 border-purple-500/30';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cls}`}>
          {msg.category}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onInsert(msg)}
            className="p-1.5 rounded-lg text-purple-500 hover:text-purple-300 hover:bg-white/5 transition-all"
            title="Insert into chapter"
          >
            <Layers size={13} />
          </button>
          <button
            onClick={() => onDelete(msg.id)}
            className="p-1.5 rounded-lg text-purple-700 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <p className="text-purple-300 text-xs leading-relaxed line-clamp-3">{msg.text}</p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Messages() {
  const navigate = useNavigate();
  const { savedMessages, saveMessage, removeMessage } = useStore();

  const [activeCategory, setActiveCategory] = useState('Romantic');
  const [outputLength, setOutputLength]     = useState('medium');
  const [isGenerating, setIsGenerating]     = useState(false);
  const [generatedMsg, setGeneratedMsg]     = useState(null);
  const [activePrompt, setActivePrompt]     = useState(null);
  const [isCopied, setIsCopied]             = useState(false);
  const [freewrite, setFreewrite]           = useState('');
  const [localSaved, setLocalSaved]         = useState([
    {
      id: 'saved-0',
      category: 'Romantic',
      text: 'You are the best decision I ever made. Every single day with you is a gift I never expected.',
    },
    {
      id: 'saved-1',
      category: 'Narration',
      text: 'This is the story of two people who chose each other, and keep choosing each other, every single day.',
    },
  ]);

  const prompts = PROMPTS_BY_CATEGORY[activeCategory] ?? [];

  // ── Use prompt ──────────────────────────────────────────────────────────────
  const handleUsePrompt = (text) => {
    setFreewrite((prev) => (prev ? prev + '\n\n' + text : text));
    setActivePrompt(text);
  };

  // ── Generate AI message ─────────────────────────────────────────────────────
  const handleGenerate = async (promptText) => {
    setActivePrompt(promptText);
    setIsGenerating(true);
    setGeneratedMsg(null);
    // AI MESSAGE GENERATION: generate text here
    await new Promise((r) => setTimeout(r, 1500));
    setGeneratedMsg(DEMO_GENERATED[outputLength] ?? DEMO_GENERATED.medium);
    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    if (activePrompt) handleGenerate(activePrompt);
  };

  const handleToneChange = (tone) => {
    // Re-generate with new tone; demo just shuffles to medium
    handleGenerate(activePrompt ?? prompts[0]?.text ?? '');
  };

  // ── Copy ────────────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!generatedMsg) return;
    await navigator.clipboard.writeText(generatedMsg).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!generatedMsg) return;
    const msg = {
      id: `saved-${Date.now()}`,
      category: activeCategory,
      text: generatedMsg,
    };
    setLocalSaved((prev) => [msg, ...prev]);
    saveMessage(msg);
  };

  const handleSaveFreewrite = () => {
    if (!freewrite.trim()) return;
    const msg = {
      id: `fw-${Date.now()}`,
      category: activeCategory,
      text: freewrite.trim(),
    };
    setLocalSaved((prev) => [msg, ...prev]);
    saveMessage(msg);
    setFreewrite('');
  };

  const handleDeleteSaved = (id) => {
    setLocalSaved((prev) => prev.filter((m) => m.id !== id));
    removeMessage(id);
  };

  const handleInsert = (msg) => {
    // Insert into chapter — placeholder for chapter linking
    alert(`"${msg.text.slice(0, 40)}…" inserted into current chapter.`);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0618] pb-28">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="bg-[#0d0618]/90 backdrop-blur-xl border-b border-purple-900/40 px-4 py-5 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto text-center space-y-1">
          <h1 className="font-display text-3xl font-semibold gradient-text">Message Inspiration Studio</h1>
          <p className="text-purple-400 text-sm">Find the words that live in your heart</p>
        </div>

        {/* Category tabs */}
        <div className="max-w-3xl mx-auto mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => { setActiveCategory(cat); setGeneratedMsg(null); setActivePrompt(null); }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-8">

        {/* ── Prompt Starters ───────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-purple-400" />
            <h2 className="text-purple-200 font-semibold text-sm">Prompt Starters</h2>
          </div>

          {/* Output length selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {OUTPUT_LENGTHS.map((ol) => (
              <button
                key={ol.id}
                onClick={() => setOutputLength(ol.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all duration-150 cursor-pointer ${
                  outputLength === ol.id
                    ? 'bg-purple-500/25 text-purple-100 border-purple-400/60'
                    : 'text-purple-400 border-purple-700/40 hover:text-purple-200 hover:border-purple-500/50'
                }`}
              >
                <span>{ol.label}</span>
                <span className="ml-1 text-purple-600 text-[10px]">({ol.desc})</span>
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onUse={handleUsePrompt}
                onGenerate={handleGenerate}
              />
            ))}
          </div>
        </section>

        {/* ── AI Generation Panel ──────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-pink-400" />
            <h2 className="text-purple-200 font-semibold text-sm">AI Generation</h2>
            {/* AI MESSAGE GENERATION: generate text here */}
          </div>

          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="skeleton h-5 rounded-lg w-3/4" />
                <div className="skeleton h-5 rounded-lg w-full" />
                <div className="skeleton h-5 rounded-lg w-5/6" />
                <div className="skeleton h-5 rounded-lg w-2/3" />
                <div className="flex gap-2 mt-2">
                  <div className="skeleton h-8 rounded-xl w-20" />
                  <div className="skeleton h-8 rounded-xl w-20" />
                  <div className="skeleton h-8 rounded-xl w-28" />
                </div>
              </motion.div>
            )}

            {!isGenerating && generatedMsg && (
              <GeneratedMessageCard
                key="result"
                message={generatedMsg}
                outputLength={OUTPUT_LENGTHS.find((o) => o.id === outputLength)?.label ?? 'Medium'}
                onCopy={handleCopy}
                onSave={handleSave}
                onInsert={() => handleInsert({ id: 'gen', text: generatedMsg, category: activeCategory })}
                onRegenerate={handleRegenerate}
                onToneChange={handleToneChange}
                isCopied={isCopied}
              />
            )}

            {!isGenerating && !generatedMsg && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-6 text-center space-y-3 border border-dashed border-purple-700/40"
              >
                <Wand2 size={28} className="text-purple-700 mx-auto" />
                <p className="text-purple-500 text-sm">
                  Tap "Generate with AI" on any prompt starter to create a message
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Freewrite Editor ────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-purple-400" />
            <h2 className="text-purple-200 font-semibold text-sm">Write Your Own Message</h2>
          </div>

          <div className="glass rounded-2xl p-4 space-y-3">
            <textarea
              value={freewrite}
              onChange={(e) => setFreewrite(e.target.value)}
              rows={6}
              placeholder="Write your message here. Let the words flow naturally…"
              className="w-full bg-transparent text-purple-200 text-sm leading-relaxed placeholder:text-purple-700 outline-none resize-none"
            />

            <div className="flex items-center justify-between gap-3 flex-wrap border-t border-purple-800/40 pt-3">
              <span className="text-purple-600 text-xs">
                {freewrite.length} characters
              </span>

              {/* Tone suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {TONE_SUGGESTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => {}}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-700/40 text-purple-500 hover:text-purple-200 hover:border-purple-500/60 transition-all cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                icon={Wand2}
                onClick={() => handleGenerate(freewrite || prompts[0]?.text)}
                disabled={!freewrite.trim() && !prompts[0]}
              >
                Get AI Suggestions
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Save}
                onClick={handleSaveFreewrite}
                disabled={!freewrite.trim()}
              >
                Save Message
              </Button>
            </div>
          </div>
        </section>

        {/* ── Saved Messages ───────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Save size={16} className="text-purple-400" />
            <h2 className="text-purple-200 font-semibold text-sm">Saved Messages</h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-medium">
              {localSaved.length}
            </span>
          </div>

          {localSaved.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-purple-600 text-sm">No saved messages yet. Generate or write one above.</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid sm:grid-cols-2 gap-3">
                {localSaved.map((msg) => (
                  <SavedMessageCard
                    key={msg.id}
                    msg={msg}
                    onDelete={handleDeleteSaved}
                    onInsert={handleInsert}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </section>

        {/* ── Continue CTA ─────────────────────────────────────────────────── */}
        <div className="flex justify-center pt-4">
          <Button
            variant="primary"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/preview')}
          >
            Continue to Preview
          </Button>
        </div>

      </div>
    </div>
  );
}
