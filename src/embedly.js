import { merge } from 'lodash'

export default function processItem(rawItem) {
  const {
    authorName, authorUrl,
    description,
    height, html,
    providerName, providerUrl,
    thumbnailUrl, thumbnailHeight, thumbnailWidth, title, type,
    version,
    width,
    ...rest
  } = rawItem
  const info = {
    author: {
      name: authorName,
      url: authorUrl,
    },
    data: {
      description,
      title,
      html,
      rest,
    },
    preview: {
      image: thumbnailUrl ? { url: thumbnailUrl, height: thumbnailHeight, width: thumbnailWidth } : undefined,
    },
    provider: {
      name: providerName,
      url: providerUrl,
      version,
    },
    size: {
      height,
      width,
    },
    type: type === 'photo' ? 'image' : type,
  }

  if (!info.preview.image && info.type === 'image') {
    info.preview.image = { url: rawItem.url.href, ...info.size }
  }
  return merge(rest, info)
}


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
// time:
//   created: (dateTime) time created
//   updated: (dateTime) last modified
// title: (string)
// type: (string) (event, video, image, audio, website)
// url: (url) Corrected URL. Allow custom scheme.
