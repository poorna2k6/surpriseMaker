import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Share2,
  Link2,
  Play,
  BookOpen,
  RefreshCw,
  Sparkles,
  Heart,
  Film,
  MessageSquare,
  Image,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Send,
  Mail,
  Printer,
  Lock,
  Clock,
  Calendar,
  Plus,
  CheckCircle2,
  Loader2,
  Copy,
  ArrowRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useCountdown from '../hooks/useCountdown';

// ─── Floating hearts animation ────────────────────────────────────────────────

const HEART_SEEDS = [
  { x: 15, delay: 0,    dur: 3.2, size: 18, opacity: 0.7 },
  { x: 30, delay: 0.8,  dur: 4.1, size: 14, opacity: 0.5 },
  { x: 50, delay: 0.3,  dur: 3.6, size: 22, opacity: 0.8 },
  { x: 65, delay: 1.2,  dur: 3.9, size: 12, opacity: 0.4 },
  { x: 80, delay: 0.6,  dur: 4.5, size: 16, opacity: 0.6 },
  { x: 90, delay: 1.8,  dur: 3.0, size: 20, opacity: 0.5 },
];

function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEART_SEEDS.map((h, i) => (
        <motion.div
          key={i}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: -120, opacity: [0, h.opacity, 0] }}
          transition={{
            duration: h.dur,
            delay: h.delay,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'easeOut',
          }}
          style={{ left: `${h.x}%`, bottom: 0, position: 'absolute' }}
        >
          <Heart
            size={h.size}
            className="text-pink-400 fill-pink-400"
            style={{ filter: 'blur(0.5px)' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Confetti burst effect ────────────────────────────────────────────────────

const CONFETTI = [
  { x: 10, color: '#f472b6', shape: 'circle' },
  { x: 25, color: '#a855f7', shape: 'square' },
  { x: 40, color: '#fb923c', shape: 'circle' },
  { x: 55, color: '#60a5fa', shape: 'square' },
  { x: 70, color: '#f472b6', shape: 'circle' },
  { x: 85, color: '#a855f7', shape: 'square' },
  { x: 20, color: '#34d399', shape: 'circle' },
  { x: 60, color: '#fbbf24', shape: 'square' },
];

function ConfettiPiece({ x, color, shape, delay }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: 160, opacity: [1, 1, 0], rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
      transition={{ duration: 2.5 + Math.random(), delay, repeat: Infinity, repeatDelay: 3 }}
      style={{
        left: `${x + Math.random() * 6 - 3}%`,
        top: 0,
        position: 'absolute',
        width: shape === 'circle' ? 8 : 7,
        height: shape === 'circle' ? 8 : 7,
        borderRadius: shape === 'circle' ? '50%' : '2px',
        background: color,
      }}
    />
  );
}

function ConfettiLayer() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
      {CONFETTI.map((c, i) => (
        <ConfettiPiece key={i} {...c} delay={i * 0.18} />
      ))}
    </div>
  );
}

// ─── Countdown widget ─────────────────────────────────────────────────────────

function CountdownWidget({ anniversaryDate }) {
  const { days, hours, minutes, seconds, isToday, isPast } = useCountdown(anniversaryDate);

  if (!anniversaryDate) return null;

  return (
    <Card className="text-center py-5">
      <p className="text-xs text-purple-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
        <Calendar size={12} /> Until Your Anniversary
      </p>
      {isToday ? (
        <div className="space-y-1">
          <p className="font-display text-2xl gradient-text-warm animate-heartbeat">
            Today is the Day! 💕
          </p>
          <p className="text-sm text-purple-300">Happy Anniversary!</p>
        </div>
      ) : isPast ? (
        <p className="font-display text-xl gradient-text">Anniversary has passed 💕</p>
      ) : (
        <div className="flex justify-center gap-4">
          {[
            { value: days,    label: 'Days' },
            { value: hours,   label: 'Hrs' },
            { value: minutes, label: 'Min' },
            { value: seconds, label: 'Sec' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <motion.div
                key={value}
                initial={{ scale: 1.15, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold gradient-text-warm tabular-nums"
              >
                {String(value).padStart(2, '0')}
              </motion.div>
              <p className="text-[10px] text-purple-500 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── Version card ─────────────────────────────────────────────────────────────

function VersionCard({ label, style, music, status, onGenerate }) {
  const isGenerating = status === 'generating';
  const isDone = status === 'done';

  return (
    <div className="glass-light rounded-xl p-4 border border-purple-800/30 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-purple-200">{label}</span>
        {isDone && (
          <span className="text-[11px] text-green-300 border border-green-700/40 bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> Ready
          </span>
        )}
        {isGenerating && (
          <span className="text-[11px] text-yellow-300 flex items-center gap-1">
            <Loader2 size={10} className="animate-spin" /> Generating
          </span>
        )}
      </div>
      <div className="text-xs text-purple-400 space-y-0.5">
        <p>Style: <span className="text-purple-200">{style}</span></p>
        <p>Music: <span className="text-purple-200">{music}</span></p>
      </div>
      <div className="flex gap-2">
        <Button
          variant={isDone ? 'secondary' : 'ghost'}
          size="sm"
          icon={isGenerating ? Loader2 : isDone ? Play : Zap}
          loading={isGenerating}
          onClick={onGenerate}
          fullWidth
        >
          {isDone ? 'Preview' : isGenerating ? 'Generating…' : 'Generate'}
        </Button>
      </div>
    </div>
  );
}

// ─── Regenerate card ──────────────────────────────────────────────────────────

function RegenerateCard({ icon: Icon, title, status, color }) {
  const [isRegen, setIsRegen] = useState(false);

  const handleRegen = () => {
    setIsRegen(true);
    setTimeout(() => setIsRegen(false), 2500);
  };

  const colorClass = {
    pink: 'from-pink-600/20 to-rose-600/10 border-pink-800/30',
    purple: 'from-purple-600/20 to-violet-600/10 border-purple-800/30',
    violet: 'from-violet-600/20 to-indigo-600/10 border-violet-800/30',
    blue: 'from-blue-600/20 to-indigo-600/10 border-blue-800/30',
  }[color] || 'from-purple-600/20 to-violet-600/10 border-purple-800/30';

  return (
    <div className={clsx('rounded-xl p-4 bg-gradient-to-br border space-y-3', colorClass)}>
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-purple-300" />
        <span className="text-sm font-medium text-purple-100">{title}</span>
      </div>
      <p className="text-xs text-purple-400">
        Status: <span className={clsx(isRegen ? 'text-yellow-300' : 'text-green-300')}>
          {isRegen ? 'Regenerating…' : status}
        </span>
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" icon={isRegen ? Loader2 : RefreshCw} loading={isRegen} onClick={handleRegen} fullWidth>
          Regenerate
        </Button>
        <Button variant="ghost" size="sm" icon={Sparkles} fullWidth>
          AI Enhance
        </Button>
      </div>
    </div>
  );
}

// ─── Share step ───────────────────────────────────────────────────────────────

const SHARE_STEPS = [
  {
    icon: Smartphone,
    title: 'AirDrop to their phone',
    desc: 'Open Files app on your iPhone, tap Share → AirDrop and select their device.',
  },
  {
    icon: Send,
    title: 'Send via WhatsApp',
    desc: 'Tap "Copy Share Link" below, paste it into WhatsApp with a loving message.',
  },
  {
    icon: Mail,
    title: 'Email the link',
    desc: 'Copy the share link and send it via email. Works on any device.',
  },
  {
    icon: Printer,
    title: 'Print and frame',
    desc: 'Export the album as PDF and print selected pages for a physical keepsake.',
  },
];

function ShareAccordion() {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base text-purple-100">How to Share</h3>
        <Button variant="ghost" size="sm" icon={copied ? CheckCircle2 : Link2} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Share Link'}
        </Button>
      </div>

      <div className="space-y-2">
        {SHARE_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isOpen = open === i;
          return (
            <div key={i} className="glass-light rounded-xl border border-purple-800/20 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-800/40 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-purple-300" />
                </div>
                <span className="flex-1 text-sm font-medium text-purple-200">{step.title}</span>
                {isOpen ? (
                  <ChevronUp size={14} className="text-purple-400 flex-shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-purple-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-3 text-sm text-purple-400 leading-relaxed">{step.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-purple-950/50 border border-purple-800/20">
        <Lock size={13} className="text-purple-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-purple-400 leading-relaxed">
          All files are private. Nothing is shared without your action. Share links expire automatically.
        </p>
      </div>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Output() {
  const navigate = useNavigate();
  const userProfile = useStore(s => s.userProfile);

  const [versionBStatus, setVersionBStatus] = useState('idle');
  const [versionCStatus, setVersionCStatus] = useState('idle');

  // Build anniversary date for countdown
  const anniversaryDate = userProfile.nextAnniversaryDate instanceof Date
    ? userProfile.nextAnniversaryDate
    : userProfile.weddingDate
      ? (() => {
          const d = new Date(userProfile.weddingDate);
          const now = new Date();
          d.setFullYear(now.getFullYear());
          if (d < now) d.setFullYear(now.getFullYear() + 1);
          return d;
        })()
      : new Date(new Date().setMonth(new Date().getMonth() + 2));

  const handleGenerateVersion = (version) => {
    if (version === 'B') {
      setVersionBStatus('generating');
      setTimeout(() => setVersionBStatus('done'), 4000);
    } else {
      setVersionCStatus('generating');
      setTimeout(() => setVersionCStatus('done'), 5500);
    }
  };

  const stats = [
    { icon: Image,        label: 'Photos curated', value: 48  },
    { icon: Film,         label: 'Scenes created',  value: 7   },
    { icon: MessageSquare, label: 'Love notes',     value: 3   },
    { icon: Heart,        label: 'Years celebrated', value: userProfile.yearsTogether || 5 },
  ];

  return (
    <div className="min-h-dvh bg-[#0d0618] pb-8 overflow-x-hidden">

      {/* ── Celebration Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d1b4e]/80 to-transparent pb-12 pt-10 px-4">
        <ConfettiLayer />
        <FloatingHearts />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-5xl mb-4"
          >
            🎉
          </motion.div>

          <h1 className="font-display text-3xl sm:text-4xl gradient-text-warm leading-tight mb-3">
            Your Anniversary Surprise is Ready!
          </h1>

          <p className="text-purple-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Every memory, every feeling, captured just for them
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6 -mt-4">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            >
              <Card padding="sm" glow className="text-center">
                <Icon size={18} className="text-pink-400 mx-auto mb-2 animate-float" style={{ animationDelay: `${i * 0.4}s` }} />
                <p className="text-2xl font-bold gradient-text">{value}</p>
                <p className="text-[11px] text-purple-400 mt-0.5 leading-tight">{label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Section 1: Download Video ── */}
        <Card glow>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Video thumbnail */}
            <div className="sm:w-48 flex-shrink-0">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-900 via-pink-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center cursor-pointer glow-rose"
                >
                  <Play size={20} className="text-white fill-white ml-1" />
                </motion.div>
                <div className="absolute top-2 left-2 px-2 py-0.5 glass rounded-full text-[10px] text-purple-200 border border-purple-600/40">
                  Version A
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-purple-400 glass px-1.5 py-0.5 rounded-full">
                  ~45 MB
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-display text-lg text-purple-100">Your Anniversary Video</h3>
                <p className="text-sm text-purple-400">Classic Romance · Soft Piano · 1080p HD</p>
              </div>

              {/* VIDEO GENERATION / EXPORT: connect rendering service here */}
              <div className="flex flex-wrap gap-2">
                <Button icon={Download} size="md">
                  Download Video
                </Button>
                <Button variant="secondary" size="sm" icon={Link2}>
                  Copy Share Link
                </Button>
                <Button variant="ghost" size="sm" icon={Share2}>
                  Send via…
                </Button>
              </div>

              <div className="flex items-center gap-3 text-xs text-purple-500">
                <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-green-400" /> Private & secure</span>
                <span className="flex items-center gap-1"><Lock size={11} /> Expires in 7 days</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Section 2: Download Album ── */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Album cover preview */}
            <div className="sm:w-36 flex-shrink-0">
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center gap-2 relative border border-purple-700/30">
                <BookOpen size={24} className="text-purple-300" />
                <p className="font-display text-xs text-purple-200 text-center px-2">Our 5 Years</p>
                <div className="absolute top-2 left-2 px-2 py-0.5 glass rounded-full text-[10px] text-purple-300">
                  PDF
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-display text-lg text-purple-100">Digital Album</h3>
                <p className="text-sm text-purple-400">6 pages · Dark Cinematic theme · Print-ready</p>
              </div>

              {/* VIDEO GENERATION / EXPORT: connect rendering service here */}
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" icon={Download} size="md">
                  Export Album
                </Button>
                <Button variant="ghost" size="sm" icon={Share2}>
                  Share Album
                </Button>
              </div>

              <div className="text-xs text-purple-500 flex items-center gap-2">
                <CheckCircle2 size={11} className="text-green-400" />
                High-resolution PDF, suitable for professional printing
              </div>
            </div>
          </div>
        </Card>

        {/* ── Section 3: Alternative Versions ── */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg text-purple-100">Try Another Version</h3>
              <p className="text-sm text-purple-400">Generate a different take with a new style or music</p>
            </div>
            <RotateCcw size={16} className="text-purple-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <VersionCard
              label="Version B"
              style="Dreamy Film"
              music="Acoustic"
              status={versionBStatus}
              onGenerate={() => handleGenerateVersion('B')}
            />
            <VersionCard
              label="Version C"
              style="Joyful Celebration"
              music="Indian Romantic"
              status={versionCStatus}
              onGenerate={() => handleGenerateVersion('C')}
            />
          </div>
        </Card>

        {/* ── Section 4: Regenerate Individual Parts ── */}
        <div>
          <h3 className="font-display text-base text-purple-200 mb-3">Regenerate Individual Parts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RegenerateCard icon={Film}          title="Video"     status="Complete"  color="pink" />
            <RegenerateCard icon={BookOpen}      title="Album"     status="Complete"  color="purple" />
            <RegenerateCard icon={MessageSquare} title="Messages"  status="Complete"  color="violet" />
            <RegenerateCard icon={Calendar}      title="Timeline"  status="Complete"  color="blue" />
          </div>
        </div>

        {/* ── Countdown Timer ── */}
        <CountdownWidget anniversaryDate={anniversaryDate} />

        {/* ── Section 5: Share & Surprise ── */}
        <ShareAccordion />

        {/* ── Footer CTA ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-purple-800/20">
          <Button
            variant="secondary"
            icon={RotateCcw}
            size="lg"
            fullWidth
            onClick={() => navigate('/video')}
          >
            Create Another Version
          </Button>
          <Button
            icon={Plus}
            size="lg"
            fullWidth
            onClick={() => navigate('/create')}
          >
            Start a New Project
          </Button>
        </div>
      </div>
    </div>
  );
}
