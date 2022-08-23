import Link from 'next/link'
import Header from '../../../components/header'
import { HacoCmsClient } from 'hacocms-js-sdk'

// (1) プロジェクト基本設定画面のサブドメインに置き換えてください。
const PROJECT_SUBDOMAIN = 'SUBDOMAIN'

// (2) プロジェクトの Access-Token に置き換えてください。
const PROJECT_ACCESS_TOKEN = 'ACCESS_TOKEN'

const client = new HacoCmsClient(`https://${PROJECT_SUBDOMAIN}.hacocms.com`, PROJECT_ACCESS_TOKEN)

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
    <Header />
    <h1>{entry.title}</h1>
    <main dangerouslySetInnerHTML={{ __html: entry.body }} />
    <Link href="/">Back to Home</Link>
  </>
)

export default Post
