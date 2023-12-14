import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function FutherStudingGeneralReportChart({data1}) {
    let noStuMale=[];
    let stuMale=[];
    let diedMale=[];
    let noInfoMale=[];
    let noStuFemale=[];
    let stuFemale=[];
    let diedFemale=[];
    let noInfoFemale=[];
    let grades=[];
    if(data1.length>0){
        data1.forEach((info)=>{
            grades.push(info['grade_name']);
            noStuMale.push(info['nstupmale']);
            stuMale.push(info['stumale']);
            diedMale.push(info['diedmale']);
            noInfoMale.push(info['noinfomale']);
            noStuFemale.push(info['nstufemale']);
            stuFemale.push(info['stufemale']);
            diedFemale.push(info['diedfemale']);
            noInfoFemale.push(info['noinfofemale']);
    
        })
    }
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
        series: [
            /* {
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
        }, */
        {
            name: 'Boys with no Futher Education',
            data: noStuMale
        },
        {
            name: 'Girls with no Futher Education',
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
