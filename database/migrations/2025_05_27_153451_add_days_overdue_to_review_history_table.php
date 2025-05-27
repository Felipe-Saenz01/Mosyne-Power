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
        Schema::table('review_history', function (Blueprint $table) {
            $table->integer('days_overdue')->default(0)->after('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('review_history', function (Blueprint $table) {
            $table->dropColumn('days_overdue');
        });
    }
};
