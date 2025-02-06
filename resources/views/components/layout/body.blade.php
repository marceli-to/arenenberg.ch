<body class="bg-white text-black text-sm antialiased leading-[1.25] flex min-h-screen flex-col max-w-lg mx-auto">
@if (Request::routeIs('page.home'))
<!-- Add this HTML where you want the status box to appear -->
<div id="cacheStatus" class="fixed top-4 right-4 p-4 rounded-lg font-bold text-white bg-red-500">
  Inhalte werden geladen...
</div>

<script>
// First, let's create a function to update the UI
function updateCacheStatus(isComplete) {
  const statusElement = document.getElementById('cacheStatus');
  if (isComplete) {
    statusElement.textContent = 'Alle Inhalte sind geladen';
    statusElement.classList.remove('bg-red-500');
    statusElement.classList.add('bg-green-500');
    // Optionally hide the status after a delay
    setTimeout(() => {
      statusElement.style.opacity = '0';
      setTimeout(() => statusElement.style.display = 'none', 1000);
    }, 3000);
  }
}

// Modified service worker registration code
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('ServiceWorker registration successful:', registration);

      // Create a message channel
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHING_COMPLETE') {
          updateCacheStatus(true);
        }
      };

      // Send the port to the service worker
      if (registration.active) {
        registration.active.postMessage({
          type: 'INIT_PORT'
        }, [messageChannel.port2]);
      }

    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}
</script>
@endif
{{ $slot }}
@vite('resources/js/app.js')
</body>
</html>
<!-- made with ❤ by bivgrafik.ch & marceli.to -->
