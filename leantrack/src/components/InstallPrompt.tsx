import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if running on iOS and NOT already in standalone mode
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    const dismissed = localStorage.getItem('leantrack_install_dismissed');

    if (isIos && !isStandalone && !dismissed) {
      setShowPrompt(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('leantrack_install_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 bg-[#171A1F] border border-[#FF7A2F]/40 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs font-bold text-[#FF7A2F] uppercase tracking-wider">
          Install LeanTrack on iPhone
        </h4>
        <button onClick={dismiss} className="text-[#687383] hover:text-[#F6F7F9] p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-[#A5ADB8] leading-relaxed mb-3">
        For the standalone iPhone experience with bottom safe areas and offline support:
      </p>

      <div className="space-y-1.5 text-xs text-[#F6F7F9] bg-[#22262C] p-3 rounded-xl border border-[#343A43]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#FF7A2F]">1.</span>
          <span>Tap the <Share className="w-3.5 h-3.5 inline text-[#347FEF] mx-0.5" /> <b>Share</b> button in Safari toolbar.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#FF7A2F]">2.</span>
          <span>Scroll down and select <PlusSquare className="w-3.5 h-3.5 inline text-[#F6F7F9] mx-0.5" /> <b>Add to Home Screen</b>.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#FF7A2F]">3.</span>
          <span>Tap <b>Add</b> in top right to launch as an app icon.</span>
        </div>
      </div>
    </div>
  );
}
