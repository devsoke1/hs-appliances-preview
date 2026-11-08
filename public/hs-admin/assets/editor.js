/* Rich-text editor (Quill 2, self-hosted). Upgrades <textarea data-editor>; the textarea stays as a no-JS fallback. */
(function () {
  "use strict";
  if (typeof window.Quill === "undefined") return;

  var csrf = (document.querySelector('input[name="csrf"]') || {}).value || "";

  document.querySelectorAll("textarea[data-editor]").forEach(function (textarea) {
    var uploadUrl = textarea.getAttribute("data-upload-url");
    var wrap = document.createElement("div");
    wrap.className = "editor-wrap";
    if (textarea.getAttribute("aria-invalid") === "true") wrap.setAttribute("aria-invalid", "true");
    var host = document.createElement("div");
    wrap.appendChild(host);
    textarea.insertAdjacentElement("beforebegin", wrap);
    textarea.hidden = true;

    var toolbar = [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline", "link"],
      [{ list: "ordered" }, { list: "bullet" }, "blockquote"],
    ];
    if (uploadUrl) toolbar.push(["image"]);
    toolbar.push(["clean"]);

    var quill = new window.Quill(host, {
      theme: "snow",
      modules: { toolbar: { container: toolbar, handlers: uploadUrl ? { image: uploadImage } : {} } },
      formats: ["header", "bold", "italic", "underline", "link", "list", "blockquote", "image"], // image alt is an embed attribute, set via formatText
      placeholder: "Start writing…",
    });
    if (textarea.value.trim()) {
      quill.clipboard.dangerouslyPasteHTML(textarea.value, "silent"); // content was sanitised server-side
    }
    quill.on("text-change", function (_d, _o, source) { if (source === "user" && window.hsMarkDirty) window.hsMarkDirty(); });

    // Label the editable area for screen readers
    var label = document.querySelector('label[for="' + textarea.id + '"]');
    if (label) {
      quill.root.setAttribute("aria-label", label.textContent.trim());
      label.addEventListener("click", function () { quill.focus(); });
    }

    textarea.form.addEventListener("submit", function () {
      var html = quill.getSemanticHTML();
      textarea.value = quill.getText().trim() === "" && !quill.root.querySelector("img") ? "" : html;
    });

    function uploadImage() {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/webp";
      input.onchange = function () {
        var file = input.files && input.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) { window.alert("Images must be 3MB or smaller."); return; }
        var alt = window.prompt("Describe this image (alt text — required for accessibility and SEO):", "");
        if (alt === null) return;
        alt = alt.trim();
        if (!alt) { window.alert("Alt text is required."); return; }
        var data = new FormData();
        data.append("file", file);
        var range = quill.getSelection(true);
        fetch(uploadUrl, { method: "POST", body: data, credentials: "same-origin", headers: { "X-CSRF-Token": csrf, Accept: "application/json" } })
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (res) {
            if (!res.ok || !res.j.url) throw new Error(res.j.error || "Upload failed");
            var index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, "image", res.j.url, "user");
            quill.formatText(index, 1, "alt", alt, "user");
            quill.setSelection(index + 1, 0, "silent");
          })
          .catch(function (err) { window.alert(err.message || "Upload failed"); });
      };
      input.click();
    }
  });
})();
