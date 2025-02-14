<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password as Password;

class UserUpdateRequest extends FormRequest
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
            'username' => 'required|string|max:55',
            'phoneNumber' => 'required|string|unique:users,phoneNumber,' . $this->route('user')->id,
            'password' => ['required', 'confirmed', Password::min(8)->letters()->symbols()],
            'type' => 'required',
            'area'
        ];
    }
}