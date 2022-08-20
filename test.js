'use strict'

const test = require('brittle')
const wcwidth = require('./')

test('handles regular strings', function (t) {
  t.is(wcwidth('abc'), 3)
})

test('handles wide strings', function (t) {
  t.is(wcwidth('한글字的模块テスト'), 18)
})

test('handles wide characters mixed with regular characters', function (t) {
  t.is(wcwidth('abc 한글字的模块テスト'), 22)
})

test('handles Hangul Jamos', function (t) {
  t.is(wcwidth('\u1100\u1175'), 2) // 가
  t.is(wcwidth('\u1112\u1161\u11ab'), 2) // 한
  t.is(wcwidth('\u1100\u1160\u11ab'), 2) // JUNGSEONG FILLER
  t.is(wcwidth('\u115f\u1161'), 2) // CHOSEONG FILLER
  t.is(wcwidth('\u115f\u11ab'), 2) // CHOSEONG FILLER
  t.is(wcwidth('\u115f\u1160\u11ab'), 2) // CHO/JUNGSEONG FILLER
  t.is(wcwidth('\u115f\u1161\u11ab'), 2) // CHOSEONG FILLER
  t.is(wcwidth('\u1161'), 0) // incomplete
  t.is(wcwidth('\u11ab'), 0) // incomplete
  t.is(wcwidth('\u1161\u11ab'), 0) // incomplete
  t.is(wcwidth('\u1160\u11ab'), 0) // incomplete
  t.is(wcwidth('듀ᇰ'), 2)
})

test('handle surrogate pairs', function (t) {
  t.is(wcwidth('\ud835\udca5\ud835\udcc8'), 2)
  t.is(wcwidth('𝒥𝒶𝓋𝒶𝓈𝒸𝓇𝒾𝓅𝓉'), 10)
  t.is(wcwidth('\ud840\udc34\ud840\udd58'), 4)
})

test('invalid sequences with surrogate high/low values', function (t) {
  t.is(wcwidth('\ud835\u0065'), 2)
  t.is(wcwidth('\u0065\udcc8'), 2)
  t.is(wcwidth('a\ud835\u0065\u0065\udcc8z'), 6)
})

test('ignores control characters e.g. \\n', function (t) {
  t.is(wcwidth('abc\t한글字的模块テスト\ndef'), 24)
})

test('ignores bad input', function (t) {
  t.is(wcwidth(''), 0)
  t.is(wcwidth(3), 0)
  t.is(wcwidth({}), 0)
  t.is(wcwidth([]), 0)
  t.is(wcwidth(), 0)
})

test('ignores NUL', function (t) {
  t.is(wcwidth(String.fromCharCode(0)), 0)
  t.is(wcwidth('\0'), 0)
})

test('ignores NUL mixed with chars', function (t) {
  t.is(wcwidth('a' + String.fromCharCode(0) + '\n字的'), 5)
  t.is(wcwidth('a\0\n한글'), 5)
})

test('can have custom value for NUL', function (t) {
  t.is(wcwidth(String.fromCharCode(0) + 'a字的', { nul: 10 }), 15)
  t.is(wcwidth('\0' + 'a한글', { nul: 3 }), 8)
})

test('can have custom control char value', function (t) {
  t.is(wcwidth('abc\n한글字的模块テスト\ndef', { control: 1 }), 26)
})

test('negative custom control chars == -1', function (t) {
  t.is(wcwidth('abc\n한글字的模块テスト\ndef', { control: -1 }), -1)
})

test('negative custom value for NUL == -1', function (t) {
  t.is(wcwidth('abc\n한글字的模块テスト\0def', { nul: -1 }), -1)
})

test('basic', function (t) {
  t.is(wcwidth('한'), 2)
  t.is(wcwidth('듀ᇰ'), 2)
  t.is(wcwidth('한글'), 4)
})

test('multi-codepoint emojis', function (t) {
  t.is(wcwidth('🤦🏼‍♂️'), 2)
})

/* test('long width string', function (t) {
  t.is(wcwidth('つのだ☆HIRO'), 12)
}) */
