const fs = require('fs-extra')
const path = require('path')

const appRootPath = require('app-root-path').toString()
const FileType = require('file-type')

const pathValidator = require('./lib/pathValidator/pathValidator')
const recursiveSearch = require('./lib/recursiveSearch/recursiveSearch')

const defaultEvents = {
  startScan: null,
  endScan: null,
  handleFile: null,
}

const sortFilesByType = async (directory, events = defaultEvents) => {
  try {
    pathValidator(directory)

    const { startScan, endScan, handleFile } = { ...defaultEvents, ...events }
    let files = {}
    let currentFile

    if (startScan) startScan()
    const filesToWork = await recursiveSearch(directory)
    if (endScan) endScan(files.length)

    if (!filesToWork.length) {
      throw new Error('No files')
    }

    for (let i = 0; i < filesToWork.length; i++) {
      const file = filesToWork[i]
      await fileHandler(file)
      if (handleFile) handleFile(i + 1, filesToWork.length)
    }

    const dirsToRemove = await fs.readdir(directory)
    for (const dir of dirsToRemove) {
      const candidate = path.join(directory, dir)
      await removeDirectory(candidate)
    }

    async function removeDirectory(directory) {
      try {
        if (isUsedDirectory(directory)) return

        await fs.remove(directory)
      } catch (e) {
        throw new Error(e)
      }
    }

    function isUsedDirectory(directory) {
      let isUsedDirectory = false

      Object.values(files).forEach(fileType => {
        if (fileType.path === directory) isUsedDirectory = true
      })

      return isUsedDirectory
    }

    async function fileHandler(file) {
      try {
        await setCurrentFile(file)
        await createFileDirectory()
        await createFileName()

        if (isFileOnRightDir()) {
          if (!isFileHasRightExt()) {
            await renameFile()
            return
          }
          return
        }

        const { base, type } = currentFile
        const fileDir = files[type].path

        const newFilePath = path.join(fileDir, base)

        await fs.copyFile(file, newFilePath)
        await fs.remove(file)
      } catch (e) {
        throw new Error(e)
      }
    }

    async function setCurrentFile(file) {
      try {
        const { ext, base, name, dir } = path.parse(file)
        const currentExt = ext.split('.')[1]
        const fileType = await FileType.fromFile(file)

        currentFile = {
          currentExt,
          base,
          name,
          dir,
          rightExt: currentExt,
          type: 'other',
          file,
        }

        if (fileType) {
          const { mime, ext: rightExt } = fileType
          const type = mime.split('/')[0]

          currentFile = { ...currentFile, rightExt, type }
        }
      } catch (e) {
        throw new Error(e)
      }
    }

    async function createFileName() {
      const { rightExt, name } = currentFile

      if (isFileHasRightExt()) {
        if (await isSameBaseFileExists()) {
          currentFile = {
            ...currentFile,
            base: `${name}_copy.${rightExt}`,
          }
          return
        }
        return
      }

      currentFile = { ...currentFile, base: `${name}.${rightExt}` }
    }

    function isFileHasRightExt() {
      const { rightExt, currentExt } = currentFile

      return rightExt === currentExt
    }

    async function isSameBaseFileExists() {
      try {
        const { type, base } = currentFile
        const filePath = path.join(files[type].path, base)

        return await fs.pathExists(filePath)
      } catch (e) {
        throw new Error(e)
      }
    }

    async function createFileDirectory() {
      try {
        const { type } = currentFile

        if (isFileTypeDirExists()) return files[type].path

        files = { ...files, [type]: {} }

        const newFilePath = createFilePath()

        const pathExists = await fs.pathExists(newFilePath)
        if (pathExists) return newFilePath

        await fs.mkdir(newFilePath)

        return newFilePath
      } catch (e) {
        throw new Error(e)
      }
    }

    function isFileTypeDirExists() {
      return files.hasOwnProperty(currentFile.type)
    }

    function createFilePath() {
      const { type } = currentFile

      const newFilePath = path.join(directory, currentFile.type)

      files[type].path = newFilePath

      return newFilePath
    }

    function isFileOnRightDir() {
      return files[currentFile.type].path === currentFile.dir
    }

    async function renameFile() {
      try {
        const { file, name, dir } = currentFile

        const newPath = path.join(dir, name)

        await fs.rename(file, newPath)
      } catch (e) {
        throw new Error(e)
      }
    }

    return files
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = sortFilesByType
