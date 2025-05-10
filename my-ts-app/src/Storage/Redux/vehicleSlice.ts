//Belirli bir state parçasını ve bu state'i güncellemek için kullanılan reducer'ları içerir. vehicleSlice, araçlarla ilgili state'i yönetir.
import {createSlice} from "@reduxjs/toolkit";



const initialState={
    vehicles:[],
    
}



export const vehicleSlice=createSlice({
        name:"vehicle",
        initialState:initialState,
        reducers:{
            getVehicles:(state,action)=>{
                state.vehicles=action.payload
            }
        }
    }
)

export const {getVehicles}=vehicleSlice.actions
export const vehicleReducer=vehicleSlice.reducer;