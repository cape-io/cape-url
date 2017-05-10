import test from 'tape'
import { get } from 'lodash'
import urlInfo, { urlFix, urlCheckPromise } from './'

const url1 = 'youtube.com:80/watch?v=8zsBaFTRprk'
const url2 = 'https://youtu.be/8zsBaFTRprk'
const url3 = 'https://youtube.com/watch?feature=youtu.be&v=8zsBaFTRprk'

test('urlFix', (t) => {
  const res1 = urlFix(url1)
  t.equal(res1.protocol, 'https:')
  t.equal(res1.href, 'https://youtube.com/watch?v=8zsBaFTRprk')
  const res2 = urlFix(url2)
  t.equal(res2.href, 'https://youtu.be/8zsBaFTRprk')
  const res3 = urlFix(url3)
  t.equal(res3.href, 'https://youtube.com/watch?v=8zsBaFTRprk')
  t.equal(res3.path, '/watch?v=8zsBaFTRprk')
  t.deepEqual(res3.query, { v: '8zsBaFTRprk' })
  t.end()
})
test('urlCheckPromise', (t) => {
  urlCheckPromise(url2)
  .then((res) => {
    t.equal(res.url.href, 'https://youtube.com/watch?v=8zsBaFTRprk')
    t.equal(res.url.hostname, 'youtube.com')
    t.end()
  })
  .catch((err) => {
    console.error(err.stack)
    t.fail(err)
  })
})
test('urlInfo', (t) => {
  urlInfo(url2)
  .then((res) => {
    // console.log(res)
    t.equal(res.id, '4d15cee3f7d6083e811eedcf4ddcce944432fb2a')
    t.equal(get(res, 'image.height'), 360)
    t.equal(res.linkType, 'VideoObject')
    t.deepEqual(res.author, {
      name: 'Sailing SV Delos',
      url: 'https://www.youtube.com/user/briantrautman',
    })
    t.deepEqual(res.provider, {
      name: 'YouTube',
      url: 'https://www.youtube.com/',
      version: '1.0',
    })
    return 'http://vimeo.com/64954354#'
  })
  .then(urlInfo).then((res) => {
    // console.log(res)
    t.deepEqual(res.author, { name: 'Paul Shapiro', url: 'https://vimeo.com/user4799794' })
    t.deepEqual(res.provider, { name: 'Vimeo', url: 'https://vimeo.com/', version: '1.0' })
    t.equal(res.linkType, 'VideoObject')
    t.end()
  })
  .catch((err) => {
    console.error(err.stack)
    t.fail(err)
  })
})
// urlInfo('vimeo.com/64954354').then(console.log)
