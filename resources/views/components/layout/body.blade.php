<body class="bg-white text-black text-sm antialiased leading-[1.25] flex min-h-screen flex-col max-w-lg mx-auto">
@if (Request::routeIs('page.home'))
<div data-loader class="fixed top-4 right-4 p-4 rounded-lg font-bold text-white bg-red-500 transition-all duration-300">
  Inhalte werden geladen
</div>
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('Registration state:', registration.active ? 'active' : 'inactive');
      
      if (registration.active) {
        console.log('ServiceWorker is active');
        document.querySelector('[data-loader]').remove();
      }
      // navigator.serviceWorker.addEventListener('message', (event) => {
      //   console.log('Page received:', event.data);
      // });

      // navigator.serviceWorker.addEventListener('message', (event) => {
      //   if (event.data === 'CACHING_COMPLETE') {
      //     console.log('All assets cached successfully');
      //     // Handle UI updates or other actions here
      //   }
      // });
      
      console.log('ServiceWorker registration successful:', registration);
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
