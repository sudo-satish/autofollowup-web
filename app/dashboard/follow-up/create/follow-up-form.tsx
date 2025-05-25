'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ClientSelectionField } from './client-selection-field';
import { AgentSelectionField } from './agent-selection-field';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
const formSchema = z.object({
  dateTime: z.date(),
  client: z.string(),
  agent: z.string(),
  context: z.string(),
});

export function FollowUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // dateTime: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    try {
      const response = await fetch('/api/follow-ups', {
        body: JSON.stringify(values),
        method: 'post',
      });

      if (response.ok) {
        toast.success('Followup created successfully');
        router.push('/dashboard/follow-up');
      } else {
        toast.error('Failed to create followup');
      }
    } catch (error) {
      toast.error('Failed to create followup');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        Send followup message to
        <FormField
          control={form.control}
          name='client'
          render={({ field }) => (
            <FormItem>
              <ClientSelectionField
                selectedClient={field.value}
                setSelectedClient={field.onChange}
              />
            </FormItem>
          )}
        />
        on
        <FormField
          control={form.control}
          name='dateTime'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <DatePicker
                    minDate={new Date()}
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    dateFormat='Pp'
                    className='border border-gray-300 rounded-md p-2 shadow-sm'
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        using agent
        <FormField
          control={form.control}
          name='agent'
          render={({ field }) => (
            <FormItem>
              <AgentSelectionField
                selectedAgent={field.value}
                setSelectedAgent={field.onChange}
              />
            </FormItem>
          )}
        />
        with context
        <FormField
          control={form.control}
          name='context'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder='Context'
                  className='border border-gray-300 rounded-md p-2 shadow-sm'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
