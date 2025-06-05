'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const defaultKnowledgeBaseTypes = [
  {
    value: 'link',
    label: 'Link',
  },
  {
    value: 'website',
    label: 'Website',
  },
  {
    value: 'document',
    label: 'Document',
  },
  {
    value: 'pdf',
    label: 'PDF',
  },
  {
    value: 'ppt',
    label: 'PPT',
  },
  {
    value: 'image',
    label: 'Image',
  },
  {
    value: 'video',
    label: 'Video',
  },
  {
    value: 'text',
    label: 'Text',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export function KnowledgeBaseTypeSelectionField({
  selectedKnowledgeBaseType,
  setSelectedKnowledgeBaseType,
}: Readonly<{
  selectedKnowledgeBaseType: string;
  setSelectedKnowledgeBaseType: (value: string) => void;
}>) {
  const [open, setOpen] = React.useState(false);

  const [knowledgeBaseTypes, setKnowledgeBaseTypes] = React.useState<
    { value: string; label: string }[]
  >([]);
  const value = selectedKnowledgeBaseType;
  const setValue = setSelectedKnowledgeBaseType;

  React.useEffect(() => {
    async function fetchKnowledgeBaseTypes() {
      setKnowledgeBaseTypes(defaultKnowledgeBaseTypes);
    }

    fetchKnowledgeBaseTypes();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {value
            ? knowledgeBaseTypes.find(
                (knowledgeBaseType) => `${knowledgeBaseType.value}` === value
              )?.label
            : 'Select knowledge base type...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search client...' className='h-9' />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {knowledgeBaseTypes.map((knowledgeBaseType) => (
                <CommandItem
                  key={knowledgeBaseType.value}
                  value={`${knowledgeBaseType.value}`}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {knowledgeBaseType.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === '' + knowledgeBaseType.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
