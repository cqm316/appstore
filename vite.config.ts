/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 00:36:16
 * @LastEditors: cqm316 1913314729@qq.com
 * @LastEditTime: 2024-09-28 20:12:26
 * @FilePath: appstore\vite.config.ts
 * @Description: vite.config.ts
 */
import { fileURLToPath, URL } from 'node:url'
import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { VitePWA } from 'vite-plugin-pwa';

const root: string = process.cwd();

const appVersion = '1.0.0';

// 打包后静态资源的存放路径
const assetsDir = 'assets';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, root);
  return {
    base: '/appstore/',
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
      VitePWA({
        manifest: {
          name: 'appSotore_PWA_离线文件',
          short_name: 'appSotore_PWA',
          id: 'cs001',
          start_url: ".",
          description: 'appSotore_PWA_离线文件',
          theme_color: '#182330',
          icons: [//添加图标， 注意路径和图像像素正确
            {
              src: 'logo.png',
              sizes: '516x516',//icon大小要与实际icon大小一致
              type: 'image/png',
            },
          ]
        },
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],//缓存相关静态资源
          runtimeCaching: [// 配置自定义运行时缓存
            {
              urlPattern: ({ url }) => url.origin === 'https://itunes.apple.com/',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'wisbayar-api',
                cacheableResponse: {
                  statuses: [200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'wisbayar-images',
                expiration: {
                  // 最多30个图
                  maxEntries: 30
                }
              }
            },
            {
              urlPattern: /.*\.js.*/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'wisbayar-js',
                expiration: {
                  maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                  maxAgeSeconds: 30 * 24 * 60 * 60
                },
                cacheableResponse: {
                  statuses: [200]
                }
              }
            },
            {
              urlPattern: /.*\.css.*/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'wisbayar-css',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 30 * 24 * 60 * 60
                },
                cacheableResponse: {
                  statuses: [200]
                }
              }
            },
            {
              urlPattern: /.*\.html.*/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'wisbayar-html',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 30 * 24 * 60 * 60
                },
                cacheableResponse: {
                  statuses: [200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true
        }
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import './src/styles/variable.less';`,
          },
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_PORT),
      proxy: {
        '/dev-api': {
          target: `https://${env.VITE_APP_API_HOST}/${env.VITE_APP_SUB_DOMAIN}`, // https://itunes.apple.com/hk/
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/dev-api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist', 
      assetsDir,
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          entryFileNames: `${assetsDir}/[name].${appVersion}.js`,
          chunkFileNames: `${assetsDir}/[name].${appVersion}.js`,
          assetFileNames: `${assetsDir}/[ext]/[name].${appVersion}.[ext]`,
        },
      },
    },
  }
})
