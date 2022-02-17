<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReportController extends Controller
{
    public function __construct(){}

    public function getReportFilters(Request $request, $id){
        $class = 'App\Repositories\Report'.$id.'Repository';
        if (class_exists($class)){
            $reportRepository = new $class();
            return response()->json($reportRepository->getReportFilters() );
        } else {
            return ['message' => 'Report not found!'];
        }
    }

    public function getReport(Request $request, $id){
        $class = 'App\Repositories\Report'.$id.'Repository';

        if (class_exists($class)){
            $reportRepository = new $class();

            $filters = $request->all();
            return response()->json($reportRepository->getReport( $filters ) );
        } else {
            return ['message' => 'Report not found!'];
        }
    }

}
