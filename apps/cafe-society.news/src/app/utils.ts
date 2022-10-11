import nacl, { hash } from 'tweetnacl';
import { convert } from 'html-to-text';
import { cleanPostItemType } from './types'
import xml2js from 'xml2js';

import naclutil from 'tweetnacl-util';

export const parseFeedContentMulti = (fetchedContent: object) => {
  return new Promise((resolve, reject) => {
    const parseFeedQueue: object[] = [];
    [Object.entries(fetchedContent)]
      .flat()
      .filter((fetchedContentEntry) => fetchedContentEntry[1] !== undefined)
      .forEach((fetchedContentEntry: [string, object]) => {
        parseFeedQueue.push(
          new Promise((resolve, reject) => {
            const parser = new xml2js.Parser();
            parser.parseString(
              Object.assign({ ...fetchedContentEntry[1] } as object).data,
              function (
                error: Error | null,
                result: {
                  rss?: {
                    channel?: {
                      item: object[];
                      title?: string;
                      description?: string;
                    }[];
                  };
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  feed?: { entry?: object; title: any };
                }
              ) {
                if (error) {
                  return;
                }
                const feedTitle = `${
                  result?.feed?.title[0][`_`].toString() ||
                  result?.feed?.title[0]
                }`;
                const channelObj = [result?.rss?.channel]
                  .flat()
                  .find(() => true);

                const channelTitle = channelObj?.title?.toString();
                const channelDescription = channelObj?.description;
                const channelContentItem = [result?.rss?.channel]
                  .flat()
                  .filter((channel) => !!channel?.item)
                  .map((channel) => {
                    return channel?.item
                      .filter((item: object) => item !== {})
                      .map(
                        (item: {
                          title?: string;
                          link?: string;
                          description?: string;
                        }) => {
                          return {
                            title: cleanTags(
                              `${[item.title].flat().find(() => true)}`
                            ),
                            link: [item.link].flat().find(() => true),
                            description: cleanTags(
                              `${[item.description].flat().find(() => true)}`
                            ),
                          };
                        }
                      );
                  });

                // atom feeds have entry instead of item

                const channelContentEntry = [result?.feed]
                  .flat()
                  .filter((feed) => !!feed?.entry)
                  .map((feed) =>
                    [feed?.entry].flat().map((feedEntry?: object) => {
                      const rawLink: unknown = [
                        Object.entries(feedEntry as object).find(
                          (attribute: [string, unknown]) =>
                            attribute[0] === 'link'
                        ),
                      ]
                        .flat()
                        .slice(-1)
                        .find(() => true);
                      const linkVal: unknown = [
                        Object.values(rawLink as object),
                      ]
                        .flat()
                        .find(() => true);
                      const linkObj: unknown = [
                        Object.values(linkVal as object),
                      ]
                        .flat()
                        .find(() => true);
                      const hrefEntry: unknown[] = Object.entries(
                        linkObj as object
                      ).filter(
                        (attribute: [string, unknown]) =>
                          attribute[0] === 'href'
                      );
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const hrefVal: unknown = Object.values(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        Object.fromEntries(hrefEntry as [PropertyKey, any])
                      ).find(() => true);
                      const rawTitle: unknown = [
                        Object.entries(feedEntry as object).find(
                          (attribute: [string, unknown]) =>
                            attribute[0] === 'title'
                        ),
                      ]
                        .flat()
                        .slice(-1)
                        .find(() => true);
                      const titleVal: unknown = [
                        Object.values(rawTitle as object),
                      ]
                        .flat()
                        .find(() => true);
                      const titleStr: unknown = [
                        Object.values(titleVal as object),
                      ]
                        .flat()
                        .find(() => true);
                      const rawDescription: unknown = [
                        Object.entries(feedEntry as object).find(
                          (attribute: [string, unknown]) =>
                            attribute[0] === 'summary'
                        ),
                      ]
                        .flat()
                        .slice(-1)
                        .find(() => true);
                      const descriptionVal: unknown = [
                        Object.values({ ...(rawDescription as object) }),
                      ]
                        .flat()
                        .find(() => true);
                      const descriptionStr: unknown = [
                        [Object.values(descriptionVal as object)]
                          .flat()
                          .find(() => true),
                      ]
                        .slice(-1)
                        .find(() => true);

                      return {
                        title: `${titleStr}`,
                        link: `${hrefVal}`,
                        description: `${descriptionStr}`,
                      };
                    })
                  );

                const feedItemEntry = [
                  fetchedContentEntry[0],
                  {
                    title: `${feedTitle}${channelTitle}`.replace(
                      /undefined/g,
                      ''
                    ),
                    description: `${channelDescription}`.replace(
                      /undefined/g,
                      ''
                    ),
                    items: [
                      ...channelContentItem,
                      ...channelContentEntry,
                    ].flat(Infinity),
                  },
                ];
                resolve(feedItemEntry);
              }
            );
          })
        );
      });
    Promise.all(parseFeedQueue).then((parsedContent: object) => {
      resolve(Object.fromEntries(parsedContent as [string, object][]));
    });
  });
};
export const pickCheckedFeedsForCategory = (feeds: object, category: string) => {
    return Object.entries(feeds as object)
    .filter((feedEntry) => feedEntry[1].categories?.indexOf(category) !== -1)
    .filter((feedEntry) => feedEntry[1].checked)
}

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
    .replace(/News Ghana.?http.? /g, '')
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
    
    encodeURIComponent(hash(naclutil.decodeUTF8(text)).toString())
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


export const cleanPostItem = (postItem: cleanPostItemType ) => {
  return {
    title: cleanTags(
      postItem.title['$text'] || `${postItem.title}`
    ),
    description: removeTrackingGarbage(
      cleanTags(`${postItem.description['$text'] || postItem.description}`)
    ),
    link: `${postItem.link['$text'] || postItem.link}`
  };
};
