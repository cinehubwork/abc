

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { return Promise.resolve(value).then(function (value) { step("next", value) }, function (err) { step("throw", err) }) } } return step("next") }) } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

var Streamtape = function () {
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
    function Streamtape(props) {
        _classCallCheck(this, Streamtape)

        this.libs = props.libs
        this.settings = props.settings
        this.state = {}
        console.log("Streamtape", this.libs)
        console.log("Streamtape", this.settings)
    }

    _createClass(Streamtape, [{
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
             function getItemMove($, htmlMovie) {
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
            async function getHomeMovies(_x2) {
                try {

                    //   axios.get('https://something.com/foo');
                    let response = await this.libs.axios.get(URL.DOMAIN)
                    const $ = this.libs.cheerio.load(response.data)
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
                            let movie = getItemMove($, movieInHtml)
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

            return getHomeMovies
        }()
    },
    
    ])

    return Streamtape
}()
console.log('aaaa')

window.thisSource.function = function (libs, settings) {
    return new Streamtape({ libs: libs, settings: settings })
}