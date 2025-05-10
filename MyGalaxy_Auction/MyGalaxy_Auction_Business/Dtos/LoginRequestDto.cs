using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Dtos
{
    public class LoginRequestDto //only neccesary datas
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
