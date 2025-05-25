'use client'
 
import { usePathname } from 'next/navigation'
import { SidebarMenuItem } from './sidebar'
import { SidebarMenuButton } from './sidebar'
import { MenuItem } from '@/shared/types'
 
export function Links({items}: {items: MenuItem[]}) {
  const pathname = usePathname()
 
  return items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={pathname === item.url}>
            <a href={item.url}>
              {item.icon}
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))
}