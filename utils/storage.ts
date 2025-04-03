import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = 'swizil_';

/**
 * Stores a value in AsyncStorage under a specified key.
 *
 * @template T - The type of the value to be stored.
 * @param {string} key - The key under which the value will be stored.
 * @param {T} value - The value to be stored. It will be serialized to JSON.
 * @returns {Promise<void>} A promise that resolves when the data is successfully stored.
 * @throws {Error} If an error occurs during the storage process, it will be logged and rethrown.
 */
export const storeData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, jsonValue);
  } catch (error) {
    console.error(`Error storing data for key: ${key}`, error);
    throw error;
  }
};

/**
 * Retrieves data from AsyncStorage for the given key.
 *
 * @template T - The expected type of the data to be retrieved.
 * @param {string} key - The key associated with the data to retrieve.
 * @returns {Promise<T | null>} A promise that resolves to the parsed data of type `T` if found, 
 * or `null` if no data is associated with the key.
 * @throws Will throw an error if there is an issue retrieving or parsing the data.
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) as T : null;
  } catch (error) {
    console.error(`Error retrieving data for key: ${key}`, error);
    throw error;
  }
};

/**
 * Removes a stored item from AsyncStorage based on the provided key.
 *
 * @param key - The key of the item to be removed. This key will be prefixed with `STORAGE_KEY_PREFIX`.
 * @returns A promise that resolves when the item is successfully removed.
 * @throws Will throw an error if the removal operation fails.
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  } catch (error) {
    console.error(`Error removing data for key: ${key}`, error);
    throw error;
  }
};

/**
 * Clears all application-specific data stored in AsyncStorage.
 *
 * This function retrieves all keys from AsyncStorage, filters them to include
 * only those that start with the application-specific prefix (`STORAGE_KEY_PREFIX`),
 * and then removes the corresponding entries.
 *
 * @throws Will throw an error if there is an issue retrieving keys or removing data.
 */
export const clearAllData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Error clearing all data', error);
    throw error;
  }
};