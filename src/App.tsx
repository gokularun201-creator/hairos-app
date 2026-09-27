import React, { useState, useEffect } from 'react';
import { UserProfile, RoutineTask, PhotoRecord, ScalpCheck, ReminderSettings } from './types';
import { storage } from './services/storage';
import { DEFAULT_PROFILE, DEFAULT_ROUTINES, DEFAULT_REMINDERS } from './data/defaultData';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { RoutineScreen } from './components/RoutineScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { EducationalGuideScreen } from './components/EducationalGuideScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { ScalpCheckModal } from './components/ScalpCheckModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'routine' | 'journal' | 'guide'>('home');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [routines, setRoutines] = useState<RoutineTask[]>(DEFAULT_ROUTINES);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [scalpChecks, setScalpChecks] = useState<ScalpCheck[]>([]);
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isScalpCheckOpen, setIsScalpCheckOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load and safe migration
  useEffect(() => {
    const loadAppData = async () => {
      try {
        await storage.migrateFromLegacyStorage();

        const [p, r, ph, sc, rem] = await Promise.all([
          storage.getProfile(),
          storage.getRoutines(),
          storage.getPhotos(),
          storage.getScalpChecks(),
          storage.getReminders()
        ]);

        setProfile(p);
        setRoutines(r);
        setPhotos(ph);
        setScalpChecks(sc);
        setReminders(rem);
        setIsLoaded(true);

        if (!p.onboardingCompleted) {
          setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.error('[HairOS App] Error loading app state:', err);
      }
    };

    loadAppData();
  }, []);

  // Task Toggle
  const handleToggleTask = async (taskId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = routines.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        return {
          ...t,
          completed: nextState,
          lastCompletedDate: nextState ? today : null
        };
      }
      return t;
    });
    setRoutines(updated);
    await storage.saveRoutines(updated);
  };

  // Add Task
  const handleAddTask = async (newTask: RoutineTask) => {
    const updated = [...routines, newTask];
    setRoutines(updated);
    await storage.saveRoutines(updated);
    showToast('New habit added to routine!');
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    const updated = routines.filter((t) => t.id !== taskId);
    setRoutines(updated);
    await storage.saveRoutines(updated);
    showToast('Habit removed from routine.');
  };

  // Save Photo
  const handleSavePhoto = async (photo: PhotoRecord) => {
    await storage.savePhoto(photo);
    const updatedPhotos = await storage.getPhotos();
    setPhotos(updatedPhotos);
    showToast('Photo saved to your private journal!');
  };

  // Delete Photo
  const handleDeletePhoto = async (photoId: string) => {
    await storage.deletePhoto(photoId);
    const updatedPhotos = await storage.getPhotos();
    setPhotos(updatedPhotos);
    showToast('Photo deleted from journal.');
  };

  // Save Scalp Check
  const handleSaveScalpCheck = async (check: ScalpCheck) => {
    await storage.saveScalpCheck(check);
    const updatedChecks = await storage.getScalpChecks();
    setScalpChecks(updatedChecks);
    showToast('Scalp check recorded!');
  };

  // Save Profile
  const handleSaveProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await storage.saveProfile(newProfile);
  };

  // Save Reminders
  const handleSaveReminders = async (newReminders: ReminderSettings) => {
    setReminders(newReminders);
    await storage.saveReminders(newReminders);
  };

  // Export Data
  const handleExportData = async () => {
    try {
      const dataPackage = await storage.exportAllData();
      const jsonStr = JSON.stringify(dataPackage, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().split('T')[0];
      const a = document.createElement('a');
      a.href = url;
      a.download = `HairOS_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Export file downloaded to your device!');
    } catch (err: any) {
      showToast(`Export error: ${err.message}`);
    }
  };

  // Import Data
  const handleImportData = async (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      await storage.importData(parsed);

      // Refresh state
      const [p, r, ph, sc, rem] = await Promise.all([
        storage.getProfile(),
        storage.getRoutines(),
        storage.getPhotos(),
        storage.getScalpChecks(),
        storage.getReminders()
      ]);
      setProfile(p);
      setRoutines(r);
      setPhotos(ph);
      setScalpChecks(sc);
      setReminders(rem);
      showToast('Data imported successfully!');
    } catch (err: any) {
      showToast(`Import failed: ${err.message}`);
    }
  };

  // Clear All Data
  const handleClearAllData = async () => {
    await storage.clearAllData();
    setProfile(DEFAULT_PROFILE);
    setRoutines(DEFAULT_ROUTINES);
    setPhotos([]);
    setScalpChecks([]);
    setReminders(DEFAULT_REMINDERS);
    setIsOnboardingOpen(true);
    showToast('All local data cleared from this device.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs shadow-2xl shadow-teal-500/30 transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Screens */}
      {currentTab === 'home' && (
        <HomeScreen
          profile={profile}
          routines={routines}
          photos={photos}
          scalpChecks={scalpChecks}
          onToggleTask={handleToggleTask}
          onOpenRoutineTab={() => setCurrentTab('routine')}
          onOpenJournalTab={() => setCurrentTab('journal')}
          onOpenCapture={() => setIsCaptureOpen(true)}
          onOpenScalpCheck={() => setIsScalpCheckOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenGuide={() => setCurrentTab('guide')}
        />
      )}

      {currentTab === 'routine' && (
        <RoutineScreen
          routines={routines}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onOpenReminders={() => setIsSettingsOpen(true)}
        />
      )}

      {currentTab === 'journal' && (
        <ProgressScreen
          photos={photos}
          onOpenCapture={() => setIsCaptureOpen(true)}
          onDeletePhoto={handleDeletePhoto}
          onExportData={handleExportData}
        />
      )}

      {currentTab === 'guide' && <EducationalGuideScreen />}

      {/* Bottom Navigation */}
      <BottomNavBar currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab as any)} />

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(newProfile) => {
          handleSaveProfile(newProfile);
          setIsOnboardingOpen(false);
          showToast(`Welcome to HAIR OS!`);
        }}
      />

      <PhotoCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onSavePhoto={handleSavePhoto}
      />

      <ScalpCheckModal
        isOpen={isScalpCheckOpen}
        onClose={() => setIsScalpCheckOpen(false)}
        onSaveScalpCheck={handleSaveScalpCheck}
      />

      {isSettingsOpen && isLoaded && (
        <ProfileSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={profile}
          reminders={reminders}
          onSaveProfile={handleSaveProfile}
          onSaveReminders={handleSaveReminders}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onClearAllData={handleClearAllData}
        />
      )}
    </div>
  );
};
