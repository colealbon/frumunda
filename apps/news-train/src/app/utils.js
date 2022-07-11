import {hash} from 'tweetnacl';

export const removePunctuation = (text) => {
    return text.replace(/[/?–…".,#!$%^&*;:{}=\-_`~()'’‘“”—]/g,"")
    .replace(/\n/g," ")
    .replace(/\s{2,}/g," ")
  }

export const cleanTags = (text) => {
  return text.replace(/\n/g," ")
  .replace(/\s{2,}/g," ")
  .replace(/&amp;ldquo;/g, '"')
  .replace(/&amp;rdquo;/g, '"')
  .replace(/&amp;rsquo;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/<[^>]+>/g, '')
  .replace(/&\#8217;/g, "'")
  .replace(/&\#8211;/g, "-")
  .replace(/&#039;/g, "'")    
  .replace(/&amp;nbsp;/g, " ")
  .replace(/&#039;/g, '"')
  .replace(/&#38;/g, '-')
  .replace(/\n/g," ")
  .replace(/\s{2,}/g," ")
}
  
export const removeTrackingGarbage = (text) => {
return text.replace(/read full article at rtcom.*$/g,"")
.replace(/appeared first on.*$/g,"")
.replace(/\[httpstheinterceptcom.*$/g,"")
.replace(/\[httpselectrekcowebstories.*$/g,"")
.replace(/-- read more on .*/g,"")
.replace(/-- Read more on .*/g,"")
.replace(/\n/g," ").replace(/\s{2,}/g," ")
.toLowerCase()
}

export const hashStr = (text) => {
return removePunctuation(encodeURIComponent(hash(new Buffer(text)).toString()))
}

export const shortUrl = (text) => {
const theUrl = new URL(text)
const newPath = removePunctuation(`${theUrl.hostname}${theUrl.pathname}`)
return newPath
}

export const labelOrEcho = (index) => {
  return `${Object.entries({
    classifiers: 'classifiers',
    contribute: 'contribute',
    categories: 'categories',
    community: 'community',
    commerce: 'commerce',
    posts: 'posts',
    feeds: 'feeds',
    stacks: 'stacks',
    corsproxies: 'cors proxies'
  })
  .filter(labelsEntry => labelsEntry[0] === `${index}`)
  .map((labelsEntry) => labelsEntry[1])
  .concat(`${index}`)
  .find(() => true)}`
}