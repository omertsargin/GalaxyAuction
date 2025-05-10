using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyGalaxy_Auction_Business.Abstraction;
using MyGalaxy_Auction_Business.Dtos;
using MyGalaxy_Auction_Core.Models;

using MyGalaxy_Auction_DataAccess.Context;
using MyGalaxy_Auction_DataAccess.Enums;
using MyGalaxy_Auction_DataAccess.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MyGalaxy_Auction_Business.Concrete
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ApiResponse _response;
        private readonly UserManager<ApplicationUser> _userManager;//IDENTITYden alınır
        private readonly RoleManager<IdentityRole> _roleManager;//IDENTITYden alınır
        private string secretKey;//for creating jwt token.if user login the system,token reaching him.
        public UserService(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, ApiResponse response, IMapper mapper, IConfiguration _configuration, ApplicationDbContext context)
        {// sınıfın her bir parçasını kullanabilmek için gerekli nesneleri burada alıyoruz
            _userManager = userManager;
            _response = response;
            _mapper = mapper;
            _context = context;
            _roleManager = roleManager;
            secretKey = _configuration.GetValue<string>("SecretKey:jwtKey");

        }

        public async Task<ApiResponse> Login(LoginRequestDto model)
        {
            ApplicationUser userFromDb = _context.ApplicationUsers.FirstOrDefault(u => u.UserName.ToLower() == model.UserName.ToLower());
            if (userFromDb != null)
            {
                bool isValid = await _userManager.CheckPasswordAsync(userFromDb, model.Password);//password security
                if (!isValid)
                {
                    _response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                    _response.ErrorMessages.Add("Your entry information is not correct");
                    _response.isSuccess = false;
                    return _response;
                }
                var role = await _userManager.GetRolesAsync(userFromDb);
                JwtSecurityTokenHandler tokenHandler = new();
                byte[] key = Encoding.ASCII.GetBytes(secretKey);

                SecurityTokenDescriptor tokenDescriptor = new() //bu metod,JWT'nin içeriğini belirler ve nasıl imzalanacağını tanımlar.
                {
                    Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]//token'ın "kimin" adına oluşturulduğunu belirten bilgileri içerir. 
                    {
                        new Claim(ClaimTypes.NameIdentifier, userFromDb.Id),
                        new Claim(ClaimTypes.Email, userFromDb.Email),
                        new Claim(ClaimTypes.Role, role.FirstOrDefault() == null ? "NormalUser" : role.FirstOrDefault()),
                        new Claim("fullName", userFromDb.FullName)
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                    //Token'ı imzalayan bir anahtar gereklidir. SigningCredentials, token'ı güvence altına almak ve doğrulamak için kullanılan imzalama bilgilerini içerir.       
                    //kullanılan algoritma token'ı şifreli bir şekilde imzalamak için güvenli bir yöntemdir.  
                };
                //JWT (JSON Web Token) oluşturuluyor.
                SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);//JWT'nin oluşturulup sonuca eklenmesi ve istemciye yanıt olarak gönderilmesi işlemlerini yapmaktadır.

                LoginResponseModel _model = new()
                {
                    Email = userFromDb.Email,
                    Token = tokenHandler.WriteToken(token),//JWT, genellikle 3 parçadan oluşan (header, payload, signature) bir dizedir. 
                                                           //Bu metod, token'ı istemciye gönderilebilecek şekilde birleştirir ve STRİNG hale getirir.
                };
                _response.Result = _model;
                _response.isSuccess = true;
                _response.StatusCode = System.Net.HttpStatusCode.OK;
                return _response;

            }
            _response.isSuccess = false;
            _response.ErrorMessages.Add("Ooops! something went wrong");
            return _response;// istemciye JWT token ve kullanıcının e-posta adresi gibi bilgileri içeren bir yanıt

        }

      

        public async Task<ApiResponse> Register(RegisterRequestDto model)
        {
            var userFromDb = _context.ApplicationUsers.FirstOrDefault(x => x.UserName.ToLower() == model.UserName.ToLower());
            if (userFromDb != null)
            {
                _response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                _response.isSuccess = false;
                _response.ErrorMessages.Add("Username already exist");
                return _response;
            }

            //var newUser = _mapper.Map<ApplicationUser>(model);  

            ApplicationUser newUser = new()
            {
                FullName = model.FullName,
                UserName = model.UserName,
                NormalizedEmail = model.UserName.ToUpper(),
                Email = model.UserName,
                DateOfBirth = model.DateOfBirth ?? DateTime.MinValue // Eğer null ise varsayılan değer
            };

            var result = await _userManager.CreateAsync(newUser, model.Password);
            if (result.Succeeded)
            {
                var isTrue = _roleManager.RoleExistsAsync(UserType.Adminastrator.ToString()).GetAwaiter().GetResult();
                if (!_roleManager.RoleExistsAsync(UserType.Adminastrator.ToString()).GetAwaiter().GetResult())
                {
                    await _roleManager.CreateAsync(new IdentityRole(UserType.Adminastrator.ToString()));
                    await _roleManager.CreateAsync(new IdentityRole(UserType.Seller.ToString()));
                    await _roleManager.CreateAsync(new IdentityRole(UserType.NormalUser.ToString()));
                }
                if (model.UserType.ToString().ToLower() == UserType.Adminastrator.ToString().ToLower())
                {
                    await _userManager.AddToRoleAsync(newUser, UserType.Adminastrator.ToString());
                }
                if (model.UserType.ToString().ToLower() == UserType.Seller.ToString().ToLower())
                {
                    await _userManager.AddToRoleAsync(newUser, UserType.Seller.ToString());
                }
                else if (model.UserType.ToString().ToLower() == UserType.NormalUser.ToString().ToLower())
                {
                    await _userManager.AddToRoleAsync(newUser, UserType.NormalUser.ToString());
                }
                _response.StatusCode = System.Net.HttpStatusCode.Created;
                _response.isSuccess = true;
                return _response;
            }
            foreach (var error in result.Errors)
            {
                _response.ErrorMessages.Add(error.ToString());
            }
            return _response;

        }

        public async Task<ApiResponse> UpdateProfile(UpdateProfileDto model)
        {
            // Find user by ID
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                _response.StatusCode = System.Net.HttpStatusCode.NotFound;
                _response.isSuccess = false;
                _response.ErrorMessages.Add("User not found");
                return _response;
            }

            // Validate current password if user wants to change password
            if (!string.IsNullOrEmpty(model.NewPassword))
            {
                if (string.IsNullOrEmpty(model.CurrentPassword))
                {
                    _response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                    _response.isSuccess = false;
                    _response.ErrorMessages.Add("Current password is required to change password");
                    return _response;
                }

                // Verify current password
                bool isValidPassword = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
                if (!isValidPassword)
                {
                    _response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                    _response.isSuccess = false;
                    _response.ErrorMessages.Add("Current password is incorrect");
                    return _response;
                }

                // Change password
                var changePasswordResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
                if (!changePasswordResult.Succeeded)
                {
                    _response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                    _response.isSuccess = false;
                    foreach (var error in changePasswordResult.Errors)
                    {
                        _response.ErrorMessages.Add(error.Description);
                    }
                    return _response;
                }
            }

            // Update user information
            user.FullName = model.FullName;
            if (!string.IsNullOrEmpty(model.UserName) && user.UserName != model.UserName)
            {
                // Check if username already exists
                var existingUser = await _userManager.FindByNameAsync(model.UserName);
                if (existingUser != null && existingUser.Id != user.Id)
                {
                    _response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                    _response.isSuccess = false;
                    _response.ErrorMessages.Add("Username already exists");
                    return _response;
                }

                user.UserName = model.UserName;
                user.NormalizedUserName = model.UserName.ToUpper();
            }

            // Update DateOfBirth if provided
            if (model.DateOfBirth.HasValue)
            {
                user.DateOfBirth = model.DateOfBirth.Value;
            }

            // Save user changes
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                _response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                _response.isSuccess = false;
                foreach (var error in updateResult.Errors)
                {
                    _response.ErrorMessages.Add(error.Description);
                }
                return _response;
            }

            _response.StatusCode = System.Net.HttpStatusCode.OK;
            _response.isSuccess = true;
            _response.Result = new { message = "Profile updated successfully" };
            return _response;
        }

    }
}