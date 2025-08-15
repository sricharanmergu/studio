'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifyOtp } from '@/app/actions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const otpFormSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits.').max(6, 'OTP must be 6 digits.'),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

interface OtpFormProps {
  phoneNumber: string;
  onSuccess: (token: string) => void;
  onBack: () => void;
}

export default function OtpForm({ phoneNumber, onSuccess, onBack }: OtpFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  async function onSubmit(data: OtpFormValues) {
    setIsLoading(true);
    try {
      const result = await verifyOtp(phoneNumber, data.otp);
      if (result.success && result.token) {
        toast({
          title: 'Success!',
          description: 'OTP verified successfully.',
        });
        onSuccess(result.token);
      } else {
        throw new Error(result.error || 'Invalid or expired OTP.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP.';
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-bold text-foreground">{phoneNumber}</span>.
        </p>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="_ _ _ _ _ _"
                  {...field}
                  className="text-center text-2xl tracking-[1.5em]"
                  maxLength={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Button type="submit" className="w-full font-bold" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button variant="link" className="w-full" onClick={onBack} type="button">
            Change phone number
          </Button>
        </div>
      </form>
    </Form>
  );
}
