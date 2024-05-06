import axios from "axios";
import {React,useState, useEffect} from "react";
import useAuth from "../../hooks/useAuth";
import { Link,useNavigate } from "react-router-dom";
import baseUrl from "../../api/baseUrl";

export default function Issue() {
  const {auth} = useAuth();
  const navigate =useNavigate()
  const [bookid, setBookid] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [library_number, setLibrary_number] = useState('');
  const [library_numberOptions, setLibrary_numberOptions] = useState('');
   const [book_name, setBook_name] = useState('');
   const [studentid, setStudentid] = useState('')
   const [isbnumber, setIsbnumber] = useState('')
   const [number_of_books,setNumber_of_books]=useState('')
   const [issuedate, setIssuedate] = useState(new Date());
   

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIssuedate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  useEffect(() =>{
    
    const getData = async () =>{
        try{
            const response = await axios.get(baseUrl+'/usersbooks/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true 
            });
            setData(response.data)
            
        }catch(err) {
            console.log(err);
            //navigate('/error');
        }
    }

    getData();

},[auth])
  function getstudent(id){
    setStudentid(id)
    let da=data.filter((item) => {
      // Check if student_info exists and studentid is not null
      if (item.student_info && item.student_info.studentid) {
        return item.student_info.studentid.includes(id);
      }
      return false; // Exclude items without student_info or studentid
    })
    if (da.length>0){
      setFilteredData(da)
    }else{
      setFilteredData([])
    }
    
  }
  //console.log(data)
 
  const getbook = async (id) =>{
    
    setIsbnumber(id);
    try{
        const response = await axios.get(baseUrl+'/book/?isbnumber='+id,{
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'multipart/form-data'
            },
            withCredentials:true
        });
        let data=response.data;
        if (data && data.length > 0) {
            setBookid(data[0].id);
            setBook_name(data[0].book_name);
            setNumber_of_books(data[0].number_of_books);
            setLibrary_numberOptions(Array.from({ length: data[0].number_of_books }, (_, index) => index + 1))
          } else {
            setBookid('');
            setBook_name('');
            setNumber_of_books('');
            setLibrary_numberOptions([])
            console.log("No data")// Handle the case when data is undefined or empty
          }
    }catch(err) {
        console.log(err);
        //navigate('/error');
    }
}
  let handleSubmit = (e )=> {
    e.preventDefault()
    if(bookid==="" || e.target.borrower.value==="" || library_number==="" || issuedate===""){
      alert("There is a problem")
    }else{
      
      axios.post(baseUrl+'/issue/', {
        'book':bookid,
        'borrower':e.target.borrower.value,
        'library_number':library_number,
        'issuedate':issuedate,
        'returndate':"Not yet Returned"
      },
      {
          headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
          }
      }
    )
    .then(res =>{
      alert("Book Issued successfully")
      navigate('/issued') 
    })
    .catch(error => alert(error.response.data))
      }
  }
  return (
    <div className="loginform">
        <h2>Issue a new Book Form</h2>
        <p>Current Date and Time: {issuedate.toLocaleString()}</p>
        <form className='formelement' onSubmit={handleSubmit}>
          <label htmlFor="book">Enter Student ID</label>
          <input 
            className='credentials' 
            type="text"
            id="studentid"
            autoComplete="off" 
            onBlur={(e) => getstudent(e.target.value)}
            required
          />
          <span>
            {studentid!=="" && filteredData.length>0?
            <>
            {filteredData.map((student) => (
              <span key={student.id}>
                <label>
                  {student.first_name} {student.last_name}, Student ID: {student.student_info.studentid}, Email: {student.email}, From {student.student_info.family.grade.grade_name} Grade, {student.student_info.family.family_name} Family, {student.student_info.combination.combination_name} Class
                  <input type="hidden" name="borrower" value={student.id}/>
                </label>
                <label className="invalid">Number of Books you have :{student.borrowings.length}</label>
                {(student.borrowings.filter(
                      (borr) => borr.returndate === "Not yet Returned"
                    ).length)>0?
                    (
                      <span className="invalid">
                        {student.borrowings
                          .filter((borr) => borr.returndate === "Not yet Returned")
                          .map((borr, index) => (
                            <span key={index}>
                              {index + 1}. {borr.book.book_name}, ISB:{borr.book.isbnumber}, library number:{borr.library_number}, No. day(s) pass:{Math.floor((issuedate.getTime() - new Date(borr.issuedate).getTime()) / (1000 * 60 * 60 * 24))}  <br/>
                            </span>
                          ))}
                      </span>
                    ) : (
                      <></>
                    )
                }
                {(student.borrowings.filter(
                      (borr) => borr.returndate === "Not yet Returned"
                    ).length)>1?
                      <span className="invalid">You have <strong>two books</strong>. You are not allowed to borrow another book. </span>:
                      <>
                       {(student.borrowings.filter(
                      (borr) => borr.returndate === "Not yet Returned" && (Math.floor((issuedate.getTime() - new Date(borr.issuedate).getTime()) / (1000 * 60 * 60 * 24)))>28 
                    ).length)>0?
                    <span className="invalid">
                      You have overdue books
                    </span>:
                    <>
                     <label>
                          Enter a Valid ISB Number
                        </label>
                        <input 
                          className='credentials' 
                          type="text"
                          id="book"
                          autoComplete="off" 
                          onBlur={(e) => getbook(e.target.value)}
                          required
                        />
                        {isbnumber==="" || (student.borrowings.filter(
                            (borr) => borr.returndate === isbnumber
                          ).length)>1?
                        <p className="invalid">Enter SSBNumber</p>:
                        <>
                          {library_numberOptions.length>0?
                          <>
                          <span>{book_name}, ISB Nmuber: {isbnumber}, No.Books: {number_of_books}</span>
                          <select value={library_number} onChange={(e) => setLibrary_number(e.target.value)}>
                            {library_numberOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                          </select>
                          </>
                          :
                          <>
                          {book_name===""?
                            <span className="invalid">There is no that book in the database</span>:
                            <span className="invalid">The books in the library have been exhausted; they have all been borrowed.</span> 
                          }
                            
                          </>
                          }
                        </>
                        }
                    </>
                  
                    }
                      </>
                    }
              </span>
            ))}
            </>:<p className="invalid">
              Enter a Valid student ID
            </p>
            }
        </span>
            {(bookid==="" || library_number==="" || issuedate==="")?
            <></>:
            <label htmlFor="loginbutton">
              <button className='submitbuton'>Save</button> 
          </label>
            }
          
          <label htmlFor="create new"> 
            <Link to="/issued" className="forgetpass">Go Back!</Link>
          </label>
    
        </form>
       </div>
  )
}

