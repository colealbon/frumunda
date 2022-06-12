import { render } from '@testing-library/react';

import DrawerContent from './DrawerContent';

describe('DrawerContent', () => {
  const labelOrEcho = (index: string) => {
    return `${Object.entries({
      classifiers: 'Classifiers',
      contribute: 'Contribute',
      categories: 'Categories',
      community: 'Community',
      commerce: 'Commerce',
      posts: 'Posts'
    })
    .filter(labelsEntry => labelsEntry[0] === `${index}`)
    .map((labelsEntry) => labelsEntry[1])
    .concat(`${index}`)
    .find(() => true)}`
  }

  const handlePageIndexClick = () => {
    return
  }
  const handleCategoryClick = () => {
    return
  }
  const cloneSelectedCategoryIndex = 'testcategory'
  const cloneSelectedPageIndex = 'testpage'

  it('should render successfully', () => {
    const { baseElement } = render(<DrawerContent 
      handleCategoryClick={handleCategoryClick}
      handlePageIndexClick={handlePageIndexClick} 
      selectedCategoryIndex={cloneSelectedCategoryIndex}
      selectedPageIndex={cloneSelectedPageIndex}
      labelOrEcho={labelOrEcho}
    />);

    expect(baseElement).toBeTruthy();
  });
});
