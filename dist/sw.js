if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const c=e=>i(e,t),l={module:{uri:t},exports:o,require:c};s[t]=Promise.all(r.map((e=>l[e]||c(e)))).then((e=>(n(...e),o)))}}define(["./workbox-a0adc145"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/main-BB0zoR9P.js",revision:null},{url:"assets/main-BP7sOSQY.css",revision:null},{url:"index.html",revision:"04209872636aa0a431b67fd90da6586f"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"service-worker.js",revision:"b1676afd4ecef0a8b9741ecbf3dbcc8f"},{url:"manifest.webmanifest",revision:"ac500f5a414f3cb836ef0daa53704f3b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
