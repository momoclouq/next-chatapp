import { create } from 'zustand'
import { LIMIT_MESSAGE } from '../constant';

export type IMessage = {
    created_at: string;
    id: string;
    is_edit: boolean | null;
    send_by: string | null;
    text: string | null;
    users: {
        avatar_url: string;
        created_at: string;
        display_name: string;
        id: string;
    } | null;
};

interface MessageState {
  hasMore: boolean,
  page: number,
  messages: IMessage[],
  actionMessage: IMessage | undefined,
  optimisticIds: string[],
  optimisticAddMessage: (message:IMessage) => void
  setActionMessage: (message: IMessage | undefined) => void
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
  setMessages: (messages: IMessage[]) => void;
}

export const useMessage = create<MessageState>()(
  (set) => ({
    hasMore: true,
    page: 1, 
    messages: [],
    optimisticIds: [],
    actionMessage: undefined,
    setActionMessage: (message) => set(() => ({ actionMessage: message })),
    optimisticAddMessage: (message) => set((state) => ({ messages: [...state.messages, message], optimisticIds: [
      ...state.optimisticIds, message.id
    ]})),
    setMessages: (messages) => set((state) => ({ messages: [...messages, ...state.messages], page: state.page + 1, hasMore: messages.length >= LIMIT_MESSAGE})),
    optimisticDeleteMessage: (messageId) => set((state) => {
      return {
        messages: state.messages.filter(
          (message) => message.id !== messageId
        )
      }
    }),
    optimisticUpdateMessage: (updateMessage) => set((state) => {
      return {
        messages: state.messages.map(
          (message) => {
            if (message.id === updateMessage.id) {
              message.text = updateMessage.text;
              message.is_edit = updateMessage.is_edit;
            }

            return message;
          }
        )
      }
    })
  })
)