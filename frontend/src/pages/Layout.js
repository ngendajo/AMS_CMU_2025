import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <main>
      <h1>Welcome to AMS</h1>
        <Outlet/>
    </main>
  )
}

export default Layout