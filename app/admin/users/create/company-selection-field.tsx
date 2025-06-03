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
import { Company } from '@/shared/types';
export function CompanySelectionField({
  selectedCompany,
  setSelectedCompany,
}: Readonly<{
  selectedCompany: number;
  setSelectedCompany: (value: number) => void;
}>) {
  const [open, setOpen] = React.useState(false);

  const [companies, setCompanies] = React.useState<Company[]>([]);
  const value = selectedCompany;
  const setValue = setSelectedCompany;

  React.useEffect(() => {
    async function fetchCompanies() {
      const res = await fetch('/api/companies');
      const companies = await res.json();
      console.log(companies);

      setCompanies(companies);
    }

    fetchCompanies();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          {value
            ? companies.find((company) => company.id === value)?.name
            : 'Select company...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search client...' className='h-9' />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {companies.map((company) => (
                <CommandItem
                  key={company.id}
                  value={`${company.id}`}
                  onSelect={(currentValue) => {
                    setValue(+currentValue === value ? 0 : +currentValue);
                    setOpen(false);
                  }}
                >
                  {company.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === 0 + company.id ? 'opacity-100' : 'opacity-0'
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
