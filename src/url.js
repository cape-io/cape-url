import { flow, includes, omit, partial, partialRight } from 'lodash'
import { parse, format } from 'url'
import Wreck from 'wreck'
import Boom from 'boom'
import humps from 'lodash-humps'
import normalizeUrl from 'normalize-url'
import { setField } from 'cape-lodash'
import processItem from './embedly'

const parseUrl = partialRight(parse, true, true)

const KEY = '9e73207156cb402abab1436405e3b515'

const wreck = Wreck.defaults({
  headers: {
    'User-Agent': 'CAPE.io v6',
  },
  maxBytes: 1048576,
  redirects: 5,
  timeout: 5000,
})

const useSSL = {
  'mica2015.imgix.net': true,
  'vimeo.com': true,
  'youtu.be': true,
  'youtube.com': true,
  'www.youtube.com': true,
  'soundcloud.com': true,
}
export const isYoutube = partial(includes, ['youtu.be', 'youtube.com', 'www.youtube.com'])
export function preferHttps({ hostname, protocol }) {
  return useSSL[hostname] ? 'https:' : protocol
}
export function rmExtraYoutube(urlString) {
  const urlParts = parseUrl(urlString)
  if (isYoutube(urlParts.hostname) && urlParts.query.feature) {
    return format(omit(urlParts, ['query.feature', 'path', 'search']))
  }
  return urlString
}
export const urlFix = flow(
  normalizeUrl,
  rmExtraYoutube,
  parseUrl,
  setField('protocol', preferHttps),
  setField('href', format)
)

// Correct the url input. Follow redirects and such.
export function urlCheck(originalUrl, callback) {
  // Create a set with the original url.
  const urls = new Set([originalUrl])
  const url = urlFix(originalUrl)
  let lastUrl = originalUrl
  function addUrl(urlString) {
    lastUrl = urlString
    urls.add(urlString)
  }
  // Add corrected url to set.
  addUrl(url.href)
  function redirectedCallback(statusCode, location) {
    if (statusCode === 301) {
      addUrl(location)
    } else {
      addUrl(location)
    }
  }
  // @TODO Need to have an auto https checker in here somewhere.
  wreck.request('HEAD', url.href, { redirected: redirectedCallback }, (err, response) => {
    if (err) {
      err.output.payload.url = url
      return callback(err)
    }
    const { headers, statusCode, statusMessage } = response
    if (statusCode !== 200 && statusCode !== 405) {
      if (statusCode === 303 && headers.location) {
        return urlCheck(headers.location, callback)
      }
      const code = statusCode >= 400 ? statusCode : 500
      const err2 = Boom.create(code, statusMessage)
      err2.output.payload.url = url
      if (code !== statusCode) {
        err2.output.payload.message = `Could not handle response code ${statusCode}`
        err2.output.payload.headers = headers
        // err2.output.payload.
      }
      return callback(err2)
    }
    const info = {
      headers,
    }
    // Now make double sure we have a correct url as the last one.
    const finalUrl = urlFix(lastUrl)
    // Add it to the set
    addUrl(finalUrl.href)
    info.url = finalUrl
    info.urls = urls
    return callback(err, info)
  })
}

export function urlCheckPromise(urlString) {
  return new Promise((success, reject) => {
    urlCheck(urlString, (err, res) => {
      if (err) return reject(err)
      return success(res)
    })
  })
}
export function embedlyUrl(href) {
  return `http://api.embed.ly/1/oembed?key=${KEY}&url=${encodeURIComponent(href)}`
}
export function urlInfo(urlString) {
  return new Promise((success, reject) => {
    urlCheckPromise(urlString).then(({ url, urls }) => {
      const reqUrl = embedlyUrl(url.href)

      wreck.get(reqUrl, { json: true }, (err2, response, payload) => {
        if (err2) return reject(err2)
        const data = humps(payload)
        if (data.url) {
          const fixedEmbedlyUrl = urlFix(data.url)
          urls.add(fixedEmbedlyUrl.href)
          data.url = fixedEmbedlyUrl
        } else {
          data.url = url
        }
        data.urls = Array.from(urls)
        const info = processItem(data)
        return success(info)
      })
    })
  })
}
