using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyGalaxy_Auction_Business.Abstraction;
using MyGalaxy_Auction_Business.Dtos;
using MyGalaxy_Auction_Core.Models;
using MyGalaxy_Auction_DataAccess.Context;
using MyGalaxy_Auction_DataAccess.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Concrete
{
    public class PaymentHistoryService : IPaymentHistoryService
    {
        private readonly ApiResponse _response;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public PaymentHistoryService(ApiResponse response, ApplicationDbContext context, IMapper mapper)
        {
            _response = response;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse> CheckIsStatusForAuction(string userId, int vehicleId)
        {
            var response = await _context.PaymentHistories.Where(x => x.UserId == userId && x.VehicleId==vehicleId && x.IsActive == true).FirstOrDefaultAsync();
            if (response != null) { 
            
            _response.isSuccess = true;
            _response.Result = response;
                return _response;
            
            }
            _response.isSuccess =false;
            return _response;
        
        }

        public async Task<ApiResponse> CreatePaymentHistory(CreatePaymentHistoryDto model)
        {
            if (model == null)
            {
                _response.isSuccess = false;
                _response.ErrorMessages.Add("Model is not include some fields");
                return _response;
            }
            else
            {
                var objDto = _mapper.Map<PaymentHistory>(model);
                objDto.PayDate = DateTime.Now;
                objDto.IsActive = true;
                if (await _context.SaveChangesAsync() > 0)
                {
                    _response.isSuccess = true;
                    _response.Result = model;
                    return _response;
                }
                _response.isSuccess=false;
                _response.ErrorMessages.Add("OOppss!Something went wrong!");
                return _response;
            }
        }
    }
}
