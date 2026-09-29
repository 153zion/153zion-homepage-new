-- ============================================================
-- 153ERP 상담일지 모듈 — 1단계(MVP) 스키마
-- 수파베이스 대시보드 → SQL Editor 에 붙여넣고 Run 하세요.
-- 원칙: ④ 누구나 복제·사용 가능 (office_id 로 사무소 분리,
--       선택지·회사정보를 코드가 아닌 테이블로 관리)
-- ============================================================

-- ─── 1. 사무소 ────────────────────────────────────────────── [④]
create table if not exists public.offices (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  address     text,
  phone       text,
  fax         text,
  email       text,
  doc_no_rule text not null default 'YYYYMM-NN',
  created_at  timestamptz not null default now()
);

-- ─── 2. 직원·권한 ─────────────────────────────────────────── [④]
create table if not exists public.staff (
  id           uuid primary key default gen_random_uuid(),
  office_id    uuid not null references public.offices(id) on delete cascade,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name         text not null,
  position     text,                                    -- 대표/이사/실장/과장/사무장/주임
  role         text not null default '직원'
               check (role in ('대표','직원','조회')),
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 로그인한 사람의 사무소를 돌려주는 함수 (RLS 에서 사용)
create or replace function public.my_office_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select office_id from public.staff
  where auth_user_id = auth.uid() and active
  limit 1
$$;

-- 내부 함수는 로그인한 직원만 호출할 수 있게 잠급니다
revoke execute on function public.my_office_id() from public, anon;
grant  execute on function public.my_office_id() to authenticated;

-- ─── 3. 소개자 (지인마케팅·소개비 지급과 연결할 수 있게 분리) ─ [①]
create table if not exists public.referrers (
  id         uuid primary key default gen_random_uuid(),
  office_id  uuid not null references public.offices(id) on delete cascade,
  name       text not null,
  phone      text,
  company    text,
  note       text,
  created_at timestamptz not null default now()
);

-- ─── 4. 선택지 관리 (용역내용·지목·용도지역·상태·무산사유) ──── [④]
create table if not exists public.option_sets (
  id         uuid primary key default gen_random_uuid(),
  office_id  uuid not null references public.offices(id) on delete cascade,
  set_key    text not null,     -- service | jimok | zone | status | lost_reason
  code       text not null,
  label      text not null,
  color      text,
  sort_order int  not null default 0,
  active     boolean not null default true,
  unique (office_id, set_key, code)
);

-- ─── 5. 사무소 설정 (회사명·문서번호규칙·방치 알림 일수 등) ─── [④]
create table if not exists public.settings (
  office_id uuid not null references public.offices(id) on delete cascade,
  key       text not null,
  value     text,
  primary key (office_id, key)
);

-- ─── 6. 상담일지 본문 ──────────────────────────────────────── [①②③]
create table if not exists public.consultations (
  id                uuid primary key default gen_random_uuid(),
  office_id         uuid not null references public.offices(id) on delete cascade,
  doc_no            text not null,                       -- 202609-03 [③ 자동부여]
  status            text not null default '대기',         -- [① 칸반]
  consulted_on      date not null default current_date,
  client_name       text not null,
  client_phone      text not null,
  land_area         numeric(12,2),
  area_pending_note text,                                 -- 면적 미정 사유
  zone_code         text,                                 -- 용도지역
  client_request    text,                                 -- 건축주 요구사항
  agency_note       text,                                 -- 관청 협의 등 기타사항
  remark            text,                                 -- 비고
  referrer_id       uuid references public.referrers(id) on delete set null,
  next_contact_on   date,                                 -- [① 다음 연락 예정일]
  author_id         uuid references public.staff(id) on delete set null,
  lost_reason_code  text,                                 -- [① 무산 사유]
  spent_hours       numeric(6,2),                         -- [② 상담에 쓴 시간]
  inquiry_id        bigint,                               -- 홈페이지 문의(inquiries) 연결 [③]
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (office_id, doc_no)
);

create index if not exists consultations_office_status_idx
  on public.consultations (office_id, status, consulted_on desc);
create index if not exists consultations_client_idx
  on public.consultations (office_id, client_name);

-- ─── 7. 대지 필지 (여러 필지 입력) ─────────────────────────────
create table if not exists public.consultation_parcels (
  id              uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  address         text not null,          -- 안성시 삼죽면 율곡리 16
  jimok_codes     text[] not null default '{}',
  sort_order      int not null default 0
);

-- ─── 8. 용역내용 (복수 선택) ──────────────────────────────────
create table if not exists public.consultation_services (
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  service_code    text not null,
  primary key (consultation_id, service_code)
);

-- ─── 9. 첨부 사진 (항공사진·지적도) ───────────────────────── [③]
create table if not exists public.attachments (
  id              uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  storage_path    text not null,
  kind            text not null default '항공사진',
  uploaded_by     uuid references public.staff(id) on delete set null,
  created_at      timestamptz not null default now()
);

-- ─── 10. 상태 변경 이력 ───────────────────────────────────── [①]
create table if not exists public.status_history (
  id              uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  from_status     text,
  to_status       text not null,
  changed_by      uuid references public.staff(id) on delete set null,
  changed_at      timestamptz not null default now()
);

-- ─── 11. 문서번호 자동 부여 (YYYYMM-NN) ───────────────────── [③]
create or replace function public.next_doc_no(p_office uuid, p_date date default current_date)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text := to_char(p_date, 'YYYYMM');
  v_seq    int;
begin
  select coalesce(max(split_part(doc_no, '-', 2)::int), 0) + 1
    into v_seq
  from public.consultations
  where office_id = p_office and doc_no like v_prefix || '-%';

  return v_prefix || '-' || lpad(v_seq::text, 2, '0');
end;
$$;

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at := now(); return new; end;
$$;

revoke execute on function public.next_doc_no(uuid, date) from public, anon;
grant  execute on function public.next_doc_no(uuid, date) to authenticated;

drop trigger if exists consultations_touch on public.consultations;
create trigger consultations_touch before update on public.consultations
for each row execute function public.touch_updated_at();

-- ============================================================
-- RLS — 로그인한 직원만, 자기 사무소 자료만
-- (상담일지에는 건축주 실명·전화번호가 들어갑니다)
-- ============================================================
alter table public.offices              enable row level security;
alter table public.staff                enable row level security;
alter table public.referrers            enable row level security;
alter table public.option_sets          enable row level security;
alter table public.settings             enable row level security;
alter table public.consultations        enable row level security;
alter table public.consultation_parcels enable row level security;
alter table public.consultation_services enable row level security;
alter table public.attachments          enable row level security;
alter table public.status_history       enable row level security;

-- 사무소 단위 테이블
do $$
declare t text;
begin
  foreach t in array array['offices','staff','referrers','option_sets','settings','consultations']
  loop
    execute format('drop policy if exists %I_office on public.%I', t, t);
    if t = 'offices' then
      execute format($f$create policy %I_office on public.%I
        for all to authenticated
        using (id = public.my_office_id())
        with check (id = public.my_office_id())$f$, t, t);
    else
      execute format($f$create policy %I_office on public.%I
        for all to authenticated
        using (office_id = public.my_office_id())
        with check (office_id = public.my_office_id())$f$, t, t);
    end if;
  end loop;
end $$;

-- 상담에 딸린 자식 테이블
do $$
declare t text;
begin
  foreach t in array array['consultation_parcels','consultation_services','attachments','status_history']
  loop
    execute format('drop policy if exists %I_child on public.%I', t, t);
    execute format($f$create policy %I_child on public.%I
      for all to authenticated
      using (exists (select 1 from public.consultations c
                     where c.id = consultation_id and c.office_id = public.my_office_id()))
      with check (exists (select 1 from public.consultations c
                     where c.id = consultation_id and c.office_id = public.my_office_id()))$f$, t, t);
  end loop;
end $$;

-- ============================================================
-- 첨부 사진 저장소 (비공개 버킷)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('consultation-photos', 'consultation-photos', false)
on conflict (id) do nothing;

drop policy if exists consultation_photos_rw on storage.objects;
create policy consultation_photos_rw on storage.objects
  for all to authenticated
  using (bucket_id = 'consultation-photos')
  with check (bucket_id = 'consultation-photos');

-- ============================================================
-- 초기 자료 — (주)153시온건축사사무소
-- ============================================================
insert into public.offices (id, name, address, phone, email)
values ('11111111-1111-1111-1111-111111111111',
        '(주)153시온건축사사무소',
        '경기도 안성시 보개원삼로 181, 201호',
        '',
        'zion153architecture@gmail.com')
on conflict (id) do nothing;

-- 선택지 [④ 관리자가 화면에서 추가·수정할 수 있게 테이블로]
insert into public.option_sets (office_id, set_key, code, label, color, sort_order) values
  ('11111111-1111-1111-1111-111111111111','service','신축','신축',null,1),
  ('11111111-1111-1111-1111-111111111111','service','증축','증축',null,2),
  ('11111111-1111-1111-1111-111111111111','service','용도변경','용도변경',null,3),
  ('11111111-1111-1111-1111-111111111111','service','표시변경','표시변경',null,4),
  ('11111111-1111-1111-1111-111111111111','service','해체','해체',null,5),
  ('11111111-1111-1111-1111-111111111111','service','리모델링','리모델링',null,6),
  ('11111111-1111-1111-1111-111111111111','service','양성화','양성화(가설)',null,7),

  ('11111111-1111-1111-1111-111111111111','jimok','전','전',null,1),
  ('11111111-1111-1111-1111-111111111111','jimok','답','답',null,2),
  ('11111111-1111-1111-1111-111111111111','jimok','임','임야',null,3),
  ('11111111-1111-1111-1111-111111111111','jimok','대','대',null,4),
  ('11111111-1111-1111-1111-111111111111','jimok','잡종지','잡종지',null,5),
  ('11111111-1111-1111-1111-111111111111','jimok','과수원','과수원',null,6),
  ('11111111-1111-1111-1111-111111111111','jimok','목장용지','목장용지',null,7),
  ('11111111-1111-1111-1111-111111111111','jimok','도로','도로',null,8),

  ('11111111-1111-1111-1111-111111111111','zone','보전관리지역','보전관리지역',null,1),
  ('11111111-1111-1111-1111-111111111111','zone','생산관리지역','생산관리지역',null,2),
  ('11111111-1111-1111-1111-111111111111','zone','계획관리지역','계획관리지역',null,3),
  ('11111111-1111-1111-1111-111111111111','zone','농림지역','농림지역',null,4),
  ('11111111-1111-1111-1111-111111111111','zone','자연녹지지역','자연녹지지역',null,5),
  ('11111111-1111-1111-1111-111111111111','zone','제1종일반주거지역','제1종일반주거지역',null,6),
  ('11111111-1111-1111-1111-111111111111','zone','제2종일반주거지역','제2종일반주거지역',null,7),
  ('11111111-1111-1111-1111-111111111111','zone','자연환경보전지역','자연환경보전지역',null,8),

  ('11111111-1111-1111-1111-111111111111','status','대기','대기','#9CA3AF',1),
  ('11111111-1111-1111-1111-111111111111','status','검토','검토','#DC2626',2),
  ('11111111-1111-1111-1111-111111111111','status','계획','계획','#F59E0B',3),
  ('11111111-1111-1111-1111-111111111111','status','진행','진행','#22A85A',4),
  ('11111111-1111-1111-1111-111111111111','status','계약','계약','#2B3A4F',5),
  ('11111111-1111-1111-1111-111111111111','status','무산','무산','#6B7280',6),

  ('11111111-1111-1111-1111-111111111111','lost_reason','설계비','설계비',null,1),
  ('11111111-1111-1111-1111-111111111111','lost_reason','법규불가','법규 불가',null,2),
  ('11111111-1111-1111-1111-111111111111','lost_reason','연락두절','연락두절',null,3),
  ('11111111-1111-1111-1111-111111111111','lost_reason','타사무소','타사무소',null,4),
  ('11111111-1111-1111-1111-111111111111','lost_reason','건축주보류','건축주 보류',null,5),
  ('11111111-1111-1111-1111-111111111111','lost_reason','기타','기타',null,6)
on conflict (office_id, set_key, code) do nothing;

insert into public.settings (office_id, key, value) values
  ('11111111-1111-1111-1111-111111111111','stale_days','7'),
  ('11111111-1111-1111-1111-111111111111','doc_no_rule','YYYYMM-NN')
on conflict (office_id, key) do nothing;

-- ============================================================
-- 직원 등록 — 아래는 계정을 만든 뒤에 실행하세요.
--
-- 1) 수파베이스 → Authentication → Users → Add user 로
--    직원 6명의 이메일/비밀번호 계정을 먼저 만듭니다.
-- 2) 그 다음 아래 INSERT 의 이메일을 바꿔서 실행하면
--    계정과 직원 정보가 연결됩니다.
--
-- insert into public.staff (office_id, auth_user_id, name, position, role)
-- select '11111111-1111-1111-1111-111111111111', u.id, '홍길동', '대표', '대표'
-- from auth.users u where u.email = 'daepyo@example.com';
--
-- 직책: 대표 / 이사 / 실장 / 과장 / 사무장 / 주임  (직원 6명)
-- 권한(role): 대표 = 전체, 직원 = 작성·수정, 조회 = 보기만
-- ============================================================
