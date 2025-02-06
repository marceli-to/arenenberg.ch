<body class="bg-white text-black text-sm antialiased leading-[1.25] flex min-h-screen flex-col max-w-lg mx-auto">
@if (Request::routeIs('page.home'))
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    });
  }
</script>
@endif
{{ $slot }}
@vite('resources/js/app.js')
</body>
</html>
<!-- made with ❤ by bivgrafik.ch & marceli.to -->
