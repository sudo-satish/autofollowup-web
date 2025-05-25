import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

export function CollapsibleContext({ context }: { context: string }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className='text-gray-500'>
        {context.slice(0, 10)}...
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className='text-gray-700'>{context}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
