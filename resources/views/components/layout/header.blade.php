<header
  @class([
    'sticky  top-0 left-0 z-40 w-full',
    // 'h-80 md:h-85 lg:h-80' => Request::routeIs('page.home'),
  ])>
  <div class="max-w-lg mx-auto bg-gray-100 p-10">
    <nav>
      <ul class="flex gap-x-15">
        <li>
          <a href="{{ route('page.home') }}">Home</a>
        </li>
        <li>
          <a href="{{ route('page.stations') }}">Stationen</a>
        </li>
      </ul>
    </nav>
  </div>
  
</header>
