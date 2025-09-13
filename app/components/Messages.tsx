import { useEffect, useRef } from 'react';
import messageStore from '@/store/messages.store';
import { Message } from './Types';

export enum Roles {
  user = 'user',
  assistant = 'assistant',
}

interface Props {
  conversationId: string | null;
}

const Messages = ({ conversationId }: Props) => {
  const { messages } = messageStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col text-white space-y-4 p-4 overflow-auto h-full">
      {messages
        .filter((message) => message.conversationId === conversationId)
        .map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex gap-2 ${message.role === Roles.user ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md p-2 rounded-2xl ${
                message.role === Roles.user ? 'bg-third ml-10' : 'bg-primary mr-10'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;