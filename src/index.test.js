const fs = require('fs-extra')
const path = require('path')

const appRootPath = require('app-root-path').toString()
const dataPath = path.join(appRootPath, 'data')
const testFilesPath = path.join(appRootPath, 'test', 'files')

const FilesOrganizer = require('./FilesOrganizer/FilesOrganizer')

describe('Test FilesOrganizer:', () => {
  let filesOrganizer

  beforeEach(() => {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath)
    }
    fs.copySync(testFilesPath, dataPath)
    filesOrganizer = new FilesOrganizer(dataPath)
  })

  afterEach(() => {
    fs.removeSync(dataPath)
  })

  it('should work', async () => {
    await filesOrganizer.start()
  })
})
