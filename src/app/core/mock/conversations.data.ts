import { ConversationData, SystemMessageType } from '../models';

export const MAX_TODO_MESSAGES = 5;

// Mock user for conversation participants
const CURRENT_USER = {
    firstName: 'John',
    lastName: 'Doe',
    organization: 'UniCredit'
};

const CURRENT_USER_DISPLAY = `${CURRENT_USER.lastName} ${CURRENT_USER.firstName} (You)`;
const CURRENT_USER_NAME = `${CURRENT_USER.lastName} ${CURRENT_USER.firstName}`;
const CURRENT_USER_ORG = CURRENT_USER.organization;

export const conversationsData: Record<string, ConversationData> = {
    'c7b3d2e1-4a5b-4c6d-8e9f-1a2b3c4d5e6f': { // Was '1'
        title: 'Board Room Presentation: Q3 Strategy',
        lastUpdated: '16.06.2023 11:45',
        participants: 8,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Wilson Thomas',
            'Rossi Mario',
            'Mihai Iacob',
            'Verdi Lucia',
            'Fitzwilliam-Smith James',
            'Amebe Valerie',
            'Bianchi Marco',
            'Chen Wei'
        ],
        messages: [
            {
                id: 'sys1',
                type: 'you_were_added' as SystemMessageType,
                timestamp: '16.06.2023 09:00 AM',
                actor: 'Wilson Thomas',
                targetUser: 'You',
            },
            {
                id: 'm1',
                sender: 'Amebe Valerie',
                content: 'Dear team, I wanted to bring to your attention some excellent investment opportunities that have recently become available. These funds have shown consistent performance over the past quarters and align well with our risk management strategy.',
                timestamp: '16.06.2023 09:30 AM',
                isOwn: false,
                isTodo: true,
            },
            {
                id: 'm2',
                sender: 'Marco Bianchi',
                content: 'Thank you Valerie for sharing this. Could you please provide more details about the expected ROI and the timeframe for these investments?',
                timestamp: '16.06.2023 10:15 AM',
                isOwn: false,
            },
            {
                id: 'm3',
                sender: 'You',
                content: 'This looks promising. I\'ve reviewed the documentation and I think we should schedule a meeting to discuss the allocation strategy. Would tomorrow afternoon work for everyone?',
                timestamp: '16.06.2023 11:00 AM',
                isOwn: true,
                isTodo: true,
            },
            {
                id: 'm4',
                sender: 'Amebe Valerie',
                content: 'Absolutely, I can provide a detailed breakdown. The expected ROI is around 7-9% annually with a medium-term horizon of 3-5 years. Tomorrow afternoon works perfectly for me.',
                timestamp: '16.06.2023 11:45 AM',
                isOwn: false,
                attachments: [
                    { id: 'att_c1_1', name: 'ROI_BREAKDOWN_ANALYSIS.PDF', type: 'PDF', size: '1.2 MB', category: 'document' },
                    { id: 'att_c1_2', name: 'RISK_ASSESSMENT_Q3.DOCX', type: 'DOCX', size: '2.5 MB', category: 'document' },
                    { id: 'att_c1_3', name: 'PORTFOLIO_ALLOCATION.XLSX', type: 'XLSX', size: '800 KB', category: 'document' },
                    { id: 'att_c1_4', name: 'TEAM_STRUCTURE_CHART.PNG', type: 'PNG', size: '1.5 MB', category: 'image' },
                    { id: 'att_c1_5', name: 'COMPLIANCE_CERT.PDF', type: 'PDF', size: '500 KB', category: 'document' },
                    { id: 'att_c1_6', name: 'MEETING_MINUTES_MAY.TXT', type: 'TXT', size: '15 KB', category: 'document' }
                ]
            },
            {
                id: 'sys2',
                type: 'member_added' as SystemMessageType,
                timestamp: '16.06.2023 11:50 AM',
                actor: 'Amebe Valerie',
                targetUser: 'Chen Wei',
            },
            {
                id: 'm5',
                sender: 'Chen Wei',
                content: 'I have some concerns about the liquidity of these funds. Can we get more clarity on the exit terms?',
                timestamp: '16.06.2023 12:00 PM',
                isOwn: false,
            },
            {
                id: 'm6',
                sender: 'Verdi Lucia',
                content: 'Good point, Wei. I\'d also like to see a comparison with our current ESG portfolio. Are these compliant with our new sustainability goals?',
                timestamp: '16.06.2023 12:10 PM',
                isOwn: false,
            },
            {
                id: 'm7',
                sender: 'Amebe Valerie',
                content: 'Regarding liquidity, there is a lock-up period of 12 months, after which quarterly redemptions are allowed. @Lucia, yes, 2 of the 3 funds are Article 8 compliant under SFDR.',
                timestamp: '16.06.2023 12:30 PM',
                isOwn: false,
            },
            {
                id: 'm8',
                sender: 'You',
                content: 'That sounds acceptable. The SFDR compliance is a strong plus. Wei, does the 12-month lock-up work for your allocation buckets?',
                timestamp: '16.06.2023 12:45 PM',
                isOwn: true,
            },
            {
                id: 'm9',
                sender: 'Chen Wei',
                content: 'Yes, that fits within our strategic bucket. Tactical allocation might be tight, but we can manage. I\'m on board for the meeting tomorrow.',
                timestamp: '16.06.2023 01:00 PM',
                isOwn: false,
            },
            {
                id: 'm10',
                sender: 'Wilson Thomas',
                content: 'Count me in as well. I\'ll bring the latest risk models to compare against these projections.',
                timestamp: '16.06.2023 01:15 PM',
                isOwn: false,
            },
            {
                id: 'm11',
                sender: 'Fitzwilliam-Smith James',
                content: 'I might be a few minutes late, coming from a client lunch. Please start without me if I\'m delayed.',
                timestamp: '16.06.2023 01:20 PM',
                isOwn: false,
            },
            {
                id: 'm12',
                sender: 'You',
                content: 'No problem James. We\'ll record the session.',
                timestamp: '16.06.2023 01:25 PM',
                isOwn: true,
            },
            {
                id: 'sys3',
                type: 'member_removed' as SystemMessageType,
                timestamp: '16.06.2023 01:30 PM',
                actor: 'Wilson Thomas',
                targetUser: 'Fitzwilliam-Smith James',
            },
            {
                id: 'm13',
                sender: 'Rossi Mario',
                content: 'Has anyone checked the fee structure? Specifically the management fee vs performance fee split?',
                timestamp: '16.06.2023 02:00 PM',
                isOwn: false,
            },
            {
                id: 'm14',
                sender: 'Amebe Valerie',
                content: '<font size="3" color="#e2001a">Yes Mario, it\'s 1.5% management and 20% performance over a 5% hurdle rate. Standard for this asset class, but we might be able to negotiate a rebate based on volume.</font>',
                timestamp: '16.06.2023 02:10 PM',
                isOwn: false,
            },
            {
                id: 'm15',
                sender: 'Rossi Mario',
                content: 'Thanks Valerie. A rebate would be excellent. Let\'s target 1.2% base.',
                timestamp: '16.06.2023 02:15 PM',
                isOwn: false,
                isRead: false,
            },
            {
                id: 'm16',
                sender: 'You',
                content: 'Agreed. Valerie, can you draft a preliminary term sheet with those fee targets before the meeting?',
                timestamp: '16.06.2023 02:30 PM',
                isOwn: true,
                isTodo: false,
                isRead: false,
            },
        ],
    },
    'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e': { // Was '2'
        title: 'Investment opportunities in Green Tech',
        lastUpdated: '16.06.2023 10:30',
        participants: 6,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Bianchi Marco',
            'Rossi Giuseppe',
            'Müller Klaus',
            'Schmidt Anna',
            'Wilson Olga'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Bianchi Marco',
                content: 'Good morning everyone. I\'ve identified several new investment opportunities in the renewable energy sector, specifically targeting solar and wind production in southern Europe.',
                timestamp: '16.06.2023 09:00 AM',
                isOwn: false,
            },
            {
                id: 'm2',
                sender: 'You',
                content: 'Thanks Marco. What are the projected yields? We need to ensure they meet our minimum ESG criteria.',
                timestamp: '16.06.2023 10:30 AM',
                isOwn: true,
            },
            {
                id: 'sys1',
                type: 'member_added' as SystemMessageType,
                timestamp: '16.06.2023 10:35 AM',
                actor: CURRENT_USER_NAME,
                targetUser: 'Wilson Olga',
            },
            {
                id: 'm3',
                sender: 'Bianchi Marco',
                content: 'The projected IRR ranges from 8.5% to 11.2%. All projects are Category 1 in terms of sustainability impact.',
                timestamp: '16.06.2023 10:45 AM',
                isOwn: false,
                isTodo: false,
            },
            {
                id: 'm4',
                sender: 'Schmidt Anna',
                content: 'The regulatory risks in Spain and Italy have stabilized recently. This seems like a good time to increase our exposure.',
                timestamp: '16.06.2023 11:15 AM',
                isOwn: false,
            },
            {
                id: 'm5',
                sender: 'Müller Klaus',
                content: 'I agree. Let\'s perform a deeper dive into the Italian offshore projects. They seem most promising.',
                timestamp: '16.06.2023 12:00 PM',
                isOwn: false,
                isTodo: false,
            },
            {
                id: 'm6',
                sender: 'You',
                content: 'Agreed. Klaus, can you lead the due diligence for the Italian projects?',
                timestamp: '16.06.2023 12:45 PM',
                isOwn: true,
            },
            {
                id: 'm7',
                sender: 'Müller Klaus',
                content: 'Certainly. I\'ll have an initial assessment ready by Friday.',
                timestamp: '16.06.2023 01:15 PM',
                isOwn: false,
                isRead: false,
            },
        ],
    },
    'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a': { // Was '3'
        title: 'Q2 Comprehensive Financial Report',
        lastUpdated: '16.06.2023 09:15',
        participants: 12,
        unreadCount: 30,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Rossi Giuseppe',
            'Johnson Lisa',
            'Smith John',
            'Anderson Michael',
            'Williams Sarah'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Rossi Giuseppe',
                content: 'The final draft of the Q2 report is ready for final review. We\'ve exceeded our revenue targets by 15% in the advisory segment.',
                timestamp: '16.06.2023 08:00 AM',
                isOwn: false,
                isTodo: false,
            },
            {
                id: 'm2',
                sender: 'You',
                content: 'Great work team. Let\'s ensure the tax implications of the cross-border revenue are clearly highlighted in Section 4.',
                timestamp: '16.06.2023 09:15 AM',
                isOwn: true,
            },
            {
                id: 'm3',
                sender: 'Johnson Lisa',
                content: 'I\'ll double check the tax calculations with our legal team this afternoon.',
                timestamp: '16.06.2023 10:30 AM',
                isOwn: false,
                isTodo: false,
            },
            {
                id: 'm4',
                sender: 'Rossi Giuseppe',
                content: 'Thanks Lisa. Once you have that, I can finalize the PDF and distribute it to the shareholders.',
                timestamp: '16.06.2023 11:45 AM',
                isOwn: false,
            },
            { id: 'm5', sender: 'Anderson Michael', content: 'Just reviewing the advisory segment numbers. They look fantastic! Great job everyone.', timestamp: '16.06.2023 12:00 PM', isOwn: false },
            { id: 'm6', sender: 'Williams Sarah', content: 'Reviewing the compliance section now. Will have feedback in an hour.', timestamp: '16.06.2023 12:15 PM', isOwn: false },
            { id: 'm7', sender: 'You', content: 'Thanks Sarah. Please prioritize the GDPR compliance part.', timestamp: '16.06.2023 12:20 PM', isOwn: true },
            { id: 'm8', sender: 'Rossi Giuseppe', content: 'Loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', timestamp: '16.06.2023 12:30 PM', isOwn: false },
            { id: 'm9', sender: 'Johnson Lisa', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.', timestamp: '16.06.2023 12:45 PM', isOwn: false },
            { id: 'm10', sender: 'Smith John', content: 'Section 4.2 needs revision. The projected growth figures seem conservative given the current market trends. Can we re-evaluate based on the latest Q2 data?', timestamp: '16.06.2023 01:00 PM', isOwn: false },
            {
                id: 'm11',
                sender: 'Anderson Michael',
                content: 'Agreed with John. I\'ve attached the updated spreadsheet with the new projections. Please take a look when you have a moment.',
                timestamp: '16.06.2023 01:15 PM',
                isOwn: false,
                attachments: [
                    { id: 'a1', name: 'PROJECTIONS_Q3_V2.XLSX', type: 'XLSX', size: '2.4 MB', category: 'document' }
                ]
            },
            { id: 'm12', sender: 'You', content: 'Received. will update the report accordingly. Let\'s schedule a brief sync at 3 PM to finalize.', timestamp: '16.06.2023 01:20 PM', isOwn: true },
            { id: 'm13', sender: 'Rossi Giuseppe', content: 'Sounds good. I\'ll set up the invite.', timestamp: '16.06.2023 01:30 PM', isOwn: false },
            { id: 'm14', sender: 'Williams Sarah', content: 'Compliance review complete. Only minor adjustments needed in Section 7. Sending them now.', timestamp: '16.06.2023 02:00 PM', isOwn: false },
            { id: 'm15', sender: 'You', content: 'Perfect, thanks Sarah. I\'ll incorporate them immediately.', timestamp: '16.06.2023 02:05 PM', isOwn: true },
            { id: 'm16', sender: 'Rossi Giuseppe', content: 'Also, don\'t forget to include the executive summary at the beginning. It was missing from the last draft.', timestamp: '16.06.2023 02:15 PM', isOwn: false },
            { id: 'm17', sender: 'Johnson Lisa', content: 'I have the tax calculations ready. Forwarding the email from legal now.', timestamp: '16.06.2023 02:30 PM', isOwn: false },
            { id: 'm18', sender: 'Smith John', content: 'Great progress team. This report is shaping up nicely.', timestamp: '16.06.2023 02:45 PM', isOwn: false },
            { id: 'm19', sender: 'You', content: 'Thanks John. We\'re aiming to have everything wrapped up by EOD.', timestamp: '16.06.2023 02:50 PM', isOwn: true },
            { id: 'm20', sender: 'Anderson Michael', content: 'Quick question on the appendix - are we including the raw data tables or just the charts?', timestamp: '16.06.2023 03:00 PM', isOwn: false },
            { id: 'm21', sender: 'You', content: 'Just the charts for the main report. Raw data will be in a separate file.', timestamp: '16.06.2023 03:05 PM', isOwn: true },
            { id: 'm22', sender: 'Anderson Michael', content: 'Understood. Thanks.', timestamp: '16.06.2023 03:10 PM', isOwn: false },
            { id: 'm23', sender: 'Rossi Giuseppe', content: 'Meeting starting in 5 minutes. Zoom link is in the calendar invite.', timestamp: '16.06.2023 03:25 PM', isOwn: false },
            { id: 'm24', sender: 'Williams Sarah', content: 'Joining now.', timestamp: '16.06.2023 03:30 PM', isOwn: false },
            { id: 'm25', sender: 'Johnson Lisa', content: 'Me too.', timestamp: '16.06.2023 03:30 PM', isOwn: false },
            { id: 'm26', sender: 'Smith John', content: 'Running 5 mins late, start without me.', timestamp: '16.06.2023 03:31 PM', isOwn: false },
            { id: 'm27', sender: 'You', content: 'No problem. We\'ll cover the intro first.', timestamp: '16.06.2023 03:32 PM', isOwn: true },
            { id: 'm28', sender: 'Rossi Giuseppe', content: 'Good meeting everyone. Clear action items for tomorrow.', timestamp: '16.06.2023 04:30 PM', isOwn: false },
            { id: 'm29', sender: 'Anderson Michael', content: 'I\'ll have the revised charts by morning.', timestamp: '16.06.2023 04:45 PM', isOwn: false },
            { id: 'm30', sender: 'Williams Sarah', content: 'And I\'ll double check the final formatting.', timestamp: '16.06.2023 05:00 PM', isOwn: false },
            { id: 'm31', sender: 'You', content: 'Thanks all. Great effort today.', timestamp: '16.06.2023 05:15 PM', isOwn: true },
            { id: 'm32', sender: 'System', type: 'member_added', actor: 'System', targetUser: 'External Auditor', timestamp: '16.06.2023 06:00 PM' },
            { id: 'm33', sender: 'External Auditor', content: 'Hello, I have access to the files now. Will review tomorrow.', timestamp: '16.06.2023 06:15 PM', isOwn: false },
            { id: 'm34', sender: 'Rossi Giuseppe', content: 'Welcome aboard. Let us know if you need anything else.', timestamp: '16.06.2023 06:20 PM', isOwn: false },
            {
                id: 'm5',
                sender: 'Anderson Michael',
                content: 'Should we include the FX hedging gains in the main report or keep them in the appendix?',
                timestamp: '16.06.2023 12:00 PM',
                isOwn: false,
            },
            {
                id: 'm6',
                sender: 'You',
                content: 'Main report. They contributed significantly to our bottom line this quarter.',
                timestamp: '16.06.2023 12:15 PM',
                isOwn: true,
                isTodo: false,
            },
            {
                id: 'm7',
                sender: 'Williams Sarah',
                content: 'Agreed. I\'ll prepare a summary slide for the board presentation highlighting the hedging strategy.',
                timestamp: '16.06.2023 12:30 PM',
                isOwn: false,
            },
        ],
    },
    'f0a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c': { // Was '4'
        title: 'System migration & maintenance',
        lastUpdated: '15.06.2023 16:20',
        participants: 25,
        participantsList: [
            'Smith John',
            'Johnson Lisa',
            'IT Support Team (Group)',
            'Management Team (Group)',
            'Dev Ops (Group)'
        ],
        isUserRemoved: true,
        messages: [
            {
                id: 'm1',
                sender: 'Smith John',
                content: 'Maintenance notice: The main database migration will take place this Sunday at 02:00 AM. Expect up to 4 hours of downtime.',
                timestamp: '15.06.2023 02:00 PM',
                isOwn: false,
            },
            {
                id: 'm2',
                sender: 'Johnson Lisa',
                content: 'Will all backup systems be operational during the migration?',
                timestamp: '15.06.2023 02:30 PM',
                isOwn: false,
            },
            {
                id: 'm3',
                sender: 'You',
                content: 'Please ensure we have rollback procedures documented and tested before Sunday.',
                timestamp: '15.06.2023 03:00 PM',
                isOwn: true,
                isTodo: false,
                isRead: false
            },
            {
                id: 'm4',
                sender: 'Smith John',
                content: 'Yes, all backup systems will remain online. Rollback plan is ready and has been tested in staging.',
                timestamp: '15.06.2023 03:30 PM',
                isOwn: false,
                isRead: false
            },
            {
                id: 'm5',
                sender: 'You',
                content: 'Excellent. Make sure to notify all regional offices about the maintenance window.',
                timestamp: '15.06.2023 04:00 PM',
                isOwn: true,
                isTodo: false,
                isRead: false
            },
            {
                id: 'sys1',
                type: 'you_were_removed' as SystemMessageType,
                timestamp: '15.06.2023 04:45 PM',
                actor: 'Verdi Lucia',
                targetUser: `${CURRENT_USER_NAME} (you)`,
            },
        ],
    },
    '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d': { // Was '5'
        title: 'Recruitment strategy for Tech expansion',
        lastUpdated: '15.06.2023 14:00',
        participants: 3,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Johnson Lisa',
            'Smith John'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Johnson Lisa',
                content: 'We need to hire 5 new senior developers and 2 DevOps engineers by the end of Q3 to hit our product milestones.',
                timestamp: '15.06.2023 02:00 PM',
                isOwn: false,
                attachments: [
                    { id: 'att_c5_1', name: 'SENIOR_DEV_JD.PDF', type: 'PDF', size: '450 KB', category: 'document' },
                    { id: 'att_c5_2', name: 'DEVOPS_ENG_JD.PDF', type: 'PDF', size: '420 KB', category: 'document' }
                ]
            },
            {
                id: 'm2',
                sender: 'You',
                content: 'I agree. Let\'s focus on candidates with strong experience in AWS and secure coding practices.',
                timestamp: '15.06.2023 03:30 PM',
                isOwn: true,
            },
            {
                id: 'm3',
                sender: 'Smith John',
                content: 'I\'ve already reached out to three recruitment agencies. Should we also post on LinkedIn?',
                timestamp: '15.06.2023 04:00 PM',
                isOwn: false,
            },
            {
                id: 'm4',
                sender: 'Johnson Lisa',
                content: 'Yes, and let\'s leverage our employee referral program. We\'ve had good success with that in the past.',
                timestamp: '15.06.2023 04:30 PM',
                isOwn: false,
            },
            {
                id: 'm5',
                sender: 'You',
                content: 'Good idea. Let\'s offer a €2000 referral bonus for senior positions.',
                timestamp: '15.06.2023 05:00 PM',
                isOwn: true,
            },
        ],
    },
    '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b': { // Was '6'
        title: 'Partnership Agreement final draft',
        lastUpdated: '15.06.2023 17:30',
        participants: 6,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Anderson Michael',
            'Smith John',
            'Legal Advisor 1'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Anderson Michael',
                content: 'The final draft of the GTI partnership is ready. Please pay close attention to the IP ownership clauses in Section 8.',
                timestamp: '15.06.2023 03:00 PM',
                isOwn: false,
                attachments: [
                    { id: 'att_c6_1', name: 'GTI_PARTNETSHIP_AGREEMENT_FINAL.PDF', type: 'PDF', size: '3.8 MB', category: 'document' }
                ]
            },
            {
                id: 'm2',
                sender: 'Legal Advisor 1',
                content: 'I\'ve reviewed Section 8 and it aligns with our corporate standards. Ready for signature from my side.',
                timestamp: '15.06.2023 05:30 PM',
                isOwn: false,
            },
            {
                id: 'm3',
                sender: 'You',
                content: 'What about the revenue sharing model? Are we satisfied with the 60/40 split?',
                timestamp: '15.06.2023 06:00 PM',
                isOwn: true,
            },
            {
                id: 'm4',
                sender: 'Anderson Michael',
                content: 'Given their market position and our technology contribution, I think 60/40 is fair.',
                timestamp: '15.06.2023 06:15 PM',
                isOwn: false,
            },
            {
                id: 'm5',
                sender: 'Smith John',
                content: 'I agree. Plus, we retain full control over the core platform architecture.',
                timestamp: '15.06.2023 06:30 PM',
                isOwn: false,
                isRead: false
            },
        ],
    },
    '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f': { // Was '7'
        title: 'Syndicated Loan approval process',
        lastUpdated: '14.06.2023 11:20',
        participants: 4,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Müller Klaus',
            'Schmidt Anna',
            'Credit Committee'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Müller Klaus',
                content: 'The solar farm loan has been approved by the credit committee. Documentation will follow by EOD.',
                timestamp: '14.06.2023 11:20 AM',
                isOwn: false,
            },
            {
                id: 'm2',
                sender: 'You',
                content: 'Excellent news! What are the final terms?',
                timestamp: '14.06.2023 11:45 AM',
                isOwn: true,
            },
            {
                id: 'm3',
                sender: 'Schmidt Anna',
                content: '€500M at EURIBOR + 175 basis points, 15-year term with a 2-year grace period.',
                timestamp: '14.06.2023 12:00 PM',
                isOwn: false,
            },
            {
                id: 'm4',
                sender: 'Müller Klaus',
                content: 'We also secured quarterly payment flexibility and early repayment options without penalties.',
                timestamp: '14.06.2023 12:15 PM',
                isOwn: false,
            },
            {
                id: 'm5',
                sender: 'You',
                content: 'Those are very favorable terms. Great work team!',
                timestamp: '14.06.2023 12:30 PM',
                isOwn: true,
            },
        ],
    },
    '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d': { // Was '8'
        title: 'CRE Risk Analysis Report',
        lastUpdated: '14.06.2023 16:00',
        participants: 6,
        participantsList: [
            'Schmidt Anna',
            'Müller Klaus',
            'Risk Compliance Team'
        ],
        isUserRemoved: true,
        messages: [
            {
                id: 'm1',
                sender: 'Schmidt Anna',
                content: 'The commercial real estate portfolio shows increased risk in the retail segment. Recommend reduction in exposure.',
                timestamp: '14.06.2023 02:30 PM',
                isOwn: false,
                attachments: [
                    { id: 'att_c8_1', name: 'CRE_PORTFOLIO_RISK.PDF', type: 'PDF', size: '5.1 MB', category: 'document' },
                    { id: 'att_c8_2', name: 'VACANCY_RATES_CHART.PNG', type: 'PNG', size: '2.2 MB', category: 'image' }
                ]
            },
            {
                id: 'm2',
                sender: 'Müller Klaus',
                content: 'What\'s driving the increased risk? Is it vacancy rates or valuation concerns?',
                timestamp: '14.06.2023 03:00 PM',
                isOwn: false,
                isRead: false
            },
            {
                id: 'm3',
                sender: 'You',
                content: 'We should prioritize reducing exposure in secondary markets first. Focus on tier-1 cities.',
                timestamp: '14.06.2023 03:30 PM',
                isOwn: true,
                isTodo: false,
                isRead: false
            },
            {
                id: 'sys1',
                type: 'you_left_org' as SystemMessageType,
                timestamp: '14.06.2023 04:30 PM',
                targetUser: 'You',
                organization: CURRENT_USER_ORG,
            },
        ],
    },
    '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b': { // Was '9'
        title: 'Portfolio rebalancing strategy',
        lastUpdated: '13.06.2023 13:45',
        participants: 9,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Williams Sarah',
            'Thompson David',
            'Martinez Elena',
            'Chen Wei',
            'Portfolio Manager 1',
            'Portfolio Manager 2',
            'Analyst 1',
            'Analyst 2'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Williams Sarah',
                content: 'Team, based on recent market movements, I propose rebalancing our equity/bond ratio from 60/40 to 55/45. This would reduce short-term volatility while maintaining growth potential.',
                timestamp: '13.06.2023 10:00 AM',
                isOwn: false,
            },
            {
                id: 'm2',
                sender: 'You',
                content: 'Interesting proposal. What\'s the expected impact on our annual returns?',
                timestamp: '13.06.2023 01:45 PM',
                isOwn: true,
            },
            {
                id: 'm3',
                sender: 'Thompson David',
                content: 'Our simulations suggest a slight dip of 0.5% in nominal returns, but a significant 12% improvement in Sharpe ratio.',
                timestamp: '13.06.2023 02:15 PM',
                isOwn: false,
            },
            {
                id: 'm4',
                sender: 'Martinez Elena',
                content: 'I support this move. The bond yields are attractive right now.',
                timestamp: '13.06.2023 02:45 PM',
                isOwn: false,
            },
        ],
    },
    '123e4567-e89b-12d3-a456-426614174000': { // Was '10'
        title: 'Market analysis Q3 2023',
        lastUpdated: '13.06.2023 09:30',
        participants: 15,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Thompson David',
            'Martinez Elena',
            'Williams Sarah',
            'Chen Wei',
            'Research Team (Group)',
            'Strategy Team (Group)'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Thompson David',
                content: 'Q3 market outlook attached. Key trends: emerging markets showing strong recovery, tech sector consolidation continuing, ESG investments gaining momentum. Recommend maintaining defensive positions in developed markets.',
                timestamp: '13.06.2023 08:00 AM',
                isOwn: false,
                attachments: [
                    { id: 'att1', name: 'MARKET_OUTLOOK_Q3.PDF', type: 'PDF', size: '4.2 MB', category: 'document' },
                    { id: 'att2', name: 'ESG_CORE_METRICS.JPG', type: 'JPG', size: '1.8 MB', category: 'image' },
                    { id: 'att3', name: 'TECH_SECTOR_ANALYSIS.PDF', type: 'PDF', size: '3.5 MB', category: 'document' },
                    { id: 'att4', name: 'EMERGING_MKTS_DATA.CSV', type: 'CSV', size: '500 KB', category: 'document' }
                ]
            },
            {
                id: 'm2',
                sender: 'Martinez Elena',
                content: 'Excellent analysis David. The ESG section is particularly valuable. Should we schedule a strategy session?',
                timestamp: '13.06.2023 09:00 AM',
                isOwn: false,
            },
            {
                id: 'm3',
                sender: 'You',
                content: 'Yes, let\'s plan for next week. I\'d like to discuss the emerging markets opportunities in detail.',
                timestamp: '13.06.2023 09:30 AM',
                isOwn: true,
            },
        ],
    },
    'f47ac10b-58cc-4372-a567-0e02b2c3d479': { // Was '11'
        title: 'Client presentation materials',
        lastUpdated: '12.06.2023 16:45',
        participants: 5,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Martinez Elena',
            'Thompson David',
            'Designer',
            'Account Manager'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Martinez Elena',
                content: 'I\'ve prepared the client presentation deck for the Goldman meeting next week. Please review slides 15-22 regarding the new investment strategy.',
                timestamp: '12.06.2023 02:00 PM',
                isOwn: false,
                attachments: [
                    { id: 'att_c11_1', name: 'CLIENT_PRES_GOLDMAN_DRAFT.PDF', type: 'PDF', size: '12.5 MB', category: 'document' }
                ]
            },
            {
                id: 'm2',
                sender: 'You',
                content: 'Reviewed. Slides look great. Just one suggestion: add more detail on risk mitigation in slide 18.',
                timestamp: '12.06.2023 04:45 PM',
                isOwn: true,
            },
            {
                id: 'm3',
                sender: 'Thompson David',
                content: 'I can add the VaR charts to that section. Will have it done by tomorrow morning.',
                timestamp: '12.06.2023 05:15 PM',
                isOwn: false,
                attachments: [
                    { id: 'att_c11_2', name: 'VAR_ANALYSIS_CHARTS.JPG', type: 'JPG', size: '3.1 MB', category: 'image' }
                ]
            },
        ],
    },
    '550e8400-e29b-41d4-a716-446655440000': { // Was '12'
        title: 'Startup investment pipeline',
        lastUpdated: '12.06.2023 11:00',
        participants: 8,
        participantsList: [
            CURRENT_USER_DISPLAY,
            'Chen Wei',
            'Williams Sarah',
            'Anderson Michael',
            'Venture Analyst 1',
            'Venture Analyst 2',
            'Legal Advisor',
            'Tech Consultant'
        ],
        messages: [
            {
                id: 'm1',
                sender: 'Chen Wei',
                content: 'Our venture team has screened 47 startups this quarter. I\'ve shortlisted 8 promising candidates in fintech and healthcare sectors. Total potential investment: $12M across all opportunities.',
                timestamp: '12.06.2023 09:30 AM',
                isOwn: false,
            },
            {
                id: 'm2',
                sender: 'You',
                content: 'Great work Wei. Can you share the due diligence reports for the top 3 candidates?',
                timestamp: '12.06.2023 11:00 AM',
                isOwn: true,
            },
        ],
    },
};
