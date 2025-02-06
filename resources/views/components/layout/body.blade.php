<body class="bg-white text-black text-sm antialiased leading-[1.25] flex min-h-screen flex-col max-w-lg mx-auto">
@if (Request::routeIs('page.home'))
<div data-loader class="fixed top-4 right-4 p-4 rounded-lg font-bold text-white bg-red-500 transition-all duration-300">
  Inhalte werden geladen
</div>
<script>
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', async () => {
//     try {
//       const registration = await navigator.serviceWorker.register('/sw.js', {
//         scope: '/'
//       });
      
//       // Add message listener to receive messages from the service worker
//       navigator.serviceWorker.addEventListener('message', function(event) {
//         console.log('Received message from service worker:', event.data);
//       });
      
//       console.log('ServiceWorker registration successful:', registration);
//     } catch (error) {
//       console.error('ServiceWorker registration failed:', error);
//     }
//   });
// }
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data === 'CACHING_COMPLETE') {
          console.log('All assets cached successfully');
          // Handle UI updates or other actions here
        }
      });
     
    } catch (error) {
      console.error('Registration failed:', error);
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
