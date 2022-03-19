const { existsSync, readFileSync } = require('fs')
const { join, extname } = require('path')
const variables = []
let rootPath = process.cwd()

function setStatic(...path) {
    variables.push(...path)
}

function isStatic(res, url) {
    const ext = extname(url)
    const path = join(rootPath, url)

    if (!ext || !existsSync(path)) return

    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.ico': 'image/x-icon',
    }

    res.setHeader(
        'Content-Type',
        contentTypes[ext] || 'application/octet-stream'
    )
    res.end(readFileSync(path))
    return true
}

function readHtml(res, filename) {
    try {
        const data = readFileSync(join(__dirname, `../${filename}.html`))
        res.end(data)
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    setStatic,
    isStatic,
    readHtml,
}
