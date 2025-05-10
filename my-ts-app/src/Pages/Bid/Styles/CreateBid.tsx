import React, { useState } from 'react'
import { useCreateBidMutation } from '../../../Api/bidApi'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../Storage/store'
import userModel from '../../../interfaces/enum/userModel'

function CreateBid() {
  const [bidAmount, setBidAmount] = useState('')
  const [createBid, { isLoading, isSuccess, isError, error }] = useCreateBidMutation()
  const { vehicleId } = useParams()
  const userStore: userModel = useSelector((state: RootState) => state.authenticationStore)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setMessage({ text: 'Please enter a valid bid amount', type: 'danger' })
      return
    }

    try {
      const bidData = {
        bidAmount: parseFloat(bidAmount),
        bidDate: new Date().toISOString(),
        bidStatus: "Active",
        userId: userStore.nameid,
        vehicleId: parseInt(vehicleId || '0')
      }

      await createBid(bidData).unwrap()
      setMessage({ text: 'Bid placed successfully!', type: 'success' })
      setBidAmount('') // Reset form after successful submission
    } catch (err: any) {
      setMessage({ 
        text: err.data?.errorMessages?.join(' ') || 'Failed to place bid. Please try again.', 
        type: 'danger' 
      })
      console.error('Error placing bid:', err)
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
      <form onSubmit={handleSubmit}>
        <label htmlFor='bidAmount'>Bid Amount:</label>
        <input 
          type='number' 
          className='form-control' 
          id='bidAmount' 
          name='bidAmount'
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          min="1"
          step="0.01"
          required
        />    
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