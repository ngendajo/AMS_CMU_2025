import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function EmployementAndEducation({data,grades}) {
    let noStuMale=[];
    let stuMale=[];
    let noStuFemale=[];
    let stuFemale=[];
    let noEmpStuMale = [];
    let empStuMale = [];
    let noEmpStuFemale = [];
    let empStuFemale = [];
    
    grades.forEach((grade)=>{
        let key1=grade+"Male"+"Emp"+"noStu";
        let key2=grade+"Male"+"noEmp"+"noStu";
        noStuMale.push(data.get(key1));
        noEmpStuMale.push(data.get(key2));
        let key3=grade+"Male"+"Emp"+"Stu";
        let key4=grade+"Male"+"noEmp"+"Stu";
        stuMale.push(data.get(key4));
        empStuMale.push(data.get(key3));
        let key5=grade+"Female"+"Emp"+"noStu";
        let key6=grade+"Female"+"noEmp"+"noStu";
        noStuFemale.push(data.get(key5));
        noEmpStuFemale.push(data.get(key6));
        let key7=grade+"Female"+"Emp"+"Stu";
        let key8=grade+"Female"+"noEmp"+"Stu";
        stuFemale.push(data.get(key8));
        empStuFemale.push(data.get(key7));

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
            name: 'Boys With no Employment and Further Education Info',
            data: noEmpStuMale
        },
        {
            name: 'Girls With no Employment and Further Education Info',
            data: noEmpStuFemale
        }, {
            name: 'Employed Boys With no Further Education Info',
            data: noStuMale
        },
        {
            name: 'Employed Girls With no Further Education Info',
            data: noStuFemale
        },{
            name: 'Boys With Further Education and no Employment Info',
            data: stuMale
        },
        {
            name: 'Girls With Further Education and no Employment Info',
            data: stuFemale
        },{
            name: 'Employed Boys With Further Education',
            data: empStuMale
        },
        {
            name: 'Employed Girls With Further Education',
            data: empStuFemale
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
