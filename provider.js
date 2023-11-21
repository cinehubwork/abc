// import axios from 'axios'
const axios = require("axios")
const cheerio = require("cheerio")
const url = require("url")
// import cheerio from 'cheerio'
// import url from 'url'
// import FormData from 'form-data';

const URL = {
    DOMAIN: "https://subnhanh.im/",
    URL_GET_LINK_STREAM: "https://api-v3.bongngo.info/ajax/episodes",
    SEARCH: "https://subnhanh.im/search?query=",
    HEADERS: {
        'Origin': '',
        'Accept-Language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
    }
}
// const agent = new https.Agent({
//     rejectUnauthorized: false
// });

export default class SubNhanh {
    props = {}
    constructor(param) {
        this.props = param
        //console.log("constructor", this.props)
    }
    getHomeMovies = async () => {
        try {

            //   axios.get('https://something.com/foo');
            let response = await axios.get(URL.DOMAIN)
            const $ = cheerio.load(response.data)
            const listCollection = $(".container")
            let listCollectionMovie = []
            let allMovies = []
            for (let i = 0; i < listCollection.length; i++) {
                let listMovieInCollection = $(listCollection[i]).find(".item")
                let collectionName = $(listCollection[i]).find(".section-title").first().text().trim().replace(/\n/g, '').replace(/  /g, '')
                let urlSeeMore = ""


                let listMovie = []
                for (let index = 0; index < listMovieInCollection.length; index++) {
                    let movieInHtml = listMovieInCollection[index]
                    let movie = this.getItemMove($, movieInHtml)
                    listMovie.push(movie)
                    allMovies.push(movie)
                }
                let collection = {
                    name: collectionName,
                    urlDetail: urlSeeMore,
                    hasSeemore: urlSeeMore != '' ? true : null,
                    type: 0,
                    isLocal: false,
                    isActive: true,
                    index: 1,
                    movies: listMovie
                }
                listCollectionMovie.push(collection)
            }

            //banner

            let listBanner = allMovies.sort(function () { return 0.5 - Math.random() })

            let banners = []
            for (let index = 0; index < listBanner.length; index++) {
                const element = listBanner[index]
                let banner = {
                    urlPhoto: element.urlPhoto,
                    title: element.title,
                    urlDetail: element.urlDetail
                }
                banners.push(banner)
            }
            // console.log("ListBanner",banners);
            return {
                success: true,
                data: {
                    listBanners: banners,
                    collections: listCollectionMovie
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error
            }
        }
    }

    getLinkStreamFromEpisodeData = async (fid, epId, urlAjax) => {
        try {
            let listServer = []
            listServer.push({
                typeplay: "iframe",
                namesv: "Server HLS",
                key: "hls"
            })
            listServer.push({
                typeplay: "iframe",
                namesv: "Server VIP2",
                key: "vipp"
            })
            // listServer.push({
            //     typeplay: "iframe",
            //     namesv: "Server VIP3",
            //     key: "okru_str"
            // })
            let listBackupServer = []
            for (let index = 0; index < listServer.length; index++) {
                const server = listServer[index]
                let urlRequest = `${URL.DOMAIN}${urlAjax.substring(1)}` //'https://subnhanh.net/frontend/default/ajax-player'
                const form_data = new FormData()
                form_data.append('epId', epId)
                form_data.append('type', server.key)
                // const headers = form_data.getHeaders();
                // headers['X-Requested-With'] = 'XMLHttpRequest'
                let headers = {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'X-Requested-With': 'XMLHttpRequest'
                }
                try {
                    let res = await axios.post(urlRequest, form_data, { headers })
                    //console.log('---->', res.data);
                    const $ = cheerio.load(res.data)
                    let linkIframe = $("iframe").attr("src")
                    server.linkIframe = linkIframe //https://streamasia.cloud/public/dist/indexsubnhanh.html?id=c827c9153912746096435039f52ed124

                    var url_parts = url.parse(linkIframe, true)
                    var id = url_parts.query.id

                    if (id) {
                        let hostname = url_parts.hostname
                        let urlPlaylist = `https://${hostname}/playlist/${id}/${new Date().getTime()}.m3u8`
                        server.urlPlaylistHls = urlPlaylist
                        let sourcePlaylist = await this.getQualityHls(urlPlaylist, hostname)
                        //console.log('sourcePlaylist', sourcePlaylist)
                        listBackupServer.push({
                            typeplay: server.typeplay,
                            namesv: server.namesv + "(Dự phòng)",
                            linkIframe: server.linkIframe
                        })
                        server.sourcePlaylist = sourcePlaylist
                    } else if (url_parts.query.vid) {
                        id = url_parts.query.vid
                        let hostname = url_parts.hostname
                        let urlPlaylist = `https://${hostname}/hls/v2/${id}/playlist.m3u8`
                        server.urlPlaylistHls = urlPlaylist
                        let sourcePlaylist = []
                        let quality = {}
                        quality.urlStream = urlPlaylist
                        quality.name = 'HD'
                        sourcePlaylist.push(quality)
                        //console.log('sourcePlaylist', sourcePlaylist)
                        listBackupServer.push({
                            typeplay: server.typeplay,
                            namesv: server.namesv + "(Dự phòng)",
                            linkIframe: server.linkIframe
                        })
                        server.sourcePlaylist = sourcePlaylist
                    }
                } catch (errorApi) {
                    //console.log('ERROR API ',errorApi)
                }

            }

            listServer.push(...listBackupServer)
            return {
                success: true,
                data: listServer,
            }
        } catch (error) {
            return {
                success: false,
                message: error.toString(),
            }
        }
    }

    /**
     * parse HTML and get  movie from search query
     * @returns json data which has list  movie or error message
     */
    searchMovie = async function (query) {
        try {
            let urlSearch = `${URL.SEARCH}${query}`
            return await this.parseHtmlSearchPage(urlSearch)

        } catch (error) {
            return {
                success: false,
                message: error.toString()
            }
        }
    }

    /**
     * parse HTML and get  movie from search filter
     * @returns json data which has list  movie or error message
     */
    searchMovieByFilter = async function (key, value) {
        try {
            let urlSearch = `${URL.DOMAIN}${value.substring(1)}`
            return await this.parseHtmlSearchPage(urlSearch)
        } catch (error) {
            //console.log("Error ",error)
            return {
                success: false,
                message: error.toString()
            }
        }
    }

    /**
     * parse HTML and get  movie from search urlSearch
     * @returns json data which has list  movie or error message
     */
    searchMovieByURL = async function (urlSearch) {
        try {
            return await this.parseHtmlSearchPage(urlSearch)

        } catch (error) {
            return {
                success: false,
                message: error.toString()
            }
        }
    }
    /**
     * parse HTML and get infomation detail movie from URL Detail Movie Page
     * @param {*} urlDetail url detail movie page
     * @returns json data which has list collection movie or error message
     */
    getDetailMovie = async function (urlDetail) {
        try {
            //console.log("getDetailMovie ----->", urlDetail)
            let response = await axios.get(urlDetail)
            console.log("getDetailMovie ----->", response.data)
            const $ = cheerio.load(response.data)
            let realName = $(".header-title").text().split(',')[1].trim()
            let other = URL.DOMAIN + $(".button_xemphim").attr("href").substring(1)
            let listDataHtml = $(".header-short-description > div")
            let movie = {
                realName,
                other
            }
            for (let index = 0; index < listDataHtml.length; index++) {
                const data = $(listDataHtml[index]).text()
                if (data.includes("Thể loại:")) {
                    let genre = data.replace("Thể loại:", "").trim()
                    movie.category = genre
                } else if (data.includes("Quốc gia:")) {
                    movie.country = data.replace("Quốc gia:", "").trim()
                } else if (data.includes("Diễn viên:")) {
                    movie.actors = data.replace("Diễn viên:", "").trim()
                } else if (data.includes("Đạo diễn:")) {
                    movie.director = data.replace("Đạo diễn:", "").trim()
                } else if (data.includes("Thời lượng:")) {
                    movie.duration = data.replace("Thời lượng:", "").trim()
                } else if (data.includes("Năm")) {
                    movie.year = data.replace("Năm sản xuất:", "").trim()
                }
            }
            let lichChieu = $(listDataHtml.last()).text()
            movie.rate = "6"
            movie.description = lichChieu + "<br>" + $("#review .rtb").html()
            let meta = $(".header-short-description meta")
            for (let index = 0; index < meta.length; index++) {
                const data = $(meta[index])
                if ($(data).attr("itemprop") == 'thumbnailUrl') {
                    movie.urlBackdrop = URL.DOMAIN + $(data).attr("content").substring(1)
                }
            }
            movie.urlReview = urlDetail
            let relateMovieHtml = $(".item-list-wrapper .item") //.more .los .box
            let listRelateMovie = []
            for (let index = 0; index < relateMovieHtml.length; index++) {
                let movieInHtml = relateMovieHtml[index]
                let movie = this.getItemMove($, movieInHtml)
                listRelateMovie.push(movie)
            }
            movie.listMovieRelate = JSON.stringify(listRelateMovie)
            return {
                success: true,
                data: movie
            }
        } catch (error) {
            //console.log("getDetailMovie ERROR", error)
            return {
                success: false,
                message: error.toString()
            }
        }


    }

    /**
     * Parse HTML to get id token episode list from url stream page
     * @param {*} urlOther 
     * @returns 
     *              var fcurrentid = '2260';
                    var fcurrentEpId = '44056';
                    var ajaxPlayerUrl = '/frontend/default/ajax-player';
                    var urlUpdateView = '/update-view';
     */
    getListServerAndEpisode = async function (urlOther) {
        try {

            let response = await axios.get(urlOther)
            let $ = cheerio.load(response.data)
            let html = $.html()

            let idMovie = this.getParamFromJS(html, "fcurrentid")
            let idEpisode = this.getParamFromJS(html, "fcurrentEpId")
            let ajaxPlayerUrl = this.getParamFromJS(html, "ajaxPlayerUrl")


            console.log(`DATA = ${ajaxPlayerUrl} , ${idEpisode} , ${idMovie}`)
            const form_data = new FormData()
            form_data.append('film_id', idMovie)
            form_data.append('ep_id', idEpisode)
            // const headers = form_data.getHeaders();
            // headers['X-Requested-With'] = 'XMLHttpRequest'
            let headers = {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest'
            }
            let resListEp = await axios.post(`${URL.DOMAIN}ajax/list-episode`, form_data, { headers })
            $ = cheerio.load(resListEp.data)
            let bongNgoDataEpisode = {}

            let epg = $('.collection-list-wrapper') // list group ep
            let listGroup = []
            // parse list group episode
            for (let index = 0; index < epg.length; index++) {
                const groupEpisodeHtml = epg[index]
                let groupEpisode = {}
                groupEpisode.titleGroup = $(groupEpisodeHtml).find('h4').text()
                let liListEpisodeHtml = $(groupEpisodeHtml).find('.collection-list .collection-item')
                let list = []
                // parse list episode inside group
                for (let indexEpisode = 0; indexEpisode < liListEpisodeHtml.length; indexEpisode++) {
                    const episodeHtml = liListEpisodeHtml[indexEpisode]
                    let episode = {}

                    let url = URL.DOMAIN + $(episodeHtml).find("a").attr("href").substring(1)
                    let name = $(episodeHtml).find("a").text()
                    // let id = $(episodeHtml).find("a").attr('data-id')
                    // let fId = $(episodeHtml).find("a").attr('data-fid')
                    // let dataKey = $(episodeHtml).find("a").attr('data-key')

                    episode.urlEp = url
                    episode.name = name
                    // episode.id = id
                    // episode.fId = fId
                    // episode.dataKey = dataKey

                    list.push(episode)
                }
                groupEpisode.episodeList = (list)
                listGroup.push(groupEpisode)
            }

            bongNgoDataEpisode.listGroupEpisode = (listGroup)
            bongNgoDataEpisode.idEpisode = (idEpisode)
            bongNgoDataEpisode.idFilm = (idMovie)
            bongNgoDataEpisode.tokenIndexEpisode = (ajaxPlayerUrl)
            return {
                success: true,
                data: bongNgoDataEpisode
            }
        } catch (error) {
            return {
                success: false,
                message: error.toString(),
            }
        }
    }



    // ----------- Utils --------------------------------------------------------------------------------------------------
    /**
     *              var fcurrentid = '2260';
                    var fcurrentEpId = '44056';
                    var ajaxPlayerUrl = '/frontend/default/ajax-player';
                    var urlUpdateView = '/update-view';
     * @param {*} str 
     * @param {*} key 
     * @returns 
     */
    getParamFromJS = (str, key) => {
        let firstIndex = str.indexOf(key) + key.length + 4 // 4 to index point to first char.
        let temp = str.substring(firstIndex)
        let lastIndex = temp.indexOf(";") - 1
        let idMovie = temp.substring(0, lastIndex) // var fcurrentid = '2260'; -> 2260
        return idMovie
    }

    parseHtmlSearchPage = async function (urlSearch) {
        try {
            //   axios.get('https://something.com/foo');
            const url = encodeURI(urlSearch)
            //console.log("HTML ----> ", url)

            let response = await axios.get(url)
            const $ = cheerio.load(response.data)
            const listCollection = $("#all-items")
            let listMovieInCollection = $(listCollection).find(".item")
            let listMovie = []
            for (let index = 0; index < listMovieInCollection.length; index++) {
                let movieInHtml = listMovieInCollection[index]
                let movie = this.getItemMove($, movieInHtml)
                listMovie.push(movie)
            }
            // let listType = getFilterItem($, $("#filter-eptype option"))
            let listGenre = this.getFilterItem($, $(".top_menu .sub-menu").first().find('li'))
            let listCountry = this.getFilterItem($, $(".top_menu .sub-menu").last().find('li'))
            // let listYear = getFilterItem($, $("#filter-year option"))


            let data = {
                listMovie,
                // listTypeFlixtor: listType,
                listGenerFlixtor: listGenre,
                listCountryFlixtor: listCountry,
                // listYearFlixtor: listYear,
                currentUrl: urlSearch
            }
            data = this.getPagingResult(data, $)
            return {
                success: true,
                data: data
            }

        } catch (error) {
            //console.log("ERROR",error)
            return {
                success: false,
                message: error.toString()
            }
        }
    }
    detectURLs = function (message) {
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
        return message.match(urlRegex)[0].replace("\"", "").replace("\'", "")
    }
    getItemMove = function ($, htmlMovie) {
        let title = $(htmlMovie).find(".item-block-title").last().text()
        //console.log("TITLE ->",title)
        let status = $(htmlMovie).find(".badge").text()
        let urlDetail = URL.DOMAIN + $(htmlMovie).find(".item-block-title").attr("href").substring(1)
        const variable = $(htmlMovie).find(".item-image-block").first().attr("style")
        var urlPhoto = variable.match(/url\(["']?([^"']*)["']?\)/)[1]
        return {
            title,
            status,
            urlDetail,
            urlPhoto
        }
    }


    /**
    * this function will get all page to load Loadmore list 
    * @param {pageMovie} pageMovie get list page can reach when search movie
    * @param {*} $ html dom 
    */
    getPagingResult = function (pageMovie, $) {
        let tagPageResult = $("#pagination").html()
        if (tagPageResult == null || this.isEmpty(tagPageResult)) { // only one page
            pageMovie.isHasNextPage = false
        } else {
            let listLiPage = $("li")
            if (listLiPage != null && !this.isEmpty(listLiPage)) {
                for (let i = 0; i < listLiPage.length; i++) {
                    let li = listLiPage[i]
                    if ($(li).attr("class") != null && $(li).attr("class").includes("active")) {
                        pageMovie.index = i
                        if (i == listLiPage.length - 1) {
                            //last page
                            pageMovie.isHasNextPage = false
                            ////console.log("2")

                        } else {
                            if (listLiPage.get(i + 1) != null) {
                                let nextLi = listLiPage[i + 1]
                                let a = $(nextLi).find("a")
                                if (a != null && !this.isEmpty(a)) {
                                    let nextUrl = $(a).first().attr("href")
                                    if (!nextUrl.includes(URL.DOMAIN)) {
                                        nextUrl = URL.DOMAIN + nextUrl.substring(1)
                                    }
                                    pageMovie.urlNextPage = (nextUrl)
                                    pageMovie.isHasNextPage = true
                                    ////console.log("asdasdasdsa3")
                                } else {
                                    pageMovie.isHasNextPage = false
                                    ////console.log("4")
                                }
                            } else {
                                pageMovie.isHasNextPage = false
                                ////console.log("5")
                            }
                        }
                        break
                    }
                }
            } else {
                pageMovie.isHasNextPage = false
                ////console.log("6")
            }
        }
        //        }
        return pageMovie
    }


    isEmpty = (array) => {
        return array == null || array.length == 0
    }
    getFilterItem = function ($, html) {
        //console.log('getFilterItem ', html.length)
        let listFilter = []
        for (let index = 0; index < html.length; index++) {
            const option = html[index]
            let name = $(option).text()
            let value = $(option).find('a').attr('href')
            let content = name
            let id = value
            if (value != '') {
                listFilter.push({
                    id,
                    name,
                    content,
                    value
                })
            }
        }
        return listFilter
    }


    parseM3U8Playlist = function (domain, input) {
        let split = input.split("#EXT-X-STREAM-INF")
        let listQuality = []
        for (var i = 1; i < split.length; i++) {
            let strQuality = split[i]
            let nameQuality = strQuality.substring(strQuality.indexOf("RESOLUTION="), strQuality.indexOf("/"))
            let shortNameQuality = nameQuality.substring(nameQuality.indexOf("x") + 1).trim() + "p"
            let urlQuality = strQuality.substring(strQuality.indexOf("/")).trim()
            let quality = {}
            quality.urlStream = (`https://${domain}${urlQuality}`)
            quality.name = (shortNameQuality)
            listQuality.push(quality)
        }
        return listQuality
    }
    getQualityHls = async function (urlPlaylist, domain) {
        let response = await axios.get(urlPlaylist)
        let playlistHls = response.data
        //console.log('getQualityHls',playlistHls)
        return this.parseM3U8Playlist(domain, playlistHls)
    }
}


/**
 * Parse HTML to get id token episode list from url stream page
 * @param {*} urlOther 
 * @returns 
 */
export async function getLinkStreamFromEpisodeData2(epId) {
    try {
        const config = {
            method: 'post',
            url: 'https://subnhanh.im/frontend/default/ajax-player',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'multipart/form-data'
            }
        }
        const form_data = new FormData()
        form_data.append('epId', epId)
        form_data.append('type', 'hls')
        const headers = form_data.getHeaders()
        headers['X-Requested-With'] = 'XMLHttpRequest'
        let res = await axios.post('https://subnhanh.im/frontend/default/ajax-player', form_data,
            { headers })

        //console.log('---->', res.data);
        return {
            success: true,
            message: res.data,
        }
    } catch (error) {
        return {
            success: false,
            message: error.toString(),
        }
    }
}




