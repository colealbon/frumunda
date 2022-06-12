import React from 'react';

type PostsProps = {
  selectedCategoryIndex: string
};

const Posts = (props: PostsProps) => {
  
  const selectedCategory = `${props.selectedCategoryIndex}`
  return (
    <>Posts {`${selectedCategory}`} </>
  );
};

export default Posts;
