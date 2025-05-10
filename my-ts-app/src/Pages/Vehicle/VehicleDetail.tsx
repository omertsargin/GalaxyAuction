import React from 'react'
import {useParams} from "react-router-dom"
import { useGetVehicleByIdQuery } from '../../Api/vehicleApi';
import { Loader } from '../../Helper';
import './Styles/VehicleDetail.css'
import BidsDetail from '../Bid/BidsDetail';
import formatTime from '../../Utility/formatTime';

function VehicleDetail() {
    const {vehicleId}=useParams();
    const {data,isLoading}=useGetVehicleByIdQuery(vehicleId) //İstek devam ediyorsa (data henüz gelmemişse) isLoading true olur.İstek tamamlandığında isLoading false olur ve data yüklenmiş olur.
    const safeVehicleId=vehicleId || "" //boş deger gelirse patlayabilir.
 
    if (isLoading) {
      return <Loader />;
    }
    if (!data || !data.result) {
      return <p>Veri bulunamadı.</p>;
    }

    // Açık artırma sona ermiş mi kontrol et
    const isAuctionEnded = new Date(data.result.endTime) < new Date();
    // Aracın aktif olup olmadığını kontrol et
    const isActive = data.result.isActive;
    
    // Format para birimini daha iyi göstermek için
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    return (
      <>
        <div className='vehicle-detail-container'>
          <div className='vehicle-header'>
            <h1 className='vehicle-title'>{data.result.brandAndModel}</h1>
            <div className='vehicle-subtitle'>
              {isAuctionEnded ? (
                <span className='auction-ended'>Auction Ended</span> 
              ) : !isActive ? (
                <span className='auction-inactive'>Auction Inactive</span>
              ) : (
                <span className='auction-active'>Auction Active</span>
              )}
            </div>
          </div>
          
          <div className='vehicle-content'>
            <div className='vehicle-image-container'>
              <img className='vehicle-image' src={data.result.image} alt={data.result.brandAndModel} />
              {!isAuctionEnded && isActive && (
                <div className='auction-timer'>
                  <p>Auction ends: <span>{new Date(data.result.endTime).toLocaleString()}</span></p>
                </div>
              )}
            </div>
            
            <div className='vehicle-info'>
              <div className='info-section'>
                <h2 className='section-title'>Vehicle Specifications</h2>
                <div className='info-grid'>
                  <div className='info-item'>
                    <span className='info-label'>Year</span>
                    <span className='info-value'>{data.result.manufacturingYear}</span>
                  </div>
                  <div className='info-item'>
                    <span className='info-label'>Color</span>
                    <span className='info-value'>{data.result.color}</span>
                  </div>
                  <div className='info-item'>
                    <span className='info-label'>Engine</span>
                    <span className='info-value'>{data.result.engineCapacity} L</span>
                  </div>
                  <div className='info-item'>
                    <span className='info-label'>Mileage</span>
                    <span className='info-value'>{data.result.millage.toLocaleString()} km</span>
                  </div>
                  <div className='info-item'>
                    <span className='info-label'>Starting Price</span>
                    <span className='info-value highlight'>{formatCurrency(data.result.price)}</span>
                  </div>
                  <div className='info-item'>
                    <span className='info-label'>Auction Fee</span>
                    <span className='info-value'>{formatCurrency(data.result.auctionPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div className='info-section'>
                <h2 className='section-title'>Description</h2>
                <p className='vehicle-description'>{data.result.additionalInformation}</p>
              </div>
              
              {!isActive && (
                <div className="alert alert-warning mt-4" role="alert">
                  <strong>This vehicle is currently not available for bidding.</strong> The auction may be on hold or pending approval.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='bids-container'>
          {/* İnaktif veya bitmiş açık artırmalar için teklif verme formunu gizle */}
          <BidsDetail 
            vehicleId={safeVehicleId} 
            isAuctionActive={isActive && !isAuctionEnded}
          />
        </div>
      </>
    );
}

export default VehicleDetail