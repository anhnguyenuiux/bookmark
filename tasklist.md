# Task List — Bookmark Manager PWA

## Trạng thái tổng quan
Hoàn thành 100% — App đang chạy tại `http://localhost:3000`

---

## ✅ Đã hoàn thành

### 1. Scaffold & Cài đặt
- [x] Khởi tạo Next.js 16 (App Router) với TypeScript + Tailwind CSS v4
- [x] Cài đặt toàn bộ dependencies: `idb`, `zustand`, `lucide-react`, `date-fns`, `clsx`, `tailwind-merge`, các Radix UI primitives, `@ducanh2912/next-pwa`
- [x] Fix conflict Turbopack/Webpack của next-pwa với Next.js 16 (`turbopack: {}`)

### 2. Cấu hình dự án
- [x] `next.config.ts` — tích hợp PWA với `@ducanh2912/next-pwa`
- [x] `globals.css` — Tailwind v4 `@theme` block với toàn bộ design token từ `DESIGN.md` (màu sắc, shadow, border-radius, font)
- [x] `src/types/index.ts` — TypeScript interfaces: `Bookmark`, `Folder`, `FolderNode`, `Category`, `Tag`, `BookmarkImport`, `ImportResult`, `SortOptions`, `ViewMode`
- [x] `src/lib/utils.ts` — `cn()`, `slugify()`, `getDomain()`, `formatDate()`, `formatRelativeDate()`, `getDomainColor()`
- [x] `src/lib/favicon.ts` — Google Favicon API URL builder
- [x] `.gitignore` — thêm các file generated của next-pwa

### 3. Database Layer (IndexedDB via idb v8)
- [x] `src/lib/db/index.ts` — singleton `getDB()`, định nghĩa 4 object stores với indexes
- [x] `src/lib/db/bookmarks.ts` — CRUD: getAllBookmarks, addBookmark, updateBookmark, deleteBookmark, addBookmarksBatch, bookmarkExistsByUrl
- [x] `src/lib/db/folders.ts` — CRUD: getAllFolders, addFolder, updateFolder, deleteFolder, getFolderByName
- [x] `src/lib/db/categories.ts` — CRUD: getAllCategories, addCategory, updateCategory, deleteCategory
- [x] `src/lib/db/tags.ts` — getAllTags, putTag, deleteTag, syncTags

**IndexedDB Schema:**
| Store | keyPath | Indexes |
|---|---|---|
| bookmarks | id | by-folder, by-category, by-tag (multiEntry), by-created, by-updated |
| folders | id | by-parent |
| categories | id | by-slug (unique) |
| tags | slug | — |

### 4. State Management (Zustand v5)
- [x] `useBookmarkStore` — bookmarks[], loadAll, add, update, remove, importBatch (optimistic UI)
- [x] `useFolderStore` — folders[], create, rename, remove, getTree() (recursive FolderNode builder)
- [x] `useCategoryStore` — categories[], create, update, remove
- [x] `useTagStore` — tags[], syncFromBookmarks() (đếm tần suất từ bookmarks)
- [x] `useUIStore` — viewMode, sidebarOpen, sort (persist vào localStorage)
- [x] `useSearchStore` — query, results, isSearching

### 5. Layout Shell
- [x] `DataLoader` — component vô hình, hydrate tất cả stores từ idb khi mount
- [x] `AppShell` — 2-column layout (sidebar 256px + main), mobile drawer overlay
- [x] `Sidebar` — nav tree: All Bookmarks → Folders → Categories → Tags (với count badge)
- [x] `SidebarSection` — collapsible section với chevron animation
- [x] `SidebarItem` — nav link với icon, label, count
- [x] `SidebarFolderTree` — recursive folder tree với expand/collapse
- [x] `TopBar` — search bar, view toggle (grid/list), sort dropdown, Import button, Add button

### 6. UI Primitives
- [x] `Button` — variants: primary (Notion Blue), secondary, ghost, pill
- [x] `Input` — với label, error state
- [x] `Textarea` — với label, error state
- [x] `Spinner` — loading indicator
- [x] `ViewToggle` — Grid / List toggle

### 7. Bookmark Display
- [x] `BookmarkCard` — card Notion-style: favicon + domain + title + description + tags + hover menu
- [x] `BookmarkRow` — compact list row: favicon + title + domain + tags + date + menu
- [x] `BookmarkGrid` — responsive grid (1→2→3→4 columns)
- [x] `BookmarkList` — list với header row
- [x] `BookmarkEmpty` — empty state với icon + message
- [x] `BookmarkMenu` — context menu (Edit, Delete) via Radix DropdownMenu
- [x] `FaviconImage` — Google Favicon API với fallback letter-avatar (màu deterministic từ domain hash)
- [x] `TagBadge` — pill badge với link đến `/tag/[slug]`

### 8. Dialogs & Forms
- [x] `DialogShell` — Radix Dialog wrapper với header, close button, animation
- [x] `BookmarkDialog` — Add/Edit bookmark (2 modes)
- [x] `FolderDialog` — Create/Rename folder
- [x] `CategoryDialog` — Create category
- [x] `DeleteConfirmDialog` — xác nhận xóa với loading state
- [x] `ImportDialog` — 4-step flow: idle → preview → importing (progress bar) → done/error
- [x] `BookmarkForm` — form fields: URL, Title, Description, Folder picker, Category picker, Tags
- [x] `TagInput` — multi-tag input với autocomplete dropdown từ existing tags
- [x] `FolderPicker` — select folder dropdown

### 9. Chrome Bookmark Import
- [x] `chromeParser.ts` — parse Netscape Bookmark HTML format bằng DOMParser, walk `<DL>/<DT>/<A>` recursively, track folderPath breadcrumb
- [x] `importService.ts` — dedup bằng URL, resolve/tạo folder chain từ folderPath, batch write 50 bookmarks/chunk với `requestIdleCallback`
- [x] `useImport` hook — state machine: idle → preview → importing → done/error

### 10. Search
- [x] `searchService.ts` — in-memory full-text search với scoring: title×3, url×2, tags×2, description×1, trả về top 100 kết quả
- [x] `useSearch` hook — debounce 200ms
- [x] `SearchBar` — controlled input với clear button
- [x] `SearchResults` — hiển thị kết quả với bookmark count
- [x] `SearchHighlight` — highlight match tokens trong title

### 11. Hooks
- [x] `useKeyboardShortcuts` — `Cmd/Ctrl+K` → /search, `N` → new bookmark dialog

### 12. Pages & Routes
- [x] `/` — All bookmarks với sort
- [x] `/folder/[id]` — Bookmarks theo folder
- [x] `/tag/[slug]` — Bookmarks theo tag
- [x] `/category/[slug]` — Bookmarks theo category
- [x] `/search` — Search page với SearchBar + SearchResults
- [x] `layout.tsx` — Root layout: Inter font (next/font/google), PWA metadata, AppShell

### 13. PWA
- [x] `public/manifest.webmanifest` — name, short_name, display: standalone, theme_color: #0075de
- [x] Icons placeholder — icon-192.png, icon-512.png, icon-maskable-192.png, apple-touch-icon.png (192×192, 512×512 màu Notion Blue)
- [x] Service worker config — CacheFirst cho app shell, disabled trong development

---

## 🔲 Còn lại (Backlog)

- [ ] Thay placeholder icons bằng icon thật (có thể dùng Figma hoặc tool tạo icon)
- [x] Keyboard shortcut `I` → mở Import dialog (cùng lúc wire luôn `N` và `Cmd/Ctrl+K` vào TopBar)
- [ ] Drag & drop reorder bookmarks trong folder
- [x] Export bookmark ra file HTML (nút Export trong TopBar, Netscape Bookmark format)
- [ ] Dark mode
- [ ] Pagination / virtual scroll khi có >1000 bookmarks
- [x] Tự động fetch title/description khi paste URL (API route `/api/metadata`, spinner trong form)
- [x] Thêm category trực tiếp từ Sidebar (nút "+" ở section Categories)
- [ ] PWA offline indicator (toast khi mất kết nối)
- [ ] Unit tests cho searchService và chromeParser
