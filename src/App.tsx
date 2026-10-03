import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  RoutineTask, 
  PhotoRecord, 
  ScalpCheck, 
  ReminderSettings, 
  ExportDataPackage,
  DailyFoodWaterConfig,
  DailyChecklistState,
  ShelfProduct,
  HairScanResult,
  PlanDay
} from './types';
import { storage } from './services/storage';
import { 
  DEFAULT_PROFILE, 
  DEFAULT_ROUTINES, 
  DEFAULT_REMINDERS, 
  DEFAULT_FOOD_WATER_CONFIG,
  DEFAULT_DAILY_CHECKLIST_STATE,
  DEFAULT_SHELF_PRODUCTS,
  createStarterRoutine 
} from './data/defaultData';
import { generateThirtyDayPlan } from './services/planGenerator';
import { NativeService } from './services/native';
import { BottomNavBar } from './components/BottomNavBar';
import { ThirtyDayPlanScreen } from './components/ThirtyDayPlanScreen';
import { HairProfileScreen } from './components/HairProfileScreen';
import { ProductCheckerScreen } from './components/ProductCheckerScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { HairLabScreen } from './components/HairLabScreen';
import { HairScanFlowModal } from './components/HairScanFlowModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { ScalpCheckModal } from './components/ScalpCheckModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { FoodWaterSettingsModal } from './components/FoodWaterSettingsModal';
import { ExportFeedbackModal } from './components/ExportFeedbackModal';
import { ShowerCompanionModal } from './components/ShowerCompanionModal';
import { ScalpMassageTimerModal } from './components/ScalpMassageTimerModal';
import { SmartReminderModal } from './components/SmartReminderModal';
import { NotificationHud } from './components/NotificationHud';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'plan' | 'scan' | 'checker' | 'progress' | 'lab'>('plan');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [routines, setRoutines] = useState<RoutineTask[]>(DEFAULT_ROUTINES);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [scalpChecks, setScalpChecks] = useState<ScalpCheck[]>([]);
  const [shelfProducts, setShelfProducts] = useState<ShelfProduct[]>(DEFAULT_SHELF_PRODUCTS);
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [foodWaterConfig, setFoodWaterConfig] = useState<DailyFoodWaterConfig>(DEFAULT_FOOD_WATER_CONFIG);
  const [dailyChecklistState, setDailyChecklistState] = useState<DailyChecklistState>(DEFAULT_DAILY_CHECKLIST_STATE);

  // ₹10 Core Pillars State: AI Hair Scan & 30-Day Plan
  const [hairScanResult, setHairScanResult] = useState<HairScanResult | null>(null);
  const [thirtyDayPlan, setThirtyDayPlan] = useState<PlanDay[]>([]);

  // Modals state
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isScalpCheckOpen, setIsScalpCheckOpen] = useState(false);
  const [isShowerCompanionOpen, setIsShowerCompanionOpen] = useState(false);
  const [isScalpMassageOpen, setIsScalpMassageOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFoodWaterModalOpen, setIsFoodWaterModalOpen] = useState(false);
  const [isSmartReminderOpen, setIsSmartReminderOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Export Feedback Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportedDataPackage, setExportedDataPackage] = useState<ExportDataPackage | null>(null);
  const [exportedFileName, setExportedFileName] = useState('');
  const [exportedFileSize, setExportedFileSize] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load and safe migration
  useEffect(() => {
    const loadAppData = async () => {
      try {
        await storage.migrateFromLegacyStorage();

        const [p, r, ph, sc, rem, fwc, dcs, sp, hsr, tdp] = await Promise.all([
          storage.getProfile(),
          storage.getRoutines(),
          storage.getPhotos(),
          storage.getScalpChecks(),
          storage.getReminders(),
          storage.getDailyFoodWaterConfig(),
          storage.getDailyChecklistState(),
          storage.getShelfProducts(),
          storage.getHairScanResult(),
          storage.getThirtyDayPlan()
        ]);

        setProfile(p);
        setRoutines(r);
        setPhotos(ph);
        setScalpChecks(sc);
        setReminders(rem);
        setFoodWaterConfig(fwc);
        setDailyChecklistState(dcs);
        setShelfProducts(sp);
        setHairScanResult(hsr);

        // If 30-day plan already exists, load it; if not, generate baseline plan
        if (tdp && tdp.length > 0) {
          setThirtyDayPlan(tdp);
        } else {
          const baselineScan: HairScanResult = hsr || {
            frontPhotoUrl: '',
            topPhotoUrl: '',
            sidePhotoUrl: '',
            scannedAt: 'Baseline Regimen',
            hairType: (p.hairType ? p.hairType.charAt(0).toUpperCase() + p.hairType.slice(1) : 'Wavy') as any,
            texture: 'Medium',
            scalpCondition: (p.scalpType ? p.scalpType.charAt(0).toUpperCase() + p.scalpType.slice(1) : 'Oily') as any,
            frizzLevel: 'Moderate',
            flakingLevel: 'None',
            concerns: p.concerns && p.concerns.length > 0 ? p.concerns : ['thinning', 'frizz'],
            overallScore: 80
          };
          const generated = generateThirtyDayPlan(baselineScan);
          setThirtyDayPlan(generated);
          await storage.saveThirtyDayPlan(generated);
        }

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

  // AI Hair Scan Completed Handler (Core Loop: Scan -> Get My Hair Plan)
  const handleScanCompleted = async (newScan: HairScanResult) => {
    setHairScanResult(newScan);
    await storage.saveHairScanResult(newScan);

    // Generate personalized 30-day plan based on the scan
    const newPlan = generateThirtyDayPlan(newScan);
    setThirtyDayPlan(newPlan);
    await storage.saveThirtyDayPlan(newPlan);

    // Synchronize UserProfile with diagnostic data
    const updatedProfile: UserProfile = {
      ...profile,
      hairType: (newScan.hairType.toLowerCase() as any),
      scalpType: (newScan.scalpCondition.toLowerCase() as any),
      concerns: newScan.concerns,
      onboardingCompleted: true
    };
    setProfile(updatedProfile);
    await storage.saveProfile(updatedProfile);

    // Save baseline photo to journal if valid data URL
    if (newScan.frontPhotoUrl && newScan.frontPhotoUrl.startsWith('data:')) {
      const baselinePhoto: PhotoRecord = {
        id: `photo_scan_baseline_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        imageUrl: newScan.frontPhotoUrl,
        zone: 'front',
        zoneLabel: 'Day 1 Baseline (AI Scan)',
        notes: `AI Scan Baseline: ${newScan.hairType} hair, ${newScan.scalpCondition} scalp`
      };
      await storage.savePhoto(baselinePhoto);
      const updatedPhotos = await storage.getPhotos();
      setPhotos(updatedPhotos);
    }

    setIsScanModalOpen(false);
    setCurrentTab('plan');
    showToast('🎉 Hair Profile created & 30-Day Plan unlocked!');
  };

  // 30-Day Plan Habit Toggle Handler
  const handleToggleHabit = async (dayNumber: number, habitId: string) => {
    const updatedPlan = thirtyDayPlan.map((d) => {
      if (d.dayNumber === dayNumber) {
        return {
          ...d,
          habits: d.habits.map((h) => {
            if (h.id === habitId) {
              return { ...h, completed: !h.completed };
            }
            return h;
          })
        };
      }
      return d;
    });

    setThirtyDayPlan(updatedPlan);
    await storage.saveThirtyDayPlan(updatedPlan);
  };

  // Shelf Products Handler
  const handleSaveProductToShelf = async (product: ShelfProduct) => {
    const updated = [product, ...shelfProducts.filter((p) => p.id !== product.id)];
    setShelfProducts(updated);
    await storage.saveShelfProducts(updated);
    showToast(`"${product.name}" added to your Hair Shelf!`);
  };

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

  // Update Task
  const handleUpdateTask = async (updatedTask: RoutineTask) => {
    const updated = routines.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setRoutines(updated);
    await storage.saveRoutines(updated);
    showToast('Habit updated!');
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    const updated = routines.filter((t) => t.id !== taskId);
    setRoutines(updated);
    await storage.saveRoutines(updated);
    showToast('Habit removed from routine.');
  };

  // Toggle Individual Checklist Item
  const handleToggleChecklistItem = async (key: keyof DailyChecklistState) => {
    const updated = {
      ...dailyChecklistState,
      [key]: !dailyChecklistState[key]
    };
    setDailyChecklistState(updated);
    await storage.saveDailyChecklistState(updated);
  };

  // Skip section without guilt
  const handleSkipSection = async (section: 'morning' | 'afternoon' | 'night') => {
    const skipKey = `${section}Skipped` as keyof DailyChecklistState;
    const nextState = !dailyChecklistState[skipKey];
    const updated = {
      ...dailyChecklistState,
      [skipKey]: nextState
    };
    setDailyChecklistState(updated);
    await storage.saveDailyChecklistState(updated);
    if (nextState) {
      showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} skipped today (no guilt)`);
    } else {
      showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} routine resumed`);
    }
  };

  // Dismiss monthly photo for this month
  const handleDismissMonthlyPhoto = async () => {
    const currentYearMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const updated = {
      ...dailyChecklistState,
      monthlyPhotoDismissedMonth: currentYearMonth
    };
    setDailyChecklistState(updated);
    await storage.saveDailyChecklistState(updated);
    showToast('Monthly photo skipped for this month.');
  };

  // Save Food, Water & Wash Configuration
  const handleSaveFoodWaterConfig = async (newConfig: DailyFoodWaterConfig) => {
    setFoodWaterConfig(newConfig);
    await storage.saveDailyFoodWaterConfig(newConfig);
    if (newConfig.remindersEnabled) {
      await NativeService.scheduleReminders(
        true,
        newConfig.morningReminderTime,
        newConfig.nightReminderTime,
        newConfig.afternoonReminderTime,
        newConfig.washReminderTime,
        newConfig.washDays,
        newConfig.washEnabled
      );
    }
    showToast('Daily checklist settings saved!');
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

  // Onboarding Complete Handler
  const handleOnboardingComplete = async (newProfile: UserProfile, generateStarter: boolean) => {
    await handleSaveProfile(newProfile);
    setIsOnboardingOpen(false);

    // If starter routine requested and empty
    if (generateStarter && routines.length === 0) {
      const starterTasks = createStarterRoutine(
        newProfile.hairGoal,
        newProfile.hairType,
        newProfile.scalpType,
        newProfile.preferredTime
      );
      setRoutines(starterTasks);
      await storage.saveRoutines(starterTasks);
    }

    // Immediately invite user to take the 3-angle AI hair scan to get their 30-day plan
    if (!hairScanResult) {
      setIsScanModalOpen(true);
    } else {
      showToast('Welcome to HAIR OS!');
    }
  };

  // Save Reminders & Sync Alarms
  const handleSaveReminders = async (newReminders: ReminderSettings) => {
    setReminders(newReminders);
    await storage.saveReminders(newReminders);
    await NativeService.scheduleAllSmartReminders(newReminders, {
      hairType: profile.hairType,
      scalpType: profile.scalpType,
      planDayNumber: thirtyDayPlan.find(d => d.habits.some(h => !h.completed))?.dayNumber || 1,
      planDayTitle: thirtyDayPlan[0]?.title
    });
    showToast(newReminders.enabled ? 'Smart Reminders & Alarms synchronized! 🔔' : 'Reminders paused.');
  };

  // Export Data with explicit feedback dialog
  const handleExportData = async () => {
    try {
      const dataPackage = await storage.exportAllData();
      const jsonStr = JSON.stringify(dataPackage, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `HairOS_Backup_${dateStr}.json`;

      // Trigger standard browser/WebView download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      // Open Feedback Dialog with persistence notice and share options
      setExportedDataPackage(dataPackage);
      setExportedFileName(fileName);
      setExportedFileSize(blob.size);
      setIsExportModalOpen(true);
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
      const [p, r, ph, sc, rem, fwc, dcs, sp, hsr, tdp] = await Promise.all([
        storage.getProfile(),
        storage.getRoutines(),
        storage.getPhotos(),
        storage.getScalpChecks(),
        storage.getReminders(),
        storage.getDailyFoodWaterConfig(),
        storage.getDailyChecklistState(),
        storage.getShelfProducts(),
        storage.getHairScanResult(),
        storage.getThirtyDayPlan()
      ]);
      setProfile(p);
      setRoutines(r);
      setPhotos(ph);
      setScalpChecks(sc);
      setReminders(rem);
      setFoodWaterConfig(fwc);
      setDailyChecklistState(dcs);
      setShelfProducts(sp);
      setHairScanResult(hsr);
      setThirtyDayPlan(tdp || []);
      showToast('Data imported successfully!');
    } catch (err: any) {
      showToast(`Import failed: ${err.message}`);
    }
  };

  // Save Shelf Products
  const handleSaveShelfProducts = async (products: ShelfProduct[]) => {
    setShelfProducts(products);
    await storage.saveShelfProducts(products);
  };

  // Clear All Data
  const handleClearAllData = async () => {
    await storage.clearAllData();
    setProfile(DEFAULT_PROFILE);
    setRoutines(DEFAULT_ROUTINES);
    setPhotos([]);
    setScalpChecks([]);
    setShelfProducts(DEFAULT_SHELF_PRODUCTS);
    setReminders(DEFAULT_REMINDERS);
    setFoodWaterConfig(DEFAULT_FOOD_WATER_CONFIG);
    setDailyChecklistState(DEFAULT_DAILY_CHECKLIST_STATE);
    setHairScanResult(null);
    setThirtyDayPlan([]);
    setIsOnboardingOpen(true);
    showToast('All local data cleared from this device.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950 font-sans antialiased">
      {/* Dynamic In-App Notification HUD Banner */}
      <NotificationHud />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs shadow-2xl shadow-teal-500/30 transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* 5 CORE PILLAR SCREENS */}
      {currentTab === 'plan' && (
        <ThirtyDayPlanScreen
          plan={thirtyDayPlan}
          scanResult={hairScanResult}
          onToggleHabit={handleToggleHabit}
          onOpenScanModal={() => setIsScanModalOpen(true)}
          onOpenPhotoCapture={() => setIsCaptureOpen(true)}
          onOpenProductChecker={() => setCurrentTab('checker')}
          onOpenReminders={() => setIsSmartReminderOpen(true)}
        />
      )}

      {currentTab === 'scan' && (
        <HairProfileScreen
          scanResult={hairScanResult}
          onOpenScanModal={() => setIsScanModalOpen(true)}
          onNavigateToPlan={() => setCurrentTab('plan')}
          onNavigateToChecker={() => setCurrentTab('checker')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenReminders={() => setIsSmartReminderOpen(true)}
        />
      )}

      {currentTab === 'checker' && (
        <ProductCheckerScreen
          scanResult={hairScanResult}
          onSaveToShelf={handleSaveProductToShelf}
          onOpenScanModal={() => setIsScanModalOpen(true)}
        />
      )}

      {currentTab === 'progress' && (
        <ProgressScreen
          photos={photos}
          onOpenCapture={() => setIsCaptureOpen(true)}
          onDeletePhoto={handleDeletePhoto}
          onExportData={handleExportData}
        />
      )}

      {currentTab === 'lab' && (
        <HairLabScreen 
          profile={profile} 
          shelfProducts={shelfProducts}
          onSaveShelfProducts={handleSaveShelfProducts}
          scalpChecks={scalpChecks}
          onOpenShowerCompanion={() => setIsShowerCompanionOpen(true)}
          onOpenScalpMassage={() => setIsScalpMassageOpen(true)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavBar currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab as any)} />

      {/* Modals */}
      <HairScanFlowModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanCompleted={handleScanCompleted}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
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
          onOpenFoodWaterSettings={() => setIsFoodWaterModalOpen(true)}
          onOpenSmartReminders={() => setIsSmartReminderOpen(true)}
        />
      )}

      <FoodWaterSettingsModal
        isOpen={isFoodWaterModalOpen}
        onClose={() => setIsFoodWaterModalOpen(false)}
        config={foodWaterConfig}
        onSaveConfig={handleSaveFoodWaterConfig}
      />

      <ExportFeedbackModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName={exportedFileName}
        dataPackage={exportedDataPackage}
        fileSizeBytes={exportedFileSize}
      />

      <ShowerCompanionModal
        isOpen={isShowerCompanionOpen}
        onClose={() => setIsShowerCompanionOpen(false)}
        onCompleteWash={async () => {
          const updated = { ...dailyChecklistState, morningWashDone: true };
          setDailyChecklistState(updated);
          await storage.saveDailyChecklistState(updated);
          showToast('Wash day completed and logged!');
        }}
      />

      <ScalpMassageTimerModal
        isOpen={isScalpMassageOpen}
        onClose={() => setIsScalpMassageOpen(false)}
        onComplete={async () => {
          showToast('4-minute scalp micro-circulation session completed!');
        }}
      />

      <SmartReminderModal
        isOpen={isSmartReminderOpen}
        onClose={() => setIsSmartReminderOpen(false)}
        reminders={reminders}
        profile={profile}
        currentPlanDay={thirtyDayPlan.find(d => d.habits.some(h => !h.completed)) || thirtyDayPlan[0]}
        onSaveReminders={handleSaveReminders}
      />
    </div>
  );
};
