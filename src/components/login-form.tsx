'use client';

import * as React from 'react';
import { auth } from '@/lib/api/auth';
import { AuthContext } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setAuth } = React.useContext(AuthContext);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await auth.login(values);
      
      // Update auth context first
      setAuth(response.access_token, response.user);
      
      // Small delay to ensure cookies are set before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then redirect using window.location for a full page load
      const redirectPath = response.user.role === 'admin' ? '/admin' : '/dashboard';
      window.location.href = redirectPath;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Clear any existing errors
      form.clearErrors();
      
      // Set the error message
      const errorMessage = error.message || 'Login failed. Please try again.';
      
      // Set form errors
      form.setError('root', {
        type: 'manual',
        message: errorMessage
      });
      
      // If it's an invalid credentials error, highlight both fields
      if (errorMessage.toLowerCase().includes('invalid') || 
          error.message?.toLowerCase().includes('invalid')) {
        form.setError('email', { 
          type: 'manual',
          message: 'Please check your credentials' 
        });
        form.setError('password', { 
          type: 'manual',
          message: 'Please check your credentials' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  {...field}
                  type="email"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  {...field}
                  type="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md dark:text-red-400 dark:bg-red-900/10">
            {form.formState.errors.root.message}
          </div>
        )}

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}
