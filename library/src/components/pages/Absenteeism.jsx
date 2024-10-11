import React, {useState, useEffect} from 'react'
import { utils, writeFile } from 'xlsx'; 
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import baseUrl from "../../api/baseUrl";
import DynamicTable from "./dinamicTable/DynamicTable";

export default function Absenteeism() {
    const [data, setData] = useState([]);
    const [filtered_data, setFiltered_data] = useState([]);
    const [general_data, setGeneral_data] = useState([]);
    let {auth} = useAuth();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


    useEffect(() =>{
    
        const getData = async () =>{
            try{
                const response = await axios.get(baseUrl+'/attendances/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true 
                });
                var data = response.data;
                var organized_data = [];
                var processed = {};
                
                data.forEach(record => {
                    // Define the key as a combination of studentid and date
                    let key = `${record['studentid']}_${record['date']}`;
                
                    // Check if the key is already processed
                    if (!(key in processed)) {
                        // Initialize a new record for this student and date
                        let row = {
                            "date": record['date'],
                            "studentid": record['studentid'],
                            "name": (record['student_last_name']+" "+record['student_first_name']).split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' '),
                            "gender": record['gender'],
                            "family_name": record['family_name'],
                            "grade_name": record['grade_name'],
                            "combination_name": record['combination_name'],
                            // Initialize 7 period keys with empty values
                            "period_1": " ",
                            "period_2": " ",
                            "period_3": " ",
                            "period_4": " ",
                            "period_5": " ",
                            "period_6": " ",
                            "period_7": " "
                        };
                        
                        // Add the record to organized_data and mark it as processed
                        organized_data.push(row);
                        processed[key] = row;
                    }
                
                    // Map the staff details to the corresponding period key (period_1, period_2, etc.)
                    let period_key = `period_${record['period']}`; // Create the period key (e.g., 'period_1')
                    processed[key][period_key] = (record['status']).split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ')+" Taken By (" + record['staff_last_name'] + " " + record['staff_first_name'] + ")";
                });
                
                setData(organized_data);
            }catch(err) {
                console.log(err);
                //navigate('/error');
            }
        }
        getData();
    
    },[auth])
    
    // Function to filter today's data
  const filterToday = () => {
    const today = new Date().toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
    const filtered = data.filter(item => item.date === today);
    setFiltered_data(filtered);
    generalData(filtered);
  };

  const filterWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday of the current week

    const startOfWeekString = startOfWeek.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
    const todayString = today.toISOString().split('T')[0];

    const filtered = data.filter(
      item => item.date >= startOfWeekString && item.date <= todayString
    );

    setFiltered_data(filtered);
    generalData(filtered);
  };

  const filterMonth = () => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); // Get the current year and month in 'YYYY-MM' format

    const filtered = data.filter(
      item => item.date.slice(0, 7) === currentMonth
    );

    setFiltered_data(filtered);
    generalData(filtered);
  };

    // Function to filter data between custom start and end dates
  const filterCustomDateRange = () => {
    if (startDate && endDate) {
      const filtered = data.filter(
        item => item.date >= startDate && item.date <= endDate
      );
      setFiltered_data(filtered);
      generalData(filtered);
    }
  };
  const generalData = (filtered) => {
    let studentCountArray = []; // To store the count of each student as an array
    let id = 1;

    filtered.forEach(record => {
        let studentid = record['studentid'];

        // Find if the student already exists in the array
        let student = studentCountArray.find(s => s.studentid === studentid);

        if (student) {
            // If student exists, increment the count
            student.count++;
        } else {
            // If student is encountered for the first time, add a new entry
            studentCountArray.push({
                "#": id++, // Assigning a sequential ID
                "studentid": studentid,
                "name": record['name'],
                "gender": record['gender'],
                "grade_name": record['grade_name'],
                "combination_name": record['combination_name'],
                "family_name": record['family_name'],
                "count": 1 // Start count at 1
            });
        }
    });

    // Sort the studentCountArray by count in descending order
    studentCountArray.sort((a, b) => b.count - a.count);

    // Set the sorted data
    setGeneral_data(studentCountArray);
};
  const downloadData = () => {
    // Prepare data for export
    const data = filtered_data.map((item, index) => ([
      `${index + 1}.`,                           // No.
      item.date,                                 // Date
      item.studentid,                            // Student ID
      `${item.student_last_name} ${item.student_first_name}`,  // Name
      item.grade_name,                           // Grade
      item.family_name,                          // Family Name
      item.combination_name,                     // Combination
      item.period_1,
      item.period_2,
      item.period_3,
      item.period_4,
      item.period_5,
      item.period_6,
      item.period_7
    ]));

    // Add headers for the columns
    const headers = [
      "No", "Date", "Student ID", "Name", "Grade", "Family Name", "Combination",
      "Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6", "Period 7"
    ];

    // Create a new worksheet with the data and headers
    const worksheet = utils.aoa_to_sheet([headers, ...data]);

    // Create a new workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Student Absenteeism Data");

    // Create a filename with the current date, time, and nanoseconds
    const now = new Date();
    const currentTime = now.toISOString().replace(/[-:]/g, '').split('.')[0]; // Format: YYYYMMDDTHHMMSS
    const nanoseconds = now.getMilliseconds() * 1000000; // Get nanoseconds
    const fileName = `student_data_${currentTime}_${nanoseconds}.xlsx`;

    // Trigger the file download
    writeFile(workbook, fileName);
  };
    const buttonStyles = {
        input: {
            padding: '10px',
            fontSize: '14px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '10px',
            width: '200px',
          },
          label: {
            fontSize: '16px',
            marginRight: '10px',
          },
        container: {
          display: 'flex',
          justifyContent: 'space-around', // Spacing between buttons
          alignItems: 'center', // Align items in the center vertically
          margin: '20px 0',
        },
        common: {
          padding: '10px 20px',
          margin: '5px',
          border: 'none',
          borderRadius: '5px',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '16px',
        },
        today: {
          backgroundColor: '#002F6C',
        },
        thisWeek: {
          backgroundColor: '#47805F',
        },
        thisMonth: {
          backgroundColor: '#F49B45',
        },
        custom: {
          backgroundColor: '#002F6C', // You can change this color if you prefer
        },
      };
  return (
    <div> 
        <center><h1>Absenteeism</h1></center>
        <div style={buttonStyles.container}>
            
            {/* Button to filter today's data */}
            <button
                style={{ ...buttonStyles.common, ...buttonStyles.today }}
                onClick={filterToday}  // Call filterToday on button click
            >
                Today
            </button>
            <button 
                style={{ ...buttonStyles.common, ...buttonStyles.thisWeek }}
                onClick={filterWeek}
            >
                    This Week
            </button>
            <button 
                style={{ ...buttonStyles.common, ...buttonStyles.thisMonth }}
                onClick={filterMonth}
            >
                This Month
            </button>
            <div>
                <h2>Filter Data by Custom Date Range</h2>

                    {/* Input fields for selecting the start and end dates */}
                    <div>
                        <label style={buttonStyles.label}>
                        Start Date:
                        <input
                            type="date"
                            style={buttonStyles.input}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)} // Update start date
                        />
                        </label>
                    </div>

                    <div>
                        <label style={buttonStyles.label}>
                        End Date:
                        <input
                            type="date"
                            style={buttonStyles.input}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)} // Update end date
                        />
                        </label>
                    </div>

                    {/* Button to filter data between the custom date range */}
                    <button
                        style={{ ...buttonStyles.common, ...buttonStyles.custom }}
                        onClick={filterCustomDateRange}  // Call filterCustomDateRange when button is clicked
                    >
                        Filter by Date Range
                    </button>
            </div>

        </div>
        {general_data.length > 0 ? (
            <>
                <h2>General Report</h2>
                <DynamicTable mockdata={general_data} />
            </>
        ) : (
          <p></p>
        )}
        
        {filtered_data.length > 0 ? (
            <>
                <h2>By Date</h2>
                <button
                        style={{ ...buttonStyles.common, ...buttonStyles.today }}
                        onClick={downloadData}
                    >
                        Download Data
                </button>
                <DynamicTable mockdata={filtered_data} />
          </>
        ) : (
          <p>Click on Desired Data.</p>
        )}
        
    </div>
  )
}
