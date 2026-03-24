import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  getSettings, saveSettings, AppSettings,
  getAccounts, saveAccounts, AuthAccount,
  getCurrentUser, setCurrentUser,
  getJobs, saveJobs, Job,
  getStaff, saveStaff, StaffMember,
  getSales, saveSales, Sale,
  getPurchases, savePurchases, Purchase,
  generateId,
} from '../services/storage';
import { DEFAULT_USERNAME, DEFAULT_PASSWORD } from '../constants/config';

interface AppContextType {
  // Settings
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => Promise<void>;

  // Auth
  isLoggedIn: boolean;
  currentUser: string | null;
  accounts: AuthAccount[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addAccount: (username: string, password: string) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<void>;
  updateAccount: (id: string, username: string, password: string) => Promise<boolean>;
  resetToDefault: () => Promise<void>;

  // Jobs
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;

  // Staff
  staff: StaffMember[];
  addStaff: (s: Omit<StaffMember, 'id' | 'createdAt'>) => Promise<void>;
  updateStaff: (id: string, s: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;

  // Sales
  sales: Sale[];
  addSale: (s: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  updateSale: (id: string, s: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;

  // Purchases
  purchases: Purchase[];
  addPurchase: (p: Omit<Purchase, 'id' | 'createdAt'>) => Promise<void>;
  updatePurchase: (id: string, p: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;

  // Network
  isOnline: boolean;
  lastSync: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({ language: 'en', theme: 'light' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUserState] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AuthAccount[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [s, accs, user, j, st, sa, pu] = await Promise.all([
        getSettings(), getAccounts(), getCurrentUser(),
        getJobs(), getStaff(), getSales(), getPurchases(),
      ]);
      setSettings(s);
      setAccounts(accs);
      setJobs(j);
      setStaff(st);
      setSales(sa);
      setPurchases(pu);
      if (user) {
        setCurrentUserState(user);
        setIsLoggedIn(true);
      }
      setInitialized(true);
    };
    init();

    const unsub = NetInfo.addEventListener(state => {
      setIsOnline(!!state.isConnected);
      if (state.isConnected) setLastSync(new Date().toISOString());
    });
    return () => unsub();
  }, []);

  if (!initialized) return null;

  // Settings
  const updateSettings = async (s: Partial<AppSettings>) => {
    const next = { ...settings, ...s };
    setSettings(next);
    await saveSettings(next);
  };

  // Auth
  const login = async (username: string, password: string): Promise<boolean> => {
    const accs = await getAccounts();
    const match = accs.find(a => a.username === username && a.password === password);
    if (match) {
      setCurrentUserState(username);
      setIsLoggedIn(true);
      await setCurrentUser(username);
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setCurrentUserState(null);
    await setCurrentUser(null);
  };

  const addAccount = async (username: string, password: string): Promise<boolean> => {
    const accs = await getAccounts();
    if (accs.find(a => a.username === username)) return false;
    const newAcc: AuthAccount = { id: generateId(), username, password, createdAt: new Date().toISOString() };
    const updated = [...accs, newAcc];
    setAccounts(updated);
    await saveAccounts(updated);
    return true;
  };

  const deleteAccount = async (id: string) => {
    const accs = await getAccounts();
    const updated = accs.filter(a => a.id !== id);
    setAccounts(updated);
    await saveAccounts(updated);
  };

  const updateAccount = async (id: string, username: string, password: string): Promise<boolean> => {
    const accs = await getAccounts();
    const clash = accs.find(a => a.username === username && a.id !== id);
    if (clash) return false;
    const updated = accs.map(a => a.id === id ? { ...a, username, password } : a);
    setAccounts(updated);
    await saveAccounts(updated);
    return true;
  };

  const resetToDefault = async () => {
    const accs = await getAccounts();
    const updated = accs.map(a => a.id === '1' ? { ...a, username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD } : a);
    if (!updated.find(a => a.id === '1')) {
      updated.unshift({ id: '1', username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD, createdAt: new Date().toISOString() });
    }
    setAccounts(updated);
    await saveAccounts(updated);
  };

  // Jobs
  const addJob = async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: Job = { ...job, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    await saveJobs(updated);
  };
  const updateJob = async (id: string, job: Partial<Job>) => {
    const updated = jobs.map(j => j.id === id ? { ...j, ...job, updatedAt: new Date().toISOString() } : j);
    setJobs(updated);
    await saveJobs(updated);
  };
  const deleteJob = async (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    await saveJobs(updated);
  };

  // Staff
  const addStaff = async (s: Omit<StaffMember, 'id' | 'createdAt'>) => {
    const newS: StaffMember = { ...s, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [newS, ...staff];
    setStaff(updated);
    await saveStaff(updated);
  };
  const updateStaff = async (id: string, s: Partial<StaffMember>) => {
    const updated = staff.map(m => m.id === id ? { ...m, ...s } : m);
    setStaff(updated);
    await saveStaff(updated);
  };
  const deleteStaff = async (id: string) => {
    const updated = staff.filter(m => m.id !== id);
    setStaff(updated);
    await saveStaff(updated);
  };

  // Sales
  const addSale = async (s: Omit<Sale, 'id' | 'createdAt'>) => {
    const newS: Sale = { ...s, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [newS, ...sales];
    setSales(updated);
    await saveSales(updated);
  };
  const updateSale = async (id: string, s: Partial<Sale>) => {
    const updated = sales.map(m => m.id === id ? { ...m, ...s } : m);
    setSales(updated);
    await saveSales(updated);
  };
  const deleteSale = async (id: string) => {
    const updated = sales.filter(m => m.id !== id);
    setSales(updated);
    await saveSales(updated);
  };

  // Purchases
  const addPurchase = async (p: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newP: Purchase = { ...p, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [newP, ...purchases];
    setPurchases(updated);
    await savePurchases(updated);
  };
  const updatePurchase = async (id: string, p: Partial<Purchase>) => {
    const updated = purchases.map(m => m.id === id ? { ...m, ...p } : m);
    setPurchases(updated);
    await savePurchases(updated);
  };
  const deletePurchase = async (id: string) => {
    const updated = purchases.filter(m => m.id !== id);
    setPurchases(updated);
    await savePurchases(updated);
  };

  return (
    <AppContext.Provider value={{
      settings, updateSettings,
      isLoggedIn, currentUser, accounts, login, logout, addAccount, deleteAccount, updateAccount, resetToDefault,
      jobs, addJob, updateJob, deleteJob,
      staff, addStaff, updateStaff, deleteStaff,
      sales, addSale, updateSale, deleteSale,
      purchases, addPurchase, updatePurchase, deletePurchase,
      isOnline, lastSync,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
