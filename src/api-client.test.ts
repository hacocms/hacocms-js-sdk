import http from 'http'
import { AddressInfo } from 'net'
import * as apiClient from './api-client'
import ApiContent from './api-content'

class DummyApiContent extends ApiContent {
  $tag = ''
}

// to just publish the protected methods
class HacoCmsClient extends apiClient.default {
  get = super.get
}

const dummyAccessToken = 'DUMMY_ACCESS_TOKEN'
const dummyResponse = JSON.stringify({
  meta: { total: 0, offset: 0, limit: 100 },
  data: [],
})

describe('get', () => {
  test('get public data', async () => {
    const dateStr = '2022-03-08T12:00:00.000+09:00'
    const expectedTime = Date.parse(dateStr)
    const stubServer = await makeStubServer([
      {
        meta: {
          total: 1,
          offset: 0,
          limit: 100,
        },
        data: [
          {
            id: 'abcdef',
            createdAt: dateStr,
            updatedAt: dateStr,
            publishedAt: dateStr,
            closedAt: dateStr,
          },
        ],
      },
    ])

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken)
    const res = await client.get(DummyApiContent, '/')

    const gotData = res.data[0]
    expect(gotData.id).toBe('abcdef')
    expect(gotData.createdAt.getTime()).toBe(expectedTime)
    expect(gotData.updatedAt.getTime()).toBe(expectedTime)
    expect(gotData.publishedAt?.getTime()).toBe(expectedTime)
    expect(gotData.closedAt?.getTime()).toBe(expectedTime)

    const gotMeta = res.meta
    expect(gotMeta.total).toBe(1)
    expect(gotMeta.offset).toBe(0)
    expect(gotMeta.limit).toBeGreaterThan(0)

    stubServer.close()
  })

  describe('with query parameters', () => {
    const listener = (params: Map<string, string>) => (req: http.IncomingMessage, res: http.ServerResponse) => {
      new URL(req.url!, 'http://localhost/').searchParams.forEach((value, key) => {
        params.set(key, value)
      })
      res.end(dummyResponse)
    }

    test.each([
      ['limit', 50],
      ['offset', 100],
      ['s', 'createdAt'],
      ['s', '-publishedAt,id'],
    ])('%s', async (key, param) => {
      const gotQueryParameters = new Map<string, string>()
      const stubServer = await createServer(listener(gotQueryParameters))
      const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken)
      await client.get(DummyApiContent, '/', { [key]: param })

      expect(gotQueryParameters.get(key)).toBe(param.toString())

      stubServer.close()
    })
  })

  test('throw an error if API returns 401', async () => {
    const stubServer = await createServer((_, res: http.ServerResponse) => {
      res.writeHead(401, { 'Content-Type': 'text/plain' })
      res.end('Unauthorized')
    })

    const client = new HacoCmsClient(getServerUrl(stubServer), 'WRONG_ACCESS_TOKEN')
    await expect(client.get(DummyApiContent, '/')).rejects.toThrow()

    stubServer.close()
  })
})

async function createServer(listener: http.RequestListener) {
  const server = http.createServer(listener)
  server.listen(undefined, 'localhost')
  while (!server.address()) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  return server
}

async function makeStubServer(responses: readonly unknown[]) {
  const generator = (function* () {
    for (const res of responses) {
      yield res
    }
  })()
  const server = await createServer((_, res: http.ServerResponse) => {
    const itr = generator.next()
    if (itr.done) {
      throw new Error('no more response!')
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(itr.value))
    res.end()
  })
  return server
}

function getServerUrl(server: http.Server) {
  const { address, port } = server.address() as AddressInfo
  return `http://${address}:${port}`
}
