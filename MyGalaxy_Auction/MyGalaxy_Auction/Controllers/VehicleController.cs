using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyGalaxy_Auction_Business.Abstraction;
using MyGalaxy_Auction_Business.Dtos;
using MyGalaxy_Auction_Core.Models;
using Microsoft.EntityFrameworkCore;
using MyGalaxy_Auction_DataAccess.Context;
using System.Security.Claims;

namespace MyGalaxy_Auction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ApplicationDbContext _context;

        public VehicleController(IVehicleService vehicleService, IWebHostEnvironment webHostEnvironment, ApplicationDbContext context)
        {
            _vehicleService = vehicleService;
            _webHostEnvironment = webHostEnvironment;
            _context = context;
        }

        [HttpPost("CreateVehicle")]
        public async Task<IActionResult> AddVehicle(CreateVehicleDto model)
        {
            if (ModelState.IsValid)
            {
                if (model.File == null || model.File.Length == 0)
                {
                    return BadRequest();
                }

                string uploadsFolder = Path.Combine(_webHostEnvironment.ContentRootPath,"Images");
                string fileName = $"{Guid.NewGuid()}{Path.GetExtension(model.File.FileName)}";
                string filePath = Path.Combine(uploadsFolder, fileName);

                model.Image = $"/images/{fileName}";
                var result = await _vehicleService.CreateVehicle(model);
                if (result.isSuccess)
                {
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.File.CopyToAsync(fileStream);
                    }
                    return Ok(result);
                }
            }
            return BadRequest();
        }

        [HttpPost("AddVehicle")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> AddVehicleJson([FromBody] CreateVehicleJsonDto model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Get user ID from token
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(userId))
                    {
                        return Unauthorized();
                    }

                    // Create vehicle DTO
                    var vehicleDto = new CreateVehicleDto
                    {
                        BrandAndModel = model.BrandAndModel,
                        ManufacturingYear = model.ManufacturingYear,
                        Color = model.Color,
                        EngineCapacity = model.EngineCapacity,
                        Price = model.Price,
                        Millage = model.Millage,
                        PlateNumber = model.PlateNumber,
                        AuctionPrice = model.AuctionPrice,
                        AdditionalInformation = model.AdditionalInformation,
                        StartTime = model.StartTime,
                        EndTime = model.EndTime,
                        IsActive = model.IsActive,
                        SellerId = userId
                    };

                    // Process base64 image
                    if (!string.IsNullOrEmpty(model.Image))
                    {
                        // Extract base64 data
                        var base64Data = model.Image;
                        if (base64Data.Contains(","))
                        {
                            base64Data = base64Data.Substring(base64Data.IndexOf(",") + 1);
                        }

                        // Convert to bytes
                        byte[] imageBytes = Convert.FromBase64String(base64Data);

                        // Save image
                        string uploadsFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "Images");
                        Directory.CreateDirectory(uploadsFolder); // Ensure directory exists
                        
                        string fileName = $"{Guid.NewGuid()}.jpg";
                        string filePath = Path.Combine(uploadsFolder, fileName);

                        await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);
                        vehicleDto.Image = $"/images/{fileName}";
                    }
                    else
                    {
                        return BadRequest("Image is required");
                    }

                    // Create vehicle
                    var result = await _vehicleService.CreateVehicle(vehicleDto);
                    if (result.isSuccess)
                    {
                        return Ok(result);
                    }
                    
                    return BadRequest(result);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Error adding vehicle: {ex.Message}");
                }
            }
            
            return BadRequest(ModelState);
        }

        [HttpGet("GetVehicles")]
        public async Task<IActionResult> GetAllVehicles()
        {
            var vehicles = await _vehicleService.GetVehicles();
            return Ok(vehicles);
        }

        [HttpPut("UpdateVehicle")]
        public async Task<IActionResult> UpdateVehicle( int vehicleId, [FromForm] UpdateVehicleDto model)
        {
            if (ModelState.IsValid)
            {
                var result = await _vehicleService.UpdateVehicle(vehicleId,model);
                if (result.isSuccess)
                {
                    return Ok(result);
                }
            }
            return BadRequest();
        }

        [Authorize(Roles = "Adminastrator")]
        [HttpDelete("Remove/Vehicle/{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle([FromRoute] int vehicleId)
        {
            var result = await _vehicleService.DeleteVehicle(vehicleId);
            if (result.isSuccess)
            {
                return Ok(result);
            }
            return BadRequest();
        }
       
        [HttpGet("{vehicleId}")]
        public async Task<IActionResult> GetVehicleById([FromRoute] int vehicleId)
        {
            var result = await _vehicleService.GetVehicleById(vehicleId);
            if (result.isSuccess)
            {
                return Ok(result);
            }
            return BadRequest();
        }
       
        [HttpPut("{vehicleId}")]
        public async Task<IActionResult> ChangeStatus([FromRoute] int vehicleId)
        {
            var result = await _vehicleService.ChangeVehicleStatus(vehicleId);
            if (result.isSuccess)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpPost("UpdateExpiredAuctions")]
        public async Task<IActionResult> UpdateExpiredAuctions()
        {
            try
            {
                var now = DateTime.Now;
                
                // Süresi dolmuş ama hala aktif olan araçları bul
                var expiredVehicles = await _context.Vehicles
                    .Where(v => v.EndTime < now && v.IsActive)
                    .ToListAsync();

                if (expiredVehicles.Any())
                {
                    // Süresi dolmuş araçları pasif yap
                    foreach (var vehicle in expiredVehicles)
                    {
                        vehicle.IsActive = false;
                    }

                    // Değişiklikleri kaydet
                    await _context.SaveChangesAsync();

                    return Ok(new { 
                        message = $"{expiredVehicles.Count} adet süresi dolmuş açık artırma pasif duruma çevrildi.",
                        updatedVehicles = expiredVehicles.Select(v => new { v.VehicleId, v.BrandAndModel, v.EndTime })
                    });
                }
                
                return Ok(new { message = "Süresi dolmuş aktif açık artırma bulunamadı." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
