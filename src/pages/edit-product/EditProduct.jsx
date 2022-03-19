import { Link, useLocation } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";

import "./edit-product.css";
import Chart from "../../components/chart/Chart";
import { productData } from "../../dummyData";
import { Publish } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { proRequest } from "../../request_methods";
import { useDispatch } from "react-redux";
import { updateProducts } from "../../redux/apiCalls";

export default function EditProduct() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);

  const dispatch = useDispatch()

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [file, setFile] = useState(null);

 // console.log(updatedProduct);

  const handleUpdateProduct = (e) => {
     if(e.target.name === 'categories'){
       let cat = e.target.value.split(',');   
          setUpdatedProduct({
            ...updatedProduct,
            [e.target.name] : cat
          });
          return ;
      }

      setUpdatedProduct({
        ...updatedProduct,
        [e.target.name] : e.target.value
      })
  }

  const updateProduct = (e) => {
    e.preventDefault();
    /** upload image file into firebase */
    // first we need to do renaming the file name with current date prevent to overrite 

    if(!file){
      updateProducts(dispatch, updatedProduct) ;
      return ;
    }

    const fileName = new Date().getTime() + file.name ;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName) ;

    // Upload task docs ... https://firebase.google.com/docs/storage/web/upload-files?authuser=0
    const uploadTask = uploadBytesResumable(storageRef, file);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            }, 
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                const product = {...updatedProduct, img : downloadURL}
                // console.log(product)
                updateProducts(dispatch, product) ;
              }).catch(e => console.log(e));
            }
            );
  }

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await proRequest.get("order/income?pid=" + productId);
        const list = res.data.sort((a,b)=>{
            return a._id - b._id
        })
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/products/create">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Details:</span>
              <span className="productInfoValue">{product.desc}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Color:</span>
              <span className="productInfoValue">{product.color}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Size:</span>
              <span className="productInfoValue">{product.size}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Categories:</span>
              <span className="productInfoValue">{product.categories}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={updateProduct}>
          <div className="productFormLeft">
            <label>Product Name</label>
            <input type="text" name="title" onChange={e => handleUpdateProduct(e)} placeholder={product.title} />
            <label>Product Description</label>
            <input type="text" name="desc" onChange={e => handleUpdateProduct(e)} placeholder={product.desc} />
            <label>Price</label>
            <input type="text" name="price" onChange={e => handleUpdateProduct(e)} placeholder={product.price} />
            <label>Size</label>
            <select name="size" onChange={e => handleUpdateProduct(e)} id="idStock">
              <option value="M">Medium</option>
              <option value="S">Small</option>
              <option value="L">Large</option>
              <option value="XL">Xtra Large</option>
            </select>
             <label>Categories</label>
             <input type="text" name="categories" onChange={e => handleUpdateProduct(e)} placeholder={product.categories.map(cat => cat).join(',')} />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="productUploadImg" />
              <label for="file"> {/** Note : use 'for' to represent other element */}
                <Publish />
              </label>
              <input type="file" id="file" onChange={e => setFile(e.target.files[0])} style={{ display: "none" }} />
            </div>
            <button className="productButton" >Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}