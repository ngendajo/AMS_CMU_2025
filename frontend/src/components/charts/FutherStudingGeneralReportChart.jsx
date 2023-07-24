import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function FutherStudingGeneralReportChart({data,grades}) {
    let noStuMale=[];
    let stuMale=[];
    let noStuFemale=[];
    let stuFemale=[];
    grades.forEach((grade)=>{
        let key1=grade+"Male"+"Emp"+"noStu";
        let key2=grade+"Male"+"noEmp"+"noStu";
        noStuMale.push(data.get(key1)+data.get(key2));
        let key3=grade+"Male"+"Emp"+"Stu";
        let key4=grade+"Male"+"noEmp"+"Stu";
        stuMale.push(data.get(key3)+data.get(key4));
        let key5=grade+"Female"+"Emp"+"noStu";
        let key6=grade+"Female"+"noEmp"+"noStu";
        noStuFemale.push(data.get(key5)+data.get(key6));
        let key7=grade+"Female"+"Emp"+"Stu";
        let key8=grade+"Female"+"noEmp"+"Stu";
        stuFemale.push(data.get(key7)+data.get(key8));

    })
    const configObj ={
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Further Studying General Report'
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
            name: 'Boys with no Education Info',
            data: noStuMale
        },
        {
            name: 'Girls with no Education Info',
            data: noStuFemale
        }, {
            name: 'Boys with Further Education',
            data: stuMale
        },
        {
            name: 'Girls with Further Education',
            data: stuFemale
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
