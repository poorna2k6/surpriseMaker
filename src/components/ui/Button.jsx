import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Reusable Button component.
 *
 * Props:
 *   variant     – 'primary' | 'secondary' | 'ghost' | 'danger'  (default 'primary')
 *   size        – 'sm' | 'md' | 'lg'                             (default 'md')
 *   icon        – lucide-react icon component (optional)
 *   iconPosition– 'left' | 'right'                               (default 'left')
 *   loading     – boolean                                        (default false)
 *   disabled    – boolean                                        (default false)
 *   fullWidth   – boolean                                        (default false)
 *   onClick     – function
 *   className   – extra classes
 */

function Spinner({ size }) {
  const dim = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="31.4"
        strokeDashoffset="10"
        strokeLinecap="round"
        className="opacity-30"
      />
      <path
        d="M12 2 A10 10 0 0 1 22 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  ...rest
}) {
  const isDisabled = disabled || loading;

  // ── Size classes ──────────────────────────────────────────────────────────
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
    lg: 'px-6 py-3.5 text-base gap-2.5 rounded-2xl',
  };

  const iconSize = { sm: 13, md: 16, lg: 20 }[size];

  // ── Variant classes ───────────────────────────────────────────────────────
  const variantClasses = {
    primary: clsx(
      'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold',
      'hover:from-pink-500 hover:to-purple-500 glow-rose',
      'active:from-pink-700 active:to-purple-700',
      'disabled:from-pink-900/50 disabled:to-purple-900/50 disabled:glow-[none]'
    ),
    secondary: clsx(
      'glass border border-purple-500/40 text-purple-200 font-medium',
      'hover:border-purple-400/60 hover:text-purple-100 hover:bg-purple-500/10',
      'active:bg-purple-500/20',
      'disabled:border-purple-800/30 disabled:text-purple-500/50'
    ),
    ghost: clsx(
      'bg-transparent border border-purple-700/30 text-purple-300 font-medium',
      'hover:border-purple-600/50 hover:text-purple-200 hover:bg-white/5',
      'active:bg-white/10',
      'disabled:border-purple-900/30 disabled:text-purple-600/40'
    ),
    danger: clsx(
      'bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold',
      'hover:from-red-500 hover:to-rose-500',
      'active:from-red-700 active:to-rose-700',
      'disabled:from-red-900/50 disabled:to-rose-900/50'
    ),
  };

  const resolvedIcon = loading ? (
    <Spinner size={size} />
  ) : Icon ? (
    <Icon size={iconSize} aria-hidden="true" className="flex-shrink-0" />
  ) : null;

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.96 } : undefined}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center',
        'transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...rest}
    >
      {iconPosition === 'left' && resolvedIcon}
      {children}
      {iconPosition === 'right' && resolvedIcon}
    </motion.button>
  );
}

export default Button;
