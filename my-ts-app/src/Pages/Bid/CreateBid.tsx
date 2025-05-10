import React, { useState, useEffect } from 'react'
import { useCreateBidMutation, useGetBidByVehicleIdQuery } from '../../Api/bidApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../Storage/store'
import userModel from '../../interfaces/enum/userModel'
import { useGetVehicleByIdQuery } from '../../Api/vehicleApi'

interface CreateBidProps {
  vehicleId: string;
  onBidSuccess?: () => void; // Optional callback for when a bid is successful
}

function CreateBid({ vehicleId, onBidSuccess }: CreateBidProps) {
  const [bidAmount, setBidAmount] = useState('')
  const [createBid, { isLoading, isSuccess, isError, error }] = useCreateBidMutation()
  const userStore: userModel = useSelector((state: RootState) => state.authenticationStore)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  // Fetch vehicle details to get base price
  const { data: vehicleData } = useGetVehicleByIdQuery(parseInt(vehicleId))
  
  // Fetch existing bids to determine minimum bid amount
  const { data: bidsData } = useGetBidByVehicleIdQuery(parseInt(vehicleId))
  
  // Calculate minimum bid amount based on backend rules
  const [minBidAmount, setMinBidAmount] = useState<number | null>(null)
  const [bidGuidance, setBidGuidance] = useState('')
  
  const MAX_BID_AMOUNT = 999999999;

  useEffect(() => {
    // Calculate minimum bid amount based on vehicle price and existing bids
    if (vehicleData && vehicleData.result) {
      const basePrice = vehicleData.result.price || 0
      
      if (bidsData && bidsData.result && bidsData.result.length > 0) {
        // Sort bids to find the highest
        const sortedBids = [...bidsData.result].sort((a, b) => b.bidAmount - a.bidAmount)
        const highestBid = sortedBids[0].bidAmount
        
        // Bid must be at least 1% higher than current highest bid
        const minAmount = Math.max(basePrice, highestBid * 1.01)
        // Yuvarla ve tam sayı olarak kaydet
        setMinBidAmount(Math.ceil(minAmount))
        
        // Check if the highest bid is already at or near the maximum allowed value
        if (highestBid >= MAX_BID_AMOUNT * 0.99) {
          // If we're at max bid, set a special message
          setBidGuidance(`Maximum bid limit of $${MAX_BID_AMOUNT.toLocaleString()} has been reached.`)
        } else {
          // Tam sayı olarak göster
          setBidGuidance(`Current highest bid is $${Math.floor(highestBid)}. Your bid must be at least $${Math.ceil(minAmount)}.`)
        }
      } else {
        // No existing bids, just use base price
        // Yuvarla ve tam sayı olarak kaydet
        setMinBidAmount(Math.ceil(basePrice))
        setBidGuidance(`Minimum bid amount is $${Math.ceil(basePrice)} (vehicle base price).`)
      }
    }
  }, [vehicleData, bidsData, vehicleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate bid amount
    if (!bidAmount || parseInt(bidAmount) <= 0) {
      setMessage({ text: 'Please enter a valid bid amount', type: 'danger' })
      return
    }
    
    // Check if bid meets minimum amount requirement
    if (minBidAmount !== null && parseInt(bidAmount) < minBidAmount) {
      setMessage({ 
        text: `Your bid amount is too low. ${bidGuidance}`, 
        type: 'danger' 
      })
      return
    }
    
    // Check if bid amount is too large (C# decimal type has limits)
    const MAX_BID_AMOUNT = 999999999;
    if (parseInt(bidAmount) > MAX_BID_AMOUNT) {
      setMessage({ 
        text: `Your bid amount is too high. Maximum allowed bid is $${MAX_BID_AMOUNT.toLocaleString()}.`, 
        type: 'danger' 
      })
      return
    }
    
    // Login check removed as requested
    // Using a default user ID if not logged in
    const userId = userStore.nameid || 'default-user-id'
    
    // Vehicle ID kontrolü
    if (!vehicleId) {
      setMessage({ text: 'Vehicle information is missing', type: 'danger' })
      console.error('Vehicle ID is missing')
      return
    }

    try {
      // Tam sayı olarak işle
      const parsedBidAmount = parseInt(bidAmount);
      
      const bidData = {
        bidAmount: parsedBidAmount,
        bidDate: new Date().toISOString(),
        bidStatus: "Active",
        userId: userId || 'guest-user', // Using the default or actual user ID, ensuring it's never null
        vehicleId: parseInt(vehicleId)
      }
      
      // Log the bid data for debugging
      console.log('Sending bid data:', JSON.stringify(bidData, null, 2))
      
      // Make the API call to save the bid to the database
      const response = await createBid(bidData).unwrap()
      console.log('Bid response:', response)
      
      // Check if the response indicates success
      if (response && response.isSuccess) {
        // Show success message
        setMessage({ text: 'Bid placed successfully!', type: 'success' })
        setBidAmount('') // Reset form after successful submission
        
        // Trigger callback if provided to refresh the bid list
        if (onBidSuccess) {
          onBidSuccess()
        }
      } else {
        // Handle case where API call succeeded but the operation failed
        throw new Error(response.errorMessages?.join(' ') || 'Failed to save bid to database')
      }
    } catch (err: any) {
      // Enhanced error logging
      console.error('Error placing bid:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))
      console.error('Error response data:', err.data)
      console.error('Error status:', err.status)
      console.error('Bid amount type:', typeof bidAmount, 'Value:', bidAmount)
      
      // Backend'den gelen NullReferenceException hatasını kontrol et
      const errorData = err.data || '';
      let errorMessage = 'Failed to place bid. Please try again.';
      
      if (typeof errorData === 'string' && errorData.includes('NullReferenceException')) {
        errorMessage = 'This vehicle is not available for bidding. It may be inactive or not properly configured.';
      } else if (err.data?.errorMessages?.length > 0) {
        // Backend'den gelen hata mesajlarını göster
        errorMessage = err.data.errorMessages.join(' ');
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Kullanıcıya hata mesajı göster
      setMessage({ 
        text: errorMessage, 
        type: 'danger' 
      })
    }
  }

  return (
    <div className='container'>
      {message.text && (
        <div className={`alert alert-${message.type} mt-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close float-end" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}
      
      {/* Bid guidance information - hide when at max bid */}
      {bidGuidance && !bidGuidance.includes('Maximum bid limit') && (
        <div className="alert alert-info mt-3">
          <strong>Bid Guidance:</strong> {bidGuidance}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor='bidAmount'>Bid Amount:</label>
        <div className="input-group mb-3">
          <span className="input-group-text">$</span>
          <input 
            type='number' 
            className='form-control' 
            id='bidAmount' 
            name='bidAmount'
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min={minBidAmount || 1}
            max={999999999} /* Adding a maximum value to prevent parsing errors */
            step="1" /* Tam sayılar için adım değeri 1 olarak ayarlandı */
            placeholder={minBidAmount ? `Minimum bid: ${minBidAmount}` : 'Enter bid amount'}
            required
          />
        </div>
        <div className='text-center mb-3'>
          <br></br>
          <button 
            type='submit' 
            className='btn btn-primary'
            disabled={isLoading}
          >
            {isLoading ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBid
