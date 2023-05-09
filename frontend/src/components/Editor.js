import { Link } from "react-router-dom"
import Home from "./Home"

const Editor = () => {
  return (
    <div>
        You are on Editor page

        <p><Link to={<Home />}>Home</Link></p>
    </div>
  )
}

export default Editor