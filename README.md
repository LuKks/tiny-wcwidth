# tiny-wcwidth

Determine columns needed for a wide character.

Simplified fork of [wcwidth.js](https://github.com/mycoboco/wcwidth.js) with added support for multi-codepoint emojis.

```
npm i tiny-wcwidth
```

## Usage
```javascript
const wcwidth = require('tiny-wcwidth')

'한'.length // 1
wcwidth('한') // 2

'한글'.length // 2
wcwidth('한글') // 4

'🤦🏼‍♂️'.length // 7
wcwidth('🤦🏼‍♂️') // 2
```

## License
MIT
