initDB().then(async()=>{r("Loading audio files...","info");try{await l(["station1.mp3","station2.mp3"]),r("All audio files cached for offline use","success")}catch(e){r(`Error caching audio files: ${e}`,"error")}}).catch(e=>{r(`Database error: ${e}`,"error")});"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(e=>{console.log("ServiceWorker registration successful"),r("App ready for offline use","success")}).catch(e=>console.log("ServiceWorker registration failed: ",e));async function l(e){for(const t of e)try{if(!await getAsset(t)){const s=await fetch(t);if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);const c=s.headers.get("content-type");console.log(`Content-Type for ${t}:`,c);const i=await s.arrayBuffer();console.log(`Received ${i.byteLength} bytes for ${t}`);const f=new DataView(i),n=[];for(let a=0;a<Math.min(4,i.byteLength);a++)n.push(f.getUint8(a).toString(16).padStart(2,"0"));console.log(`First bytes of ${t}: ${n.join(" ")}`),await storeAudio(t,i),console.log(`Cached ${t}`)}}catch(o){throw console.error(`Error preloading ${t}:`,o),o}}function r(e,t="info"){const o=document.getElementById("status");o&&(o.textContent=e,o.className=`status ${t}`)}
