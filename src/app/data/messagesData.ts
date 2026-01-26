export interface Message {
    id: string;
    companies: string[];
    sender: string;
    subject: string;
    time: string;
    timestamp: string; // ISO Date string for filtering
    hasAttachment: boolean;
    unreadCount: number;
    isEntered: boolean; // Maybe this is 'read'? keeping as is.
    isTodo: boolean;
    folder: 'Inbox' | 'Drafts' | 'Deleted Items';
}

export const mockMessages: Message[] = [
    {
        id: '1',
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
        id: '101',
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
        id: '2',
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
        id: '3',
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
        id: '4',
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
        id: '102',
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
        id: '5',
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
        id: '6',
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
        id: '7',
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
        id: '8',
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
        id: '9',
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
        id: '103',
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
        id: '11',
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
        id: '12',
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
