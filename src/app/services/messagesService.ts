import { Message, ConversationData, FilterOptions, ConversationMessage, SystemMessage } from '../types';
import { mockMessages } from '../data/messagesData';
import { conversationsData } from '../data/conversationsData';

const NETWORK_DELAY = 600; // ms

// Helper to simulate async
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const messageService = {
    getAllMessages: async (): Promise<Message[]> => {
        await delay(NETWORK_DELAY);
        return mockMessages;
    },

    /**
     * Fetch messages, simulating server-side filtering
     */
    getMessages: async (filters?: Partial<FilterOptions>, searchQuery?: string, folder: string = 'Inbox'): Promise<Message[]> => {
        await delay(NETWORK_DELAY);

        let results = mockMessages.filter(m => m.folder === folder);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(m =>
                (m.sender || '').toLowerCase().includes(query) ||
                (m.subject || '').toLowerCase().includes(query) ||
                // Basic match on conversation content just for demo
                (conversationsData[m.id]?.messages.some(msg =>
                    ('content' in msg && msg.content.toLowerCase().includes(query))
                ) ?? false)
            );
        }

        if (filters) {
            if (filters.company) {
                results = results.filter(m => m.companies.includes(filters.company!));
            }
            if (filters.unread) {
                results = results.filter(m => m.unreadCount > 0);
            }
            // ... date range logic could go here
        }

        return results;
    },

    /**
     * Fetch a full conversation by ID
     */
    getConversation: async (id: string): Promise<ConversationData | null> => {
        await delay(NETWORK_DELAY);
        return conversationsData[id] || null;
    },

    getMessageCounts: async (): Promise<{ total: number; unread: number; drafts: number }> => {
        await delay(NETWORK_DELAY);
        // Real endpoint would return just the numbers
        const inbox = mockMessages.filter(m => m.folder === 'Inbox');
        const drafts = mockMessages.filter(m => m.folder === 'Drafts');
        return {
            total: inbox.length,
            unread: inbox.filter(m => m.unreadCount > 0).length,
            drafts: drafts.length
        };
    }
};
