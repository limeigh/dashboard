export default {
  server: {
    fs: {
      // Allow serving files from one directory above project root
      // https://github.com/vercel/next.js/issues/261#issuecomment-564525688
      // https://github.com/vercel/next.js/blob/canary/packages/next-server/src/next-server.ts#L436
    },
    proxy: {
      '/api/f': {
        target: 'http://localhost:8100',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/f/, '')
      },
      // 使用 proxy 实例
      '/api': {
        target: 'https://demo.dataease.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, 'de2api')
      }
    },
    port: 8080
  }
}
