'use client';

import { MenuItem } from '@/shared/types';
import {
  Book,
  BookOpen,
  HelpCircle,
  Home,
  MessageCircleMore,
  Users,
} from 'lucide-react';

// Menu items.
export const items: MenuItem[] = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: <Home />,
  },
  {
    title: 'Follow-up',
    url: '/dashboard/follow-up',
    icon: <MessageCircleMore />,
  },
  {
    title: 'Clients',
    url: '/dashboard/clients',
    icon: <Users />,
  },
  {
    title: 'Knowledge Base',
    url: '/dashboard/knowledge-base',
    icon: <BookOpen />,
  },
  {
    title: 'Help',
    url: '#',
    icon: <HelpCircle />,
  },
];
