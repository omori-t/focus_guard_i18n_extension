(function () {
  // Legacy flag from older versions — clear so it never blocks reloads
  try {
    sessionStorage.removeItem("guard_dismissed");
  } catch (_) {}

  // In-memory only: resets on full page reload (content script reinject)
  let userDismissed = false;
  let timerId = null;
  let observerStarted = false;
  let remountScheduled = false;

  function mountOverlay() {
    if (userDismissed) return;
    if (document.getElementById("focus-guard-overlay")) return;
    if (!document.documentElement) return;

    const msg = AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
    const badgeText = chrome.i18n.getMessage("badgeText");
    const btnReturnText = chrome.i18n.getMessage("btnReturn");
    const btnContinueText = chrome.i18n.getMessage("btnContinue");

    const overlay = document.createElement("div");
    overlay.id = "focus-guard-overlay";
    overlay.innerHTML = `
      <div class="fg-card">
        <div class="fg-badge">${badgeText}</div>
        <h2 class="fg-title">${msg.title}</h2>
        <p class="fg-body">${msg.body.replace(/\n/g, "<br>")}</p>
        <div class="fg-actions">
          <button id="fg-close-btn" class="fg-btn-primary" type="button">${btnReturnText}</button>
          <button id="fg-continue-btn" class="fg-btn-secondary" type="button" disabled>${btnContinueText} (5)</button>
        </div>
      </div>
    `;

    // Prefer body; fall back to <html> if body is not ready yet
    (document.body || document.documentElement).appendChild(overlay);

    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    let count = 5;
    const continueBtn = overlay.querySelector("#fg-continue-btn");
    timerId = setInterval(() => {
      count--;
      if (count > 0) {
        continueBtn.innerText = `${btnContinueText} (${count})`;
      } else {
        clearInterval(timerId);
        timerId = null;
        continueBtn.innerText = btnContinueText;
        continueBtn.removeAttribute("disabled");
      }
    }, 1000);

    overlay.querySelector("#fg-close-btn").addEventListener("click", () => {
      window.location.href = "about:blank";
    });

    continueBtn.addEventListener("click", () => {
      dismissOverlay(overlay);
    });
  }

  function dismissOverlay(overlay) {
    userDismissed = true;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (overlay) overlay.remove();
    else {
      const existing = document.getElementById("focus-guard-overlay");
      if (existing) existing.remove();
    }
  }

  function ensureOverlay() {
    if (userDismissed) return;
    mountOverlay();
  }

  function startObserver() {
    if (observerStarted) return;
    observerStarted = true;

    // YouTube / Instagram etc. often rebuild DOM after load and wipe injected nodes.
    const observer = new MutationObserver(() => {
      if (userDismissed) return;
      if (document.getElementById("focus-guard-overlay")) return;
      if (remountScheduled) return;
      remountScheduled = true;
      requestAnimationFrame(() => {
        remountScheduled = false;
        mountOverlay();
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function boot() {
    userDismissed = false;
    ensureOverlay();
    startObserver();

    if (!document.body) {
      document.addEventListener("DOMContentLoaded", ensureOverlay, { once: true });
    }
  }

  boot();

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape" || userDismissed) return;
      dismissOverlay();
    },
    true
  );

  // bfcache restore keeps the previous JS state; force show again
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      boot();
    }
  });
})();
