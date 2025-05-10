import React, { useEffect, useState } from 'react'
import {useGetBidByVehicleIdQuery} from '../../Api/bidApi'
import { Loader } from '../../Helper';
import { useDispatch } from 'react-redux';
import './Styles/bid.css'
import { useCheckStatusAuctionPriceMutation } from '../../Api/paymentHistoryApi';
import { checkStatus } from '../../interfaces/checkStatus';
import userModel from '../../interfaces/enum/userModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../Storage/store';
import CreateBid from './CreateBid';
import { error } from 'console';
import { useGetVehicleByIdQuery } from '../../Api/vehicleApi';

interface BidsDetailProps {
  vehicleId: string;
  isAuctionActive?: boolean; // İsteğe bağlı, varsayılan olarak true
}

function BidsDetail({ vehicleId, isAuctionActive = true }: BidsDetailProps) {
  // State to hold bids from the server
  const [localBids, setLocalBids] = useState<any[]>([]);
  // State to track auction end status
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  // State to hold highest bid ID
  const [highestBidId, setHighestBidId] = useState<number | null>(null);

  // Using refetch to manually trigger data refresh
  const{data, isLoading, refetch}=useGetBidByVehicleIdQuery(parseInt(vehicleId), {
    // Poll every 3 seconds to keep bids updated
    pollingInterval: 3000,
    // Refetch when component mounts or when vehicleId changes
    refetchOnMountOrArgChange: true,
    // Always refetch when focus returns to the window
    refetchOnFocus: true
  })

  const userStore:userModel=useSelector((state:RootState)=>state.authenticationStore);
  const [checkStatusAuction]=useCheckStatusAuctionPriceMutation();
  
  var model:any={}
  const[result,setResultState]=useState();
  const { data: vehicleData, isLoading: vehicleLoading } = useGetVehicleByIdQuery(parseInt(vehicleId));
   
  // Effect to check auction end time
  useEffect(() => {
    if (vehicleData && vehicleData.result) {
      const endTime = new Date(vehicleData.result.endTime).getTime();
      const currentTime = new Date().getTime();
      
      // Check if auction has ended
      if (currentTime > endTime) {
        setIsAuctionEnded(true);
        
        // Find the highest bid if auction has ended
        if (data && data.result && data.result.length > 0) {
          // Sort bids to find the highest
          const sortedBids = [...data.result].sort((a, b) => b.bidAmount - a.bidAmount);
          if (sortedBids.length > 0) {
            // Store the highest bid ID
            setHighestBidId(sortedBids[0].bidId);
          }
        }
      } else {
        setIsAuctionEnded(false);
      }
    }
  }, [vehicleData, data]);
    
  // Effect to check auction status
  useEffect(()=>{
    console.log("trigger")
    const checkModel:checkStatus={
      userId:userStore.nameid!,
      vehicleId:parseInt(vehicleId)
    } 
    checkStatusAuction(checkModel).then((response:any)=>{
      console.log(response);
      setResultState(response!.data?.isSuccess)
    }).catch((err)=>{
      console.error(err)
    })
    console.log(result)
  },[vehicleId,userStore.nameid,checkStatusAuction])
  
  // Effect to sync local bids with data from API
  useEffect(() => {
    // Update local bids when data from the API changes
    if (data && data.result) {
      setLocalBids(data.result);
    }
  }, [data]);
 
  if(!data || vehicleLoading){
    return(
        <Loader></Loader>
    )
  }
  
  return (
    <>
      {/* Auction End Notice */}
      {isAuctionEnded && (
        <div className="alert alert-success text-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Auction has ended!</strong> The winning bid has been highlighted below.
        </div>
      )}
      
      {/* Auction Inactive Notice */}
      {!isAuctionActive && !isAuctionEnded && (
        <div className="alert alert-warning text-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Auction is currently inactive.</strong> Bidding is not available at this time.
        </div>
      )}
      
      {/* Teklif verme bileşeni - only show if auction is active and not ended */}
      {isAuctionActive && !isAuctionEnded && (
        <div className='container mb-5'>
          <CreateBid 
            vehicleId={vehicleId} 
            onBidSuccess={() => {
              refetch();
            }} 
          />
        </div>
      )}

      {/* Mevcut teklifleri listele */}
      <div className='bid-list'>
        <h4 className="text-center mb-4">
          {isAuctionEnded ? 'Auction Results' : 'Current Bids'}
        </h4>
        {localBids && localBids.length > 0 ? (
          localBids.map((bid: any) => (
            <div className='mt-4' key={bid.bidId}> 
              <div className={`bid ${isAuctionEnded && bid.bidId === highestBidId ? 'winning-bid' : ''}`}>
                <span className='bid-number'>{bid.bidId}</span>
                <span className='bid-date'>{new Date(bid.bidDate).toLocaleString()}</span>
                <span className='bid-amount'>${parseFloat(bid.bidAmount).toFixed(2)}</span>
                {isAuctionEnded && bid.bidId === highestBidId && (
                  <span className="winner-badge">WINNER</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No bids yet. Be the first to place a bid!</p>
        )}
      </div>
    </>
    
  )
}

export default BidsDetail