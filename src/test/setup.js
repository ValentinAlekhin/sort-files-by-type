const fs = require('fs-extra')
const path = require('path')

const appRootPath = require('app-root-path').toString()
const dataPath = path.join(appRootPath, 'data')
const testFilesPath = path.join(appRootPath, 'src', 'test', 'files')
const filesCount = fs.readdirSync(testFilesPath).length

const setup = () => {
  beforeEach(() => {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath)
    }
    fs.copySync(testFilesPath, dataPath)
  })

  afterEach(() => {
    fs.removeSync(dataPath)
  })
}

module.exports = { dataPath, testFilesPath, filesCount, setup }
