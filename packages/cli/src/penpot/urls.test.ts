import assert from 'node:assert'
import { describe, it } from 'node:test'

import { parsePenpotUrl } from './urls'

describe('Penpot URL parser', () => {
  describe('Params validation', () => {
    describe('when provided an invalid URL', () => {
      it('throws an error', () => {
        const input = 'foo'

        const expectedException = {
          name: 'TypeError',
          message: 'Invalid URL',
        }

        assert.throws(() => {
          parsePenpotUrl(input)
        }, expectedException)
      })
    })

    describe('when provided a valid URL not from a Penpot file', () => {
      it('throws an error', () => {
        {
          const input = 'https://design.penpot.app/#/settings/profile'

          const expectedException = {
            name: 'TypeError',
            message: 'Invalid Penpot file URL',
          }

          assert.throws(() => {
            parsePenpotUrl(input)
          }, expectedException)
        }

        {
          const input = 'https://design.penpot.app/#/settings/access-tokens'

          const expectedException = {
            name: 'TypeError',
            message: 'Invalid Penpot file URL',
          }

          assert.throws(() => {
            parsePenpotUrl(input)
          }, expectedException)
        }
      })
    })
  })

  describe('Parsing output', () => {
    describe('when provided a Penpot SaaS URL', () => {
      it('parses it without page-id param', () => {
        const input =
          'https://design.penpot.app/#/workspace/4a499800-872e-80e1-8002-fc0b4bbaa4e4/52961d58-0a92-80c2-8003-2e4b5e9a7826'

        const expect = {
          instance: 'https://design.penpot.app/',
          workspaceId: '4a499800-872e-80e1-8002-fc0b4bbaa4e4',
          fileId: '52961d58-0a92-80c2-8003-2e4b5e9a7826',
          pageId: undefined,
        }

        assert.deepStrictEqual(parsePenpotUrl(input), expect)
      })

      it('parses it with page id', () => {
        const input =
          'https://design.penpot.app/#/workspace/4a499800-872e-80e1-8002-fc0b4bbaa4e4/52961d58-0a92-80c2-8003-2e4b5e9a7826?page-id=38f1e350-296d-80f1-8002-fd3314270d8c'

        const expect = {
          instance: 'https://design.penpot.app/',
          workspaceId: '4a499800-872e-80e1-8002-fc0b4bbaa4e4',
          fileId: '52961d58-0a92-80c2-8003-2e4b5e9a7826',
          pageId: '38f1e350-296d-80f1-8002-fd3314270d8c',
        }

        assert.deepStrictEqual(parsePenpotUrl(input), expect)
      })
    })

    describe('when provided a self-hosted Penpot URL', () => {
      it('parses it without page-id param', () => {
        const input =
          'https://penpot.mydomain.com/#/workspace/da54e491-6ba3-11eb-9ba1-03f8ac143bbf/c86728dd-89fd-8169-8002-a71575166a74'

        const expect = {
          instance: 'https://penpot.mydomain.com/',
          workspaceId: 'da54e491-6ba3-11eb-9ba1-03f8ac143bbf',
          fileId: 'c86728dd-89fd-8169-8002-a71575166a74',
          pageId: undefined,
        }

        assert.deepStrictEqual(parsePenpotUrl(input), expect)
      })

      it('parses it with page id', () => {
        const input =
          'https://penpot.mydomain.com/#/workspace/da54e491-6ba3-11eb-9ba1-03f8ac143bbf/c86728dd-89fd-8169-8002-a71575166a74?page-id=c86728dd-89fd-8169-8002-a71575166a75'

        const expect = {
          instance: 'https://penpot.mydomain.com/',
          workspaceId: 'da54e491-6ba3-11eb-9ba1-03f8ac143bbf',
          fileId: 'c86728dd-89fd-8169-8002-a71575166a74',
          pageId: 'c86728dd-89fd-8169-8002-a71575166a75',
        }

        assert.deepStrictEqual(parsePenpotUrl(input), expect)
      })
    })
  })
})
