import React, { useState, useEffect } from 'react';
import { useGetUserBidsQuery, useGetAllBidsQuery } from '../../Api/bidApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../Storage/store';
import { Loader } from '../../Helper';
import './Styles/mybids.css';
import { Link } from 'react-router-dom';
import { useGetVehiclesQuery } from '../../Api/vehicleApi';

interface Vehicle {
  vehicleId: number;
  brandAndModel: string;
  image: string;
  endTime: string;
  isActive: boolean;
}

const MyBids = () => {
  const userStore = useSelector((state: RootState) => state.authenticationStore);
  const userId = userStore.nameid;
  
  // Tüm teklifleri getir ve istemci tarafında filtrele
  const { data: bidsData, isLoading: bidsLoading, error: bidsError } = useGetAllBidsQuery(null);
  
  // Tüm araçları getir
  const { data: vehiclesData, isLoading: vehiclesLoading } = useGetVehiclesQuery(null);
  
  const [userBids, setUserBids] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Record<number, Vehicle>>({});
  const [filterStatus, setFilterStatus] = useState<string>('all'); // 'all', 'active', 'won', 'lost'
  
  useEffect(() => {
    // Kullanıcının teklifleri ve ilişkili araç verilerini birleştir
    if (bidsData && bidsData.result && vehiclesData && vehiclesData.result) {
      // Araçlar için referans dictionary oluştur
      const vehiclesDict: Record<number, Vehicle> = {};
      vehiclesData.result.forEach((vehicle: Vehicle) => {
        vehiclesDict[vehicle.vehicleId] = vehicle;
      });
      setVehicles(vehiclesDict);
      
      // Kullanıcının tekliflerini filtrele
      if (userId) {
        const userBidsList = bidsData.result
          .filter((bid: any) => bid.userId === userId)
          .map((bid: any) => ({
            ...bid,
            vehicle: vehiclesDict[bid.vehicleId] || null
          }));
        
        setUserBids(userBidsList);
      }
    }
  }, [bidsData, vehiclesData, userId]);
  
  // Teklifleri duruma göre filtrele
  const getFilteredBids = () => {
    if (filterStatus === 'all') {
      return userBids;
    }
    
    const now = new Date();
    
    return userBids.filter(bid => {
      const vehicle = vehicles[bid.vehicleId];
      if (!vehicle) return false;
      
      const auctionEnded = new Date(vehicle.endTime) < now;
      
      // Açık artırma bitmiş mi kontrol et
      if (filterStatus === 'active') {
        // Süre dolmamış araçları göster ve isActive true olanları göster
        return !auctionEnded && vehicle.isActive;
      }
      
      if (auctionEnded) {
        // Kullanıcının kazanıp kazanmadığını belirle
        // En yüksek teklifi bul
        const highestBid = bidsData.result
          .filter((b: any) => b.vehicleId === bid.vehicleId)
          .sort((a: any, b: any) => b.bidAmount - a.bidAmount)[0];
        
        const isWinner = highestBid && highestBid.bidId === bid.bidId;
        
        if (filterStatus === 'won' && isWinner) {
          return true;
        }
        
        if (filterStatus === 'lost' && !isWinner) {
          return true;
        }
      }
      
      return false;
    });
  };
  
  const filteredBids = getFilteredBids();
  
  if (bidsLoading || vehiclesLoading) {
    return <Loader />;
  }
  
  if (bidsError) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>Hata!</h4>
          <p>Teklifleriniz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>
    );
  }
  
  // Kullanıcı giriş yapmadıysa
  if (!userId) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Oturum Açılmadı</h4>
          <p>Tekliflerinizi görmek için lütfen oturum açın.</p>
          <Link to="/login" className="btn btn-primary mt-2">
            <i className="fas fa-sign-in-alt me-2"></i> Giriş Yap
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container my-4">
      <div className="my-bids-header">
        <h1 className="mb-4">Tekliflerim</h1>
        <p className="lead">Açık artırmalarda verdiğiniz tüm teklifleri burada görebilirsiniz.</p>
      </div>
      
      {/* Filtreleme Seçenekleri */}
      <div className="filter-tabs mb-4">
        <div className="nav nav-tabs">
          <button 
            className={`nav-link ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            <i className="fas fa-list me-2"></i>
            Tüm Teklifler ({userBids.length})
          </button>
          <button 
            className={`nav-link ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            <i className="fas fa-clock me-2"></i>
            Aktif Teklifler
          </button>
          <button 
            className={`nav-link ${filterStatus === 'won' ? 'active' : ''}`}
            onClick={() => setFilterStatus('won')}
          >
            <i className="fas fa-trophy me-2"></i>
            Kazanılan Teklifler
          </button>
          <button 
            className={`nav-link ${filterStatus === 'lost' ? 'active' : ''}`}
            onClick={() => setFilterStatus('lost')}
          >
            <i className="fas fa-times-circle me-2"></i>
            Kaybedilen Teklifler
          </button>
        </div>
      </div>
      
      {filteredBids.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <i className="fas fa-search fa-3x mb-3"></i>
          <h4>Teklif Bulunamadı</h4>
          <p>Seçilen filtreleme kriterlerine göre teklif bulunamadı.</p>
          {filterStatus !== 'all' && (
            <button 
              className="btn btn-outline-primary mt-2"
              onClick={() => setFilterStatus('all')}
            >
              Tüm Teklifleri Göster
            </button>
          )}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredBids.map((bid) => {
            const vehicle = vehicles[bid.vehicleId];
            const now = new Date();
            const endDate = new Date(vehicle?.endTime || '');
            const isAuctionEnded = endDate < now;
            
            // Kullanıcının teklifi kazanıp kazanmadığını belirle
            let bidStatus = 'active';
            let statusLabel = 'Aktif Teklif';
            let statusClass = 'primary';
            
            if (isAuctionEnded) {
              // En yüksek teklifi bul
              const highestBid = bidsData.result
                .filter((b: any) => b.vehicleId === bid.vehicleId)
                .sort((a: any, b: any) => b.bidAmount - a.bidAmount)[0];
              
              if (highestBid && highestBid.bidId === bid.bidId) {
                bidStatus = 'won';
                statusLabel = 'Kazandınız!';
                statusClass = 'success';
              } else {
                bidStatus = 'lost';
                statusLabel = 'Kaybettiniz';
                statusClass = 'danger';
              }
            }
            
            return (
              <div className="col" key={bid.bidId}>
                <div className={`bid-card ${bidStatus}-bid`}>
                  {/* Durum Rozeti */}
                  <div className={`bid-status-badge status-${bidStatus}`}>
                    {statusLabel}
                  </div>
                  
                  {/* Araç Resmi */}
                  <div className="bid-image">
                    {vehicle && (
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.brandAndModel}
                        className="vehicle-img"
                      />
                    )}
                  </div>
                  
                  {/* Teklif Bilgileri */}
                  <div className="bid-details">
                    <h3 className="vehicle-title">
                      {vehicle?.brandAndModel || 'Bilinmeyen Araç'}
                    </h3>
                    
                    <div className="bid-info">
                      <div className="info-item">
                        <span className="info-label">Teklif Tutarı</span>
                        <span className="info-value bid-amount">${bid.bidAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Teklif Tarihi</span>
                        <span className="info-value">{new Date(bid.bidDate).toLocaleString()}</span>
                      </div>
                      
                      {vehicle && (
                        <div className="info-item">
                          <span className="info-label">Açık Artırma Bitiş</span>
                          <span className="info-value">
                            {isAuctionEnded
                              ? 'Sona Erdi'
                              : new Date(vehicle.endTime).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Düğmeler */}
                    <div className="bid-actions">
                      {vehicle && (
                        <Link 
                          to={`/Vehicle/VehicleId/${vehicle.vehicleId}`} 
                          className="btn btn-primary"
                        >
                          <i className="fas fa-car me-2"></i>
                          Aracı Görüntüle
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBids; 