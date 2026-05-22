# PRD — Bookmark Manager PWA

## 1. Tổng quan sản phẩm

**Tên sản phẩm:** Bookmark Manager  
**Loại:** Personal tool / PWA (Progressive Web App)  
**Mục tiêu:** Thay thế Chrome Bookmark Manager bằng một ứng dụng đẹp hơn, dễ quản lý hơn, cài được như app trên desktop và mobile.

---

## 2. Vấn đề cần giải quyết

| Vấn đề | Hiện trạng | Giải pháp |
|---|---|---|
| Bookmark Chrome lộn xộn, khó tìm | Không có tag, không có search tốt | Hệ thống folder + category + tag + full-text search |
| Chrome Bookmark Manager nhìn xấu | Hiển thị dạng text list đơn giản | Card view đẹp với favicon, description, tag badges |
| Không thể cài như app | Chỉ dùng trong browser | PWA: cài được trên iOS/Android/desktop |
| Bookmark phân tán | Mỗi device, mỗi browser khác nhau | Import từ Chrome, lưu cục bộ (IndexedDB) |

---

## 3. Mục tiêu sản phẩm

1. **Gom bookmark** — Import toàn bộ bookmark từ Chrome vào một nơi
2. **Hiển thị đẹp** — Card view với favicon, title, description, tags; không phải list text thô
3. **Phân loại rõ ràng** — Folder (nested), Category, Tag tự do
4. **Tìm kiếm nhanh** — Full-text search qua title, URL, description, tags
5. **Cài như app** — PWA installable trên Chrome/Safari

---

## 4. Người dùng mục tiêu

- Cá nhân lưu nhiều link (developer, designer, researcher, content creator)
- Người dùng Chrome đang có sẵn bookmark muốn migrate
- Người muốn có app riêng, không dùng dịch vụ cloud như Pocket, Raindrop

---

## 5. Tính năng

### 5.1 Quản lý Bookmark
| Tính năng | Mô tả |
|---|---|
| Thêm thủ công | Nhập URL, title, description, folder, category, tags |
| Sửa | Cập nhật mọi field của bookmark |
| Xóa | Có confirm dialog |
| Hiển thị | Grid view (card) hoặc List view (compact row) |
| Sort | Newest, Oldest, Title A-Z, Title Z-A, Recently updated |

### 5.2 Phân loại
| Loại | Mô tả |
|---|---|
| **Folder** | Nhóm bookmark, nested không giới hạn, sidebar tree |
| **Category** | Label dạng flat (e.g. "Design", "Dev Tools"), một bookmark thuộc một category |
| **Tag** | Multi-tag tự do, bookmark có thể gắn nhiều tag |

### 5.3 Import từ Chrome
- Upload file `.html` export từ Chrome
- Tự động parse folder structure → tạo folders tương ứng trong app
- Dedup: bỏ qua bookmark đã tồn tại (theo URL)
- Progress bar cho file lớn
- Report: đã import X, bỏ qua Y (duplicate)

### 5.4 Tìm kiếm
- Full-text search qua title, URL, domain, description, tags
- Scoring: title được ưu tiên hơn URL, URL hơn description
- Highlight match trong kết quả
- Keyboard shortcut: `Cmd/Ctrl+K`

### 5.5 PWA
- Cài được từ Chrome: "Add to Home Screen" / "Install App"
- Chạy standalone (không có browser UI)
- Offline: xem được bookmark đã có (data trong IndexedDB)
- Theme color: Notion Blue (#0075de)

### 5.6 Keyboard Shortcuts
| Shortcut | Hành động |
|---|---|
| `Cmd/Ctrl + K` | Mở search |
| `N` | Mở dialog thêm bookmark mới |
| `Esc` | Đóng dialog |

---

## 6. Design System

Theo `DESIGN.md` — Notion-inspired warm minimalism:

| Token | Giá trị |
|---|---|
| Primary color | Notion Blue `#0075de` |
| Background | Pure White `#ffffff` |
| Sidebar bg | Warm White `#f6f5f4` |
| Text primary | `rgba(0,0,0,0.95)` |
| Text secondary | `#615d59` |
| Text muted | `#a39e98` |
| Border | `1px solid rgba(0,0,0,0.1)` (whisper) |
| Card shadow | 4-layer rgba stack (max opacity 0.04) |
| Font | Inter (Google Fonts, substitute cho NotionInter) |
| Border radius | 12px (card), 4px (button/input), 9999px (pill/badge) |

---

## 7. Kiến trúc kỹ thuật

### Tech Stack
| Layer | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| UI Primitives | Radix UI (Dialog, DropdownMenu, Tooltip) |
| Icons | Lucide React |
| State | Zustand v5 |
| Database | IndexedDB via `idb` v8 (client-only, no backend) |
| PWA | `@ducanh2912/next-pwa` (Workbox) |
| Deploy | Vercel |

### Data Model
```
Bookmark       — id, url, title, description, favicon, folderId, categoryId, tags[], createdAt, updatedAt, importedAt
Folder         — id, name, parentId (nullable, allows nesting), position, createdAt, updatedAt
Category       — id, name, slug, color, createdAt
Tag            — slug (PK), label, count (denormalized)
```

### Routing
```
/                     → All bookmarks
/folder/[id]          → Bookmarks trong folder
/tag/[slug]           → Bookmarks theo tag
/category/[slug]      → Bookmarks theo category
/search               → Search page
```

### Storage Strategy
- **IndexedDB** (`bookmark-manager` database): toàn bộ dữ liệu user (bookmarks, folders, categories, tags)
- **localStorage** (Zustand persist): UI preferences (viewMode, sidebarOpen, sort)
- **Không có backend** — app chạy hoàn toàn offline sau lần load đầu

### Data Flow
```
App mount
  → DataLoader (useEffect once)
    → getAllBookmarks() + getAllFolders() + getAllCategories() + getAllTags()
    → Zustand stores hydrated
    → UI renders

User action (add/edit/delete)
  → Optimistic update (Zustand state ngay lập tức)
  → Async write to IndexedDB
```

---

## 8. File Structure

```
bookmark/
├── public/
│   ├── icons/                # PWA icons (192, 512, maskable)
│   └── manifest.webmanifest
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout + AppShell
│   │   ├── page.tsx          # Home: all bookmarks
│   │   ├── folder/[id]/
│   │   ├── tag/[slug]/
│   │   ├── category/[slug]/
│   │   └── search/
│   ├── components/
│   │   ├── layout/           # AppShell, Sidebar, TopBar, DataLoader
│   │   ├── bookmarks/        # BookmarkCard, BookmarkGrid, FaviconImage, TagBadge
│   │   ├── dialogs/          # BookmarkDialog, ImportDialog, FolderDialog...
│   │   ├── forms/            # BookmarkForm, TagInput, FolderPicker
│   │   ├── search/           # SearchBar, SearchResults, SearchHighlight
│   │   └── ui/               # Button, Input, Spinner, ViewToggle
│   ├── lib/
│   │   ├── db/               # IndexedDB: index, bookmarks, folders, categories, tags
│   │   ├── import/           # chromeParser, importService
│   │   ├── search/           # searchService
│   │   ├── favicon.ts
│   │   └── utils.ts
│   ├── store/                # 6 Zustand stores
│   ├── hooks/                # useSearch, useImport, useKeyboardShortcuts
│   └── types/index.ts
├── DESIGN.md                 # Design system spec
├── PRD.md                    # (file này)
├── tasklist.md               # Task tracking
└── next.config.ts
```

---

## 9. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Build | ✅ Pass (TypeScript clean) |
| Dev server | ✅ Running tại localhost:3000 |
| Tất cả routes | ✅ HTTP 200 |
| PWA manifest | ✅ Served correctly |
| TypeScript | ✅ 0 errors |

---

## 10. Backlog (chưa làm)

- [ ] Icon thật (thay placeholder màu xanh trơn)
- [ ] Auto-fetch title/description khi paste URL (cần API route proxy tránh CORS)
- [ ] Drag & drop reorder bookmark trong folder
- [ ] Export ra Chrome bookmark HTML
- [ ] Dark mode
- [ ] Virtual scroll cho danh sách lớn (>1000 bookmarks)
- [ ] Thêm category từ Sidebar
- [ ] Offline indicator toast
- [ ] Unit tests (searchService, chromeParser)
- [ ] Deploy lên Vercel

---

## 11. Hướng dẫn chạy

```bash
# Development
npm run dev        # http://localhost:3000

# Production build
npm run build
npm run start

# Type check
npx tsc --noEmit
```

**Import Chrome bookmarks:**
1. Chrome → Bookmarks → Bookmark Manager → ⋮ → Export bookmarks
2. Lưu file `.html`
3. Mở app → click "Import" → upload file → Import
