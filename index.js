'use strict'

const tables = require('./table.js')

module.exports = wcswidth

function wcswidth (str, opts) {
  if (typeof str !== 'string') return wcwidth(str, opts)

  let s = 0

  for (let i = 0, h, l, n; i < str.length; i++) {
    h = str.charCodeAt(i)

    if (bisearch(h, tables.emoji)) {
      return 2
    } else {
      if (h >= 0xd800 && h <= 0xdbff) {
        l = str.charCodeAt(++i)
        if (l >= 0xdc00 && l <= 0xdfff) h = (h - 0xd800) * 0x400 + (l - 0xdc00) + 0x10000
        else i--
      }

      n = wcwidth(h, opts)
      if (n < 0) return -1
      s += n
    }
  }

  return s
}

function wcwidth (ucs, { nul = 0, control = 0 } = {}) {
  if (ucs === 0) return nul
  if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0)) return control
  if (ucs > 0x10FFFF) return 0

  // binary search in table of non-spacing characters
  if (bisearch(ucs, tables.combining)) return 0

  // if we arrive here, ucs is not a combining or C0/C1 control character
  return 1 + (ucs >= 0x1100 &&
       (ucs <= 0x115f || // Hangul Jamo init. consonants
        ucs === 0x2329 || ucs === 0x232a ||
        (ucs >= 0x2e80 && ucs <= 0xa4cf &&
         ucs !== 0x303f) || // CJK ... Yi
        (ucs >= 0xac00 && ucs <= 0xd7a3) || // Hangul Syllables
        (ucs >= 0xf900 && ucs <= 0xfaff) || // CJK Compatibility Ideographs
        (ucs >= 0xfe10 && ucs <= 0xfe19) || // Vertical forms
        (ucs >= 0xfe30 && ucs <= 0xfe6f) || // CJK Compatibility Forms
        (ucs >= 0xff00 && ucs <= 0xff60) || // Fullwidth Forms
        (ucs >= 0xffe0 && ucs <= 0xffe6) ||
        (ucs >= 0x20000 && ucs <= 0x2fffd) ||
        (ucs >= 0x30000 && ucs <= 0x3fffd)))
}

function bisearch (ucs, table) {
  let min = 0
  let max = table.length - 1
  let mid

  if (ucs < table[0][0] || ucs > table[max][1]) return false

  while (max >= min) {
    mid = Math.floor((min + max) / 2)
    if (ucs > table[mid][1]) min = mid + 1
    else if (ucs < table[mid][0]) max = mid - 1
    else return true
  }

  return false
}
