# AlgoMasters

AlgoMasters is a web platform that integrates APIs from LeetCode, CodeChef, and CodeForces to provide users with a centralized dashboard for tracking coding progress, solved problems, contest schedules, user ratings, and college rankings.

## Features

- **Integrated Coding Platforms**: Fetches data from LeetCode, CodeChef, and CodeForces APIs.
- **Coding Progress Tracking**: Displays solved problems, submissions, and performance history.
- **Contest Schedules**: Provides a real-time schedule of upcoming contests across platforms.
- **User Ratings & Rankings**: Tracks individual user ratings and college rankings.
- **Performance Dashboard**: Visual insights into problem-solving progress and competition stats.

## Tech Stack

- **Frontend**: ReactJS, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: LeetCode, CodeChef, CodeForces
- **Deployment**: Vercel (Frontend), Render/DigitalOcean (Backend)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/algomasters.git
   cd algomasters
   ```

2. Set up environment variables:
   Create a `.env` file in the root and add necessary API keys and configurations.

3. Start the application:
   ```sh
   npm run dev
   ```

## API Endpoints
- `POST /api/login` - User login
- `POST /api/signup` - User signup
- `POST /api/insertuser` - Insert usernames (protected)
- `POST /api/changePassword` - Change password via OTP verification
- `PUT /api/rank` - Update user rank (protected)
- `PUT /api/updateUser` - Update usernames (protected)
- `GET /api/userdata` - Get user data (protected)
- `GET /api/leetcode/:username` - Fetch LeetCode profile data
- `GET /api/chefuser` - Get CodeChef username (protected)
- `GET /api/forcesuser` - Get CodeForces username (protected)
- `GET /api/leetuser` - Get LeetCode username (protected)
- `GET /api/college-rank/:username/:college` - Fetch user rank in college (protected)

## Contributing
Pull requests are welcome. For major changes, open an issue first to discuss the proposed updates.

## License
This project is licensed under the MIT License.
