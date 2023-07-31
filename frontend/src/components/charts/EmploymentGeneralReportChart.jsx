import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function EmploymentGeneralReportChart({data,grades}) {
    let noEmpMale=[];
    let empMale=[];
    let noEmpFemale=[];
    let empFemale=[];
    grades.forEach((grade)=>{
        let key1=grade+"Male"+"noEmp"+"Stu";
        let key2=grade+"Male"+"noEmp"+"noStu";
        noEmpMale.push(data.get(key1)+data.get(key2));
        let key3=grade+"Male"+"Emp"+"Stu";
        let key4=grade+"Male"+"Emp"+"noStu";
        empMale.push(data.get(key3)+data.get(key4));
        let key5=grade+"Female"+"noEmp"+"Stu";
        let key6=grade+"Female"+"noEmp"+"noStu";
        noEmpFemale.push(data.get(key5)+data.get(key6));
        let key7=grade+"Female"+"Emp"+"Stu";
        let key8=grade+"Female"+"Emp"+"noStu";
        empFemale.push(data.get(key7)+data.get(key8));

    })



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
