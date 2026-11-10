/*
 * Behaviour for the PHP-rendered pages (/services/, /insights/). Vanilla JS, no dependencies.
 * Mirrors the React components: header (drop-down menus, mobile drawer, scroll shadow), review carousel,
 * "Read more", copy-link and the GA4 cookie consent banner.
 */
(function () {
  "use strict";
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Header ── */
  var header = $("#site-header");
  if (header) {
    var scrolledCls = (header.getAttribute("data-scrolled-class") || "").split(" ").filter(Boolean);
    var dds = $$("[data-dd]");
    var openDd = null;
    var closeTimer;

    var updateShadow = function () {
      var on = window.scrollY > 8 || !!openDd;
      scrolledCls.forEach(function (c) { header.classList.toggle(c, on); });
      header.classList.toggle("border-transparent", !on);
    };
    var setDd = function (dd, open) {
      var btn = $("[data-dd-button]", dd);
      var panel = $("[data-dd-panel]", dd);
      var link = $("[data-dd-link]", dd);
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      var chev = btn.querySelector("svg");
      if (chev) chev.classList.toggle("rotate-180", open);
      [btn, link].forEach(function (el) {
        if (!el || el.getAttribute("aria-current")) return;
        el.classList.toggle("text-brand-600", open);
        el.classList.toggle("text-navy-900", !open);
      });
    };
    var show = function (dd) {
      clearTimeout(closeTimer);
      if (openDd && openDd !== dd) setDd(openDd, false);
      openDd = dd;
      if (dd) setDd(dd, true);
      updateShadow();
    };
    var hideAll = function () {
      clearTimeout(closeTimer);
      if (openDd) setDd(openDd, false);
      openDd = null;
      updateShadow();
    };
    var scheduleClose = function () { clearTimeout(closeTimer); closeTimer = setTimeout(hideAll, 140); };

    window.addEventListener("scroll", updateShadow, { passive: true });
    updateShadow();
    dds.forEach(function (dd) {
      dd.addEventListener("mouseenter", function () { show(dd); });
      dd.addEventListener("mouseleave", scheduleClose);
      $("[data-dd-button]", dd).addEventListener("click", function () { if (openDd === dd) hideAll(); else show(dd); });
    });
    document.addEventListener("mousedown", function (e) { if (openDd && !header.contains(e.target)) hideAll(); });

    var menuBtn = $("[data-menu-button]");
    var menu = $("#mobile-menu");
    var setMenu = function (open) {
      if (!menu || !menuBtn) return;
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      $("[data-icon-open]", menuBtn).hidden = open;
      $("[data-icon-close]", menuBtn).hidden = !open;
      document.documentElement.style.overflow = open ? "hidden" : "";
    };
    if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
    $$("[data-accordion-button]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        var open = btn.getAttribute("aria-expanded") !== "true";
        $$("[data-accordion-button]").forEach(function (other) {
          if (other !== btn) {
            other.setAttribute("aria-expanded", "false");
            document.getElementById(other.getAttribute("aria-controls")).hidden = true;
            var s = other.querySelector("svg"); if (s) s.classList.remove("rotate-180");
          }
        });
        btn.setAttribute("aria-expanded", String(open));
        panel.hidden = !open;
        var svg = btn.querySelector("svg"); if (svg) svg.classList.toggle("rotate-180", open);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { hideAll(); setMenu(false); }
    });
  }

  /* ── Review carousels (CSS scroll-snap + small helpers) ── */
  $$("[data-review-carousel]").forEach(function (root) {
    var track = $("[data-track]", root);
    var slides = $$("[data-slide]", root);
    var controls = $("[data-controls]", root);
    var dotsWrap = $("[data-dots]", root);
    var prev = $("[data-prev]", root);
    var next = $("[data-next]", root);
    var index = 0, pages = 1, paused = false, resumeTimer;

    var step = function () {
      var gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      return slides[0] ? slides[0].offsetWidth + gap : 1;
    };
    var goTo = function (i) {
      var s = slides[i]; if (!s) return;
      track.scrollTo({ left: s.offsetLeft - track.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    };
    var renderDots = function () {
      dotsWrap.innerHTML = "";
      for (var i = 0; i < pages; i++) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "grid size-11 place-items-center";
        b.setAttribute("aria-label", "Go to review " + (i + 1));
        b.innerHTML = '<span class="block h-2.5 rounded-full transition-all ' + (i === Math.min(index, pages - 1) ? "w-6 bg-brand-600" : "w-2.5 bg-line") + '"></span>';
        if (i === Math.min(index, pages - 1)) b.setAttribute("aria-current", "true");
        (function (n) { b.addEventListener("click", function () { goTo(n); }); })(i);
        dotsWrap.appendChild(b);
      }
      prev.disabled = index === 0;
      next.disabled = index >= pages - 1;
    };
    var measure = function () {
      var st = step();
      var visible = Math.max(1, Math.round(track.clientWidth / st));
      pages = track.scrollWidth > track.clientWidth + 4 ? slides.length - visible + 1 : 1;
      index = Math.min(slides.length - 1, Math.round(track.scrollLeft / st));
      controls.hidden = pages <= 1;
      renderDots();
    };
    var raf;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(measure).observe(track); else window.addEventListener("resize", measure);
    prev.addEventListener("click", function () { goTo(Math.max(0, index - 1)); });
    next.addEventListener("click", function () { goTo(Math.min(pages - 1, index + 1)); });

    var pause = function () { paused = true; clearTimeout(resumeTimer); };
    var resumeLater = function (ms) { clearTimeout(resumeTimer); resumeTimer = setTimeout(function () { paused = false; }, ms || 8000); };
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", function () { resumeLater(1500); });
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", function () { resumeLater(); });
    root.addEventListener("touchstart", pause, { passive: true });
    root.addEventListener("touchend", function () { resumeLater(); }, { passive: true });
    if (!reduceMotion) {
      setInterval(function () {
        if (!paused && pages > 1 && document.visibilityState === "visible") goTo(index + 1 >= pages ? 0 : index + 1);
      }, 6000);
    }
    measure();
  });

  /* ── "Read more" on review cards ── */
  $$("[data-read-more]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.parentElement.querySelector("[data-review-text]");
      var open = btn.getAttribute("aria-expanded") !== "true";
      text.classList.toggle("line-clamp-5", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Show less" : "Read more";
    });
  });

  /* ── Copy link (with native share sheet on phones) ── */
  $$("[data-copy-link]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-copy-link");
      var label = $("[data-copy-label]", btn);
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.share({ title: document.title, url: url }).catch(function () {});
        return;
      }
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(
        function () { label.textContent = "Link copied"; setTimeout(function () { label.textContent = "Copy link"; }, 2500); },
        function () { window.prompt("Copy this link:", url); }
      );
    });
  });

  /* ── GA4 cookie consent (only when GA4 is configured) — same storage key as the Next.js pages ── */
  var ga = document.body.getAttribute("data-ga4");
  if (ga && /^G-[A-Z0-9]+$/.test(ga)) {
    var KEY = "hs-cookie-consent-v1";
    var read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
    var save = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };
    var load = function () {
      if (window.gtag) return;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ga);
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga);
      document.head.appendChild(s);
    };
    var banner;
    var show = function () {
      if (banner) { banner.hidden = false; return; }
      banner = document.createElement("div");
      banner.setAttribute("role", "region");
      banner.setAttribute("aria-label", "Cookie consent");
      banner.className = "fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[45] mx-auto max-w-xl rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-lift)] lg:right-6 lg:bottom-6 lg:left-auto lg:mx-0";
      banner.innerHTML = '<p class="font-display font-bold text-ink">Cookies</p><p class="mt-2 text-[0.9375rem] text-body">We’d like to use Google Analytics cookies to understand how visitors use our site. They’re only set if you accept. <a href="/privacy-policy/#cookies" class="font-semibold text-brand-600 underline underline-offset-2">Privacy &amp; cookies</a></p>'
        + '<div class="mt-4 flex flex-col gap-2 sm:flex-row"><button type="button" data-consent="granted" class="inline-flex h-10 items-center justify-center rounded-lg bg-navy-900 px-4 font-display text-sm font-bold text-white hover:bg-navy-700">Accept analytics</button>'
        + '<button type="button" data-consent="denied" class="inline-flex h-10 items-center justify-center rounded-lg border-2 border-navy-900/15 bg-white px-4 font-display text-sm font-bold text-navy-900">Reject</button></div>';
      banner.addEventListener("click", function (e) {
        var v = e.target.getAttribute && e.target.getAttribute("data-consent");
        if (!v) return;
        save(v);
        if (v === "granted") load();
        banner.hidden = true;
      });
      document.body.appendChild(banner);
    };
    var c = read();
    if (c === "granted") load();
    if (c === null) show();
    $$("[data-cookie-settings]").forEach(function (b) { b.addEventListener("click", show); });
  }
})();
