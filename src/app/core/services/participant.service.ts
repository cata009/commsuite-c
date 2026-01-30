import { Injectable } from '@angular/core';
import { mockRecipients, Recipient } from '../data/companies.mock';

export interface ParticipantCompanyMapping {
    name: string;
    company: string;
    type: 'client' | 'banker';
}

@Injectable({
    providedIn: 'root'
})
export class ParticipantService {
    // Centralized mapping of participants to companies
    private participantCompanyMap: ParticipantCompanyMapping[] = [
        { name: 'Wilson Thomas', company: 'UniCredit', type: 'banker' },
        { name: 'Rossi Mario', company: 'UniCredit', type: 'banker' },
        { name: 'Verdi Lucia', company: 'Carrefour S.P.A.', type: 'client' },
        { name: 'Fitzwilliam-Smith James', company: 'Technology Solution', type: 'client' },
        { name: 'Amebe Valerie', company: 'Delta Industries Inc.', type: 'client' },
        { name: 'Bianchi Marco', company: 'Ferrari S.P.A.', type: 'client' },
        { name: 'Chen Wei', company: 'General Electric', type: 'client' },
        { name: 'Cyrus Lucy', company: 'Carrefour S.P.A.', type: 'client' },
        { name: 'Lewis Kelly', company: 'Technology Solution', type: 'client' },
        { name: 'Rossi Lucia', company: 'Carrefour S.P.A.', type: 'banker' },
        { name: 'Rossi Johnny', company: 'Carrefour S.P.A.', type: 'banker' },
        { name: 'Ferrari Enzo', company: 'Ferrari S.P.A.', type: 'client' },
        { name: 'Smith John', company: 'Tech Solutions Inc.', type: 'client' },
        { name: 'Johnson Lisa', company: 'Tech Solutions Inc.', type: 'client' },
        { name: 'Anderson Michael', company: 'Global Ventures Ltd.', type: 'client' },
        { name: 'Müller Klaus', company: 'Euro Bank AG', type: 'banker' },
        { name: 'Schmidt Anna', company: 'Euro Bank AG', type: 'banker' },
        { name: 'Williams Sarah', company: 'Financial Advisors Inc.', type: 'client' },
        { name: 'Martinez Elena', company: 'Apex Consulting Group', type: 'client' },
        { name: 'Thompson David', company: 'Financial Advisors Inc.', type: 'client' },
        { name: 'Rossi Giuseppe', company: 'Carrefour S.P.A.', type: 'client' },
        { name: 'Research Team (Group)', company: 'UniCredit', type: 'banker' },
        { name: 'Strategy Team (Group)', company: 'UniCredit', type: 'banker' },
    ];

    constructor() { }

    /**
     * Get company for a participant by name
     */
    getCompanyForParticipant(participantName: string): string | null {
        // Remove "(You)" suffix if present
        const cleanName = participantName.replace(' (You)', '').trim();
        const participant = this.participantCompanyMap.find(p => p.name === cleanName);
        return participant ? participant.company : null;
    }

    /**
     * Get unique companies from a list of participant names
     */
    getCompaniesFromParticipants(participantNames: string[]): string[] {
        const companies = new Set<string>();

        participantNames.forEach(name => {
            const company = this.getCompanyForParticipant(name);
            if (company) {
                companies.add(company);
            }
        });

        return Array.from(companies);
    }

    /**
     * Get participant type (client or banker)
     */
    getParticipantType(participantName: string): 'client' | 'banker' | null {
        const cleanName = participantName.replace(' (You)', '').trim();
        const participant = this.participantCompanyMap.find(p => p.name === cleanName);
        return participant ? participant.type : null;
    }

    /**
     * Get full recipient details including OOO status
     */
    getRecipientByName(name: string): Recipient | undefined {
        const cleanName = name.replace(' (You)', '').trim();
        // Case insensitive search
        return mockRecipients.find(r => r.name.toLowerCase() === cleanName.toLowerCase());
    }
}
