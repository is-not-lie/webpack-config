const postcss = require('rollup-plugin-postcss')

module.exports = {
  rollup(config) {
    config.plugins.push(
      postcss({
        minimize: true,
        modules: true,
        use: {
          sass: null,
          stylus: null,
          less: { javaScriptEnabled: true }
        },
        extract: true
      })
    )
    return config
  }
}
