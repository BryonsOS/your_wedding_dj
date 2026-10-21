// YourWeddingsDJ.com — public website behaviour.
// Talks to the same Supabase project as the client portal (public, read-only data + lead submissions).
const SB_URL  = "https://mhktyejanikvdnjbndgi.supabase.co";
const SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3R5ZWphbmlrdmRuamJuZGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjAyNzcsImV4cCI6MjA5NTM5NjI3N30.OtahkiwKHx-tth18cFZHHKMLGG1ZKjxZT2M5baf0sUs";
const H = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, "Content-Type": "application/json" };

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => "$" + (parseFloat(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isHourly = p => (+p.hours || 0) <= 1 && +p.price > 0 && +p.price === +p.overtime_rate;
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const longDate = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

async function api(path, opts = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, { ...opts, headers: { ...H, ...(opts.headers || {}) } });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.status === 204 || res.status === 201 ? null : res.json();
}
let _catalog;
const catalog = () => _catalog || (_catalog = Promise.all([
  api("dj_packages?select=*&active=eq.true&order=sort"),
  api("dj_addons?select=*&active=eq.true&order=sort"),
]).then(([packages, addons]) => ({ packages, addons })));

// ── Header: mobile menu + current page ──
function initNav() {
  const btn = $(".menu-btn"), nav = $(".nav");
  btn && btn.addEventListener("click", () => nav.classList.toggle("open"));
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(a => { if (a.getAttribute("href") === here) a.classList.add("on"); });
  $$("[data-year]").forEach(e => (e.textContent = new Date().getFullYear()));
}

// ── Packages (live from the portal's Packages tab) ──
async function renderPackages(el) {
  const kind = el.dataset.packages; // "wedding" | "hourly"
  try {
    const { packages } = await catalog();
    const list = packages.filter(p => (kind === "hourly" ? isHourly(p) : !isHourly(p)));
    if (!list.length) { el.innerHTML = `<p class="loading">Package details are being updated. <a href="contact.html">Ask for a quote</a>.</p>`; return; }
    const withCta = el.dataset.cta !== "none"; // the home page lists packages without a button on each card
    el.innerHTML = list.map(p => {
      const inc = (p.includes || "").split("\n").map(s => s.trim()).filter(Boolean);
      const per = isHourly(p) ? "per hour" : `${+p.hours} hours of coverage · extra time ${money(p.overtime_rate)}/hr`;
      return `<div class="card pkg">
        <h3>${esc(p.name)}</h3>
        <div class="price">${money(p.price)}</div>
        <div class="per">${esc(per)}</div>
        <ul>${inc.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
        ${withCta ? `<a class="btn btn-o" href="contact.html?package=${encodeURIComponent(p.name)}${kind === "hourly" ? "&type=School%20Dance%20%2F%20Prom" : "&type=Wedding"}">Request a Quote</a>` : ""}
      </div>`;
    }).join("");
    el.classList.add("grid", list.length >= 3 ? "g3" : "g2");
  } catch { el.innerHTML = `<p class="loading">Packages couldn't load. <a href="contact.html">Ask for a quote</a> and we'll send pricing.</p>`; }
}
async function renderHourlyRate(el) {
  try { const { packages } = await catalog(); const h = packages.find(isHourly); if (h) el.textContent = money(h.price); } catch {}
}
async function renderAddons(el) {
  try {
    const { addons } = await catalog();
    const list = addons.filter(a => +a.price > 0);
    el.innerHTML = list.map(a => `<div class="addon"><div><b>${esc(a.name)}</b>${a.description ? `<small>${esc(a.description)}</small>` : ""}</div><span>${money(a.price)}${a.per_unit ? `<small>/${esc(a.per_unit)}</small>` : ""}</span></div>`).join("")
      || `<p class="loading">Ask about uplighting, photo booth, cold sparks and more.</p>`;
  } catch { el.innerHTML = ""; }
}

// ── Availability checker ──
function initAvailability(form) {
  const input = $("input[type=date]", form), out = $(".avail-result", form.parentElement);
  input.min = todayISO();
  const pre = new URLSearchParams(location.search).get("date"); if (pre) input.value = pre;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const d = input.value; if (!d) { input.focus(); return; }
    out.className = "avail-result"; out.textContent = "Checking…";
    try {
      const open = await api("rpc/dj_date_available", { method: "POST", body: JSON.stringify({ check_date: d }) });
      if (open) {
        out.className = "avail-result ok";
        out.innerHTML = `Good news — ${esc(longDate(d))} is open! <a href="contact.html?date=${d}" style="color:#fff;margin-left:6px">Request a quote →</a>`;
      } else {
        out.className = "avail-result no";
        out.innerHTML = `${esc(longDate(d))} is already booked. <a href="contact.html?date=${d}" style="color:#fff;margin-left:6px">Ask about alternatives →</a>`;
      }
      const qd = $("#q-date"); if (qd && !qd.value) qd.value = d;
    } catch { out.className = "avail-result no"; out.textContent = "Couldn't check right now — please call or send a quote request."; }
  });
}

// ── Reviews & gallery (from assets/content.js) ──
function renderReviews(el) {
  const list = (window.REVIEWS || []).slice(0, +el.dataset.limit || 99);
  if (!list.length) {
    // the home page leaves the reviews section out entirely until real reviews are added
    if (el.dataset.hideEmpty !== undefined) { const sec = el.closest("section"); if (sec) sec.hidden = true; return; }
    el.innerHTML = `<div class="placeholder-note">Reviews coming soon.</div>`; el.classList.remove("grid", "g3"); return;
  }
  el.innerHTML = list.map(r => `<div class="card review"><div class="stars">${"★".repeat(r.stars || 5)}</div><q>${esc(r.text)}</q><div class="who">— ${esc(r.name)}${r.event ? ` · ${esc(r.event)}` : ""}${r.source ? ` · ${esc(r.source)}` : ""}</div></div>`).join("");
}
function renderGallery(el) {
  const list = (window.GALLERY || []).slice(0, +el.dataset.limit || 99);
  if (!list.length) { el.innerHTML = Array.from({ length: +el.dataset.limit || 6 }, () => `<figure><div class="ph">Photo coming soon</div></figure>`).join(""); return; }
  el.innerHTML = list.map(g => `<figure${g.tall ? ' class="tall"' : ""}><img src="${esc(g.src)}" alt="${esc(g.caption || "Event photo")}" loading="lazy">${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}</figure>`).join("");
}
function applyPhotos() {
  const P = window.PHOTOS || {};
  $$("[data-photo]").forEach(el => {
    const src = P[el.dataset.photo]; if (!src) return;
    if (el.classList.contains("hero")) { el.classList.add("photo"); el.style.backgroundImage = `url("${src}")`; }
    else el.innerHTML = `<img src="${esc(src)}" alt="" loading="lazy">`;
  });
}

// ── Quote / request-info form → dj_leads (shows up in the portal's Leads tab) ──
async function initQuoteForm(form) {
  const q = new URLSearchParams(location.search);
  const set = (id, v) => { const f = $(id, form); if (f && v) f.value = v; };
  set("#q-date", q.get("date")); set("#q-type", q.get("type"));
  $("#q-date", form).min = todayISO();
  try {
    const { packages } = await catalog();
    const sel = $("#q-package", form);
    sel.innerHTML = `<option value="">Not sure yet</option>` + packages.map(p => `<option>${esc(p.name)}</option>`).join("");
    set("#q-package", q.get("package"));
  } catch {}
  const msg = $(".form-msg", form);
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if ($("#q-website", form).value) return; // honeypot: bots fill hidden fields
    const v = id => $(id, form).value.trim();
    if (!v("#q-name") || !v("#q-email")) { msg.className = "notice err form-msg"; msg.textContent = "Please add your name and email."; return; }
    const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Sending…";
    try {
      await api("dj_leads", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({
        name: v("#q-name"), email: v("#q-email"), phone: v("#q-phone") || null,
        event_type: v("#q-type") || null, event_date: v("#q-date") || null,
        guest_count: parseInt(v("#q-guests"), 10) || null, venue: v("#q-venue") || null,
        package_interest: v("#q-package") || null, message: v("#q-message") || null,
        source: v("#q-source") || null,
      }) });
      form.reset();
      msg.className = "notice ok form-msg";
      msg.textContent = "Thank you! Your request is in — Bryon will get back to you within one business day.";
    } catch {
      msg.className = "notice err form-msg";
      msg.innerHTML = 'Something went wrong sending your request. Please email <a href="mailto:bryon@yourweddingsdj.com">bryon@yourweddingsdj.com</a> or call (248) 390-4576.';
    }
    btn.disabled = false; btn.textContent = "Send My Request";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav(); applyPhotos();
  $$("[data-packages]").forEach(renderPackages);
  $$("[data-hourly-rate]").forEach(renderHourlyRate);
  $$("[data-addons]").forEach(renderAddons);
  $$("form[data-avail]").forEach(initAvailability);
  $$("[data-reviews]").forEach(renderReviews);
  $$("[data-gallery]").forEach(renderGallery);
  $$("form[data-quote]").forEach(initQuoteForm);
});
