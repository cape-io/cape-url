import Wreck from 'wreck'

const wreck = Wreck.defaults({
  headers: {
    'User-Agent': 'CAPE.io v6',
  },
  maxBytes: 1048576,
  redirects: 5,
  timeout: 5000,
})

export default function fetch(urlString, method = 'GET', opts) {
  return new Promise((success, reject) => {
    wreck.request(method, urlString, opts, (err2, response, payload) => {
      err2.output.payload.url = urlString
      if (err2) return reject(err2)
      return success({ response, payload })
    })
  })
}
