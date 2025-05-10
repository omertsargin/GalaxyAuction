using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyGalaxy_Auction_DataAccess.Context;
using MyGalaxy_Auction_DataAccess.Models;

namespace MyGalaxy_Auction.Extensions
{
    public static class PersistanceExtensionLayer
    {
        public static IServiceCollection AddPersistanceLayer(this IServiceCollection services, IConfiguration configuration) {
          
            #region Context
            services.AddDbContext<ApplicationDbContext>(options => { options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")); });
            
            // Özel şifre politikası yapılandırması
            services.AddIdentity<ApplicationUser, IdentityRole>(options => {
                // Şifre gereksinimleri
                options.Password.RequireDigit = true;              // Rakam gerektirir
                options.Password.RequireLowercase = true;          // Küçük harf gerektirir
                options.Password.RequireUppercase = true;          // Büyük harf gerektirir
                options.Password.RequireNonAlphanumeric = true;    // Özel karakter gerektirir
                options.Password.RequiredLength = 6;               // Minimum uzunluk
                options.Password.RequiredUniqueChars = 1;          // Minimum benzersiz karakter
                
                // Kullanıcı gereksinimleri
                options.User.RequireUniqueEmail = true;            // E-posta benzersiz olmalı
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+"; // İzin verilen karakterler
            })
            .AddEntityFrameworkStores<ApplicationDbContext>();
            #endregion 
            return services;
        }
    }
}
