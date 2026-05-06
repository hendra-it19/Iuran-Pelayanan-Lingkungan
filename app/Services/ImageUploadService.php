<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageUploadService
{
    /**
     * Upload an image and resize it if it's too large.
     * Uses custom filesystem disk (e.g. file_upload)
     *
     * @return string $filePath
     */
    public function uploadAndResize(UploadedFile $file, string $path, int $maxWidth = 1000): string
    {
        $filename = uniqid('img_', true).'.'.$file->getClientOriginalExtension();
        $fullPath = $path.'/'.$filename;

        // Check if file size > 1MB (1024 * 1024)
        if ($file->getSize() > 1048576) {
            $manager = new ImageManager(new Driver);
            $image = $manager->read($file->getRealPath());

            // Resize while maintaining aspect ratio
            $image->scaleDown(width: $maxWidth);

            // Encode to original format, quality ~80
            $encoded = $image->encode();

            // Store using default configured disk (file_upload)
            Storage::put($fullPath, $encoded->toString());
        } else {
            // Save directly if under 1MB
            Storage::putFileAs($path, $file, $filename);
        }

        return $fullPath;
    }
}
