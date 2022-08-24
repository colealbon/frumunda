import { hash } from 'tweetnacl';
import { convert } from 'html-to-text';

export const removePunctuation = (text: string) => {
  return `${text}`
    .replace(/[/?…".,#!$%^&*;:{}=_`~()'’‘“”]/g, '')
    .replace(/\s{2,}/g, ' ');
};

export const removeTrackingGarbage = (text: string) => {
  return `${text}`
    .replace(/read full article at rtcom.*$/g, '')
    .replace(/appeared first on.*$/g, '')
    .replace(/\[httpstheinterceptcom.*$/g, '')
    .replace(/\[httpselectrekcowebstories.*$/g, '')
    .replace(/-- read more on .*/g, '')
    .replace(/-- Read more on .*/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ');
};

export const cleanTags = (text: string) => {
  return convert(text, { ignoreHref: true, ignoreImage: true })
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/&amp;rsquo;/g, "'")
    .replace(/&amp;lsquo;/g, "'")
    .replace(/&amp;ldquo;/g, '"')
    .replace(/&amp;rdquo;/g, '"')
    .replace(/&amp;rsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&rdquo;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#039;/g, "'")
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&#039;/g, '"')
    .replace(/&#38;/g, '-')
    .replace(/\s{2,}/g, ' ')
    .replace(/&ldquo;/g, '"');
};

export const hashStr = (text: string) => {
  return removePunctuation(
    encodeURIComponent(hash(new Buffer(text)).toString())
  );
};

export const shortUrl = (text: string) => {
  const theUrl = new URL(text);
  const newPath = removePunctuation(`${theUrl.hostname}${theUrl.pathname}`)
    .replace(/-/g, '')
    .toLowerCase();

  return newPath;
};

export const labelOrEcho = (index: string) => {
  return `${Object.entries({
    classifiers: 'classifiers',
    contribute: 'contribute',
    categories: 'categories',
    community: 'community',
    commerce: 'commerce',
    posts: 'posts',
    feeds: 'feeds',
    keys: 'encryption keys',
    stacks: 'stacks',
    metamask: 'metamask',
    corsproxies: 'cors proxies',
    appsettings: 'app settings',
    dispatchers: 'dispatchers'
  })
    .filter((labelsEntry) => labelsEntry[0] === `${index}`)
    .map((labelsEntry) => labelsEntry[1])
    .concat(`${index}`)
    .find(() => true)}`;
};

export const cleanPostItem = (postItem: {
  title: string;
  link: string;
  description: string;
}) => {
  return {
    title: cleanTags(
      structuredClone({ ...(postItem as object) }).title['$text'] ||
        `${structuredClone({ ...(postItem as object) }).title}`
    ),
    description: removeTrackingGarbage(
      cleanTags(
        (structuredClone({ ...(postItem as object) }).description &&
          structuredClone({ ...(postItem as object) }).description['$text']) ||
          `${structuredClone({ ...(postItem as object) }).description}`
      )
    ),
    link:
      structuredClone({ ...(postItem as object) }).link['$text'] ||
      `${structuredClone({ ...(postItem as object) }).link}`,
  };
};
