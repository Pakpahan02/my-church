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
        Schema::create('keluargas', function (Blueprint $table) {
            $table->id();
            $table->string('nrj')->unique(); // Nomor Register Jemaat
            $table->string('nama_keluarga');
            $table->foreignId('wilayah_id')->constrained('wilayahs')->cascadeOnDelete();
            $table->text('alamat');
            $table->date('tanggal_terdaftar');
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
        Schema::dropIfExists('keluargas');
    }
};
