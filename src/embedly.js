import { flow } from 'lodash'
import sha1 from 'node-sha1'
import { setWith } from 'cape-lodash'

export function getAuthor({ authorName, authorUrl, ...rest }) {
  return {
    ...rest,
    author: {
      name: authorName,
      url: authorUrl,
    },
  }
}
export function getImage({ thumbnailUrl, thumbnailHeight, thumbnailWidth, ...rest }) {
  if (!thumbnailUrl) return rest
  // Perhaps change the thumbnailUrl when ImageObject?
  return {
    ...rest,
    image: {
      height: thumbnailHeight,
      url: thumbnailUrl,
      width: thumbnailWidth,
    },
  }
}
export const linkTypes = {
  audio: 'AudioObject',
  photo: 'ImageObject',
  video: 'VideoObject',
}
export const getLinkType = ({ type, ...rest }) => ({
  ...rest,
  linkType: linkTypes[type] || type,
})

export function getProvider({ providerName, providerUrl, version, ...rest }) {
  return {
    ...rest,
    provider: {
      name: providerName,
      url: providerUrl,
      version,
    },
  }
}

export default flow(
  getAuthor,
  getImage,
  getLinkType,
  getProvider,
  setWith('id', 'url.href', sha1),
)

// content:
//   raw: (anything)
//   json: (json) if possible. yaml to json. md to json/html
//   html: markdown to html
// deleted: (bool)
// description: (title)
// etag: (string)
// ext: (string) ext. Use 4 letter extension if possible. (jpeg, html, yaml, png)
// foreignKey: (string) Object id used by provider.
// html: (iframe)
// id: uuid hash of `url` or `uri`
// geo:
//   type: (string) Point
//   coordinates: (array) [ -122.423246, 37.779388 ]
// md5: hash of file
// file:
//   ext: (string)
//   dir: (string)
//   dir[n]: (string)
//   region: (string)
//   path: full path
//   prefix: (string)
//   name: (string)
// preview:
//   image:
//     height: (number)
//     width: (number)
//     url: (url)
// provider:
//   id: (string)
//   name: (string)
//   url: (url)
//   version: (string) API version at provider
// revision: (number or string)
// size:
//   height: (number)
//   width: (number)
//   seconds: (number)
//   bytes: (number)
//   unit: (string) (kb, mb, gb)
//   value: (float) with two decimal places
// subject:
//   [idOfObject]:
//     fieldId: (string)
//     userId: (string)
// taxonomy: (object) probably?
// title: (string)
// type: (string) (event, video, image, audio, website)
// url: (url) Corrected URL. Allow custom scheme.
