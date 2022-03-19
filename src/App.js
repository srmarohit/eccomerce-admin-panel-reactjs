import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/home/Home";
// import ProductList from "./pages/product-list/ProductList";
// import UsersList from "./pages/users-list/UsersList";

// import EditUser from "./pages/edit-user/EditUser";
// import Messanger from "./pages/messanger/Messanger";
// import Login from "./pages/auth/Auth";
// import EditProduct from "./pages/edit-product/EditProduct";
// import NewProduct from "./pages/new-product/NewProduct";
// import NewUser from "./pages/new-user/newUser";
import { useSelector } from "react-redux";


import loadable from '@loadable/component'

const Home = loadable(() => import('./pages/home/Home') ) ;
const ProductList = loadable(() => import('./pages/product-list/ProductList') ) ;
const UsersList = loadable(() => import('./pages/users-list/UsersList') ) ;
const EditUser = loadable(() => import('./pages/edit-user/EditUser') ) ;
const Messanger = loadable(() => import('./pages/messanger/Messanger') ) ;
const EditProduct = loadable(() => import('./pages/edit-product/EditProduct') ) ;
const Login = loadable(() => import('./pages/auth/Auth') ) ;

const NewProduct = loadable(() => import('./pages/new-product/NewProduct') ) ;

const NewUser = loadable(() => import('./pages/new-user/newUser') ) ;



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
               <Topbar user={user}/>
               <div className="container">
               <Sidebar/>
               <Routes>
               <Route exact path="/" element={<Home user={user} />} />
               <Route path="/users" element={<UsersList user={user} />} />
               <Route path="/users/create" element={<NewUser />} />
               <Route path="/products" element={<ProductList user={user} />} />
               <Route path="/products/create" element={<NewProduct user={user} />} />
               <Route path="/products/:pid" element={<EditProduct user={user} />} />
               <Route path="/user/:id" element={<EditUser user={user} />} />
               <Route path="/messanger" element={<Messanger user={user} />} />
               </Routes>
              </div>
              </>
           }
        </Router>
        )
}