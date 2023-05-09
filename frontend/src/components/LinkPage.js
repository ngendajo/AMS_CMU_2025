import { Link } from "react-router-dom";

const LinkPage = () => {
  return (
    <div>
        You are on LinkPage
        <p><Link to='/login'>Login</Link></p>
        <p><Link to='/register'>Register</Link></p>
        <p><Link to='/'>Home</Link></p>
    </div>
  )
}

export default LinkPage