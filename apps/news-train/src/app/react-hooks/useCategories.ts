import useSWR from 'swr';
export function useCategories () {

  const fallback = {
    "science":{"checked":true, "label": "science"},
    "bitcoin":{"checked":true, "label": "bitcoin"},
    "local":{"checked":true, "label": "local"},
    "business":{"checked":true, "label": "business"},
    "world":{"checked":true, "label": "world"},
    "politics":{"checked":true, "label": "politics"},
    "technology":{"checked":true, "label": "technology"}
    }
    const fetcher = () => {
      return new Promise((resolve, reject) => {
        resolve({
          "science":{"checked":true, "label": "Science"},
          "bitcoin":{"checked":true, "label": "Bitcoin"},
          "local":{"checked":true, "label": "Local"}
        })
      })
    }

    const { data } = useSWR(
      'categories',
      fetcher , 
      {
        suspense: true,
        fallbackData: fallback
      }
    )
  
    return {
      categories: data
    }
  }