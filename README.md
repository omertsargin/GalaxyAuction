# MyGalaxy Auction - Full Stack Auction Platform

MyGalaxy Auction is a comprehensive online auction platform for vehicles, built with React.js frontend and .NET backend. This full-stack application provides a complete solution for hosting vehicle auctions with real-time bidding capabilities.

![MyGalaxy Auction Platform](my-ts-app/src/Images/2022-mercedes-maybach-s680-1068x601.jpg)

## Features

- **User Authentication**: Secure registration and login system with JWT authentication
- **Role-Based Access**: Different capabilities for buyers and sellers
- **Vehicle Management**: Sellers can add, edit, and list vehicles for auction
- **Real-Time Bidding**: Users can place bids on active auctions
- **Auction Expiration**: Automated system to mark auctions as inactive when they expire
- **Profile Management**: Users can update their information and change passwords
- **Responsive Design**: Optimized for both desktop and mobile viewing

## Tech Stack

### Frontend
- **Framework**: React.js with TypeScript
- **State Management**: Redux with RTK Query
- **Styling**: Bootstrap and custom CSS
- **Routing**: React Router

*The frontend UI components and layout were enhanced with AI assistance to ensure a responsive, visually appealing design with accessibility and best practices implementation.*

### Backend
- **Framework**: .NET Core Web API
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQL Server with Entity Framework Core
- **Architecture**: Clean Architecture with Repository Pattern
- **Background Services**: For auction expiration handling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- .NET 8.0 SDK
- SQL Server (local or remote)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/MyGalaxy_Auction_FullStack.git
   cd MyGalaxy_Auction_FullStack
   ```

2. **Backend Setup**
   ```bash
   cd MyGalaxy_Auction
   dotnet restore
   dotnet run
   ```
   The API will be available at http://localhost:5224

3. **Frontend Setup**
   ```bash
   cd my-ts-app
   npm install
   npm start
   ```
   The application will be available at http://localhost:3000

## Usage

1. Register as a user and choose your role (buyer or seller)
2. If you're a seller, you can add vehicles for auction through the "Araç Ekle" section
3. Buyers can browse active auctions and place bids
4. Users can track their bids in the "My Bids" section
5. Manage your profile in the "Profile" section

## Project Structure

- `my-ts-app/` - React frontend application
- `MyGalaxy_Auction/` - .NET backend application
  - `MyGalaxy_Auction/` - Main API project
  - `MyGalaxy_Auction_Business/` - Business logic layer
  - `MyGalaxy_Auction_Core/` - Core domain models
  - `MyGalaxy_Auction_DataAccess/` - Database and repository implementations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
