import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import ProductList from "./pages/product-list/ProductList";
import UsersList from "./pages/users-list/UsersList";

import EditUser from "./pages/edit-user/EditUser";
import Messanger from "./pages/messanger/Messanger";
import Login from "./pages/auth/Auth";
import { useSelector } from "react-redux";

export default function App(){
   const user = useSelector((state) => state.user.currentUser);  
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
               <Route exact path="/" element={<Home user={user} />} />
               <Route path="/users" element={<UsersList user={user} />} />
               <Route path="/products" element={<ProductList user={user} />} />
               <Route path="/user/:id" element={<EditUser user={user} />} />
               <Route path="/messanger" element={<Messanger user={user} />} />
               </Routes>
              </div>
              </>
           }
        </Router>
        )
}