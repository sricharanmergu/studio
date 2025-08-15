'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendOtp } from '@/app/actions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const phoneFormSchema = z.object({
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/, 'Please enter a valid Indian mobile number in E.164 format (e.g., +91XXXXXXXXXX)'),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;

interface PhoneFormProps {
  onSuccess: (phoneNumber: string) => void;
}

export default function PhoneForm({ onSuccess }: PhoneFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  async function onSubmit(data: PhoneFormValues) {
    setIsLoading(true);
    try {
      const result = await sendOtp(data.phoneNumber);
      if (result.success) {
        toast({
          title: 'OTP Sent!',
          description: 'An OTP has been sent via WhatsApp to your number.',
        });
        onSuccess(data.phoneNumber);
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+919876543210" {...field} />
              </FormControl>
               <FormDescription>
                OTP will be sent via Whatsapp.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-bold" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Sending...' : 'Send OTP'}
        </Button>
      </form>
    </Form>
  );
}
