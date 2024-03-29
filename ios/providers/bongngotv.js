

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { return Promise.resolve(value).then(function (value) { step("next", value) }, function (err) { step("throw", err) }) } } return step("next") }) } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

var Bluphim = function () {
    const TAG = "API_BongNgoTV "
    const URL = {
        API_KEY:"9d2bff12ed955c7f1f74b83187f188ae",
        DOMAIN : "https://api.themoviedb.org/3",
        URL_DETAIL: "$DOMAIN/?feed=fsharejson&id=",
        URL_GET_LINK :"https://cdn.cdnmoviking.tech",
        HEADERS: {
            'Origin': '',
            'Accept-Language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest'
        }
    }
    function Bluphim(props) {
        _classCallCheck(this, Bluphim)

        this.libs = props.libs
        this.settings = props.settings
        this.state = {}
        console.log(TAG, this.libs)
        console.log(TAG, this.settings)
    }


    _createClass(Bluphim, [{
        key: 'getLink',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
                var _libs, httpRequest, cheerio, html, n, reg, result
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    _libs = this.libs,
                        httpRequest = _libs.httpRequest,
                        cheerio = _libs.cheerio
                    console.log("regeneratorRuntime  ====>")
                    return "ABC"
                }, _callee2, this)
            }))

            async function getLink(_x2) {
                console.log("getlink", _x2)
                const response = await this.libs.axios(_x2)
                const data = response.data
                const $ = this.libs.cheerio.load(data)
                const title = $("title").text()
                //   console.log("getlink data", data)
                return title
            }

            return getLink
        }()
    },

    {
        key: 'getHomeMovies',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
                var _libs, httpRequest, cheerio, html, n, reg, result
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    _libs = this.libs,
                        httpRequest = _libs.httpRequest,
                        cheerio = _libs.cheerio
                    console.log("regeneratorRuntime  ====>")
                    return "ABC"
                }, _callee2, this)
            }))

            async function getHomeMovies() {
                try {
                    // let listUrlMainPage = []
                    // listUrlMainPage.push(`${URL.DOMAIN}/trending/all/day?api_key=${URL.API_KEY}&region=VN&language=vi-VN`)
                    // listUrlMainPage.push(`${URL.DOMAIN}/movie/popular?api_key=${URL.API_KEY}&region=VN&language=vi-VN`)
                    // listUrlMainPage.push(`${URL.DOMAIN}$tmdbAPI/tv/popular?api_key=${URL.API_KEY}&region=VN&language=vi-VN`)

                    // for (let index = 0; index < listUrlMainPage.length; index++) {
                    //     const url = listUrlMainPage[index];
                    //     let response = await this.libs.axios.get(url)
                    //     console.log(TAG,response.data)
                    // }

                    const tags = new Map();

                    // Thêm tag cho các url
                    tags.set(`${URL.DOMAIN}/trending/all/day?api_key=${URL.API_KEY}&region=VN&language=vi-VN`, "trending-all-day");
                    tags.set(`${URL.DOMAIN}/movie/popular?api_key=${URL.API_KEY}&region=VN&language=vi-VN`, "movie-popular");
                    tags.set(`${URL.DOMAIN}$tmdbAPI/tv/popular?api_key=${URL.API_KEY}&region=VN&language=vi-VN`, "tv-popular");

                    // Lấy tag ứng với mỗi url
                    for (const [url, tag] of tags) {
                    // Hiển thị kết quả
                    let response = await this.libs.axios.get(url)
                    console.log(`${TAG},${tag},${JSON.stringify(response.data)}`);
                    }
                    //   axios.get('https://something.com/foo');
                    // let response = await this.libs.axios.get(URL.DOMAIN)
                    // const $ = this.libs.cheerio.load(response.data)
                    // const listCollection = $(".list-films")
                    // let listCollectionMovie = []
                    // let allMovies = []
                    // for (let i = 0; i < listCollection.length; i++) {
                    //     let listMovieInCollection = $(listCollection[i]).find(".item")
                    //     let collectionName = $(listCollection[i]).find(".title-box").first().text().trim().replace(/\n/g, '').replace(/  /g, '')
                    //     let urlSeeMore = ""


                    //     let listMovie = []
                    //     for (let index = 0; index < listMovieInCollection.length; index++) {
                    //         let movieInHtml = listMovieInCollection[index]
                    //         let movieItem = getItemMove($, movieInHtml)
                    //         listMovie.push(movieItem)
                    //         allMovies.push(movieItem)
                    //     }
                    //     let collection = {
                    //         name: collectionName,
                    //         urlDetail: urlSeeMore,
                    //         hasSeemore: urlSeeMore != '' ? true : null,
                    //         type: 0,
                    //         isLocal: false,
                    //         isActive: true,
                    //         index: 1,
                    //         movies: listMovie
                    //     }
                    //     listCollectionMovie.push(collection)
                    // }

                    // console.log(`${TAG} listCollectionMovie`,listCollectionMovie);
                    // //banner

                    // let listBanner = allMovies.sort(function () { return 0.5 - Math.random() })

                    // let banners = []
                    // for (let index = 0; index < listBanner.length; index++) {
                    //     const element = listBanner[index]
                    //     let banner = {
                    //         urlPhoto: element.urlPhoto,
                    //         title: element.title,
                    //         urlDetail: element.urlDetail
                    //     }
                    //     banners.push(banner)
                    // }
                    // console.log("ListBanner",banners);
                    return {
                        success: true,
                        data: {
                            // listBanners: banners,
                            // collections: listCollectionMovie
                        }
                    }
                } catch (error) {
                    console.error(TAG,error)
                    return {
                        success: false,
                        message: error
                    }
                }
            }

            return getHomeMovies
        }()
    },

    {
        key: 'getDetailMovie',
        value: function () {

            /**
             * parse HTML and get infomation detail movie from URL Detail Movie Page
             * @param {*} urlDetail url detail movie page
             * @returns json data which has list collection movie or error message
             */
            async function getDetailMovie(urlDetail) {
                try {
                    //console.log("getDetailMovie ----->", urlDetail)
                    let response = await this.libs.axios.get(urlDetail)
                    // console.log("getDetailMovie ----->", response.data)
                    const $ = this.libs.cheerio.load(response.data)
                    let realName = $(".title").first().text().trim()
                    let other = fixUrl($(".buttons .btn-stream-link").first().attr("href"))
                    let listDataHtml = $(".header-short-description > div")
                    let movie = {
                        realName,
                        other
                    }
                    console.log("movie ======> ", movie)
                    // for (let index = 0; index < listDataHtml.length; index++) {
                    //     const data = $(listDataHtml[index]).text()
                    //     if (data.includes("Thá»ƒ loáº¡i:")) {
                    //         let genre = data.replace("Thá»ƒ loáº¡i:", "").trim()
                    //         movie.category = genre
                    //     } else if (data.includes("Quá»‘c gia:")) {
                    //         movie.country = data.replace("Quá»‘c gia:", "").trim()
                    //     } else if (data.includes("Diá»…n viÃªn:")) {
                    //         movie.actors = data.replace("Diá»…n viÃªn:", "").trim()
                    //     } else if (data.includes("Äáº¡o diá»…n:")) {
                    //         movie.director = data.replace("Äáº¡o diá»…n:", "").trim()
                    //     } else if (data.includes("Thá»i lÆ°á»£ng:")) {
                    //         movie.duration = data.replace("Thá»i lÆ°á»£ng:", "").trim()
                    //     } else if (data.includes("NÄƒm")) {
                    //         movie.year = data.replace("NÄƒm sáº£n xuáº¥t:", "").trim()
                    //     }
                    // }
                    console.log("movie ======> ", movie)
                    movie.category = $(".theloaidd a").text().trim()
                    movie.actors = $(".dienviendd a").text().trim()
                    movie.director = $(".daodiendd a").text().trim()
                    movie.duration = $(".film-status").first().text().trim()
                    movie.rate = $(".film-status").last().text().trim()
                    let lichChieu = ''
                   // movie.rate = "6"
                    movie.description = lichChieu + "<br>" + $("#info-film").text().trim()
                    let meta = $(".poster img")
                    movie.urlBackdrop = fixUrl($('.poster img').attr("src"))
                    movie.urlReview = urlDetail
                    let relateMovieHtml = $("#film_related .item") //.more .los .box
                    let listRelateMovie = []
                    for (let index = 0; index < relateMovieHtml.length; index++) {
                        let movieInHtml = relateMovieHtml[index]
                        let movieRelate = getItemMove($, movieInHtml)
                        listRelateMovie.push(movieRelate)
                    }
                    movie.listMovieRelate = JSON.stringify(listRelateMovie)
                    console.log("movie get detail will response ", movie)
                    return {
                        success: true,
                        data: movie
                    }
                } catch (error) {
                    console.log("getDetailMovie ERROR", error)
                    return {
                        success: false,
                        message: error.toString()
                    }
                }


            }
            return getDetailMovie
        }()
    },

    {
        key: 'getListServerAndEpisode',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
                var _libs, httpRequest, cheerio, html, n, reg, result
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    _libs = this.libs,
                        httpRequest = _libs.httpRequest,
                        cheerio = _libs.cheerio
                    console.log("regeneratorRuntime  ====>")
                    return "ABC"
                }, _callee2, this)
            }))
            /**
             * parse HTML and get infomation detail movie from URL Detail Movie Page
             * @param {*} urlDetail url detail movie page
             * @returns json data which has list collection movie or error message
             */
            async function getListServerAndEpisode(urlOther) {
                try {
                    let bongNgoDataEpisode = {}

                    let response = await this.libs.axios.get(urlOther)
                    let $ =await this.libs.cheerio.load(response.data)
                    let listEpHtml = $('.control-box .episodes').find('a')
                    let listEp = []
                    for (let index = 0; index < listEpHtml.length; index++) {
                        const item = listEpHtml[index];
                        listEp.push({
                            urlEp:  fixUrl($(item)?.attr("href")),
                            name: $(item).text().trim()
                        })
                    }
                   
                    let idMovie = "idFilm"
                    let idEpisode = "idEp"
                    let ajaxPlayerUrl = urlOther
                    bongNgoDataEpisode.listGroupEpisode = [
                        {
                            titleGroup: 'FullHD',
                            episodeList: listEp
                        }
                    ]
                    bongNgoDataEpisode.idEpisode = (idEpisode)
                    bongNgoDataEpisode.idFilm = (idMovie)
                    bongNgoDataEpisode.tokenIndexEpisode = (ajaxPlayerUrl)

                  
                    return {
                        success: true,
                        data: bongNgoDataEpisode
                    }
                } catch (error) {
                    console.error(error);
                    return {
                        success: false,
                        message: error.toString(),
                    }
                }
            }
            return getListServerAndEpisode
        }()
    },

    // {
    //     key: 'getLinkStreamV2',
    //     value: function () {
    //         var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
    //             var _libs, httpRequest, cheerio, html, n, reg, result
    //             return regeneratorRuntime.wrap(function _callee2$(_context2) {
    //                 _libs = this.libs,
    //                     httpRequest = _libs.httpRequest,
    //                     cheerio = _libs.cheerio
    //                 console.log("regeneratorRuntime  ====>")
    //                 return "ABC"
    //             }, _callee2, this)
    //         }))
    //         /**
    //          * parse HTML and get infomation detail movie from URL Detail Movie Page
    //          * @param {*} urlDetail url detail movie page
    //          * @returns json data which has list collection movie or error message
    //          */
    //         async function getLinkStreamV2(fid, epId, urlAjax, callback) {
    //             try {
    //                 let promiseForAll = []
    //               let ps1 =   new Promise( async (resolve, reject) => {
    //                     console.log("promise1 was race ======>")

    //                     let res = await this.libs.axios.get(urlAjax);
    //                     let $ = await this.libs.cheerio.load(res.data) 
    //                     let iframeUrl = $("#iframeStream").attr("src")
    //                     if (!iframeUrl) {
    //                         console.log("iframeUrl not found ==============>")
    //                         return {
    //                             success: false,
    //                             message: "Iframe is not found",
    //                         }
    //                     }
    //                     console.log("iframeUrl", iframeUrl)
    //                     const splitUrl = iframeUrl.split("&")

    //                     const idVideo = splitUrl[0].substring(splitUrl[0].indexOf("=") + 1)
    //                     const idSub = splitUrl[1].replace("subId=", "")
    //                     const web = splitUrl[2].replace("web=", "")
    //                     console.log("BLUE 22222 ===>", `idVideo: ${idVideo} - idSub: ${idSub} - web: ${web}`)

    //                     const form_data = new FormData()
    //                     form_data.append('renderer', "ANGLE (ATI Technologies Inc., AMD Radeon Pro 555 OpenGL Engine, OpenGL 4.1)")
    //                     const responseGetToken = await this.libs.axios.post("https://cdn.cdnmoviking.tech/geturl", form_data)
    //                     const apiToken = responseGetToken.data
    //                     console.log("BLUE resToken ===>", `resToken: ${apiToken} `)
    //                     if (!apiToken || apiToken == '') {
    //                         console.log("BLUE", "API TOKEN FAIL ===========>")
    //                         return {
    //                             success: false,
    //                             message: "TOKEN is not found",
    //                         }
    //                     }
    //                     const token1 = apiToken.split("&").find((str) => str.includes("token1"))  //token1=6d24520    using for vid
    //                     const token2 = apiToken.split("&").find((str) => str.includes("token2"))  //token1=6d24520   using for subtitle
    //                     const token3 = apiToken.split("&").find((str) => str.includes("token3"))  //token1=6d24520   using for vid
    //                     console.log("BLUE token3 ===>", `token1: ${token1} - token2: ${token2} - token3: ${token3}`)

    //                     if (idVideo) {
    //                         const urlM3u8 = `${URL.URL_GET_LINK}/segment/${idVideo}/?${token1}&${token3}`
    //                         let listSubtitles = []
    //                         let linkIframe = `https://bongngotv.vip/player?urlStream=${encodeURIComponent(urlM3u8)}&urlSub=`
    //                         if (idSub) {
    //                             const urlSubtitle = `${URL.URL_GET_LINK}/subtitle/${idSub}/?${web}&${token2}`
    //                             linkIframe += encodeURIComponent(urlSubtitle)
    //                             listSubtitles.push({
    //                                 url: urlSubtitle,
    //                                 lang: 'vi',
    //                                 type: 'text/vtt',
    //                                 language: 'Vietnamese'
    //                             })
    //                         }

                        

    //                         resolve({
    //                             success: true,
    //                             data: {
    //                                 sourcePlaylist: [{
    //                                     urlStream: urlM3u8,
    //                                     name: '1080P'
    //                                 }],
    //                                 subtitles: listSubtitles,
    //                                 linkIframe: linkIframe
    //                             },
    //                         })
    //                     } else {
    //                         reject("Fail bcs idVideo is null")
    //                     }
    //                 })
    //                 promiseForAll.push(ps1)

    //                 console.log("Added all promisse to Promise ======>")
    //                 await Promise.race(promiseForAll).then(callback).catch((e)=>console.error('HOW',e))
    //                 console.log("Promise was race ======>")

    //                 return true
    //             } catch (error) {
    //                 console.error("ERROR ====>", error)
    //                 return {
    //                     success: false,
    //                     message: error.toString(),
    //                 }
    //             }
    //         }
    //         return getLinkStreamV2
    //     }()
    // },

    {
        key: 'getLinkStreamFromEpisodeData',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
                var _libs, httpRequest, cheerio, html, n, reg, result
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    _libs = this.libs,
                        httpRequest = _libs.httpRequest,
                        cheerio = _libs.cheerio
                    console.log("regeneratorRuntime  ====>")
                    return "ABC"
                }, _callee2, this)
            }))
            /**
             * parse HTML and get infomation detail movie from URL Detail Movie Page
             * @param {*} urlDetail url detail movie page
             * @returns json data which has list collection movie or error message
             */
            async function getLinkStreamFromEpisodeData(fid, epId, urlAjax) {
                try {
                    let res = await this.libs.axios.get(urlAjax)
                    let $ =await this.libs.cheerio.load(res.data)
                    let iframeUrl = $("#iframeStream").attr("src")
                    if(!iframeUrl){
                        console.log("iframeUrl not found ==============>")
                        return {
                            success: false,
                            message: "Iframe is not found",
                        }
                    }
                    console.log("iframeUrl",iframeUrl)
                    const splitUrl = iframeUrl.split("&")
                 
                     const idVideo =splitUrl[0].substring(splitUrl[0].indexOf("=")+1)
                    const idSub = splitUrl[1].replace("subId=","")
                    const web = splitUrl[2].replace("web=","")
                     console.log("BLUE 22222 ===>", `idVideo: ${idVideo} - idSub: ${idSub} - web: ${web}`)
                   
                     const form_data = new FormData()
                     form_data.append('renderer',  "ANGLE (ATI Technologies Inc., AMD Radeon Pro 555 OpenGL Engine, OpenGL 4.1)")
                     form_data.append('id',  "60ff114c79d7fb9bd9e0a01986d1f7da")
                     form_data.append('videoId', idVideo)
                     form_data.append('domain', URL.DOMAIN)
                    const responseGetToken =await this.libs.axios.post("https://cdn.cdnmoviking.tech/geturl",form_data)
                    const apiToken = responseGetToken.data
                    console.log("BLUE resToken ===>", `resToken: ${apiToken} `)
                    if (!apiToken || apiToken == '') {
                             console.log("BLUE", "API TOKEN FAIL ===========>")
                            return {
                            success: false,
                            message: "TOKEN is not found",
                             }
                    }
                    const token1 = apiToken.split("&").find((str)=>str.includes("token1"))  //token1=6d24520    using for vid
                    const token2 = apiToken.split("&").find((str)=>str.includes("token2"))  //token1=6d24520   using for subtitle
                    const token3 = apiToken.split("&").find((str)=>str.includes("token3"))  //token1=6d24520   using for vid
                     console.log("BLUE token3 ===>", `token1: ${token1} - token2: ${token2} - token3: ${token3}`)
                   
                   if(idVideo){
                       const urlM3u8 = `${URL.URL_GET_LINK}/segment/${idVideo}/?${token1}&${token3}`
                        let listServer = []
                        let listSubtitles = []
                        let linkIframe = `https://bongngotv.vip/player?urlStream=${encodeURIComponent(urlM3u8)}&urlSub=`
                        if(idSub){
                             const urlSubtitle = `https://cdn.tinnyapi.tech/subtitle/${idSub}/?${web}&${token2}`
                             linkIframe+=encodeURIComponent(urlSubtitle)
                             listSubtitles.push({
                                 url:urlSubtitle,
                                 lang:'vi',
                                 type:'text/vtt',
                                 language:'Vietnamese'
                             })
                        }
                        
                        listServer.push({
                            typeplay: "iframe",
                            namesv: "Server BongNgoTV",
                            key: "hls",
                            urlPlaylistHls:urlM3u8,
                            sourcePlaylist:[{
                                urlStream:urlM3u8,
                                name:'1080P'
                            }],
                            subtitles: listSubtitles,
                            linkIframe: linkIframe
                        })
                        console.log("BLUE return ===>", `listServer: ${listServer}`)
                   
                         return {
                            success: true,
                            data: listServer,
                        }
                   }
                    // let listServer = []
                    // listServer.push({
                    //     typeplay: "iframe",
                    //     namesv: "Server HLS",
                    //     key: "hls"
                    // })
                    // listServer.push({
                    //     typeplay: "iframe",
                    //     namesv: "Server VIP2",
                    //     key: "vipp"
                    // })
                    // // listServer.push({
                    // //     typeplay: "iframe",
                    // //     namesv: "Server VIP3",
                    // //     key: "okru_str"
                    // // })
                    // let listBackupServer = []
                    // for (let index = 0; index < listServer.length; index++) {
                    //     const server = listServer[index]
                    //     let urlRequest = `${URL.DOMAIN}${urlAjax.substring(1)}` //'https://Bluphim.net/frontend/default/ajax-player'
                    //     const form_data = new FormData()
                    //     form_data.append('epId', epId)
                    //     form_data.append('type', server.key)
                    //     // const headers = form_data.getHeaders();
                    //     // headers['X-Requested-With'] = 'XMLHttpRequest'
                    //     let headers = {
                    //         Accept: 'application/json',
                    //         'Content-Type': 'multipart/form-data',
                    //         'X-Requested-With': 'XMLHttpRequest'
                    //     }
                    //     try {
                    //         let res = await this.libs.axios.post(urlRequest, form_data, { headers })
                    //         //console.log('---->', res.data);
                    //         const $ = this.libs.cheerio.load(res.data)
                    //         let linkIframe = $("iframe").attr("src")
                    //         server.linkIframe = linkIframe //https://streamasia.cloud/public/dist/indexBluphim.html?id=c827c9153912746096435039f52ed124

                    //         var url_parts = this.libs.url.parse(linkIframe, true)
                    //         var id = url_parts.query.id

                    //         if (id) {
                    //             let hostname = url_parts.hostname
                    //             let urlPlaylist = `https://${hostname}/playlist/${id}/${new Date().getTime()}.m3u8`
                    //             server.urlPlaylistHls = urlPlaylist
                    //             let sourcePlaylist = await getQualityHls(this.libs,urlPlaylist, hostname)
                    //             //console.log('sourcePlaylist', sourcePlaylist)
                    //             listBackupServer.push({
                    //                 typeplay: server.typeplay,
                    //                 namesv: server.namesv + "(Dá»± phÃ²ng)",
                    //                 linkIframe: server.linkIframe
                    //             })
                    //             server.sourcePlaylist = sourcePlaylist
                    //         } else if (url_parts.query.vid) {
                    //             id = url_parts.query.vid
                    //             let hostname = url_parts.hostname
                    //             let urlPlaylist = `https://${hostname}/hls/v2/${id}/playlist.m3u8`
                    //             server.urlPlaylistHls = urlPlaylist
                    //             let sourcePlaylist = []
                    //             let quality = {}
                    //             quality.urlStream = urlPlaylist
                    //             quality.name = 'HD'
                    //             sourcePlaylist.push(quality)
                    //             //console.log('sourcePlaylist', sourcePlaylist)
                    //             listBackupServer.push({
                    //                 typeplay: server.typeplay,
                    //                 namesv: server.namesv + "(Dá»± phÃ²ng)",
                    //                 linkIframe: server.linkIframe
                    //             })
                    //             server.sourcePlaylist = sourcePlaylist
                    //         }
                    //     } catch (errorApi) {
                    //         console.error('ERROR API ===========>',errorApi)
                    //     }

                    // }
                    // listServer.push(...listBackupServer)
                    // console.log('RESPONSE API ===========>',listServer)

                    return {
                        success: true,
                        data: [],
                    }
                } catch (error) {
                    console.error("ERROR ====>",error)
                    return {
                        success: false,
                        message: error.toString(),
                    }
                }
            }
            return getLinkStreamFromEpisodeData
        }()
    },

    {
        key: 'searchMovie',
        value: function () {
            async function searchMovie(query) {
                try {
                    let urlSearch = `${URL.SEARCH}${query}`
                    return await parseHtmlSearchPage(this.libs, urlSearch)

                } catch (error) {
                    console.log("Error searchMovie",error)

                    return {
                        success: false,
                        message: error.toString()
                    }
                }
            }
            return searchMovie
        }()
    },
    {
        key: 'searchMovieByURL',
        value: function () {
            async function searchMovieByURL(urlSearch) {
                try {
                    return await parseHtmlSearchPage(this.libs, urlSearch)

                } catch (error) {
                    console.log("Error searchMovieByURL",error)

                    return {
                        success: false,
                        message: error.toString()
                    }
                }
            }
            return searchMovieByURL
        }()
    },
    {
        key: 'searchMovieByFilter',
        value: function () {
            async function searchMovieByFilter(key,query) {
                try {
                    let urlSearch = `${URL.DOMAIN}${query.substring(1)}`
                    return await parseHtmlSearchPage(this.libs, urlSearch)
                } catch (error) {
                    console.log("Error searchMovieByFilter",error)
                    return {
                        success: false,
                        message: error.toString()
                    }
                }
            }
            return searchMovieByFilter
        }()
    },

    ])


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

    parseHtmlSearchPage = async function (libs, urlSearch) {
        try {
            //   axios.get('https://something.com/foo');
            const url = encodeURI(urlSearch)
            //console.log("HTML ----> ", url)

            let response = await libs.axios.get(url)
            const $ = libs.cheerio.load(response.data)
            const listCollection = $("#all-items")
            let listMovieInCollection = $(listCollection).find(".item")
            let listMovie = []
            for (let index = 0; index < listMovieInCollection.length; index++) {
                let movieInHtml = listMovieInCollection[index]
                let movie = getItemMove($, movieInHtml)
                listMovie.push(movie)
            }
            // let listType = getFilterItem($, $("#filter-eptype option"))
            let listGenre = getFilterItem($, $(".top_menu .sub-menu").first().find('li'))
            let listCountry = getFilterItem($, $(".top_menu .sub-menu").last().find('li'))
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
    function fixUrl(url){
        if(!url) return ''
        if(url.includes("http")){
            return url
        }else {
            return `${URL.DOMAIN}/${url}`
        }
    }
    function getItemMove($, htmlMovie) {
        let title = $(htmlMovie).find("span").last().text().trim()
        console.log("TITLE ->",title)
        let status = $(htmlMovie).find(".label").text()
        let urlDetail = fixUrl($(htmlMovie).find("a").attr("href"))
        const urlPhoto = fixUrl($(htmlMovie).find("img").first().attr("src"))
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
    getQualityHls = async function (libs,urlPlaylist, domain) {
        let response = await libs.axios.get(urlPlaylist)
        let playlistHls = response.data
        console.log('getQualityHls',playlistHls)
        return this.parseM3U8Playlist(domain, playlistHls)
    }
    return Bluphim
}()

exports.function = function (libs, settings) {
    return new Bluphim({ libs: libs, settings: settings })
}