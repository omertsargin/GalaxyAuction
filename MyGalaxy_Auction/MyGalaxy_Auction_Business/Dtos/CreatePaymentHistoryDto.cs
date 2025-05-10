using MyGalaxy_Auction_DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Dtos
{
    public class CreatePaymentHistoryDto
    {
        public string ClientSecret { get; set; } //for security
        public string StripePaymentIntentId { get; set; } //for security
        public string UserId { get; set; }
        public int VehicleId { get; set; }
    }
}
