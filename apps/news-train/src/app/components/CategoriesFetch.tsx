import React, {FunctionComponent, ReactNode} from 'react';

export const CategoriesContext = React.createContext({});

type Props = {
    children: ReactNode
}

const CategoriesFetch: FunctionComponent<Props> = ({ children }) => {
  const defaultCategories: object = {
    "science":{"checked":true},
    "bitcoin":{"checked":true, "label": "Bitcoin"},
    "local":{"checked":true},
    "business":{"checked":true},
    "world":{"checked":true},
    "politics":{"checked":true},
    "technology":{"checked":true},
    "variety":{"checked":true},
    "us":{"checked":false}
  }

  return (
    <CategoriesContext.Provider value={defaultCategories}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesFetch;