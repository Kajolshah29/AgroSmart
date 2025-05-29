# AgroSmart Platform

A modern agricultural marketplace platform connecting farmers and buyers.

## Project Structure

```
agrosmart/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── data/         # Static data and constants
│   │   └── lib/          # Utility functions and helpers
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── backend/              # Express.js backend application
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads directory
│   └── package.json     # Backend dependencies
│
└── README.md            # Project documentation
```

## Features

- User authentication (Farmers and Buyers)
- Profile management
- Product listing and management
- Real-time messaging
- Location-based search
- File uploads for product images

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Context for state management
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agrosmart.git
cd agrosmart
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the development servers:

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 