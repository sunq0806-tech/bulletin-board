# 게시판 배포 가이드 (비개발자용)

## 전체 순서

```
Phase 0: BrowserUse로 Supabase 설정
Phase 1: 로컬에서 동작 확인
Phase 2: GitHub에 코드 올리기
Phase 3: Vercel에 배포하기
Phase 4: 동작 확인 (Acceptance Criteria)
```

---

## Phase 0: Supabase 설정 (BrowserUse 처리)

BrowserUse에게 아래 4가지를 요청하세요:

### 1. Supabase 프로젝트 생성
- https://supabase.com 에서 새 프로젝트 생성
- 프로젝트 이름: `bulletin-board` (또는 원하는 이름)
- Database Password: 안전한 비밀번호 설정 (저장해두세요)

### 2. 테이블 생성 (SQL Editor에서 실행)
Supabase Dashboard → SQL Editor → 아래 SQL 복붙 후 Run:

```sql
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table posts enable row level security;
create policy "read all" on posts for select using (true);
create policy "insert own" on posts for insert with check (auth.uid() = user_id);
create policy "update own" on posts for update using (auth.uid() = user_id);
create policy "delete own" on posts for delete using (auth.uid() = user_id);
```

### 3. 이메일 인증 끄기
- Authentication → Providers → Email
- "Confirm email" 토글을 OFF로 변경

### 4. 관리자 계정 생성
- Authentication → Users → "Add user" 버튼
- 이메일과 비밀번호 입력 (이게 게시판 로그인 계정입니다)

### 5. API 키 복사
- Project Settings → API
- **Project URL** 복사
- **anon public** key 복사

### RLS 동작 확인 (SQL Editor에서 실행)
```sql
-- 1. 읽기 가능 확인 (결과가 비어있어도 OK, 에러 없으면 PASS)
select * from posts limit 5;

-- 2. 잘못된 user_id 삽입 차단 확인 (에러 메시지 나오면 PASS)
insert into posts (title, content, user_id)
values ('test', 'test', '00000000-0000-0000-0000-000000000000');

-- 3. 교차 사용자 수정 차단 확인 (0 rows affected면 PASS)
update posts set title = 'hacked' where user_id != auth.uid();
```

---

## Phase 1: 로컬 동작 확인

```bash
# 1. 환경변수 파일 생성
cp .env.local.example .env.local

# 2. .env.local 파일을 텍스트 에디터로 열어서
#    NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 입력

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 http://localhost:3000 열기
```

---

## Phase 2: GitHub에 올리기

```bash
git init
git add .
git commit -m "feat: bulletin board with Next.js + Supabase"

# GitHub에서 새 Repository 생성 후:
git remote add origin https://github.com/YOUR_USERNAME/bulletin-board.git
git branch -M main
git push -u origin main
```

> ✅ `.env.local`은 이미 `.gitignore`에 있어서 자동으로 제외됩니다.

---

## Phase 3: Vercel 배포

1. https://vercel.com 접속 → "Add New Project"
2. GitHub 저장소 선택 → Import
3. Framework Preset: Next.js (자동 감지됨)
4. **Environment Variables 추가** (중요!):
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon key
   - Environment: Production, Preview, Development 모두 체크
5. Deploy 클릭

### Supabase Auth URL 설정 (Vercel 배포 후)
- Supabase Dashboard → Authentication → URL Configuration
- **Site URL**: `https://your-project.vercel.app`
- **Redirect URLs**: `https://your-project.vercel.app/**`

---

## Phase 4: 동작 확인 체크리스트

배포 후 아래를 순서대로 확인하세요:

- [ ] Vercel URL에서 게시판 홈이 열림
- [ ] 시크릿 창에서 `/posts/new` 입력 → `/login`으로 이동
- [ ] 로그인 (Phase 0에서 만든 계정)
- [ ] 새 글 작성 → 목록에 즉시 표시
- [ ] 페이지 새로고침 → 글 유지
- [ ] 글 수정 → 내용 변경 확인
- [ ] 글 삭제 → 목록에서 사라짐

모든 항목이 체크되면 🎉 **배포 완료!**
