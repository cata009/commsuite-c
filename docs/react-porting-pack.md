# React Porting Pack

## Command Outputs

### `tree -L 4 src/app`
```
Too many parameters - 4
```

### `tree /F /A src\app`
```
Folder PATH listing
Volume serial number is 6AB0-735C
C:\USERS\MIHAI\DESKTOP\COMMSUITE\SRC\APP
|   app.component.css
|   app.component.html
|   app.component.ts
|   app.module.ts
|   
+---core
|   +---data
|   |       announcements.mock.ts
|   |       companies.mock.ts
|   |       conversations.mock.ts
|   |       filter.mock.ts
|   |       messages.mock.ts
|   |       
|   +---models
|   |       index.ts
|   |       
|   +---registry
|   |       icons.registry.ts
|   |       
|   +---services
|   |       announcements.service.ts
|   |       filter.service.ts
|   |       messages.service.ts
|   |       notification.service.ts
|   |       participant.service.ts
|   |       
|   \---utils
|           conversation.utils.ts
|           search.utils.ts
|           
+---features
|   +---announcements
|   |   |   announcements.component.ts
|   |   |   announcements.module.ts
|   |   |   
|   |   +---announcement-detail
|   |   |       announcement-detail.component.ts
|   |   |       
|   |   \---announcement-list
|   |           announcement-list.component.ts
|   |           
|   \---messages
|       |   messages.component.ts
|       |   messages.module.ts
|       |   
|       +---conversation-detail
|       |   |   conversation-detail.component.ts
|       |   |   
|       |   \---components
|       |       +---todo-message-card
|       |       |       todo-message-card.component.ts
|       |       |       
|       |       \---todo-messages-section
|       |               todo-messages-section.component.ts
|       |               
|       +---forward-conversation
|       |       forward-conversation.component.ts
|       |       
|       +---message-list
|       |   |   message-list.component.ts
|       |   |   
|       |   \---components
|       |       \---filter-panel
|       |               filter-panel.component.ts
|       |               
|       \---new-message
|               new-message.component.ts
|               
+---layout
|   +---app-header
|   |       app-header.component.ts
|   |       
|   \---left-nav
|           left-nav.component.ts
|           
\---shared
    |   shared.module.ts
    |   
    +---components
    |   +---attachment-strip
    |   |       attachment-strip.component.ts
    |   |       
    |   +---checkbox
    |   |       checkbox.component.ts
    |   |       
    |   +---company-display
    |   |       company-display.component.ts
    |   |       
    |   +---dropdown-menu
    |   |       dropdown-menu.component.ts
    |   |       
    |   +---icons
    |   |       app-icon.component.ts
    |   |       
    |   +---list-header
    |   |       list-header.component.ts
    |   |       
    |   +---notification
    |   |       notification.component.ts
    |   |       
    |   +---recipient-picker
    |   |       recipient-picker.component.ts
    |   |       
    |   +---rich-text-editor
    |   |       rich-text-editor.component.ts
    |   |       
    |   \---skeletons
    |           announcement-list-skeleton.component.ts
    |           message-list-skeleton.component.ts
    |           
    +---directives
    |       click-outside.directive.ts
    |       tooltip.directive.ts
    |       
    \---pipes
            highlight-search.pipe.ts
```

### `rg -n "RecipientPicker|ListHeader|AttachmentStrip|AppIcon|RichTextEditor" src/app`
```
src\app\shared\shared.module.ts:3:import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
src\app\shared\shared.module.ts:8:import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';
src\app\shared\shared.module.ts:16:        AppIconComponent,
src\app\shared\shared.module.ts:19:        RichTextEditorComponent,
src\app\shared\shared.module.ts:28:        AppIconComponent,
src\app\shared\shared.module.ts:33:        RichTextEditorComponent,
src\app\shared\components\list-header\list-header.component.ts:4:import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
src\app\shared\components\list-header\list-header.component.ts:10:    imports: [CommonModule, FormsModule, AppIconComponent, ClickOutsideDirective],
src\app\shared\components\list-header\list-header.component.ts:117:export class ListHeaderComponent {
src\app\shared\components\attachment-strip\attachment-strip.component.ts:3:import { SharedModule } from '@/app/shared/shared.module'; // Contains AppIcon, DropdownMenu
src\app\shared\components\attachment-strip\attachment-strip.component.ts:125:export class AttachmentStripComponent {
src\app\shared\components\icons\app-icon.component.ts:22:export class AppIconComponent {
src\app\features\announcements\announcements.module.ts:9:import { ListHeaderComponent } from '@/app/shared/components/list-header/list-header.component';
src\app\features\announcements\announcements.module.ts:41:        ListHeaderComponent
src\app\features\messages\messages.module.ts:7:import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';
src\app\features\messages\messages.module.ts:18:import { RecipientPickerComponent } from '@/app/shared/components/recipient-picker/recipient-picker.component';
src\app\features\messages\messages.module.ts:19:import { ListHeaderComponent } from '@/app/shared/components/list-header/list-header.component';
src\app\features\messages\messages.module.ts:20:import { AttachmentStripComponent } from '@/app/shared/components/attachment-strip/attachment-strip.component';
src\app\features\messages\messages.module.ts:47:        RichTextEditorComponent,
src\app\features\messages\messages.module.ts:49:        RecipientPickerComponent,
src\app\features\messages\messages.module.ts:50:        ListHeaderComponent,
src\app\features\messages\messages.module.ts:51:        AttachmentStripComponent
src\app\shared\components\rich-text-editor\rich-text-editor.component.ts:3:import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
src\app\shared\components\rich-text-editor\rich-text-editor.component.ts:11:    imports: [CommonModule, AppIconComponent, ClickOutsideDirective],
src\app\shared\components\rich-text-editor\rich-text-editor.component.ts:260:export class RichTextEditorComponent implements AfterViewInit, OnChanges {
src\app\shared\components\recipient-picker\recipient-picker.component.ts:4:import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
src\app\shared\components\recipient-picker\recipient-picker.component.ts:20:    imports: [CommonModule, FormsModule, AppIconComponent],
src\app\shared\components\recipient-picker\recipient-picker.component.ts:97:export class RecipientPickerComponent implements OnInit {
src\app\features\messages\conversation-detail\conversation-detail.component.ts:10:import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';
src\app\features\messages\conversation-detail\conversation-detail.component.ts:11:import { RecipientPickerComponent } from '@/app/shared/components/recipient-picker/recipient-picker.component';
src\app\features\messages\conversation-detail\conversation-detail.component.ts:12:import { AttachmentStripComponent, AttachmentAction } from '@/app/shared/components/attachment-strip/attachment-strip.component';
src\app\features\messages\conversation-detail\conversation-detail.component.ts:1011:    @ViewChild(RichTextEditorComponent) richTextEditor!: RichTextEditorComponent;
src\app\features\messages\forward-conversation\forward-conversation.component.ts:11:import { AppIconComponent } from '@/app/shared/components/icons/app-icon.component';
src\app\features\messages\forward-conversation\forward-conversation.component.ts:12:import { RichTextEditorComponent } from '@/app/shared/components/rich-text-editor/rich-text-editor.component';
src\app\features\messages\forward-conversation\forward-conversation.component.ts:13:import { AttachmentStripComponent } from '@/app/shared/components/attachment-strip/attachment-strip.component';
src\app\features\messages\forward-conversation\forward-conversation.component.ts:27:import { RecipientPickerComponent } from '@/app/shared/components/recipient-picker/recipient-picker.component';
src\app\features\messages\forward-conversation\forward-conversation.component.ts:51:                     <button (click)="toggleRecipientPicker()" 
src\app\features\messages\forward-conversation\forward-conversation.component.ts:53:                             [ngClass]="showRecipientPicker ? 'text-[#007a91]' : 'text-[#262626]'">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:57:                             [class.rotate-180]="showRecipientPicker"
src\app\features\messages\forward-conversation\forward-conversation.component.ts:65:                        *ngIf="showRecipientPicker"
src\app\features\messages\forward-conversation\forward-conversation.component.ts:69:                        (cancel)="showRecipientPicker = false"
src\app\features\messages\forward-conversation\forward-conversation.component.ts:220:    imports: [CommonModule, FormsModule, AppIconComponent, ClickOutsideDirective, RichTextEditorComponent, RecipientPickerComponent, AttachmentStripComponent]
src\app\features\messages\forward-conversation\forward-conversation.component.ts:474:    showRecipientPicker = false;
src\app\features\messages\forward-conversation\forward-conversation.component.ts:476:    toggleRecipientPicker() {
src\app\features\messages\forward-conversation\forward-conversation.component.ts:477:        this.showRecipientPicker = !this.showRecipientPicker;
src\app\features\messages\forward-conversation\forward-conversation.component.ts:483:        this.showRecipientPicker = false;
```

### `rg -n "#007a91|#262626|text-\[#|bg-\[#|border-\[#"`
```
theme.ts.tmp:9:  primary: '#007a91',
theme.ts.tmp:20:  success: '#007a91',
theme.ts.tmp:23:  text: '#262626',
theme.ts.tmp:35:  borderDarker: '#262626',
theme.ts.tmp:40:  badgeInfo: '#007a91',
theme.ts.tmp:184:    border: 'border-[#007a91]',
theme.ts.tmp:186:    senderColor: 'text-[#007a91]',
theme.ts.tmp:191:    border: 'border-[#909090]',
theme.ts.tmp:192:    background: 'bg-[#f5f5f5]',
theme.ts.tmp:193:    senderColor: 'text-[#262626]',
legacy_header.tsx.tmp:9:    <div className="bg-[#f5f5f5] px-5 py-1 flex items-center justify-between border-b border-[#e5e5e5]">
legacy_header.tsx.tmp:15:        <h1 className="text-lg font-bold text-[#262626]">Communication Suite</h1>
legacy_header.tsx.tmp:21:            <path d="M0 9.25H16V6.75H0V9.25Z" fill="#262626"/>
legacy_header.tsx.tmp:26:            <path fillRule="evenodd" clipRule="evenodd" d="M14.5145 0L8 6.5145L1.485 0L0 1.4855L6.5145 8L0 14.5145L1.485 16L8 9.4855L14.5145 16L16 14.5145L9.4855 8L16 1.4855L14.5145 0Z" fill="#262626"/>
tailwind.config.js:54:                informative: "#007a91", // Changed to color hex for Tailwind JIT to work reliably without CSS vars
tailwind.config.js:59:                    primary: '#007a91',
tailwind.config.js:62:                    text: '#262626',
src\styles.scss:72:    color: #262626;
NEW_MESSAGE_DEV_NOTES.md:162:  - Primary: `#007a91` (teal)
src\styles\theme.css:43:  --informative: #007a91;
src\styles\theme.css:291:  color: #262626;
src\app\app.component.html:1:<div class="flex flex-col h-screen min-w-[1024px] overflow-hidden bg-white text-[#262626] font-sans">
src\app\core\utils\search.utils.ts:1:export function highlightText(text: string | undefined | null, query?: string, highlightClass = 'bg-[#BFEBF3]'): string {
```

Note: The raw `rg` output is larger due to minified `dist` assets. Truncated here to keep the report usable.

## Shared UI Components and Paths
- `src/app/shared/components/recipient-picker/recipient-picker.component.ts`
- `src/app/shared/components/list-header/list-header.component.ts`
- `src/app/shared/components/attachment-strip/attachment-strip.component.ts`
- `src/app/shared/components/rich-text-editor/rich-text-editor.component.ts`
- `src/app/shared/components/icons/app-icon.component.ts`

## Design Tokens

### Tailwind Palette
- `tailwind.config.js`
- `colors.border`, `colors.input`, `colors.ring`, `colors.background`, `colors.foreground`
- `colors.primary`, `colors.secondary`, `colors.destructive`, `colors.muted`, `colors.accent`, `colors.popover`, `colors.card`
- `colors.sidebar.*`
- `colors.important` = `#e2001a`
- `colors.informative` = `#007a91`
- `colors.recalled` = `#666666`
- `colors.input-background` = `var(--input-background)`
- `colors.switch-background` = `var(--switch-background)`
- `colors.unicredit.*`:
  - `primary` `#007a91`
  - `primary-hover` `#006577`
  - `primary-light` `#e7f8fb`
  - `text` `#262626`
  - `text-secondary` `#666666`
  - `text-muted` `#909090`
  - `gray` `#e6e6e6`
  - `gray-divider` `#ccc`
  - `gray-light` `#eee`
  - `gray-lighter` `#f5f5f5`
  - `ooo-bg` `#FCE4EC`
  - `ooo-text` `#E91E63`
  - `error` `#e2001a`

### Global CSS Vars
- `src/styles/theme.css`
- `:root` vars: `--font-size`, `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--input-background`, `--switch-background`, `--font-weight-medium`, `--font-weight-normal`, `--ring`, `--chart-1`..`--chart-5`, `--radius`, `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`, `--important`, `--informative`, `--recalled`.
- `@theme inline` maps `--color-*` and `--radius-*` to the above tokens.

## Icon Registry
- `src/app/core/registry/icons.registry.ts`
- Icon names:
  - `member-client`
  - `member-bank`
  - `messages`
  - `announcements`
  - `contacts`
  - `settings`
  - `filter`
  - `attachment`
  - `participants`
  - `quick-actions`
  - `edit`
  - `search`
  - `new`
  - `checkmark`
  - `todo`
  - `search-close`
  - `more-vertical`
  - `reply`
  - `download`
  - `paste`
  - `file-document`
  - `file-image`
  - `preview`
  - `bold`
  - `italic`
  - `underline`

## Smoke Test Flows (Top 10)
1. Forward conversation flow (open conversation, open actions, forward, pick recipients, send).
2. Edit members flow (open members menu, add/remove, confirm removal, save changes).
3. Attachments flow (attach files, overflow counter, preview/download/remove).
4. Search flow (list header search, highlight, clear).
5. Folder filtering flow (open folder dropdown, select, apply/cancel, counts update).
6. New message compose flow (rich text editor, toolbar actions, send, empty state).
7. Message list selection + unread counters (select thread, unread badges, mark unread).
8. Reply flow (reply to message, reply preview expand/collapse, cancel).
9. OOO banner flow (display, dismiss, return date formatting).
10. Announcements list/detail navigation (list header search/filter + detail view).

## Pixel-Identical File List
- `tailwind.config.js`
- `src/styles/theme.css`
- `src/styles.scss`
- `src/app/app.component.html`
- `src/app/app.component.css`
- `src/app/layout/app-header/app-header.component.ts`
- `src/app/layout/left-nav/left-nav.component.ts`
- `src/app/shared/shared.module.ts`
- `src/app/shared/components/attachment-strip/attachment-strip.component.ts`
- `src/app/shared/components/checkbox/checkbox.component.ts`
- `src/app/shared/components/company-display/company-display.component.ts`
- `src/app/shared/components/dropdown-menu/dropdown-menu.component.ts`
- `src/app/shared/components/icons/app-icon.component.ts`
- `src/app/shared/components/list-header/list-header.component.ts`
- `src/app/shared/components/notification/notification.component.ts`
- `src/app/shared/components/recipient-picker/recipient-picker.component.ts`
- `src/app/shared/components/rich-text-editor/rich-text-editor.component.ts`
- `src/app/shared/components/skeletons/announcement-list-skeleton.component.ts`
- `src/app/shared/components/skeletons/message-list-skeleton.component.ts`
- `src/app/shared/directives/click-outside.directive.ts`
- `src/app/shared/directives/tooltip.directive.ts`
- `src/app/shared/pipes/highlight-search.pipe.ts`
- `src/app/core/registry/icons.registry.ts`
- `src/app/core/utils/search.utils.ts`
- `src/app/features/announcements/announcements.component.ts`
- `src/app/features/announcements/announcement-list/announcement-list.component.ts`
- `src/app/features/announcements/announcement-detail/announcement-detail.component.ts`
- `src/app/features/messages/messages.component.ts`
- `src/app/features/messages/message-list/message-list.component.ts`
- `src/app/features/messages/message-list/components/filter-panel/filter-panel.component.ts`
- `src/app/features/messages/conversation-detail/conversation-detail.component.ts`
- `src/app/features/messages/conversation-detail/components/todo-message-card/todo-message-card.component.ts`
- `src/app/features/messages/conversation-detail/components/todo-messages-section/todo-messages-section.component.ts`
- `src/app/features/messages/new-message/new-message.component.ts`
- `src/app/features/messages/forward-conversation/forward-conversation.component.ts`

## Updates: Src-Only Scans

### Color/Hex Scan (src only)
Command: `rg -n "#007a91|#262626|text-\[#|bg-\[#|border-\[#" src --glob '!dist/**' --glob '!node_modules/**'`
```
src\styles.scss:72:    color: #262626;
src\styles\theme.css:43:  --informative: #007a91;
src\styles\theme.css:291:  color: #262626;
src\app\app.component.html:1:<div class="flex flex-col h-screen min-w-[1024px] overflow-hidden bg-white text-[#262626] font-sans">
src\app\layout\app-header\app-header.component.ts:18:            <path d="M0 9.25H16V6.75H0V9.25" fill="#262626"/>
src\app\layout\app-header\app-header.component.ts:23:             <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5145 0L8 6.5145L1.485 0L0 1.4855L6.5145 8L0 14.5145L1.485 16L8 9.4855L14.5145 16L16 14.5145L9.4855 8L16 1.4855L14.5145 0Z" fill="#262626"/>
src\app\core\utils\search.utils.ts:1:export function highlightText(text: string | undefined | null, query?: string, highlightClass = 'bg-[#BFEBF3]'): string {
src\app\features\messages\forward-conversation\forward-conversation.component.ts:35:        <div class="px-6 py-4 border-b border-[#e6e6e6] flex-shrink-0 bg-white">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:36:            <h1 style="color: var(--primary-k-10262626-text, #262626); font-feature-settings: 'liga' off, 'clig' off; font-family: UniCredit; font-size: 18px; font-style: normal; font-weight: 700; line-height: normal; text-transform: uppercase;">FORWARD CONVERSATION</h1>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:38:                 <span class="text-sm text-[#909090] shrink-0">Companies</span>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:39:                 <span class="text-sm font-bold text-[#262626] truncate" [title]="getAllCompanies()">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:46:        <div class="px-6 py-4 border-b border-[#e6e6e6] flex-shrink-0 bg-white relative z-20">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:53:                             [ngClass]="showRecipientPicker ? 'text-[#007a91]' : 'text-[#262626]'">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:75:                     <div *ngFor="let recipientId of selectedRecipientIds" class="flex items-center gap-2 px-2 py-1 bg-[#F5F5F5] border border-[#E6E6E6] rounded-[4px]">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:77:                          <span class="text-[#262626] text-sm font-medium">{{ getRecipientName(recipientId) }}</span>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:78:                          <button (click)="removeRecipient(recipientId)" class="text-[#666] hover:text-[#d32f2f] flex items-center justify-center">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:95:                <div *ngIf="showRecipientSuggestions && recipientSuggestions.length > 0" class="absolute top-full left-[40px] mt-1 w-[300px] z-50 bg-white border border-[#ccc] rounded shadow-lg max-h-60 overflow-y-auto">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:96:                   <button *ngFor="let recipient of recipientSuggestions" (mousedown)="addRecipientFromTypeahead(recipient)" class="w-full text-left px-4 py-2 hover:bg-[#e7f8fb] transition-colors relative flex items-start gap-3">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:101:                           <div class="text-sm font-medium text-[#262626]">{{ recipient.name }}</div>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:103:                           <div *ngIf="recipient.outOfOffice?.isOoo" class="text-xs text-[#E91E63] font-medium mt-0.5">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:113:                 <span class="text-sm font-bold text-[#262626]">Subject:</span>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:114:                 <span class="text-sm text-[#262626]">{{ subject }}</span>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:119:        <div class="flex-1 overflow-y-auto px-6 py-4 bg-[#e5e5e5] hover-scrollbar flex flex-col gap-3">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:124:                          'bg-white border-[#007a91]': msg.isOwn,
src\app\features\messages\forward-conversation\forward-conversation.component.ts:125:                          'bg-[#f5f5f5] border-[#909090]': !msg.isOwn
src\app\features\messages\forward-conversation\forward-conversation.component.ts:130:                           <span class="font-bold" [ngClass]="msg.isOwn ? 'text-[#007a91]' : 'text-[#262626]'">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:134:                               <span class="text-[#262626] uppercase font-bold text-xs">{{ formatTimestamp(msg.timestamp) }}</span>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:139:                       <div *ngIf="msg.replyTo" class="mb-3 p-4 flex flex-col gap-2 rounded bg-white border border-[#007A91] self-stretch">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:141:                               <span class="text-[#262626] text-sm font-bold uppercase">{{ msg.replyTo.sender }}</span>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:142:                               <span class="text-[#666] text-xs">{{ msg.replyTo.timestamp }}</span>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:144:                           <div class="text-[#262626] text-sm opacity-90 break-words whitespace-pre-wrap line-clamp-2" [innerHTML]="msg.replyTo.content"></div>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:148:                       <div class="text-[#262626] leading-relaxed break-words whitespace-pre-wrap text-sm" [innerHTML]="msg.content"></div>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:160:        <div class="flex-shrink-0 border-t border-[#e6e6e6] bg-white p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:174:                <button (click)="onBack()" class="px-6 py-2 border border-[#262626] text-[#262626] font-bold rounded hover:bg-gray-50 uppercase text-sm transition-colors" style="font-family: 'UniCredit';">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:178:                     <button (click)="onSaveDraft()" [disabled]="!isDirty" class="text-[#007a91] font-bold uppercase text-sm hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-colors font-unicredit">
src\app\features\messages\forward-conversation\forward-conversation.component.ts:183:                        class="px-8 py-2 bg-[#007a91] text-white font-bold rounded hover:bg-[#006577] uppercase text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100" 
src\app\features\messages\forward-conversation\forward-conversation.component.ts:194:                 <h3 class="text-xl font-bold text-[#262626] text-center mb-2">You will lose all changes.</h3>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:195:                 <p class="text-center text-[#666] mb-8">Are you sure you want to leave?</p>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:197:                     <button (click)="onDontSave()" class="flex-1 py-2.5 border border-[#262626] font-bold text-[#262626] uppercase hover:bg-gray-50 rounded">Don't save</button>
src\app\features\messages\forward-conversation\forward-conversation.component.ts:198:                     <button (click)="onSaveDraftAndLeave()" class="flex-1 py-2.5 bg-[#007a91] text-white font-bold uppercase hover:bg-[#006577] rounded">Save draft</button>
src\app\features\messages\new-message\new-message.component.ts:19:        <div class="px-6 py-4 border-b border-[#ccc]">
src\app\features\messages\new-message\new-message.component.ts:20:            <h1 class="text-2xl font-bold text-[#262626]">New Message</h1>
src\app\features\messages\new-message\new-message.component.ts:27:                <label class="block text-sm font-bold text-[#262626] mb-2">
... (output truncated for report length; full output in last command run)
```

### Inline SVG Scan (src only)
Command: `rg -n "<svg" src --glob '!dist/**' --glob '!node_modules/**'`
```
src\app\layout\app-header\app-header.component.ts:8:        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
src\app\layout\app-header\app-header.component.ts:17:          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
src\app\layout\app-header\app-header.component.ts:22:          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
src\app\shared\components\checkbox\checkbox.component.ts:13:      <svg *ngIf="checked" width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
src\app\shared\components\rich-text-editor\rich-text-editor.component.ts:32:                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
src\app\shared\components\rich-text-editor\rich-text-editor.component.ts:39:              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
src\app\shared\components\rich-text-editor\rich-text-editor.component.ts:55:             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
... (output truncated for report length; full output in last command run)
```

## Component Summaries (Porting Focus)

**RecipientPicker** (`src/app/shared/components/recipient-picker/recipient-picker.component.ts`)
- Inputs: `recipients`, `initialSelectedIds`, `showFooter`.
- Outputs: `apply(ids)`, `cancel()`.
- Internal state: `searchQuery`, `tempSelectedIds` (Set), `filteredRecipients`.
- DOM/UX behaviors: auto-focuses search input on open; filters on input; list is scrollable (`overflow-y-auto` + `hover-scrollbar`); selection toggles on row click; optional footer with Apply/Cancel.

**ListHeader** (`src/app/shared/components/list-header/list-header.component.ts`)
- Inputs: `searchQuery`, `placeholder`, `showFilterButton`, `isFilterOpen`, `activeFilterCount`, `folders`, `selectedFolder`, `folderUnreadCount`, `folderTotalCount`.
- Outputs: `searchQueryChange(value)`, `filterToggle()`, `clearFilters()`, `folderChange(folder)`.
- Internal state: `isFolderDropdownOpen`, `tempSelectedFolder`.
- DOM/UX behaviors: search input emits on change; filter badge clears via click; folder dropdown uses `ClickOutsideDirective` to close; dropdown apply/cancel buttons; inline SVG radio buttons for selected folder.

**AttachmentStrip** (`src/app/shared/components/attachment-strip/attachment-strip.component.ts`)
- Inputs: `attachments`, `editable`, `maxVisible`.
- Outputs: `action({ type, attachment })`.
- Internal state: computed `visibleAttachments`, `overflowAttachments`.
- DOM/UX behaviors: shows up to `maxVisible` items; overflow is `+X` dropdown with scroll; editable mode shows remove buttons; non-editable mode shows preview/download actions.

**AppIcon** (`src/app/shared/components/icons/app-icon.component.ts`)
- Inputs: `name`, `isActive`, `size`, `className`.
- Outputs: none.
- Internal state: derives SVG from `APP_ICONS` registry; `isActive` forces color `#007A91` else uses `currentColor`; `size` accepts px number or string.
- DOM/UX behaviors: uses `innerHTML` with sanitized SVG; logs warning if icon name not found.

**RichTextEditor** (`src/app/shared/components/rich-text-editor/rich-text-editor.component.ts`)
- Inputs: `placeholder`, `content`, `showToolbar`, `maxHeight`, `replyTo`.
- Outputs: `contentChange(html)`, `enterPressed()`, `cancelReply()`, `attachmentClick()`.
- Internal state: toolbar formatting flags (`isBold`, `isItalic`, `isUnderline`, `isStrikethrough`), focus/empty flags, font size/color, menus open flags, saved selection, preview expanded flag.
- DOM/UX behaviors: contenteditable editor with max-height and overflow; Enter without Shift triggers `enterPressed`; reply preview supports expand/collapse; toolbar animates on enter/leave; color/font/highlight menus close via `ClickOutsideDirective`; `customPaste()` reads clipboard; sanitizes execCommand output for consistent font sizes.

## Global Styles Affecting Layout
- `src/styles.scss`: global `html, body` height/zero margin + font smoothing; button utility classes `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-error` with padding, typography, uppercase; scrollbar styling for `.message-list-scrollbar`, `.hover-scrollbar`, `.composer-scrollbar`.
- `src/styles/theme.css`: global scrollbar styling for all elements; base `body` font family and default typography sizes for headings/labels/buttons/inputs; `.rich-text-content` typography and list spacing; global tooltip styles for `[title]` and `.custom-tooltip`.

## Scan Outputs (Full Raw)
- `docs/scan-src-hex-colors.txt` (includes command header)
- `docs/scan-src-inline-svg.txt` (includes command header)
- `docs/scan-src-hardcoded-tailwind-hex.txt` (includes command header)
