import React, { useState } from "react";
import "./new-product.css"

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { useNavigate } from "react-router";
import Compress from "react-image-file-resizer";
import { createProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
 

function NewProduct() {
    const [inputs, setInputs] = useState({});
    const [file, setFile] = useState(null);
    const [cat, setCat] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
      };

    const handleCat = (e) => {
        setCat(e.target.value.split(","));
      };

    
    const handleCreate = (e) => {
        e.preventDefault();
        //console.log(file);

        // first we need to do renaming the file name with current date prevent to overrite 
        const fileName = new Date().getTime() + file.name ;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName) ;

        // Upload task ... https://firebase.google.com/docs/storage/web/upload-files?authuser=0
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
                    const product = {...inputs, categories : cat, img : downloadURL}
                    // console.log(product)
                     createProduct(dispatch, product);
                    }).catch(e => console.log(e));
                }
                );

                navigate('/products', {replace : true})

     }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm" onSubmit={handleCreate}>
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => {
                // Compress.imageFileResizer(
                //     e.target.files[0], // the file from input
                //     480, // width
                //     480, // height
                //     "JPEG", // compress format WEBP, JPEG, PNG
                //     70, // quality
                //     0, // rotation
                //     (uri) => {
                //       console.log(uri);
                //       // You upload logic goes here
                //       console.log(e.target.files[0]);
                //       setFile({...uri, name : e.target.files[0].name})
                //     },
                //     "blob" // blob or base64 default base64
                // );
                setFile(e.target.files[0])
            }}
            required
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Apple Airpods"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            name="desc"
            type="text"
            placeholder="description..."
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input
            name="price"
            type="number"
            placeholder="100"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Categories</label>
          <input type="text" placeholder="jeans,skirts" onChange={handleCat} />
        </div>
        <div className="addProductItem">
          <label>Size</label>
          <select name="size" onChange={handleChange}>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">Xtra Large</option>
            <option value="S">Small</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Color</label>
          <input
            name="color"
            type="text"
            placeholder="enter Color..."
            onChange={handleChange}
          />
        </div>
        <button  className="addProductButton">
          Create
        </button>
      </form>
    </div>
  );
}

export default NewProduct;
