# Mulyo Dashboard - A companion project for Mulyo API

## Description
A dashboard created to manage and visualize data from the Mulyo API. The project aims to provide a simple yet good enough interface for using the Mulyo API.

## Features
- Password based admin login
- Create new series
- Edit existing series
- Upload chapters
- Edit existing chapters
- Edit existing chapters

# Setup

## Installation
1. Clone the repository: `https://github.com/AeolusDev/Mulyo-Dasboard.git` or `gh repo clone AeolusDev/Mulyo-Dasboard`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open the dashboard in your browser: http://localhost:3000 and done!

## Additional Steps
You can create an admin user by enabling the `/admin/create` endpoint from authRoutes.js.
After creating a user with something like this:
```terminal
curl -X POST http://localhost:8888/api/auth/admin/create -H "Content-Type: application/json, authorization: <token>" -d '{"email": "admin@example.com", "password": "password"}'
```

**Note:** Do not forget to create an auth token with the `/jwt` endpoint.

# Contact
You can reach me at [aeolusdeveloper@gmail.com](mailto:aeolusdeveloper@gmail.com) or Discord: `captaincool6333`
It'll be better to contact me via Discord.