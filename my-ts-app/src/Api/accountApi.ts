import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountApi = createApi({
    reducerPath:"accountApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:5224/api/User/",
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints:(builder) => ({
        signUp:builder.mutation({
            query:(userData) => ({
                url:"Register",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:userData
            })
        }),
        signIn:builder.mutation({
            query:(userData) => ({
                url:"Login",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:userData
            })
        }),
        updateProfile:builder.mutation({
            query:(profileData) => ({
                url:"UpdateProfile",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:profileData
            })
        })
    })

})


export const {useSignUpMutation, useSignInMutation, useUpdateProfileMutation} = accountApi //for writing operations like put,delete,post