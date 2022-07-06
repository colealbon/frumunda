import {hash} from 'tweetnacl';

export const removePunctuation = (text) => {
    return text.replace(/[/?–…".,#!$%^&*;:{}=\-_`~()'’‘“”—]/g,"").replace(/\n/g," ").replace(/\s{2,}/g," ").toLowerCase()
  }
  
export const removeTrackingGarbage = (text) => {
return text.replace(/read full article at rtcom.*$/g,"")
.replace(/appeared first on.*$/g,"")
.replace(/\[httpstheinterceptcom.*$/g,"")
.replace(/\[httpselectrekcowebstories.*$/g,"")
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