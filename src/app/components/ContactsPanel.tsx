import { useState } from 'react';
import { Search, Mail, Phone, Building } from 'lucide-react';

export function ContactsPanel() {
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = [
    {
      id: '1',
      name: 'Amebe Valerie',
      role: 'Senior Investment Manager',
      company: 'LASTCOMPANY S.P.A.',
      email: 'v.amebe@lastcompany.com',
      phone: '+39 02 1234 5678',
      initials: 'AV',
      color: '#007a91',
    },
    {
      id: '2',
      name: 'Bianchi Marco',
      role: 'Portfolio Director',
      company: 'CARREFOUR S.P.A.',
      email: 'm.bianchi@carrefour.it',
      phone: '+39 02 8765 4321',
      initials: 'BM',
      color: '#e2001a',
    },
    {
      id: '3',
      name: 'Rossi Giuseppe',
      role: 'Financial Analyst',
      company: 'CARREFOUR S.P.A.',
      email: 'g.rossi@carrefour.it',
      phone: '+39 02 5555 6666',
      initials: 'RG',
      color: '#666',
    },
    {
      id: '4',
      name: 'Smith John',
      role: 'IT Director',
      company: 'TECH SOLUTIONS INC.',
      email: 'j.smith@techsolutions.com',
      phone: '+1 555 123 4567',
      initials: 'SJ',
      color: '#007a91',
    },
    {
      id: '5',
      name: 'Johnson Lisa',
      role: 'Operations Manager',
      company: 'TECH SOLUTIONS INC.',
      email: 'l.johnson@techsolutions.com',
      phone: '+1 555 987 6543',
      initials: 'JL',
      color: '#e2001a',
    },
    {
      id: '6',
      name: 'Ferrari Andrea',
      role: 'Compliance Officer',
      company: 'LASTCOMPANY S.P.A.',
      email: 'a.ferrari@lastcompany.com',
      phone: '+39 02 3333 4444',
      initials: 'FA',
      color: '#666',
    },
    {
      id: '7',
      name: 'Costa Maria',
      role: 'Risk Manager',
      company: 'CARREFOUR S.P.A.',
      email: 'm.costa@carrefour.it',
      phone: '+39 02 7777 8888',
      initials: 'CM',
      color: '#007a91',
    },
    {
      id: '8',
      name: 'Williams Robert',
      role: 'Security Specialist',
      company: 'TECH SOLUTIONS INC.',
      email: 'r.williams@techsolutions.com',
      phone: '+1 555 246 8642',
      initials: 'WR',
      color: '#e2001a',
    },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto message-list-scrollbar">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#262626] mb-6">Contacts</h2>

        {/* Search */}
        <div className="mb-6 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search size={18} className="text-[#666]" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#ccc] rounded-md focus:outline-none focus:border-[#007a91] transition-colors"
          />
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-[#e6e6e6] rounded-lg p-5 hover:border-[#007a91] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: contact.color }}
                >
                  {contact.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#262626] text-lg mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-[#666] mb-1">{contact.role}</p>

                  <div className="flex items-center gap-2 text-sm text-[#666] mb-3">
                    <Building size={12} />
                    <span className="uppercase text-xs">{contact.company}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#262626]">
                      <Mail size={14} className="text-[#666]" />
                      <a href={`mailto:${contact.email}`} className="hover:text-[#007a91] hover:underline">
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#262626]">
                      <Phone size={14} className="text-[#666]" />
                      <a href={`tel:${contact.phone}`} className="hover:text-[#007a91]">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-[#666]">
            <p>No contacts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
