import { FunctionComponent } from 'react';
import useSWR, {mutate} from 'swr';
import { useStorage } from '../react-hooks/useStorage';
import defaultDispatchers from '../react-hooks/defaultDispatchers.json';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import DispatchersAdd from './DispatchersAdd';
import DispatcherKeys from './DispatcherKeys';
import DispatcherToggle from './DispatcherToggle';
import DispatcherDelete from './DispatcherDelete';
import DispatchersReset from './DispatchersReset';

const DispatchersEdit: FunctionComponent = () => {
  const { fetchFileLocal, fetchFile } = useStorage();
  const { data: dispatchers } = useSWR(
    'dispatchers',
    fetchFileLocal('dispatchers', defaultDispatchers),
    {
      fallbackData: defaultDispatchers,
      suspense: true
    }
  );

  return (
    <>
      <DispatchersAdd key="DispatchersAdd" />
      <div />
      <DispatchersReset />
      <div />
      {Object.keys(dispatchers as object).map((dispatcher) => {
        //mutate(`keys_${dispatcher}`, fetchFile(`keys_${dispatcher}`, []))
        return (
          <div key={`dispatcher-edit-${dispatcher}`}>
            <Accordion>
              <AccordionSummary>
                {dispatcher}
              </AccordionSummary>
              <AccordionDetails>
              <DispatcherDelete text={dispatcher} />
              <DispatcherToggle text={dispatcher} />
              <DispatcherKeys dispatcherLabel={dispatcher} />
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
    </>
  );
};

export default DispatchersEdit;
