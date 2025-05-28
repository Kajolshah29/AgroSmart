# Agrichain Backend

This is the backend server for the Agrichain project.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agrichain
```

3. Make sure MongoDB is installed and running on your system.

4. Start the development server:
```bash
npm run dev
```

The server will start on port 5000 by default.

## API Endpoints

- GET `/`: Welcome message
- More endpoints will be added as the project develops

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv 