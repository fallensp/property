<?php

namespace App\Services;

use App\Models\Agent;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class WatermarkService
{
    /**
     * Generate (or retrieve) an agent watermark and return its public URL.
     */
    public function generateAgentWatermark(Agent $agent): string
    {
        $disk = Storage::disk('s3');
        $path = "agent-watermarks/{$agent->id}.png";

        if ($disk->exists($path)) {
            return $disk->url($path);
        }

        $name = trim($agent->full_name ?: 'Agent');
        $image = Image::create(800, 200)->fill('black');

        $image->text($name, 400, 100, function ($font) {
            $font->color('#ffffff');
            $font->size(56);
            $font->align('center');
            $font->valign('center');
        });

        $tmp = tempnam(sys_get_temp_dir(), 'wm_') . '.png';
        $image->save($tmp, quality: 90, format: 'png');

        $disk->put($path, file_get_contents($tmp), [
            'visibility' => 'public',
            'ContentType' => 'image/png',
        ]);

        @unlink($tmp);

        return $disk->url($path);
    }
}
