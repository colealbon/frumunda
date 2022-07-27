import {FunctionComponent } from 'react';
import useSWR, { mutate } from 'swr'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse 
} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks'

import { labelOrEcho } from '../utils'


const PageChooser: FunctionComponent = () => {
  const {fetchFileLocal, persistLocal} = useStacks()
  const {data: selectedPage} = useSWR(
    'selectedPage', 
    fetchFileLocal('selectedPage',''),
    {fallbackData: ''}
  )

  return (
    <div>
      <List>
        <ListItem key={'classifiers'} disablePadding>
          <ListItemButton disabled={ 'classifiers' === `${selectedPage}`} onClick={() => {
            mutate(
              'selectedPage',
              persistLocal('selectedPage', 'classifiers'),
              { optimisticData: 'classifiers' }
            )
            mutate(
              'selectedCategory',
              persistLocal('selectedCategory', ''),
              { optimisticData: '' }
            )
          }} >
            <ListItemText primary={`${labelOrEcho('classifiers')}`} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'contribute'} disablePadding>
          <ListItemButton disabled={ 'contribute' === `${selectedPage}`} onClick={() => {
            mutate('selectedPage', persistLocal('selectedPage', 'contribute'), { optimisticData: 'contribute' } )
            mutate('selectedCategory', persistLocal('selectedCategory', ''),{ optimisticData: '' } )
          }} >
            <ListItemText primary={`${labelOrEcho('contribute')}`} />
          </ListItemButton>
        </ListItem>
        <ListItemText sx={{ pl: 2 }} primary="Settings" />
        <Collapse in={true} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem key={'pageChooserFeeds'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'feeds' === `${selectedPage}`} 
                onClick={() => {
                  mutate('selectedPage', persistLocal('selectedPage', 'feeds'), { optimisticData: 'feeds' } )
                  mutate('selectedCategory', persistLocal('selectedCategory', ''),{ optimisticData: '' } )
                }}
              >
                <ListItemText primary={`${labelOrEcho('feeds')}`} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'pageChooserCategories'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'categories' === `${selectedPage}`} 
                onClick={() => {
                  mutate('selectedPage', persistLocal('selectedPage', 'categories'), { optimisticData: 'categories' } )
                  mutate('selectedCategory', persistLocal('selectedCategory', ''),{ optimisticData: '' } )
                } }
              >
                <ListItemText primary={`${labelOrEcho('categories')}`} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'pageChooserStacks'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'stacks' === `${selectedPage}`} 
                onClick={() => {
                  mutate('selectedPage', persistLocal('selectedPage', 'stacks'), { optimisticData: 'stacks' } )
                  mutate('selectedCategory', persistLocal('selectedCategory', ''),{ optimisticData: '' } )
                } }
              >
                <ListItemText primary={`${labelOrEcho('stacks')}`} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'pageChooserCorsProxies'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'corsproxies' === `${selectedPage}`} 
                onClick={() => {
                  mutate('selectedPage', persistLocal('selectedPage', 'corsproxies'), { optimisticData: 'corsproxies' } )
                  mutate('selectedCategory', persistLocal('selectedCategory', ''),{ optimisticData: '' } )
                } }
              >
                <ListItemText primary={`${labelOrEcho('corsproxies')}`} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default PageChooser