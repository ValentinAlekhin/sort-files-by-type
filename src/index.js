const fs = require('fs-extra')
const path = require('path')

const FileType = require('file-type')

class FilesOrganizer {
  constructor(directory) {
    this.directory = directory
    this.files = {}
    this.currentFile = {}
  }

  async start() {
    await this.recursiveSearch(this.directory)

    return this.files
  }

  async recursiveSearch(directory) {
    try {
      const filesAndDirs = await fs.readdir(directory)

      for (const current of filesAndDirs) {
        const pathToCurrent = path.join(directory, current)
        const stat = await fs.lstat(pathToCurrent)

        if (stat.isDirectory()) {
          await this.recursiveSearch(pathToCurrent)
          this.removeDirectory(pathToCurrent)
        } else await this.fileHandler(pathToCurrent)
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  removeDirectory(directory) {
    if (this.isUsedDirectory(directory)) return

    fs.removeSync(directory)
  }

  isUsedDirectory(directory) {
    let isUsedDirectory = false

    Object.values(this.files).forEach(fileType => {
      if (fileType.path === directory) isUsedDirectory = true
    })

    return isUsedDirectory
  }

  async fileHandler(file) {
    try {
      await this.setCurrentFile(file)
      this.createFileDirectory()
      this.createFileName()

      if (this.isFileOnRightDir()) {
        if (!this.isFileHasRightExt()) {
          this.renameFile()
          return
        }
        return
      }

      const { base, type } = this.currentFile
      const fileDir = this.files[type].path

      const newFilePath = path.join(fileDir, base)

      await fs.copyFile(file, newFilePath)
      await fs.remove(file)
    } catch (e) {
      throw new Error(e)
    }
  }

  async setCurrentFile(file) {
    try {
      const { ext, base, name, dir } = path.parse(file)
      const currentExt = ext.split('.')[1]
      const { mime, ext: rightExt } = await FileType.fromFile(file)
      const type = mime.split('/')[0]

      this.currentFile = { currentExt, base, name, dir, rightExt, type, file }
    } catch (e) {
      throw new Error(e)
    }
  }

  createFileName() {
    const { rightExt, name } = this.currentFile

    if (this.isFileHasRightExt()) {
      if (this.isSameBaseFileExists()) {
        this.currentFile = {
          ...this.currentFile,
          base: `${name}_copy.${rightExt}`,
        }
        return
      }
      return
    }

    this.currentFile = { ...this.currentFile, base: `${name}.${rightExt}` }
  }

  isFileHasRightExt() {
    const { rightExt, currentExt } = this.currentFile

    return rightExt === currentExt
  }

  isSameBaseFileExists() {
    const { type, base } = this.currentFile
    const filePath = path.join(this.files[type].path, base)

    return fs.existsSync(filePath)
  }

  createFileDirectory() {
    const { type } = this.currentFile

    if (this.isFileTypeDirExists()) return this.files[type].path

    this.files = { ...this.files, [type]: {} }

    const newFilePath = this.createFilePath()

    if (fs.existsSync(newFilePath)) return newFilePath

    fs.mkdirSync(newFilePath)

    return newFilePath
  }

  isFileTypeDirExists() {
    return this.files.hasOwnProperty(this.currentFile.type)
  }

  createFilePath() {
    const { type } = this.currentFile

    const newFilePath = path.join(this.directory, this.currentFile.type)

    this.files[type].path = newFilePath

    return newFilePath
  }

  isFileOnRightDir() {
    return this.files[this.currentFile.type].path === this.currentFile.dir
  }

  renameFile() {
    const { file, name, dir } = this.currentFile

    const newPath = path.join(dir, name)

    fs.renameSync(file, newPath)
  }
}

module.exports = FilesOrganizer
