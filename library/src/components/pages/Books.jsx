import React, {useState, useEffect} from 'react'
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Link } from 'react-router-dom';
import { BiEditAlt } from "react-icons/bi";
import baseUrl from "../../api/baseUrl";
import DynamicTable from "./dinamicTable/DynamicTable";

export default function Books() {
  const [data, setData] = useState([]);
    let {auth} = useAuth();

    useEffect(() =>{
    
        const getData = async () =>{
            try{
                const response = await axios.get(baseUrl+'/books/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true 
                });
                var booklist=[]
                var i=1
                response.data.forEach(e=>{
                    booklist.push({
                    No:i,
                    book_name:e.book_name,
                    ISBN_NUMBER:e.isbnumber,
                    Category:e.category_name,
                    Author:e.author_name,
                    Number_of_books:e.number_of_books,
                    Edit:<span>
                        <Link to={`/book/${e.id}`}><BiEditAlt className='icon'/></Link>
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
    
    },[auth])
  return (
    <div>
      <center><h2 >Averable Books <button className="prenext">Generate PDF</button></h2></center>
      <DynamicTable mockdata={data} />
    </div>
  )
}
