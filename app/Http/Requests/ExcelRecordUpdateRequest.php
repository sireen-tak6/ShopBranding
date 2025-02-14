<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExcelRecordUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shopname' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'area' => 'nullable|string|max:255',
            'width' => 'nullable|integer',
            'height' => 'nullable|integer',
            'qty' => 'nullable|integer',
            'item' => 'nullable|string|max:255',
            'sqm' => 'nullable|numeric',
            'status' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'nullable|string|max:255',
        ];
    }
}