export interface DiscordWebhookPayload {
  allowed_mentions: {
    parse: string[];
  };
  embeds: {
    description: string;
    title: string;
    image?: {
      url: string;
    };
    fields: {
      name: string;
      value: string;
    }[];
  }[];
  attachments?: [
    {
      id: number;
      filename: string;
    },
  ];
}
