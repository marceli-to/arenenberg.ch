<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;

class Deploy extends Command
{
  protected $signature = 'deploy';

  protected $description = 'Publish the application';

  public function handle()
  {
    $this->call('export');
    $this->replaceInDist('https://arenenberg.ch.test', env('APP_URL_PROD'));
  }

  protected function replaceInDist($search, $replace)
  {
    $distPath = base_path('dist');
    $iterator = new RecursiveIteratorIterator(
      new RecursiveDirectoryIterator($distPath, RecursiveDirectoryIterator::SKIP_DOTS),
      RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file)
    {
      if ($file->isFile() && $file->getExtension() === 'html')
      {
        $filePath = $file->getPathname();
        $content = file_get_contents($filePath);
        $newContent = str_replace($search, $replace, $content);
        
        if ($content !== $newContent)
        {
          file_put_contents($filePath, $newContent);
        }
      }
    }

    $this->info("Replaced '{$search}' with '{$replace}' in the dist folder");

    // Update the service worker (sw.js)
    // the service works has wrong paths and filenames for .css and .js
    // 1. get dist/index.html and look for the paths
    $htmlPath = $distPath . '/index.html';
    $htmlContent = file_get_contents($htmlPath);

    // search app-xxx.css
    preg_match_all('/app-([A-Za-z0-9_]+)\.css/', $htmlContent, $matchesCss);

    // search app-xxx.js
    preg_match_all('/app-([A-Za-z0-9_]+)\.js/', $htmlContent, $matchesJs);

    // Get the service worker content
    $swPath = $distPath . '/sw.js';
    $swContent = file_get_contents($swPath);
    
    // Replace the CSS path in service worker
    if (count($matchesCss[1]) > 0) {
      $cssHash = $matchesCss[1][0]; // Get the first match
      $swContent = str_replace('/css/app.css', "/build/assets/app-{$cssHash}.css", $swContent);
      file_put_contents($swPath, $swContent);
      $this->info("Updated CSS path in service worker");
    }

    // Replace the JS path in service worker
    if (count($matchesJs[1]) > 0) {
      $jsHash = $matchesJs[1][0]; // Get the first match
      $swContent = str_replace('/js/app.js', "/build/assets/app-{$jsHash}.js", $swContent);
      file_put_contents($swPath, $swContent);
      $this->info("Updated JS path in service worker");
    }
  }
}
