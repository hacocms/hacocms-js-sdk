import { HacoCmsClient } from 'hacocms-js-sdk'
import Link from 'next/link'

// API の利用に必要なクライアントを生成します。
const client = new HacoCmsClient(`https://${process.env.HACOCMS_PROJECT_SUBDOMAIN}.hacocms.com`, process.env.HACOCMS_PROJECT_ACCESS_TOKEN)

/** 生成するすべての記事ページの [id] を返す */
export async function getStaticPaths() {
  const paths = (await client.getList(Object, '/entries')).data.map(({ id }) => ({ params: { id } }))
  return {
    paths,
    fallback: false,
  }
}

/** 特定の記事ページ /post/[id] の生成に使用するデータを返す */
export async function getStaticProps({ params }) {
  const entry = await client.getContent(Object, '/entries', params.id)
  return {
    props: {
      entry,
    },
  }
}

const Post = ({ entry }) => (
  <>
    <h1>{entry.title}</h1>
    <main dangerouslySetInnerHTML={{ __html: entry.body }} />
    <h2>Tags</h2>
    <ul>
      {entry.tags.map((tag) => (
        <li key={tag.id}>
          <Link href={`/tags/${tag.slug}`}>{tag.name}</Link>
        </li>
      ))}
    </ul>
    <Link href="/">Back to Home</Link>
  </>
)

export default Post
