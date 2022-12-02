import { HacoCmsClient, SortQuery } from 'hacocms-js-sdk'
import Link from 'next/link'

export async function getStaticProps() {
  // API の利用に必要なクライアントを生成します。
  const client = new HacoCmsClient(`https://${process.env.HACOCMS_PROJECT_SUBDOMAIN}.hacocms.com`, process.env.HACOCMS_PROJECT_ACCESS_TOKEN)

  // 記事 API /entries に GET リクエストを送信し、最近 5 件の記事一覧を取得します。
  const recentEntries = (await client.getList(Object, '/entries', { s: SortQuery.build(['createdAt', 'desc']), limit: 5 })).data

  // タグ API /tags に GET リクエストを送信し、タグ一覧を取得します
  const tags = (await client.getList(Object, '/tags', { s: SortQuery.build('slug') })).data

  return {
    props: {
      recentEntries,
      tags,
    },
  }
}

const Home = ({ recentEntries, tags }) => (
  <>
    <h1>Hello World!</h1>
    <h2>Recent posts</h2>
    {recentEntries.map((post) => (
      <section key={post.id}>
        <h3>
          <Link href={`/post/${post.id}/`}>{post.title}</Link>
        </h3>
        <p>{post.description}</p>
      </section>
    ))}
    <h2>Tags</h2>
    <ul>
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link href={`/tags/${tag.slug}`}>{tag.name}</Link>
        </li>
      ))}
    </ul>
  </>
)

export default Home
