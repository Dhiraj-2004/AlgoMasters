
## Features

- **User Signup & Login**: Users can sign up with their details (email, password, etc.) and login to their accounts.
- **Fetch LeetCode, CodeChef and CodeForces User Data**: Fetch user statistics such as submission count, rank, and more .
- **Rank Updates**: Users can update their competitive programming platform ranks (LeetCode, Codeforces, Codechef).
- **Forgot Password & OTP**: Forgot password functionality with OTP-based verification.
- **Platform Username Management**: Users can insert or update usernames for platforms like LeetCode, Codeforces, and Codechef.
- **User Data**: Retrieve user data, including name, email, and platform usernames.
- **College-specific Ranking**: Get the rank comparison among users within the same college for different platforms.

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

## API Endpoints

### User Authentication

- **POST /api/user/login**: Login a user with email and password.
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

- **POST /api/user/signup**: Sign up a new user.
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "user@example.com",
      "password": "password123",
      "college": "ABC University",
      "year": "2"
    }
    ```

- **POST /api/user/forgotPass**: Send OTP for password reset.
  - Request Body:
    ```json
    {
      "email": "user@example.com"
    }
    ```

- **PUT /api/user/resetPass**: Reset the password using the reset token.
  - Request Body:
    ```json
    {
      "resetToken": "reset_token_here",
      "newPassword": "newpassword123"
    }
    ```

- **PUT /api/user/changePassword**: Verify OTP and change password.
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "otp": "123456",
      "newPassword": "newpassword123"
    }
    ```

### User Data & Rank Management

- **GET /api/user/leetcode/:username**: Fetch LeetCode user statistics using GraphQL.
  
- **GET /api/user/userdata**: Get the authenticated user's data.
  
- **GET /api/user/chefuser**: Get the authenticated user's CodeChef username.
  
- **GET /api/user/forcesuser**: Get the authenticated user's Codeforces username.
  
- **GET /api/user/leetuser**: Get the authenticated user's LeetCode username.

- **GET /api/user/college-rank/:username/:college**: Get the rank comparison for a user within their college for multiple platforms.

### Platform Username Management

- **POST /api/user/insertuser**: Insert usernames for LeetCode, Codeforces, and Codechef for the logged-in user.
  - Request Body:
    ```json
    {
      "leetcodeUsername": "user_123",
      "codeforcesUsername": "cf_user",
      "codechefUsername": "cc_user"
    }
    ```

- **PUT /api/user/updateUser**: Update usernames and other user details.
  - Request Body:
    ```json
    {
      "leetcodeUsername": "new_leetcode_user",
      "codeforcesUsername": "new_cf_user",
      "codechefUsername": "new_cc_user",
      "name": "Updated Name"
    }
    ```
