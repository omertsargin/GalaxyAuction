import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { getVehicles } from "../Storage/Redux/vehicleSlice"


const vehicleApi=createApi({
reducerPath:"vehicleApi",
baseQuery:fetchBaseQuery({
    baseUrl:"http://localhost:5224/api/Vehicle/",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
}),
endpoints:(builder)=>({
    getVehicles:builder.query({ //get istegi icin
        query:()=>({
            url:"GetVehicles"
        })
    }),
    getVehicleById:builder.query({ //get istegi icin
        query:(id)=>({
            url:`${id}`
        })
    }),
    addVehicle: builder.mutation({
        query: (vehicleData) => ({
            url: 'AddVehicle',
            method: 'POST',
            body: vehicleData,
        }),
    }),
})
})

export const {useGetVehiclesQuery, useGetVehicleByIdQuery, useAddVehicleMutation} = vehicleApi
export default vehicleApi