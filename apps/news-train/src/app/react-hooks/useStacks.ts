import { AppConfig, UserSession } from '@stacks/connect';
import { Storage, StorageOptions } from '@stacks/storage';

export function useStacks () {
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession: UserSession = new UserSession({ appConfig });
  const storageOptions: StorageOptions = { userSession };
  const storage = new Storage(storageOptions);
  
  return {
    stacksSession: userSession,
    stacksStorage: storage
  }
}