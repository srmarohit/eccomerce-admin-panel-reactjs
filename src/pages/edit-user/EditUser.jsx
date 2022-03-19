import {
    CalendarToday,
    LocationSearching,
    MailOutline,
    PermIdentity,
    PhoneAndroid,
    Publish,
  } from "@material-ui/icons";
  import { Link } from "react-router-dom";
  import { useParams } from "react-router";
  import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
  import app from "../../firebase";
  import "./edit-user.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateUser } from "../../redux/apiCalls";
  
  export default function EditUser() {
    const params = useParams();
    //console.log(params)
    const user = useSelector(state => state.user.users.find(user => user._id === params.id));
    //console.log(user)

    const dispatch = useDispatch()

    const [updatedUser, setUpdatedUser] = useState(user);
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
      setUpdatedUser(prev => ({
        ...prev,
        [e.target.name] : e.target.value
      }));
    }

    const handleUpdateUser = (e) => {
      e.preventDefault();
      //console.log(updatedUser);
        if(!file){
          updateUser(dispatch, updatedUser);
          return ;
        }

        const fileName = new Date().getTime() + file.name ;

        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
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
             ()=>{
               // Upload completed successfully, now we can get the download URL
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                const user = {...updatedUser, img : downloadURL}
                // console.log(product)
                updateUser(dispatch, user) ;
              }).catch(e => console.log(e));
             }
            );
    }

    return (
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit User</h1>
          <Link to="/users/create">
            <button className="userAddButton">Create</button>
          </Link>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img
                src={updatedUser.img ? updatedUser.img : "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                alt=""
                className="userShowImg"
              />
              <div className="userShowTopTitle">
                <span className="userShowUsername">{updatedUser.username}</span>
                <span className="userShowUserTitle">Software Engineer</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Account Details</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">{updatedUser.username}</span>
              </div>
              <div className="userShowInfo">
                <CalendarToday className="userShowIcon" />
                <span className="userShowInfoTitle">10.12.1999</span>
              </div>
              <span className="userShowTitle">Contact Details</span>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">+1 123 456 67</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">{updatedUser.email}</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">New York | USA</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">Edit</span>
            <form className="userUpdateForm" onSubmit={handleUpdateUser}>
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    placeholder={updatedUser.username}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Anna Becker"
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    onChange={handleChange}
                    placeholder={updatedUser.email}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="+1 123 456 67"
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Address</label>
                  <select name="role" onChange={handleChange} required>
                    <option value="emp">Employee</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    className="userUpdateImg"
                    src={updatedUser.img ? updatedUser.img : "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                    alt=""
                  />
                  <label htmlFor="file">{/** htmlFor has value file must be same with id of input element below to work as input file action on label */}
                    <Publish className="userUpdateIcon" />
                  </label>
                  <input type="file" onChange={e => setFile(e.target.files[0])} id="file" style={{ display: "none" }} />{/** our input elm would not be seen anymore . */}
                </div>
                <button className="userUpdateButton">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  