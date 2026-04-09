import { conversationsData } from '../data/conversations.mock'
import { getCompaniesFromParticipants } from './participants.logic'

export function getCompaniesForConversation(conversationId: string): string[] {
  const conversation = conversationsData[conversationId]
  if (!conversation || !conversation.participantsList) {
    return []
  }

  return getCompaniesFromParticipants(conversation.participantsList)
}

export function getTitleForConversation(conversationId: string): string {
  const conversation = conversationsData[conversationId]
  return conversation ? conversation.title : ''
}
