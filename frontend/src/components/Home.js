import { Link } from "react-router-dom";
import Editor from './Editor';
import Admin from './Admin';
import Lounge from './Lounge';
import LinkPage from './LinkPage';

const Home = () => {
  return (
    <div>
        <h1>Home</h1>
        <p>You are loged in</p>
        <p><Link to={<Editor />}>Go to Editor page</Link></p>
        <p><Link to={<Admin />}>Go to Admin page</Link></p>
        <p><Link to={<Lounge />}>Go to Lounge page</Link></p>
        <p><Link to={<LinkPage />}>Go to LinkPage page</Link></p>
    </div>
  )
}

export default Home