import { ISearch, ISearchResults, ISearchResultsItem } from './interfaces'
import * as _cheerio from 'cheerio'
import * as _url from 'url'
import axios from 'axios'
import * as _querystring from 'querystring'
import { videoFilter, playlistFilter, accountFilter } from './filters'
import { parseResponse } from './parser'

const YT_SEARCH_QUERY_URI = (
    'https://www.youtube.com/results?' +
    'hl=en&gl=US&category=music' +
    '&search_query='
)

const ONE_SECOND = 1000
const ONE_MINUTE = ONE_SECOND * 60
const TIME_TO_LIVE = ONE_MINUTE * 5

const DEFAULT_OPTS = {
    pageStart: 1,
    pageEnd: 3
}

/**
 * Search Youtube
 */
export const search = async (query: ISearch): Promise<ISearchResults> => {
    let opts = Object.assign({}, DEFAULT_OPTS)
    try {
        if (!query) {
            throw new Error('No query given.')
        }

        const q = _querystring.escape(query.search).split(/\s+/)
        const uri = YT_SEARCH_QUERY_URI + q.join('+')

        const tasks = []

        for (let i = opts.pageStart; i < opts.pageEnd; i++) {
            const pageNumber = i
            tasks.push({
                uri,
                pageNumber
            })
        }

        let results: any = []

        let resultsPerPage: any[] = await Promise.all(tasks.map(async task => {
            return findVideos(task.uri, task.pageNumber)
        }))

        // combine results
        resultsPerPage.map((re: any[]) => {
            results.push(...re)
        })

        if (!results || results === []) {
            throw new Error('No results found')
        }

        const videos = results.filter(videoFilter)
        const playlists = results.filter(playlistFilter)
        const accounts = results.filter(accountFilter)

        return {
            videos: videos,
            playlists: playlists,
            accounts: accounts
        }

    } catch (error) {
        console.error(error)
        return {
            videos: [],
            playlists: [],
            accounts: []
        }
    }

}

export const findVideos = async (uri: string, page: number): Promise<ISearchResultsItem[]> => {
    uri += '&page=' + page

    const r: any = await axios({
        method: 'get',
        url: uri
    })
    //  r=status, statusText, headers, config, request, data
    const parsedData = parseResponse(r.data)
    return parsedData
}
