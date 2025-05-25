"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { ClientSelectionField } from "./client-selection-field";
import { AgentSelectionField } from "./agent-selection-field"
import { Textarea } from "@/components/ui/textarea"
const formSchema = z.object({
  dateTime: z.date(),
  client: z.string(),
  agent: z.string(),
  context: z.string(),
})

export function FollowUpForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // dateTime: "",
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        await fetch('/api/follow-ups', {
            body: JSON.stringify(values),
            method: 'post'
        })
      }

      console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        Send followup message to
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Client</FormLabel> */}
              <ClientSelectionField selectedClient={field.value} setSelectedClient={field.onChange}/>
            </FormItem>
          )}
        />
        on 
      <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Date</FormLabel> */}
              <FormControl>
                <div>
                    <DatePicker minDate={new Date()} selected={field.value} onChange={field.onChange} showTimeSelect dateFormat="Pp" className="border border-gray-300 rounded-md p-2 shadow-sm"/>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        using agent
        <FormField
          control={form.control}
          name="agent"
          render={({ field }) => (
            <FormItem>
              <AgentSelectionField selectedAgent={field.value} setSelectedAgent={field.onChange}/>
            </FormItem>
          )}
        />

        with context
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
                <FormControl>
                    <Textarea placeholder="Context" className="border border-gray-300 rounded-md p-2 shadow-sm" {...field}/>
                </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
