import Layout from './components/Layout';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Missing from './components/Missing';
import MainDashboard from './components/MainDashboard';
import RequireAuth from './components/RequireAuth';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard';
import useRefreshToken from './hooks/useRefreshToken';
import { useEffect } from 'react';
import useAuth from './hooks/useAuth';
import AuthCheck from './context/AuthCheck';
import Unauthorized from './components/Unauthorized';
import SignUp from './components/signup/SignUp';
import Password from './components/pages/Password';
import Authors from './components/pages/Authors';
import Category from './components/pages/Category';
import Categories from './components/pages/Categories';
import Author from './components/pages/Author';
import Book from './components/pages/Book';
import Books from './components/pages/Books';
import Issue from './components/pages/Issue';
import IssuedBooks from './components/pages/IssuedBooks';
import NewGrade from './components/pages/NewGrade';
import Grades from './components/pages/Grades';
import Comb from './components/pages/Comb';
import Combs from './components/pages/Combs';
import Student from './components/pages/Student';
import Students from './components/pages/Students';
import Staffs from './components/pages/Staffs';
import Staff from './components/pages/Staff';
import Grstatistics from './components/pages/Grstatistics';
import Fastatistics from './components/pages/Fastatistics';
import Costatistics from './components/pages/Costatistics';
import Borrowed from './components/pages/Borrowed';
import Boverdue from './components/pages/Boverdue';
import Editcombination from './components/pages/Editcombination';
import Error from './components/pages/Error';
import Editcategory from './components/pages/Editcategory';
import Editauthor from './components/pages/Editauthor';
import EditBook from './components/pages/EditBook';
import EditStaff from './components/pages/EditStaff';
import EditGrade from './components/pages/EditGrade';
import EditStudent from './components/pages/EditStudent';
import ReturnBook from './components/pages/ReturnBook';
import UploadBooks from './components/pages/UploadBooks';
import UpStudents from './components/pages/UpStudents';
import UpIssue from './components/pages/UpIssue';
import OverdueBooks from './components/pages/OverdueBooks';



function App() {
  const refresh = useRefreshToken();
  const {auth} = useAuth();

  useEffect(()=> {
    let fourMinutes = 1000 * 60 * 4

    let interval =  setInterval(()=> {
        
            if(auth?.accessToken){
              refresh()
            }
    }, fourMinutes)
    return ()=> clearInterval(interval)
//
}, [refresh,auth])
  return (
          <Routes>
            <Route path='/' element={<Layout />}>
              {/* public routes*/}
                <Route path='home' element={<Home />}/>
                <Route path='signup' element={<SignUp/>}/>
                <Route path='error' element={<Error />}/>
                <Route path='unauthorized' element={<Unauthorized />}/>

                {/* we want to protect these routes*/}
                <Route element={<RequireAuth />}>
                  <Route path='/' element={<MainDashboard />}>
                    <Route path='/' element={<Dashboard />}/>
                    <Route element={<AuthCheck allowedRoles={["superuser","librarian","crc"]} />}>
                      <Route path='author' element={<Author />}/>
                      <Route path='authors' element={<Authors />}/>
                      <Route path='author/:id' element={<Editauthor/>}/>
                      <Route path='category' element={<Category />}/>
                      <Route path='categories' element={<Categories />}/>
                      <Route path='category/:id' element={<Editcategory/>}/>
                      <Route path='book' element={<Book />}/>
                      <Route path='books' element={<Books />}/>
                      <Route path='book/:id' element={<EditBook/>}/>
                      <Route path='issue' element={<Issue />}/>
                      <Route path='issued' element={<IssuedBooks />}/>
                      <Route path='overdue' element={<OverdueBooks />}/>
                      <Route path='issue/:id' element={<ReturnBook/>}/>
                      <Route path='grade' element={<NewGrade />}/>
                      <Route path='grades' element={<Grades />}/>
                      <Route path='grade/:id' element={<EditGrade/>}/>
                      <Route path='comb' element={<Comb />}/>
                      <Route path='combs' element={<Combs />}/>
                      <Route path='add-comb/:id' element={<Editcombination/>}/>
                      <Route path='student' element={<Student />}/>
                      <Route path='students' element={<Students />}/>
                      <Route path='student/:id' element={<EditStudent/>}/>
                      <Route path='staff' element={<Staff />}/>
                      <Route path='staffs' element={<Staffs />}/>
                      <Route path='staff/:id' element={<EditStaff/>}/>
                      <Route path='grstatistics' element={<Grstatistics/>}/>
                      <Route path='fastatistics' element={<Fastatistics/>}/>
                      <Route path='costatistics' element={<Costatistics/>}/>
                    </Route>
                    <Route element={<AuthCheck allowedRoles={["superuser"]} />}>
                      <Route path='upbook' element={<UploadBooks/>}/>
                      <Route path='upstudent' element={<UpStudents/>}/>
                      <Route path='upissue' element={<UpIssue/>}/>
                    </Route>
                    <Route element={<AuthCheck allowedRoles={["teacher","student"]} />}>
                      <Route path='borrowed' element={<Borrowed />}/>
                      <Route path='boverdue' element={<Boverdue />}/>
                    </Route>
                    <Route path='pass' element={<Password/>}/>
                  </Route>
                </Route>
                {/* catch all */}
                <Route path='*' element={<Missing />} />
            </Route>
          </Routes>
  );
}

export default App;
