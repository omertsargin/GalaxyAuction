using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyGalaxy_Auction_Business.Abstraction;
using MyGalaxy_Auction_Business.Dtos;

namespace MyGalaxy_Auction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }
        [HttpPost("Register")]
        public async Task<IActionResult> CreateUser([FromBody] RegisterRequestDto model)
        {
            var response = await _userService.Register(model);
            if (response.isSuccess)
            {
                return Ok(response);

            }
            return BadRequest(response);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginRequestDto model)
        {
            var response = await _userService.Login(model);
            if (response.isSuccess)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPost("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto model)
        {
            var response = await _userService.UpdateProfile(model);
            if (response.isSuccess)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
