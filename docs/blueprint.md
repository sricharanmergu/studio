# **App Name**: LivenessID

## Core Features:

- Phone Number Input: Phone number input with E.164 format validation and 'Send OTP' button.
- Send OTP: Call to Send OTP API (POST https://flashback.inc:9000/api/mobile/sendOTP) with error handling (invalid phone, rate-limit).
- OTP Input: OTP input screen with 6-digit entry and 'Verify' button.
- Verify OTP: Call to Verify OTP API (POST https://flashback.inc:9000/api/mobile/verifyOTP) with error handling (invalid/expired OTP).
- Liveness Check: On-device liveness check using the front camera; no gallery import allowed.
- Selfie Capture: Capture selfie image after successful liveness check.
- Upload Selfie: Upload captured selfie to Upload Selfie API (POST https://flashback.inc:9000/api/mobile/uploadUserPortrait).

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent trust and security, reflecting the app's purpose of identity verification.
- Background color: A light, desaturated blue (#E5F6FD), complementing the primary color and ensuring readability.
- Accent color: An analogous cyan (#29E2D1) for interactive elements and highlights.
- Body and headline font: 'Inter', sans-serif, for a clean and modern user interface that ensures readability across all screen resolutions.
- Use a set of consistent, professional icons to represent actions and states, such as sending OTP, verifying, or camera access.
- Responsive layout that adapts to different screen sizes, ensuring a consistent experience across devices.
- Subtle animations and transitions to provide feedback to user interactions and guide them through the verification process.