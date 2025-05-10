using AutoMapper;
using Azure;

using Microsoft.EntityFrameworkCore;
using MyGalaxy_Auction_Business.Abstraction;
using MyGalaxy_Auction_Business.Dtos;
using MyGalaxy_Auction_Core.Models;
using MyGalaxy_Auction_DataAccess.Context;
using MyGalaxy_Auction_DataAccess.Domain;
using MyGalaxy_Auction_Core.MailHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Concrete
{
    public class BidService : IBidService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ApiResponse _response;
        private readonly IMailService _mailService;
        public BidService(ApplicationDbContext context,IMailService mailService,IMapper mapper,ApiResponse response)
        {
            _context = context;
            _mapper = mapper;
            _response = response;
            _mailService= mailService;
        }

        public async Task<ApiResponse> AutomaticallyCreateBid(CreateBidDto model)
        {
            var isPaid = await CheckIsPaidAuction(model.UserId, model.VehicleId);
            if (!isPaid)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add("Please before pay auction price");
                return _response;
            }

            var result = await _context.Bids.Where(x => x.VehicleId == model.VehicleId && x.Vehicle.IsActive == true).OrderByDescending(x => x.BidAmount).ToListAsync();
            if (result.Count == 0)
            {
                _response.isSuccess = false;
                return _response;
            }
            var objDTO = _mapper.Map<Bid>(model);
            objDTO.BidAmount = result[0].BidAmount + (result[0].BidAmount * 10) / 100;
            objDTO.BidDate = DateTime.Now;
            _context.Bids.Add(objDTO);
            await _context.SaveChangesAsync();
            _response.isSuccess = true;
            _response.Result = result;
            return _response;
        }

        public Task<ApiResponse> CancelBid(int bidId)
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse> CreateBid(CreateBidDto model)
        {
            var returnValue = await CheckIsActive(model.VehicleId);
            var isPaid = await CheckIsPaidAuction(model.UserId, model.VehicleId);
            //if (!isPaid)
            //{
            //    _response.isSuccess = false;
            //    _response.ErrorMessages.Add("Please before pay auction price");
            //    return _response;
            //}
            if (returnValue == null)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add("this car is not active");
                return _response; // Null kontrolünden sonra metodu sonlandır
            }
            if (returnValue.Price >= model.BidAmount)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add($"You should surpass the default price for this car {returnValue.Price}");
                return _response;
            }
            if (model != null)
            {
                var topPrice = await _context.Bids.Where(x => x.VehicleId == model.VehicleId).OrderByDescending(x => x.BidAmount).ToListAsync();
                if (topPrice.Count != 0)
                {
                    if (topPrice[0].BidAmount >= model.BidAmount && model.BidAmount < topPrice[0].BidAmount + (topPrice[0].BidAmount * 1) / 100)
                    {
                        _response.isSuccess = false;
                        _response.ErrorMessages.Add("Entry bid amount,not lower than higher price to the system; higher price is : " + topPrice[0].BidAmount);
                        return _response;
                    }
                }
                Bid bid = _mapper.Map<Bid>(model);
                bid.BidDate = DateTime.Now;
                await _context.Bids.AddAsync(bid);
                if (await _context.SaveChangesAsync() > 0)
                {
                    try {
                        // Safely get user details and send email if user exists
                        var userDetail = await _context.Bids.Include(x => x.User).Where(x => x.UserId == model.UserId).FirstOrDefaultAsync();
                        
                        // Only send email if user and username exist
                        if (userDetail?.User?.UserName != null) {
                            _mailService.SendEmail("Your bid is success", "Your bid is:" + bid.BidAmount, userDetail.User.UserName);
                        }
                    } catch (Exception ex) {
                        // Log the error but don't fail the bid creation
                        Console.WriteLine($"Error sending email: {ex.Message}");
                    }
                    
                    _response.isSuccess = true;
                    _response.Result = bid; // Return the actual bid object with ID
                    return _response;
                }

            }
            _response.isSuccess = false;
            _response.ErrorMessages.Add("Ooops! sometihng went wrong");
            return _response;
        }

        public async Task<ApiResponse> GetBidById(int bidId)
        {
            var result = await _context.Bids.Include(x => x.User).Where(x => x.BidId == bidId).FirstOrDefaultAsync();
            if (result == null)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add("bid is not found");
                return _response;
            }

            _response.isSuccess = true;
            _response.Result = result;
            return _response;
        }

        public async Task<ApiResponse> GetBidByVehicleId(int vehicleId)
        {
            var obj = await _context.Bids.Include(x => x.Vehicle).ThenInclude(x => x.Bids).Where(x => x.VehicleId == vehicleId).ToListAsync();
            if (obj != null)
            {
                _response.isSuccess = true;
                _response.Result = obj;
                return _response;
            }
            _response.isSuccess = false;
            return _response;
        }

        public async Task<ApiResponse> UpdateBid(int bidId, UpdateBidDto model)
        {  //Update eden kullanıcı en son verdiği teklifin üzerine çıkmalıdır.
            var isPaid = await CheckIsPaidAuction(model.UserId, model.VehicleId);
            if (!isPaid)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add("Please before pay auction price");
                return _response;
            }
            var result = await _context.Bids.FindAsync(bidId);
            if (result == null)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add("bid is not found");
                return _response;
            }
            if (result.BidAmount < model.BidAmount && result.UserId == model.UserId)
            {
                var objDTO = _mapper.Map(model, result);
                objDTO.BidDate = DateTime.Now;
                _response.isSuccess = true;
                _response.Result = objDTO;
                await _context.SaveChangesAsync();
                return _response;
            }
            else if (result.BidAmount >= model.BidAmount)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add("You are not entry low price than your old bid amount,your older bid amount is : " + result.BidAmount);
                return _response;
            }
            _response.isSuccess = false;
            _response.ErrorMessages.Add("Something went wrong");
            return _response;

        }

        private async Task<Vehicle> CheckIsActive(int vehicleId) //active control
        {
            var obj = await _context.Vehicles.Where(x => x.VehicleId == vehicleId && x.IsActive == true && x.EndTime >= DateTime.Now).FirstOrDefaultAsync();
            if (obj != null)
            {
                return obj;
            }
            return null;
        }
        private async Task<bool> CheckIsPaidAuction(string userId, int vehicleId)
        {
            var obj = await _context.PaymentHistories.Where(x => x.UserId == userId && x.VehicleId == vehicleId && x.IsActive == true).FirstOrDefaultAsync();
            if (obj != null)
            {
                return true;
            }
            return false;
        }

        public async Task<ApiResponse> GetAllBids()
        {
            try
            {
                var bids = await _context.Bids
                    .Include(b => b.User)
                    .OrderByDescending(b => b.BidDate)
                    .ToListAsync();

                if (bids == null || bids.Count == 0)
                {
                    _response.isSuccess = true;
                    _response.Result = new List<Bid>();
                    return _response;
                }

                var bidDtos = bids.Select(bid => new
                {
                    bid.BidId,
                    bid.BidAmount,
                    bid.BidDate,
                    bid.BidStatus,
                    bid.UserId,
                    bid.VehicleId,
                    UserName = bid.User != null ? bid.User.UserName : "Unknown"
                }).ToList();

                _response.isSuccess = true;
                _response.Result = bidDtos;
                return _response;
            }
            catch (Exception ex)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                return _response;
            }
        }
    }
}
