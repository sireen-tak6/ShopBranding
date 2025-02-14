<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GovernoratesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $governorates = [
            ['name' => 'Baghdad', 'label' => 'بغداد (Baghdad)' , 'area'=>'south'],
            ['name' => 'Basra', 'label' => 'البصرة (Basra)','area'=>'south'],
            ['name' => 'Mosul', 'label' => 'الموصل (Mosul)','area'=>'north'],
            ['name' => 'Anbar', 'label' => 'الأنبار (Anbar)', 'area'=>'south'],
            ['name' => 'Karbala', 'label' => 'كربلاء (Karbala)', 'area'=>'south'],
            ['name' => 'Najaf', 'label' => 'النجف (Najaf)', 'area'=>'south'],
            ['name' => 'Diyala', 'label' => 'ديالى (Diyala)', 'area'=>'south'],
            ['name' => 'Nasiriya', 'label' => 'الناصرية (Nasiriya)', 'area'=>'south'],
            ['name' => 'Diwaniyah', 'label' => 'الديوانية (Diwaniyah)', 'area'=>'south'],
            ['name' => 'Maysan', 'label' => 'ميسان (Maysan)', 'area'=>'south'],
            ['name' => 'Kut', 'label' => 'الكوت (Kut)', 'area'=>'south'],
            ['name' => 'Babylon', 'label' => 'بابل (Babylon)', 'area'=>'south'],
            ['name' => 'Kirkuk', 'label' => 'كركوك (Kirkuk)','area'=>'north'],
            ['name' => 'Salah al-Din', 'label' => 'صلاح الدين (Salah al-Din)', 'area'=>'south'],
            ['name' => 'Erbil', 'label' => 'أربيل (Erbil)','area'=>'north'],
            ['name' => 'Sulaymaniyah', 'label' => 'السليمانية (Sulaymaniyah)','area'=>'north'],
            ['name' => 'Dohuk', 'label' => 'دهوك (Dohuk)','area'=>'north'],
            ['name' => 'Samawah', 'label' => 'السماوة (Samawah)', 'area'=>'south'],
            ['name' => 'Shatrah', 'label' => 'الشطرة (Shatrah)', 'area'=>'south'],
            ['name' => 'Khanaqin', 'label' => 'خانقين (Khanaqin)','area'=>'north'],
            ['name' => 'Tikrit', 'label' => 'تكريت (Tikrit)', 'area'=>'south'],
            ['name' => 'Samarra', 'label' => 'سامراء (Samarra)', 'area'=>'south'],
            ['name' => 'Baqubah', 'label' => 'بعقوبة (Baqubah)', 'area'=>'south'],
            ['name' => 'Al-Hillah', 'label' => 'الحلة (Al-Hillah)', 'area'=>'south'],
        ];

        DB::table('governorates')->insert($governorates);
    }
}