import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//https://localhost:7273/api/PaymentHistory/CheckStatus

const PaymentHistoryApi= createApi({
    reducerPath:"paymentHistoryApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:5224/api/PaymentHistory/",
    }),
    endpoints:(builder)=>({
        checkStatusAuctionPrice:builder.mutation({//api veri işlemi 
            query:(statusDetail=>({
                url:"CheckStatus",
                method:"POST",
                body:statusDetail
            }))
        })
    })
})
export const {useCheckStatusAuctionPriceMutation}=PaymentHistoryApi;
export default PaymentHistoryApi;