import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Message, ConversationData, FilterOptions } from '../models';
import { mockMessages } from '../mock/messages.data';
import { conversationsData } from '../mock/conversations.data';
import { NotificationService } from './notification.service';
import { isSystemMessage, ConversationMessage } from '../models';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private lastSelectedMessageId: string | null = null;
    private drafts: Map<string, string> = new Map();
    private messages: Message[] = [...mockMessages];
    private readonly NETWORK_DELAY = 600; // ms
    private readonly MAX_TODOS = 5;

    constructor(private notificationService: NotificationService) {
        this.syncTodoFlags();
    }

    private syncTodoFlags() {
        this.messages.forEach(msg => {
            const conv = conversationsData[msg.id];
            if (conv) {
                msg.isTodo = conv.messages.some(m => !isSystemMessage(m) && (m as ConversationMessage).isTodo);
            }
        });
    }

    setLastSelectedMessageId(id: string | null) {
        this.lastSelectedMessageId = id;
    }

    getLastSelectedMessageId(): string | null {
        return this.lastSelectedMessageId;
    }

    setDraft(id: string, content: string) {
        if (!content || content.trim() === '' || content === '<p></p>') {
            this.drafts.delete(id);
        } else {
            this.drafts.set(id, content);
        }
    }

    getDraft(id: string): string {
        return this.drafts.get(id) || '';
    }

    getAllMessages(): Observable<Message[]> {
        return of([...this.messages]).pipe(delay(this.NETWORK_DELAY));
    }

    /**
     * Fetch messages, simulating server-side filtering
     */
    getMessages(filters?: Partial<FilterOptions>, searchQuery?: string, folder: string = 'Inbox'): Observable<Message[]> {
        return of([...this.messages]).pipe(
            delay(this.NETWORK_DELAY),
            map(messages => {
                let results = messages.filter(m => m.folder === folder);

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
                    if (filters.companies && filters.companies.length > 0) {
                        results = results.filter(m => m.companies.some(c => filters.companies!.includes(c)));
                    }
                    if (filters.unread) {
                        results = results.filter(m => m.unreadCount > 0);
                    }
                    // ... date range logic could go here
                }

                return results;
            })
        );
    }

    /**
     * Fetch a full conversation by ID
     */
    getConversation(id: string): Observable<ConversationData | null> {
        return of(conversationsData[id] || null).pipe(delay(this.NETWORK_DELAY));
    }

    getMessageCounts(): Observable<{ total: number; unread: number; drafts: number }> {
        return of([...this.messages]).pipe(
            delay(this.NETWORK_DELAY),
            map(messages => {
                const inbox = messages.filter(m => m.folder === 'Inbox');
                const drafts = messages.filter(m => m.folder === 'Drafts');
                return {
                    total: inbox.length,
                    unread: inbox.filter(m => m.unreadCount > 0).length,
                    drafts: drafts.length
                };
            })
        );
    }

    getTodoCount(): number {
        let count = 0;
        // Count todos in conversationsData messages
        Object.values(conversationsData).forEach(conv => {
            conv.messages.forEach(m => {
                if (!isSystemMessage(m) && (m as ConversationMessage).isTodo) {
                    count++;
                }
            });
        });
        return count;
    }

    toggleMessageTodo(conversationId: string, messageId: string): boolean {
        const conv = conversationsData[conversationId];
        if (!conv) return false;

        const message = conv.messages.find(m => !isSystemMessage(m) && (m as ConversationMessage).id === messageId) as ConversationMessage | undefined;
        if (!message) return false;

        if (!message.isTodo) {
            // Trying to add
            if (this.getTodoCount() >= this.MAX_TODOS) {
                this.notificationService.showError(
                    'You have exceeded the maximum number of to-dos',
                    'Please remove at least one to proceed.'
                );
                return false;
            }
            message.isTodo = true;
        } else {
            // Removing
            message.isTodo = false;
        }

        // Also sync the top-level flag in our state
        const mainMsg = this.messages.find(m => m.id === conversationId);
        if (mainMsg) {
            mainMsg.isTodo = conv.messages.some(m => !isSystemMessage(m) && (m as ConversationMessage).isTodo);
        }

        return true;
    }

    updateMessageFolder(ids: string[], folder: Message['folder']) {
        this.messages = this.messages.map(m =>
            ids.includes(m.id) ? { ...m, folder } : m
        );
    }

    updateMessageUnreadStatus(ids: string[], unreadCount: number, isEntered?: boolean) {
        this.messages = this.messages.map(m => {
            if (ids.includes(m.id)) {
                const updated = { ...m, unreadCount };
                if (isEntered !== undefined) {
                    updated.isEntered = isEntered;
                }
                return updated;
            }
            return m;
        });
    }

    updateMessageEntered(ids: string[], isEntered: boolean) {
        this.messages = this.messages.map(m =>
            ids.includes(m.id) ? { ...m, isEntered } : m
        );
    }
}
