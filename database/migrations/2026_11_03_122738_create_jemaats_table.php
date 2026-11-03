<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jemaats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('keluarga_id')->constrained('keluargas')->cascadeOnDelete();
            $table->string('nama');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->date('tanggal_lahir');
            $table->enum('status', ['single', 'menikah', 'cerai', 'cerai_mati'])->default('single');
            $table->string('hubungan_keluarga')->nullable(); // kepala_keluarga, istri, anak, dll
            $table->date('tanggal_baptis')->nullable();
            $table->string('file_baptis')->nullable();
            $table->date('tanggal_sidi')->nullable();
            $table->string('file_sidi')->nullable();
            $table->date('tanggal_menikah')->nullable();
            $table->string('file_menikah')->nullable();
            $table->string('telepon')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jemaats');
    }
};
