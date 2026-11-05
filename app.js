/* Hurdal Hundefrisør — shared behaviour.
   BUSINESS_NAME is the ONE swappable constant for the business name.
   Every visible occurrence of the name in the HTML is wrapped in
   <span data-biz>…</span> (or data-biz-attr for attributes) and is
   set from this constant on load. Page <title> / meta / JSON-LD keep
   the literal name for SEO, and are updated here too. */
const BUSINESS_NAME = "Hurdal Hundefrisør";
const BOOKING_URL = "https://hundeklipphurdal.onlinebooq.net/";

document.addEventListener("DOMContentLoaded", () => {
  /* --- Business-name constant -------------------------------------- */
  document.querySelectorAll("[data-biz]").forEach((el) => {
    el.textContent = BUSINESS_NAME;
  });
  document.querySelectorAll("[data-biz-attr]").forEach((el) => {
    const attr = el.getAttribute("data-biz-attr");
    el.setAttribute(attr, el.getAttribute(attr).replace(/\{\{BIZ\}\}/g, BUSINESS_NAME));
  });
  document.title = document.title.replace(/Hurdal Hundefrisør/g, BUSINESS_NAME);
  document.querySelectorAll('meta[name="description"]').forEach((m) => {
    m.setAttribute("content", m.getAttribute("content").replace(/Hurdal Hundefrisør/g, BUSINESS_NAME));
  });

  /* --- Booking links: every [data-booking] href points at Onlinebooq - */
  document.querySelectorAll("[data-booking]").forEach((el) => {
    el.setAttribute("href", BOOKING_URL);
  });

  /* --- Footer year --------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* --- Mobile nav ---------------------------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Lukk meny" : "Åpne meny");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- FAQ accordion (Hjem + Bestill) -------------------------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
    });
  });

  /* --- Priser: weight picker ------------------------------------------ */
  const picker = document.querySelector("[data-weight-picker]");
  if (picker) {
    const buttons = Array.from(picker.querySelectorAll("[data-weight]"));
    const quick = document.querySelector("[data-quickview]");
    const table = document.querySelector("[data-price-table]");
    const quickData = {
      liten: {
        label: "Liten hund (0–10 kg)",
        time: "Typisk tidsbruk er 1,5–2 timer. Inkluderer rolig miljø, poterens, hygieneklipp, føn og skånsom kloklipp.",
        rows: [["Vask & Føn", "550 kr"], ["Full Klipp", "1 500 kr"], ["Avrøyting", "1 500 kr"]],
      },
      mellom: {
        label: "Mellomstor hund (11–25 kg)",
        time: "Typisk tidsbruk er 2–2,5 timer. Inkluderer rolig miljø, poterens, hygieneklipp, føn og skånsom kloklipp.",
        rows: [["Vask & Føn", "700 kr"], ["Full Klipp", "1 750 kr"], ["Avrøyting", "1 750 kr"]],
      },
      stor: {
        label: "Stor hund (26–40 kg)",
        time: "Typisk tidsbruk er 2,5–3 timer. Inkluderer rolig miljø, poterens, hygieneklipp, føn og skånsom kloklipp.",
        rows: [["Vask & Føn", "850 kr"], ["Full Klipp", "1 950 kr"], ["Avrøyting", "1 950 kr"]],
      },
      ekstra: {
        label: "Ekstra stor hund (40+ kg)",
        time: "Typisk tidsbruk er 3–4 timer. Inkluderer rolig miljø, poterens, hygieneklipp, føn og skånsom kloklipp.",
        rows: [["Vask & Føn", "1 000 kr"], ["Full Klipp", "2 200 kr"], ["Avrøyting", "2 200 kr"]],
      },
    };
    const colIndex = { liten: 1, mellom: 2, stor: 3, ekstra: 4 };
    function selectWeight(key) {
      buttons.forEach((b) => {
        const active = b.dataset.weight === key;
        b.classList.toggle("selected", active);
        b.setAttribute("aria-pressed", String(active));
      });
      const d = quickData[key];
      if (quick) {
        const title = quick.querySelector("[data-quick-title]");
        const time = quick.querySelector("[data-quick-time]");
        const rows = quick.querySelector("[data-quick-rows]");
        if (title) title.textContent = "Hurtigoversikt: " + d.label;
        if (time) time.textContent = d.time;
        if (rows) {
          rows.innerHTML = d.rows
            .map((r) => `<div class="quick-row"><span>${r[0]}</span><strong>${r[1]}</strong></div>`)
            .join("");
        }
      }
      if (table) {
        table.querySelectorAll("th[data-col], td[data-col]").forEach((cell) => {
          cell.classList.toggle("col-active", Number(cell.dataset.col) === colIndex[key]);
        });
      }
    }
    buttons.forEach((b) => b.addEventListener("click", () => selectWeight(b.dataset.weight)));
    selectWeight("liten");
  }

  /* --- Tjenester: filter chips ---------------------------------------- */
  const filterBar = document.querySelector("[data-service-filter]");
  if (filterBar) {
    const chips = Array.from(filterBar.querySelectorAll("[data-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-sizes]"));
    const emptyNote = document.querySelector("[data-filter-empty]");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => {
          c.classList.toggle("selected", c === chip);
          c.setAttribute("aria-pressed", String(c === chip));
        });
        const f = chip.dataset.filter;
        let visible = 0;
        cards.forEach((card) => {
          const sizes = card.dataset.sizes.split(" ");
          const show = f === "alle" || sizes.includes(f);
          card.hidden = !show;
          if (show) visible += 1;
        });
        if (emptyNote) emptyNote.hidden = visible !== 0;
      });
    });
  }

  /* --- Cookie preferences (Informasjonskapsler) ----------------------- */
  const prefs = document.querySelector("[data-cookie-prefs]");
  if (prefs) {
    const KEY = "hurdal-cookie-prefs";
    const toggles = {
      booking: prefs.querySelector('[data-cookie-toggle="booking"]'),
      analytics: prefs.querySelector('[data-cookie-toggle="analytics"]'),
    };
    const status = prefs.querySelector("[data-cookie-status]");
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }
    function setToggle(name, on) {
      const t = toggles[name];
      if (!t) return;
      t.setAttribute("aria-checked", String(on));
      t.classList.toggle("on", on);
      t.querySelector(".toggle-knob").textContent = on ? "På" : "Av";
    }
    setToggle("booking", saved.booking !== false);
    setToggle("analytics", saved.analytics === true);
    Object.entries(toggles).forEach(([name, t]) => {
      if (!t) return;
      t.addEventListener("click", () => {
        const now = t.getAttribute("aria-checked") !== "true";
        setToggle(name, now);
        if (status) status.textContent = "";
      });
    });
    const saveBtn = prefs.querySelector("[data-cookie-save]");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const vals = {
          booking: toggles.booking ? toggles.booking.getAttribute("aria-checked") === "true" : true,
          analytics: toggles.analytics ? toggles.analytics.getAttribute("aria-checked") === "true" : false,
        };
        try { localStorage.setItem(KEY, JSON.stringify(vals)); } catch (e) { /* storage unavailable */ }
        if (status) status.textContent = "Valgene dine er lagret i denne nettleseren.";
      });
    }
  }

  /* --- Cookie banner (shown until a choice is saved) ------------------ */
  const banner = document.querySelector("[data-cookie-banner]");
  if (banner) {
    let saved = null;
    try { saved = localStorage.getItem("hurdal-cookie-prefs"); } catch (e) { saved = null; }
    if (!saved) banner.hidden = false;
    banner.querySelectorAll("[data-cookie-accept]").forEach((btn) => {
      btn.addEventListener("click", () => {
        try {
          localStorage.setItem("hurdal-cookie-prefs", JSON.stringify({ booking: true, analytics: false }));
        } catch (e) { /* storage unavailable */ }
        banner.hidden = true;
      });
    });
    const settingsBtn = banner.querySelector("[data-cookie-settings]");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        window.location.href = "informasjonskapsler.html";
      });
    }
  }
});
