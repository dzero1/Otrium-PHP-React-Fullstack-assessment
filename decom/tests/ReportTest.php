<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ReportTest extends TestCase
{
    /**
     * Report 1 test
     * Must return a brand json array including turnover per brand
     *
     * @return void
     */
    public function testReport1()
    {
        $this->json('GET', '/report/1', ['from' => '2018-12-01']);
        
        $this->assertResponseOk();

        $this->seeJsonStructure([
            "columns" => [
                    [
                        "key",
                        "name",
                        "sortable"
                    ]
                ],
            "data" => [
                [
                    'id',
                    'name',
                    'description',
                    'turnover',
                ]
            ]
        ]);
    }

    /**
     * Report 2 test
     * Must return a brand json array including turnover per brand
     *
     * @return void
     */
    public function testReport2()
    {
        $this->json('GET', '/report/2', ['from' => '2018-12-01']);
        
        $this->assertResponseOk();
        
        $this->seeJsonStructure([
            "columns" => [
                [
                    "key",
                    "name",
                    "sortable"
                ]
            ],
            "data" => [
                [
                    'date',
                    'turnover',
                ]
            ]
        ]);
    }
}
