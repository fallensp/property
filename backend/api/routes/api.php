<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MetadataController;
use App\Http\Controllers\Api\PublicListingController;
use App\Http\Controllers\Api\PublicAgentController;
use App\Http\Controllers\Api\AdminAgentController;
use App\Http\Controllers\Api\AdminNeighbourhoodController;
use App\Http\Controllers\Api\PublicNeighbourhoodController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::get('metadata/property-types', [MetadataController::class, 'propertyTypes']);
Route::get('locations/suggestions', [LocationController::class, 'suggestions']);
Route::get('neighbourhoods', [PublicNeighbourhoodController::class, 'index']);
Route::prefix('public')->group(function () {
    Route::get('listings', [PublicListingController::class, 'index']);
    Route::get('listings/{listing}', [PublicListingController::class, 'show']);
    Route::get('agents/{agent}/watermark', [PublicAgentController::class, 'watermark']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('listings', ListingController::class);

    Route::prefix('admin')->group(function () {
        Route::get('agents', [AdminAgentController::class, 'index']);
        Route::get('agents/{agent}', [AdminAgentController::class, 'show']);
        Route::post('agents', [AdminAgentController::class, 'store']);
        Route::patch('agents/{agent}', [AdminAgentController::class, 'update']);

        Route::get('neighbourhoods', [AdminNeighbourhoodController::class, 'index']);
        Route::get('neighbourhoods/{neighbourhood}', [AdminNeighbourhoodController::class, 'show']);
        Route::post('neighbourhoods', [AdminNeighbourhoodController::class, 'store']);
        Route::match(['patch', 'post'], 'neighbourhoods/{neighbourhood}', [AdminNeighbourhoodController::class, 'update']);
        Route::delete('neighbourhoods/{neighbourhood}', [AdminNeighbourhoodController::class, 'destroy']);
    });
});
