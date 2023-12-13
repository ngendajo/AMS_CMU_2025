import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function EmploymentGeneralReportChart({empByGrade}) {
    let noEmpMale=[];
    let empMale=[];
    let noEmpFemale=[];
    let empFemale=[];
    let grades=[];
    console.log(empByGrade)
    for(data in empByGrade){
        grades.push(data['grade_name']);
        noEmpMale.push(data['unempmale']);
        empMale.push(data['empmale']);
        noEmpFemale.push(data['unempfemale']);
        empFemale.push(data['empfemale']);

    }



    const configObj ={
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Employment General Report'
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
            name: 'Boys with no Employment Info',
            data: noEmpMale
        },
        {
            name: 'Girls with no Employment Info',
            data:noEmpFemale
        }, {
            name: 'Employed Boys',
            data: empMale
        },
        {
            name: 'Employed Girls',
            data: empFemale
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
