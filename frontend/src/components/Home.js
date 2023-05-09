import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
        <h1>Home</h1>
        <p>You are loged in</p>
        <p><Link to='editor'>Go to Editor page</Link></p>
        <p><Link to='admin'>Go to Admin page</Link></p>
        <p><Link to='lounge'>Go to Lounge page</Link></p>
        <p><Link to='linkpage'>Go to LinkPage page</Link></p>
    </div>
  )
}

export default Home