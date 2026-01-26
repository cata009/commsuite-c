import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Send } from 'lucide-react';

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMessageDialog({ open, onOpenChange }: NewMessageDialogProps) {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (recipients.trim() && subject.trim() && message.trim()) {
      console.log('Sending new message:', { recipients, subject, message });
      // Reset form
      setRecipients('');
      setSubject('');
      setMessage('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6e6e6]">
            <Dialog.Title className="text-xl font-bold text-[#262626]">
              New Message
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <X size={20} className="text-[#666]" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 message-list-scrollbar">
            <div>
              <label className="block text-sm font-bold text-[#262626] mb-2">
                To:
              </label>
              <input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Enter recipient names or emails"
                className="w-full px-4 py-2 border border-[#ccc] rounded-md focus:outline-none focus:border-[#007a91] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#262626] mb-2">
                Subject:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject"
                className="w-full px-4 py-2 border border-[#ccc] rounded-md focus:outline-none focus:border-[#007a91] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#262626] mb-2">
                Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-[#ccc] rounded-md resize-none focus:outline-none focus:border-[#007a91] transition-colors"
                rows={10}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e6e6e6]">
            <Dialog.Close asChild>
              <button className="px-4 py-2 border border-[#ccc] rounded hover:bg-gray-50 text-[#262626] font-bold transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSend}
              disabled={!recipients.trim() || !subject.trim() || !message.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#007a91] hover:bg-[#006577] disabled:bg-[#ccc] disabled:cursor-not-allowed text-white rounded font-bold transition-colors"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
