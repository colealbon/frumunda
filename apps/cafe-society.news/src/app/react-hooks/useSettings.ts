import { useState } from 'react';
import useSWR from 'swr';
import localforage from 'localforage';

export function useSettings() {
  const [inFlight, setInFlight] = useState(false);

  const defaultSettings = {
    hideProcessedPosts: {
      label: 'hide processed posts',
      checked: true,
    },
    disableMachineLearning: {
      label: 'disable machine learning',
      checked: false,
    },
    mlThresholdDocuments: {
      label: 'ignore machine learning under 100 documents',
      checked: true,
      value: 100,
    },
    mlThresholdConfidence: {
      label: 'machine learning confidence threshold: .99',
      checked: true,
      value: 0.97,
    },
    showClassifierOverride: {
      label: 'show classifier override',
      checked: false,
    },
  };

  const fetcher = () => {

    return new Promise((resolve, reject) => {
      localforage.getItem('settings').then((value: unknown) => {
        if (!value) {
          resolve(defaultSettings);
        }
        resolve(value);
      });
    });
  };

  const { data, mutate } = useSWR('settings', fetcher, {
    suspense: true,
    shouldRetryOnError: false,
  });

  const persistSettings = (newSettings: unknown) => {
    setInFlight(true);
    const newSettingsClone = structuredClone(newSettings as object);

    const updateFn = (newSettings: object) => {
      return new Promise((resolve) => {
        localforage.setItem('settings', newSettingsClone).then(() => {
          setInFlight(false);
          resolve(newSettingsClone);
        });
      });
    };
    const options = {
      optimisticData: defaultSettings,
      rollbackOnError: false,
    };
    mutate(updateFn(newSettingsClone), options);
  }

  const factoryReset = () => {
    const newSettingsClone = structuredClone(defaultSettings);
    persistSettings(newSettingsClone);
  };

  return {
    settings: data,
    persistSettings,
    factoryReset,
    inFlight,
  };
}
