import { useState } from 'react';
import { Download, Share, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import usePWAInstall from '../../hooks/usePWAInstall';
import IOSInstallModal from './IOSInstallModal';

/**
 * Compact install / add-to-home-screen button.
 *
 * Props:
 *   size    – 'sm' | 'md'   (default 'sm')
 *   variant – 'ghost' | 'primary'  (default 'ghost')
 *   showLabel – boolean  (default true)
 */
export function InstallButton({ size = 'sm', variant = 'ghost', showLabel = true }) {
  const {
    canInstall,
    isIOS,
    isInstalled,
    triggerInstall,
    showIOSInstructions,
    setShowIOSInstructions,
  } = usePWAInstall();

  const [iosModalOpen, setIosModalOpen] = useState(false);

  const handleClick = () => {
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

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
  };

  const iconSize = size === 'sm' ? 13 : 16;

  // Installed state — shown regardless of variant
  if (isInstalled) {
    return (
      <div
        className={clsx(
          'inline-flex items-center rounded-lg text-purple-400 opacity-60',
          sizeClasses[size]
        )}
      >
        <CheckCircle size={iconSize} />
        {showLabel && <span>Installed</span>}
      </div>
    );
  }

  // Nothing to show if no install path available
  if (!canInstall && !isIOS) return null;

  const label = isIOS ? 'Add to Home Screen' : 'Install App';
  const Icon = isIOS ? Share : Download;

  const variantClasses = {
    ghost: clsx(
      'inline-flex items-center rounded-lg border transition-all duration-200',
      'border-purple-700/50 text-purple-300 hover:text-purple-100 hover:border-purple-500/60 hover:bg-white/5',
      sizeClasses[size]
    ),
    primary: clsx(
      'inline-flex items-center rounded-lg font-semibold text-white transition-all duration-200',
      'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 glow-rose',
      sizeClasses[size]
    ),
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={variantClasses[variant]}
        aria-label={label}
      >
        <Icon size={iconSize} />
        {showLabel && <span>{label}</span>}
      </button>

      <IOSInstallModal
        isOpen={iosModalOpen || showIOSInstructions}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default InstallButton;
