import http from 'http'
import { AddressInfo } from 'net'
import { HacoCmsClient } from './api-client.js'
import { ApiContent } from './api-content.js'

class DummyApiContent extends ApiContent {}

const dummyAccessToken = 'DUMMY_ACCESS_TOKEN'
const dummyProjectDraftToken = 'DUMMY_PROJECT_DRAFT_TOKEN'
const dummyEndpoint = '/dummy'
const dummyResponse = JSON.stringify({
  meta: { total: 0, offset: 0, limit: 100 },
  data: [],
})

const spyHeader = (requestHeader: Map<string, any>) => (req: http.IncomingMessage, res: http.ServerResponse) => {
  for (const x in req.headers) {
    requestHeader.set(x, req.headers[x])
  }
  res.end(dummyResponse)
}
const spyQueryParams = (params: Map<string, string>) => (req: http.IncomingMessage, res: http.ServerResponse) => {
  new URL(req.url!, 'http://localhost/').searchParams.forEach((value, key) => {
    params.set(key, value)
  })
  res.end(dummyResponse)
}

let stubServer: http.Server

afterEach(() => {
  if (stubServer && stubServer.listening) {
    stubServer.close()
  }
})

describe('getList', () => {
  test('get public data', async () => {
    const dateStr = '2022-03-08T12:00:00.000+09:00'
    const expectedTime = Date.parse(dateStr)
    stubServer = await makeStubServer([
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
            closedAt: null,
          },
        ],
      },
    ])

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken)
    const res = await client.getList(DummyApiContent, dummyEndpoint)

    expect(res).toHaveProperty('meta')
    expect(res).toHaveProperty('data')

    const gotMeta = res.meta
    expect(gotMeta.total).toBe(1)
    expect(gotMeta.offset).toBe(0)
    expect(gotMeta.limit).toBeGreaterThan(0)

    const gotData = res.data[0]
    expect(gotData).toBeInstanceOf(DummyApiContent)
    expect(gotData.id).toBe('abcdef')
    expect(gotData.createdAt.getTime()).toBe(expectedTime)
    expect(gotData.updatedAt.getTime()).toBe(expectedTime)
    expect(gotData.publishedAt?.getTime()).toBe(expectedTime)
    expect(gotData.closedAt).toBeNull()
  })

  describe('query parameters are appended to query string', () => {
    test.each([
      ['limit', 50],
      ['offset', 100],
      ['s', 'createdAt'],
      ['s', '-publishedAt,id'],
    ])('%s', async (key, param) => {
      const gotQueryParameters = new Map<string, string>()
      stubServer = await createServer(spyQueryParams(gotQueryParameters))
      const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken)
      await client.getList(DummyApiContent, dummyEndpoint, { [key]: param })

      expect(gotQueryParameters.get(key)).toBe(param.toString())
    })
  })

  test('throw an error if API returns 401', async () => {
    stubServer = await createServer((_, res: http.ServerResponse) => {
      res.writeHead(401, { 'Content-Type': 'text/plain' })
      res.end('Unauthorized')
    })

    const client = new HacoCmsClient(getServerUrl(stubServer), 'WRONG_ACCESS_TOKEN')
    await expect(client.getList(DummyApiContent, dummyEndpoint)).rejects.toThrow()
  })
})

describe('getSingle', () => {
  test('get single content', async () => {
    const dateStr = '2022-03-08T12:00:00.000+09:00'
    const expectedTime = Date.parse(dateStr)
    stubServer = await makeStubServer([
      {
        id: 'abcdef',
        createdAt: dateStr,
        updatedAt: dateStr,
        publishedAt: dateStr,
        closedAt: null,
      },
    ])

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken)
    const res = await client.getSingle(DummyApiContent, dummyEndpoint)

    expect(res).toBeInstanceOf(DummyApiContent)
    expect(res.id).toBe('abcdef')
    expect(res.createdAt.getTime()).toBe(expectedTime)
    expect(res.updatedAt.getTime()).toBe(expectedTime)
    expect(res.publishedAt?.getTime()).toBe(expectedTime)
    expect(res.closedAt).toBeNull()
  })

  test('request header has Haco-Project-Draft-Token with the value given by client constructor', async () => {
    const requestHeader = new Map<string, any>()
    stubServer = await createServer(spyHeader(requestHeader))

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken, dummyProjectDraftToken)
    await client.getSingle(DummyApiContent, dummyEndpoint)

    expect(requestHeader.get('Haco-Project-Draft-Token'.toLowerCase())).toBe(dummyProjectDraftToken)
  })
})

describe('getListIncludingDraft', () => {
  test('request header has Haco-Project-Draft-Token with the value given by client constructor', async () => {
    const requestHeader = new Map<string, any>()
    stubServer = await createServer(spyHeader(requestHeader))

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken, dummyProjectDraftToken)
    await client.getListIncludingDraft(DummyApiContent, dummyEndpoint)

    expect(requestHeader.get('Haco-Project-Draft-Token'.toLowerCase())).toBe(dummyProjectDraftToken)
  })

  test('throw an error if client does not give Project-Draft-Token', async () => {
    stubServer = await createServer((_, res: http.ServerResponse) => {
      res.writeHead(401, { 'Content-Type': 'text/plain' })
      res.end('Unauthorized')
    })

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken) // do not pass Project-Draft-Token
    await expect(client.getListIncludingDraft(DummyApiContent, dummyEndpoint)).rejects.toThrow(/Project-Draft-Token/i)
  })
})

describe('getContent', () => {
  test('get specified content', async () => {
    const contentId = 'abcdef'
    const dateStr = '2022-03-08T12:00:00.000+09:00'
    const expectedTime = Date.parse(dateStr)
    stubServer = await makeStubServer([
      {
        id: contentId,
        createdAt: dateStr,
        updatedAt: dateStr,
        publishedAt: dateStr,
        closedAt: null,
      },
    ])

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken)
    const res = await client.getContent(DummyApiContent, dummyEndpoint, contentId)

    expect(res).toBeInstanceOf(DummyApiContent)
    expect(res.id).toBe('abcdef')
    expect(res.createdAt.getTime()).toBe(expectedTime)
    expect(res.updatedAt.getTime()).toBe(expectedTime)
    expect(res.publishedAt?.getTime()).toBe(expectedTime)
    expect(res.closedAt).toBeNull()
  })

  test('request header has Haco-Project-Draft-Token with the value given by client constructor', async () => {
    const requestHeader = new Map<string, any>()
    stubServer = await createServer(spyHeader(requestHeader))

    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken, dummyProjectDraftToken)
    await client.getContent(DummyApiContent, dummyEndpoint, 'dummy')

    expect(requestHeader.get('Haco-Project-Draft-Token'.toLowerCase())).toBe(dummyProjectDraftToken)
  })

  test('draft token is appended to query string', async () => {
    const draftToken = 'DUMMY_DRAFT_TOKEN'

    const gotQueryParameters = new Map<string, string>()
    stubServer = await createServer(spyQueryParams(gotQueryParameters))
    const client = new HacoCmsClient(getServerUrl(stubServer), dummyAccessToken)
    await client.getContent(DummyApiContent, dummyEndpoint, 'dummy', draftToken)

    expect(gotQueryParameters.get('draft')).toBe(draftToken)
  })
})

async function createServer(listener: http.RequestListener) {
  const server = http.createServer(listener)
  server.listen(undefined, '127.0.0.1')
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
  const address = server.address()
  console.log(address)
  if (address == null) {
    throw new Error('server.address() returns null')
  }
  if (typeof address === 'string') {
    return address
  }
  const { address: host, port } = address as AddressInfo
  return `http://${host}:${port}`
}
