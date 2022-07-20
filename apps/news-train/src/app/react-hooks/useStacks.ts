import { AppConfig, UserSession } from '@stacks/connect';
import { Storage, StorageOptions } from '@stacks/storage';
import localforage from 'localforage'
import { useSWRConfig } from 'swr'

export function useStacks () {
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession: UserSession = new UserSession({ appConfig });
  const storageOptions: StorageOptions = { userSession };
  const storage = new Storage(storageOptions);
  const { mutate } = useSWRConfig()
  const fetchStacksFilenames = () => {
    return new Promise((resolve, reject) => {
      const fetchedFilenames: string[] = []
      if (!userSession.isUserSignedIn()) {
        resolve([])
      }
      storage.listFiles((filename: string) => {
        fetchedFilenames.push(filename)
        return true
      })
      .then(() => {
        resolve(fetchedFilenames)
      })
      .catch((error: Error) => {
        reject(new Error('stacks listFiles error -> is user signed in?'))
      })
    })
  };

  const deleteFile = (filename: string) => () => {
    if( !userSession.isUserSignedIn() ) {
      return
    }
    storage.deleteFile(filename)
    mutate('stacksFilenames', fetchStacksFilenames);
  }


  const fetchFile = (filename: string) => () => {
    return new Promise((resolve, reject) => {
      if( !userSession.isUserSignedIn() ) {
        localforage.getItem(filename)
        .then((value: unknown) => {
          if (!value) {
            reject(new Error(`no stored ${filename}`))
          }
          resolve(value)
        })
      }
      storage.getFile(filename, {
        decrypt: true
      })
      .then((content) => {
        resolve(JSON.parse(`${content}`))
      })
      .catch(() => {
        localforage.getItem(filename)
        .then((value: unknown) => {
          if (!value) {
            reject(new Error(`no stored ${filename}`))
          }
          resolve(value)
        })
      })
    })
  }

  const persist = (filename: string, content: object) => () => {
    const updateFn = (filename: string, content: object) => {
      return new Promise((resolve) => {
        if( !userSession.isUserSignedIn() ) {
          localforage.setItem(filename, content)
          .then(() => {
            resolve(content)
          })
          return
        }
        
        storage.putFile(filename, JSON.stringify(content))
        .catch((error) => console.log(error))
        .finally(() => {
          localforage.setItem(filename, content)
          resolve(content)
        })
      })
    }
    mutate(filename, updateFn(filename, content));
  }

  return {
    userSession,
    fetchStacksFilenames,
    fetchFile,
    deleteFile,
    persist
  }
}