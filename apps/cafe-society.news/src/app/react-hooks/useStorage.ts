import { AppConfig, UserSession } from '@stacks/connect';
import { Storage, StorageOptions } from '@stacks/storage';
import localforage from 'localforage';
import useSWR, { mutate } from 'swr';
import debounce from 'debounce-by-key';
import promiseRetry from 'promise-retry';

export function useStorage() {
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession: UserSession = new UserSession({ appConfig });

  const storageOptions: StorageOptions = { userSession };
  const storage = new Storage(storageOptions);

  const fetchStacksFilenames = () => {
    return new Promise((resolve, reject) => {
      const fetchedFilenames: string[] = [];
      if (!userSession.isUserSignedIn()) {
        resolve([]);
      }
      storage
        .listFiles((filename: string) => {
          fetchedFilenames.push(filename);
          return true;
        })
        .then(() => {
          resolve([fetchedFilenames].flat());
        })
        .catch((error: Error) => {
          reject(new Error('stacks listFiles error -> is user signed in?'));
        });
    });
  };

  const { data: stacksFilenames } = useSWR(
    'stacksFilenames',
    fetchStacksFilenames
  );

  const fetchFileLocal =
    (filename: string, defaultValue: object | string) => () => {
      return new Promise((resolve, reject) => {
        localforage
          .getItem(filename)
          .then((value) => resolve(value || defaultValue));
      });
    };

  const fetchFile = (filename: string, defaultValue: object | string) => {
    return new Promise((resolve, reject) => {
      if (!userSession.isUserSignedIn()) {
        localforage.getItem(filename).then((value: unknown) => {
          if (!value) {
            reject(new Error(`no stored ${filename}`));
          }
          resolve(value);
        });
      }
      [stacksFilenames]
        .flat()
        .filter((stacksFilename) => stacksFilename === filename)
        .forEach((stacksFilename) => {
          storage
            .getFile(filename, {
              decrypt: true,
            })
            .then((content) => {
              localforage
                .setItem(filename, JSON.parse(`${content}`))
                .then(() => resolve(JSON.parse(`${content}`)));
            })
            .catch(() => {
              console.log('user not signed in - use fetchLocal');
            })
            .finally(() => {
              localforage.getItem(filename).then((value) => {
                resolve(value || defaultValue);
              });
            });
        });
    });
  };
  const deleteFile = (filename: string) => () => {
    return new Promise((resolve, reject) => {
      storage.deleteFile(filename).then((result) => {
        fetchStacksFilenames().then((fetchedFiles) => resolve(fetchedFiles));
      });
    });
  };

  const publishToStacks = (filename: string) => {
    promiseRetry(
      (retry: unknown, number: number) => {
        debounce({ key: filename, duration: 3000 })
          .then(() => {
            localforage.getItem(filename).then((content: unknown) => {
              storage.putFile(`${filename}`, JSON.stringify(content), {
                dangerouslyIgnoreEtag: true,
              });
            });
          })
          .catch(retry);
      },
      { minTimeout: 3000 }
    );
  };

  const persist = (filename: string, content: object) => () => {
    return new Promise((resolve) => {
      if (!userSession.isUserSignedIn()) {
        console.log('USER NOT SIGNED IN - use persistLocal');
        localforage.setItem(filename, content).then(() => {
          resolve(content);
        });
      } else {
        localforage
          .setItem(filename, content)
          .then(() => {
            publishToStacks(`${filename}`);
          })
          .catch((error: Error) => {
            console.log(error);
          })
          .finally(() => resolve(content));
      }
    });
  };

  const persistLocal = (filename: string, content: object | string) => () => {
    return new Promise((resolve) => {
      localforage.setItem(filename, content).then(() => {
        resolve(content);
      });
    });
  };

  const loadUserData = () => () => {
    const updateFn = () => {
      return new Promise((resolve, reject) => {
        if (!userSession.isUserSignedIn()) {
          reject(new Error('called loadUserData while not signed into stacks'));
        }
        resolve(userSession.loadUserData());
      });
    };
    mutate('stacksUserData', updateFn());
  };

  return {
    fetchStacksFilenames,
    deleteFile,
    fetchFile,
    fetchFileLocal,
    persist,
    persistLocal,
    loadUserData,
    userSession: userSession,
  };
}
