const path = require('path')

const appRootPath = require('app-root-path').toString()

const pathValidator = require('./path')

describe('Test path validator:', () => {
  let options

  beforeEach(() => {
    options = {
      validateString: false,
      validateExists: false,
      validateAppPath: false,
    }
  })

  it('should return error of string', () => {
    try {
      pathValidator('asdfx *g/sd_f ds', { ...options, validateString: true })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
  it('should return error of exists', () => {
    try {
      pathValidator('asdfx/dsf', { ...options, validateExists: true })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
  it('should return error of app root path', () => {
    try {
      pathValidator(process.cwd(), { ...options, validateAppPath: true })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it('should pass validation', () => {
    options = {
      validateString: true,
      validateExists: true,
      validateAppPath: true,
    }

    const { dir } = path.parse(appRootPath)

    expect(pathValidator(dir, options)).toBeTruthy()
  })
})
