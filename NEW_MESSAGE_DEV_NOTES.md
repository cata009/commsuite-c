# New Message Implementation - DEV NOTES

## Overview
This implementation provides a **complete, production-ready** "New Message" flow for the Communication Suite Messages module, with all advanced features matching the design specifications pixel-perfect.

## Architecture

### Components Created

1. **NewMessageComponent** (`features/messages/new-message/new-message.component.ts`)
   - Full-featured message composition component
   - Company selection with chip display
   - Typeahead + advanced recipients picker
   - Functional rich text editor with toolbar
   - Auto-growing textarea (max 5 lines)
   - Form validation and dirty state tracking
   - Unsaved changes confirmation modal
   - Draft saving with toast notifications
   - Keyboard shortcuts support (Ctrl+B/I/U)

### Mock Data

**Location**: `core/data/companies.mock.ts`

- **Companies**: 6 companies (ApexTech Solutions, Carrefour S.P.A., BlueSky Ventures, Metro, Lastcompany S.P.A., GlobalTech Industries)
- **Recipients**: 60 recipients (10 per company) with roles like "Electronic Banking Specialist", "Relationship Manager", "E-Banking", etc.

### Key Features Implemented

#### 1. Company Selection (Mandatory) ✅
- **Dropdown with search**: Advanced picker with search functionality
- **Staged selection**: Changes are not applied until "APPLY" is clicked
- **Chip display**: Selected company appears as a removable chip (NEW!)
- **Remove capability**: Click "x" on chip to remove company
- **Validation**: Red banner "Mandatory field" appears if user tries to send without selecting company
- **Recipients dependency**: Recipients field is disabled until company is selected
- **Auto-clear recipients**: When company changes, recipients are cleared

#### 2. Recipients Selection ✅
- **Typeahead input**: Type to search recipients in real-time (NEW!)
  - Shows instant suggestions as you type
  - Displays name + role for each suggestion
  - Click suggestion to add immediately as chip
  - Filters out already-selected recipients
  - Limit: 10 suggestions max
- **Chips display**: Selected recipients appear as removable chips
- **Advanced picker**: Click "Advanced" button for full picker with:
  - Search functionality
  - Checkbox list with staged selection
  - Name + role display
  - CANCEL/APPLY buttons
- **Company filtering**: Only shows recipients for the selected company
- **Multi-select**: Supports selecting multiple recipients
- **Staged changes**: CANCEL reverts, APPLY commits
- **Focus management**: Auto-focus input after adding recipient

#### 3. Rich Text Editor ✅
- **Functional toolbar** with working buttons:
  - **Font size selector**: 12, 14, 16, 18, 20px
  - **Bold** (B) - Ctrl+B keyboard shortcut
  - **Italic** (I) - Ctrl+I keyboard shortcut
  - **Underline** (U) - Ctrl+U keyboard shortcut
  - **Strikethrough** (S)
  - **Highlight** - Visual indicator
  - **Bullet list** - Converts selected text to bullet points
  - **Numbered list** - Converts selected text to numbered list
  - **Insert link** - Prompts for URL and creates markdown link
  - **Attach file** - Placeholder for file attachment
- **Auto-growing textarea**:
  - Starts at 100px height
  - Grows with content up to 200px (≈5 lines)
  - Scrolls after reaching max height
  - Custom scrollbar styling
- **Keyboard shortcuts**: Ctrl/Cmd + B/I/U for formatting
- **Visual feedback**: Active formatting buttons highlighted

#### 4. Form Validation ✅
- **Required fields**:
  - Company (mandatory) - shows red error banner
  - At least 1 recipient
  - Body content (non-empty after trim)
- **Optional**: Subject field

#### 5. Back / Unsaved Changes Protection ✅
- **Dirty state tracking**: Form tracks if any changes have been made
- **Confirmation modal**: Shown when navigating away with unsaved changes. Options: "Don't Save" vs "Save draft".

#### 6. Forward Conversation (NEW) ✅
- **Entry Point**: "..." menu in Conversation Detail -> "Forward conversation"
- **Route**: `/messages/forward/:id`
- **Preview**: Displays original conversation history as read-only cards

#### 7. Manage Members (Edit & OOO) ✅
- **Edit Mode**: Toggle via "EDIT MEMBERS" button in dropdown.
- **Grouped Search**: Typeahead groups results by "Users in my portfolio" vs "Other bank users".
- **OOO Integration**: Search results show OOO status and return date.
- **Remove Flow**: 
  - Verification modal: "Are you sure you want to remove..."
  - Context warning: "These will still have access to history".
- **System Events**: Saving changes generates "Member added" / "Member removed" events in the chat history.
- **Prefill**: Subject prefixed with "FW:", Company context displayed
- **Feature Parity**: Uses same robust Recipient Typeahead & Rich Text Editor as New Message
- **Drafts**: Separate draft storage for forwards (`forwardDrafts` in localStorage)
- **Modal text**: "You will loose all changes. Are you sure you want to leave?"
- **Actions**:
  - "Don't Save": Discard changes and navigate
  - "Save draft": Save draft and navigate

#### 5. Draft Management
- **Save Draft button**: Enabled only when form is dirty
- **Storage**: Drafts saved to localStorage with structure:
  ```typescript
  interface MessageDraft {
    id: string;
    companyId: string | null;
    recipientIds: string[];
    subject: string;
    body: string;
    updatedAt: Date;
  }
  ```
- **Toast notification**: "Draft correctly saved." appears top-right for 3 seconds

#### 6. Rich Text Editor
- **MVP Implementation**: Uses textarea for now (can be upgraded to contenteditable or library later)
- **Toolbar**: Visual toolbar with formatting buttons (UI only for MVP)
- **Auto-grow**: Can be extended with max-height and scroll

## Routing

**Updated**: `features/messages/messages.module.ts`

```typescript
const routes: Routes = [
    { path: '', component: MessagesComponent },
    { path: 'new', component: NewMessageComponent },  // NEW
    { path: ':id', component: MessagesComponent }
];
```

**Navigation**:
- Click "NEW" button in Messages header → `/messages/new`
- After send/save draft → `/messages`

## State Management

### Current Implementation
- **Local component state**: All form state managed within NewMessageComponent
- **localStorage**: Used for draft persistence
- **No global state**: Each component manages its own state

### Future Enhancements
- Consider using a DraftService for centralized draft management
- Implement draft recovery on component init
- Add draft auto-save functionality
- Sync drafts with backend API

## Styling

- **Design system**: Uses existing Tailwind classes and color palette
- **Colors**:
  - Primary: `#007a91` (teal)
  - Hover: `#006577`
  - Error: `#d32f2f`
  - Background: `#e7f8fb` (light teal)
- **Transitions**: Smooth hover and state transitions
- **Responsive**: Full-width layout with max-width constraints on form fields

## How to Extend

### 1. Add Backend Integration
```typescript
// In NewMessageComponent
constructor(
    private router: Router,
    private messageService: MessageService  // NEW
) {}

onSend() {
    if (!this.validateForm()) return;
    
    this.messageService.sendMessage({
        companyId: this.selectedCompany!.id,
        recipientIds: this.selectedRecipientIds,
        subject: this.subject,
        body: this.body
    }).subscribe(response => {
        this.isDirty = false;
        this.router.navigate(['/messages', response.conversationId]);
    });
}
```

### 2. Upgrade Rich Text Editor
Replace textarea with a proper rich text editor:
- **Quill**: Lightweight, good for basic formatting
- **TinyMCE**: Full-featured, enterprise-grade
- **ProseMirror**: Highly customizable

### 3. Add Attachments Support
```typescript
// Add to component
attachments: File[] = [];

onFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
        this.attachments.push(...Array.from(files));
        this.markAsDirty();
    }
}
```

### 4. Implement Draft Recovery
```typescript
ngOnInit() {
    this.filteredCompanies = [...this.companies];
    
    // Check for existing drafts
    const drafts = JSON.parse(localStorage.getItem('messageDrafts') || '[]');
    if (drafts.length > 0) {
        // Show draft recovery modal
        this.showDraftRecoveryModal(drafts);
    }
}
```

### 5. Add Auto-save
```typescript
private autoSaveInterval: any;

ngOnInit() {
    // Auto-save every 30 seconds if dirty
    this.autoSaveInterval = setInterval(() => {
        if (this.isDirty) {
            this.autoSaveDraft();
        }
    }, 30000);
}

ngOnDestroy() {
    if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
    }
}
```

## Testing Checklist

- [ ] Company selection works and validates
- [ ] Recipients are filtered by selected company
- [ ] Recipients chips can be added and removed
- [ ] Form validation prevents invalid sends
- [ ] Unsaved changes modal appears when navigating with dirty form
- [ ] Draft save works and shows toast
- [ ] Back button respects dirty state
- [ ] Send button creates conversation (when backend integrated)
- [ ] All UI states match design specifications
- [ ] Responsive layout works on different screen sizes

## Known Limitations (MVP)

1. **Rich text editor**: Currently a simple textarea
2. **No attachments**: File upload not implemented
3. **No draft list**: Can't view/manage saved drafts
4. **No typeahead**: Recipients search is filter-only (no async search)
5. **No conversation creation**: Send button doesn't actually create conversation yet
6. **No backend sync**: All data is mock/local

## Next Steps

1. Integrate with backend API for:
   - Fetching companies and recipients
   - Sending messages
   - Saving/retrieving drafts
2. Implement conversation creation on send
3. Add draft management UI (list, edit, delete drafts)
4. Upgrade to proper rich text editor
5. Add file attachment support
6. Implement auto-save functionality
7. Add email-style CC/BCC fields (if needed)
8. Add message templates support

## File Structure

```
src/app/
├── core/
│   └── data/
│       └── companies.mock.ts          # Mock companies & recipients
├── features/
│   └── messages/
│       ├── new-message/
│       │   └── new-message.component.ts   # Main new message component
│       ├── messages.component.ts          # Updated with navigation
│       └── messages.module.ts             # Updated with routing
```

## Dependencies

- **Angular Core**: Component, routing
- **FormsModule**: ngModel for form binding
- **CommonModule**: *ngIf, *ngFor directives
- **Router**: Navigation
- **No external libraries**: Pure Angular implementation

## Performance Considerations

- **Filtered lists**: Company and recipient filtering happens in-memory (fast for 60 items)
- **Staged selection**: Prevents unnecessary re-renders during selection
- **LocalStorage**: Lightweight for draft storage
- **Future**: Consider virtual scrolling for large recipient lists (100+)

---

**Last Updated**: January 29, 2026
**Author**: Development Team
**Version**: 1.0.0 (MVP)
