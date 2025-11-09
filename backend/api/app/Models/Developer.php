<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Developer extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'slug',
        'registration_number',
        'email',
        'phone',
        'website',
        'logo_url',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public static function booted(): void
    {
        static::creating(function (Developer $developer): void {
            if (! $developer->id) {
                $developer->id = (string) Str::ulid();
            }
        });
    }

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }
}
