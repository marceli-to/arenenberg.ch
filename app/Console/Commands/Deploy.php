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

        // Update all links within <nav></nav> to add /index.html at the end
        $htmlContent = file_get_contents($filePath);
        
        // Find all nav elements and process each one
        preg_match_all('/<nav[^>]*>(.*?)<\/nav>/s', $htmlContent, $navMatches);
        
        if (!empty($navMatches[0])) {
            foreach ($navMatches[0] as $navContent) {
                // Find all links in nav that don't already end with /index.html
                preg_match_all('/<a href="([^"]+)(?<!\/index\.html)"/', $navContent, $matches);
                
                if (count($matches[1]) > 0) {
                    $newNavContent = $navContent;
                    foreach ($matches[1] as $link) {
                        // Add /index.html to the link if it doesn't already have it
                        $newLink = rtrim($link, '/') . '/index.html';
                        $newNavContent = str_replace('href="' . $link . '"', 'href="' . $newLink . '"', $newNavContent);
                    }
                    // Replace this specific nav content with the new one
                    $htmlContent = str_replace($navContent, $newNavContent, $htmlContent);
                }
            }
            
            // Only write to file and log if changes were made
            file_put_contents($filePath, $htmlContent);
            $this->info("Updated links in <nav></nav> for file: " . $filePath);
        }
      }
    }

    $this->info("Replaced '{$search}' with '{$replace}' in the dist folder");

  }
}
