export interface Member {
  id: string
  name: string
  company: string
  role?: string
  type: 'client' | 'banker'
}

export const companies = [
  'Carrefour S.P.A.',
  'Delta Industries Inc.',
  'Ferrari S.P.A.',
  'General Electric',
  'IllumiTech',
  'LastCompany S.P.A.',
  'Technology Solution',
]

export const members: Member[] = [
  { id: '1', name: 'Cyrus Lucy', company: 'Carrefour S.P.A.', type: 'client' },
  { id: '2', name: 'Lewis Kelly', company: 'Technology Solution', type: 'client' },
  { id: '3', name: 'Rossi Lucia', company: 'Carrefour S.P.A.', role: 'Sales Representative', type: 'banker' },
  { id: '4', name: 'Rossi Johnny', company: 'Carrefour S.P.A.', role: 'Manager', type: 'banker' },
  { id: '5', name: 'Ferrari Enzo', company: 'Ferrari S.P.A.', type: 'client' },
]
