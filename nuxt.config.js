import webpack from 'webpack'

const coreVersion = "0.1.0"
const version = "1.0.0"

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'hazard-warning-system',
    htmlAttrs: {
      lang: 'zh-Hans'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    "nuxt-leaflet"
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.plugins.push(new webpack.DefinePlugin({
        "process.env.version": JSON.stringify(version),
        "process.env.coreVersion": JSON.stringify(coreVersion)
      }));
      config.plugins.push(new webpack.BannerPlugin({
        banner: "HNWS - mighty-nuxt-core@" + coreVersion + " " +
          "Copyright © 2021 Homenetwork. All rights reserved.",
        entryOnly: true
      }));
    }
  }
}
