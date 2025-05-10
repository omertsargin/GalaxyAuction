import React, { useEffect } from "react";
import "./Styles/Header.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Storage/store";
import userModel from "../interfaces/enum/userModel";
import { InitialState, setLoggedInUser } from "../Storage/Redux/authenticationSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

function Header() {
  const userStore: userModel = useSelector((state: RootState) => state.authenticationStore);
  const Dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    Dispatch(setLoggedInUser({ ...InitialState }));
    navigate("/");
  };

  // Satıcı rolünü kontrol et
  const isSeller = userStore.role === "Seller";

  return (
    <div className="header-container">
      <nav className="navbar navbar-expand-lg">
        <div className='container'>
          <NavLink className="navbar-brand" to="/">
            <i className="fas fa-car-side me-2"></i> Galaxy Auction
          </NavLink>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  <i className="fas fa-home me-1"></i> Home
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink className="nav-link" to="/auctions">
                  <i className="fas fa-gavel me-1"></i> Auctions
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink className="nav-link" to="/mybids">
                  <i className="fas fa-hand-paper me-1"></i> My Bids
                </NavLink>
              </li>

              {/* Satıcı rolü için Araç Ekle menüsü */}
              {isSeller && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/addvehicle">
                    <i className="fas fa-car-alt me-1"></i> Araç Ekle
                  </NavLink>
                </li>
              )}
            </ul>
            
            <div className="d-flex align-items-center">
              {userStore.nameid !== "" ? (
                <div className="d-flex">
                  <NavLink to="/profile" className="me-3">
                    <button className="btn btn-galaxy-outline">
                      <i className="fas fa-user me-1"></i> Profile
                    </button>
                  </NavLink>
                  
                  <button onClick={handleLogout} className="btn btn-galaxy">
                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                  </button>
                </div>
              ) : (
                <>
                  <NavLink to={"/register"} className="me-2">
                    <button className="btn btn-galaxy-outline">
                      <i className="fas fa-user-plus me-1"></i> Register
                    </button>
                  </NavLink>
                  
                  <NavLink to={"/login"}>
                    <button className="btn btn-galaxy">
                      <i className="fas fa-sign-in-alt me-1"></i> Login
                    </button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
