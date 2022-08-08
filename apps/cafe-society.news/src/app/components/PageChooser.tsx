import { FunctionComponent, useState } from 'react';
import useSWR, { mutate } from 'swr';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useStacks } from '../react-hooks/useStacks';

import { labelOrEcho } from '../utils';

const PageChooser: FunctionComponent = () => {
  const { fetchFileLocal, persistLocal } = useStacks();
  const { data: selectedPage } = useSWR(
    'selectedPage',
    fetchFileLocal('selectedPage', ''),
    { fallbackData: '' }
  );
  const [expanded, setExpanded] = useState<string | false>('settingsPanel');
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div>
      <List>
        <ListItem key={'classifiers'} disablePadding>
          <ListItemButton
            disabled={'classifiers' === `${selectedPage}`}
            onClick={() => {
              mutate(
                'selectedPage',
                persistLocal('selectedPage', 'classifiers'),
                { optimisticData: 'classifiers' }
              );
              mutate('selectedCategory', persistLocal('selectedCategory', ''), {
                optimisticData: '',
              });
            }}
          >
            <ListItemText primary={`${labelOrEcho('classifiers')}`} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'contribute'} disablePadding>
          <ListItemButton
            disabled={'contribute' === `${selectedPage}`}
            onClick={() => {
              mutate(
                'selectedPage',
                persistLocal('selectedPage', 'contribute'),
                { optimisticData: 'contribute' }
              );
              mutate('selectedCategory', persistLocal('selectedCategory', ''), {
                optimisticData: '',
              });
            }}
          >
            <ListItemText primary={`${labelOrEcho('contribute')}`} />
          </ListItemButton>
        </ListItem>

        <Accordion 
          style={{padding: '0px'}}
          expanded={expanded === 'settingsPanel'}
          onChange={handleChange('settingsPanel')}
        >
          <AccordionSummary style={{justifyContent: 'start', padding: '0px'}} >
            <ListItemText sx={{ pl: 2 }} primary="settings" />
          </AccordionSummary>
          <AccordionDetails>

              <List component="div" disablePadding>
                <ListItem key={'pageChooserFeeds'} disablePadding>
                  <ListItemButton
                    sx={{ pl: 2 }}
                    disabled={'feeds' === `${selectedPage}`}
                    onClick={() => {
                      mutate(
                        'selectedPage',
                        persistLocal('selectedPage', 'feeds'),
                        { optimisticData: 'feeds' }
                      );
                      mutate(
                        'selectedCategory',
                        persistLocal('selectedCategory', ''),
                        { optimisticData: '' }
                      );
                    }}
                  >
                    <ListItemText primary={`${labelOrEcho('feeds')}`} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={'pageChooserCategories'} disablePadding>
                  <ListItemButton
                    sx={{ pl: 2 }}
                    disabled={'categories' === `${selectedPage}`}
                    onClick={() => {
                      mutate(
                        'selectedPage',
                        persistLocal('selectedPage', 'categories'),
                        { optimisticData: 'categories' }
                      );
                      mutate(
                        'selectedCategory',
                        persistLocal('selectedCategory', ''),
                        { optimisticData: '' }
                      );
                    }}
                  >
                    <ListItemText primary={`${labelOrEcho('categories')}`} />
                  </ListItemButton>
                </ListItem>

                <ListItem key={'pageChooserStacks'} disablePadding>
                  <ListItemButton
                    sx={{ pl: 2 }}
                    disabled={'stacks' === `${selectedPage}`}
                    onClick={() => {
                      mutate(
                        'selectedPage',
                        persistLocal('selectedPage', 'stacks'),
                        { optimisticData: 'stacks' }
                      );
                      mutate(
                        'selectedCategory',
                        persistLocal('selectedCategory', ''),
                        { optimisticData: '' }
                      );
                    }}
                  >
                    <ListItemText primary={`${labelOrEcho('stacks')}`} />
                  </ListItemButton>
                </ListItem>

                <ListItem key={'pageChooserMetamask'} disablePadding>
                  <ListItemButton
                    sx={{ pl: 2 }}
                    disabled={'metamask' === `${selectedPage}`}
                    onClick={() => {
                      mutate(
                        'selectedPage',
                        persistLocal('selectedPage', 'metamask'),
                        { optimisticData: 'metamask' }
                      );
                      mutate(
                        'selectedCategory',
                        persistLocal('selectedCategory', ''),
                        { optimisticData: '' }
                      );
                    }}
                  >
                    <ListItemText primary={`${labelOrEcho('metamask')}`} />
                  </ListItemButton>
                </ListItem>


                <ListItem key={'pageChooserCorsProxies'} disablePadding>
                  <ListItemButton
                    sx={{ pl: 2 }}
                    disabled={'corsproxies' === `${selectedPage}`}
                    onClick={() => {
                      mutate(
                        'selectedPage',
                        persistLocal('selectedPage', 'corsproxies'),
                        { optimisticData: 'corsproxies' }
                      );
                      mutate(
                        'selectedCategory',
                        persistLocal('selectedCategory', ''),
                        { optimisticData: '' }
                      );
                    }}
                  >
                    <ListItemText primary={`${labelOrEcho('corsproxies')}`} />
                  </ListItemButton>
                </ListItem>

                <ListItem key={'pageAppSettings'} disablePadding>
                  <ListItemButton
                    sx={{ pl: 2 }}
                    disabled={'appsettings' === `${selectedPage}`}
                    onClick={() => {
                      mutate(
                        'selectedPage',
                        persistLocal('selectedPage', 'appsettings'),
                        { optimisticData: 'appsettings' }
                      );
                      mutate(
                        'selectedCategory',
                        persistLocal('selectedCategory', ''),
                        { optimisticData: '' }
                      );
                    }}
                  >
                    <ListItemText primary={`${labelOrEcho('appsettings')}`} />
                  </ListItemButton>
                </ListItem>
              </List>

          </AccordionDetails>
        </Accordion>
      </List>
    </div>
  );
};

export default PageChooser;
