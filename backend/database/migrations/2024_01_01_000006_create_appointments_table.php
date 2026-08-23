<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique(); // مثل APT-1001 در PDF
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->date('appointment_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', [
                'pending',
                'confirmed',
                'in_queue',
                'in_progress',
                'completed',
                'cancelled',
            ])->default('pending');
            $table->unsignedBigInteger('price'); // snapshot قیمت خدمت در لحظه رزرو
            $table->text('notes')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            // برای چک سریع تداخل زمانی یک متخصص در یک روز
            $table->index(['employee_id', 'appointment_date', 'start_time']);
            $table->index(['business_id', 'appointment_date', 'status']);
            $table->index('customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};