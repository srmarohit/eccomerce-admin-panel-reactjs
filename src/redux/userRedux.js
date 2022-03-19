 
 import { createSlice } from "@reduxjs/toolkit" ;

 const userSlice = createSlice({
     name : "user",
     initialState : {
         users : [],
         currentUser : null,
         isFetching : false,
         error : false
     },

     reducers : {
         // AUTH USERS || LOGIN
         loginStart : (state) => {
             state.isFetching = true ;
             state.error = false ;
         },

         loginSuccess : (state, action) => {
             state.currentUser = action.payload ;
             state.isFetching = false ;
             state.error = false ;
         },

         loginFailure : (state) => {
             state.currentUser = null ;
             state.isFetching = false ;
             state.error = true ;
         },

         // LOGOUT USERS

         logout : (state) => {
             state.users = [] ;
             state.currentUser = null ;
             state.isFetching = false ;
             state.error = false ;
         },

         // GET ALL USERS

         getUsersStart : (state) => {
             state.isFetching = true ;
             state.error = false ;
         },

         getUsersSuccess : (state, action) => {
             state.isFetching = false ;
             state.error = false ;
             state.users = action.payload ;
         },

         getUsersFailure : (state, action) => {
             state.isFetching = false ;
             state.error = true ;
         },

         // GET ALL USERS

        createUsersStart : (state) => {
            state.isFetching = true ;
            state.error = false ;
        },

        createUsersSuccess : (state, action) => {
            state.isFetching = false ;
            state.error = false ;
            state.users = action.payload ;
        },

        createUsersFailure : (state) => {
            state.isFetching = false ;
            state.error = true ;
        },


         
         // UPDATE ALL USERS

        updateUsersStart : (state) => {
            state.isFetching = true ;
            state.error = false ;
        },

        updateUsersSuccess : (state, action) => {
            state.isFetching = false ;
            state.error = false ;
            state.users[state.users.findIndex(item => item._id === action.payload._id)] = action.payload;
        },

        updateUsersFailure : (state) => {
            state.isFetching = false ;
            state.error = true ;
        },

         // DELETE USERS
        delUsersStart : (state) => {
            state.isFetching = true ;
            state.error = false ;
        },

        delUsersSuccess : (state, action) => {
            state.isFetching = false ;
            state.error = false ;
            state.users = state.users.splice(state.users.findIndex(user => user._id === action.payload), 1) ;
        },

        delUsersFailure : (state) => {
            state.isFetching = false ;
            state.error = true ;
        }
         
     }
 });

 export const {loginStart , loginSuccess, loginFailure, logout, getUsersStart, getUsersSuccess, getUsersFailure, createUsersStart, createUsersSuccess, createUsersFailure, updateUsersStart, updateUsersSuccess, updateUsersFailure, delUsersStart, delUsersSuccess, delUsersFailure} = userSlice.actions ;
 export default userSlice.reducer ;  /// suspect on reducer or reducers

