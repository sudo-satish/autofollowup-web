'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRef } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { KnowledgeBaseType } from '@/lib/generated/prisma';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Globe,
  Image,
  Link2,
  FileSpreadsheet,
  Presentation,
  Video,
  FileType,
} from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.nativeEnum(KnowledgeBaseType),
  url: z.string().optional(),
});

const knowledgeBaseTypeMenu = [
  {
    type: KnowledgeBaseType.TEXT,
    icon: <FileType className='w-5 h-5 mr-2' />,
    label: 'Text',
  },
  {
    type: KnowledgeBaseType.LINK,
    icon: <Link2 className='w-5 h-5 mr-2' />,
    label: 'Link',
  },
  {
    type: KnowledgeBaseType.WEBSITE,
    icon: <Globe className='w-5 h-5 mr-2' />,
    label: 'Website',
  },
  {
    type: KnowledgeBaseType.PDF,
    icon: <FileText className='w-5 h-5 mr-2' />,
    label: 'PDF',
  },
  {
    type: KnowledgeBaseType.DOCUMENT,
    icon: <FileText className='w-5 h-5 mr-2' />,
    label: 'Document',
  },
  {
    type: KnowledgeBaseType.EXCEL,
    icon: <FileSpreadsheet className='w-5 h-5 mr-2' />,
    label: 'Excel',
  },
  {
    type: KnowledgeBaseType.PPT,
    icon: <Presentation className='w-5 h-5 mr-2' />,
    label: 'Presentation',
  },
  {
    type: KnowledgeBaseType.IMAGE,
    icon: <Image className='w-5 h-5 mr-2' />,
    label: 'Image',
  },
  {
    type: KnowledgeBaseType.VIDEO,
    icon: <Video className='w-5 h-5 mr-2' />,
    label: 'Video',
  },
];

export function KnowledgeBaseForm({ companyId }: { companyId: number }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      type: KnowledgeBaseType.TEXT,
    },
  });

  // Watch the selected type
  const selectedType = form.watch('type');

  // Helper functions to determine which field to show
  const showFileField = [
    KnowledgeBaseType.PDF,
    KnowledgeBaseType.DOCUMENT,
    KnowledgeBaseType.EXCEL,
    KnowledgeBaseType.PPT,
    KnowledgeBaseType.IMAGE,
    KnowledgeBaseType.VIDEO,
  ].includes(selectedType as any);

  const showUrlField = [
    KnowledgeBaseType.LINK,
    KnowledgeBaseType.WEBSITE,
  ].includes(selectedType as any);

  const showContentField = [KnowledgeBaseType.TEXT].includes(
    selectedType as any
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let formData;
      if (
        showFileField &&
        fileInputRef.current &&
        fileInputRef.current.files?.length
      ) {
        formData = new FormData();
        formData.append('title', values.title);
        formData.append('type', values.type);
        formData.append('companyId', String(companyId));
        formData.append('file', fileInputRef.current.files[0]);
        if (showContentField) formData.append('content', values.content);
        if (showUrlField) formData.append('url', (values as any).url || '');
      } else {
        formData = JSON.stringify({
          ...values,
          companyId,
          url: (values as any).url || '',
        });
      }

      const response = await fetch('/api/knowledge-base', {
        body: formData,
        method: 'post',
        ...(formData instanceof FormData
          ? {}
          : { headers: { 'Content-Type': 'application/json' } }),
      });

      if (response.ok) {
        toast.success('Knowledge base created successfully');
        router.push('/dashboard/knowledge-base');
      } else {
        const error = await response.json();
        toast.error(error.title);
      }
    } catch (error) {
      toast.error('Failed to create knowledge base');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col md:flex-row gap-8 max-w-5xl mx-auto p-0 bg-transparent shadow-none'
        encType={showFileField ? 'multipart/form-data' : undefined}
      >
        {/* Sidebar */}
        <aside className='w-full md:w-56 flex-shrink-0 border-r border-gray-200 bg-white rounded-l-lg p-0'>
          <nav className='flex flex-row md:flex-col gap-2 py-4'>
            {knowledgeBaseTypeMenu.map((item) => (
              <button
                key={item.type}
                type='button'
                className={`flex items-center px-4 py-2 rounded-md text-left transition-colors w-full
                  ${
                    selectedType === item.type
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                onClick={() => form.setValue('type', item.type)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main panel */}
        <div className='flex-1 p-6 bg-white rounded-r-lg space-y-6'>
          {/* Conditionally show URL field */}
          {showUrlField && (
            <div className='space-y-2'>
              <label className='font-medium text-gray-700'>URL</label>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Enter the URL...'
                        {...field}
                        className='w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Conditionally show File field */}
          {showFileField && (
            <div className='space-y-2'>
              <label className='font-medium text-gray-700'>Upload File</label>
              <input
                ref={fileInputRef}
                type='file'
                className='block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                accept='*/*'
              />
            </div>
          )}

          {/* Conditionally show Content field */}
          {showContentField && (
            <div className='space-y-2'>
              <label className='font-medium text-gray-700'>Content</label>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='Enter the content for the knowledge base...'
                        className='w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className='pt-4'>
            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer'
            >
              Add to Knowledge
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
