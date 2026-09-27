import AsyncStorage from '@react-native-async-storage/async-storage';

// Every other service goes through these two functions instead of calling
// AsyncStorage directly — keeps JSON parsing/error handling in one spot.

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.error(`storageService: failed to read ${key}`, err);
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`storageService: failed to write ${key}`, err);
    return false;
  }
}

export async function clearAll(keys: string[]): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (err) {
    console.error('storageService: failed to clear storage', err);
    return false;
  }
}
