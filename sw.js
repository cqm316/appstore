if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let r={};const a=e=>n(e,c),l={module:{uri:c},exports:r,require:a};s[c]=Promise.all(i.map((e=>l[e]||a(e)))).then((e=>(t(...e),r)))}}define(["./workbox-82d60772"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/css/index.1.0.0.css",revision:null},{url:"assets/css/List.1.0.0.css",revision:null},{url:"assets/index.1.0.0.js",revision:null},{url:"assets/List.1.0.0.js",revision:null},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"index.html",revision:"62afb5b26dd006eaca9544cbcd6343ac"},{url:"logo.png",revision:"7e512280c8cc9b453f7494b143b14654"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"logo.png",revision:"7e512280c8cc9b453f7494b143b14654"},{url:"manifest.webmanifest",revision:"8138c878c954f94b14dcd69ad7ad0c44"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({url:e})=>"https://itunes.apple.com/"===e.origin),new e.NetworkFirst({cacheName:"wisbayar-api",plugins:[new e.CacheableResponsePlugin({statuses:[200]})]}),"GET"),e.registerRoute(/\.(?:png|jpg|jpeg|svg)$/,new e.CacheFirst({cacheName:"wisbayar-images",plugins:[new e.ExpirationPlugin({maxEntries:30})]}),"GET"),e.registerRoute(/.*\.js.*/,new e.StaleWhileRevalidate({cacheName:"wisbayar-js",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[200]})]}),"GET"),e.registerRoute(/.*\.css.*/,new e.StaleWhileRevalidate({cacheName:"wisbayar-css",plugins:[new e.ExpirationPlugin({maxEntries:20,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[200]})]}),"GET"),e.registerRoute(/.*\.html.*/,new e.StaleWhileRevalidate({cacheName:"wisbayar-html",plugins:[new e.ExpirationPlugin({maxEntries:20,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[200]})]}),"GET")}));
