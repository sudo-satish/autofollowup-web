import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ContextDialog = ({ context }: { context: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='cursor-pointer'>
          View context
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Context</DialogTitle>
          <DialogDescription>{context}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
