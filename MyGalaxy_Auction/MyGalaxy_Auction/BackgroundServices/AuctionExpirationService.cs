using Microsoft.EntityFrameworkCore;
using MyGalaxy_Auction_DataAccess.Context;

namespace MyGalaxy_Auction.BackgroundServices
{
    public class AuctionExpirationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AuctionExpirationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1); // 1 dakikada bir kontrol et

        public AuctionExpirationService(
            IServiceProvider serviceProvider,
            ILogger<AuctionExpirationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Açık artırma süre dolum servisi başlatıldı...");

            // Servis başlar başlamaz ilk kontrolü yap
            await CheckAndUpdateExpiredAuctions();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(_checkInterval, stoppingToken); // Önce bekle, sonra kontrol et
                    await CheckAndUpdateExpiredAuctions();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Süresi dolmuş açık artırmalar kontrol edilirken hata oluştu");
                }
            }
        }

        private async Task CheckAndUpdateExpiredAuctions()
        {
            _logger.LogInformation("Süresi dolmuş açık artırmalar kontrol ediliyor...");

            // Scoped servis oluştur (DbContext)
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var now = DateTime.Now;

            // Süresi dolmuş ama hala aktif olan araçları bul
            var expiredVehicles = await dbContext.Vehicles
                .Where(v => v.EndTime < now && v.IsActive)
                .ToListAsync();

            if (expiredVehicles.Any())
            {
                _logger.LogInformation($"{expiredVehicles.Count} adet süresi dolmuş açık artırma bulundu. Pasif duruma çeviriliyor...");

                // Süresi dolmuş araçları pasif yap
                foreach (var vehicle in expiredVehicles)
                {
                    vehicle.IsActive = false;
                }

                // Değişiklikleri kaydet
                await dbContext.SaveChangesAsync();

                _logger.LogInformation($"{expiredVehicles.Count} adet açık artırma pasif duruma çevrildi.");
            }
            else
            {
                _logger.LogInformation("Süresi dolmuş aktif açık artırma bulunamadı.");
            }
        }
    }
} 