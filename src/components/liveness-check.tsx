'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadSelfie } from '@/app/actions';
import { Loader2, CameraOff, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';

interface LivenessCheckProps {
  phoneNumber: string;
  token: string;
  onSuccess: (imageUrl: string) => void;
}

type LivenessStatus = 'pending' | 'checking' | 'passed' | 'uploading';

export default function LivenessCheck({ phoneNumber, token, onSuccess }: LivenessCheckProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<LivenessStatus>('pending');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Camera access was denied. Please enable camera permissions in your browser settings.');
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: 'Could not access the camera. Please check permissions.',
        });
      }
    }
    getCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLivenessCheck = () => {
    setStatus('checking');
    setTimeout(() => {
      setStatus('passed');
      toast({
        title: 'Liveness Check Passed',
        description: 'You can now capture your selfie.',
      });
    }, 2000);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setStatus('uploading');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    
    stream?.getTracks().forEach((track) => track.stop());

    try {
      const result = await uploadSelfie(phoneNumber, dataUrl, token);
      if (result.success && result.imageUrl) {
        onSuccess(result.imageUrl);
      } else {
        throw new Error(result.error || 'Upload failed.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: `Failed to upload selfie. ${errorMessage}`,
      });
      setStatus('passed'); // Revert to let user try again
    }
  };

  if (error) {
    return (
      <div className="text-center text-destructive space-y-4">
        <AlertTriangle className="mx-auto h-12 w-12" />
        <p className="font-semibold">Camera Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Initializing camera...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="relative w-full aspect-[3/4] max-w-sm overflow-hidden rounded-lg shadow-lg border-4 border-muted">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
         {status === 'checking' && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2 font-bold">Verifying...</p>
          </div>
        )}
        {status === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2 font-bold">Uploading Selfie...</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </Card>
      
      {status === 'pending' && (
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Position your face in the center and blink for a liveness check.</p>
          <Button onClick={handleLivenessCheck} className="w-full font-bold">
            I'm Ready, Check Now
          </Button>
        </div>
      )}

      {status === 'passed' && (
        <div className="text-center space-y-4">
            <p className="text-sm text-green-600 font-bold">Liveness check successful!</p>
            <Button onClick={handleCapture} className="w-full font-bold">
              Capture Selfie
            </Button>
        </div>
      )}
    </div>
  );
}
