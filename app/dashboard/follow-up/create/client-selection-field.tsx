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
import { UserClient } from '@/shared/types';

export function ClientSelectionField({
  selectedClient,
  setSelectedClient,
  companyId,
}: Readonly<{
  selectedClient: string;
  setSelectedClient: (value: string) => void;
  companyId: number;
}>) {
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState<UserClient[]>([]);
  const value = selectedClient;
  const setValue = setSelectedClient;

  React.useEffect(() => {
    async function fetchAgents() {
      const res = await fetch(`/api/clients?companyId=${companyId}`);
      const agents = await res.json();
      setClients(agents);
    }

    fetchAgents();
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
            ? clients.find((client) => '' + client.id === value)?.name
            : 'Select client...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search client...' className='h-9' />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={'' + client.id}
                  value={'' + client.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {client.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === '' + client.id ? 'opacity-100' : 'opacity-0'
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
