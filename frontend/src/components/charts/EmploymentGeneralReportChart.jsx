import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function EmploymentGeneralReportChart({data1}) {
    let noEmpMale=[];
    let empMale=[];
    let diedMale=[];
    let noInfoMale=[];
    let noEmpFemale=[];
    let empFemale=[];
    let diedFemale=[];
    let noInfoFemale=[];
    let grades=[];
    if(data1.length>0){
        data1.forEach((info)=>{
            grades.push(info['grade_name']);
            noEmpMale.push(info['unempmale']);
            empMale.push(info['empmale']);
            diedMale.push(info['diedmale']);
            noInfoMale.push(info['noinfomale']);
            noEmpFemale.push(info['unempfemale']);
            empFemale.push(info['empfemale']);
            diedFemale.push(info['diedfemale']);
            noInfoFemale.push(info['noinfofemale']);
    
        })
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
            name: 'Deceased Boys',
            data: diedMale
        },
        {
            name: 'Deceased Girls',
            data: diedFemale
        },{
            name: 'Boys with No Info',
            data: noInfoMale
        },
        {
            name: 'Girls with No Info',
            data: noInfoFemale
        },{
            name: 'Unemployed Boys',
            data: noEmpMale
        },
        {
            name: 'Unemployed Girls',
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
