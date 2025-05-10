import React, { useState, useEffect } from 'react';
import { useGetAllBidsQuery } from '../../Api/bidApi';
import { useGetVehiclesQuery } from '../../Api/vehicleApi';
import './Styles/AuctionList.css';
import { Link } from 'react-router-dom';

interface Bid {
  bidId: number;
  bidAmount: number;
  bidDate: string;
  bidStatus: string;
  userId: string;
  vehicleId: number;
  userName?: string;
}

interface Vehicle {
  vehicleId: number;
  brandAndModel: string;
  manufacturingYear: number;
  color: string;
  price: number;
  endTime: string;
  isActive: boolean;
  image: string;
}

interface GroupedBid {
  vehicle: Vehicle;
  bids: Bid[];
  highestBid: number;
  bidCount: number;
}

const AuctionList: React.FC = () => {
  const { data: bids, isLoading: isLoadingBids, refetch: refetchBids, error: bidsError } = useGetAllBidsQuery({});
  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehiclesQuery({});
  const [groupedBids, setGroupedBids] = useState<GroupedBid[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('highestBid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (bids && vehicles) {
      // API'den gelen verilerin doğru formatta olup olmadığını kontrol et
      console.log('Vehicles type:', typeof vehicles);
      console.log('Vehicles data:', vehicles);
      
      // vehicles bir dizi değilse ve result özelliği varsa, result'u kullan
      const vehiclesArray = Array.isArray(vehicles) ? vehicles : 
                           (vehicles.result && Array.isArray(vehicles.result) ? vehicles.result : []);
      
      // Şu anki tarih
      const now = new Date();
      
      // Sadece aktif VE süresi dolmamış araçlar için teklifleri grupla
      const activeVehicles = vehiclesArray.filter((v: Vehicle) => {
        const endTime = new Date(v.endTime);
        return v.isActive && endTime > now;
      });
      
      // Bids'in doğru formatta olup olmadığını kontrol et
      const bidsArray = Array.isArray(bids) ? bids : 
                      (bids?.result && Array.isArray(bids.result) ? bids.result : []);
      
      // Her araç için teklifleri grupla
      const grouped = activeVehicles.map((vehicle: Vehicle) => {
        const vehicleBids = bidsArray.filter((bid: Bid) => bid.vehicleId === vehicle.vehicleId);
        const highestBid = vehicleBids.length > 0 
          ? Math.max(...vehicleBids.map((bid: Bid) => bid.bidAmount))
          : 0;
        
        return {
          vehicle,
          bids: vehicleBids,
          highestBid,
          bidCount: vehicleBids.length
        };
      });
      
      // Sadece teklifi olan araçları filtrele
      const withBids = grouped.filter((item: GroupedBid) => item.bids.length > 0);
      setGroupedBids(withBids);
    }
  }, [bids, vehicles]);

  // Arama ve sıralama fonksiyonu
  const getFilteredAndSortedBids = () => {
    let filtered = [...groupedBids];
    
    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.vehicle.brandAndModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sıralama
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'highestBid':
          comparison = a.highestBid - b.highestBid;
          break;
        case 'bidCount':
          comparison = a.bidCount - b.bidCount;
          break;
        case 'endTime':
          comparison = new Date(a.vehicle.endTime).getTime() - new Date(b.vehicle.endTime).getTime();
          break;
        case 'brandAndModel':
          comparison = a.vehicle.brandAndModel.localeCompare(b.vehicle.brandAndModel);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedBids = getFilteredAndSortedBids();

  if (isLoadingBids || isLoadingVehicles) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-2">Açık artırmalar yükleniyor...</p>
      </div>
    );
  }
  
  // Hata durumunu göster
  if (bidsError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Hata Oluştu!</h4>
          <p>Teklifler yüklenirken bir hata oluştu.</p>
          <pre>{JSON.stringify(bidsError, null, 2)}</pre>
          <button className="btn btn-primary mt-3" onClick={() => refetchBids()}>Tekrar Dene</button>
        </div>
      </div>
    );
  }
  
  // Debug bilgileri
  console.log('Bids:', bids);
  console.log('Vehicles:', vehicles);
  console.log('Grouped Bids:', groupedBids);

  return (
    <div className="auction-list-container">
      <div className="container mt-4">
        <h1 className="text-center mb-4">Aktif Açık Artırmalar</h1>
        
        {/* Arama ve Filtreleme */}
        <div className="search-filter-container mb-4">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Marka veya model ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end">
                <div className="btn-group">
                  <button 
                    className={`btn ${sortBy === 'highestBid' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSort('highestBid')}
                  >
                    En Yüksek Teklif {sortBy === 'highestBid' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`btn ${sortBy === 'bidCount' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSort('bidCount')}
                  >
                    Teklif Sayısı {sortBy === 'bidCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`btn ${sortBy === 'endTime' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSort('endTime')}
                  >
                    Bitiş Zamanı {sortBy === 'endTime' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Açık Artırma Listesi */}
        {filteredAndSortedBids.length === 0 ? (
          <div className="alert alert-info text-center">
            Aktif açık artırma bulunamadı.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredAndSortedBids.map((item) => {
              // Kalan zamanı hesapla
              const endTime = new Date(item.vehicle.endTime);
              const now = new Date();
              const timeRemaining = endTime.getTime() - now.getTime();
              const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
              const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              
              return (
                <div className="col" key={item.vehicle.vehicleId}>
                  <div className="auction-card">
                    <div className="auction-status">
                      <span className="badge bg-success">Aktif</span>
                      <span className="bid-count">
                        <i className="fas fa-gavel me-1"></i> {item.bidCount} Teklif
                      </span>
                    </div>
                    
                    <div className="card-image">
                      <img src={item.vehicle.image} alt={item.vehicle.brandAndModel} />
                    </div>
                    
                    <div className="card-details">
                      <h2>{item.vehicle.brandAndModel}</h2>
                      
                      <div className="vehicle-info">
                        <p><i className="fas fa-car me-1"></i> {item.vehicle.manufacturingYear}</p>
                        <p><i className="fas fa-palette me-1"></i> {item.vehicle.color}</p>
                      </div>
                      
                      <div className="bid-info">
                        <div className="highest-bid">
                          <span className="label">En Yüksek Teklif:</span>
                          <span className="value">${item.highestBid.toLocaleString()}</span>
                        </div>
                        <div className="time-remaining">
                          <span className="label">Kalan Süre:</span>
                          <span className="value">
                            <i className="fas fa-clock me-1"></i>
                            {daysRemaining > 0 ? `${daysRemaining} gün ` : ''}
                            {hoursRemaining} saat
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <Link to={`/Vehicle/VehicleId/${item.vehicle.vehicleId}`} className="btn btn-primary w-100">
                        <i className="fas fa-gavel me-2"></i> Açık Artırmaya Katıl
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionList;
