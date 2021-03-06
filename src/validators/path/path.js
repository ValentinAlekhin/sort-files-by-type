const fs = require('fs-extra')
const path = require('path')

const appRootPath = require('app-root-path').path
const isValid = require('is-valid-path')
const chalk = require('chalk')

const createError = message => new Error(chalk.red.bold(message))

const def = {
  validateString: true,
  validateExists: true,
  validateAppPath: false,
}

const pathValidator = (directory, options = def) => {
  options = { ...def, ...options }
  const { validateString, validateExists, validateAppPath } = options

  if (validateString && !isValid(directory)) {
    throw createError('Должен быть указан путь')
  }

  const normalizedPath = path.normalize(directory)

  if (validateAppPath && normalizedPath.includes(appRootPath)) {
    throw createError(
      'Комманда не может быть выполненна в директории приложения'
    )
  }

  if (validateExists && !fs.existsSync(normalizedPath)) {
    throw createError('Указанной директории не существует')
  }

  return true
}

module.exports = pathValidator
