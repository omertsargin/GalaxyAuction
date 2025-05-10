import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type TagTypes = 'Bids';

 const bidApi=createApi({
    reducerPath:"bidApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:5224/api/Bid/",
        prepareHeaders: (headers) => {
            // Add any required headers here
            headers.set('Content-Type', 'application/json');
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Bids'] as TagTypes[],
    endpoints:(builder)=>({
        getAllBids:builder.query({
            query:()=>({
                method:"GET",
                url:`GetAll`
            }),
            providesTags: () => [{ type: 'Bids' as const }]
        }),
        getBidByVehicleId:builder.query({
            query:(vehicleId)=>({
                method:"GET",
                url:`GetBidsByVehicle/${vehicleId}`
            }),
            providesTags: () => [{ type: 'Bids' as const }]
        }),
        getUserBids:builder.query({
            query:(userId)=>({
                method:"GET",
                url:`GetAll`
            }),
            transformResponse: (response: any, meta, arg) => {
                // Tüm teklifleri alıp kullanıcıya ait olanları filtreliyoruz
                if (response && response.result && Array.isArray(response.result)) {
                    return {
                        ...response,
                        result: response.result.filter((bid: any) => bid.userId === arg)
                    };
                }
                return response;
            },
            providesTags: () => [{ type: 'Bids' as const }]
        }),
        createBid:builder.mutation({
            query:(bidData)=>({
                url:"Create",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:bidData
            }),
            invalidatesTags: () => [{ type: 'Bids' as const }]
        })
    })
})
export const {useGetAllBidsQuery, useGetBidByVehicleIdQuery, useCreateBidMutation, useGetUserBidsQuery}=bidApi
export default bidApi