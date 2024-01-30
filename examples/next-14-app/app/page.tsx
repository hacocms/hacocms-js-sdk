import { SortQuery } from 'hacocms-js-sdk'
import { client } from '../lib/client'
import { Entry } from '../lib/entry'
import Link from 'next/link'

export default async function Page() {
  const { data: recentEntries } = await client.getList<Entry>(Entry, '/entries', { s: SortQuery.build(['updatedAt', 'desc']) })

  return (
    <>
      <h1>Tiny Blog</h1>
      <ol>
        {recentEntries.map(({ id, title, updatedAt }) => (
          <li key={id}>
            <Link href={`/entry/${id}`}>{title}</Link>
            {` at ${updatedAt.toString()}`}
          </li>
        ))}
      </ol>
    </>
  )
}
