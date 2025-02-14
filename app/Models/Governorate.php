<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Governorate extends Model
{
    protected $fillable = ['name','label','area'];

    public function excelFiles()
    {
        return $this->hasMany(ExcelFile::class);
    }
}