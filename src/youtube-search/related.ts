import * as _cheerio from 'cheerio'
import * as _url from 'url'
import axios from 'axios'
import * as _querystring from 'querystring'
import { parseResponse, parseRelated } from './parser'
import { videoFilter } from './filters'

export const findRelatedVideos = async (uri: string) => {
  const r: any = await axios({
      method: 'get',
      url: uri
    })
    //  r=status, statusText, headers, config, request, data
  const results = parseRelated(r.data)
  const videos = results.filter(videoFilter)
  return {
      time: new Date(),
      videos,
      count: videos.length
    }
}
