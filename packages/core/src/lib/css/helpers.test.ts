import assert from 'node:assert'
import { describe, it } from 'node:test'

import { textToCssIdentToken } from './helpers'

describe('CSS helpers', () => {
  describe('Transforming text to CSS ident tokens', () => {
    describe('when input text includes ASCII printable characters', () => {
      it('escapes all ASCII printable characters except ident code points (-, 0-9, A-Z, _, a-z)', () => {
        const allAsciiPrintableCharacters =
          '!"#$%&' +
          "'" +
          '()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[' +
          '\\' +
          ']^_`abcdefghijklmnopqrtuvwxyz{|}~'

        const expect =
          '\\!\\"\\#\\$\\%\\&' +
          "\\'" +
          '\\(\\)\\*\\+\\,-\\.\\/0123456789\\:\\;\\<\\=\\>\\?\\@ABCDEFGHIJKLMNOPQRSTUVWXYZ\\[' +
          '\\\\' +
          '\\]\\^_\\`abcdefghijklmnopqrtuvwxyz\\{\\|\\}\\~'

        assert.ok(/^[\x20-\x7E]*$/.test(allAsciiPrintableCharacters))
        assert.equal(textToCssIdentToken(allAsciiPrintableCharacters), expect)
      })
    })

    describe('when input text does NOT start with a ident-start code point', () => {
      it('escapes starting number', () => {
        const expect = '\\0123456789'

        assert.equal(textToCssIdentToken('0123456789'), expect)
      })
    })

    describe('when input text starts with a hyphen', () => {
      describe('when the following character is NOT an ident-start code point', () => {
        it('escapes first number following a hyphen', () => {
          const expect = '-\\0123456789'

          assert.equal(textToCssIdentToken('-0123456789'), expect)
        })
      })
    })
  })
})
