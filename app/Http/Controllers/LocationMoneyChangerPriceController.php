<?php

namespace App\Http\Controllers;

use App\Models\LocationMoneyChangerPrice;
use App\Models\LocationMoneyChanger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;



class LocationMoneyChangerPriceController extends Controller
{
    // Listar todos los precios de un money changer
    public function index($id_location_money_changer)
    {
        $prices = LocationMoneyChangerPrice::where('id_location_money_changer', $id_location_money_changer)
            ->orderByDesc('created_at')
            ->get();
        return response()->json($prices);
    }

    // Crear un nuevo precio
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_location_money_changer' => 'required|exists:location_money_changer,id',
            'price_sale' => 'required|numeric',
            'price_buy' => 'required|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $price = LocationMoneyChangerPrice::create($validator->validated());
        return response()->json($price, 201);
    }

    // Actualizar un precio
    public function update(Request $request, $id)
    {
        $price = LocationMoneyChangerPrice::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'price_sale' => 'required|numeric',
            'price_buy' => 'required|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $price->update($validator->validated());
        return response()->json($price);
    }

    // Eliminar un precio
    public function destroy($id)
    {
        $price = LocationMoneyChangerPrice::findOrFail($id);
        $price->delete();
        return response()->json(['message' => 'Precio eliminado correctamente']);
    }

    public function getPricesInfo($id)
    {
        return LocationMoneyChangerPrice::where('id_location_money_changer', $id)
            ->select('price_buy', 'created_at', 'updated_at')
            ->orderByDesc('created_at')
            ->get();
    }

     public function indexWithLatestPrices()
    {
        $locations = LocationMoneyChanger::with('latestPrice')->get();

        return response()->json([
            'success' => true,
            'data' => $locations
        ]);
    }

    public function getAllBestUsdSales()
{
    // Paso 1: Obtener el precio de venta mínimo por cada casa de cambio
    $minPrices = LocationMoneyChangerPrice::select('id_location_money_changer', DB::raw('MIN(price_sale) as min_price_sale'))
        ->groupBy('id_location_money_changer')
        ->get();

    // Paso 2: Traer todos los registros que tengan ese precio mínimo por cada casa de cambio
    $result = [];
    foreach ($minPrices as $min) {
        $prices = LocationMoneyChangerPrice::where('id_location_money_changer', $min->id_location_money_changer)
            ->where('price_sale', $min->min_price_sale)
            ->with(['locationMoneyChanger'])
            ->get();
        foreach ($prices as $item) {
            $result[] = [
                'price_sale' => $item->price_sale,
                'price_buy' => $item->price_buy,
                'location' => $item->locationMoneyChanger->code,
                'ubication' => $item->locationMoneyChanger->ubication_name,
                'lat' => floatval($item->locationMoneyChanger->lan),
                'lng' => floatval($item->locationMoneyChanger->log),
            ];
        }
    }

    return response()->json([
        'success' => true,
        'data' => $result
    ]);
}


 public function getBestUsdSale()
{
    // Paso 1: Obtener los últimos precios únicos por casa de cambio
    $latestPrices = LocationMoneyChangerPrice::select(DB::raw('MAX(id) as id'))
        ->groupBy('id_location_money_changer');

    // Paso 2: Traer los detalles de esos precios (sin duplicar casas de cambio)
    $bestPrices = LocationMoneyChangerPrice::whereIn('id', $latestPrices)
        ->with(['locationMoneyChanger:id,name,ubication_name,lan,log'])
        ->orderBy('price_sale', 'asc') // ordenamos del más barato al más caro
        ->get();

    // Retornar el primero como el mejor (más barato y más reciente)
    $best = $bestPrices->first();

    return response()->json([
        'success' => true,
        'data' => [
            'price_sale' => $best->price_sale,
            'price_buy' => $best->price_buy,
            'location' => $best->locationMoneyChanger->name,
            'ubication' => $best->locationMoneyChanger->ubication_name,
            'lat' => floatval($best->locationMoneyChanger->lan),
            'lng' => floatval($best->locationMoneyChanger->log),
        ]
    ]);
}



}
