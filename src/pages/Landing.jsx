import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Images,
  Sparkles,
  Film,
  MessageSquareHeart,
  ArrowRight,
  Heart,
  Smartphone,
  Monitor,
  Apple,
  Star,
} from 'lucide-react';

import StarsBackground from '../components/ui/StarsBackground';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import InstallBanner from '../components/pwa/InstallBanner';
import InstallButton from '../components/pwa/InstallButton';
import usePWAInstall from '../hooks/usePWAInstall';

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Feature Data ──────────────────────────────────────────────────────────────

const features = [
  {
    icon: Images,
    color: 'from-violet-500 to-purple-600',
    title: 'Connect Your Photos',
    description: 'Securely select from your Google Photos albums with a single tap.',
  },
  {
    icon: Sparkles,
    color: 'from-pink-500 to-rose-600',
    title: 'Curate Memories',
    description: 'Handpick and arrange your most precious moments with ease.',
  },
  {
    icon: Film,
    color: 'from-purple-500 to-indigo-600',
    title: 'Create Video',
    description: 'Generate a cinematic anniversary film from your shared story.',
  },
  {
    icon: MessageSquareHeart,
    color: 'from-rose-500 to-pink-600',
    title: 'Write Messages',
    description: 'AI-assisted heartfelt messages crafted in your authentic voice.',
  },
];

// ─── How-it-works Data ────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    title: 'Connect Photos',
    description:
      'Link your Google Photos account and choose the albums that hold your most precious memories.',
  },
  {
    number: '02',
    title: 'Select Memories',
    description:
      'Browse your photos and handpick the moments that tell your unique love story.',
  },
  {
    number: '03',
    title: 'Build Your Story',
    description:
      'Arrange chapters, add messages, choose music and a visual style that feels like you.',
  },
  {
    number: '04',
    title: 'Surprise Them',
    description:
      'Share the finished video or album on your anniversary for a moment they will never forget.',
  },
];

// ─── Platform Data ────────────────────────────────────────────────────────────

const platforms = [
  {
    icon: Apple,
    label: 'iPhone',
    hint: 'Tap Share, then "Add to Home Screen"',
    color: 'from-purple-500/20 to-violet-600/10',
    border: 'border-purple-500/30',
  },
  {
    icon: Smartphone,
    label: 'Android',
    hint: 'Tap the install banner or browser menu',
    color: 'from-pink-500/20 to-rose-600/10',
    border: 'border-pink-500/30',
  },
  {
    icon: Monitor,
    label: 'Desktop',
    hint: 'Click the install icon in your address bar',
    color: 'from-violet-500/20 to-purple-600/10',
    border: 'border-violet-500/30',
  },
];

// ─── InView Section Wrapper ───────────────────────────────────────────────────

function Section({ children, className = '' }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const { isInstalled } = usePWAInstall();

  return (
    <div className="relative min-h-dvh bg-[#0d0618] overflow-x-hidden">
      <StarsBackground />

      {/* ── SECTION 1: Hero ──────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Decorative gradient orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px]" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-pink-700/15 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-violet-800/10 blur-[140px]" />
        </div>

        {/* Floating heart decorations */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-36 right-16 opacity-20 hidden md:block"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={64} className="text-pink-400 fill-pink-400/30" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-28 left-20 opacity-15 hidden lg:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Heart size={40} className="text-purple-400 fill-purple-400/20" />
        </motion.div>

        {/* Install banner */}
        <div className="relative z-10 safe-top">
          <InstallBanner />
        </div>

        {/* Main hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[90dvh] px-6 pt-12 pb-24 text-center">
          {/* Eyebrow label */}
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-sm italic font-medium mb-6 tracking-wide gradient-text-warm"
          >
            A gift beyond words
          </motion.p>

          {/* Headline */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.12] max-w-4xl mb-6"
          >
            <span className="gradient-text">Turn Your Memories</span>{' '}
            <span className="text-purple-100">Into a Surprise</span>{' '}
            <span className="gradient-text-warm">They'll Never Forget</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-purple-300 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed"
          >
            Craft a cinematic anniversary experience from your most cherished photos
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <Button
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/create')}
              className="min-w-[260px] sm:min-w-0"
            >
              Start Creating Your Surprise
            </Button>

            <InstallButton size="md" variant="ghost" showLabel />
          </motion.div>

          {/* Trust line */}
          <motion.p
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-purple-500 text-xs tracking-wide"
          >
            Private &amp; personal &nbsp;•&nbsp; Works on iPhone &amp; Android &nbsp;•&nbsp; No account needed
          </motion.p>
        </div>
      </div>

      {/* ── SECTION 2: Features Strip ─────────────────────────────────────────── */}
      <Section className="relative z-10 px-6 py-20">
        <motion.div variants={cardVariant} className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl gradient-text font-semibold mb-3">
            Everything You Need
          </h2>
          <p className="text-purple-400 max-w-md mx-auto text-sm">
            A complete toolkit for crafting the perfect anniversary surprise
          </p>
        </motion.div>

        {/* Horizontally scrollable on mobile, grid on md+ */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={cardVariant}
                className="flex-none w-64 md:w-auto snap-center"
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <Card className="h-full flex flex-col gap-4" padding="lg">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-purple-100 font-semibold mb-1.5">{feat.title}</h3>
                    <p className="text-purple-400 text-sm leading-relaxed">{feat.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── SECTION 3: How It Works ───────────────────────────────────────────── */}
      <Section className="relative z-10 px-6 py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-purple-800/10 blur-[100px]" />
        </div>

        <motion.div variants={cardVariant} className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl gradient-text font-semibold mb-3">
            How It Works
          </h2>
          <p className="text-purple-400 max-w-sm mx-auto text-sm">
            Four simple steps to your perfect anniversary surprise
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-2">
          {steps.map((step, i) => (
            <motion.div key={step.number} variants={cardVariant} className="flex items-start gap-5">
              {/* Number + connector line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl glass border border-purple-500/30 flex items-center justify-center">
                  <span className="font-display text-lg gradient-text font-semibold leading-none">
                    {step.number}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-8 bg-gradient-to-b from-purple-500/30 to-transparent mt-1" />
                )}
              </div>

              {/* Text */}
              <div className="pb-4 pt-2">
                <h3 className="text-purple-100 font-semibold mb-1">{step.title}</h3>
                <p className="text-purple-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={cardVariant} className="flex justify-center mt-12">
          <Button
            size="lg"
            variant="primary"
            icon={Sparkles}
            onClick={() => navigate('/create')}
          >
            Start Your Story
          </Button>
        </motion.div>
      </Section>

      {/* ── SECTION 4: PWA Install (hidden if already installed) ──────────────── */}
      {!isInstalled && (
        <Section className="relative z-10 px-6 py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[300px] rounded-full bg-pink-800/10 blur-[100px]" />
            <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-violet-800/10 blur-[100px]" />
          </div>

          <motion.div variants={cardVariant} className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl gradient-text-warm font-semibold mb-3">
              Take It Everywhere
            </h2>
            <p className="text-purple-400 max-w-md mx-auto text-sm">
              Works like a native app on your phone — no App Store required
            </p>
          </motion.div>

          {/* Platform cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            {platforms.map((p) => {
              const PIcon = p.icon;
              return (
                <motion.div
                  key={p.label}
                  variants={cardVariant}
                  className={`rounded-2xl p-5 bg-gradient-to-br ${p.color} border ${p.border} flex flex-col items-center text-center gap-3`}
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <PIcon size={20} className="text-purple-200" />
                  </div>
                  <p className="text-purple-100 font-semibold">{p.label}</p>
                  <p className="text-purple-400 text-xs leading-relaxed">{p.hint}</p>
                </motion.div>
              );
            })}
          </div>

          {/* iOS manual steps summary */}
          <motion.div variants={cardVariant} className="max-w-sm mx-auto glass rounded-2xl p-5 mb-8">
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-4 text-center">
              iOS Quick Guide
            </p>
            {[
              'Open this page in Safari',
              'Tap the Share button (square with arrow)',
              'Scroll down and tap "Add to Home Screen"',
              'Tap Add — you\'re done!',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">{i + 1}</span>
                </div>
                <p className="text-purple-300 text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={cardVariant} className="flex justify-center">
            <InstallButton size="md" variant="primary" showLabel />
          </motion.div>
        </Section>
      )}

      {/* ── SECTION 5: Footer ─────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-6 py-14 text-center border-t border-purple-900/30">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ scale: [1, 1.18, 1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={28} className="text-pink-400 fill-pink-400/60 mx-auto" />
          </motion.div>

          <p className="font-display text-xl gradient-text-warm font-semibold mb-2">
            Made with ♥ for your anniversary
          </p>
          <p className="text-purple-600 text-xs">
            Anniversary Surprise Studio &nbsp;•&nbsp; Private &amp; Secure &nbsp;•&nbsp; No data stored on servers
          </p>

          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="text-yellow-500/50 fill-yellow-500/30" />
            ))}
            <span className="text-purple-600 text-xs ml-2">Made with love</span>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
