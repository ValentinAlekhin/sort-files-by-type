const fs = require('fs-extra')
const path = require('path')

const { setup, dataPath } = require('./test/setup')

const sortFilesByType = require('./index')

describe('Test FilesOrganizer:', () => {
  setup()

  it('should work', async () => {
    await sortFilesByType(dataPath)
  })
})
