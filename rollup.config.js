// import path from 'path'
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser'

// const env = process.env.NODE_ENV
// // umd 模式的编译结果文件输出的全局变量名称
// // const name = 'RollupTsTemplate'
// const config = { 
//   // 入口文件，src/index.ts
//   input: path.resolve(__dirname, 'src/index.ts'),
//   // 输出文件
//   output: [
//     // commonjs
//     {
//       file: '/dist/mqtt-helper.cjs.js',
//       format: 'cjs',
//     },
//     // es module
//     {
//       // package.json 配置的 module 属性
//       file: '/dist/mqtt-helper.esm.js',
//       format: 'es',
//     },
//     // // umd
//     // {
//     //   // umd 导出文件的全局变量
//     //   name,
//     //   // package.json 配置的 umd 属性
//     //   file: pkg.umd,
//     //   format: 'umd'
//     // }
//   ],
//   plugins: [
//     // 解析第三方依赖
//     resolve(),
//     // 识别 commonjs 模式第三方依赖
//     commonjs(),
//     // rollup 编译 typescript
//     // rollupTypescript(),
//     // babel 配置
//     // babel({
//     //   // 编译库使用 runtime
//     //   babelHelpers: 'runtime',
//     //   // 只转换源代码，不转换外部依赖
//     //   exclude: 'node_modules/**',
//     //   // babel 默认不支持 ts 需要手动添加
//     //   // extensions: [
//     //   //   ...DEFAULT_EXTENSIONS,
//     //   //   '.ts',
//     //   // ],
//     // }),
//   ]
// }

// // 若打包正式环境，压缩代码
// if (env === 'production') {
//   config.plugins.push(terser({
//     module: true,
//     compress: {
//       ecma: 2015,
//       pure_getters: true
//     },
//     safari10: true
//   }))
// }
// export default config
export default {
  input: 'src/index.ts',
	output: [
    {
      file: 'dist/mqtt-helper.umd.js',
      format: 'umd',
      name: 'file'
    },
    {
      file: 'dist/mqtt-helper.min.js',
      format: 'cjs',
    },
    {
      file: 'dist/mqtt-helper.esm.js',
      format: 'esm', // 添加新的输出格式
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    terser(),
    // terser({
    //   module: true,
    //   compress: {
    //     ecma: 2015,
    //     pure_getters: true,
    //     drop_console: true,
    //     drop_debugger: true
    //   },
    //   safari10: true,
    //   mangle: {
    //     // 开启代码变量名混淆
    //     properties: {
    //       regex: /^_/
    //     }
    //   }
    // })
  ],
  // external: [
  //   // 将需要使用的第三方库添加到这里
  //   'mqtt'
  // ]
}