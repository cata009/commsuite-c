# Comprehensive Refactoring Plan & Inventory
> **Status:** COMPLETED (✅ 100%)
> **Date:** 2026-02-04
> **Goal:** Eliminate architectural debt, DRY (Don't Repeat Yourself), and implement a centralized Design System without altering the existing UI/UX.

## 1. Inventory & Current State Assessment

### Architecture
- **Framework:** Angular 16.2.0 (Hybrid: NgModules + Standalone Components).
- **Style:** Tailwind CSS (currently using heavy inline overrides e.g. `bg-[#007a91]`, `text-[#262626]`).
- **Dependencies:** No standard linter/formatter (ESLint/Prettier/Husky missing).
- **Paths:** Alias `@/*` exists but is inconsistently used (many relative `../../` imports).

### Identified Duplication (High Priority)

| Feature Component | Location 1 | Location 2 | Notes |
|-------------------|------------|------------|-------|
| **Recipient Picker** | `ConversationDetail` (Edit Members) | `ForwardConversation` (To Field) | Identical UI logic: Popover, Search, Typeahead, Grouping (Portfolio/Other), Apply/Cancel flow. |
| **List Header** | `MessageListComponent` | `AnnouncementListComponent` | Identical text search, filter toggle, folder dropdown, and "bulk selection" header logic. |
| **Attachments Display** | `ConversationDetail` (Message Bubble) | `ConversationDetail` (Composer) | Similar grid + overflow "+2" logic. `ForwardConversation` lacks proper implementation (mock alert). |
| **Icons** | Everywhere | Everywhere | Huge `ngSwitch` in `AppIcon` or inline `<svg>` in template (Rich Text Editor, Pickers). |
| **Colors** | Everywhere | Everywhere | Hardcoded HEX values (`#007a91`, `#262626`, `#e6e6e6`) repeated hundreds of times. |

---

## 2. Execution Plan

### Phase 1: High-Impact Consolidation (The "Heavy Lifting")
*Objective: Eliminate the largest chunks of duplicated logic/UI.*

1.  **Shared `RecipientPickerComponent`** (✅ COMPLETED)
    *   **Action:** Extract logic from `ConversationDetail` and `ForwardConversation`.
    *   **Path:** `src/app/shared/components/recipient-picker/`
    *   **Status:** Integrated into both `ForwardConversation` and `ConversationDetail`.

2.  **Shared `ListHeaderComponent`** (✅ COMPLETED)
    *   **Action:** Unify header for Messages and Announcements.
    *   **Path:** `src/app/shared/components/list-header/`
    *   **Status:** Integrated into `MessageList` and `AnnouncementList`.

3.  **Shared `AttachmentStripComponent`** (✅ COMPLETED)
    *   **Action:** Create a reusable strip for showing file list + overflow.
    *   **Path:** `src/app/shared/components/attachment-strip/`
    *   **Features:** Grid layout, file type icon, size text, overflow menu (+X more), actions (Preview/Download).
    *   **Status:** Integrated into `ForwardConversation` and `ConversationDetail`.

### Phase 2: Design System Centralization (✅ COMPLETED)
*Objective: Standardize the visual layer.*

4.  **Icon Registry (`icons.registry.ts`)** (✅ COMPLETED)
    *   **Action:** Move all SVG definitions out of `AppIconComponent` and HTML templates.
    *   **Status:** Refactored `AppIconComponent` to use centralized registry.

5.  **Tailwind Tokens & Colors** (✅ COMPLETED)
    *   **Action:** Define semantic colors in `tailwind.config.js`.
    *   **Status:** Added `unicredit` color palette to configuration. Refactored `RichTextEditorComponent` and `Skeleton` components to use these tokens.

6.  **Button Standardization** (✅ COMPLETED)
    *   **Action:** Create standard classes or a tiny wrapper component.
    *   **Status:** Created `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-error` in `styles.scss` and applied them. Also standardized global scrollbars.

### Phase 3: Repository Hygiene & Guardrails (✅ COMPLETED)
*Objective: Ensure long-term code health.*

7.  **Core & Folder Structure Cleanup**
    *   Delete `src/app/App.tsx` (✅ DELETED).
    *   Verify and remove any `.tmp` files (✅ REMOVED).
    *   Move singleton services to `src/app/core/services/` (✅ COMPLETED).
    *   Consolidate all mock data into `src/app/core/data/` (✅ COMPLETED).
    *   Rename files to standard angular convention (✅ COMPLETED).

8.  **Tooling & Hygiene** (✅ COMPLETED)
    *   Enforced kebab-case for all files.
    *   Removed unused `src/app/constants` and `src/app/core/mock`.
    *   Standardized imports using `@/app/` globally.

---

## 3. Acceptance Criteria (Guardrails)
1.  **Zero Visual Regression:** The app must look **pixel-identical** after refactoring.
2.  **Functionality:**
    *   Forwarding a conversation must still work (picker selects recipients).
    *   Editing members in a conversation must still work.
    *   Filtering/Searching messages must work.
3.  **Code Quality:**
    *   No more inline SVGs in refactored components.
    *   No more `text-[#262626]` in refactored components.
    *   `src/app/App.tsx` is gone.

## 4. Final Review
- All hardcoded colors replaced with Tailwind tokens.
- All SVG icons moved to central registry.
- Duplicate picker, header, and attachment logic consolidated into shared components.
- Project structure cleaned of React artifacts and unused folders.
- Build passes successfully.
