<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExcelFile extends Model
{
    protected $fillable = [
        'project_id',
        'governorate_id',
        'shopname',
        'region',
        'area',
        'width',
        'height',
        'qty',
        'item',
        'sqm',
        'status',
        'notes',
        'images',
        'editedBy',
    ];

    protected $casts = [
        'images' => 'array', // Store image paths as an array
    ];
    
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function governorate()
    {
        return $this->belongsTo(Governorate::class);
    }
    public function editor()
    {
        return $this->belongsTo(User::class,'editedBy' );
    }
}