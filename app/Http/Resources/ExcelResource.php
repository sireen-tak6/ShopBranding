<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExcelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'shopname' => $this->shopname,
            'region' => $this->region,
            'area' => $this->area,
            'width' => $this->width,
            'height' => $this->height,
            'qty' => $this->qty,
            'item' => $this->item,
            'sqm' => $this->sqm,
            'status' => $this->status,
            'notes' => $this->notes,
            'images' => $this->images,
            'editedBy'   => is_object(value: $this->editor) ? $this->editor->username : null,
            'updated_at' => $this->updated_at->format('Y-m-d')
        ];
    }
}