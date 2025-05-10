using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Dtos
{
    public class RegisterRequestDto
    {
        public string UserName { get; set; }
        public string FullName  { get; set; }

        public string Password { get; set; }

        public string UserType { get; set; }

        public DateTime? DateOfBirth { get; set; }
    }
}
