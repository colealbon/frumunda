import { render } from '@testing-library/react';

import PageChooser from './PageChooser';

describe('PageChooser', () => {
  const labelOrEcho = (index: string) => {
    return `${Object.entries({
      classifiers: 'Classifiers',
      contribute: 'Contribute',
      categories: 'Categories',
      community: 'Community',
      commerce: 'Commerce',
      posts: 'Posts',
    })
      .filter((labelsEntry) => labelsEntry[0] === `${index}`)
      .map((labelsEntry) => labelsEntry[1])
      .concat(`${index}`)
      .find(() => true)}`;
  };

  const handlePageIndexClick = () => {
    return;
  };
  const handleCategoryClick = () => {
    return;
  };
  const cloneselectedCategory = 'testcategory';
  const cloneselectedPage = 'testpage';

  it('should render successfully', () => {
    const { baseElement } = render(
      <PageChooser
        handleCategoryClick={handleCategoryClick}
        handlePageIndexClick={handlePageIndexClick}
        selectedCategory={cloneselectedCategory}
        selectedPage={cloneselectedPage}
        labelOrEcho={labelOrEcho}
      />
    );

    expect(baseElement).toBeTruthy();
  });
});