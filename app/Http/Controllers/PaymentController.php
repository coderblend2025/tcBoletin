<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Artisan;

class PaymentController extends Controller
{
	// GET: Devuelve si el sistema de pagos está habilitado
	public function isEnabled()
	{
		$enabled = env('PAYMENTS_ENABLED', true);
		return response()->json(['enabled' => filter_var($enabled, FILTER_VALIDATE_BOOLEAN)]);
	}

	// POST: Cambia el valor de habilitado/deshabilitado
	public function setEnabled(Request $request)
	{
		$enabled = $request->input('enabled');
		$enabled = filter_var($enabled, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';

		// Actualiza el archivo .env
		$envPath = base_path('.env');
		$envContent = file_get_contents($envPath);
		$envContent = preg_replace('/PAYMENTS_ENABLED=.*/', 'PAYMENTS_ENABLED=' . $enabled, $envContent);
		file_put_contents($envPath, $envContent);

		// Opcional: recargar config
		Artisan::call('config:clear');

		return response()->json(['enabled' => $enabled === 'true']);
	}
}
