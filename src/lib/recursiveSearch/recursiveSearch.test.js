const { setup, dataPath } = require('../../test/setup')

const recursiveSearch = require('./recursiveSearch')

describe('Test recursive search:', () => {
  setup()

  it('should return arr of files', async () => {
    const files = await recursiveSearch(dataPath)

    expect(files.length).toBeTruthy()
  })
})
