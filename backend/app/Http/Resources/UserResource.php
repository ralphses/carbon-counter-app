<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone ?? "",
            'address' => $this->address ?? "",
            'noOfVehicles' => $this->noOfVehicles ?? 0,
            'noOfGenerators' => $this->noOfGenerators ?? 0,
            'noOfMotocycles' => $this->noOfMotocycles ?? 0,
            'carbonFootPrints' => CarbonFootPrintResource::collection($this->carbonFootPrints),
            'created_at' => date('Y-m-d'),
            'updated_at' => date('Y-m-d'),
        ];
    }
}
