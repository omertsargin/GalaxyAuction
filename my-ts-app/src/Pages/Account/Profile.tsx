import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Storage/store';
import { Loader } from '../../Helper';
import './Styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfileMutation } from '../../Api/accountApi';

interface ProfileForm {
  fullName: string;
  userName: string;
  email: string;
  dateOfBirth: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const userStore = useSelector((state: RootState) => state.authenticationStore);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
  const navigate = useNavigate();
  
  // Use the update profile mutation
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [profileData, setProfileData] = useState<ProfileForm>({
    fullName: '',
    userName: '',
    email: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check if user is logged in
    if (!userStore.nameid) {
      navigate('/login');
      return;
    }

    // Load user data
    const fetchUserData = async () => {
      try {
        // In a real app, you would fetch from API
        // For now, populate with auth store data
        setProfileData({
          ...profileData,
          fullName: userStore.fullName || '',
          email: userStore.email || '',
          userName: '', // Would come from API
          dateOfBirth: '', // Would come from API
        });
        setLoading(false);
      } catch (error) {
        setMessage({ text: 'Kullanıcı bilgileri yüklenirken hata oluştu.', type: 'danger' });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userStore, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Password validation
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setMessage({ text: 'Yeni şifreler eşleşmiyor.', type: 'danger' });
      setSaving(false);
      return;
    }

    try {
      // Prepare data for API
      const updateData = {
        userId: userStore.nameid,
        userName: profileData.userName,
        fullName: profileData.fullName,
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString() : null,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      };

      // Call API to update profile
      const response = await updateProfile(updateData).unwrap();
      
      if (response.isSuccess) {
        setMessage({ text: 'Profil bilgileriniz başarıyla güncellendi.', type: 'success' });
        
        // Clear password fields after successful update
        setProfileData({
          ...profileData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ 
          text: response.errorMessages?.join(', ') || 'Profil güncellenirken bir hata oluştu.', 
          type: 'danger' 
        });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      setMessage({ 
        text: error.data?.errorMessages?.join(', ') || 'Profil güncellenirken bir hata oluştu.', 
        type: 'danger' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-container">
      <div className="container py-5">
        <h1 className="text-center mb-4">Profil Bilgilerim</h1>
        
        {message && (
          <div className={`alert alert-${message.type} mb-4`} role="alert">
            {message.text}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <h2>{profileData.fullName || 'Kullanıcı'}</h2>
            <p className="text-muted">{profileData.email}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="fullName" className="form-label">Ad Soyad</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-user"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="userName" className="form-label">Kullanıcı Adı</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-at"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    name="userName"
                    value={profileData.userName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">E-posta</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <small className="form-text text-muted">E-posta adresi değiştirilemez.</small>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="dateOfBirth" className="form-label">Doğum Tarihi</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-calendar"></i></span>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <hr className="my-4" />
            <h3 className="mb-3">Şifre Değiştir</h3>
            
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="currentPassword" className="form-label">Mevcut Şifre</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-lock"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="newPassword" className="form-label">Yeni Şifre</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-key"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="confirmPassword" className="form-label">Şifre Tekrar</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-key"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 