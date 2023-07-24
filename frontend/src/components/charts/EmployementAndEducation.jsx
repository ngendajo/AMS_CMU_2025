import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function EmployementAndEducation() {
  const configObj ={
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Employment & Education General Report'
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
            name: 'Unemployed and  Boys Without Further Education',
            data: [5, 3, 12, 0, 11,4]
        },
        {
            name: 'Unemployed Girls Without Further Education',
            data: [5, 3, 12, 6, 11,4]
        }, {
            name: 'Employed Boys Without Further Education',
            data: [5, 3, 12, 6, 11,1]
        },
        {
            name: 'Employed Girls Without Further Education',
            data: [5, 0, 12, 6, 11,4]
        },{
            name: 'Unemployed Boys With Further Education',
            data: [5, 3, 12, 6, 11,1]
        },
        {
            name: 'Unemployed Girls With Further Education',
            data: [5, 0, 12, 6, 11,4]
        },{
            name: 'Employed Boys With Further Education',
            data: [5, 3, 12, 6, 11,1]
        },
        {
            name: 'Employed Girls With Further Education',
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
