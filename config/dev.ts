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
      '/api': {
        target: 'https://demo.dataease.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, 'de2api')
      },
      // 使用 proxy 实例
      '/iic-dae-dataease2/de2api': {
        target: 'https://iic-dae-uat.ocft.com.sg',
        // target: 'http://101.132.75.67:8100',
        changeOrigin: true
        // rewrite: path => path.replace(/^\/iic-dae-dataease2\/api/, '')
      }
    },
    port: 8080
  }
}
