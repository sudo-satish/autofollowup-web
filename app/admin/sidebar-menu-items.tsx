'use client';

import { MenuItem } from '@/shared/types';
import { Home, MessageCircleMore, Users } from 'lucide-react';

// Menu items.
export const items: MenuItem[] = [
  {
    title: 'Companies',
    url: '/admin/companies',
    icon: <Home />,
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: <MessageCircleMore />,
  },
  {
    title: 'Agents',
    url: '/admin/agents',
    icon: <Users />,
  },
];
