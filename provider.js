

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { return Promise.resolve(value).then(function (value) { step("next", value) }, function (err) { step("throw", err) }) } } return step("next") }) } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

var Streamtape = function () {
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
    }

    ])

    return Streamtape
}()
console.log('aaaa')

window.thisSource.function = function (libs, settings) {
    return new Streamtape({ libs: libs, settings: settings })
}