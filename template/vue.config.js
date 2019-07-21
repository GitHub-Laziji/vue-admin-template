module.exports = {
  devServer: {
    proxy: {
      '/admin': {
        target: 'http://localhost:80',
        changeOrigin: false,
        ws: false
      }
    }
  }
}