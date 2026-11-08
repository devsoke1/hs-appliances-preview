/* HS Appliances admin — small progressive enhancements. Everything works without JS except the rich editor. */
(function () {
  "use strict";

  // Confirm destructive actions: <button data-confirm="Delete…?">
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-confirm]");
    if (el && !window.confirm(el.getAttribute("data-confirm"))) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  // Character counters: <input data-counter="60">
  document.querySelectorAll("[data-counter]").forEach(function (input) {
    var limit = parseInt(input.getAttribute("data-counter"), 10);
    var out = document.createElement("span");
    out.className = "counter";
    out.setAttribute("aria-live", "polite");
    input.insertAdjacentElement("afterend", out);
    var update = function () {
      var n = input.value.length;
      out.textContent = n + " / " + limit + (n > limit ? " — too long for Google" : "");
      out.classList.toggle("over", n > limit);
    };
    input.addEventListener("input", update);
    update();
  });

  // Auto slug from title until the slug is edited by hand (existing records start locked)
  function slugify(s) {
    return s.toLowerCase().replace(/&/g, " and ").replace(/['’]/g, "")
      .normalize("NFKD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120).replace(/-+$/, "");
  }
  document.querySelectorAll("[data-slug-source]").forEach(function (src) {
    var target = document.querySelector(src.getAttribute("data-slug-source"));
    if (!target) return;
    var locked = target.hasAttribute("data-slug-locked") || target.value !== "";
    target.addEventListener("input", function () { locked = target.value !== ""; target.value = slugify(target.value) || target.value; });
    target.addEventListener("blur", function () { target.value = slugify(target.value); });
    src.addEventListener("input", function () { if (!locked) target.value = slugify(src.value); });
  });

  // Repeatable rows (FAQs, faults)
  function renumber(container) {
    var name = container.getAttribute("data-repeater");
    Array.prototype.forEach.call(container.children, function (row, i) {
      row.querySelectorAll("[name]").forEach(function (f) {
        f.name = f.name.replace(new RegExp("^" + name + "\\[\\d+\\]"), name + "[" + i + "]");
      });
    });
  }
  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]");
    if (add) {
      var key = add.getAttribute("data-add");
      var container = document.querySelector('[data-repeater="' + key + '"]');
      var tpl = document.getElementById("tpl-" + key);
      if (!container || !tpl) return;
      var html = tpl.innerHTML.replace(/__i__/g, String(container.children.length));
      container.insertAdjacentHTML("beforeend", html);
      var first = container.lastElementChild.querySelector("input, textarea");
      if (first) first.focus();
      markDirty();
      return;
    }
    var row = e.target.closest(".repeater-row");
    if (!row) return;
    var box = row.parentElement;
    if (e.target.closest("[data-remove]")) {
      if (box.children.length > 1 || window.confirm("Remove this row?")) {
        row.remove();
        renumber(box);
        markDirty();
      }
    } else if (e.target.closest('[data-move="up"]') && row.previousElementSibling) {
      box.insertBefore(row, row.previousElementSibling);
      renumber(box);
      markDirty();
    } else if (e.target.closest('[data-move="down"]') && row.nextElementSibling) {
      box.insertBefore(row.nextElementSibling, row);
      renumber(box);
      markDirty();
    }
  });

  // Client-side file size check (server enforces it too)
  document.querySelectorAll("input[type=file][data-max-bytes]").forEach(function (input) {
    input.addEventListener("change", function () {
      var max = parseInt(input.getAttribute("data-max-bytes"), 10);
      var f = input.files && input.files[0];
      if (f && f.size > max) {
        window.alert("That image is " + (f.size / 1048576).toFixed(1) + "MB. The maximum is " + (max / 1048576) + "MB.");
        input.value = "";
      }
    });
  });

  // Warn before leaving a form with unsaved changes
  var dirty = false;
  function markDirty() { dirty = true; }
  window.hsMarkDirty = markDirty;
  document.querySelectorAll("form[data-unsaved-warning]").forEach(function (form) {
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    form.addEventListener("submit", function () {
      dirty = false;
      // prevent double submits
      setTimeout(function () { form.querySelectorAll("button[type=submit]").forEach(function (b) { b.disabled = true; }); }, 0);
    });
  });
  window.addEventListener("beforeunload", function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });
})();
