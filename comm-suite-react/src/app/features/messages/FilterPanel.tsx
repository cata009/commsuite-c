import { useEffect, useMemo, useRef, useState } from 'react'
import AppIcon from '../../../shared/icons/AppIcon'
import Checkbox from '../../shared/Checkbox'
import { companies as allCompanies, members as allMembers } from '../../core/data/filter.mock'
import type { FilterOptions } from '../../core/models'

export interface FilterPanelProps {
  initialFilters: FilterOptions
  onApply: (filters: FilterOptions) => void
  onCancel: () => void
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div
      className={`w-[42px] h-[24px] rounded-full relative cursor-pointer transition-colors ${
        checked ? 'bg-unicredit-text' : 'bg-unicredit-gray'
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full transition-all duration-200 shadow-sm ${
          checked ? 'left-[20px]' : 'left-[2px]'
        }`}
      ></div>
    </div>
  )
}

export default function FilterPanel({ initialFilters, onApply, onCancel }: FilterPanelProps) {
  const [openSection, setOpenSection] = useState<string | undefined>(undefined)

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [unread, setUnread] = useState(false)
  const [todo, setTodo] = useState(false)
  const [attachments, setAttachments] = useState(false)

  const [isCompanyOpen, setIsCompanyOpen] = useState(false)
  const [isMemberOpen, setIsMemberOpen] = useState(false)

  const [companySearch, setCompanySearch] = useState('')
  const [memberSearch, setMemberSearch] = useState('')

  const companyRef = useRef<HTMLDivElement | null>(null)
  const memberRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!initialFilters) return

    setSelectedCompanies([...(initialFilters.companies || [])])
    setSelectedMembers([...(initialFilters.members || [])])
    setUnread(initialFilters.unread)
    setTodo(initialFilters.todo)
    setAttachments(initialFilters.attachments)

    if (initialFilters.dateRange?.from) {
      setFromDate(initialFilters.dateRange.from.toISOString().split('T')[0])
    }
    if (initialFilters.dateRange?.to) {
      setToDate(initialFilters.dateRange.to.toISOString().split('T')[0])
    }
  }, [initialFilters])

  useEffect(() => {
    if (!isCompanyOpen && !isMemberOpen) return

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (isCompanyOpen && companyRef.current && !companyRef.current.contains(target)) {
        setIsCompanyOpen(false)
      }
      if (isMemberOpen && memberRef.current && !memberRef.current.contains(target)) {
        setIsMemberOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isCompanyOpen, isMemberOpen])

  const filteredCompanies = useMemo(
    () => allCompanies.filter((c) => c.toLowerCase().includes(companySearch.toLowerCase())),
    [companySearch],
  )

  const filteredMembers = useMemo(() => {
    return allMembers.filter((m) => {
      const matchesCompany =
        selectedCompanies.length === 0 || selectedCompanies.includes(m.company)
      const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase())
      return matchesCompany && matchesSearch
    })
  }, [memberSearch, selectedCompanies])

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? undefined : section))
  }

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company],
    )
  }

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const applyFilters = () => {
    onApply({
      companies: selectedCompanies,
      members: selectedMembers,
      dateRange: {
        from: fromDate ? new Date(fromDate) : undefined,
        to: toDate ? new Date(toDate) : undefined,
      },
      unread,
      todo,
      attachments,
    })
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto px-4 py-2 hover-scrollbar">
        <div className="border-b border-unicredit-gray">
          <button
            className="flex items-center justify-between w-full py-4 rounded group outline-none"
            onClick={() => toggleSection('company-member')}
          >
            <span
              className={`font-bold text-unicredit-text text-base group-hover:text-unicredit-primary ${
                openSection === 'company-member' ? 'text-unicredit-primary' : ''
              }`}
            >
              Company and member
            </span>
            <AppIcon
              name="chevron-down"
              size={20}
              className={`transition-transform duration-300 group-hover:text-unicredit-primary ${
                openSection === 'company-member'
                  ? 'rotate-180 text-unicredit-primary'
                  : 'text-unicredit-text-secondary'
              }`}
            />
          </button>

          {openSection === 'company-member' && (
            <div className="pt-2 pb-4 flex flex-col gap-3 animate-slideDown">
              <div ref={companyRef} className="relative">
                <div
                  onClick={() => setIsCompanyOpen((prev) => !prev)}
                  className={`flex items-center justify-between px-3 py-2 border rounded bg-white cursor-pointer hover:border-unicredit-primary ${
                    isCompanyOpen ? 'border-unicredit-primary' : 'border-unicredit-gray-divider'
                  }`}
                >
                  <span
                    className={`text-sm truncate ${
                      selectedCompanies.length > 0 ? 'text-unicredit-text' : 'text-unicredit-text-secondary'
                    }`}
                  >
                    {selectedCompanies.length > 0
                      ? `${selectedCompanies.length} companies selected`
                      : 'Select company'}
                  </span>
                  <AppIcon name="chevron-down" size={16} className="text-unicredit-text-secondary" />
                </div>

                {isCompanyOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white rounded shadow-lg border border-unicredit-gray p-2 z-50">
                    <div className="flex items-center px-2 py-1.5 border border-unicredit-gray-divider rounded mb-2">
                      <AppIcon name="search" size={14} className="mr-2 text-unicredit-text-secondary" />
                      <input
                        className="flex-1 text-sm outline-none"
                        placeholder="Search"
                        value={companySearch}
                        onChange={(event) => setCompanySearch(event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto flex flex-col hover-scrollbar">
                      {filteredCompanies.map((company) => (
                        <div
                          key={company}
                          onClick={() => toggleCompany(company)}
                          className="flex items-center gap-2 px-2 py-2 hover:bg-unicredit-primary-light rounded cursor-pointer"
                        >
                          <div className="pointer-events-none">
                            <Checkbox checked={selectedCompanies.includes(company)} />
                          </div>
                          <span className="text-sm text-unicredit-text">{company}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={memberRef} className="relative">
                <div
                  onClick={() => setIsMemberOpen((prev) => !prev)}
                  className={`flex items-center justify-between px-3 py-2 border rounded bg-white cursor-pointer hover:border-unicredit-primary ${
                    isMemberOpen ? 'border-unicredit-primary' : 'border-unicredit-gray-divider'
                  }`}
                >
                  <span
                    className={`text-sm truncate ${
                      selectedMembers.length > 0 ? 'text-unicredit-text' : 'text-unicredit-text-secondary'
                    }`}
                  >
                    {selectedMembers.length > 0
                      ? `Select member (${selectedMembers.length})`
                      : 'Select member'}
                  </span>
                  <AppIcon name="chevron-down" size={16} className="text-unicredit-text-secondary" />
                </div>

                {isMemberOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white rounded shadow-lg border border-unicredit-gray p-2 z-50">
                    <div className="flex items-center px-2 py-1.5 border border-unicredit-gray-divider rounded mb-2">
                      <AppIcon name="search" size={14} className="mr-2 text-unicredit-text-secondary" />
                      <input
                        className="flex-1 text-sm outline-none"
                        placeholder="Search"
                        value={memberSearch}
                        onChange={(event) => setMemberSearch(event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto flex flex-col gap-1 hover-scrollbar">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => toggleMember(member.id)}
                          className="flex items-start gap-2 px-2 py-2 hover:bg-unicredit-primary-light rounded cursor-pointer"
                        >
                          <div className="pointer-events-none mt-0.5">
                            <Checkbox checked={selectedMembers.includes(member.id)} />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 font-bold text-unicredit-text">
                              <AppIcon
                                name={member.type === 'banker' ? 'member-bank' : 'member-client'}
                                size={16}
                              />
                              <span className="text-sm">{member.name}</span>
                            </div>
                            <span className="text-xs text-unicredit-text-secondary ml-5">
                              {member.type === 'client'
                                ? member.company
                                : `${member.company} | ${member.role ?? ''}`}
                            </span>
                          </div>
                        </div>
                      ))}
                      {filteredMembers.length === 0 && (
                        <div className="px-2 py-2 text-sm text-unicredit-text-secondary text-center">
                          No members found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-unicredit-gray">
          <button
            className="flex items-center justify-between w-full py-4 rounded group outline-none"
            onClick={() => toggleSection('time-period')}
          >
            <span
              className={`font-bold text-unicredit-text text-base group-hover:text-unicredit-primary ${
                openSection === 'time-period' ? 'text-unicredit-primary' : ''
              }`}
            >
              Time period
            </span>
            <AppIcon
              name="chevron-down"
              size={20}
              className={`transition-transform duration-300 group-hover:text-unicredit-primary ${
                openSection === 'time-period'
                  ? 'rotate-180 text-unicredit-primary'
                  : 'text-unicredit-text-secondary'
              }`}
            />
          </button>
          {openSection === 'time-period' && (
            <div className="pt-2 pb-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="flex-1 p-2 border border-unicredit-gray-divider rounded text-sm focus:border-unicredit-primary outline-none"
                />
                <span className="text-unicredit-text-secondary">-</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="flex-1 p-2 border border-unicredit-gray-divider rounded text-sm focus:border-unicredit-primary outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col mt-2">
          <div className="flex items-center justify-between py-4 border-b border-unicredit-gray">
            <span className="font-bold text-unicredit-text">Unread</span>
            <Switch checked={unread} onChange={setUnread} />
          </div>
          <div className="flex items-center justify-between py-4 border-b border-unicredit-gray">
            <span className="font-bold text-unicredit-text">To-do</span>
            <Switch checked={todo} onChange={setTodo} />
          </div>
          <div className="flex items-center justify-between py-4 border-b border-unicredit-gray">
            <span className="font-bold text-unicredit-text">Attachments</span>
            <Switch checked={attachments} onChange={setAttachments} />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-unicredit-gray flex items-center justify-between bg-white mt-auto">
        <button onClick={onCancel} className="btn-secondary !px-4 !py-2">
          Cancel
        </button>
        <button onClick={applyFilters} className="btn-primary !px-4 !py-2">
          Apply
        </button>
      </div>
    </div>
  )
}
