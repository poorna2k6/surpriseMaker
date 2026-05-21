import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, X } from 'lucide-react';
import usePWAInstall from '../../hooks/usePWAInstall';
import IOSInstallModal from './IOSInstallModal';

export function InstallBanner() {
  const {
    canInstall,
    isIOS,
    isInstalled,
    triggerInstall,
    showIOSInstructions,
    setShowIOSInstructions,
  } = usePWAInstall();

  const [dismissed, setDismissed] = useState(false);
  const [iosModalOpen, setIosModalOpen] = useState(false);

  // Nothing to show
  if (isInstalled || dismissed) return null;
  if (!canInstall && !isIOS) return null;

  const handleInstall = () => {
    if (isIOS) {
      setIosModalOpen(true);
      setShowIOSInstructions(true);
    } else {
      triggerInstall();
    }
  };

  const handleCloseModal = () => {
    setIosModalOpen(false);
    setShowIOSInstructions(false);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="install-banner"
          initial={{ opacity: 0, y: -48, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -48, height: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="overflow-hidden"
        >
          <div className="mx-4 mt-4 rounded-2xl glass border border-purple-500/20 px-4 py-3 flex items-center gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              {isIOS
                ? <Share size={16} className="text-white" />
                : <Download size={16} className="text-white" />
              }
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              {isIOS ? (
                <>
                  <p className="text-purple-100 text-sm font-medium leading-tight">
                    Add to Home Screen
                  </p>
                  <p className="text-purple-400 text-xs leading-tight mt-0.5">
                    Tap Share then "Add to Home Screen"
                  </p>
                </>
              ) : (
                <>
                  <p className="text-purple-100 text-sm font-medium leading-tight">
                    Install Anniversary Studio
                  </p>
                  <p className="text-purple-400 text-xs leading-tight mt-0.5">
                    Get the full app experience
                  </p>
                </>
              )}
            </div>

            {/* Action button */}
            <button
              onClick={handleInstall}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-semibold hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
            >
              {isIOS ? 'Show me' : 'Install'}
            </button>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 w-7 h-7 rounded-full glass-light flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <IOSInstallModal
        isOpen={iosModalOpen || showIOSInstructions}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default InstallBanner;
