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
        Schema::create('anggota_marturias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jemaat_id')->nullable()->constrained('jemaats')->nullOnDelete();
            $table->string('nama');
            $table->string('jabatan'); // JabatanMarturiaEnum
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->string('instrumen')->nullable(); // misal: Keyboard, Gitar, Bass, Drum, Saxophone
            $table->date('tanggal_bergabung')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggota_marturias');
    }
};
