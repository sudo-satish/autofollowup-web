import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export function AgentAvtar() {
  return (
    <Avatar>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback>Agent</AvatarFallback>
    </Avatar>
  );
}

export function UserAvtar() {
  return (
    <Avatar>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback>User</AvatarFallback>
    </Avatar>
  );
}
