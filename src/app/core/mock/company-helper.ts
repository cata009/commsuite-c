import { ParticipantService } from '../services/participant.service';
import { conversationsData } from './conversations.data';

/**
 * Helper function to calculate companies from conversation participants
 * This ensures consistency between message list cards and conversation detail
 */
export function getCompaniesForConversation(conversationId: string): string[] {
    const conversation = conversationsData[conversationId];
    if (!conversation || !conversation.participantsList) {
        return [];
    }

    const participantService = new ParticipantService();
    return participantService.getCompaniesFromParticipants(conversation.participantsList);
}

/**
 * Helper function to get conversation title
 * This ensures consistency between message list cards and conversation detail
 */
export function getTitleForConversation(conversationId: string): string {
    const conversation = conversationsData[conversationId];
    return conversation ? conversation.title : '';
}
