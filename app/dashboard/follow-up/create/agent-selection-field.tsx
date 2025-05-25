"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Agent } from "@/shared/types"

// const agents = [
//   {
//     value: "gigger-followup-agent",
//     label: "Gigger Followup Agent",
//   },
// ]

export function AgentSelectionField({selectedAgent, setSelectedAgent}: Readonly<{selectedAgent: string, setSelectedAgent: (value: string) => void}>) {
  const [open, setOpen] = React.useState(false);

  const [agents, setAgents] = React.useState<Agent[]>([]);
    const value = selectedAgent;
    const setValue = setSelectedAgent;

    React.useEffect(() => {
      async function fetchAgents() {
        
        const res = await fetch('/api/agents');
        const agents = await res.json();
        console.log(agents)

        setAgents(agents)
      }

      fetchAgents();
      
    }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? agents.find((agent) => `${agent.id}` === value)?.name
            : "Select agent..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search client..." className="h-9" />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={`${agent.id}`}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {agent.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === '' + agent.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
