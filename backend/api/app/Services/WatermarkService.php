<?php

namespace App\Services;

use App\Models\Agent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Throwable;

class WatermarkService
{
    /**
     * Generate (or retrieve) an agent watermark and return its public URL.
     */
    public function generateAgentWatermark(Agent $agent): ?string
    {
        try {
            $disk = Storage::disk('s3');
            $path = "agent-watermarks/{$agent->id}.png";

            Log::info('WatermarkService: Starting watermark generation', [
                'agent_id' => $agent->id,
                'agent_name' => $agent->full_name,
                'path' => $path,
                'existing_watermark_path' => $agent->watermark_path,
            ]);

            // If agent already has watermark path stored and file exists, return it
            if ($agent->watermark_path && $disk->exists($path)) {
                Log::info('WatermarkService: Watermark already exists', ['path' => $path]);
                return $disk->url($path);
            }

            $name = trim($agent->full_name ?: 'Agent');

            Log::info('WatermarkService: Creating image for agent', ['name' => $name]);

            $image = Image::create(800, 200)->fill('black');

            $image->text($name, 400, 100, function ($font) {
                $font->color('#ffffff');
                $font->size(56);
                $font->align('center');
                $font->valign('center');
            });

            $tmp = tempnam(sys_get_temp_dir(), 'wm_') . '.png';
            $image->save($tmp, quality: 90, format: 'png');

            Log::info('WatermarkService: Image saved to temp file', [
                'tmp_path' => $tmp,
                'file_exists' => file_exists($tmp),
                'file_size' => file_exists($tmp) ? filesize($tmp) : 0,
            ]);

            $uploaded = $disk->put($path, file_get_contents($tmp), [
                'visibility' => 'public',
                'ContentType' => 'image/png',
            ]);

            Log::info('WatermarkService: S3 upload result', [
                'uploaded' => $uploaded,
                'path' => $path,
            ]);

            @unlink($tmp);

            if ($uploaded) {
                // Save the watermark path to the agent record
                $agent->update(['watermark_path' => $path]);

                $url = $disk->url($path);
                Log::info('WatermarkService: Watermark generated successfully', [
                    'url' => $url,
                    'path' => $path,
                ]);

                return $url;
            }

            Log::error('WatermarkService: S3 upload returned false', [
                'agent_id' => $agent->id,
                'path' => $path,
            ]);

            return null;

        } catch (Throwable $e) {
            Log::error('WatermarkService: Exception during watermark generation', [
                'agent_id' => $agent->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return null;
        }
    }
}
