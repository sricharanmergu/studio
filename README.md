# LivenessID - OTP Login + Liveness Check + Selfie Upload

This project is a Next.js web application built for a hackathon. It demonstrates a multi-step user verification flow that includes phone number OTP verification, a simulated on-device liveness check, and a selfie upload.

## Objective

Build an application that allows a user to:
1.  Enter their mobile number and request an OTP.
2.  Verify the OTP.
3.  Perform an on-device liveness check with the front camera.
4.  Capture and upload a selfie.
5.  View a final welcome screen with their details.

## App Architecture

The application is built using modern web technologies, designed to be robust, scalable, and maintainable.

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS with ShadCN UI components for a professional and consistent look and feel.
-   **Form Management**: React Hook Form with Zod for robust validation.
-   **API Layer**: Backend interactions are simulated using Next.js Server Actions, allowing for secure and efficient server-side logic without creating separate API endpoints.

### Flow Architecture

The user journey is managed as a single-page, multi-step process controlled by React state:

1.  **Phone Input**: The user enters their phone number. A server action validates the number and simulates sending an OTP.
2.  **OTP Verification**: The user enters the 6-digit OTP. A server action verifies the OTP and returns a mock authentication token.
3.  **Liveness Check & Selfie Capture**: The app accesses the user's front camera. A simulated liveness check is performed, followed by selfie capture.
4.  **Selfie Upload**: The captured selfie is sent to a server action that simulates an upload process.
5.  **Success Page**: The final step displays a welcome message, the user's phone number, and the uploaded selfie.

## Liveness Logic Implementation

The on-device liveness check is a critical feature of this application. To meet the requirement of running all liveness logic locally without proprietary SDKs, we've implemented a **simulated liveness check**.

1.  **Camera Access**: The application requests permission to use the device's front-facing camera via the browser's `navigator.mediaDevices.getUserMedia` API.
2.  **User Prompt**: The user is presented with the live camera feed and is prompted to perform a simple action (e.g., "Position your face in the center and blink"). This mimics the instructional phase of a real liveness test.
3.  **Simulated Verification**: After the user confirms they are ready, the application shows a "Verifying..." state for a brief period. This is a `setTimeout`-based simulation that provides feedback to the user that a process is running.
4.  **Result**: The check always "succeeds" in this simulation, after which the selfie capture functionality is enabled.

This approach effectively demonstrates the user flow and UI for a liveness check while staying within the technical constraints of a web browser and the hackathon's requirements.

## Setup & Run Instructions

To get the application running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

