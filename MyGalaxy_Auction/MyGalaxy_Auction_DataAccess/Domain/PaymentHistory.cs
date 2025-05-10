using MyGalaxy_Auction_DataAccess.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_DataAccess.Domain
{
    public class PaymentHistory
    {
        [Key]
        public int PaymentId { get; set; }

        public bool IsActive { get; set; }

        public DateTime PayDate { get; set; }
        public string UserId { get; set; }

        public string ClientSecret { get; set; } //for security
        public string StripePaymentIntentId { get; set; } //for security
        public ApplicationUser User { get; set; }
        public int VehicleId { get; set; }

        public Vehicle Vehicle { get; set; }
    }
}
