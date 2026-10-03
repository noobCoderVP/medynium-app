import * as SecureStore from 'expo-secure-store';

export interface Tokens {
  access: string;
  refresh: string;
}

const ACCESS = 'medynium.access';
const REFRESH = 'medynium.refresh';

/** The only thing Medynium keeps on the device. No patient data is ever stored (rule M3). */
export const tokenStorage = {
  async get(): Promise<Tokens | null> {
    const [access, refresh] = await Promise.all([SecureStore.getItemAsync(ACCESS), SecureStore.getItemAsync(REFRESH)]);
    return access && refresh ? { access, refresh } : null;
  },
  async set(tokens: Tokens): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS, tokens.access),
      SecureStore.setItemAsync(REFRESH, tokens.refresh),
    ]);
  },
  async clear(): Promise<void> {
    await Promise.all([SecureStore.deleteItemAsync(ACCESS), SecureStore.deleteItemAsync(REFRESH)]);
  },
};
