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
import { CountryCode } from '@/shared/types';

const countryCodes: CountryCode[] = [
  { id: '+91', name: 'India' },
  { id: '+92', name: 'Australia' },
  { id: '+93', name: 'Canada' },
  { id: '+94', name: 'United States' },
  { id: '+95', name: 'United Kingdom' },
  { id: '+96', name: 'United Arab Emirates' },
  { id: '+97', name: 'New Zealand' },
];

export function CountryCodeSelectionField({
  selectedCountryCode,
  setSelectedCountryCode,
}: Readonly<{
  selectedCountryCode: string;
  setSelectedCountryCode: (value: string) => void;
}>) {
  const [open, setOpen] = React.useState(false);

  const [countries, setCountries] = React.useState<CountryCode[]>(countryCodes);
  const value = selectedCountryCode;
  const setValue = setSelectedCountryCode;

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
            ? countries.find((country) => country.id === value)?.name
            : 'Select country...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search client...' className='h-9' />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.id}
                  value={`${country.id}`}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {country.id} {country.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === country.id ? 'opacity-100' : 'opacity-0'
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
