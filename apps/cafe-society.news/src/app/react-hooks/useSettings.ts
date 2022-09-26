import { useState } from 'react';
import useSWR from 'swr';
import localforage from 'localforage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type settingsType = {[key: string]: any}

export function useSettings() {
  const [inFlight, setInFlight] = useState(false);

  const defaultSettings : settingsType = {
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

  const { data: settings, mutate } = useSWR('settings', fetcher, {
    suspense: true,
    shouldRetryOnError: false,
  });

  const persistSettings = (newSettings: unknown) => {
    setInFlight(true);
    const newSettingsClone: settingsType = {...newSettings as settingsType};

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
    const newSettingsClone: settingsType = {...defaultSettings as settingsType};
    persistSettings(newSettingsClone);
  };

  const toggle = (settingName: string) => () => {
    const newSetting = {...Object.fromEntries(
      Object.entries(settings as object)
        .filter((setting: [string, unknown]) => setting[0] === settingName)
        .map((setting: [string, unknown]) => {
          return [
            setting[0],
            {
              ...Object.fromEntries(
                Object.entries({
                  ...(setting[1] as Record<string, unknown>),
                })
                  .filter(
                    (attribute: [string, unknown]) =>
                      attribute[0] === 'checked'
                  )
                  .map((attribute: [string, unknown]) => [attribute[0], !attribute[1]])
              ),
              ...Object.fromEntries(
                Object.entries({
                  ...(setting[1] as Record<string, unknown>),
                }).filter((attribute: [string, unknown]) => attribute[0] !== 'checked')
              ),
            },
          ];
        })
        ),
      }
    persistSettings({ ...settings as object, ...newSetting });
  };

  return {
    settings,
    factoryReset,
    inFlight,
    toggle
  };
}
