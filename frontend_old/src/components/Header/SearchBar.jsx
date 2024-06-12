import React, {useState} from 'react'
import {FaSearch} from "react-icons/fa"
import "./searchBar.css"

export default function SearchBar({setResults}) {
    const [input, setInput] = useState("");
    const fetchDAta = (value) =>{
        let listoflinks=["alumni","staff","events","chats","opportunities","schedule","gallery","profile","helpcenter"];
        let results=listoflinks.filter(link => link.includes(value));
        if(value===""){
          setResults([])
        }else{
          setResults(results)
        }

    }
    const handleChange = (value) =>{
        setInput(value)
        fetchDAta(value)
    }
  return (
    <div className='input-wrapper'>
        <FaSearch id='search-icon'/>
        <input placeholder='search something...' value={input} onChange={(e) =>handleChange(e.target.value)}/>
    </div>
  )
}
