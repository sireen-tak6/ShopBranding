<?php

namespace App\Exports;

use App\Models\ExcelFile;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ExcelFileExport implements FromCollection, WithHeadings, WithDrawings, WithEvents
{
    protected $governorateId;
    protected $projectId;
    protected static $rowHeights = [];

    public function __construct($governorateId, $projectId)
    {
        $this->governorateId = $governorateId;
        $this->projectId = $projectId;
        self::$rowHeights = []; // reset for each export instance
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $data = ExcelFile::select('shopname', 'region', 'area',  'width', 'height', 'qty','item', 'sqm', 'status', 'notes', 'images')
            ->where('governorate_id', $this->governorateId)
            ->where('project_id', $this->projectId)
            ->get();

        // Optionally, clear out the images column so that the cell remains blank
        $data = $data->map(function ($record) {
            $record->images = '';
            return $record;
        });

        \Log::info('Export data:', $data->toArray());
        if ($data->isEmpty()) {
            \Log::warning('No data found for governorate_id: ' . $this->governorateId . ' and project_id: ' . $this->projectId);
        }
        return $data;
    }

    public function headings(): array
    {
        // Ensure that the headings order matches the columns in your sheet
        return ['ShopName', 'Region', 'Area',  'Width', 'Height', 'QTY','Item', 'SQM', 'Status', 'Notes', 'Image1','Image2','Image3'];
    }

    /**
     * Return drawings (images) for each record.
     *
     * This implementation loops through each record’s images array and places them
     * on the same row, starting from column K (11th column) for the first image.
     *
     * @return Drawing[]
     */
    public function drawings()
    {
        $drawings = [];
        // Retrieve the records used in the collection
        $records = ExcelFile::where('governorate_id', $this->governorateId)
            ->where('project_id', $this->projectId)
            ->get();

        // Start at row 2 (row 1 is for headings)
        $row = 2;
        foreach ($records as $record) {
            if (!empty($record->images) && is_array($record->images)) {
                $imageHeight = 50; // adjust height as needed

                // Loop through each image in this record
                foreach ($record->images as $index => $imagePath) {
                    $drawing = new Drawing();
                    $drawing->setName('Image');
                    $drawing->setDescription('Record Image');
                    // Build the full path on disk (make sure the file exists)
                    $drawing->setPath(storage_path('app/public/' . $imagePath));
                    $drawing->setHeight($imageHeight);

                    // Calculate the column letter: start at column 11 (which is K) and then move right
                    $columnLetter = $this->getColumnLetter(11 + $index); // e.g. 11=>K, 12=>L, etc.
                    $drawing->setCoordinates($columnLetter . $row);
                    $drawings[] = $drawing;
                }

                // Set the row height for this record's row
                self::$rowHeights[$row] = $imageHeight;
            }
            $row++;
        }

        return $drawings;
    }

    /**
     * Helper function to convert a number to an Excel column letter.
     * For example, 11 => K, 12 => L, etc.
     */
    private function getColumnLetter($num)
    {
        $letter = '';
        while ($num > 0) {
            $mod = ($num - 1) % 26;
            $letter = chr(65 + $mod) . $letter;
            $num = (int) (($num - $mod) / 26);
        }
        return $letter;
    }

    /**
     * Register an event to adjust the row heights.
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Set each row's height based on our stored mapping
                foreach (self::$rowHeights as $row => $height) {
                    $event->sheet->getDelegate()->getRowDimension($row)->setRowHeight($height);
                }
            },
        ];
    }

}