import { AppConfig, UserSession } from '@stacks/connect';
import { Storage, StorageOptions } from '@stacks/storage';
import localforage from 'localforage'
import useSWR, { useSWRConfig } from 'swr'

export function useStacks () {
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession: UserSession = new UserSession({ appConfig });

  const storageOptions: StorageOptions = { userSession };
  const storage = new Storage(storageOptions);
  const { data: stacksFilenames } = useSWR('stacksFilenames')

  const { mutate } = useSWRConfig()
  
  const fetchStacksFilenames = () => {
    const updateFn = (filename: string) => {
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
    }
    mutate('stacksFilenames', updateFn);
  };

  const fetchFile = (filename: string, defaultValue: object) => () => {
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
      [stacksFilenames].flat().filter((stacksFilename: string) => (
        stacksFilename === filename
      )).map((stacksFilename: string) => {
        storage.getFile(filename, {
          decrypt: true
        })
        .then((content) => {
          resolve(JSON.parse(`${content}`))
        })
        .catch(() => {
          localforage.getItem(filename)
          .then(value => resolve(value || defaultValue))
        })
      })
      localforage.getItem(filename)
      .then(value => resolve(value || defaultValue))
    })
  }
  const deleteFile = (filename: string) => () => {
    storage.deleteFile(filename)
    .then(() => fetchStacksFilenames())
  }

  const persistFile = (filename: string, content: object) => () => {
    const updateFn = (filename: string, content: object) => {
      //deprecated - use persist
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

  const persist = (filename: string, content: object) => () => {
    return new Promise((resolve) => {
      if( !userSession.isUserSignedIn() ) {
        localforage.setItem(filename, content)
        .then(() => {
          resolve(content)
        })
        return
      }
      storage.putFile(filename, JSON.stringify(content))
      .then(() => {
        localforage.setItem(filename, content)
        resolve(content)
      })
    })
  }

  const loadUserData = () => () => {
    const updateFn = () => {
      return new Promise((resolve, reject) => {
        if (!userSession.isUserSignedIn()) {
          reject(new Error('called loadUserData while not signed into stacks'))
        }
        resolve(userSession.loadUserData())
      })
    }
    mutate('stacksUserData', updateFn())
  }

  return {
    fetchStacksFilenames,
    deleteFile,
    fetchFile,
    persistFile,
    persist,
    loadUserData,
    userSession: userSession
  }
}