import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_USERNAME, DEFAULT_PASSWORD } from '../constants/config';

// Auth Account type
export interface AuthAccount {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

// Job type
export interface Job {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  problemDescription: string;
  deviceType: string;
  acBrand: string;
  acHP: string;
  acType: string;
  gasType: string;
  assignedStaff: string[];
  status: 'Done' | 'Pending';
  date: string;
  cost: string;
  photos: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Staff type
export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  address: string;
  position: string;
  photo: string;
  notes: string;
  createdAt: string;
}

// Sale type
export interface Sale {
  id: string;
  itemName: string;
  category: string;
  brand: string;
  hp: string;
  type: string;
  quantity: string;
  price: string;
  date: string;
  notes: string;
  createdAt: string;
}

// Purchase type
export interface Purchase {
  id: string;
  itemName: string;
  category: string;
  quantity: string;
  price: string;
  supplier: string;
  date: string;
  notes: string;
  createdAt: string;
}

// Settings type
export interface AppSettings {
  language: 'en' | 'my';
  theme: 'light' | 'dark';
}

// ─────────── Auth ───────────
export const getAccounts = async (): Promise<AuthAccount[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_ACCOUNTS);
    if (raw) return JSON.parse(raw);
    // Initialize with default
    const defaultAccount: AuthAccount = {
      id: '1',
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_ACCOUNTS, JSON.stringify([defaultAccount]));
    return [defaultAccount];
  } catch { return []; }
};

export const saveAccounts = async (accounts: AuthAccount[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_ACCOUNTS, JSON.stringify(accounts));
};

export const getCurrentUser = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = async (username: string | null): Promise<void> => {
  if (username) {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// ─────────── Jobs ───────────
export const getJobs = async (): Promise<Job[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.JOBS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveJobs = async (jobs: Job[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

// ─────────── Staff ───────────
export const getStaff = async (): Promise<StaffMember[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.STAFF);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveStaff = async (staff: StaffMember[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
};

// ─────────── Sales ───────────
export const getSales = async (): Promise<Sale[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SALES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveSales = async (sales: Sale[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
};

// ─────────── Purchases ───────────
export const getPurchases = async (): Promise<Purchase[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PURCHASES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const savePurchases = async (purchases: Purchase[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
};

// ─────────── Settings ───────────
export const getSettings = async (): Promise<AppSettings> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : { language: 'en', theme: 'light' };
  } catch { return { language: 'en', theme: 'light' }; }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// ─────────── Helpers ───────────
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
