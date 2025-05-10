using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyGalaxy_Auction_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class PaymentHistoryConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClientSecret",
                table: "PaymentHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StripePaymentIntentId",
                table: "PaymentHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8646), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8622) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 2,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 2, 18, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8656), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8656) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 3,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8660), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8659) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 4,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8708), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8708) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 5,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8712), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8712) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 6,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8716), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8716) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 7,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8720), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8719) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 8,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8723), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8722) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 9,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8726), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8725) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 10,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8729), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8728) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 11,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8733), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8732) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 12,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8736), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8735) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 13,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8739), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8738) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 14,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8742), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8741) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 15,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8745), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8745) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 16,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8748), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8748) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 17,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8753), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8752) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 18,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8759), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8759) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 19,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8763), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8762) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 20,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 4, 7, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8766), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8765) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 21,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 14, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8769), new DateTime(2025, 1, 25, 14, 3, 16, 552, DateTimeKind.Local).AddTicks(8768) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientSecret",
                table: "PaymentHistories");

            migrationBuilder.DropColumn(
                name: "StripePaymentIntentId",
                table: "PaymentHistories");

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(441), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(431) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 2,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 2, 11, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(453), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(453) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 3,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(456), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(455) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 4,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(458), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(458) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 5,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(461), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(461) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 6,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(464), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(464) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 7,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(466), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(466) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 8,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(469), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(469) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 9,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(583), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(582) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 10,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(587), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(586) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 11,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(589), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(589) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 12,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(592), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(591) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 13,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(594), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(594) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 14,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(597), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(596) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 15,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(601), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(601) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 16,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(604), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(604) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 17,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(607), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(606) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 18,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(609), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(609) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 19,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(612), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(611) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 20,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 31, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(614), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(614) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "VehicleId",
                keyValue: 21,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 3, 7, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(617), new DateTime(2025, 1, 18, 14, 44, 47, 361, DateTimeKind.Local).AddTicks(617) });
        }
    }
}
