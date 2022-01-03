import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import UsersList from "./pages/users-list/UsersList";
import EditUser from "./pages/edit-user/EditUser";
import Messanger from "./pages/messanger/Messanger";
import Login from "./pages/auth/Auth";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

export default function App(){
     const {user} = useContext(AuthContext);
    return (
        <Router>
           {
               !user 
                ?
              <Login />
               :
               <>
               <Topbar/>
               <div className="container">
               <Sidebar/>
               <Routes>
               <Route exact path="/" element={<Home />} />
               <Route path="/users" element={<UsersList />} />
               <Route path="/user/:id" element={<EditUser />} />
               <Route path="/messanger" element={<Messanger />} />
               </Routes>
              </div>
              </>
           }
        </Router>
        )
}