import Header from '../components/header'
import Link from 'next/link'
import { HacoCmsClient, SortQuery } from 'hacocms-js-sdk'

export async function getStaticProps() {
  // (1) お使いのアカウント識別子とサブドメインを使ったものに置き換えてください。
  const YOUR_DOMAIN = 'SUBDOMAIN'

  // (2) お使いのプロジェクトの Access-Token に置き換えてください。
  const YOUR_ACCESS_TOKEN = 'ACCESS_TOKEN'

  // API の利用に必要なクライアントを生成します。
  const client = new HacoCmsClient(`https://${YOUR_DOMAIN}.hacocms.com`, YOUR_ACCESS_TOKEN)

  // hacoCMS の記事 API /entries に GET リクエストを送信し、最近 5 件の記事一覧が入ったレスポンスを受け取ります。
  const res = await client.getList(Object, '/entries', { s: SortQuery.build(['createdAt', 'desc']), limit: 5 })

  // 記事の一覧は res.data に入っているので取り出します。
  const recentEntries = res.data

  return {
    props: {
      recentEntries,
    },
  }
}

const Home = ({ recentEntries }) => (
  <>
    <Header />
    <h1>Hello World!</h1>
    {recentEntries.map((post) => (
      <section key={post.id}>
        <h2>
          <Link href={`/post/${post.id}/`}>{post.title}</Link>
        </h2>
        <p>{post.description}</p>
      </section>
    ))}
  </>
)

export default Home
