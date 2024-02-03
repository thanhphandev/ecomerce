# API DOCUMENTATION
*Base Url: http://localhost:${PORT}*
## Route Auth

### Signup
- **Method:** POST
- **URL:** `/v1/auth/signup`
- **Parameters:**
  - `username`: User name
  - `password`: Password
  - `email`: Email user
  - `phone`: (optional): Phone user
  
----
## Login
- **Method:** POST
- **URL:** `/v1/auth/login`
- **Parameters:**
  - `username`: Username
  - `password`: Password

----
## Refresh Token
- **Method:** GET
- **URL:** `/v1/auth/refresh`
- **Cookies:**
  - `refresh_token`: Refresh Token System Generate

----
## Log Out
- **Method:** GET
- **URL:** `/v1/auth/logout`
- **Cookies:**
  - `refresh_token`: Refresh Token System Generate

----
## Forgot password
- **Method:** POST
- **URL:** `/v1/auth/forgot-password`
- **Parameters:**
  - `email`: Email User

----
## Resend OTP
- **Method:** POST
- **URL:** `/v1/auth/resend_otp`
- **Parameters:**
  - `email`: Email User

----
## reset-password
- **Method:** POST
- **URL:** `/v1/auth/reset-password`
- **Parameters:**
  - `email`: Email User
  - `otp`: OTP is sent via email
  - `password`: New Password

----
