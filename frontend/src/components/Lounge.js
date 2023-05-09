import { Link } from "react-router-dom"
import Home from "./Home"

const Lounge = () => {
  return (
    <div>
        <p>You are on Lounge</p>
        <p><Link to={<Home />}>Home</Link></p>
    </div>
  )
}

export default Lounge