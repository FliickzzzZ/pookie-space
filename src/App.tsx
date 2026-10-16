import React, { useState, useEffect } from 'react';
import { SplashWelcome } from './components/common/SplashWelcome';
import { TopBar } from './components/common/TopBar';
import { Navbar } from './components/common/Navbar';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { HomeView } from './components/home/HomeView';
import { ChatView } from './components/chat/ChatView';
import { PersonalShopperView } from './components/shopper/PersonalShopperView';
import { CalendarView } from './components/calendar/CalendarView';
import { WishlistView } from './components/wishlist/WishlistView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { ActiveTab, UserTasteProfile } from './types';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { HelloKittyCornerSticker } from './components/common/HelloKitty';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(!storageService.hasSeenWelcome());
  const [profile, setProfile] = useState<UserTasteProfile>(storageService.getProfile());
  const [isOnboarding, setIsOnboarding] = useState(!storageService.getProfile().completedOnboarding);
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  useEffect(() => {
    // Initialize service worker and notification listeners
    notificationService.init();

    const handleStorageUpdate = () => {
      setProfile(storageService.getProfile());
    };
    window.addEventListener('pookie_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('pookie_storage_update', handleStorageUpdate);
  }, []);

  const handleDismissSplash = () => {
    storageService.setSeenWelcome();
    setShowSplash(false);
  };

  const handleFinishOnboarding = () => {
    setIsOnboarding(false);
    setProfile(storageService.getProfile());
    setActiveTab('inicio');
  };

  const handleAskNaimnecita = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setActiveTab('chat');
  };

  const handleEditTastes = () => {
    setIsOnboarding(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blush-50 via-pearl-50 to-lavender-50 text-rosewood-900 selection:bg-pookie-200 selection:text-pookie-900">
      {/* 1. Welcome Splash Screen */}
      {showSplash && <SplashWelcome onDismiss={handleDismissSplash} />}

      {/* 2. Onboarding Wizard if not completed or editing */}
      {isOnboarding ? (
        <OnboardingWizard onComplete={handleFinishOnboarding} initialProfile={profile} />
      ) : (
        <>
          {/* Top Bar Header */}
          <TopBar activeTab={activeTab} onNavigate={(tab) => setActiveTab(tab)} />

          {/* Main Layout Area */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            {/* Desktop Navigation Sidebar & Mobile Bottom Dock */}
            <Navbar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

            {/* Main Content Area */}
            <main className="flex-1 px-4 sm:px-8 py-6 max-w-full overflow-x-hidden min-h-[calc(100vh-70px)] pb-24 md:pb-12">
              {activeTab === 'inicio' && (
                <HomeView
                  onNavigate={(tab) => setActiveTab(tab)}
                  onAskNaimnecita={handleAskNaimnecita}
                />
              )}

              {activeTab === 'chat' && (
                <ChatView
                  initialPrompt={chatInitialPrompt}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'shopper' && <PersonalShopperView />}

              {activeTab === 'calendario' && <CalendarView />}

              {activeTab === 'wishlist' && <WishlistView />}

              {activeTab === 'perfil' && (
                <ProfileView onEditTastes={handleEditTastes} />
              )}

              {activeTab === 'configuracion' && <SettingsView />}
            </main>
          </div>
        </>
      )}

      {/* Floating Hello Kitty Corner Mascot */}
      <HelloKittyCornerSticker />
    </div>
  );
};

export default App;
