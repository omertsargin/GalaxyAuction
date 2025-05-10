import React, { useEffect } from 'react';

import './App.css';
import { VehicleList } from '../Pages/Vehicle';

import Header from '../Layout/Header';
import { Route, Routes } from 'react-router-dom';
import VehicleDetail from '../Pages/Vehicle/VehicleDetail';
import Register from '../Pages/Account/Register';
import Login from '../Pages/Account/Login';
import AuctionList from '../Pages/Auction/AuctionList';
import { useDispatch, UseDispatch } from 'react-redux';
import { setLoggedInUser } from '../Storage/Redux/authenticationSlice';
import userModel from '../interfaces/enum/userModel';
import { jwtDecode } from 'jwt-decode';
import MyBids from '../Pages/Bid/MyBids';
import Profile from '../Pages/Account/Profile';
import AddVehicle from '../Pages/Vehicle/AddVehicle';

function App() {


const Dispatch=useDispatch();
useEffect(()=>{
  const token=localStorage.getItem("token");
  if(token){
     const {nameid,email,role,fullName}: userModel =jwtDecode(token);
                Dispatch(setLoggedInUser({
                  nameid,email,role,fullName
                }))
  }
})




  return (
    <div className="App">
      <Header></Header>
   
    <div className='pb-5'>
      <Routes>
        <Route path='/' element={<VehicleList></VehicleList>}></Route>
        <Route path='Vehicle/VehicleId/:vehicleId' element={<VehicleDetail></VehicleDetail>}></Route> //Link ile tıklanarak gidilen sayfanın hangi bileşenin gösterileceğini belirler.
        <Route path='Register' element={<Register></Register>}></Route>
        <Route path='Login' element={<Login></Login>}></Route>
        <Route path='auctions' element={<AuctionList></AuctionList>}></Route>
        <Route path='mybids' element={<MyBids></MyBids>}></Route>
        <Route path='profile' element={<Profile></Profile>}></Route>
        <Route path='addvehicle' element={<AddVehicle></AddVehicle>}></Route>
      </Routes>
    </div>
    </div>
  );
}

export default App;
