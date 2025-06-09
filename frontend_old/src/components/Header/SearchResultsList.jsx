import './searchResultsList.css'

export default function SearchResultsList({results}) {
  return (
    <div className='results-list'> 
        {results.map((result, id)=>{
          return <div className='search-result' key={id}>{result}</div>
        })}
    </div>
  )
}
