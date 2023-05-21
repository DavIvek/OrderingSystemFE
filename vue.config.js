// const {defineConfig} = require('@vue/cli-service')
// module.exports = defineConfig({
//     transpileDependencies: true,
//     devServer: {
//         proxy: {
//             // lets us use the api alias instead of the localhost link when we run devServer
//             './': {
//                 target: 'http://localhost:9200',
//                 changeOrigin: true,
//                 logLevel: 'debug',
//                 pathRewrite: {'./': '/'}
//             }
//         }
//     }
// })
