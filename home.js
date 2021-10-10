import axios from 'axios';
import cheerio from 'cheerio';
// import https from 'https';
import url from 'url';
import FormData from 'form-data';

const URL = {
    DOMAIN: "https://xemphimgis.net/",
    URL_GET_LINK_STREAM: "https://xemphimgis.net/wp-admin/admin-ajax.php",
    URL_STREAM: "http://phimhd.xyz/player.html",
    SEARCH: "https://xemphimgis.net/search/",
    HEADERS: {
        'Origin': '',
        'Accept-Language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
    }
};
// const agent = new https.Agent({
//     rejectUnauthorized: false
// });

export default class XemPhimGi {
    props = {}
    constructor(param) {
        this.props = param
        //console.log("constructor", this.props)
    }
/**
     * parse HTML and get collection movie from Homepage
     * @returns json data which has list collection movie or error message
     */
    getHomeMovies = async function () {
        try {
            //   axios.get('https://something.com/foo');
            let response = await axios.get(URL.DOMAIN)
            const $ = cheerio.load(response.data);
            const listCollection = $("section")
            let listCollectionMovie = []
            for (let i = 0; i < listCollection.length; i++) {
                let listMovieInCollection = $(listCollection[i]).find(".halim_box").first().find(".col-md-3")
                let collectionName = $(listCollection[i]).find(".section-heading").first().text().trim().replace(/\n/g,'').replace(/  /g,'')
                let urlSeeMore = ""
                let listMovie = []
                for (let index = 0; index < listMovieInCollection.length; index++) {
                    let movieInHtml = listMovieInCollection[index];
                    let movie = this.getItemMove($, movieInHtml)
                    listMovie.push(movie)
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
            let listBanner =  $('.wrap-slider .halim-item')
            let banners = []
            console.log("LIST BANNER ---->",`listbanner ---> ${listBanner.length}`)
            for (let index = 0; index < listBanner.length; index++) {
                const htmlMovie = listBanner[index];
                let title = $(htmlMovie).find(".entry-title").text().split('-')[0].trim()
                let realName = $(htmlMovie).find(".original_title").text()
                console.log("TITLE ->", title)
                let status = $(htmlMovie).find(".episode").text()
                let urlDetail = $(htmlMovie).find(".halim-thumb").attr("href")
                var urlPhoto = $(htmlMovie).find(".lazy").attr("src")
                let banner = {
                    urlPhoto: urlPhoto,
                    title:  title,
                    urlDetail: urlDetail
                }
                banners.push(banner)
            }
            return {
                success: true,
                data: {
                    listBanners:banners,
                    collections: listCollectionMovie
                }
            }
        } catch (error) {
            loge(error.toString())
            return {
                success: false,
                message: error
            }
        }
    }

    getLinkStreamFromEpisodeData = async (fid, epId, nonce) => {
        try {

            let listServer = []
            // let urlRequest = URL.URL_GET_LINK_STREAM //'https://subnhanh.net/frontend/default/ajax-player'
            // let form_data = new FormData();
            // form_data.append('action', 'halim_get_listsv');
            // form_data.append('nonce', nonce);
            // form_data.append('episode', epId);
            // form_data.append('server', 1);
            // form_data.append('postid', fid);
            // let headers = form_data.getHeaders();
            // headers['X-Requested-With'] = 'XMLHttpRequest'
            // try {
            //     let resGetListServer = await axios.post(urlRequest, form_data, { headers });
            //     console.log("DuongKK ", resGetListServer.data)
            //     let $ = cheerio.load(resGetListServer.data)
            //     let listSvHtml = $('.get-eps')
            //     for (let index = 0; index < listSvHtml.length; index++) {
            //         const svHtml = listSvHtml[index];
            //         let key = $(svHtml).attr('data-url')
            //         if(key != '2'){ // 2 is 'https://playhydrax.com/?v=-eV0xYYlA' which contain ads and web not support in client
            //             listServer.push({
            //                 typeplay: "iframe",
            //                 namesv: $(svHtml).text(),
            //                 key: key
            //             })
            //         }
                    
            //     }
            // } catch (e) {
            //     console.log(e.toString())
            // }
            listServer.push({
                typeplay: "iframe",
                namesv: "Server HLS",
                key: "phimhd"
            })
            for (let index = 0; index < listServer.length; index++) {
                const server = listServer[index];
                let urlRequest = URL.URL_GET_LINK_STREAM 
                const form_data = new FormData();
                form_data.append('action', 'halim_ajax_player');
                form_data.append('nonce', nonce);
                form_data.append('episode', epId);
                form_data.append('server', 1);
                form_data.append('postid', fid);
                form_data.append('ipv', 4);
                // form_data.append('ep_link', server.key);
                let  headers =  {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'X-Requested-With':'XMLHttpRequest'
                }
                headers['X-Requested-With'] = 'XMLHttpRequest'
                try {
                    let res = await axios.post(urlRequest, form_data, { headers });

                    console.log('---->', res.data);
                    const $ = cheerio.load(res.data)
                    let linkIframe = $("iframe").attr("src")
                    if(linkIframe == null){
                        console.log("IFRAME is null ---> Error")
                        return {
                            success: false,
                            message: "Phim hiện không có sẵn. Vui lòng đổi nguồn phim khác để xem nhé!",
                        }
                    }
                    if(linkIframe.includes("&ads")){
                        linkIframe = linkIframe.substring(0,linkIframe.indexOf('&ads'))
                    }
                    server.linkIframe =`${URL.URL_STREAM}?src=${linkIframe}` //'http://phimhd.xyz/player.html?src=https://play.gotphim.com/public/index.html?id=612af48c367688172dd64f00&amp;subs=&amp;lang=vietnam'  //https://play.gotphim.com/public/index.html?id=612af48c367688172dd64f00&amp;subs=&amp;lang=vietnam'// //http://phimhd.xyz/player.html?src=https://play.gotphim.com/public/index.html?id=612750d2a61bd1068779bde5&subs=&lang=vietnam

                    var url_parts = url.parse(linkIframe, true);
                    var id = url_parts.query.id;
                    if (id) {
                        let hostname = url_parts.hostname
                        let urlPlaylist = `https://${hostname}/player/${id}/playlist.m3u8`
                        server.urlPlaylistHls = urlPlaylist
                        let quality = {};
                        quality.urlStream = urlPlaylist;
                        quality.name = 'HD';
                        let sourcePlaylist = []
                        sourcePlaylist.push(quality)
                        console.log('sourcePlaylist', sourcePlaylist)
                        server.sourcePlaylist = sourcePlaylist
                    }
                } catch (errorApi) {
                    console.log('ERROR API ', errorApi)
                }

            }
            let finalServer = []
            for (let index = 0; index < listServer.length; index++) {
                const element = listServer[index];
                if(element.linkIframe){
                    finalServer.push(element)
                }
            }
            if(finalServer.length >0){
                return {
                    success: true,
                    data: listServer,
                }
            }else{
                return {
                    success: false,
                    data: "Phim hiện không có sẵn. Vui lòng đổi nguồn phim khác để xem nhé!",
                }
            }
            
        } catch (error) {
            console.log(error.toString())
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
            let type = key == "formality" ? value : "formality"
            let country = key == "country" ? value : "country"
            let release = key == "release" ? value : "release"
            let category = key == "category" ? value : "category"
            let url = `${URL.DOMAIN}filter-movies/sort/${type}/status/${country}/${release}/${category}/`
            return await this.parseHtmlSearchPage(url)
        } catch (error) {
            //console.log("Error ", error)
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
            //console.log("getDetailMovie ----->", response.data)
            const $ = cheerio.load(response.data)
            let realName = $(".movie-detail .org_title").text().trim()
            let other = $(".halim-watch-box a").first().attr("href")
            let listDataHtml = $(".movie-detail > p")
            let movie = {
                realName,
                other
            }
            for (let index = 0; index < listDataHtml.length; index++) {
                const data = $(listDataHtml[index]).text();
                if (data.includes("Thể loại: ")) {
                    let genre = data.replace("Thể loại: ", "").trim()
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
                    movie.year = data.replace("Năm: ", "").trim()
                }
            }
            movie.rate = "6"
            movie.description = $(".entry-content").html()
            movie.urlBackdrop = $(".movie-thumb").attr("src")
            movie.urlReview = urlDetail
            let relateMovieHtml = $("#halim-carousel-widget-4 .halim-item") //.more .los .box
            let listRelateMovie = []
            for (let index = 0; index < relateMovieHtml.length; index++) {
                let movieInHtml = relateMovieHtml[index];
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


            let jsonAjaxConfig = this.getParamFromJS(html, "ajax_player = {")
            //console.log("jsonAjaxConfig , ", jsonAjaxConfig.nonce)
            let nonce = jsonAjaxConfig.nonce

            let jsonAjaxPostIdConfig = this.getParamFromJS(html, "halim = {")
            //console.log("jsonAjaxPostIdConfig , ", jsonAjaxConfig.post_id)
            let postId = jsonAjaxPostIdConfig.post_id
            console.log("DC--------<>",postId)
            const form_data = new FormData();
            form_data.append('action', 'halim_ajax_show_all_eps_list');
            // form_data.append('episode', '1');  
            // form_data.append('server', '1');
            form_data.append('postid', postId);
            let  headers =  {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-Requested-With':'XMLHttpRequest'
            }
            let responseListEp = await axios.post(`${URL.DOMAIN}wp-admin/admin-ajax.php`, form_data, { headers })
            $ = cheerio.load(responseListEp.data)
            // let idEpisode = this.getParamFromJS(html, "fcurrentEpId")
            // let ajaxPlayerUrl = this.getParamFromJS(html, "ajaxPlayerUrl")
            let episodeId = ''

            let bongNgoDataEpisode = {}

            let epg = $('.halim-server') // list group ep
            let listGroup = [];
            //console.log("DuongKK", $('.halim-server').html())

            // parse list group episode
            for (let index = 0; index < epg.length; index++) {
                const groupEpisodeHtml = epg[index];
                let groupEpisode = {};
                //console.log('Du -->',$(groupEpisodeHtml).find('.halim-server-name').html())
                groupEpisode.titleGroup = $(groupEpisodeHtml).find('.halim-server-name').text().replace("PHIMGI","PhimHD")
                let liListEpisodeHtml = $(groupEpisodeHtml).find('.halim-list-eps .halim-episode')
                let list = [];
                // parse list episode inside group
                for (let indexEpisode = 0; indexEpisode < liListEpisodeHtml.length; indexEpisode++) {
                    const episodeHtml = liListEpisodeHtml[indexEpisode];
                    let episode = {};

                    let dataEpisode = $(episodeHtml).find("span").attr("data-episode")
                    let dataServer = $(episodeHtml).find("span").attr("data-server")
                    let dataPostId = $(episodeHtml).find("span").attr("data-post-id")

                    let subStringUrl = urlOther.substring(0, urlOther.indexOf("-tap"))
                    let urlEp = `${subStringUrl}-tap-${dataEpisode}-server-${dataServer}/`;
                    let name = $(episodeHtml).find("span").text();

                    if (urlEp == urlOther) {
                        episodeId = dataEpisode
                        postId = dataPostId
                    }
                    // let id = $(episodeHtml).find("a").attr('data-id')
                    // let fId = $(episodeHtml).find("a").attr('data-fid')
                    // let dataKey = $(episodeHtml).find("a").attr('data-key')

                    episode.urlEp = urlEp;
                    episode.name = name;
                    // episode.id = id
                    // episode.fId = fId
                    // episode.dataKey = dataKey

                    list.push(episode);
                }
                groupEpisode.episodeList = (list);
                listGroup.push(groupEpisode);
            }

            bongNgoDataEpisode.listGroupEpisode = (listGroup);
            bongNgoDataEpisode.idEpisode = (episodeId);
            bongNgoDataEpisode.idFilm = (postId);
            bongNgoDataEpisode.tokenIndexEpisode = (nonce);
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
        let firstIndex = str.indexOf(key) + key.length - 1; // 4 to index point to first char.
        let temp = str.substring(firstIndex);
        let lastIndex = temp.indexOf("};") + 1;
        let jsonConfig = temp.substring(0, lastIndex); // 
        //console.log("json string ", jsonConfig)

        let objN = JSON.parse(jsonConfig)
        //console.log("NOUNCE str", objN.nonce)
        //console.log("NOUNCE ", JSON.parse(jsonConfig).nonce)
        return objN
    }

    parseHtmlSearchPage = async function (urlSearch) {
        try {
            //   axios.get('https://something.com/foo');
            const url = encodeURI(urlSearch);
            //console.log("HTML ----> ", url)

            let response = await axios.get(url)
            let $ = cheerio.load(response.data);
            const listCollection = $(".halim_box")
            let listMovieInCollection = $(listCollection).find(".col-md-3")
            let listMovie = []
            for (let index = 0; index < listMovieInCollection.length; index++) {
                let movieInHtml = listMovieInCollection[index];
                let movie = this.getItemMove($, movieInHtml)
                listMovie.push(movie)
            }
            let urlGetFilter = `${URL.DOMAIN}wp-admin/admin-ajax.php?action=halim_ajax_filter`
            let responseFilter = await axios.get(urlGetFilter)
            let htmlFilter = cheerio.load(responseFilter.data);
            let form = htmlFilter("#form-filter .filter-box")
            //console.log("FILTER ", htmlFilter.html())
            let listCountry = []
            let listYear = []
            for (let index = 0; index < form.length; index++) {
                const element = form[index];
                if (htmlFilter(element).find(".form-control").attr("name") == 'country') {
                    listCountry = this.getFilterItem(htmlFilter, htmlFilter(element).find('option'), "country")
                } else if (htmlFilter(element).find(".form-control").attr("name") == 'release') {
                    listYear = this.getFilterItem(htmlFilter, htmlFilter(element).find('option'), "release")
                }
            }
            let listType = this.getFilterItem(htmlFilter, htmlFilter("#form-filter #type > option"), "formality")
            let listGenre = this.getFilterItem(htmlFilter, htmlFilter("#form-filter #category > option"), "category")


            let data = {
                listMovie,
                listTypeFlixtor: listType,
                listGenerFlixtor: listGenre,
                listCountryFlixtor: listCountry,
                listYearFlixtor: listYear,
                currentUrl: urlSearch
            }
            data = this.getPagingResult(data, $)
            return {
                success: true,
                data: data
            }

        } catch (error) {
            //console.log("ERROR", error)
            return {
                success: false,
                message: error.toString()
            }
        }
    }
    detectURLs = function (message) {
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return message.match(urlRegex)[0].replace("\"", "").replace("\'", "")
    }
    getItemMove = function ($, htmlMovie) {
        let title = $(htmlMovie).find(".entry-title").text().split('-')[0].trim()
        let realName = $(htmlMovie).find(".original_title").text()
        //console.log("TITLE ->", title)
        let status = $(htmlMovie).find(".episode").text()
        let urlDetail = $(htmlMovie).find(".halim-thumb").attr("href")
        var urlPhoto = $(htmlMovie).find(".lazy").attr("src")
        return {
            title,
            realName,
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

        let tagPageResult = $(".page-numbers").html();
        //console.log("PAGE", tagPageResult)
        if (tagPageResult == null || this.isEmpty(tagPageResult)) {
            // only one page
            //console.log("PAGE", "---------> only one page")
            pageMovie.isHasNextPage = false
        } else {

            let listLiPage = $(".page-numbers li");
            if (listLiPage != null && !this.isEmpty(listLiPage)) {

                for (let i = 0; i < listLiPage.length; i++) {
                    let li = listLiPage[i];
                    let arrayA = $(li).find('span')
                    //console.log("arrayA ", $(arrayA).html())
                    if ($(arrayA).html() != null && $(arrayA.first()).html() != null && $(arrayA.first()).attr("class").includes("current")) {
                        pageMovie.index = i;
                        if (i == listLiPage.length - 1) {
                            //last page
                            //console.log("PAGE", "---------> last page")
                            pageMovie.isHasNextPage = false
                        } else {
                            if (listLiPage.get(i + 1) != null) {
                                let nextLi = listLiPage[i + 1];
                                let a = $(nextLi).find("a");
                                if (a != null && !this.isEmpty(a)) {
                                    let nextUrl = $(a).first().attr("href");
                                    if (!nextUrl.includes(URL.DOMAIN)) {
                                        nextUrl = URL.DOMAIN + nextUrl.substring(1);
                                    }
                                    pageMovie.urlNextPage = (nextUrl);
                                    pageMovie.isHasNextPage = true;
                                    ////console.log("asdasdasdsa3")
                                } else {
                                    pageMovie.isHasNextPage = false
                                    ////console.log("4")
                                    //console.log("PAGE", "---------> last page 4")
                                }
                            } else {
                                pageMovie.isHasNextPage = false
                                ////console.log("5")
                                //console.log("PAGE", "---------> last page 5")
                            }
                        }
                        break;
                    }
                }
            } else {
                pageMovie.isHasNextPage = false
                ////console.log("6")
                //console.log("PAGE", "---------> last page 6")
            }
        }
        //        }
        return pageMovie
    }


    isEmpty = (array) => {
        return array == null || array.length == 0
    }
    getFilterItem = function ($, html, type) {
        //console.log('getFilterItem ', html.length)
        let listFilter = []
        for (let index = 0; index < html.length; index++) {
            const option = html[index];
            let name = $(option).text().trim()
            let value = $(option).attr('value')
            let content = name
            let id = type
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
        let split = input.split("#EXT-X-STREAM-INF");
        let listQuality = [];
        for (var i = 1; i < split.length; i++) {
            let strQuality = split[i];
            let nameQuality = strQuality.substring(strQuality.indexOf("RESOLUTION="), strQuality.indexOf("/"));
            let shortNameQuality = nameQuality.substring(nameQuality.indexOf("x") + 1).trim() + "p";
            let urlQuality = strQuality.substring(strQuality.indexOf("/")).trim();
            let quality = {};
            quality.urlStream = (`https://${domain}${urlQuality}`);
            quality.name = (shortNameQuality);
            listQuality.push(quality);
        }
        return listQuality;
    }
    getQualityHls = async function (urlPlaylist, domain) {
        let response = await axios.get(urlPlaylist)
        let playlistHls = response.data
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
            url: 'https://subnhanh.net/frontend/default/ajax-player',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'multipart/form-data'
            }
        }
        const form_data = new FormData();
        form_data.append('epId', epId);
        form_data.append('type', 'hls');
        let  headers =  {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'X-Requested-With':'XMLHttpRequest'
        }
        let res = await axios.post('https://subnhanh.net/frontend/default/ajax-player', form_data,
            { headers });

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






