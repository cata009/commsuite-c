import { useState } from 'react'
import AppIcon from '../../shared/icons/AppIcon'
import CommSuiteModal from './CommSuiteModal'

export default function CorporateShell() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f7f7] text-[#262626]">
      <header className="h-[64px] bg-white border-b border-unicredit-gray flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e6e6e6] flex items-center justify-center">
            <span className="text-xs font-bold text-unicredit-text">CDP</span>
          </div>
          <span className="text-base font-bold text-unicredit-text">Corporate Digital Platform</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsModalOpen(true)}
            aria-label="Open Communication Suite"
          >
            <AppIcon name="messages" size={22} className="text-unicredit-text-secondary" />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-unicredit-error text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <AppIcon name="settings" size={20} className="text-unicredit-text-secondary" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-unicredit-text mb-4">Dashboard</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-unicredit-gray p-4 h-[160px]"></div>
            <div className="bg-white rounded-lg border border-unicredit-gray p-4 h-[160px]"></div>
            <div className="bg-white rounded-lg border border-unicredit-gray p-4 h-[160px]"></div>
          </div>
          <div className="mt-8 bg-white rounded-lg border border-unicredit-gray p-6 h-[320px]"></div>
        </div>
      </main>

      <CommSuiteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
