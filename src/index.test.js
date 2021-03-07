const { setup, dataPath, filesCount } = require('./test/setup')

const sortFilesByType = require('./index')

describe('Test FilesOrganizer:', () => {
  setup()

  it('should work', async () => {
    await sortFilesByType(dataPath, { validations: { validateAppPath: false } })
  })

  it('expect event scanStart to be called one time', async () => {
    const scanStartMock = jest.fn()

    await sortFilesByType(dataPath, {
      validations: { validateAppPath: false },
      events: { scanStart: scanStartMock },
    })

    expect(scanStartMock.mock.calls.length).toBe(1)
  })

  it('expect event scanEnd to be called one time', async () => {
    const scanEndMock = jest.fn()

    await sortFilesByType(dataPath, {
      validations: { validateAppPath: false },
      events: { scanEnd: scanEndMock },
    })

    expect(scanEndMock.mock.calls.length).toBe(1)
  })

  it(`expect event handleFile to be called ${filesCount} time(s)`, async () => {
    const handleFileMock = jest.fn()

    await sortFilesByType(dataPath, {
      validations: { validateAppPath: false },
      events: { handleFile: handleFileMock },
    })

    expect(handleFileMock.mock.calls.length).toBe(filesCount)
  })
})
