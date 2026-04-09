# React Migration Checklist

## Golden Flows (Verify After Each Port)
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

## Porting Order
1. Global styles
2. Icons
3. ListHeader
4. AttachmentStrip
5. RecipientPicker
6. RichTextEditor
