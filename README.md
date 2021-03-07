# sort-files-by-type

The module sorts and distributes files in directories by their type

![npm](https://img.shields.io/npm/v/sort-files-by-type?style=for-the-badge) ![Cirrus CI - Base Branch Build Status](https://img.shields.io/cirrus/github/ValentinAlekhin/sort-files-by-type?label=test&style=for-the-badge)

## Installation

```
$ npm i sort-files-by-type
```

## Usage

```js
const SortFilesByType = require('sort-files-by-type')

// Async with promises:
SortFilesByType('path/to/files/')
  .then((res = console.log(res)))
  .catch(err => console.log(err))

// Async/Await:
async function start() {
  try {
    const res = await SortFilesByType('path/to/files/')
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}

start()
```
