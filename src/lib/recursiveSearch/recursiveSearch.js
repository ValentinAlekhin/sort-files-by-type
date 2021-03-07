const fs = require('fs-extra')
const path = require('path')

const recursiveSearch = async (directory, cb) => {
  const files = []

  const addFile = file => files.push(file)

  try {
    const filesAndDirs = await fs.readdir(directory)

    for (const current of filesAndDirs) {
      const pathToCurrent = path.join(directory, current)
      const stat = await fs.lstat(pathToCurrent)

      if (stat.isDirectory()) {
        await recursiveSearch(pathToCurrent, addFile)
      } else cb ? cb(pathToCurrent) : addFile(pathToCurrent)
    }

    return files
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = recursiveSearch
