import './App.css';
import { Sidepanel } from './components/Sidepanel';
import { useState } from 'react';
import DataTable from 'react-data-table-component';


function App() {
  /* Set default api endpoint */
  const API_ROOT = process.env.REACT_APP_API_ENDPOINT;

  /* State variables */
  const [filters, setFilters] = useState([]);
  const [reportId, setReportId] = useState(0);
  const [reportFilters, setReportFilters] = useState({});
  const [reportData, setReport] = useState({});

  /* On report select from side panel */
  const itemSelect = (id) => {
    setReportId(id);
    setReportFilters({});
    setReport([]);
    setFilters([]);
    fetch(`${API_ROOT}/report/${id}/filters`)
    .then( response => response.json() )
    .then ( data => setFilters(data) )
  }

  /* Update filter values */
  const setFilterValues = (name, value) => {
    let obj = {};
    obj[name] = value;

    setReportFilters(prevState => {
      return Object.assign(prevState, obj);
    })
  }

  /* Generate report */
  const getReport = () => {
    let url = new URL(`${API_ROOT}/report/${reportId}`);    // make report path
    Object.keys(reportFilters).forEach(key => url.searchParams.append(key, reportFilters[key]));  // append filters

    // call report api
    fetch( url )
    .then( response => response.json() )
    .then ( _report_data => {

      // check for data object structure
      if (typeof _report_data == 'object' && Array.isArray(_report_data.columns) && Array.isArray(_report_data.data)){

        // generate data table column
        let columns = [];
        _report_data.columns.forEach(cols => {
          columns.push({
              name: cols.name,
              selector: row => row[cols.key],
              sortable: cols.sortable != undefined && cols.sortable == 'true'
          });
        });
        _report_data.columns = columns;

        /* Update report data variable state */
        setReport(_report_data);
      }

    });
    
  }

  return (
    <div className="app">

      {/* Render side panel component */}
      <Sidepanel onItemSelect={itemSelect}></Sidepanel>


      <div className='page-container'>

        <div className='filters'>
            {/* Only render if report selected and filters available */}
            {reportId > 0 && filters.map( (filter, i) => (
              <div key={"filter-" + i} className='filter-group'>
                <label key={filter.name} >{filter.name}&nbsp;&nbsp;</label>
                <input key={filter.name + "_input"} data-testid={filter.name} type={filter.type} onChange={(e) => setFilterValues(filter.name, e.target.value)}></input>
              </div>
            ) )}

            {/* Render get report button only if report selected from side panel */}
            {
              reportId > 0 && 
                <a className='btn btn-generate-report' onClick={getReport}>Get report</a>
            }
        </div>

        {/* Only render if report data available */}
        {
          reportData.data && Array.isArray(reportData.data) && 
          <>
            <h4 data-testid="report-title" className='report-title'>{reportData.title}</h4>
            <div className='report'>
              <DataTable columns={reportData.columns} data={reportData.data} />
            </div>
          </>
        }


        {/* Only render if report not selected */}
        {
          reportId == 0 && 
          <div> Please choose a report from the side panel. </div>
        }


      </div>
    </div>
  );
}

export default App;