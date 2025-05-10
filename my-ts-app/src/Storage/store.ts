import {configureStore} from "@reduxjs/toolkit";
import { vehicleReducer } from "./Redux/vehicleSlice";
import vehicleApi from "../Api/vehicleApi";
import { accountApi } from "../Api/accountApi";
import { authenticationReducer } from "./Redux/authenticationSlice";
import bidApi from "../Api/bidApi";
import PaymentHistoryApi from "../Api/paymentHistoryApi";

const store=configureStore({
reducer:{
    vehicleStore:vehicleReducer,  // `vehicleSlice`'den gelen state
    authenticationStore:authenticationReducer,
    [vehicleApi.reducerPath]:vehicleApi.reducer,  // `vehicleApi`'yi store'a ekliyoruz
    [accountApi.reducerPath]:accountApi.reducer, // `accountApi`'yi store'a ekliyoruz
    [bidApi.reducerPath]:bidApi.reducer,
    [PaymentHistoryApi.reducerPath]:PaymentHistoryApi.reducer

},middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(vehicleApi.middleware,accountApi.middleware,bidApi.middleware,PaymentHistoryApi.middleware)
})

export type RootState=ReturnType<typeof store.getState>;
export default store