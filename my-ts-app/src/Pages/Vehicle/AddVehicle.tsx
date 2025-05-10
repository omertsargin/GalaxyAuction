import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddVehicleMutation } from '../../Api/vehicleApi';
import './Styles/AddVehicle.css';
import { Loader } from '../../Helper';
import { useSelector } from 'react-redux';
import { RootState } from '../../Storage/store';

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();
  const [addVehicle, { isLoading }] = useAddVehicleMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userStore = useSelector((state: RootState) => state.authenticationStore);
  
  const [formData, setFormData] = useState({
    brandAndModel: '',
    manufacturingYear: new Date().getFullYear(),
    color: '',
    engineCapacity: 0,
    price: 0,
    millage: 0,
    plateNumber: '',
    auctionPrice: 0,
    additionalInformation: '',
    startTime: formatDateForInput(new Date()),
    endTime: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
    image: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Format date for datetime-local input
  function formatDateForInput(date: Date): string {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16);
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'manufacturingYear' || name === 'price' || name === 'millage' || name === 'engineCapacity' || name === 'auctionPrice'
        ? parseFloat(value)
        : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        image: 'Image size should be less than 5MB'
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Convert to base64 for sending to API
    const base64Reader = new FileReader();
    base64Reader.onloadend = () => {
      setFormData({
        ...formData,
        image: base64Reader.result as string
      });
    };
    base64Reader.readAsDataURL(file);
    
    // Clear error
    if (errors.image) {
      setErrors({
        ...errors,
        image: ''
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.brandAndModel.trim()) {
      newErrors.brandAndModel = 'Brand and model is required';
    }
    
    if (!formData.manufacturingYear || formData.manufacturingYear < 1900 || formData.manufacturingYear > new Date().getFullYear() + 1) {
      newErrors.manufacturingYear = 'Please enter a valid year';
    }
    
    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }
    
    if (!formData.engineCapacity || formData.engineCapacity <= 0) {
      newErrors.engineCapacity = 'Engine capacity must be greater than 0';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.millage || formData.millage < 0) {
      newErrors.millage = 'Mileage must be 0 or greater';
    }
    
    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = 'Plate number is required';
    }
    
    if (!formData.auctionPrice || formData.auctionPrice <= 0) {
      newErrors.auctionPrice = 'Starting auction price must be greater than 0';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (!formData.image) {
      newErrors.image = 'Vehicle image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await addVehicle({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        isActive: true, // New vehicles are active by default
      }).unwrap();
      
      // Success! Navigate to vehicle list
      navigate('/auctions');
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      // Handle API errors
      setErrors({
        ...errors,
        submit: 'Failed to add vehicle. Please try again.'
      });
    }
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  return (
    <div className='add-vehicle-container'>
      <div className='container'>
        <div className='add-vehicle-card'>
          <div className='add-vehicle-header'>
            <div className='add-vehicle-icon'>
              <i className='fas fa-car-alt'></i>
            </div>
            <h2>Araç Ekle</h2>
            <p>Açık artırmaya yeni bir araç eklemek için aşağıdaki formu doldurun</p>
          </div>
          
          <form className='add-vehicle-form' onSubmit={handleSubmit}>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label htmlFor='brandAndModel'>
                    <i className='fas fa-car'></i> Marka ve Model
                  </label>
                  <input
                    type='text'
                    className={`form-control ${errors.brandAndModel ? 'is-invalid' : ''}`}
                    id='brandAndModel'
                    name='brandAndModel'
                    value={formData.brandAndModel}
                    onChange={handleInputChange}
                    placeholder='Örn: Toyota Corolla'
                  />
                  {errors.brandAndModel && <div className='invalid-feedback'>{errors.brandAndModel}</div>}
                </div>
                
                <div className='form-group'>
                  <label htmlFor='manufacturingYear'>
                    <i className='fas fa-calendar-alt'></i> Üretim Yılı
                  </label>
                  <input
                    type='number'
                    className={`form-control ${errors.manufacturingYear ? 'is-invalid' : ''}`}
                    id='manufacturingYear'
                    name='manufacturingYear'
                    value={formData.manufacturingYear}
                    onChange={handleInputChange}
                    min='1900'
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.manufacturingYear && <div className='invalid-feedback'>{errors.manufacturingYear}</div>}
                </div>
                
                <div className='form-group'>
                  <label htmlFor='color'>
                    <i className='fas fa-palette'></i> Renk
                  </label>
                  <input
                    type='text'
                    className={`form-control ${errors.color ? 'is-invalid' : ''}`}
                    id='color'
                    name='color'
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder='Örn: Beyaz'
                  />
                  {errors.color && <div className='invalid-feedback'>{errors.color}</div>}
                </div>
                
                <div className='form-group'>
                  <label htmlFor='engineCapacity'>
                    <i className='fas fa-tachometer-alt'></i> Motor Hacmi (cc)
                  </label>
                  <input
                    type='number'
                    className={`form-control ${errors.engineCapacity ? 'is-invalid' : ''}`}
                    id='engineCapacity'
                    name='engineCapacity'
                    value={formData.engineCapacity}
                    onChange={handleInputChange}
                    step='0.1'
                    min='0'
                  />
                  {errors.engineCapacity && <div className='invalid-feedback'>{errors.engineCapacity}</div>}
                </div>
                
                <div className='form-group'>
                  <label htmlFor='millage'>
                    <i className='fas fa-road'></i> Kilometre
                  </label>
                  <input
                    type='number'
                    className={`form-control ${errors.millage ? 'is-invalid' : ''}`}
                    id='millage'
                    name='millage'
                    value={formData.millage}
                    onChange={handleInputChange}
                    min='0'
                  />
                  {errors.millage && <div className='invalid-feedback'>{errors.millage}</div>}
                </div>
              </div>
              
              <div className='col-md-6'>
                <div className='form-group'>
                  <label htmlFor='plateNumber'>
                    <i className='fas fa-id-card'></i> Plaka Numarası
                  </label>
                  <input
                    type='text'
                    className={`form-control ${errors.plateNumber ? 'is-invalid' : ''}`}
                    id='plateNumber'
                    name='plateNumber'
                    value={formData.plateNumber}
                    onChange={handleInputChange}
                    placeholder='Örn: 34ABC123'
                  />
                  {errors.plateNumber && <div className='invalid-feedback'>{errors.plateNumber}</div>}
                </div>
                
                <div className='form-group'>
                  <label htmlFor='price'>
                    <i className='fas fa-tag'></i> Fiyat ($)
                  </label>
                  <input
                    type='number'
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    id='price'
                    name='price'
                    value={formData.price}
                    onChange={handleInputChange}
                    min='0'
                    step='0.01'
                  />
                  {errors.price && <div className='invalid-feedback'>{errors.price}</div>}
                </div>
                
                <div className='form-group'>
                  <label htmlFor='auctionPrice'>
                    <i className='fas fa-gavel'></i> Başlangıç Açık Artırma Fiyatı ($)
                  </label>
                  <input
                    type='number'
                    className={`form-control ${errors.auctionPrice ? 'is-invalid' : ''}`}
                    id='auctionPrice'
                    name='auctionPrice'
                    value={formData.auctionPrice}
                    onChange={handleInputChange}
                    min='0'
                    step='0.01'
                  />
                  {errors.auctionPrice && <div className='invalid-feedback'>{errors.auctionPrice}</div>}
                </div>
                
                <div className='auction-dates'>
                  <div className='form-group'>
                    <label htmlFor='startTime'>
                      <i className='fas fa-hourglass-start'></i> Başlangıç Zamanı
                    </label>
                    <input
                      type='datetime-local'
                      className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                      id='startTime'
                      name='startTime'
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                    {errors.startTime && <div className='invalid-feedback'>{errors.startTime}</div>}
                  </div>
                  
                  <div className='form-group'>
                    <label htmlFor='endTime'>
                      <i className='fas fa-hourglass-end'></i> Bitiş Zamanı
                    </label>
                    <input
                      type='datetime-local'
                      className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                      id='endTime'
                      name='endTime'
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                    {errors.endTime && <div className='invalid-feedback'>{errors.endTime}</div>}
                  </div>
                </div>
              </div>
              
              <div className='col-12'>
                <div className='form-group'>
                  <label htmlFor='additionalInformation'>
                    <i className='fas fa-info-circle'></i> Ek Bilgiler
                  </label>
                  <textarea
                    className='form-control'
                    id='additionalInformation'
                    name='additionalInformation'
                    value={formData.additionalInformation}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder='Aracınız hakkında potansiyel alıcıların bilmesi gereken detaylar...'
                  ></textarea>
                </div>
                
                <div className='form-group'>
                  <label>
                    <i className='fas fa-image'></i> Araç Resmi
                  </label>
                  <input
                    type='file'
                    className='d-none'
                    ref={fileInputRef}
                    accept='image/*'
                    onChange={handleImageUpload}
                  />
                  <div 
                    className={`custom-file-upload ${errors.image ? 'border-danger' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className='fas fa-cloud-upload-alt'></i>
                    <p>Resim yüklemek için tıklayın veya sürükleyin</p>
                    <small className='form-text'>Maksimum boyut: 5MB</small>
                  </div>
                  {previewImage && (
                    <div className='text-center'>
                      <img src={previewImage} alt='Preview' className='preview-image' />
                    </div>
                  )}
                  {errors.image && <div className='invalid-feedback'>{errors.image}</div>}
                </div>
              </div>
            </div>
            
            {errors.submit && (
              <div className='alert alert-danger' role='alert'>
                {errors.submit}
              </div>
            )}
            
            <button type='submit' className='btn btn-add-vehicle' disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                  Araç Ekleniyor...
                </>
              ) : (
                <>
                  <i className='fas fa-plus-circle me-2'></i>
                  Araç Ekle
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle; 