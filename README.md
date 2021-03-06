# sort-files-by-type

---

Программа удаляет копии фото в дочерних диретороиях и сортирует в них файлы в папки по их типу

![npm](https://img.shields.io/npm/v/fs-extra?style=for-the-badge)

---

## Installation

```
$ npm i sort-files-by-type
```

---

## Usage

```js
const SortFilesByType = require('sort-files-by-type')

const sortFiles = new SortFilesByType('path/to/files/')

// Async with promises:
sortFiles.then().catch(err => console.log(err))

// Async/Await:
async function start() {
  try {
    await sortFiles()
  } catch (err) {
    console.error(err)
  }
}

start()
```
