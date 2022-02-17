<?php

namespace App\Repositories;

use Log;
use App\Interfaces\ReportRepositoryInterface;
use Illuminate\Support\Facades\Http;

// Turnover per brand

class Report1Repository implements ReportRepositoryInterface 
{

    private $API_ROOT;

    public function __construct(){
        $this->API_ROOT = env('APP_API_ROOT');
    }

    public function getReportFilters () 
    {
        /* Filtrable and it's type */
        return [ 
            (object)['name' => 'from', 'type' => 'date'], 
            (object)['name' => 'to', 'type' => 'date'], 
        ];
    }

    public function getReport ($filters = []) 
    {
        /* Get vat exclusion value */
        $vat = env('APP_VAT') !== null ? env('APP_VAT') : 21;
        $vat_exclude = (100 - $vat)/100;

        /* Init filters */
        $from = isset($filters['from']) && !empty($filters['from']) ? strtotime($filters['from']) : strtotime("-7 days");      // default check on last 7 days
        Log::info(date('Y-m-d H:i:s', $from));

        $to = isset($filters['to']) && !empty($filters['to']) ? strtotime($filters['to']) : strtotime("+7 days", $from);      // default check on last 7 days
        $to = min($to, strtotime("+6 days", $from));    // Limit to max 7 days
        Log::info(date('Y-m-d H:i:s', $to));

        /* Get all brands */
        $brands_response = Http::get("{$this->API_ROOT}/brands.json");
        if ($brands_response->ok()){
            $brands = $brands_response->json();
        } else if ($brands_response->failed() || $brands_response->serverError()){
            return ["status" => false, "message" => "Unable to load brands from API."];
        }

        /* Get all turnover data */
        $turnover_response = Http::get("{$this->API_ROOT}/gmv.json");
        if ($turnover_response->ok()){
            $turnover = $turnover_response->json();
        } else if ($turnover_response->failed()){
            return ["status" => false, "message" => "Unable to load turnover details from API."];
        }

        /* Filter turnover data based on filters */
        $filtered_turnover = array_filter($turnover, function ($obj) use ($from, $to){
            return ( $from <= strtotime($obj['date']) && strtotime($obj['date']) <= $to ) ;
        });

        /* Calculating turnover per brand */
        $brands_turnover = array_map(function($item) use ($filtered_turnover, $vat_exclude) {
            
            $id = $item['id'];      // Brand id

            /* Calculate turn over */
            $item['turnover'] = array_reduce($filtered_turnover, function ($carry, $obj) use ($id, $vat_exclude){
                $carry = bcadd($carry, ($obj['brand_id'] == $id ? $obj['turnover'] * $vat_exclude : 0), 2);
                return $carry;
            });

            return (object)['id' => $item['id'], 'name' => $item['name'], 'description' => $item['description'], 'turnover' => $item['turnover']];
        }, $brands);

        $response = new \StdClass();
        $response->title = "Turnover per brand";
        $response->columns = [
            (object)['key' => 'id', 'name' => 'Id', 'sortable' => 'true'], 
            (object)['key' => 'name', 'name' => 'Name', 'sortable' => 'true'], 
            (object)['key' => 'description', 'name' => 'Description'], 
            (object)['key' => 'turnover', 'name' => 'Turnover', 'sortable' => 'true']
        ];
        $response->data = $brands_turnover;

        return $response;
    }
}
