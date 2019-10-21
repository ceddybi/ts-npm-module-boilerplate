export const videoFilter = (result: any) => {
  return (
        result.url.indexOf('watch') >= 0 &&
        result.url.indexOf('&list') === -1 &&
        result.url.indexOf('&user') === -1
    )
}

export const playlistFilter = (result: any) => {
  return result.url.indexOf('list') >= 0
}

export const accountFilter = (result: any) => {
  return result.url.indexOf('user') >= 0
}
