(function () {
  "use strict";

  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false,
      offset: 80,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
  }

  var nav = document.getElementById("main-nav");
  var toggle = document.querySelector(".nav-toggle");
  var mq = window.matchMedia("(max-width: 899px)");

  function closeAllSubs() {
    document.querySelectorAll(".has-sub.is-open").forEach(function (item) {
      item.classList.remove("is-open");
      var btn = item.querySelector(".nav-sub-toggle");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (!open) closeAllSubs();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (mq.matches) setNavOpen(false);
      });
    });
  }

  document.querySelectorAll(".has-sub").forEach(function (item) {
    var btn = item.querySelector(".nav-sub-toggle");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = !item.classList.contains("is-open");
      if (mq.matches) {
        document.querySelectorAll(".has-sub.is-open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            var otherBtn = other.querySelector(".nav-sub-toggle");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });
      }
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeAllSubs();
    if (mq.matches) setNavOpen(false);
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest(".has-sub") || e.target.closest(".nav-toggle")) return;
    closeAllSubs();
  });

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", function (e) {
      if (!e.matches) setNavOpen(false);
    });
  }

  document.querySelectorAll(".accordion-item > button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) panel.hidden = expanded;
    });
  });

  (function initResultsLookup() {
    var form = document.getElementById("results-form");
    var out = document.getElementById("results-output");
    if (!form || !out) return;

    var records = {
      "cma-2026-1001|class 8|first term 2026": {
        name: "Ayesha Rahman",
        id: "CMA-2026-1001",
        className: "Class 8",
        section: "A",
        roll: "12",
        medium: "English Version",
        exam: "First Term 2026",
        gpa: "4.89",
        grade: "A+",
        subjects: [
          ["Bangla", "88", "A+"],
          ["English", "91", "A+"],
          ["Mathematics", "86", "A+"],
          ["Science", "84", "A"],
          ["Bangladesh & Global Studies", "82", "A"],
          ["ICT", "90", "A+"],
          ["Religion", "85", "A+"]
        ]
      },
      "cma-2026-2044|class 5|mid-term 2026": {
        name: "Hasan Chowdhury",
        id: "CMA-2026-2044",
        className: "Class 5",
        section: "B",
        roll: "07",
        medium: "Bangla Medium",
        exam: "Mid-Term 2026",
        gpa: "4.56",
        grade: "A",
        subjects: [
          ["Bangla", "80", "A+"],
          ["English", "78", "A"],
          ["Mathematics", "83", "A"],
          ["Science", "81", "A"],
          ["Bangladesh & Global Studies", "76", "A"],
          ["ICT", "88", "A+"]
        ]
      }
    };

    function key(id, klass, exam) {
      return [id, klass, exam].join("|").replace(/\s+/g, " ").trim().toLowerCase();
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var id = form.elements["result-id"].value;
      var klass = form.elements["result-class"].value;
      var exam = form.elements["result-exam"].value;
      var rec = records[key(id, klass, exam)];
      out.hidden = false;
      if (!rec) {
        out.innerHTML = '<div class="results-empty"><p><strong>No published result matches these details.</strong></p><p>Please check the student ID, class and examination, or contact the office on 01309-132109.</p></div>';
        out.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      var rows = rec.subjects.map(function (s) {
        return "<tr><td>" + escapeHtml(s[0]) + "</td><td>" + escapeHtml(s[1]) + "</td><td>" + escapeHtml(s[2]) + "</td></tr>";
      }).join("");
      out.innerHTML =
        '<div class="results-toolbar">' +
          '<button class="btn btn-primary" type="button" data-print-result>Print result</button>' +
        "</div>" +
        '<article class="results-slip" id="results-slip">' +
          '<header class="results-slip-head">' +
            '<img src="assets/images/common/logo.png" width="52" height="52" alt="" />' +
            "<div><h2>Chetona Model Academy</h2><p>Academic marksheet · EIIN 132109 · Mirpur, Dhaka</p></div>" +
          "</header>" +
          '<div class="results-meta">' +
            "<div><span>Student</span><br /><strong>" + escapeHtml(rec.name) + "</strong></div>" +
            "<div><span>Student ID</span><br /><strong>" + escapeHtml(rec.id) + "</strong></div>" +
            "<div><span>Class / Section / Roll</span><br /><strong>" + escapeHtml(rec.className) + " · " + escapeHtml(rec.section) + " · " + escapeHtml(rec.roll) + "</strong></div>" +
            "<div><span>Examination</span><br /><strong>" + escapeHtml(rec.exam) + "</strong></div>" +
            "<div><span>Medium</span><br /><strong>" + escapeHtml(rec.medium) + "</strong></div>" +
          "</div>" +
          '<div class="results-table-wrap"><table class="results-table"><thead><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
          '<div class="results-summary"><span>GPA: ' + escapeHtml(rec.gpa) + '</span><span>Overall grade: ' + escapeHtml(rec.grade) + "</span></div>" +
        "</article>";
      out.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    out.addEventListener("click", function (e) {
      if (e.target && e.target.getAttribute("data-print-result") !== null) {
        window.print();
      }
    });
  })();

  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.id === "results-form") return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var note = form.querySelector(".form-note");
      if (note) {
        note.hidden = false;
        if (form.id === "admission-form") {
          note.textContent = "Thank you. Your application has been received. The admissions office will be in touch shortly.";
        } else if (form.id === "alumni-form") {
          note.textContent = "Welcome back. Your alumni registration has been recorded.";
        } else if (form.id === "enquiry-form") {
          note.textContent = "Thank you for writing to us. We will reply within two working days.";
        } else {
          note.textContent = "Thank you. We have received your message.";
        }
      }
      form.reset();
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  (function initStatCounters() {
    var nums = document.querySelectorAll(".stat-num[data-count]");
    if (!nums.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function formatCount(value, el) {
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var n = Math.round(value);
      var text = el.getAttribute("data-sep") === "1" ? n.toLocaleString("en-US") : String(n);
      return prefix + text + suffix;
    }

    function animate(el) {
      var target = Number(el.getAttribute("data-count"));
      if (!isFinite(target)) return;
      if (reduced) {
        el.textContent = formatCount(target, el);
        return;
      }
      var duration = 1600;
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = formatCount(target * eased, el);
        if (t < 1) window.requestAnimationFrame(tick);
      }
      el.textContent = formatCount(0, el);
      window.requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }

    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        io.unobserve(entry.target);
        animate(entry.target);
      });
    }, { threshold: 0.45 });

    nums.forEach(function (el) {
      if (!reduced) el.textContent = formatCount(0, el);
      io.observe(el);
    });
  })();

  (function initHomeAchievements() {
    var root = document.querySelector("[data-achieve-board]");
    if (!root) return;

    var track = root.querySelector("[data-achieve-track]");
    var viewport = root.querySelector("[data-achieve-viewport]");
    var prev = root.querySelector("[data-achieve-prev]");
    var next = root.querySelector("[data-achieve-next]");
    var storageKey = "cma-home-achieve-order";
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;
    var drag = null;
    var slide = null;
    var lastEdge = 0;

    function cardEls() {
      return Array.prototype.slice.call(track.querySelectorAll(".achieve-card"));
    }

    function visibleCount() {
      var w = viewport.clientWidth;
      if (w < 640) return 1;
      if (w < 960) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cardEls().length - visibleCount());
    }

    function cardStep() {
      var first = track.querySelector(".achieve-card, .achieve-placeholder");
      if (!first) return 0;
      var gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function baseX() {
      return -(index * cardStep());
    }

    function applyTransform(instant) {
      index = Math.max(0, Math.min(index, maxIndex()));
      var noAnim = reduced || instant || (drag && drag.active) || (slide && slide.active);
      track.style.transition = noAnim ? "none" : "transform 0.4s ease";
      track.style.transform = "translate3d(" + baseX() + "px,0,0)";
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex();
    }

    function restoreOrder() {
      try {
        var saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (!Array.isArray(saved) || !saved.length) return;
        saved.forEach(function (id) {
          var el = track.querySelector('.achieve-card[data-id="' + id + '"]');
          if (el) track.appendChild(el);
        });
      } catch (err) {}
    }

    function saveOrder() {
      var ids = cardEls().map(function (c) {
        return c.getAttribute("data-id");
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(ids));
      } catch (err) {}
    }

    restoreOrder();

    if (prev) {
      prev.addEventListener("click", function () {
        index -= 1;
        applyTransform();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        index += 1;
        applyTransform();
      });
    }
    window.addEventListener("resize", function () {
      applyTransform(true);
    });

    function startSort(e) {
      var card = drag.card;
      var rect = card.getBoundingClientRect();
      drag.active = true;
      drag.armed = false;
      drag.offsetX = e.clientX - rect.left;
      drag.offsetY = e.clientY - rect.top;

      var ph = document.createElement("div");
      ph.className = "achieve-placeholder";
      ph.setAttribute("aria-hidden", "true");
      ph.style.height = rect.height + "px";
      card.after(ph);
      drag.placeholder = ph;

      document.body.appendChild(card);
      card.classList.add("is-dragging");
      card.setAttribute("aria-grabbed", "true");
      card.style.position = "fixed";
      card.style.left = rect.left + "px";
      card.style.top = rect.top + "px";
      card.style.width = rect.width + "px";
      card.style.margin = "0";
      card.style.zIndex = "80";
      card.style.pointerEvents = "none";
      document.body.classList.add("is-achieve-sorting");
    }

    function placePlaceholder(clientX) {
      var others = cardEls();
      var placed = false;
      for (var i = 0; i < others.length; i++) {
        var r = others[i].getBoundingClientRect();
        if (clientX < r.left + r.width / 2) {
          track.insertBefore(drag.placeholder, others[i]);
          placed = true;
          break;
        }
      }
      if (!placed) track.appendChild(drag.placeholder);
    }

    function autoScroll(clientX) {
      var now = Date.now();
      if (now - lastEdge < 420) return;
      var vr = viewport.getBoundingClientRect();
      if (clientX > vr.right - 56 && index < maxIndex()) {
        lastEdge = now;
        index += 1;
        applyTransform(true);
      } else if (clientX < vr.left + 56 && index > 0) {
        lastEdge = now;
        index -= 1;
        applyTransform(true);
      }
    }

    function moveSort(e) {
      drag.card.style.left = e.clientX - drag.offsetX + "px";
      drag.card.style.top = e.clientY - drag.offsetY + "px";
      placePlaceholder(e.clientX);
      autoScroll(e.clientX);
    }

    function endSort() {
      if (!drag) return;
      if (drag.active && drag.placeholder) {
        drag.placeholder.replaceWith(drag.card);
      }
      drag.card.classList.remove("is-dragging");
      drag.card.setAttribute("aria-grabbed", "false");
      drag.card.style.position = "";
      drag.card.style.left = "";
      drag.card.style.top = "";
      drag.card.style.width = "";
      drag.card.style.margin = "";
      drag.card.style.zIndex = "";
      drag.card.style.pointerEvents = "";
      document.body.classList.remove("is-achieve-sorting");
      if (drag.active) saveOrder();
      drag = null;
      applyTransform();
    }

    function endSlide(clientX) {
      if (!slide) return;
      if (slide.active) {
        var dx = clientX - slide.startX;
        var threshold = Math.max(40, cardStep() * 0.18);
        if (dx < -threshold) index += 1;
        else if (dx > threshold) index -= 1;
      }
      slide = null;
      viewport.classList.remove("is-sliding");
      applyTransform();
    }

    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest(".achieve-grip")) return;
      slide = {
        startX: e.clientX,
        startY: e.clientY,
        origin: baseX(),
        armed: true,
        active: false
      };
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (!e.target.closest(".achieve-grip")) return;
      e.stopPropagation();
      slide = null;
      var card = e.target.closest(".achieve-card");
      if (!card) return;
      drag = {
        card: card,
        startX: e.clientX,
        startY: e.clientY,
        armed: true,
        active: false
      };
    });

    window.addEventListener("pointermove", function (e) {
      if (drag) {
        var sdx = e.clientX - drag.startX;
        var sdy = e.clientY - drag.startY;
        if (drag.armed && (Math.abs(sdx) > 6 || Math.abs(sdy) > 6)) {
          e.preventDefault();
          startSort(e);
        }
        if (drag && drag.active) {
          e.preventDefault();
          moveSort(e);
        }
        return;
      }

      if (!slide) return;
      var dx = e.clientX - slide.startX;
      var dy = e.clientY - slide.startY;
      if (slide.armed) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx) + 4) {
          slide = null;
          return;
        }
        slide.armed = false;
        slide.active = true;
        viewport.classList.add("is-sliding");
      }
      if (slide.active) {
        e.preventDefault();
        var minX = -maxIndex() * cardStep();
        var nextX = slide.origin + dx;
        if (nextX > 0) nextX *= 0.35;
        if (nextX < minX) nextX = minX + (nextX - minX) * 0.35;
        track.style.transition = "none";
        track.style.transform = "translate3d(" + nextX + "px,0,0)";
      }
    }, { passive: false });

    window.addEventListener("pointerup", function (e) {
      if (drag) endSort();
      else if (slide) endSlide(e.clientX);
    });
    window.addEventListener("pointercancel", function (e) {
      if (drag) endSort();
      else if (slide) endSlide(e.clientX);
    });

    cardEls().forEach(function (card) {
      card.setAttribute("aria-grabbed", "false");
      card.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" && !e.altKey) {
          e.preventDefault();
          index -= 1;
          applyTransform();
          return;
        }
        if (e.key === "ArrowRight" && !e.altKey) {
          e.preventDefault();
          index += 1;
          applyTransform();
          return;
        }
        if (!e.altKey || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
        e.preventDefault();
        var list = cardEls();
        var i = list.indexOf(card);
        var nextI = e.key === "ArrowLeft" ? i - 1 : i + 1;
        if (nextI < 0 || nextI >= list.length) return;
        if (e.key === "ArrowLeft") track.insertBefore(card, list[nextI]);
        else track.insertBefore(list[nextI], card);
        saveOrder();
        applyTransform();
        card.focus();
      });
    });

    applyTransform(true);
  })();

  (function initHomeHero() {
    var root = document.querySelector("[data-hero-board]");
    if (!root) return;

    var track = root.querySelector("[data-hero-track]");
    var viewport = root.querySelector("[data-hero-viewport]");
    var dotsWrap = root.querySelector("[data-hero-dots]");
    var storageKey = "cma-home-hero-order";
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var index = 0;
    var drag = null;
    var slide = null;
    var lastEdge = 0;
    var timer = null;
    var hovered = false;

    function stopAuto() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (reduced || hovered) return;
      timer = window.setInterval(function () {
        if (drag || slide) return;
        var wrap = index >= maxIndex();
        index = wrap ? 0 : index + 1;
        applyTransform(wrap);
      }, 4000);
    }

    function slides() {
      return Array.prototype.slice.call(track.querySelectorAll(".hero-slide"));
    }

    function maxIndex() {
      return Math.max(0, slides().length - 1);
    }

    function step() {
      return viewport.getBoundingClientRect().width || 1;
    }

    function baseX() {
      return -(index * step());
    }

    function paintDots() {
      if (!dotsWrap) return;
      var all = slides();
      dotsWrap.innerHTML = "";
      all.forEach(function (el, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", "Banner " + (i + 1));
        if (i === index) {
          btn.classList.add("is-on");
          btn.setAttribute("aria-current", "true");
        }
        btn.addEventListener("click", function () {
          index = i;
          applyTransform();
          startAuto();
        });
        dotsWrap.appendChild(btn);
      });
    }

    function applyTransform(instant) {
      index = Math.max(0, Math.min(index, maxIndex()));
      var noAnim = reduced || instant || (drag && drag.active) || (slide && slide.active);
      track.style.transition = noAnim ? "none" : "transform 0.4s ease";
      track.style.transform = "translate3d(" + baseX() + "px,0,0)";
      paintDots();
    }

    function restoreOrder() {
      try {
        var saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (!Array.isArray(saved) || !saved.length) return;
        saved.forEach(function (id) {
          var el = track.querySelector('.hero-slide[data-id="' + id + '"]');
          if (el) track.appendChild(el);
        });
      } catch (err) {}
    }

    function saveOrder() {
      var ids = slides().map(function (el) {
        return el.getAttribute("data-id");
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(ids));
      } catch (err) {}
    }

    restoreOrder();

    window.addEventListener("resize", function () {
      applyTransform(true);
    });

    function startSort(e) {
      var card = drag.card;
      var rect = card.getBoundingClientRect();
      drag.active = true;
      drag.armed = false;
      drag.offsetX = e.clientX - rect.left;
      drag.offsetY = e.clientY - rect.top;

      var ph = document.createElement("div");
      ph.className = "hero-placeholder";
      ph.setAttribute("aria-hidden", "true");
      ph.style.height = rect.height + "px";
      card.after(ph);
      drag.placeholder = ph;

      document.body.appendChild(card);
      card.classList.add("is-dragging");
      card.style.position = "fixed";
      card.style.left = rect.left + "px";
      card.style.top = rect.top + "px";
      card.style.width = rect.width + "px";
      card.style.margin = "0";
      card.style.zIndex = "80";
      card.style.pointerEvents = "none";
      document.body.classList.add("is-hero-sorting");
    }

    function placePlaceholder(clientX) {
      var others = slides();
      var placed = false;
      for (var i = 0; i < others.length; i++) {
        var r = others[i].getBoundingClientRect();
        if (clientX < r.left + r.width / 2) {
          track.insertBefore(drag.placeholder, others[i]);
          placed = true;
          break;
        }
      }
      if (!placed) track.appendChild(drag.placeholder);
    }

    function autoScroll(clientX) {
      var now = Date.now();
      if (now - lastEdge < 420) return;
      var vr = viewport.getBoundingClientRect();
      if (clientX > vr.right - 64 && index < maxIndex()) {
        lastEdge = now;
        index += 1;
        applyTransform(true);
      } else if (clientX < vr.left + 64 && index > 0) {
        lastEdge = now;
        index -= 1;
        applyTransform(true);
      }
    }

    function moveSort(e) {
      drag.card.style.left = e.clientX - drag.offsetX + "px";
      drag.card.style.top = e.clientY - drag.offsetY + "px";
      placePlaceholder(e.clientX);
      autoScroll(e.clientX);
    }

    function endSort() {
      if (!drag) return;
      if (drag.active && drag.placeholder) {
        drag.placeholder.replaceWith(drag.card);
        var list = slides();
        index = Math.max(0, list.indexOf(drag.card));
      }
      drag.card.classList.remove("is-dragging");
      drag.card.style.position = "";
      drag.card.style.left = "";
      drag.card.style.top = "";
      drag.card.style.width = "";
      drag.card.style.margin = "";
      drag.card.style.zIndex = "";
      drag.card.style.pointerEvents = "";
      document.body.classList.remove("is-hero-sorting");
      if (drag.active) saveOrder();
      drag = null;
      applyTransform();
      startAuto();
    }

    function endSlide(clientX) {
      if (!slide) return;
      if (slide.active) {
        var dx = clientX - slide.startX;
        var threshold = Math.max(48, step() * 0.16);
        if (dx < -threshold) index += 1;
        else if (dx > threshold) index -= 1;
      }
      slide = null;
      viewport.classList.remove("is-sliding");
      applyTransform();
      startAuto();
    }

    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest(".hero-grip") || e.target.closest(".hero-dots")) return;
      stopAuto();
      slide = {
        startX: e.clientX,
        startY: e.clientY,
        origin: baseX(),
        armed: true,
        active: false
      };
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (!e.target.closest(".hero-grip")) return;
      e.stopPropagation();
      slide = null;
      var card = e.target.closest(".hero-slide");
      if (!card) return;
      stopAuto();
      drag = {
        card: card,
        startX: e.clientX,
        startY: e.clientY,
        armed: true,
        active: false
      };
    });

    window.addEventListener("pointermove", function (e) {
      if (drag) {
        var sdx = e.clientX - drag.startX;
        var sdy = e.clientY - drag.startY;
        if (drag.armed && (Math.abs(sdx) > 6 || Math.abs(sdy) > 6)) {
          e.preventDefault();
          startSort(e);
        }
        if (drag && drag.active) {
          e.preventDefault();
          moveSort(e);
        }
        return;
      }

      if (!slide) return;
      var dx = e.clientX - slide.startX;
      var dy = e.clientY - slide.startY;
      if (slide.armed) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx) + 4) {
          slide = null;
          startAuto();
          return;
        }
        slide.armed = false;
        slide.active = true;
        viewport.classList.add("is-sliding");
      }
      if (slide.active) {
        e.preventDefault();
        var minX = -maxIndex() * step();
        var nextX = slide.origin + dx;
        if (nextX > 0) nextX *= 0.35;
        if (nextX < minX) nextX = minX + (nextX - minX) * 0.35;
        track.style.transition = "none";
        track.style.transform = "translate3d(" + nextX + "px,0,0)";
      }
    }, { passive: false });

    window.addEventListener("pointerup", function (e) {
      if (drag) endSort();
      else if (slide) endSlide(e.clientX);
    });
    window.addEventListener("pointercancel", function (e) {
      if (drag) endSort();
      else if (slide) endSlide(e.clientX);
    });

    root.addEventListener("mouseenter", function () {
      hovered = true;
      stopAuto();
    });
    root.addEventListener("mouseleave", function () {
      hovered = false;
      if (!drag && !slide) startAuto();
    });

    applyTransform(true);
    startAuto();
  })();

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var slides = root.querySelectorAll(".life-slide");
    if (!slides.length) return;

    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    var live = root.querySelector("[data-carousel-status]");
    var viewport = root.querySelector(".life-carousel-viewport");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var index = 0;
    var timer = null;
    var hovered = false;

    function replayAos(slide) {
      if (!window.AOS || reduced) return;
      var els = slide.querySelectorAll("[data-aos]");
      els.forEach(function (el) {
        el.classList.remove("aos-animate");
      });
      window.requestAnimationFrame(function () {
        if (typeof AOS.refreshHard === "function") AOS.refreshHard();
        else AOS.refresh();
        els.forEach(function (el) {
          el.classList.add("aos-animate");
        });
      });
    }

    function go(n) {
      index = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var on = i === index;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
      });
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
          dot.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }
      if (live) live.textContent = index + 1 + " / " + slides.length;
      replayAos(slides[index]);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      if (hovered || reduced || slides.length < 2) return;
      stop();
      timer = window.setInterval(function () {
        go(index + 1);
      }, 2300);
    }

    if (dotsWrap) {
      slides.forEach(function (slide, i) {
        var title = slide.querySelector("h3");
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", title ? title.textContent : "Photo " + (i + 1));
        if (i === 0) dot.classList.add("is-active");
        dot.addEventListener("click", function () {
          go(i);
          start();
        });
        dotsWrap.appendChild(dot);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        go(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        go(index + 1);
        start();
      });
    }

    if (viewport) {
      viewport.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1);
          start();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1);
          start();
        }
      });
    }

    root.addEventListener("mouseenter", function () {
      hovered = true;
      stop();
    });
    root.addEventListener("mouseleave", function () {
      hovered = false;
      start();
    });
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });

    go(0);
    start();
  });

  document.querySelectorAll("[data-campus-highlights]").forEach(function (root) {
    var texts = root.querySelectorAll("[data-campus-text] .campus-hl-panel");
    var images = root.querySelectorAll("[data-campus-media] .campus-hl-frame");
    var textCard = root.querySelector("[data-campus-text]");
    if (!texts.length || texts.length !== images.length) return;

    var prevBtn = root.querySelector("[data-campus-prev]");
    var nextBtn = root.querySelector("[data-campus-next]");
    var index = 0;
    var timer = null;
    var interval = 5000;
    var hovered = false;

    function show(next) {
      var i = ((next % texts.length) + texts.length) % texts.length;
      if (i === index) return;
      texts[index].classList.remove("is-active");
      images[index].classList.remove("is-active");
      images[index].classList.add("is-leaving");
      index = i;
      texts[index].classList.add("is-active");
      images[index].classList.add("is-active");
      if (textCard) {
        textCard.classList.remove("is-rising");
        void textCard.offsetWidth;
        textCard.classList.add("is-rising");
      }
      window.setTimeout(function () {
        images.forEach(function (frame, n) {
          if (n !== index) frame.classList.remove("is-leaving");
        });
      }, 950);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (hovered) return;
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, interval);
    }

    function go(step) {
      show(index + step);
      start();
    }

    window.requestAnimationFrame(function () {
      root.classList.add("is-ready");
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        go(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        go(1);
      });
    }

    root.addEventListener("mouseenter", function () {
      hovered = true;
      stop();
    });
    root.addEventListener("mouseleave", function () {
      hovered = false;
      start();
    });
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });

    start();
  });

  document.querySelectorAll(".campus-carousel.carousel").forEach(function (el) {
    if (!window.bootstrap || !bootstrap.Carousel) return;
    var carousel = bootstrap.Carousel.getOrCreateInstance(el);
    var inner = el.querySelector(".carousel-inner");
    var startX = 0;
    var deltaX = 0;
    var dragging = false;
    var moved = false;
    var active = null;
    var peek = null;
    var width = 0;
    var raf = 0;

    function items() {
      return Array.prototype.slice.call(el.querySelectorAll(".carousel-item"));
    }

    function indexOfActive() {
      var all = items();
      var i = 0;
      for (; i < all.length; i++) {
        if (all[i].classList.contains("active")) return i;
      }
      return 0;
    }

    function itemAt(offset) {
      var all = items();
      var i = indexOfActive();
      return all[(i + offset + all.length) % all.length];
    }

    function resetItem(node) {
      if (!node) return;
      node.style.transition = "";
      node.style.transform = "";
      node.style.display = "";
    }

    function cleanup() {
      resetItem(active);
      resetItem(peek);
      items().forEach(resetItem);
      active = null;
      peek = null;
      el.classList.remove("is-dragging");
    }

    function paint() {
      raf = 0;
      if (!active || !width) return;
      active.style.transform = "translate3d(" + deltaX + "px,0,0)";
      if (peek) {
        var from = deltaX > 0 ? -width : width;
        peek.style.transform = "translate3d(" + (from + deltaX) + "px,0,0)";
      }
    }

    function setPeek() {
      if (!deltaX) return;
      var wanted = itemAt(deltaX > 0 ? -1 : 1);
      if (peek && peek !== wanted) {
        resetItem(peek);
        peek = null;
      }
      if (!peek && wanted && wanted !== active) {
        peek = wanted;
        peek.style.display = "block";
        peek.style.transition = "none";
        peek.style.transform = "translate3d(" + (deltaX > 0 ? -width : width) + "px,0,0)";
      }
    }

    function finish() {
      if (!dragging) return;
      dragging = false;
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }

      var threshold = Math.max(48, width * 0.12);
      var go = moved && peek && Math.abs(deltaX) > threshold;
      var goPrev = deltaX > 0;
      var ms = go ? 360 : 280;

      if (go) {
        if (active) {
          active.style.transition = "transform " + ms + "ms ease";
          active.style.transform = "translate3d(" + (goPrev ? width : -width) + "px,0,0)";
        }
        peek.style.transition = "transform " + ms + "ms ease";
        peek.style.transform = "translate3d(0,0,0)";
        window.setTimeout(function () {
          el.classList.remove("slide");
          if (goPrev) carousel.prev();
          else carousel.next();
          cleanup();
          el.classList.add("slide");
          carousel.cycle();
        }, ms);
      } else {
        if (active) {
          active.style.transition = "transform " + ms + "ms ease";
          active.style.transform = "translate3d(0,0,0)";
        }
        if (peek) {
          peek.style.transition = "transform " + ms + "ms ease";
          peek.style.transform = "translate3d(" + (deltaX > 0 ? -width : width) + "px,0,0)";
        }
        window.setTimeout(function () {
          cleanup();
          carousel.cycle();
        }, ms);
      }
      moved = false;
    }

    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (e.target.closest("a, button")) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      deltaX = 0;
      active = itemAt(0);
      peek = null;
      width = inner ? inner.getBoundingClientRect().width : el.getBoundingClientRect().width;
      el.classList.add("is-dragging");
      carousel.pause();
      try {
        el.setPointerCapture(e.pointerId);
      } catch (err) {}
      if (active) active.style.transition = "none";
    });

    el.addEventListener("pointermove", function (e) {
      if (!dragging || !active) return;
      deltaX = e.clientX - startX;
      if (!moved && Math.abs(deltaX) < 8) return;
      moved = true;
      e.preventDefault();
      setPeek();
      if (!raf) raf = window.requestAnimationFrame(paint);
    });

    el.addEventListener("pointerup", finish);
    el.addEventListener("pointercancel", finish);
    el.addEventListener("lostpointercapture", function () {
      if (dragging) finish();
    });
  });

  (function initSchoolCalendar() {
    document.querySelectorAll("[data-school-calendar]").forEach(bindCalendar);

    function bindCalendar(root) {
      var dataEl = root.querySelector("[data-cal-events]") || document.getElementById("cma-event-data");
    if (!root || !dataEl) return;

    var events = [];
    try {
      events = JSON.parse(dataEl.textContent);
    } catch (err) {
      events = [];
    }

    var grid = root.querySelector("[data-cal-grid]");
    var label = root.querySelector("[data-cal-label]");
    var asideTitle = root.querySelector("[data-cal-aside-title]");
    var asideList = root.querySelector("[data-cal-aside-list]");
    var monthList = root.querySelector("[data-cal-month-list]");
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var now = new Date();
    var viewY = now.getFullYear();
    var viewM = now.getMonth();
    var selected = isoDate(now);
    var filter = "all";
      var startAttr = root.getAttribute("data-cal-start");
      if (startAttr) {
        var startDate = parseIso(startAttr);
        if (!isNaN(startDate.getTime())) {
          viewY = startDate.getFullYear();
          viewM = startDate.getMonth();
          selected = isoDate(startDate);
        }
      }

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function isoDate(d) {
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }

    function parseIso(iso) {
        var p = String(iso).split("-");
      return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    }

      function eventEnd(ev) {
        return ev.end || ev.date;
    }

    function matchesFilter(ev) {
      return filter === "all" || ev.cat === filter;
    }

      function coversDay(ev, iso) {
        return iso >= ev.date && iso <= eventEnd(ev);
    }

    function eventsOn(iso) {
      return events.filter(function (ev) {
          return coversDay(ev, iso) && matchesFilter(ev);
        });
      }

      function eventsInMonth(year, month) {
        var monthStart = year + "-" + pad(month + 1) + "-01";
        var last = new Date(year, month + 1, 0).getDate();
        var monthEnd = year + "-" + pad(month + 1) + "-" + pad(last);
        return events.filter(function (ev) {
          return matchesFilter(ev) && ev.date <= monthEnd && eventEnd(ev) >= monthStart;
        }).sort(function (a, b) {
          return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        });
      }

      function shortDate(iso) {
        var d = parseIso(iso);
        var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return d.getDate() + " " + names[d.getMonth()];
      }

      function eventWhen(ev) {
        var range = ev.end && ev.end !== ev.date ? shortDate(ev.date) + " – " + shortDate(ev.end) : shortDate(ev.date);
        return ev.when ? range + " · " + ev.when : range;
      }

    function eventCard(ev) {
      var article = document.createElement("article");
      article.className = "cal-event cal-event--" + ev.cat;
      article.innerHTML = "<h4></h4><p class=\"cal-event-when\"></p><p></p>";
      article.querySelector("h4").textContent = ev.title;
        article.querySelector(".cal-event-when").textContent = eventWhen(ev);
      article.querySelector("p:last-child").textContent = ev.detail;
      return article;
    }

    function fillList(holder, list, emptyText) {
        if (!holder) return;
      holder.innerHTML = "";
      if (!list.length) {
        var p = document.createElement("p");
        p.className = "cal-empty";
        p.textContent = emptyText;
        holder.appendChild(p);
        return;
      }
      list.forEach(function (ev) {
        holder.appendChild(eventCard(ev));
      });
    }

    function renderAside() {
        if (asideTitle) {
      var day = parseIso(selected);
      asideTitle.textContent = day.getDate() + " " + months[day.getMonth()] + " " + day.getFullYear();
        }
        fillList(asideList, eventsOn(selected), "Nothing planned on this day.");
        fillList(monthList, eventsInMonth(viewY, viewM), "Nothing planned this month for the selected filter.");
    }

    function render() {
        if (label) label.textContent = months[viewM] + " " + viewY;
        if (!grid) return;
      grid.innerHTML = "";

      var first = new Date(viewY, viewM, 1);
      var start = first.getDay();
      var days = new Date(viewY, viewM + 1, 0).getDate();
      var prevDays = new Date(viewY, viewM, 0).getDate();
      var cells = [];
      var i;

      for (i = 0; i < start; i++) {
        cells.push({
          day: prevDays - start + 1 + i,
          month: viewM - 1,
          year: viewY,
          muted: true
        });
      }
      for (i = 1; i <= days; i++) {
        cells.push({ day: i, month: viewM, year: viewY, muted: false });
      }
      while (cells.length % 7 !== 0) {
        cells.push({
          day: cells.length - (start + days) + 1,
          month: viewM + 1,
          year: viewY,
          muted: true
        });
      }

      var todayIso = isoDate(now);
      cells.forEach(function (cell) {
        var m = cell.month;
        var y = cell.year;
        if (m < 0) {
          m = 11;
          y -= 1;
        }
        if (m > 11) {
          m = 0;
          y += 1;
        }
        var iso = y + "-" + pad(m + 1) + "-" + pad(cell.day);
          var weekday = parseIso(iso).getDay();
        var dayEvents = eventsOn(iso);
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal-day";
        if (cell.muted) btn.classList.add("is-muted");
          if (weekday === 0 || weekday === 6) btn.classList.add("is-weekend");
        if (iso === todayIso) btn.classList.add("is-today");
        if (iso === selected) btn.classList.add("is-selected");
        btn.setAttribute("aria-label", cell.day + " " + months[m] + " " + y + (dayEvents.length ? ", " + dayEvents.length + " event" + (dayEvents.length === 1 ? "" : "s") : ""));
        if (iso === selected) btn.setAttribute("aria-pressed", "true");

        var num = document.createElement("span");
        num.className = "cal-day-num";
        num.textContent = String(cell.day);
        btn.appendChild(num);

        var dots = document.createElement("span");
        dots.className = "cal-day-events";
        dayEvents.slice(0, 3).forEach(function (ev) {
          var dot = document.createElement("span");
          dot.className = "cal-dot cal-dot--" + ev.cat;
          dots.appendChild(dot);
        });
        btn.appendChild(dots);

        if (dayEvents[0]) {
          var title = document.createElement("span");
          title.className = "cal-day-title";
          title.textContent = dayEvents[0].title;
          btn.appendChild(title);
        }

        btn.addEventListener("click", function () {
          selected = iso;
          if (y !== viewY || m !== viewM) {
            viewY = y;
            viewM = m;
          }
          render();
        });
        grid.appendChild(btn);
      });

      renderAside();
    }

      var prevBtn = root.querySelector("[data-cal-prev]");
      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
      viewM -= 1;
      if (viewM < 0) {
        viewM = 11;
        viewY -= 1;
      }
      selected = viewY + "-" + pad(viewM + 1) + "-01";
      render();
    });
      }

      var nextBtn = root.querySelector("[data-cal-next]");
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
      viewM += 1;
      if (viewM > 11) {
        viewM = 0;
        viewY += 1;
      }
      selected = viewY + "-" + pad(viewM + 1) + "-01";
      render();
    });
      }

      var todayBtn = root.querySelector("[data-cal-today]");
      if (todayBtn) {
        todayBtn.addEventListener("click", function () {
      viewY = now.getFullYear();
      viewM = now.getMonth();
      selected = isoDate(now);
      render();
    });
      }

    root.querySelectorAll("[data-cal-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        filter = chip.getAttribute("data-cal-filter");
        root.querySelectorAll("[data-cal-filter]").forEach(function (other) {
          other.classList.toggle("is-on", other === chip);
        });
        render();
      });
    });

    render();
    }
  })();
})();
