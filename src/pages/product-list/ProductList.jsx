import "./product-list.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delProducts, getProducts } from "../../redux/apiCalls";

export default function UsersList() {
 // const [data, setData] = useState(userRows);
  const dispatch = useDispatch() ;

  const products = useSelector(state => state.product.products) ;

  useEffect(() => {
    const fetchProducts = async () => {
      getProducts(dispatch) ; 
    }
    fetchProducts();
  }, [dispatch])

  const handleDelete = (id) => {
    //setData(data.filter((item) => item.id !== id));
    delProducts(dispatch, id);
  };
  
  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    {
      field: "title",
      headerName: "Title",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.img || "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"} alt="" /> 
            {params.row.title}
          </div>
        );
      },
    },
    { field: "desc", headerName: "Description", width: 200 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
    },
    {
      field: "size",
      headerName: "Size",
      width: 130,
    },
    {
      field: "color",
      headerName: "Color",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/products/" + params.row._id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="usersList">
      <DataGrid
        rows={products}
        getRowId={row => row._id}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}

