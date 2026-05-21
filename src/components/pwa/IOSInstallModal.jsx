import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, Plus } from 'lucide-react';
import clsx from 'clsx';

const STEPS = [
  {
    number: 1,
    icon: '🧭',
    title: 'Open in Safari',
    description: 'Make sure you are using Safari — other browsers cannot install PWAs on iOS.',
  },
  {
    number: 2,
    icon: '⬆️',
    title: 'Tap the Share button',
    description: 'Tap the Share icon (square with an arrow) at the bottom of your screen.',
  },
  {
    number: 3,
    icon: '📲',
    title: 'Tap "Add to Home Screen"',
    description: 'Scroll down in the Share sheet and tap "Add to Home Screen".',
  },
  {
    number: 4,
    icon: '✅',
    title: 'Tap "Add"',
    description: 'Tap "Add" in the top-right corner of the dialog to install.',
  },
];

export function IOSInstallModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ios-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="ios-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass rounded-3xl w-full max-w-sm overflow-hidden glow-violet">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-purple-900/40">
                {/* Phone mockup decoration */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {/* Phone outline */}
                    <div
                      className="w-20 h-32 rounded-2xl border-2 border-purple-500/50 flex flex-col items-center justify-end pb-2 overflow-hidden"
                      style={{ background: 'rgba(45, 27, 78, 0.8)' }}
                    >
                      {/* Screen content */}
                      <div className="absolute top-2 left-2 right-2 h-3 rounded-sm bg-gradient-to-r from-pink-500/40 to-purple-500/40" />
                      <div className="absolute top-7 left-2 right-2 h-2 rounded-sm bg-purple-700/40" />
                      <div className="absolute top-11 left-2 right-2 h-2 rounded-sm bg-purple-700/30" />
                      {/* Share sheet teaser */}
                      <div className="w-full bg-purple-900/80 rounded-t-lg py-1 px-1">
                        <div className="flex justify-around">
                          {[Share, Plus].map((Icon, i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -2, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.3,
                              }}
                              className="w-5 h-5 rounded-md bg-purple-700/70 flex items-center justify-center"
                            >
                              <Icon size={9} className="text-pink-300" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Glow under phone */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-purple-500/20 blur-sm rounded-full" />
                  </div>
                </div>

                <h2 className="font-display text-2xl text-center gradient-text font-semibold leading-tight">
                  Add to Your Home Screen
                </h2>
                <p className="text-purple-300 text-sm text-center mt-1">
                  Install Anniversary Studio like an app
                </p>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full glass-light flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Steps */}
              <div className="px-6 py-5 space-y-4">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    {/* Step number bubble */}
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base leading-none">{step.icon}</span>
                        <p className="text-purple-100 text-sm font-medium">
                          {step.title}
                        </p>
                      </div>
                      <p className="text-purple-400 text-xs mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold hover:from-pink-500 hover:to-purple-500 transition-all duration-200 glow-rose"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default IOSInstallModal;
