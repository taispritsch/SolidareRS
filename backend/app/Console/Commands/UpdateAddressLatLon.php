<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Address;

class UpdateAddressLatLon extends Command
{
    protected $signature = 'address:update-lat-lon';
    protected $description = 'Atualiza latitude e longitude dos endereços usando a API do Google Maps';

    public function handle()
    {
        $googleApiKey = env('GOOGLE_MAPS_API_KEY');

        $addresses = Address::all();

        foreach ($addresses as $address) {
            $fullAddress = "{$address->street}, {$address->neighborhood}, {$address->city}, Brasil";

            $response = Http::get("https://maps.googleapis.com/maps/api/geocode/json", [
                'address' => $fullAddress,
                'key' => $googleApiKey,
            ]);

            if ($response->successful() && count($response->json()['results']) > 0) {
                $location = $response->json()['results'][0]['geometry']['location'];
                $address->latitude = $location['lat'];
                $address->longitude = $location['lng'];
                $address->save();

                $this->info("Atualizado: {$address->city} - ({$location['lat']}, {$location['lng']})");
            } else {
                $this->error("Erro ao buscar: {$fullAddress}");
            }
        }

        $this->info('Atualização de latitude e longitude concluída.');
    }
}
