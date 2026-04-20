/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   VERSION: 1.5.1

   FIXES:
   - UI disappearing due to MutationObserver race conditions
   - Over-aggressive "already injected" blocking
   - DOM rebuild wiping panel silently

   GOAL:
   - UI ALWAYS PRESENT when Options is open
   - Safe reinjection on DOM rebuild
   ========================================================= */

(function () {

    var COOKIE_KEYS_VERSION = "1.5.1";

    console.log("[CookieKeys] version:", COOKIE_KEYS_VERSION);


    var CONFIG = {
        COOKIE_SHORTCUTS_URL:
            "https://mastarcheeze.github.io/cookie-clicker-mods/cookieshortcuts/main.js"
    };


    /* =====================================================
       BOOTSTRAP
       ===================================================== */

    function waitForGame() {
        if (typeof Game !== "undefined") start();
        else setTimeout(waitForGame, 100);
    }

    waitForGame();

    function start() {
        console.log("[CookieKeys] start");

        Game.LoadMod(CONFIG.COOKIE_SHORTCUTS_URL);

        observeUI();
    }


    /* =====================================================
       UI OBSERVER (RELIABLE VERSION)
       ===================================================== */

    function observeUI() {

        var observer = new MutationObserver(function () {

            var menu = document.getElementById("menu");
            if (!menu) return;

            var container = menu.querySelector(".subsection") || menu;
            if (!container) return;

            ensureUI(container);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    /* =====================================================
       UI GUARANTEE (NO SINGLE-SHOT LOGIC)
       ===================================================== */

    function ensureUI(container) {

        var existing = document.getElementById("cookiekeys-panel");

        // If missing, create it
        if (!existing) {
            injectUI(container);
            console.log("[CookieKeys] UI created");
        }

        // If exists but lost container, reattach it
        if (existing && existing.parentNode !== container) {
            container.appendChild(existing);
            console.log("[CookieKeys] UI reattached");
        }
    }


    function injectUI(container) {

        var panel = document.createElement("div");
        panel.id = "cookiekeys-panel";

        panel.style.margin = "12px 0";
        panel.style.padding = "10px";
        panel.style.border = "1px solid #555";
        panel.style.background = "#1f1f1f";
        panel.style.color = "#fff";

        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:8px;">
                CookieKeys v${COOKIE_KEYS_VERSION}
            </div>

            <button id="ck-export">Export</button>
            <button id="ck-import">Import</button>

            <textarea id="ck-box"
                placeholder="Paste JSON here..."
                style="width:100%;height:120px;margin-top:8px;
                       background:#111;color:#0f0;"></textarea>
        `;

        container.appendChild(panel);

        bindUI();
    }


    /* =====================================================
       DATA
       ===================================================== */

    function getData() {
        return window.CookieShortcuts?.config
            || window.CookieShortcuts?.bindings
            || window.CookieShortcuts
            || {};
    }


    function applyData(data) {

        if (!window.CookieShortcuts) return;

        window.CookieShortcuts.config = data;
        window.CookieShortcuts.bindings = data;

        try {
            Object.assign(window.CookieShortcuts, data);
        } catch (e) {}

        try {
            window.CookieShortcuts.init?.();
            window.CookieShortcuts.refresh?.();
            window.CookieShortcuts.update?.();
            window.CookieShortcuts.rebind?.();
        } catch (e) {}
    }


    /* =====================================================
       UI EVENTS
       ===================================================== */

    function bindUI() {

        var box = document.getElementById("ck-box");

        document.getElementById("ck-export").onclick = function () {
            box.value = JSON.stringify(getData(), null, 2);
        };

        document.getElementById("ck-import").onclick = function () {

            if (!box.value || !box.value.trim()) {
                box.value = "⚠ empty JSON";
                return;
            }

            try {
                applyData(JSON.parse(box.value));
                box.value = "✔ imported";
            } catch (e) {
                box.value = "⚠ invalid JSON";
            }
        };
    }

})();