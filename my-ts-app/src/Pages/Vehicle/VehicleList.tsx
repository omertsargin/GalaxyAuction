import React, { useEffect, useState } from 'react'
import { useGetVehiclesQuery } from '../../Api/vehicleApi'
import { vehicleModel } from '../../interfaces/vehicleModel'
import './Styles/VehicleList.css'
import Circle from './Circle'
import { Link } from 'react-router-dom'
import Banner from './Banner'
import { Loader } from '../../Helper'

function VehicleList() {
  const { data, isLoading } = useGetVehiclesQuery(null)
  const [vehicles, setVehicleState] = useState<vehicleModel[]>([])
  const [activeTab, setActiveTab] = useState<string>('all') // 'all', 'active', 'inactive'
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (data) {
      setVehicleState(data.result);
    }
  }, [data])

  // Araçları filtreleme fonksiyonu
  const filteredVehicles = vehicles.filter(vehicle => {
    // Arama terimine göre filtreleme
    const matchesSearch = vehicle.brandAndModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());

    // Sekmeye göre filtreleme
    if (activeTab === 'all') {
      return matchesSearch;
    } else if (activeTab === 'active') {
      return matchesSearch && vehicle.isActive;
    } else { // inactive
      return matchesSearch && !vehicle.isActive;
    }
  });

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='container'>
      <Banner />

      {/* Arama ve Filtreleme Bölümü */}
      <div className='search-filter-container mb-4'>
        <div className='row align-items-center'>
          <div className='col-md-6 mb-3 mb-md-0'>
            <div className='input-group'>
              <input 
                type='text' 
                className='form-control' 
                placeholder='Araç adı veya renk ile ara...' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className='btn'>
                <i className='fas fa-search'></i>
              </button>
            </div>
          </div>
          <div className='col-md-6'>
            <ul className='nav nav-tabs'>
              <li className='nav-item'>
                <button 
                  className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <i className='fas fa-car me-1'></i> Tüm Araçlar ({vehicles.length})
                </button>
              </li>
              <li className='nav-item'>
                <button 
                  className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  <i className='fas fa-check-circle me-1'></i> Aktif Araçlar ({vehicles.filter(v => v.isActive).length})
                </button>
              </li>
              <li className='nav-item'>
                <button 
                  className={`nav-link ${activeTab === 'inactive' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inactive')}
                >
                  <i className='fas fa-ban me-1'></i> Pasif Araçlar ({vehicles.filter(v => !v.isActive).length})
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Araç Listesi */}
      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'>
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle, index) => (
            <div className='col' key={vehicle.vehicleId || index}>
              <div className={`auction-card text-center ${!vehicle.isActive ? 'inactive-vehicle' : ''}`}>
                {!vehicle.isActive && (
                  <div className='inactive-badge'>
                    <span>Pasif</span>
                  </div>
                )}
                <div className='card-image text-center'>
                  <img src={vehicle.image} alt={vehicle.brandAndModel} />
                </div> 
                <div className='card-details text-center'>
                  <h2>{vehicle.brandAndModel}</h2>
                  <p><strong>Yıl:</strong> {vehicle.manufacturingYear}</p>
                  <p><strong>Renk:</strong> {vehicle.color}</p>
                  <p><strong>Fiyat:</strong> ${vehicle.price?.toLocaleString()}</p>
                  <p><strong>Bitiş:</strong> {new Date(vehicle.endTime).toLocaleDateString()}</p>
                </div>

                <div className='card-actions'>
                  <Link to={`/Vehicle/VehicleId/${vehicle.vehicleId}`} className='btn btn-primary'>
                    <i className='fas fa-info-circle me-2'></i> Detaylar
                  </Link>
                  <Circle vehicle={vehicle} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='col-12 text-center my-5'>
            <h3>Araç bulunamadı</h3>
            <p>Arama kriterlerinize uygun araç bulunamadı. Lütfen farklı bir arama terimi deneyin veya filtreleri değiştirin.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VehicleList