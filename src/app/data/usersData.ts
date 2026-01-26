/**
 * Users Data Structure
 *
 * This file defines the user structure and provides a central place
 * for user data management. Developers can replace this with their
 * own user data source (API, database, etc.)
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: 'bank_member' | 'company_member';
  isActive: boolean;
}

/**
 * Current logged-in user
 * In production, this would come from authentication context
 */
export const CURRENT_USER: User = {
  id: 'current-user',
  firstName: 'Iacob',
  lastName: 'Mihai',
  email: 'iacob.mihai@company.com',
  organization: 'Tesla S.p.a',
  role: 'company_member',
  isActive: true,
};

/**
 * Get the display name for the current user
 */
export function getCurrentUserDisplayName(): string {
  return `${CURRENT_USER.lastName} ${CURRENT_USER.firstName}`;
}

/**
 * Get the display name with (You) suffix for participant lists
 */
export function getCurrentUserWithYouSuffix(): string {
  return `${CURRENT_USER.lastName} ${CURRENT_USER.firstName} (You)`;
}

/**
 * Check if a participant name matches the current user
 */
export function isCurrentUser(participantName: string): boolean {
  const currentName = getCurrentUserDisplayName().toLowerCase();
  const nameWithYou = getCurrentUserWithYouSuffix().toLowerCase();
  const lowerName = participantName.toLowerCase();

  return lowerName === currentName ||
         lowerName === nameWithYou ||
         lowerName.includes('(you)');
}

/**
 * Format a user name for display in system messages
 * If it's the current user, returns "You" or the name with "(you)" suffix
 */
export function formatUserForSystemMessage(userName: string, includeYouSuffix: boolean = false): string {
  if (isCurrentUser(userName) || userName === 'You') {
    return includeYouSuffix ? `${getCurrentUserDisplayName()} (you)` : 'You';
  }
  return userName;
}

/**
 * Sample users database
 * In production, this would be fetched from an API
 */
export const usersDatabase: User[] = [
  CURRENT_USER,
  {
    id: 'user-1',
    firstName: 'Thomas',
    lastName: 'Wilson',
    email: 'wilson.thomas@unicredit.com',
    organization: 'UniCredit',
    role: 'bank_member',
    isActive: true,
  },
  {
    id: 'user-2',
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'rossi.mario@unicredit.com',
    organization: 'UniCredit',
    role: 'bank_member',
    isActive: true,
  },
  {
    id: 'user-3',
    firstName: 'Lucia',
    lastName: 'Verdi',
    email: 'verdi.lucia@unicredit.com',
    organization: 'UniCredit',
    role: 'bank_member',
    isActive: true,
  },
  {
    id: 'user-4',
    firstName: 'Valerie',
    lastName: 'Amebe',
    email: 'amebe.valerie@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-5',
    firstName: 'Marco',
    lastName: 'Bianchi',
    email: 'bianchi.marco@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-6',
    firstName: 'Wei',
    lastName: 'Chen',
    email: 'chen.wei@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-7',
    firstName: 'James',
    lastName: 'Fitzwilliam-Smith',
    email: 'james.fsmith@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-8',
    firstName: 'Olga',
    lastName: 'Wilson',
    email: 'wilson.olga@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-9',
    firstName: 'Giuseppe',
    lastName: 'Rossi',
    email: 'rossi.giuseppe@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-10',
    firstName: 'Klaus',
    lastName: 'Müller',
    email: 'muller.klaus@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-11',
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'schmidt.anna@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-12',
    firstName: 'Lisa',
    lastName: 'Johnson',
    email: 'johnson.lisa@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-13',
    firstName: 'John',
    lastName: 'Smith',
    email: 'smith.john@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-14',
    firstName: 'Michael',
    lastName: 'Anderson',
    email: 'anderson.michael@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-15',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'williams.sarah@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-16',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'thompson.david@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
  {
    id: 'user-17',
    firstName: 'Elena',
    lastName: 'Martinez',
    email: 'martinez.elena@company.com',
    organization: 'Tesla S.p.a',
    role: 'company_member',
    isActive: true,
  },
];

/**
 * Get a user by their display name (LastName FirstName format)
 */
export function getUserByDisplayName(displayName: string): User | undefined {
  const cleanName = displayName.replace(/\s*\(You\)\s*/i, '').trim();
  return usersDatabase.find(user => {
    const fullName = `${user.lastName} ${user.firstName}`;
    return fullName.toLowerCase() === cleanName.toLowerCase();
  });
}

/**
 * Check if a user is a bank member based on their name
 */
export function isBankMember(displayName: string): boolean {
  const user = getUserByDisplayName(displayName);
  if (user) {
    return user.role === 'bank_member';
  }
  // Fallback heuristic for names not in database
  const lowerName = displayName.toLowerCase();
  return lowerName.includes('unicredit') ||
         lowerName.includes('wilson thomas') ||
         lowerName.includes('rossi mario') ||
         lowerName.includes('verdi lucia');
}
