// tslint:disable: no-unused-expression
import { expect } from 'chai'
import { search as yts, findTrendingVideos, findRelatedVideos } from './index'

describe('youtube-search', function () {
  this.timeout(10000)

  it('it should run basic search', async () => {
    const r: any = await yts({
      search: 'philip glass koyaanisqatsi',
      pageStart: 1,
      pageEnd: 2
    })
    expect(r.videos).to.be.an('array').that.is.not.empty
  })

  it('should get trending videos', async () => {
    const r: any = await findTrendingVideos('https://www.youtube.com/feed/trending')
    expect(r.videos).to.be.an('array').that.is.not.empty
  })

  it('should get related videos', async () => {
    const r: any = await findRelatedVideos('https://www.youtube.com/watch?v=Sab6wfnmTcY')
    expect(r.videos).to.be.an('array').that.is.not.empty
  })

})
