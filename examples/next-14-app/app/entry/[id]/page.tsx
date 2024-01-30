import { client } from '../../../lib/client'
import { Entry } from '../../../lib/entry'
import Link from 'next/link'

/**
 * 記事ページのパスに含まれるパラメータ `[id]` のリストを生成します。
 */
export async function generateStaticParams() {
  return await client.getList<Entry>(Entry, '/entries').then(({ data }) => data.map(({ id }) => ({ id })))
}

export default async function Page({ params }: { params: Awaited<ReturnType<typeof generateStaticParams>>[number] }) {
  const entry = await client.getContent<Entry>(Entry, '/entries', params.id)

  return (
    <>
      <h1>{entry.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: entry.body }} />
      <Link href="/">Back to Home</Link>
    </>
  )
}
