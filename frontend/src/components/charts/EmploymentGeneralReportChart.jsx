import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function EmploymentGeneralReportChart() {
    const configObj ={
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Employment General Report'
        },
        xAxis: {
            categories: ['Urumuri', 'Indatwa', 'Isonga', 'Umurage', 'Umucyo','Others']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Alumni'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Unemployed Boys',
            data: [5, 3, 12, 0, 11,4]
        },
        {
            name: 'Unemployed Girls',
            data: [5, 3, 12, 6, 11,4]
        }, {
            name: 'Employed Boys',
            data: [5, 3, 12, 6, 11,1]
        },
        {
            name: 'Employed Girls',
            data: [5, 0, 12, 6, 11,4]
        }
        
    ]
    };
    
  return (
    <div>
        <HighchartsReact
            highcharts={Highcharts}
            options={configObj}
        />
    </div>
  )
}
