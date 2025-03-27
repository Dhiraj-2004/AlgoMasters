## Features

- **User Signup & Login**: Users can sign up with their details (email, password, etc.) and login to their accounts.
- **Fetch LeetCode, CodeChef and CodeForces User Data**: Fetch user statistics such as submission count, rank, and more.
- **Rank Updates**: Users can update their competitive programming platform ranks (LeetCode, Codeforces, Codechef).
- **Forgot Password & OTP**: Forgot password functionality with OTP-based verification.
- **Platform Username Management**: Users can insert or update usernames for platforms like LeetCode, Codeforces, and Codechef.
- **User Data**: Retrieve user data, including name, email, and platform usernames.
- **College-specific Ranking**: Get the rank comparison among users within the same college for different platforms.
- **Graphs & Visualizations**: Display user’s rating history and rankings within their department and college.
- **Export Data**: Functionality to export user data in Excel format.
- **AMCAT Results**: Integration of AMCAT result data for performance tracking.

## Tech Stack

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (Database)
  - JSON Web Tokens (JWT) for authentication
  - bcryptjs for password hashing
  - GraphQL for fetching user data from LeetCode
  - Nodemailer (for OTP-based password reset)
  - dotenv (for managing environment variables)

