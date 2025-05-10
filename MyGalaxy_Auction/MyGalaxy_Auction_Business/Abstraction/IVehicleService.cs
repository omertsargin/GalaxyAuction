using MyGalaxy_Auction_Business.Dtos;
using MyGalaxy_Auction_Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Abstraction
{
   public interface IVehicleService
    {
        Task<ApiResponse> CreateVehicle(CreateVehicleDto model);
        Task<ApiResponse> GetVehicles();

        Task<ApiResponse> UpdateVehicle(int vehicleId,UpdateVehicleDto model);

        Task<ApiResponse> DeleteVehicle(int vehicleId);

        Task<ApiResponse> GetVehicleById(int vehicleId);
        Task<ApiResponse> ChangeVehicleStatus(int vehicleId);
    }
}
