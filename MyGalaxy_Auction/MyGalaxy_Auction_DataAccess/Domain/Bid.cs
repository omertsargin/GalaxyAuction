using MyGalaxy_Auction_DataAccess.Enums;
using MyGalaxy_Auction_DataAccess.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_DataAccess.Domain
{
    public class Bid
    {
        [Key]
        public int BidId { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime BidDate { get; set; }
        public string BidStatus { get; set; }= MyGalaxy_Auction_DataAccess.Enums.BidStatus.Pending.ToString();
        public string UserId { get; set; }
        [JsonIgnore]
        public ApplicationUser User { get; set; }

        public int VehicleId { get; set; } //teklif tek bir aracı ilgilendirir.

        [JsonIgnore]
        public Vehicle Vehicle { get; set; }
        

    }
}
