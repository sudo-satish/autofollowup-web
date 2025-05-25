import { MessageCircleIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

export function CollapsibleContext({ context }: { context: string }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className='text-gray-500'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <MessageCircleIcon className='w-4 h-4' />
          Context
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className='text-gray-700'>{context}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
