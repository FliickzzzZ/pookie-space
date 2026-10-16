import React, { useState, useEffect } from 'react';
import { Sparkles, Bell, Volume2, VolumeX, Heart, ShieldCheck } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { notificationService } from '../../services/notificationService';
import { storageService } from '../../services/storageService';
import { ActiveTab } from '../../types';
import { HelloKittyFace, HelloKittyBow } from './HelloKitty';

interface TopBarProps {
  onNavigate: (tab: ActiveTab) => void;
  activeTab: ActiveTab;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigate }) => {
  const [soundOn, setSoundOn] = useState(sounds.isEnabled());
  const [notifPermission, setNotifPermission] = useState(notificationService.getPermissionStatus());
  const [profile, setProfile] = useState(() => storageService.getProfile());

  useEffect(() => {
    const handleStorage = () => {
      setNotifPermission(notificationService.getPermissionStatus());
      setProfile(storageService.getProfile());
    };
    window.addEventListener('pookie_storage_update', handleStorage);
    return () => window.removeEventListener('pookie_storage_update', handleStorage);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sounds.setEnabled(next);
    if (next) sounds.playPop();
  };

  const handleRequestNotifs = async () => {
    sounds.playPop();
    const result = await notificationService.requestPermission();
    setNotifPermission(result);
  };

  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 bg-white/75 backdrop-blur-xl border-b border-pookie-100/80 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & naimnecita status */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { sounds.playPop(); onNavigate('inicio'); }}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pookie-200 via-white to-lavender-200 flex items-center justify-center shadow-soft text-white transition-transform duration-300 group-hover:scale-105 border border-pookie-200">
              <HelloKittyFace size={34} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl sm:text-2xl text-rosewood-900 tracking-tight">
                  Pookie Space
                </span>
                <HelloKittyBow size={18} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-rosewood-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>naimnecita en línea</span>
                <Sparkles className="w-3 h-3 text-pookie-400" />
              </div>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Sonidos activados' : 'Silenciar sonidos'}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full glass-pill hover:bg-pookie-100/70 text-rosewood-700 transition flex items-center gap-1.5 text-xs font-medium"
          >
            {soundOn ? (
              <>
                <Volume2 className="w-4 h-4 text-pookie-500" />
                <span className="hidden sm:inline">Sonido</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rosewood-400" />
                <span className="hidden sm:inline text-rosewood-400">Silenciado</span>
              </>
            )}
          </button>

          {/* Notifications status button */}
          <button
            onClick={handleRequestNotifs}
            title="Estado de notificaciones en tu móvil"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              notifPermission === 'granted'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-pookie-100/80 text-pookie-700 hover:bg-pookie-200/80 border border-pookie-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {notifPermission === 'granted' ? 'Avisos activos' : 'Activar avisos'}
            </span>
          </button>

          {/* Profile Quick Pill */}
          <button
            onClick={() => { sounds.playPop(); onNavigate('perfil'); }}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-gradient-to-r from-blush-100 to-lavender-100 border border-pookie-200/70 hover:shadow-soft transition group"
          >
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs border border-pookie-200">
              <HelloKittyFace size={22} />
            </div>
            <span className="text-xs font-bold text-rosewood-800 capitalize hidden sm:inline">
              {profile.name || 'pookie'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
