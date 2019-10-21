import * as _cheerio from 'cheerio'
import * as _url from 'url'
import axios from 'axios'
import * as _querystring from 'querystring'
import { parseResponse } from './parser'
import { videoFilter } from './filters'

interface ITrending {
  time: Date,
  videos: any[],
  count: number
}
export const findTrendingVideos = async (uri: string): Promise<ITrending> => {
  const r: any = await axios({
      method: 'get',
      url: uri
    })
    //  r=status, statusText, headers, config, request, data
  const results = parseResponse(r.data)
  const videos = results.filter(videoFilter)
  return {
      time: new Date(),
      videos,
      count: videos.length
    }
}
