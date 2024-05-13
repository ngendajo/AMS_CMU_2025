import React, {useState, useEffect} from 'react'
import moment from 'moment';
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Link } from 'react-router-dom';
import { BiEditAlt } from "react-icons/bi";
import baseUrl from "../../api/baseUrl";
import DynamicTable from "./dinamicTable/DynamicTable";

export default function IssuedBooks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState("");
  const [previous, setPrevious] = useState("");
  const [url, setUrl] = useState(baseUrl+'/issue/?page=1');
  
  let {auth} = useAuth();
  

  useEffect(() =>{
      const getData = async () =>{
          try{
              const response = await axios.get(url,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true 
              });
              console.log(response.data)
              setLoading(false);
              setCount(response.data.count)
              setNext(response.data.next)
              setPrevious(response.data.previous)
              var booklist=[]
              var i=1
              response.data.results.forEach(e=>{
                  booklist.push({
                  No:i,
                  Student_ID:e.student_info.studentid,
                  Name:e.borrower.first_name+' '+e.borrower.last_name,
                  Email:e.borrower.email,
                  From:e.student_info? e.student_info.family.grade.grade_name+" Grade "+e.student_info.family.family_name+" Family "+e.student_info.combination.combination_name+" Class":"",
                  Book_name:e.book.book_name,
                  ISBNumber:e.book.isbnumber,
                  Category:e.book.category.category_name,
                  Author:e.book.author.author_name,
                  Library_number:e.library_number,
                  Issuedate:moment(e.issuedate).format("Do MMMM YYYY, h:mm:ss a"),
                  Returndate:e.returndate==="Not yet Returned"?<p className='invalid'>Not yet Returned</p>:moment(e.returndate).format("Do MMMM YYYY, h:mm:ss a"),
                  Edit:<span>
                      <Link to={`/issue/${e.id}`}><BiEditAlt className='icon'/></Link>
                  </span>
              })
              i=i+1
              })
              setData(booklist);
          }catch(err) {
              console.log(err);
              //navigate('/error');
          }
      }
  
      getData();
  
  },[auth,url])
return (
  <div>
    <h2 >Issue Books</h2>
    {loading ? (
        <p>Loading...</p>
      ) : (
        <>
            <DynamicTable mockdata={data} />
            <h1 onClick={() => setUrl(previous)}>Previous</h1>
            <h1 onClick={() => setUrl(next)}>Next</h1>
            <h1>{count}</h1>
        </>
    
    
      )
    }
  </div>
)
}

