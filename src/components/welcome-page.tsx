'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

interface WelcomePageProps {
  phoneNumber: string;
  selfieUrl: string;
  onRestart: () => void;
}

export default function WelcomePage({ phoneNumber, selfieUrl, onRestart }: WelcomePageProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-headline">Welcome!</h2>
        <p className="text-muted-foreground">You have been successfully verified.</p>
      </div>

      <Card className="w-full pt-4">
        <CardContent className="space-y-4">
          {selfieUrl && (
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <Image
                src={selfieUrl}
                alt="User Selfie"
                layout="fill"
                objectFit="cover"
                data-ai-hint="person selfie"
              />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="font-mono text-lg font-semibold text-primary">{phoneNumber}</p>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={onRestart} className="w-full font-bold">
        Start Over
      </Button>
    </div>
  );
}
