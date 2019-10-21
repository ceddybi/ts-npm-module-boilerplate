import { IRelatedVideos, ISearchResultsItem } from './interfaces';
import * as _cheerio from 'cheerio'

// parse the plain text response body with jsom to pin point song information
export const parseResponse = (responseText: string): ISearchResultsItem[] => {

    const $ = _cheerio.load(responseText)
    // var _delta = Date.now() - _time;
    // console.log("parsing response with cheerio, took: " + _delta + " ms");
    // var titles = $('.yt-lockup-title');
    let contents = $('.yt-lockup-content')
    // console.log("titles length: " + titles.length);
    let songs = []

    for (let i = 0; i < contents.length; i++) {
        let content = contents[i]
        let description = $('.yt-lockup-description', content)
        let title = $('.yt-lockup-title', content)

        let a = $('a', title)
        let span = $('span', title)
        let duration = parseDuration(span.text())

        let href = a.attr('href') || ''

        let videoId = href.split('=')[1]

        let metaInfo = $('.yt-lockup-meta-info', content)
        let metaInfoList = $('li', metaInfo)
        // console.log(metaInfoList)
        let agoText = $(metaInfoList[0]).text()
        let viewsText = $(metaInfoList[1]).text()
        // console.log(agoText)
        // console.log(viewsText)
        let viewsCount = Number(viewsText.split(' ')[0].split(',').join('').trim())
        let user = $('a[href^="/user/"]', content)
        let userId = (user.attr('href') || '').replace('/user/', '')
        let userName = user.text()
        let channel = $('a[href^="/channel/"]', content)
        let channelId = (channel.attr('href') || '').replace('/channel/', '')
        let channelName = channel.text()

        let song = {
            title: a.text(),
            description: description.text(),
            url: href,
            videoId: videoId,
            seconds: Number(duration.seconds),
            timestamp: duration.timestamp,
            duration: duration,
            ago: agoText,
            views: Number(viewsCount),

            author: {
                // simplified details due to YouTube's funky combination
                // of user/channel id's/name (caused by Google Plus Integration)
                name: userName || channelName,
                id: userId || channelId,
                url: user.attr('href') || channel.attr('href'),

                // more specific details
                userId: userId,
                userName: userName,
                userUrl: user.attr('href') || '',

                channelId: channelId,
                channelName: channelName,
                channelUrl: channel.attr('href') || ''
            }
        }

        // console.log('"' + song.title + '" views: ' + song.views)

        songs.push(song)
    }

    return songs
}

export const parseRelated = (responseText: string): IRelatedVideos[] => {
    const $ = _cheerio.load(responseText)
    // var _delta = Date.now() - _time;
    // console.log("parsing response with cheerio, took: " + _delta + " ms");
    // var titles = $('.yt-lockup-title');
    let watchRelated = $('.related-list-item')
    let items = []

    for (let i = 0; i < watchRelated.length; i++) {
        let content = watchRelated[i]
        let wrapper = $('.content-wrapper', content)
        let thumbWrapper = $('.thumb-wrapper', content)
        let durationSpan = $('.video-time', thumbWrapper).text()

        // let description = null; // $('.yt-lockup-description', content)

        // this is an a element with children spans
        let TitleC = $('.content-link', wrapper)
        let title = TitleC.attr('title') || ''
        let href = TitleC.attr('href') || ''
        // let durationSpan = $('.accessible-description', TitleC).text()
        // durationSpan.replace('- Duration: ', '')
        let duration = parseDuration(durationSpan)
        let videoId = href.split('=')[1]

        let channelName = $('.attribution', TitleC).text()
        let viewsCount: any = $('.view-count', TitleC)
        if (viewsCount.children().length > 0) {
            $('.yt-badge-list', viewsCount).remove()
        }

        viewsCount = viewsCount.text()

        viewsCount = viewsCount.replace(' views', '')
        viewsCount = Number(viewsCount.split(' ')[0].split(',').join('').trim())

        let song: IRelatedVideos = {
            title,
            // description,
            url: href,
            videoId: videoId,
            seconds: Number(duration.seconds),
            timestamp: duration.timestamp,
            duration: duration,
            // ago: agoText,
            views: Number(viewsCount),

            author: {
                channelName: channelName
            }
        }

        // console.log('"' + song.title + '" views: ' + song.views)

        items.push(song)
    }

    return items
}

export const parseDuration = (timestampText: string) => {
    let a = timestampText.split(' ')
    let timestamp = a[a.length - 1].replace(/[^:\d]/g, '')

    let t = timestamp.split(':')

    let seconds = 0
    let exp = 0
    for (let i = t.length - 1; i >= 0; i--) {
        if (t[i].length <= 0) continue
        let numberX = t[i].replace(/\D/g, '')
        // var exp = (t.length - 1) - i;
        // tslint:disable-next-line: radix
        seconds += parseInt(numberX) * (exp > 0 ? Math.pow(60, exp) : 1)
        exp++
        if (exp > 2) break
    }

    return {
        toString: function () { return seconds + ' seconds (' + timestamp + ')' },
        seconds: seconds,
        timestamp: timestamp
    }
}
