if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/appstore/sw.js', { scope: '/' })})}