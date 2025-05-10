using MyGalaxy_Auction_Business.Dtos;
using MyGalaxy_Auction_Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Abstraction
{
    public interface IBidService
    {
        Task<ApiResponse> CreateBid(CreateBidDto model);
        Task<ApiResponse> UpdateBid(int bidId, UpdateBidDto model);
        Task<ApiResponse> GetBidById(int bidId);
        Task<ApiResponse> CancelBid(int bidId);

        Task<ApiResponse> AutomaticallyCreateBid(CreateBidDto model);
        Task<ApiResponse> GetBidByVehicleId(int vehicleId);
        Task<ApiResponse> GetAllBids();
    }
}
