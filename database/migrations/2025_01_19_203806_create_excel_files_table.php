<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('excel_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('governorate_id')->constrained('governorates')->onDelete('cascade');
            $table->string('shopname')->nullable();
            $table->string('region')->nullable();
            $table->string('area')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('qty')->nullable();
            $table->string('item')->nullable();
            $table->float('sqm')->nullable();
            $table->string('status')->nullable();
            $table->text('notes')->nullable();
            $table->text('images')->nullable();
            $table->foreignId('editedBy')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('excel_files');
    }
};