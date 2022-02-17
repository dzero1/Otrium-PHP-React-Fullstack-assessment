<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\ReportRepositoryInterface;
use App\Repositories\Report1Repository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(ReportRepositoryInterface::class, Report1Repository::class);
    }
}
