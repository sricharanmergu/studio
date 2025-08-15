'use client';

import { useState } from 'react';
import PhoneForm from '@/components/phone-form';
import OtpForm from '@/components/otp-form';
import LivenessCheck from '@/components/liveness-check';
import WelcomePage from '@/components/welcome-page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera } from 'lucide-react';

type Step = 'phone' | 'otp' | 'liveness' | 'success';

export default function Home() {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');

  const handlePhoneSuccess = (phone: string) => {
    setPhoneNumber(phone);
    setStep('otp');
  };

  const handleOtpSuccess = (token: string) => {
    setAuthToken(token);
    setStep('liveness');
  };

  const handleLivenessSuccess = (url: string) => {
    setSelfieUrl(url);
    setStep('success');
  };

  const handleBackToPhone = () => {
    setPhoneNumber('');
    setStep('phone');
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return <PhoneForm key="phone" onSuccess={handlePhoneSuccess} />;
      case 'otp':
        return <OtpForm key="otp" phoneNumber={phoneNumber} onSuccess={handleOtpSuccess} onBack={handleBackToPhone} />;
      case 'liveness':
        return <LivenessCheck key="liveness" phoneNumber={phoneNumber} token={authToken} onSuccess={handleLivenessSuccess} />;
      case 'success':
        return <WelcomePage key="success" phoneNumber={phoneNumber} selfieUrl={selfieUrl} onRestart={handleBackToPhone} />;
      default:
        return <PhoneForm key="phone" onSuccess={handlePhoneSuccess} />;
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'phone':
        return 'Enter Your Phone Number';
      case 'otp':
        return 'Verify OTP';
      case 'liveness':
        return 'Liveness & Selfie Capture';
      case 'success':
        return 'Verification Successful';
      default:
        return 'Welcome';
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center bg-white p-6">
           <div className="flex justify-center items-center mb-4">
             <div className="p-3 bg-primary/10 rounded-full">
                <Camera className="h-8 w-8 text-primary" />
             </div>
           </div>
          <CardTitle className="font-headline text-2xl font-bold text-gray-800">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 bg-white/80 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LivenessID. All rights reserved.</p>
        </footer>
    </main>
  );
}
