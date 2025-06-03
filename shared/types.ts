export type MenuItem = {
  title: string;
  url: string;
  icon: React.ReactElement;
};

export type Agent = {
  id: number;
  name: string;
  systemPrompt: string;
  createdAt: Date;
};

export type Company = {
  id: number;
  name: string;
  clerkId: string;
  createdAt: Date;
};

export type UserClient = {
  id: number;
  name: string;
};

export type Followup = {
  userClient: UserClient;
  agent: Agent;
  followupDate: Date | null;
  context: string | null;
};

export type CountryCode = {
  id: string;
  name: string;
};
