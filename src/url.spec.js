import test from 'tape'
import { urlFix, urlCheckPromise } from './url'

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
  t.end()
})
// test('urlCheckPromise', (t) => {
//   urlCheckPromise(url2)
//   .then((res) => {
//     console.log(res)
//   })
//   t.end()
// })
// urlInfo('vimeo.com/64954354').then(console.log)
