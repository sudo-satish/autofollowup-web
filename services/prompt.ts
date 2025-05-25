import { Agent } from '@/shared/types';

export const getSystemPrompt = async (agent: Agent, context: string) => {
  return agent.systemPrompt.replace('{context}', context);
};
