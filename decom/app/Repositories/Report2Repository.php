<?php

namespace App\Repositories;

use Log;
use App\Interfaces\ReportRepositoryInterface;
use Illuminate\Support\Facades\Http;

// Turnover per brand

class Report2Repository implements ReportRepositoryInterface 
{

    private $API_ROOT;

    public function __construct(){
        $this->API_ROOT = env('APP_API_ROOT');
    }

    public function getReportFilters() 
    {
        /* Filtrable and it's type */
        return [ 
            (object)['name' => 'from', 'type' => 'date'], 
            (object)['name' => 'to', 'type' => 'date'], 
        ];
    }

    public function getReport($filters = []) 
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

        /**
         * Get all turnover data
         * 
         * Note: Assuming the real API have date filter. Here I added a fixture to overcome it.
         * */
        $turnover_response = Http::get("{$this->API_ROOT}/gmv.json");
        if ($turnover_response->ok()){
            $turnover = $turnover_response->json();
        } else if ($turnover_response->failed()){
            return ["status" => false, "message" => "Unable to load turnover details from API."];
        }

        /* Create dates collection */
        $turnover_each_day = [];
        $begin = new \DateTime( date('Y-m-d', $from) );
        $end   = new \DateTime( date('Y-m-d', $to) );
        for($i = $begin; $i <= $end; $i->modify('+1 day')){
            $dt = $i->format("Y-m-d 00:00:00");
            $turnover_each_day[$dt] = ['date' => substr($dt, 0, 10), 'turnover' => 0];
        }

        /* Fill data to days */
        foreach ($turnover as $value) {
            if ($from <= strtotime($value['date']) && strtotime($value['date']) <= $to){
                $turnover_each_day[$value['date']]['turnover'] = bcadd($turnover_each_day[$value['date']]['turnover'], $value['turnover'], 2);
            }
        }

        $response = new \StdClass();
        $response->title = "Turnover per day";
        $response->columns = [
            (object)['key' => 'date', 'name' => 'Date', 'sortable' => 'true'], 
            (object)['key' => 'turnover', 'name' => 'Turnover', 'sortable' => 'true']
        ];
        $response->data = array_values($turnover_each_day);

        return $response;
    }
}
