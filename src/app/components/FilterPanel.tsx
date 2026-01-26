
import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Switch from '@radix-ui/react-switch';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronDown, Search, X } from 'lucide-react';
import { CheckmarkIcon } from '@/app/components/NavIcons'; // Reuse existing checkmark
import { companies, members, Member } from '@/app/data/filterData';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Adjust if using custom styles, usually needs import or global css

// Icons for member types
function ClientIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
}

function BankerIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4 8 4v14" />
            <path d="M17 21v-8.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V21" />
        </svg>
    );
}

interface FilterPanelProps {
    onApply: (filters: any) => void;
    onCancel: () => void;
}

export function FilterPanel({ onApply, onCancel }: FilterPanelProps) {
    // Filter States
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
    const [unread, setUnread] = useState(false);
    const [todo, setTodo] = useState(false);
    const [attachments, setAttachments] = useState(false);

    // UI States
    const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
    const [companySearch, setCompanySearch] = useState('');
    const [memberSearch, setMemberSearch] = useState('');

    // Helpers
    const filteredCompanies = companies.filter(c => c.toLowerCase().includes(companySearch.toLowerCase()));
    const filteredMembers = members.filter(m =>
        (!selectedCompany || m.company === selectedCompany) &&
        m.name.toLowerCase().includes(memberSearch.toLowerCase())
    );

    // Handlers
    const handleApply = () => {
        onApply({
            company: selectedCompany,
            members: selectedMembers,
            dateRange,
            unread,
            todo,
            attachments
        });
    };

    const handleMemberToggle = (id: string) => {
        setSelectedMembers(prev =>
            prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
        );
    };

    const renderDropdownTrigger = (label: string, value: string | null | number, disabled = false) => (
        <div className={`flex items-center justify-between px-3 py-2 border rounded bg-white cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-[#ccc] hover:border-[#007a91]'}`}>
            <span className={`text-sm ${value ? 'text-[#262626]' : 'text-[#666]'} truncate`}>
                {value || label}
            </span>
            <ChevronDown size={16} className="text-[#666]" />
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto hover-scrollbar px-4 py-2">
                <Accordion.Root type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion} className="flex flex-col gap-4">

                    {/* Company and Member Accordion */}
                    <Accordion.Item value="company-member" className="border-b border-[#e6e6e6] pb-4">
                        <Accordion.Trigger className="flex items-center justify-between w-full py-2 hover:bg-gray-50 rounded group outline-none">
                            <span className="font-bold text-[#262626] text-base group-data-[state=open]:text-[#007a91]">Company and member</span>
                            <ChevronDown className="text-[#666] transition-transform duration-300 group-data-[state=open]:rotate-180" size={20} />
                        </Accordion.Trigger>
                        <Accordion.Content className="pt-2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                            <div className="flex flex-col gap-3">

                                {/* Company Dropdown */}
                                <Popover.Root>
                                    <Popover.Trigger asChild>
                                        {renderDropdownTrigger("Select company", selectedCompany)}
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Content className="w-[300px] bg-white rounded shadow-lg border border-[#e6e6e6] p-2 z-50 animate-in fade-in zoom-in-95" align="start" sideOffset={5}>
                                            <div className="flex items-center px-2 py-1.5 border border-[#ccc] rounded mb-2">
                                                <Search size={14} className="text-[#666] mr-2" />
                                                <input
                                                    className="flex-1 text-sm outline-none"
                                                    placeholder="Search"
                                                    value={companySearch}
                                                    onChange={e => setCompanySearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="max-h-[200px] overflow-y-auto hover-scrollbar flex flex-col">
                                                {filteredCompanies.map(company => (
                                                    <div
                                                        key={company}
                                                        onClick={() => { setSelectedCompany(company); setCompanySearch(''); }}
                                                        className="flex items-center gap-2 px-2 py-2 hover:bg-[#e7f8fb] rounded cursor-pointer"
                                                    >
                                                        <Checkbox.Root checked={selectedCompany === company} className="w-4 h-4 border border-[#666] rounded flex items-center justify-center bg-white data-[state=checked]:bg-[#007a91] data-[state=checked]:border-[#007a91]">
                                                            <Checkbox.Indicator><CheckmarkIcon /></Checkbox.Indicator>
                                                        </Checkbox.Root>
                                                        <span className="text-sm text-[#262626]">{company}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>

                                {/* Member Dropdown */}
                                <Popover.Root>
                                    <Popover.Trigger asChild disabled={!selectedCompany}>
                                        {renderDropdownTrigger("Select member", selectedMembers.length > 0 ? `(${selectedMembers.length})` : null, !selectedCompany)}
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Content className="w-[300px] bg-white rounded shadow-lg border border-[#e6e6e6] p-2 z-50 animate-in fade-in zoom-in-95" align="start" sideOffset={5}>
                                            <div className="flex items-center px-2 py-1.5 border border-[#ccc] rounded mb-2">
                                                <Search size={14} className="text-[#666] mr-2" />
                                                <input
                                                    className="flex-1 text-sm outline-none"
                                                    placeholder="Search"
                                                    value={memberSearch}
                                                    onChange={e => setMemberSearch(e.target.value)}
                                                />
                                            </div>

                                            {!selectedCompany ? (
                                                <div className="p-2 text-sm text-[#666] text-center">Please select a company first</div>
                                            ) : (
                                                <div className="max-h-[200px] overflow-y-auto hover-scrollbar flex flex-col gap-1">
                                                    {filteredMembers.map(member => (
                                                        <div
                                                            key={member.id}
                                                            onClick={() => handleMemberToggle(member.id)}
                                                            className="flex items-start gap-2 px-2 py-2 hover:bg-[#e7f8fb] rounded cursor-pointer"
                                                        >
                                                            <div className="pt-0.5">
                                                                <Checkbox.Root checked={selectedMembers.includes(member.id)} className="w-4 h-4 border border-[#666] rounded flex items-center justify-center bg-white data-[state=checked]:bg-[#007a91] data-[state=checked]:border-[#007a91]">
                                                                    <Checkbox.Indicator><CheckmarkIcon /></Checkbox.Indicator>
                                                                </Checkbox.Root>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-1.5">
                                                                    {member.type === 'client' ? <ClientIcon /> : <BankerIcon />}
                                                                    <span className="text-sm font-bold text-[#262626]">{member.name}</span>
                                                                </div>
                                                                <span className="text-xs text-[#666] ml-5">
                                                                    {member.type === 'client' ? member.company : `${member.company} | ${member.role}`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>

                            </div>
                        </Accordion.Content>
                    </Accordion.Item>

                    {/* Time Period Accordion */}
                    <Accordion.Item value="time-period" className="border-b border-[#e6e6e6] pb-4">
                        <Accordion.Trigger className="flex items-center justify-between w-full py-2 hover:bg-gray-50 rounded group outline-none">
                            <span className="font-bold text-[#262626] text-base group-data-[state=open]:text-[#007a91]">Time period</span>
                            <ChevronDown className="text-[#666] transition-transform duration-300 group-data-[state=open]:rotate-180" size={20} />
                        </Accordion.Trigger>
                        <Accordion.Content className="pt-2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                            <div className="flex gap-2">
                                {/* From Date */}
                                {/* To Date */}
                                {/* Note: Implementing full calendar might be overkill but I will use DayPicker if possible or simple inputs for now to fit logic "cat de mult poti tu" */}
                                {/* Actually user showed a nice double calendar. I'll mock the TRIGGER first. The content can be a DayPicker. */}

                                <div className="w-full flex flex-col gap-2">
                                    <style>{`.rdp { --rdp-cell-size: 32px; --rdp-accent-color: #007a91; margin: 0; } .rdp-day_selected:not([disabled]) { background-color: #007a91; }`}</style>
                                    <DayPicker
                                        mode="range"
                                        selected={dateRange}
                                        // onSelect={setDateRange} // Type handling might be tricky with simple state
                                        // simplified:
                                        onSelect={(range: any) => setDateRange(range)}
                                        styles={{
                                            caption: { color: '#262626' }
                                        }}
                                    />
                                </div>
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>

                {/* Toggles */}
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between py-2 border-b border-[#e6e6e6]">
                        <span className="font-bold text-[#262626]">Unread</span>
                        <Switch.Root checked={unread} onCheckedChange={setUnread} className="w-[42px] h-[24px] bg-[#e6e6e6] rounded-full relative data-[state=checked]:bg-[#262626] outline-none cursor-pointer">
                            <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                        </Switch.Root>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#e6e6e6]">
                        <span className="font-bold text-[#262626]">To-do</span>
                        <Switch.Root checked={todo} onCheckedChange={setTodo} className="w-[42px] h-[24px] bg-[#e6e6e6] rounded-full relative data-[state=checked]:bg-[#262626] outline-none cursor-pointer">
                            <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                        </Switch.Root>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#e6e6e6]">
                        <span className="font-bold text-[#262626]">Attachments</span>
                        <Switch.Root checked={attachments} onCheckedChange={setAttachments} className="w-[42px] h-[24px] bg-[#e6e6e6] rounded-full relative data-[state=checked]:bg-[#262626] outline-none cursor-pointer">
                            <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                        </Switch.Root>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#e6e6e6] flex items-center justify-between bg-white mt-auto">
                <button onClick={onCancel} className="px-4 py-2 border border-[#262626] rounded text-[#262626] font-bold text-sm uppercase hover:bg-gray-50">
                    Cancel
                </button>
                <button onClick={handleApply} className="px-4 py-2 bg-[#007a91] rounded text-white font-bold text-sm uppercase hover:bg-[#006577]">
                    Apply
                </button>
            </div>
        </div>
    );
}
