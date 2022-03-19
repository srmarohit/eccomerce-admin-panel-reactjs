import React, { useState } from "react";
import "./new-user.css" ;


import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { useNavigate } from "react-router";
import { createUser } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";


function NewUser() {

  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState();

  const dispatch = useDispatch();

  const handleChange = (e) => {
      setInputs(prev => ({
          ...prev,
          [e.target.name] : e.target.value
      }))
  }

  const handleCreate = (e) => {
    e.preventDefault();

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
        const user = {...inputs, img : downloadURL}
        // console.log(product)
         createUser(dispatch, user);
        }).catch(e => console.log(e));
      }
    );


  }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New User</h1>
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
              setFile(e.target.files[0]);
            }}
            required
          />
        </div>
        <div className="addProductItem">
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Apple Airpods"
            onChange={handleChange}
            required
          />
        </div>
        <div className="addProductItem">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="description..."
            onChange={handleChange}
            required
          />
        </div>
        <div className="addProductItem">
          <label>Password : </label>
          <input
            name="password"
            type="text"
            placeholder="Enter Password"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Phone : </label>
          <input
            name="phone"
            type="number"
            placeholder="8103801661"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Role</label>
          <select name="role" onChange={handleChange} required>
            <option value="emp">Employee</option>
            <option value="user">User</option>
          </select>
        </div>
        <button className="addProductButton">Create</button>
      </form>
    </div>
  );
}

export default NewUser;
