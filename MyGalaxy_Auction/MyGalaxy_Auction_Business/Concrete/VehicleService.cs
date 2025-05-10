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
    public class VehicleService : IVehicleService
    {
        private readonly ApplicationDbContext _context;//for database crud operations
        private readonly IMapper _mapper;
        private ApiResponse _response;

        public VehicleService(ApplicationDbContext context, ApiResponse response, IMapper mapper)
        {
            _response = response;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse> ChangeVehicleStatus(int vehicleId)
        {
            var result=await _context.Vehicles.FindAsync(vehicleId);
            if (result == null)
            {
                _response.isSuccess = false;
                return _response;
            }
            result.IsActive = false;
            _response.isSuccess = true;
            await _context.SaveChangesAsync();
            return _response;

        }

        public async Task<ApiResponse> CreateVehicle(CreateVehicleDto model)
        {
            if (model != null)
            {
                var objDto = _mapper.Map<Vehicle>(model); //modeli çözme
                if (objDto != null)
                {
                    _context.Vehicles.Add(objDto);
                    if (await _context.SaveChangesAsync() > 0)
                    {
                        _response.isSuccess = true;
                        _response.Result = model;
                        _response.StatusCode = System.Net.HttpStatusCode.Created;
                        return _response;
                    }
                }

            }

            _response.isSuccess = false;
            _response.ErrorMessages.Add("uuups!Something went wrong");
            return _response;
        }

        public async Task<ApiResponse> DeleteVehicle(int vehicleId)
        {
            var result = await _context.Vehicles.FindAsync(vehicleId);
            if (result != null)
            {
                _context.Vehicles.Remove(result);
                if (await _context.SaveChangesAsync() > 0)
                {
                    _response.isSuccess = true;
                    return _response;

                }

            }
            _response.isSuccess = false;
            return _response;

        }

        public async Task<ApiResponse> GetVehicleById(int vehicleId)
        {
            var result = await _context.Vehicles.Include(x => x.Seller).FirstOrDefaultAsync(x => x.VehicleId == vehicleId);
            if (result != null)
            {
                _response.Result = result;
                _response.isSuccess = true;
                return _response;
            }
            _response.isSuccess = false;
            return _response;
        }

        public async Task<ApiResponse> GetVehicles()
        {
            var vehicle = await _context.Vehicles.Include(x => x.Seller).ToListAsync();
            if (vehicle != null)
            {
                _response.isSuccess = true;
                _response.Result = vehicle;
                return _response;
            }
            _response.isSuccess = false;
            return _response;

        }


        public async Task<ApiResponse> UpdateVehicle(int vehicleId, UpdateVehicleDto model)
        {
            var result = await _context.Vehicles.FindAsync(vehicleId);
            if (result != null)
            {
                Vehicle objDto=_mapper.Map(model,result);
                if(await _context.SaveChangesAsync() > 0)
                {
                    _response.isSuccess=true;
                    _response.Result = objDto;
                    return _response;
                }
            }
            _response.isSuccess=false;
            return _response;
        }
    }
}
