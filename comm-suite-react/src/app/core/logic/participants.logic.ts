import { mockRecipients } from '../data/companies.mock'
import type { Recipient } from '../data/companies.mock'

export interface ParticipantCompanyMapping {
  name: string
  company: string
  type: 'client' | 'banker'
}

const participantCompanyMap: ParticipantCompanyMapping[] = [
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
  { name: 'Muller Klaus', company: 'Euro Bank AG', type: 'banker' },
  { name: 'Schmidt Anna', company: 'Euro Bank AG', type: 'banker' },
  { name: 'Williams Sarah', company: 'Financial Advisors Inc.', type: 'client' },
  { name: 'Martinez Elena', company: 'Apex Consulting Group', type: 'client' },
  { name: 'Thompson David', company: 'Financial Advisors Inc.', type: 'client' },
  { name: 'Rossi Giuseppe', company: 'Carrefour S.P.A.', type: 'client' },
  { name: 'Research Team (Group)', company: 'UniCredit', type: 'banker' },
  { name: 'Strategy Team (Group)', company: 'UniCredit', type: 'banker' },
]

export function getCompanyForParticipant(participantName: string): string | null {
  const cleanName = participantName.replace(' (You)', '').trim()
  const participant = participantCompanyMap.find((p) => p.name === cleanName)
  return participant ? participant.company : null
}

export function getCompaniesFromParticipants(participantNames: string[]): string[] {
  const companies = new Set<string>()

  participantNames.forEach((name) => {
    const company = getCompanyForParticipant(name)
    if (company) {
      companies.add(company)
    }
  })

  return Array.from(companies)
}

export function getParticipantType(participantName: string): 'client' | 'banker' | null {
  const cleanName = participantName.replace(' (You)', '').trim()
  const participant = participantCompanyMap.find((p) => p.name === cleanName)
  return participant ? participant.type : null
}

export function getRecipientByName(name: string): Recipient | undefined {
  const cleanName = name.replace(' (You)', '').trim()
  return mockRecipients.find((r) => r.name.toLowerCase() === cleanName.toLowerCase())
}
