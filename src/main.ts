/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 00:36:16
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 17:11:23
 * @FilePath: appstore\src\main.ts
 * @Description: main.ts设置
 */

import'vant/lib/index.css'
import './styles/index.less';
import '@vant/touch-emulator';
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

interface ExtendedWindow extends Window {
    deferredPrompt?: any;
}

declare const window: ExtendedWindow;
window.addEventListener("beforeinstallprompt", (e) => {
    console.log('beforeinstallprompt');
    e.preventDefault();
    window.deferredPrompt = e;
});

app.mount('#app')
