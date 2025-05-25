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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'
      >
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
          Create New Follow-up
        </h2>

        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-gray-700'>
            <span className='font-medium'>Send followup message to</span>
            <FormField
              control={form.control}
              name='client'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <ClientSelectionField
                    selectedClient={field.value}
                    setSelectedClient={field.onChange}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className='flex items-center gap-2 text-gray-700'>
            <span className='font-medium'>on</span>
            <FormField
              control={form.control}
              name='dateTime'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <div>
                      <DatePicker
                        minDate={new Date()}
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat='Pp'
                        className='w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className='flex items-center gap-2 text-gray-700'>
            <span className='font-medium'>using agent</span>
            <FormField
              control={form.control}
              name='agent'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <AgentSelectionField
                    selectedAgent={field.value}
                    setSelectedAgent={field.onChange}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className='space-y-2'>
            <label className='font-medium text-gray-700'>Context</label>
            <FormField
              control={form.control}
              name='context'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Enter the context for the follow-up...'
                      className='w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='pt-4'>
          <Button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer'
          >
            Create Follow-up
          </Button>
        </div>
      </form>
    </Form>
  );
}
