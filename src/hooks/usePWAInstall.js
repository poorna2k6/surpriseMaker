import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';

/**
 * Detects PWA install eligibility, platform, and exposes a trigger for
 * the native install prompt. Also surfaces iOS manual-install instructions.
 *
 * Returns:
 *   { canInstall, isInstalled, isIOS, isAndroid,
 *     triggerInstall, showIOSInstructions, setShowIOSInstructions }
 */
function usePWAInstall() {
  const pwaInstall = useStore((s) => s.pwaInstall);
  const setPwaInstall = useStore((s) => s.setPwaInstall);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSInstructions, setShowIOSInstructionsLocal] = useState(false);

  // ── Platform detection ───────────────────────────────────────────────────────
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);

  const platform = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';

  // ── Standalone mode check ────────────────────────────────────────────────────
  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true);

  // ── Effects ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Sync platform and standalone status into store once on mount
    setPwaInstall({
      isInstalled: isStandalone,
      platform,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // PWA INSTALL PROMPT: handle beforeinstallprompt here
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaInstall({ canInstall: true, deferredPrompt: e });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, [setPwaInstall]);

  useEffect(() => {
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setPwaInstall({
        isInstalled: true,
        canInstall: false,
        deferredPrompt: null,
      });
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, [setPwaInstall]);

  // ── Actions ───────────────────────────────────────────────────────────────────

  const triggerInstall = useCallback(async () => {
    if (isIOS) {
      // iOS cannot use the native prompt; show manual instructions instead
      setShowIOSInstructionsLocal(true);
      setPwaInstall({ showIOSInstructions: true });
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setPwaInstall({
        isInstalled: true,
        canInstall: false,
        deferredPrompt: null,
      });
    }

    setDeferredPrompt(null);
    setPwaInstall({ deferredPrompt: null });
  }, [deferredPrompt, isIOS, setPwaInstall]);

  const setShowIOSInstructions = useCallback(
    (value) => {
      setShowIOSInstructionsLocal(value);
      setPwaInstall({ showIOSInstructions: value });
    },
    [setPwaInstall]
  );

  return {
    canInstall: pwaInstall.canInstall || (isIOS && !isStandalone),
    isInstalled: isStandalone || pwaInstall.isInstalled,
    isIOS,
    isAndroid,
    triggerInstall,
    showIOSInstructions,
    setShowIOSInstructions,
  };
}

export default usePWAInstall;
