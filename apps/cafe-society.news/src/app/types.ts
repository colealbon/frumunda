export type cleanPostItemType = {
  title: {[key: string]: string};
  link: {[key: string]: string};
  description: {[key: string]: string}
}

export type feedValueType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  title: string;
  description: string;
  items: [cleanPostItemType]
}

export type feedType = {
  [key: string]: {
    checked: boolean, categories: string[]
  }
}