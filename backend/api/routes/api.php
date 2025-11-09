<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MetadataController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::get('metadata/property-types', [MetadataController::class, 'propertyTypes']);
Route::get('locations/suggestions', [LocationController::class, 'suggestions']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('listings', ListingController::class);
});
