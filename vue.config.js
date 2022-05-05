const webpack = require('webpack')
// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  css: {
    extract: { ignoreOrder: true }
  },
  configureWebpack: {
    plugins: [
      // new VuetifyLoaderPlugin(),
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        Quill: 'quill/dist/quill.js'
      }),
      // eslint-disable-next-line no-useless-escape
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /jp/)
    ]
  }
}
