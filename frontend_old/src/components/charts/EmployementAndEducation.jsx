import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function EmployementAndEducation({data1}) {
    let empstumale=[];
    let empnstumale=[];
    let unempstumale=[];
    let unempnstumale=[];
    let empstufemale = [];
    let empnstufemale = [];
    let unempstufemale = [];
    let unempnstufemale = [];
    let grades = [];
    console.log(data1)
    data1.forEach((data)=>{
        grades.push(data['grade_name'])
        empstumale.push(data['empstumale']);
        empnstumale.push(data['empnstumale']);
        unempstumale.push(data['unempstumale']);
        unempnstumale.push(data['unempnstumale']);
        empstufemale.push(data['empstufemale']);
        empnstufemale.push(data['empnstufemale']);
        unempstufemale.push(data['unempstufemale']);
        unempnstufemale.push(data['unempnstufemale']);

    })
    const configObj ={
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Employment & Education General Report'
        },
        xAxis: {
            categories: grades
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
            name: 'Boys Without both Employment and Further Education',
            data: unempnstumale
        },
        {
            name: 'Girls Without both Employment and Further Education',
            data: unempnstufemale
        }, {
            name: 'Employed Boys With no Further Education',
            data: empnstumale
        },
        {
            name: 'Employed Girls With no Further Education',
            data: empnstufemale
        },{
            name: 'Boys With Further Education but not Employed',
            data: unempstumale
        },
        {
            name: 'Girls With Further Education but no Employed',
            data: unempstufemale
        },{
            name: 'Employed Boys With Further Education',
            data: empstumale
        },
        {
            name: 'Employed Girls With Further Education',
            data: empstufemale
        }],
        // Define custom colors for series
        colors: ['#F49D47', '#2b7e40', '#65451F', '#000000', '#ff00ff', '#00ffff', '#990000', '#bbffaa']
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
