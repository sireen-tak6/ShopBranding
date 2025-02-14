<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'governorate_id',
        'user_id',
        'message',
    ];

    // Relationship with the Project model
   
    public function users()
    {
        return $this->belongsToMany(User::class, 'notification_user')->withPivot('is_read')->withTimestamps();
    }

    // Relationship with the Project model
    public function project()
    {
        return $this->belongsTo(Project::class,'project_id');
    }

    // Relationship with the Governorate model
    public function governorate()
    {
        return $this->belongsTo(Governorate::class,'governorate_id');
    }

    // Relationship with the user who created the notification
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}