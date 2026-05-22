/* ──────────────────────────────────────────────────────────
 * Data
 * ────────────────────────────────────────────────────────── */
const PROJECT_START = new Date(2026, 3, 1);   // 2026-04-01
const PROJECT_END   = new Date(2026, 5, 30);  // 2026-06-30
const TODAY = new Date(2026, 4, 21);          // 2026-05-21

const TASKS = [
  { phase:"기획", phaseKey:"plan", subs:{a:true,b:true,c:false}, feature:"사용자 리서치", sub:"심층 인터뷰 · 설문", owner:"김지영", ownerAv:"av-1", out:"리서치 보고서",
    unit:100, md:5, weight:8, ps:"2026-04-01", pe:"2026-04-07", as:"2026-04-01", ae:"2026-04-08", delay:1 },
  { phase:"기획", phaseKey:"plan", subs:{a:true,b:true,c:true}, feature:"경쟁사 벤치마킹", sub:"국내·해외 12개사", owner:"김지영", ownerAv:"av-1", out:"분석 자료",
    unit:100, md:3, weight:5, ps:"2026-04-06", pe:"2026-04-12", as:"2026-04-06", ae:"2026-04-12", delay:0 },
  { phase:"기획", phaseKey:"plan", subs:{a:true,b:true,c:true}, feature:"서비스 정의 & IA", sub:"기획서 v1.0 확정", owner:"박민수", ownerAv:"av-2", out:"기획서 v1.0",
    unit:100, md:7, weight:10, ps:"2026-04-10", pe:"2026-04-20", as:"2026-04-10", ae:"2026-04-19", delay:0 },

  { phase:"디자인", phaseKey:"design", subs:{a:true,b:true,c:false}, feature:"와이어프레임 설계", sub:"42개 스크린", owner:"이수진", ownerAv:"av-3", out:"와이어프레임",
    unit:85, md:10, weight:10, ps:"2026-04-15", pe:"2026-04-30", as:"2026-04-15", ae:"2026-05-02", delay:2 },
  { phase:"디자인", phaseKey:"design", subs:{a:true,b:false,c:false}, feature:"메인 UI 디자인", sub:"홈·검색·카테고리", owner:"이수진", ownerAv:"av-3", out:"UI 시안 v1",
    unit:65, md:8, weight:10, ps:"2026-04-25", pe:"2026-05-10", as:"2026-04-26", ae:"", delay:0 },
  { phase:"디자인", phaseKey:"design", subs:{a:true,b:false,c:false}, feature:"상세 UI · 결제 플로우", sub:"PDP · Cart · Pay", owner:"정유나", ownerAv:"av-5", out:"UI 시안 v1",
    unit:40, md:12, weight:10, ps:"2026-05-04", pe:"2026-05-22", as:"2026-05-06", ae:"", delay:0 },

  { phase:"개발", phaseKey:"dev", subs:{a:true,b:false,c:false}, feature:"FE · 메인 페이지", sub:"React Native · iOS/AOS", owner:"최우진", ownerAv:"av-4", out:"앱 소스코드",
    unit:35, md:15, weight:12, ps:"2026-05-04", pe:"2026-05-30", as:"2026-05-06", ae:"", delay:0 },
  { phase:"개발", phaseKey:"dev", subs:{a:false,b:false,c:false}, feature:"FE · 상품·검색 페이지", sub:"PDP · SRP · Filter", owner:"최우진", ownerAv:"av-4", out:"앱 소스코드",
    unit:12, md:12, weight:8, ps:"2026-05-18", pe:"2026-06-12", as:"2026-05-20", ae:"", delay:0 },
  { phase:"개발", phaseKey:"dev", subs:{a:true,b:true,c:false}, feature:"BE · API & 인증", sub:"GraphQL · OAuth 2.0", owner:"한지원", ownerAv:"av-6", out:"API 문서 · 서버",
    unit:72, md:10, weight:8, ps:"2026-04-20", pe:"2026-05-25", as:"2026-04-20", ae:"", delay:0 },
  { phase:"개발", phaseKey:"dev", subs:{a:false,b:false,c:false}, feature:"BE · 결제 모듈", sub:"PG 연동 · 정산", owner:"한지원", ownerAv:"av-6", out:"결제 API",
    unit:22, md:14, weight:7, ps:"2026-05-10", pe:"2026-06-15", as:"2026-05-14", ae:"", delay:4 },

  { phase:"테스트", phaseKey:"test", subs:{a:false,b:false,c:false}, feature:"QA · 통합 테스트", sub:"E2E · 회귀 · 부하", owner:"윤서연", ownerAv:"av-3", out:"테스트 보고서",
    unit:0, md:8, weight:7, ps:"2026-06-01", pe:"2026-06-20", as:"", ae:"", delay:0 },

  { phase:"배포", phaseKey:"deploy", subs:{a:false,b:false,c:false}, feature:"배포 자동화 · 운영", sub:"CI/CD · 모니터링", owner:"최우진", ownerAv:"av-4", out:"배포 스크립트",
    unit:0, md:5, weight:5, ps:"2026-06-15", pe:"2026-06-30", as:"", ae:"", delay:0 },
];

/* ──────────────────────────────────────────────────────────
 * Date helpers
 * ────────────────────────────────────────────────────────── */
function parseDate(s){ if(!s) return null; const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function dayDiff(a,b){ return Math.round((b - a) / 86400000); }
function isSameDay(a,b){ return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function fmt(d){ if(!d) return "—"; return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`; }

/* Generate day list for project range */
const DAYS = (() => {
  const out = [];
  let d = new Date(PROJECT_START);
  while (d <= PROJECT_END) {
    out.push(new Date(d));
    d.setDate(d.getDate()+1);
  }
  return out;
})();
const TOTAL_DAYS = DAYS.length;
const DAY_W = 28;

/* Group days by month */
const MONTHS = (() => {
  const m = [];
  let cur = null;
  DAYS.forEach((d, i) => {
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!cur || cur.key !== key) {
      cur = { key, year: d.getFullYear(), month: d.getMonth()+1, span: 0, startIdx: i };
      m.push(cur);
    }
    cur.span++;
  });
  return m;
})();

/* ──────────────────────────────────────────────────────────
 * Build header
 * ────────────────────────────────────────────────────────── */
const cols = document.getElementById("wbsCols");
const head = document.getElementById("wbsHead");
const body = document.getElementById("wbsBody");

function buildCols(){
  const fixed = [
    ["c-phase",1], ["c-act-sub",3], ["c-feature",1], ["c-owner",1], ["c-out",1],
    ["c-unit",1], ["c-md",1], ["c-weight",1], ["c-overall",1],
    ["c-date",2], ["c-date",2], ["c-delay",1]
  ];
  fixed.forEach(([cls,count]) => {
    for(let i=0;i<count;i++){
      const c = document.createElement("col"); c.className = cls; cols.appendChild(c);
    }
  });
  for(let i=0;i<TOTAL_DAYS;i++){
    const c = document.createElement("col"); c.className = "c-day"; cols.appendChild(c);
  }
}

function buildHead(){
  // Row 1
  const tr1 = document.createElement("tr");
  tr1.innerHTML = `
    <th rowspan="3" class="sticky-l">단계</th>
    <th colspan="3">액티비티</th>
    <th rowspan="3" class="sticky-l">기능</th>
    <th rowspan="3" class="sticky-l">담당자</th>
    <th rowspan="3" class="sticky-l">산출물</th>
    <th rowspan="3" class="sticky-l">단위업무 공정률</th>
    <th rowspan="3" class="sticky-l">M/D</th>
    <th rowspan="3" class="sticky-l">가중치</th>
    <th rowspan="3" class="sticky-l sticky-shadow">전체 공정율</th>
    <th colspan="2">작업 예정일</th>
    <th colspan="3">작업 진행일</th>
    <th colspan="${TOTAL_DAYS}">전체 공정일</th>
  `;
  head.appendChild(tr1);

  // Row 2 — all sub-headers rowspan=2 so row 3 contains ONLY day cells
  const tr2 = document.createElement("tr");
  let r2 = `<th rowspan="2">a</th><th rowspan="2">b</th><th rowspan="2">c</th>
            <th rowspan="2">시작일</th><th rowspan="2">종료일</th>
            <th rowspan="2">시작일</th><th rowspan="2">종료일</th><th rowspan="2">지연</th>`;
  MONTHS.forEach(m => {
    r2 += `<th class="month" colspan="${m.span}"><span class="y">${m.year}</span>${String(m.month).padStart(2,"0")}월</th>`;
  });
  tr2.innerHTML = r2;
  head.appendChild(tr2);

  // Row 3 — only day cells
  const tr3 = document.createElement("tr");
  let r3 = "";
  DAYS.forEach((d, i) => {
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isToday = isSameDay(d, TODAY);
    const isMonthEnd = (i === TOTAL_DAYS-1) || (DAYS[i+1] && DAYS[i+1].getDate() === 1);
    const cls = ["day"];
    if (isWeekend) cls.push("weekend");
    if (isToday) cls.push("today");
    if (isMonthEnd) cls.push("month-end");
    r3 += `<th class="${cls.join(" ")}">${d.getDate()}</th>`;
  });
  tr3.innerHTML = r3;
  head.appendChild(tr3);
}

/* ──────────────────────────────────────────────────────────
 * Build body
 * ────────────────────────────────────────────────────────── */
function progressClass(t){
  if (t.unit >= 100) return "done";
  if (t.delay >= 3) return "danger";
  if (t.delay > 0) return "warn";
  return "";
}
function actualBarStateClass(t){
  if (t.unit >= 100) return "done";
  if (t.delay >= 3) return "danger";
  if (t.delay > 0) return "warn";
  return "";
}

function buildBody(){
  TASKS.forEach((t, idx) => {
    const tr = document.createElement("tr");
    const ps = parseDate(t.ps), pe = parseDate(t.pe);
    const as = parseDate(t.as), ae = parseDate(t.ae);
    const pClass = progressClass(t);

    // Sub a/b/c
    const subCell = (k) => `<td style="text-align:center"><span class="sub-tag ${t.subs[k]?"on":""}">${k}</span></td>`;

    // Delay
    let delayHtml;
    if (!t.as) delayHtml = `<span class="delay-tag zero">—</span>`;
    else if (t.delay > 0) delayHtml = `<span class="delay-tag bad">+${t.delay}일</span>`;
    else delayHtml = `<span class="delay-tag ok">정상</span>`;

    tr.innerHTML = `
      <td class="sticky-l"><span class="phase-tag phase-${t.phaseKey}">${t.phase}</span></td>
      ${subCell("a")}${subCell("b")}${subCell("c")}
      <td class="sticky-l feature-cell">${t.feature}<small>${t.sub}</small></td>
      <td class="sticky-l"><span class="owner"><span class="av ${t.ownerAv}">${t.owner.slice(-2)}</span>${t.owner}</span></td>
      <td class="sticky-l"><span class="out-pill">📄 ${t.out.replace("📄 ","")}</span></td>
      <td class="sticky-l">
        <div class="progress-wrap">
          <div class="progress ${pClass}" style="--p:${t.unit}"></div>
          <span>${t.unit}%</span>
        </div>
      </td>
      <td class="sticky-l num">${t.md}</td>
      <td class="sticky-l num">${t.weight}%</td>
      <td class="sticky-l sticky-shadow">
        <div class="progress-wrap">
          <div class="progress ${pClass}" style="--p:${Math.round(t.unit * t.weight / 100 * 10) / 10}"></div>
          <span>${Math.round(t.unit * t.weight / 100 * 10) / 10}%</span>
        </div>
      </td>
      <td class="date">${fmt(ps)}</td>
      <td class="date">${fmt(pe)}</td>
      <td class="date">${fmt(as)}</td>
      <td class="date">${fmt(ae)}</td>
      <td class="delay">${delayHtml}</td>
      <td class="timeline" colspan="${TOTAL_DAYS}">
        <div class="bars">${buildBars(t, ps, pe, as, ae)}</div>
      </td>
    `;
    body.appendChild(tr);
  });
}

function buildBars(t, ps, pe, as, ae){
  let html = "";

  // planned
  if (ps && pe) {
    const startIdx = Math.max(0, dayDiff(PROJECT_START, ps));
    const endIdx = Math.min(TOTAL_DAYS-1, dayDiff(PROJECT_START, pe));
    const left = startIdx * DAY_W + 2;
    const width = (endIdx - startIdx + 1) * DAY_W - 4;
    html += `<div class="bar planned" style="left:${left}px;width:${width}px" title="예정 ${fmt(ps)} ~ ${fmt(pe)}"></div>`;
  }

  // actual
  if (as) {
    const startIdx = Math.max(0, dayDiff(PROJECT_START, as));
    const endDate = ae || TODAY;
    const endIdx = Math.min(TOTAL_DAYS-1, dayDiff(PROJECT_START, endDate));
    const left = startIdx * DAY_W + 2;
    const width = Math.max(DAY_W - 4, (endIdx - startIdx + 1) * DAY_W - 4);
    const days = endIdx - startIdx + 1;
    const stateCls = actualBarStateClass(t);
    html += `<div class="bar actual ${stateCls}" style="left:${left}px;width:${width}px;--p:${t.unit}"
              title="실적 ${fmt(as)} ~ ${fmt(ae||TODAY)} · ${t.unit}%">
              <span class="label">${days}일 · ${t.unit}%</span>
            </div>`;

    // delay tail (if planned end exceeded)
    if (t.delay > 0 && pe) {
      const peIdx = Math.min(TOTAL_DAYS-1, dayDiff(PROJECT_START, pe));
      const tailLeft = (peIdx + 1) * DAY_W + 2;
      const tailW = t.delay * DAY_W - 4;
      html += `<div class="bar delay-tail" style="left:${tailLeft}px;width:${tailW}px" title="지연 ${t.delay}일"></div>`;
    }
  }

  return html;
}

function placeTodayLine(){
  const idx = dayDiff(PROJECT_START, TODAY);
  if (idx < 0 || idx >= TOTAL_DAYS) return;
  // Insert into each timeline row
  document.querySelectorAll(".timeline .bars").forEach(b => {
    const l = document.createElement("div");
    l.className = "today-line";
    l.style.left = (idx * DAY_W + DAY_W/2) + "px";
    if (b.parentElement.parentElement.rowIndex === 1) {
      // also add the TODAY label only on first row
      l.dataset.showLabel = "true";
    }
    b.appendChild(l);
  });
  // hide the label on all except first to avoid stacked labels
  const lines = document.querySelectorAll(".today-line");
  lines.forEach((el, i) => {
    if (i !== 0) el.style.setProperty("--hide-label","1");
  });
  // Use CSS to hide via attribute - but we already hide via positioning at top; ensure only one shows
  const sheet = document.createElement("style");
  sheet.textContent = `.today-line:not(:nth-of-type(1))::before { display: none; }
                       tbody tr:not(:first-child) .today-line::before { display: none; }`;
  document.head.appendChild(sheet);
}

/* ──────────────────────────────────────────────────────────
 * Sticky column offsets — measure & assign `left:` on each
 * sticky cell in the header & body.
 * ────────────────────────────────────────────────────────── */
function applyStickyOffsets(){
  // collect col widths in order of left-sticky columns:
  // 단계, 기능, 담당자, 산출물, 단위공정률, M/D, 가중치, 전체공정율
  // The sticky cells are class="sticky-l" in row order; we need cumulative left.
  // Approach: pick the first body row, measure each sticky-l td's offsetWidth, accumulate.
  const firstRow = body.querySelector("tr");
  if (!firstRow) return;
  const stickyTds = firstRow.querySelectorAll("td.sticky-l");
  let left = 0;
  const offsets = [];
  stickyTds.forEach(td => {
    offsets.push(left);
    left += td.getBoundingClientRect().width;
  });

  // Apply to every sticky-l td in body
  body.querySelectorAll("tr").forEach(tr => {
    tr.querySelectorAll("td.sticky-l").forEach((td, i) => {
      td.style.left = offsets[i] + "px";
    });
  });
  // Apply to header sticky cells. The header has these sticky-l ths (in row 1, with rowspan):
  // we put them in identical order: 단계, 기능, 담당자, 산출물, 단위공정률, M/D, 가중치, 전체공정율
  const headStickies = head.querySelectorAll("th.sticky-l");
  headStickies.forEach((th, i) => {
    th.style.left = offsets[i] + "px";
  });
}

/* ──────────────────────────────────────────────────────────
 * Init
 * ────────────────────────────────────────────────────────── */
buildCols();
buildHead();
buildBody();
placeTodayLine();
requestAnimationFrame(() => {
  applyStickyOffsets();
  // scroll to today
  const idx = dayDiff(PROJECT_START, TODAY);
  const scroll = document.getElementById("wbsScroll");
  if (idx > 5) {
    const stickyWidth = [...body.querySelector("tr").querySelectorAll("td.sticky-l")]
      .reduce((s, td) => s + td.getBoundingClientRect().width, 0);
    scroll.scrollLeft = Math.max(0, idx * DAY_W - scroll.clientWidth/2 + stickyWidth/2);
  }
});
window.addEventListener("resize", () => { applyStickyOffsets(); });

/* ──────────────────────────────────────────────────────────
 * Theme toggle (persisted)
 * ────────────────────────────────────────────────────────── */
const themeBtn = document.getElementById("themeToggle");
const iconMoon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const iconSun = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
function applyTheme(mode){
  document.body.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  themeBtn.innerHTML = mode === "dark" ? iconMoon : iconSun;
  themeBtn.setAttribute("aria-label", mode === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환");
}
const savedTheme = localStorage.getItem("atlas_theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
applyTheme(savedTheme);
themeBtn.addEventListener("click", () => {
  const next = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("atlas_theme", next);
});

/* ──────────────────────────────────────────────────────────
 * Mobile menu
 * ────────────────────────────────────────────────────────── */
const menuBtn = document.getElementById("menuBtn");
const sheetBack = document.getElementById("sheetBack");
const sheetClose = document.getElementById("sheetClose");
function openMenu(){ document.body.classList.add("menu-open"); menuBtn.setAttribute("aria-expanded","true"); }
function closeMenu(){ document.body.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded","false"); }
menuBtn.addEventListener("click", openMenu);
sheetClose.addEventListener("click", closeMenu);
sheetBack.addEventListener("click", closeMenu);

/* ──────────────────────────────────────────────────────────
 * Apply modal + mailto
 * ────────────────────────────────────────────────────────── */
const modal = document.getElementById("modalBack");
const form = document.getElementById("applyForm");
function openModal(){ modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); setTimeout(()=>form.querySelector("input").focus(), 100); }
function closeModal(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
document.getElementById("applyBtnTop").addEventListener("click", openModal);
document.getElementById("applyBtnMobile").addEventListener("click", openModal);
document.getElementById("reportBtn").addEventListener("click", openModal);
document.getElementById("modalCancel").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeMenu(); } });

form.addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(form);
  const name = fd.get("name") || "";
  const email = fd.get("email") || "";
  const role = fd.get("role") || "";
  const message = fd.get("message") || "";
  const subject = encodeURIComponent(`[Atlas WBS] 프로젝트 참여 신청 - ${name}`);
  const body = encodeURIComponent(
    `안녕하세요, Atlas WBS 프로젝트 참여를 신청합니다.\n\n` +
    `■ 이름: ${name}\n` +
    `■ 이메일: ${email}\n` +
    `■ 관심 영역: ${role}\n\n` +
    `■ 메시지:\n${message}\n`
  );
  window.location.href = `mailto:smjcreate@naver.com?subject=${subject}&body=${body}`;
  closeModal();
});

/* ──────────────────────────────────────────────────────────
 * IntersectionObserver fade-in
 * ────────────────────────────────────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }});
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ──────────────────────────────────────────────────────────
 * Updated-at "방금 전" ticker
 * ────────────────────────────────────────────────────────── */
let updatedSec = 0;
const updatedEl = document.getElementById("updatedAt");
setInterval(() => {
  updatedSec += 30;
  if (updatedSec < 60) updatedEl.textContent = "방금 전";
  else if (updatedSec < 3600) updatedEl.textContent = `${Math.floor(updatedSec/60)}분 전`;
  else updatedEl.textContent = `${Math.floor(updatedSec/3600)}시간 전`;
}, 30000);
