import { HacoCmsClient, SortQuery } from 'hacocms-js-sdk'
import Link from 'next/link'

// API の利用に必要なクライアントを生成します。
const client = new HacoCmsClient(`https://${process.env.HACOCMS_PROJECT_SUBDOMAIN}.hacocms.com`, process.env.HACOCMS_PROJECT_ACCESS_TOKEN)

/** すべてのタグページの [slug] を返す */
export async function getStaticPaths() {
  const paths = (await client.getList(Object, '/tags')).data.map(({ slug }) => ({ params: { slug } }))
  return {
    paths,
    fallback: false,
  }
}

/** タグページ /tags/[slug] の生成に使用するデータを返す */
export async function getStaticProps({ params }) {
  // [slug] からタグコンテンツを取得
  const [tag] = (await client.getList(Object, '/tags', { q: `slug[eq]:${params.slug}` })).data

  // 指定のタグを含む記事を取得
  const entries = (await client.getList(Object, '/entries', { q: `tags[*].slug[eq]:${params.slug}`, s: SortQuery.build(['createdAt', 'desc']) })).data

  return {
    props: {
      tag,
      entries,
    },
  }
}

const Tag = ({ tag, entries }) => (
  <>
    <h1>{tag.name}</h1>
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link href={`/post/${entry.id}`}>{entry.title}</Link>
        </li>
      ))}
    </ul>
    <Link href="/">Back to Home</Link>
  </>
)

export default Tag
