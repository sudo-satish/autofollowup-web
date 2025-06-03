'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CompanySelectionField } from './company-selection-field';

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  companyId: z.number(),
  password: z.string(),
});

export default function CreateUserForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      companyId: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        body: JSON.stringify(values),
        method: 'post',
      });

      if (response.ok) {
        toast.success('User created successfully');
        router.push('/admin/users');
      } else {
        const error = await response.json();
        toast.error(error.title);
      }
    } catch (error) {
      toast.error('Failed to create user');
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
            Create New User
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
                Company
              </label>
              <FormField
                control={form.control}
                name='companyId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <CompanySelectionField
                      selectedCompany={field.value}
                      setSelectedCompany={field.onChange}
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
              <label className='text-sm font-medium text-gray-700'>Email</label>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <Input
                      placeholder='Enter the email of the user'
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
                Password
              </label>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <Input
                      placeholder='Enter the password of the user'
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
                  Creating...
                </div>
              ) : (
                'Create User'
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
