const { readHtml, isStatic, setStatic } = require('./app')

function Server(req, res) {
    setStatic('css', 'js')
    switch (req.url) {
        case '/':
            return readHtml(res, 'login')
        case '/home':
            return readHtml(res, 'home')
        default:
            if (isStatic(res, req.url)) return
            break
    }

    res.end('Cannot ' + req.method + ' ' + req.url)
}

module.exports = Server
