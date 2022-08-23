import { HacoCmsClient, SortQuery } from 'hacocms-js-sdk'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-example',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  generate: {
    routes: async () => {
      // (1) プロジェクト基本設定画面のサブドメインに置き換えてください。
      const PROJECT_SUBDOMAIN = 'SUBDOMAIN'

      // (2) プロジェクトの Access-Token に置き換えてください。
      const PROJECT_ACCESS_TOKEN = 'ACCESS_TOKEN'

      // API の利用に必要なクライアントを生成します。
      const client = new HacoCmsClient(`https://${PROJECT_SUBDOMAIN}.hacocms.com`, PROJECT_ACCESS_TOKEN)

      // hacoCMS の記事 API /entries に GET リクエストを送信し、記事一覧の入ったレスポンスを受け取ります。
      const res = await client.getList(Object, '/entries', { s: SortQuery.build(['updatedAt', 'desc']) })

      // 記事の一覧は res.data に入っているので取り出します。
      const entries = res.data

      // 取得した記事の一覧を基に必要なページを列挙します。
      return [
        // トップページ
        {
          // 生成するページのパス
          route: '/',
          // そのページで使用するデータ
          payload: {
            entries,
          },
        },

        // 個別記事ページ
        ...entries.map((entry) => ({
          route: `/${entry.id}`,
          payload: {
            entry,
          },
        })),
      ]
    },
  },
}
