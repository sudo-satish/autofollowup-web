'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@/components/ui/input';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CountryCodeSelectionField } from './country-code-selection-field';

const formSchema = z.object({
  name: z.string().min(5, 'Name should be min 5 length'),
  mobileNumber: z.string().min(10, 'Mobile number should be min 10 length'),
  countryCode: z.string().min(1, 'Country code should be min 1 length'),
});

export function ClientForm({ companyId }: { companyId: number }) {
  const { userId } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobileNumber: '',
      countryCode: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/clients', {
        body: JSON.stringify({ ...values, companyId }),
        method: 'post',
      });

      if (response.ok) {
        toast.success('Client created successfully');
        router.push('/dashboard/clients');
      } else {
        toast.error('Failed to create client');
      }
    } catch (error) {
      toast.error('Failed to create client');
    }
  }

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name of the client' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='countryCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country code</FormLabel>
              <FormControl>
                <CountryCodeSelectionField
                  selectedCountryCode={field.value}
                  setSelectedCountryCode={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='mobileNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile number</FormLabel>
              <FormControl>
                <Input placeholder='Mobile number' {...field} />
              </FormControl>
              <FormDescription>
                Mobile number with country e.g. 8130626713.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type='submit' className='cursor-pointer'>
          Submit
        </Button>
      </form>
    </Form>
  );
}
