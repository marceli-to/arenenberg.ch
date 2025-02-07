<body class="bg-white text-black text-sm antialiased leading-[1.25] flex min-h-screen flex-col max-w-lg mx-auto">
{{ $slot }}
@if (!Request::routeIs('page.station.*'))
  <script src="/js/db.js"></script>
  <script src="/js/main.js"></script>
@endif
</body>
</html>
<!-- made with ❤ by bivgrafik.ch & marceli.to -->
