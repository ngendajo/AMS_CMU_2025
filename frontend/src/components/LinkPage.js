import { Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

const LinkPage = () => {
  return (
    <div>
        You are on LinkPage
        <p><Link to={<Login />}>Login</Link></p>
        <p><Link to={<Register />}>Register</Link></p>
        <p><Link to={<Home />}>Home</Link></p>
    </div>
  )
}

export default LinkPage