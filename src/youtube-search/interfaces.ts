import { ISearchResults } from './interfaces';

export interface ISearch {
    search: string
    pageStart: number
    pageEnd: number
}


export interface IRelatedVideos {
    title: string
    url: string
    videoId: string
    seconds: number
    timestamp: string
    duration: {
        toString: () => string;
        seconds: number
        timestamp: string
    },
    views: number

    author: {
        channelName: string;
    }
}



export interface ISearchResultsItem extends IRelatedVideos {
    description: string
    ago: string
    author: {
        // simplified details due to YouTube's funky combination
        // of user/channel id's/name (caused by Google Plus Integration)
        name: string
        id: string
        url: string
        // more specific details
        userId: string
        userName: string
        userUrl: string
        channelId: string
        channelName: string
        channelUrl: string
    }
}

export interface ISearchResults {
    videos: ISearchResultsItem[],
    playlists?: any,
    accounts?: any
}