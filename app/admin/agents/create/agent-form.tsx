'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  systemPrompt: z.string(),
});

export default function CreateAgentForm({
  defaultValues,
  isEdit = false,
}: {
  defaultValues: z.infer<typeof formSchema>;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const url = isEdit ? `/api/agents/${values.id}` : '/api/agents';
      const response = await fetch(url, {
        body: JSON.stringify(values),
        method: isEdit ? 'put' : 'post',
      });

      if (response.ok) {
        toast.success(
          isEdit ? 'Agent updated successfully' : 'Agent created successfully'
        );
        router.push('/admin/agents');
      } else {
        const error = await response.json();
        toast.error(error.title);
      }
    } catch (error) {
      toast.error(isEdit ? 'Failed to update agent' : 'Failed to create agent');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-gray-50 py-12'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100'
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-3xl font-bold text-gray-900 mb-8 text-center'
          >
            {isEdit ? 'Edit Agent' : 'Create New Agent'}
          </motion.h2>

          <div className='space-y-6'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className='space-y-2'
            >
              <label className='text-sm font-medium text-gray-700'>
                User Name
              </label>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <Input
                      placeholder='Enter the name of the user'
                      className='w-full transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg'
                      {...field}
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className='space-y-2'
            >
              <label className='text-sm font-medium text-gray-700'>
                System Prompt
              </label>
              <FormField
                control={form.control}
                name='systemPrompt'
                render={({ field }) => (
                  <FormItem>
                    <Textarea
                      placeholder='Enter the system prompt for the agent'
                      className='w-full transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg'
                      {...field}
                    />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className='pt-6'
          >
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer'
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : isEdit ? (
                'Update Agent'
              ) : (
                'Create Agent'
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
