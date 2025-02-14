<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'code','status'];

    public function excelFiles()
    {
        return $this->hasMany(ExcelFile::class);
    }

    
}