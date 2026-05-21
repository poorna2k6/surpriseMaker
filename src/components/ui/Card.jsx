import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Reusable Card component with glass morphism.
 *
 * Props:
 *   children  – content
 *   className – extra classes
 *   onClick   – optional click handler
 *   hover     – boolean: scale + glow on hover via framer-motion (default false)
 *   glow      – boolean: persistent violet glow shadow             (default false)
 *   padding   – 'none' | 'sm' | 'md' | 'lg'                      (default 'md')
 */

const paddingClasses = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
};

export function Card({
  children,
  className,
  onClick,
  hover = false,
  glow = false,
  padding = 'md',
}) {
  const isInteractive = !!onClick || hover;

  const base = clsx(
    'glass rounded-2xl',
    paddingClasses[padding],
    glow && 'glow-violet',
    isInteractive && 'cursor-pointer',
    className
  );

  if (hover) {
    return (
      <motion.div
        onClick={onClick}
        className={base}
        whileHover={{
          scale: 1.02,
          boxShadow:
            '0 0 28px rgba(168, 85, 247, 0.35), 0 0 56px rgba(168, 85, 247, 0.15)',
        }}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={base}>
      {children}
    </div>
  );
}

export default Card;
