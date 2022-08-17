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
      const YOUR_DOMAIN = 'SUBDOMAIN'
      const YOUR_ACCESS_TOKEN = 'ACCESS_TOKEN'
      const client = new HacoCmsClient(`https://${YOUR_DOMAIN}.hacocms.com`, YOUR_ACCESS_TOKEN)
      const entries = (await client.getList(Object, '/entries', { s: SortQuery.build(['updatedAt', 'desc']) })).data
      return [
        {
          route: '/',
          payload: {
            entries,
          },
        },
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
