import React, { useState, useEffect } from 'react'
import { useSignUpMutation } from '../../Api/accountApi'
import { apiResponse } from '../../interfaces/apiResponse';
import { useNavigate } from 'react-router-dom';
import './Styles/Register.css';

export enum SD_ROLES{ //importta hata aldıgımız icin böyle yaptık

  NormalUser="NormalUser",
  Seller="Seller",
  Adminastrator="Adminastrator"
}



function Register() {
  
const [userData,setUserDataState]=useState({
  username:"",
  fullname:"",
  password:"",
  dateOfBirth: "",
  usertype: SD_ROLES.NormalUser // Default to NormalUser
});

const [alertMessage, setAlertMessage] = useState({
  message: "",
  type: "", // success, error, warning
  visible: false
});

const [passwordVisible, setPasswordVisible] = useState(false);
const [isAgeValid, setIsAgeValid] = useState(true);

// Age validation
const validateAge = (birthDateStr: string): boolean => {
  if (!birthDateStr) return true; // Empty is valid (will be caught by required field validation)
  
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  
  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birth month & day hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

// Handle date change
const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const birthDate = e.target.value;
  setUserDataState(prevState => ({ ...prevState, dateOfBirth: birthDate }));
  setIsAgeValid(validateAge(birthDate));
};

// Tooltip için CSS ekleme
useEffect(() => {
  // Özel tooltip stili için CSS ekle
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .password-info-icon {
      cursor: pointer;
      color: #6c757d;
      transition: color 0.2s;
    }
    .password-info-icon:hover {
      color: #495057;
    }
    
    /* Tooltip container */
    .custom-tooltip {
      position: relative;
      display: inline-block;
    }
    
    /* Tooltip text */
    .custom-tooltip .tooltip-text {
      visibility: hidden;
      width: 250px;
      background-color: #333;
      color: #fff;
      text-align: left;
      padding: 10px;
      border-radius: 6px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      margin-left: -125px;
      opacity: 0;
      transition: opacity 0.3s;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      font-size: 0.85rem;
    }
    
    /* Tooltip arrow */
    .custom-tooltip .tooltip-text::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
    
    /* Show tooltip on hover */
    .custom-tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Component unmount olduğunda CSS'i temizle
  return () => {
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  };
}, []);

  const [userRegisterMutation]=useSignUpMutation();
  const navigate = useNavigate();
  
  const handleRegistrationSubmit= async ()=>{
    // Form validation
    if (!userData.username || !userData.fullname || !userData.password) {
      setAlertMessage({
        message: "Lütfen tüm zorunlu alanları doldurunuz.",
        type: "warning",
        visible: true
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.username)) {
      setAlertMessage({
        message: "Lütfen geçerli bir e-posta adresi giriniz.",
        type: "warning",
        visible: true
      });
      return;
    }
    
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
    if (!passwordRegex.test(userData.password)) {
      setAlertMessage({
        message: "Şifreniz gereksinimleri karşılamıyor. Şifreniz en az 6 karakter uzunluğunda olmalı ve en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir.",
        type: "warning",
        visible: true
      });
      return;
    }
    
    // Age validation
    if (userData.dateOfBirth && !isAgeValid) {
      setAlertMessage({
        message: "Kayıt olabilmek için 18 yaşından büyük olmalısınız.",
        type: "warning",
        visible: true
      });
      return;
    }

    try {
      // ISO string formatında doğum tarihi gönder
      const dateOfBirth = userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString() : null;
      
      const response:apiResponse = await userRegisterMutation({
        username: userData.username,
        fullname: userData.fullname,
        password: userData.password,
        userType: userData.usertype,
        dateOfBirth: dateOfBirth
      });
      
      if (response.data?.isSuccess) {
        // Başarılı kayıt
        setAlertMessage({
          message: "Kayıt işlemi başarıyla tamamlandı! Giriş sayfasına yönlendiriliyorsunuz.",
          type: "success",
          visible: true
        });
        
        // 2 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // API'den dönen hata mesajlarını göster
        const errorMessages = response.data?.errorMessages || ["Kayıt işlemi sırasında bir hata oluştu."];
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
      console.error("Registration error:", error);
    }
  }

    return (
        <div className="register-container">
       <div className="container">
         
         {alertMessage.visible && (
           <div className={`alert alert-${alertMessage.type} alert-dismissible fade show`} role="alert">
             {alertMessage.message}
             <button 
               type="button" 
               className="btn-close" 
               onClick={() => setAlertMessage({...alertMessage, visible: false})}
               aria-label="Close"
             ></button>
           </div>
         )}
         
      
         <div className="register-card">
           <div className="register-header">
             <div className="register-icon">
               <i className="fas fa-user-plus"></i>
             </div>
             <h2>Üye Ol</h2>
             <p>Galaxy Auction'a hoş geldiniz!</p>
           </div>
           
           <div className="register-form">
             <div className="form-group">
               <label htmlFor="fullname"><i className="fas fa-user"></i> Ad Soyad</label>
               <input 
                 type="text" 
                 className="form-control" 
                 id="fullname"
                 placeholder="Adınız ve soyadınız" 
                 value={userData.fullname}
                 onChange={(e) => setUserDataState((prevState) => ({...prevState, fullname: e.target.value}))}
                 required
               />
             </div>
             
             <div className="form-group">
               <label htmlFor="email"><i className="fas fa-envelope"></i> E-posta</label>
               <input 
                 type="email" 
                 className="form-control" 
                 id="email"
                 placeholder="ornek@email.com" 
                 value={userData.username}
                 onChange={(e) => setUserDataState((prevState) => ({...prevState, username: e.target.value}))}
                 required
               />
             </div>
             
             <div className="form-group">
               <label htmlFor="dateOfBirth"><i className="fas fa-calendar-alt"></i> Doğum Tarihi</label>
               <input 
                 type="date" 
                 className={`form-control ${userData.dateOfBirth && !isAgeValid ? 'is-invalid' : ''}`}
                 id="dateOfBirth"
                 max={new Date().toISOString().split('T')[0]}
                 value={userData.dateOfBirth}
                 onChange={handleDateChange}
               />
               {userData.dateOfBirth && !isAgeValid && (
                 <div className="invalid-feedback">
                   Kayıt olmak için 18 yaşından büyük olmalısınız.
                 </div>
               )}
             </div>
             
             <div className="form-group">
               <label htmlFor="password">
                 <i className="fas fa-lock"></i> Şifre 
                 <span className="info-tooltip" data-bs-toggle="tooltip" data-bs-placement="right" title="En az 6 karakter, 1 büyük harf, 1 küçük harf, 1 sayı ve 1 özel karakter içermelidir.">
                   <i className="fas fa-info-circle ms-2"></i>
                 </span>
               </label>
               <div className="input-group">
                 <input 
                   type={passwordVisible ? "text" : "password"} 
                   className="form-control" 
                   id="password"
                   placeholder="••••••••" 
                   value={userData.password}
                   onChange={(e) => setUserDataState((prevState) => ({...prevState, password: e.target.value}))}
                   required
                 />
                 <span 
                   className="input-group-text password-toggle" 
                   onClick={() => setPasswordVisible(!passwordVisible)}
                 >
                   <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                 </span>
               </div>
               <small className="form-text text-muted">
                 Şifreniz en az 6 karakter uzunluğunda olmalıdır.
               </small>
             </div>
             
             <div className="form-group">
               <label htmlFor="userRole"><i className="fas fa-user-tag"></i> Kullanıcı Rolü</label>
               <select 
                 id="userRole"
                 className="form-select" 
                 value={userData.usertype}
                 onChange={(e) => setUserDataState((prevState) => ({...prevState, usertype: e.target.value as SD_ROLES}))}
               >
                 <option value={SD_ROLES.Seller}>Satıcı</option>
                 <option value={SD_ROLES.NormalUser}>Normal Kullanıcı</option>
               </select>
               <small className="form-text text-muted">
                 Satıcı: Araç ilanı oluşturabilir. Normal Kullanıcı: Sadece açık artırmalara katılabilir.
               </small>
             </div>
             
             <div className="form-check mb-3">
               <input className="form-check-input" type="checkbox" id="termsCheck" required />
               <label className="form-check-label" htmlFor="termsCheck">
                 <small>
                   <a href="#" className="terms-link">Kullanım şartlarını</a> ve <a href="#" className="terms-link">gizlilik politikasını</a> kabul ediyorum
                 </small>
               </label>
             </div>
             
             <button 
               className="btn btn-register w-100" 
               onClick={handleRegistrationSubmit}
             >
               <i className="fas fa-user-plus me-2"></i> Üye Ol
             </button>
             
             <div className="text-center mt-3">
               <small>Zaten hesabınız var mı? <a href="/login" className="login-link">Giriş Yap</a></small>
             </div>
           </div>
         </div>
       </div>
     </div>
     )
}

export default Register