import { Message } from '../types';
export type { Message };

export const mockMessages: Message[] = [
    {
        id: 'c7b3d2e1-4a5b-4c6d-8e9f-1a2b3c4d5e6f', // Was '1'
        companies: ['LASTCOMPANY S.P.A.', 'UniCredit Bank', 'Global Ventures'],
        sender: 'Amebe Valerie',
        subject: 'Urgent: Feedback required on Q3 Portfolio Strategy and Asset Allocation for the upcoming board meeting',
        time: '11:45',
        timestamp: new Date().toISOString(), // Today
        hasAttachment: true,
        unreadCount: 2,
        isEntered: true,
        isTodo: true,
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
        companies: ['CARREFOUR S.P.A. INTERNATIONAL HOLDINGS AND SUBSIDIARIES GLOBAL LIMITED'],
        sender: 'Bianchi Marco',
        subject: 'New investment opportunities in sustainable energy and green infrastructure projects in EU',
        time: '10:30',
        timestamp: new Date().toISOString(),
        hasAttachment: false,
        unreadCount: 1,
        isEntered: false,
        isTodo: true,
        folder: 'Inbox'
    },
    {
        id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', // Was '3'
        companies: ['CARREFOUR S.P.A.'],
        sender: 'Rossi Giuseppe',
        subject: 'Q2 Final Audit: Comprehensive financial report and consolidated balance sheets for 2023',
        time: '09:15',
        timestamp: new Date().toISOString(),
        hasAttachment: true,
        unreadCount: 0,
        isEntered: true,
        isTodo: true,
        folder: 'Deleted Items'
    },
    {
        id: 'f0a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', // Was '4'
        companies: ['TECH SOLUTIONS INC.'],
        sender: 'Smith John',
        subject: 'System maintenance: Scheduled downtime for core banking platform migration on Friday night',
        time: 'Yesterday',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hasAttachment: false,
        unreadCount: 3,
        isEntered: false,
        isTodo: true,
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
        companies: ['TECH SOLUTIONS INC.'],
        sender: 'Johnson Lisa',
        subject: 'Minutes of Meeting: Strategic Q4 Planning and Resource Allocation across multi-cloud regions',
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
        companies: ['GLOBAL VENTURES LTD.'],
        sender: 'Anderson Michael',
        subject: 'Partnership Agreement: Final proposal for joint venture in the Southeast Asian fintech market',
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
        companies: ['EURO BANK AG'],
        sender: 'Müller Klaus',
        subject: 'Confirmation of Credit Facility: Final approval for 500M EUR syndicated loan for solar farm',
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
        companies: ['EURO BANK AG'],
        sender: 'Schmidt Anna',
        subject: 'Internal Audit: Risk assessment report for the central European commercial real estate portfolio',
        time: '2 days ago',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        hasAttachment: true,
        unreadCount: 2,
        isEntered: true,
        isTodo: true,
        folder: 'Inbox'
    },
    {
        id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', // Was '9'
        companies: ['FINANCIAL ADVISORS INC.'],
        sender: 'Williams Sarah',
        subject: 'Client Advisory: Portfolio rebalancing strategy given current inflation and interest rate trends',
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
        companies: ['APEX CONSULTING GROUP'],
        sender: 'Martinez Elena',
        subject: 'Presentation Ready: Final client materials for the upcoming M&A workshop and due diligence',
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
        companies: ['INNOVATION CAPITAL'],
        sender: 'Chen Wei',
        subject: 'Update: Startup investment pipeline for the next capital injection round into AI startups',
        time: '4 days ago',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        hasAttachment: false,
        unreadCount: 0,
        isEntered: true,
        isTodo: false,
        folder: 'Inbox'
    },
];
