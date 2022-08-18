import { useState, useCallback } from 'react';
import { useStacks } from '../react-hooks/useStacks';
import { TextField } from '@mui/material';
import useSWR, { mutate } from 'swr';

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-var
var chloride = require('chloride')

const KeysAdd = () => {

  const { persist } = useStacks();
  const { data: keysdata } = useSWR('keys');

  const [inFlight, setInFlight] = useState(false);

  const [labelValue, setLabelValue] = useState('');
  const [publicKeyValue, setPublicKeyValue] = useState('');
  const [secretKeyValue, setSecretKeyValue] = useState('');

  const setLabelValueCallback = useCallback(
    (newLabelValue: string) => {
      setLabelValue(newLabelValue);
    },
    [setLabelValue]
  );
  const setPublicKeyCallback = useCallback(
    (newPublicKey: string) => {
      console.log(newPublicKey)
      setPublicKeyValue(newPublicKey);
    },
    [setPublicKeyValue]
  );
  const setSecretKeyCallback = useCallback(
    (newSecretKey: string) => {
      console.log(newSecretKey)
      setSecretKeyValue(newSecretKey);
    },
    [setSecretKeyValue]
  );

  const addKeyCallback = useCallback(() => {

    const keys = { ...(keysdata as object) };
    const setKeys = (theKeys: object) => {
      setInFlight(true)
      mutate('keys', persist('keys', theKeys), {
        optimisticData: theKeys,
      }).then(() => setInFlight(false));
    };
    return [
      ...[`${labelValue}`]
      .filter(() => `${labelValue}` !== '')
      .filter(() => `${publicKeyValue}` === '')
      .filter(() => `${secretKeyValue}` === '')
      .map(labelValue => {
        // eslint-disable-next-line no-var
        var rawKeypair = chloride.crypto_box_keypair()
        const pubkeyStr = Buffer.from(rawKeypair.publicKey).toString('base64')
        const secretKeyStr = Buffer.from(rawKeypair.secretKey).toString('base64')
        const keypairWithLabel = JSON.parse(`{"${labelValue}": {
          "publicKey": "${pubkeyStr}",
          "secretKey": "${secretKeyStr}",
          "checked": "true"
        }}`)
        setKeys({ ...keypairWithLabel, ...JSON.parse(JSON.stringify(keys)) });
        setLabelValue('');
        return null
      }),
      ...[`${labelValue}`]
      .filter(() => `${labelValue}` !== '')
      .filter(() => `${publicKeyValue}${secretKeyValue}` !== '')
      .map(labelValue => {
        const keypair = JSON.parse(`{
          "publicKey": "${publicKeyValue}",
          "secretKey": "${secretKeyValue}",
          "checked": "true"
        }`)

        const keypairWithLabel = JSON.parse(`{"${labelValue}": ${JSON.stringify(Object.fromEntries(Object.entries(keypair).filter((entryItem: [string, unknown]) => entryItem[1] !== '' )))}}`)
        console.log({ ...keypairWithLabel, ...JSON.parse(JSON.stringify(keys)) })
        setKeys({ ...keypairWithLabel, ...JSON.parse(JSON.stringify(keys)) });
        setLabelValue('');
        return null
      })
    ].find(() => true)
  }, [keysdata, labelValue, persist, publicKeyValue, secretKeyValue]);

  return (
    <div>
      <TextField
        id="addKeyLabel"
        placeholder="key label"
        value={labelValue}
        disabled={inFlight}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onKeyPress={(event: any)=> {
          event.key === 'Enter' && addKeyCallback()
        }}
        onChange={event => {
          setLabelValueCallback(event.target.value);
        }}
        fullWidth
      />

     <TextField
        id="publicKeyValue"
        placeholder="public key curve25519_pk"
        value={publicKeyValue}
        disabled={inFlight}
        onKeyPress={event => {
          [event.key]
            .filter(theKey => theKey === 'Enter')
            .forEach(() => {
              addKeyCallback();
              setPublicKeyCallback('');
            });
        }}
        onChange={event => {
          setPublicKeyCallback(event.target.value);
        }}
        fullWidth
      />
      <TextField
        id="secretKeyValue"
        placeholder="secret key curve25519_sk"
        value={secretKeyValue}
        disabled={inFlight}
        onKeyPress={event => {
          [event.key]
            .filter(theKey => theKey === 'Enter')
            .forEach(() => {
              addKeyCallback();
            });
        }}
        onChange={event => {
          setSecretKeyCallback(event.target.value);
        }}
        fullWidth
      />
    </div>
  )
};

export default KeysAdd;

