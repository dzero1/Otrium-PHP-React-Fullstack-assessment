<?php

namespace App\Interfaces;

interface ReportRepositoryInterface 
{
    public function getReportFilters();
    public function getReport();
}