import React, { useState } from 'react'
import { useSignInMutation } from '../../Api/accountApi'
import { apiResponse } from '../../interfaces/apiResponse';
import { useDispatch, UseDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import userModel from '../../interfaces/enum/userModel';
import { setLoggedInUser } from '../../Storage/Redux/authenticationSlice';
import { useNavigate } from 'react-router-dom';

function Login() {

    const[userData,setUserDataState]=useState({
        userName:"",
        password:""
    })
    
    const [alertMessage, setAlertMessage] = useState({
      message: "",
      type: "", // success, error, warning
      visible: false
    })
    const navigate=useNavigate();
    const[userSignInMutation]=useSignInMutation();
    const Dispatch=useDispatch();

   const handleLoginSubmit = async () => {
      // Form doğrulama kontrolü
      if (!userData.userName || !userData.password) {
        setAlertMessage({
          message: "Lütfen kullanıcı adı ve şifrenizi giriniz.",
          type: "warning",
          visible: true
        });
        return;
      }
      
      try {
        const response : apiResponse = await userSignInMutation({
          userName: userData.userName,
          password: userData.password
        });
        
        if (response.data?.isSuccess) {
          // Başarılı giriş
          setAlertMessage({
            message: "Giriş başarılı! Anasayfaya yönlendiriliyorsunuz.",
            type: "success",
            visible: true
          });
          
          const token = response.data.result.token;
          localStorage.setItem("token", token);
          const {nameid, email, role, fullName}: userModel = jwtDecode(token);
          
          Dispatch(setLoggedInUser({
            nameid, email, role, fullName
          }));
          
          // Kısa bir süre sonra anasayfaya yönlendir
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          // API'den dönen hata mesajlarını göster
          const errorMessages = response.data?.errorMessages || ["Giriş yapılırken bir hata oluştu."];
          setAlertMessage({
            message: errorMessages.join(" "),
            type: "danger",
            visible: true
          });
        }
      } catch (error) {
        // Beklenmeyen hata durumu
        setAlertMessage({
          message: "Sunucu ile iletişim kurulurken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
          type: "danger",
          visible: true
        });
        console.error("Login error:", error);
      }
    }
  return (
    <section>
    <div className="container">
      
      {alertMessage.visible && (
        <div className={`alert alert-${alertMessage.type} text-center my-4 fade show`} role="alert">
          {alertMessage.message}
          <button type="button" className="btn-close" onClick={() => setAlertMessage({...alertMessage, visible: false})}></button>
        </div>
      )}
      
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-8 col-xl-6">
          <div className="row">
            <div className="col text-center">
              <h1>Login</h1>
              <p className="text-h3">Please login to your account.</p>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col mt-4">
              <input type="text" className="form-control" placeholder="UserName" onChange={(e)=>setUserDataState((prevState)=>{return{...prevState,userName:e.target.value}})}/>
            </div>
          </div> 
          <div className="row align-items-center mt-4">
            <div className="col">
              <input type="password" className="form-control" placeholder="Password" onChange={(e)=>setUserDataState((prevState)=>{return{...prevState,password:e.target.value}})}/>
            </div>
            
          </div>
          <div className="row justify-content-start mt-4">
            <div className="col">
              <div className="form-check">
               
              </div>

              <button onClick={()=>handleLoginSubmit()} className="btn btn-primary mt-4">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  )
}

export default Login