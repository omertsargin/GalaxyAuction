using AutoMapper;
using MyGalaxy_Auction_Business.Dtos;
using MyGalaxy_Auction_DataAccess.Domain;
using MyGalaxy_Auction_DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateVehicleDto,Vehicle>().ReverseMap();
            CreateMap<UpdateVehicleDto,Vehicle>().ReverseMap();
            CreateMap<CreateBidDto,Bid>().ReverseMap();
            CreateMap<UpdateBidDto, Bid>().ReverseMap();
            CreateMap<CreatePaymentHistoryDto,PaymentHistory>().ReverseMap();

        }
    }
}
