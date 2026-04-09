export interface Company {
  id: string
  name: string
}

export interface Recipient {
  id: string
  name: string
  role: string
  companyId: string
  outOfOffice?: {
    isOoo: boolean
    returnDate: string
  }
}

export const mockCompanies: Company[] = [
  { id: 'apex', name: 'ApexTech Solutions' },
  { id: 'carrefour', name: 'Carrefour S.P.A.' },
  { id: 'bluesky', name: 'BlueSky Ventures' },
  { id: 'metro', name: 'Metro' },
  { id: 'lastcompany', name: 'Lastcompany S.P.A.' },
  { id: 'globaltech', name: 'GlobalTech Industries' },
]

export const mockRecipients: Recipient[] = [
  // ApexTech Solutions
  { id: 'r1', name: 'Verdi Francesca', role: 'Electronic Banking Specialist', companyId: 'apex' },
  { id: 'r2', name: 'White Mary', role: 'Relationship Manager', companyId: 'apex' },
  { id: 'r3', name: 'Pedroso Javier', role: 'Electronic Banking Specialist', outOfOffice: { isOoo: true, returnDate: '13.03.2025' }, companyId: 'apex' },
  { id: 'rooo1', name: 'Mihai Iacob', role: 'IT Director', outOfOffice: { isOoo: true, returnDate: '13.03.2025' }, companyId: 'apex' },
  { id: 'r4', name: 'Milai Alex', role: 'Electronic Banking Specialist', companyId: 'apex' },
  { id: 'r5', name: 'White Olga', role: 'E-Banking', companyId: 'apex' },
  { id: 'r6', name: 'Wilson Olga', role: 'Account Manager', companyId: 'apex' },
  { id: 'r7', name: 'Smith Alexander', role: 'Senior Consultant', companyId: 'apex' },
  { id: 'r8', name: 'Johnson Olga', role: 'Financial Advisor', companyId: 'apex' },
  { id: 'r9', name: 'Bennett Olivia', role: 'Customer Service', companyId: 'apex' },
  { id: 'r10', name: 'Masterman Erika Maximillian', role: 'Operations Manager', companyId: 'apex' },

  // Carrefour S.P.A.
  { id: 'r11', name: 'Rossi Marco', role: 'Electronic Banking Specialist', companyId: 'carrefour' },
  { id: 'r12', name: 'Bianchi Laura', role: 'Relationship Manager', companyId: 'carrefour' },
  { id: 'r13', name: 'Ferrari Giuseppe', role: 'E-Banking', companyId: 'carrefour' },
  { id: 'r14', name: 'Romano Sofia', role: 'Account Manager', companyId: 'carrefour' },
  { id: 'r15', name: 'Colombo Andrea', role: 'Financial Advisor', companyId: 'carrefour' },
  { id: 'r16', name: 'Ricci Valentina', role: 'Customer Service', companyId: 'carrefour' },
  { id: 'r17', name: 'Marino Luca', role: 'Operations Manager', companyId: 'carrefour' },
  { id: 'r18', name: 'Greco Chiara', role: 'Senior Consultant', companyId: 'carrefour' },
  { id: 'r19', name: 'Bruno Alessandro', role: 'Electronic Banking Specialist', companyId: 'carrefour' },
  { id: 'r20', name: 'Gallo Martina', role: 'Relationship Manager', companyId: 'carrefour' },

  // BlueSky Ventures
  { id: 'r21', name: 'Anderson James', role: 'Electronic Banking Specialist', companyId: 'bluesky' },
  { id: 'r22', name: 'Taylor Emma', role: 'Relationship Manager', companyId: 'bluesky' },
  { id: 'r23', name: 'Thomas Michael', role: 'E-Banking', companyId: 'bluesky' },
  { id: 'r24', name: 'Jackson Olivia', role: 'Account Manager', companyId: 'bluesky' },
  { id: 'r25', name: 'White Daniel', role: 'Financial Advisor', companyId: 'bluesky' },
  { id: 'r26', name: 'Harris Sophia', role: 'Customer Service', companyId: 'bluesky' },
  { id: 'r27', name: 'Martin William', role: 'Operations Manager', companyId: 'bluesky' },
  { id: 'r28', name: 'Thompson Isabella', role: 'Senior Consultant', companyId: 'bluesky' },
  { id: 'r29', name: 'Garcia Matthew', role: 'Electronic Banking Specialist', companyId: 'bluesky' },
  { id: 'r30', name: 'Martinez Ava', role: 'Relationship Manager', companyId: 'bluesky' },

  // Metro
  { id: 'r31', name: 'Schmidt Hans', role: 'Electronic Banking Specialist', companyId: 'metro' },
  { id: 'r32', name: 'Muller Anna', role: 'Relationship Manager', companyId: 'metro' },
  { id: 'r33', name: 'Weber Klaus', role: 'E-Banking', companyId: 'metro' },
  { id: 'r34', name: 'Meyer Petra', role: 'Account Manager', companyId: 'metro' },
  { id: 'r35', name: 'Wagner Thomas', role: 'Financial Advisor', companyId: 'metro' },
  { id: 'r36', name: 'Becker Sabine', role: 'Customer Service', companyId: 'metro' },
  { id: 'r37', name: 'Schulz Michael', role: 'Operations Manager', companyId: 'metro' },
  { id: 'r38', name: 'Hoffmann Julia', role: 'Senior Consultant', companyId: 'metro' },
  { id: 'r39', name: 'Koch Stefan', role: 'Electronic Banking Specialist', companyId: 'metro' },
  { id: 'r40', name: 'Richter Maria', role: 'Relationship Manager', companyId: 'metro' },

  // Lastcompany S.P.A.
  { id: 'r41', name: 'Conti Paolo', role: 'Electronic Banking Specialist', companyId: 'lastcompany' },
  { id: 'r42', name: 'Esposito Elena', role: 'Relationship Manager', companyId: 'lastcompany' },
  { id: 'r43', name: 'Mancini Roberto', role: 'E-Banking', companyId: 'lastcompany' },
  { id: 'r44', name: 'Santoro Giulia', role: 'Account Manager', companyId: 'lastcompany' },
  { id: 'r45', name: 'Vitale Davide', role: 'Financial Advisor', companyId: 'lastcompany' },
  { id: 'r46', name: 'Lombardi Alessia', role: 'Customer Service', companyId: 'lastcompany' },
  { id: 'r47', name: 'Moretti Simone', role: 'Operations Manager', companyId: 'lastcompany' },
  { id: 'r48', name: 'Barbieri Francesca', role: 'Senior Consultant', companyId: 'lastcompany' },
  { id: 'r49', name: 'Fontana Lorenzo', role: 'Electronic Banking Specialist', companyId: 'lastcompany' },
  { id: 'r50', name: 'Caruso Silvia', role: 'Relationship Manager', companyId: 'lastcompany' },

  // GlobalTech Industries
  { id: 'r51', name: 'Chen Wei', role: 'Electronic Banking Specialist', companyId: 'globaltech' },
  { id: 'r52', name: 'Kim Soo-Jin', role: 'Relationship Manager', companyId: 'globaltech' },
  { id: 'r53', name: 'Patel Raj', role: 'E-Banking', companyId: 'globaltech' },
  { id: 'r54', name: 'Nguyen Linh', role: 'Account Manager', companyId: 'globaltech' },
  { id: 'r55', name: 'Singh Priya', role: 'Financial Advisor', companyId: 'globaltech' },
  { id: 'r56', name: 'Wang Li', role: 'Customer Service', companyId: 'globaltech' },
  { id: 'r57', name: 'Kumar Amit', role: 'Operations Manager', companyId: 'globaltech' },
  { id: 'r58', name: 'Lee Min-Ho', role: 'Senior Consultant', companyId: 'globaltech' },
  { id: 'r59', name: 'Zhang Xiao', role: 'Electronic Banking Specialist', companyId: 'globaltech' },
  { id: 'r60', name: 'Park Ji-Woo', role: 'Relationship Manager', companyId: 'globaltech' },
]
