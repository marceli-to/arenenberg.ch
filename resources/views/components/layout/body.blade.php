<body class="bg-white text-black text-sm antialiased leading-[1.25] flex min-h-screen flex-col max-w-lg mx-auto">
@if (Request::routeIs('page.home'))
{{-- <script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('ServiceWorker registrations:', registrations);
      for (const registration of registrations) {
        await registration.unregister();
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Registration state:', registration.active ? 'active' : 'inactive');
      console.log('ServiceWorker registration successful:', registration);

      // Setup message listener
      navigator.serviceWorker.addEventListener('message', event => {
        console.log('Client received:', event.data);
      });
      
      // Send initial ping
      if (registration.active) {
        registration.active.postMessage('CLIENT_READY');
      } else {
        registration.addEventListener('updatefound', () => {
          registration.installing.addEventListener('statechange', () => {
            if (registration.active) {
              registration.active.postMessage('CLIENT_READY');
            }
          });
        });
      }
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}
</script> --}}
@endif
{{ $slot }}
@vite('resources/js/app.js')
@vite('resources/js/sw.js')
</body>
</html>
<!-- made with ❤ by bivgrafik.ch & marceli.to -->
