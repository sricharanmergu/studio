'use server';

// This file simulates API calls as described in the hackathon prompt.
// In a real application, these would be actual fetch requests to a backend.

// Simulates a delay to mimic network latency.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ActionResult {
  success: boolean;
  error?: string;
  token?: string;
  imageUrl?: string;
}

export async function sendOtp(phoneNumber: string): Promise<ActionResult> {
  if (!/^\+91[6-9]\d{9}$/.test(phoneNumber)) {
    return { success: false, error: 'Invalid phone number format. Please use E.164 format (e.g., +91XXXXXXXXXX).' };
  }

  console.log(`Sending OTP to ${phoneNumber} via POST https://flashback.inc:9000/api/mobile/sendOTP`);

  try {
    // This is a placeholder for a real refresh token you would have after a user logs in.
    const refreshToken = 'your-refresh-token-if-available';
    
    const response = await fetch('https://flashback.inc:9000/api/mobile/sendOTP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (response.ok) {
      console.log('Successfully sent OTP.');
      return { success: true };
    } else {
      // Try to parse error response, but have a fallback.
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || 'Failed to send OTP from API.';
      } catch (e) {
        // The response body was not valid JSON.
        console.error('Could not parse error response from API.');
      }
      console.error('API Error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('An unexpected error occurred while sending the OTP:', error);
    // This will catch network errors (e.g., DNS resolution, unreachable server).
    const errorMessage = 'Could not connect to the authentication service. Please check your network connection and try again.';
    return { success: false, error: errorMessage };
  }
}


export async function verifyOtp(phoneNumber: string, otp: string): Promise<ActionResult> {
  await delay(1500);

  console.log(`Simulating verifying OTP ${otp} for ${phoneNumber}`);
  
  // The prompt doesn't specify an OTP, so we'll use a hardcoded one for simulation.
  if (otp === '123456') {
    // In a real scenario, the API would return a JWT.
    const fakeJwt = `fake-jwt-for-${phoneNumber}-${Date.now()}`;
    return { success: true, token: fakeJwt };
  } else {
    return { success: false, error: 'Invalid or expired OTP. Please try again.' };
  }
}

export async function uploadSelfie(phoneNumber: string, image: string, token: string): Promise<ActionResult> {
    await delay(2000);

    console.log(`Simulating uploading selfie for ${phoneNumber} with token ${token}`);

    if (!token.startsWith('fake-jwt-for-')) {
        return { success: false, error: 'Invalid authentication token.' };
    }

    if (!image.startsWith('data:image/jpeg;base64,')) {
        return { success: false, error: 'Invalid image data.' };
    }

    // In a real scenario, you would upload the file. Here, we just return a placeholder.
    // The placeholder dimensions are based on a typical selfie aspect ratio.
    const imageUrl = 'https://placehold.co/480x640.png';

    return { success: true, imageUrl };
}
