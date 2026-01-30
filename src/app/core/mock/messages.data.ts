import { Message } from '../models';
import { getCompaniesForConversation, getTitleForConversation } from './company-helper';

export const mockMessages: Message[] = [
    {
        id: 'c7b3d2e1-4a5b-4c6d-8e9f-1a2b3c4d5e6f', // Was '1'
        companies: getCompaniesForConversation('c7b3d2e1-4a5b-4c6d-8e9f-1a2b3c4d5e6f'),
        sender: 'Amebe Valerie',
        subject: getTitleForConversation('c7b3d2e1-4a5b-4c6d-8e9f-1a2b3c4d5e6f'),
        time: '11:45',
        timestamp: new Date().toISOString(), // Today
        hasAttachment: true,
        unreadCount: 2,
        isEntered: false,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b', // Was '101'
        companies: ['YOU'],
        sender: 'Draft Message 1',
        subject: 'Pending response to client: Loan restructuring proposal for tech startup sector expansion',
        time: '10:30',
        timestamp: new Date().toISOString(),
        hasAttachment: false,
        unreadCount: 0,
        isEntered: false,
        isTodo: false,
        folder: 'Drafts'
    },
    {
        id: 'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', // Was '2'
        companies: getCompaniesForConversation('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e'),
        sender: 'Bianchi Marco',
        subject: getTitleForConversation('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e'),
        time: '10:30',
        timestamp: new Date().toISOString(),
        hasAttachment: false,
        unreadCount: 1,
        isEntered: false,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', // Was '3'
        companies: getCompaniesForConversation('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a'),
        sender: 'Rossi Giuseppe',
        subject: getTitleForConversation('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a'),
        time: '09:15',
        timestamp: new Date().toISOString(),
        hasAttachment: true,
        unreadCount: 30,
        isEntered: true,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: 'f0a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', // Was '4'
        companies: getCompaniesForConversation('f0a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c'),
        sender: 'Smith John',
        subject: getTitleForConversation('f0a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c'),
        time: 'Yesterday',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hasAttachment: false,
        unreadCount: 3,
        isEntered: false,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: 'a6b7c8d9-e0f1-2a3b-4c5d-6e7f8a9b0c1d', // Was '102'
        companies: ['YOU'],
        sender: 'Draft Message 2',
        subject: 'RE: Q3 Financial Review Notes - detailed analysis of currency fluctuations and hedging strategies',
        time: 'Yesterday',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hasAttachment: true,
        unreadCount: 0,
        isEntered: false,
        isTodo: false,
        folder: 'Drafts'
    },
    {
        id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', // Was '5'
        companies: getCompaniesForConversation('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'),
        sender: 'Johnson Lisa',
        subject: getTitleForConversation('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'),
        time: 'Yesterday',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hasAttachment: true,
        unreadCount: 0,
        isEntered: true,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', // Was '6'
        companies: getCompaniesForConversation('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b'),
        sender: 'Anderson Michael',
        subject: getTitleForConversation('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b'),
        time: 'Yesterday',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hasAttachment: true,
        unreadCount: 1,
        isEntered: false,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', // Was '7'
        companies: getCompaniesForConversation('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'),
        sender: 'Müller Klaus',
        subject: getTitleForConversation('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'),
        time: '2 days ago',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        hasAttachment: false,
        unreadCount: 0,
        isEntered: true,
        isTodo: false,
        folder: 'Deleted Items'
    },
    {
        id: '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', // Was '8'
        companies: getCompaniesForConversation('9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d'),
        sender: 'Schmidt Anna',
        subject: getTitleForConversation('9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d'),
        time: '2 days ago',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        hasAttachment: true,
        unreadCount: 2,
        isEntered: true,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', // Was '9'
        companies: getCompaniesForConversation('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'),
        sender: 'Williams Sarah',
        subject: getTitleForConversation('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'),
        time: '3 days ago',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        hasAttachment: false,
        unreadCount: 0,
        isEntered: true,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', // Was '103'
        companies: ['YOU'],
        sender: 'Draft Message 3',
        subject: 'Draft: Team Announcement regarding the new compliance procedures for international transfers',
        time: '3 days ago',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        hasAttachment: false,
        unreadCount: 0,
        isEntered: false,
        isTodo: false,
        folder: 'Drafts'
    },
    {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Was '11'
        companies: getCompaniesForConversation('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        sender: 'Martinez Elena',
        subject: getTitleForConversation('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        time: '4 days ago',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        hasAttachment: true,
        unreadCount: 0,
        isEntered: true,
        isTodo: false,
        folder: 'Inbox'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440000', // Was '12'
        companies: getCompaniesForConversation('550e8400-e29b-41d4-a716-446655440000'),
        sender: 'Chen Wei',
        subject: getTitleForConversation('550e8400-e29b-41d4-a716-446655440000'),
        time: '4 days ago',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        hasAttachment: false,
        unreadCount: 0,
        isEntered: true,
        isTodo: false,
        folder: 'Inbox'
    },
];
