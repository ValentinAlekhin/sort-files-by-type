# sort-files-by-type

The module sorts and distributes files in directories by their type

![npm](https://img.shields.io/npm/v/sort-files-by-type?style=for-the-badge) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ValentinAlekhin/sort-files-by-type/Test?label=test&style=for-the-badge)

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

## Options example

```js
const SortFilesByType = require('sort-files-by-type')

const options = {
  events: {
    // Called before scanning starts
    scanStart: () => console.log('Scanning started'),
    // Called after scanning
    scanEnd: totalFiles => console.log(`Found ${totalFiles} files`),
    // Called after processing each file
    handleFile: (index, totalFiles) =>
      console.log(`Processed ${index} files out of ${totalFiles}`),
  },
  validations: {
    // String validation
    validateString: true,
    // Validation of existence directory
    validateExists: true,
    // Check if the script is executed in the application directory
    validateAppPath: true,
  },
}

SortFilesByType('path/to/files/', options)
  .then((res = console.log(res)))
  .catch(err => console.log(err))
```
