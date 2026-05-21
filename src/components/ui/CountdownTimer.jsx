import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import useCountdown from '../../hooks/useCountdown';
import useStore from '../../store/useStore';

/**
 * Beautiful countdown timer component.
 *
 * Props:
 *   targetDate – Date object to count down to
 *   compact    – boolean: single-line mode (default false)
 */

// Animated number box — cross-fades the digit on every change
function CountUnit({ value, label }) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16 glass rounded-2xl flex items-center justify-center overflow-hidden glow-violet">
        {/* Subtle top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="font-display text-2xl font-semibold gradient-text leading-none select-none tabular-nums"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-[10px] font-medium text-purple-400 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
  );
}

// Colon separator between time units
function Separator() {
  return (
    <div className="flex flex-col gap-1.5 pb-5 self-center">
      <div className="w-1 h-1 rounded-full bg-purple-500/50" />
      <div className="w-1 h-1 rounded-full bg-purple-500/50" />
    </div>
  );
}

export function CountdownTimer({ targetDate, compact = false }) {
  const { days, hours, minutes, seconds, isToday, isPast } =
    useCountdown(targetDate);

  const yearsTogether = useStore((s) => s.userProfile.yearsTogether);

  // ── Compact (single-line) mode ─────────────────────────────────────────────
  if (compact) {
    if (!targetDate) {
      return (
        <span className="text-purple-400 text-sm">
          No anniversary date set
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="gradient-text-warm text-sm font-semibold">
          Happy Anniversary! Today is the day! 🎉
        </span>
      );
    }
    if (isPast) {
      return (
        <span className="text-purple-300 text-sm">
          {yearsTogether > 0
            ? `${yearsTogether} beautiful ${yearsTogether === 1 ? 'year' : 'years'} of love`
            : 'Looking forward to your next anniversary'}
        </span>
      );
    }
    return (
      <span className="text-purple-200 text-sm">
        <span className="gradient-text font-semibold">{days}</span>{' '}
        {days === 1 ? 'day' : 'days'} until your anniversary
      </span>
    );
  }

  // ── Full mode: no date ─────────────────────────────────────────────────────
  if (!targetDate) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-purple-400 text-sm">
          Set your anniversary date to start the countdown
        </p>
      </div>
    );
  }

  // ── Full mode: today is the anniversary ───────────────────────────────────
  if (isToday) {
    return (
      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.18, 1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl select-none"
          aria-hidden="true"
        >
          💖
        </motion.div>

        <div className="text-center space-y-1">
          <h3 className="font-display text-3xl gradient-text-warm font-semibold leading-tight">
            Happy Anniversary!
          </h3>
          <p className="text-purple-300 text-sm">
            Today is your special day 🎉
          </p>
        </div>

        {/* Floating decorations */}
        <div className="flex gap-3">
          {['💕', '✨', '💕', '✨', '💕'].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-lg select-none"
              aria-hidden="true"
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.22,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  // ── Full mode: anniversary has passed ─────────────────────────────────────
  if (isPast) {
    return (
      <div className="glass rounded-2xl p-7 flex flex-col items-center gap-3 text-center">
        <span
          className="text-4xl select-none animate-float"
          aria-hidden="true"
        >
          💑
        </span>
        <div>
          <p className="font-display text-2xl gradient-text font-semibold leading-tight">
            {yearsTogether > 0
              ? `${yearsTogether} beautiful ${yearsTogether === 1 ? 'year' : 'years'} of love`
              : 'A lifetime of love'}
          </p>
          <p className="text-purple-400 text-sm mt-1">
            Looking forward to your next anniversary
          </p>
        </div>
      </div>
    );
  }

  // ── Full mode: counting down ───────────────────────────────────────────────
  return (
    <div className="glass rounded-2xl p-6 flex flex-col items-center gap-5">
      {/* Eyebrow label */}
      <p className="text-purple-400 text-[10px] font-medium uppercase tracking-widest">
        Countdown to your anniversary
      </p>

      {/* Time units */}
      <div className="flex items-end gap-2">
        <CountUnit value={days}    label="Days"    />
        <Separator />
        <CountUnit value={hours}   label="Hours"   />
        <Separator />
        <CountUnit value={minutes} label="Minutes" />
        <Separator />
        <CountUnit value={seconds} label="Seconds" />
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-pink-400"
        />
        <span className="text-purple-500 text-[10px] uppercase tracking-widest font-medium">
          Live
        </span>
      </div>
    </div>
  );
}

export default CountdownTimer;
