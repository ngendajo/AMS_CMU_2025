import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function FutherStudingGeneralReportChart() {
    const configObj ={
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Further Studying General Report'
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
            name: 'Boys without Further Edication',
            data: [5, 3, 12, 0, 11,4]
        },
        {
            name: 'Girls without Further Edication',
            data: [5, 3, 12, 6, 11,4]
        }, {
            name: 'Boys with Further Edication',
            data: [5, 3, 12, 6, 11,1]
        },
        {
            name: 'Girls with Further Edication',
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
