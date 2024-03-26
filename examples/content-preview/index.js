import * as dotenv from 'dotenv'
import { ApiContent, HacoCmsClient } from 'hacocms-js-sdk'
import { createServer } from 'node:http'

dotenv.config()

/** API のコンテンツに対応するクラス */
class ExampleContent extends ApiContent {
  constructor(json) {
    super(json)

    this.title = json.title
    this.description = json.description
    this.body = json.body
  }
}

/** API コンテンツから HTML を生成する関数 */
const generateHtml = (entry) => `
<h1>${entry.title}</h1>
<p>${entry.description}</p>
${entry.body}
`

const client = new HacoCmsClient(`https://${process.env.HACOCMS_PROJECT_SUBDOMAIN}.hacocms.com`, process.env.HACOCMS_PROJECT_ACCESS_TOKEN)

/** URL から CONTENT_ID と DRAFT_TOKEN を抽出する関数 */
const parseParams = (url) => ({
  CONTENT_ID: url.pathname.slice(1),
  DRAFT_TOKEN: url.searchParams.get('draft'),
})

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)

  // リクエスト URL の CONTENT_ID と DRAFT_TOKEN をパース
  const { CONTENT_ID, DRAFT_TOKEN } = parseParams(url)

  // SDK で API から下書き状態のコンテンツを取得
  const draft = await client.getContent(ExampleContent, '/entries', CONTENT_ID, DRAFT_TOKEN)

  // コンテンツからレスポンス HTML を生成
  const body = generateHtml(draft)

  response.writeHead(200, {
    'Content-Type': 'text/html',
  })
  response.end(body)
})

const port = 3000
console.log(`http://localhost:${port}/{CONTENT_ID}?draft={DRAFT_TOKEN}`)
server.listen(port)
