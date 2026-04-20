/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   VERSION: 1.4.0

   PURPOSE:
   - Loads CookieShortcuts mod safely
   - Injects stable Import / Export UI into Cookie Clicker Options
   - Supports JSON shortcut profiles
   - Forces re-apply of imported configs
   - Survives Options menu re-renders

   ARCHITECTURE:
   Cookie Clicker → CookieShortcuts → CookieKeys (UI + persistence layer)

   CHANGELOG:
   - v1.4.0: Fixed import doing nothing (added re-init + refresh hooks)
   - v1.4.0: Fixed UI disappearing after reload (reinjection safe guard)
   - v1.4.0: Improved MutationObserver stability and reset detection
   ========================================================= */

(function () {

    /* =====================================================
       VERSION LOGGING
       ===================================================== */

    var COOKIE_KEYS_VERSION = "1.4.0";

    console.log("[CookieKeys] version:", COOKIE_KEYS_VERSION);
    console.log("[CookieKeys] script loaded");


    /* =====================================================
       CONFIG
       ===================================================== */

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
        console.log("[CookieKeys] start()");

        Game.LoadMod(CONFIG.COOKIE_SHORTCUTS_URL);

        observeUI();
    }


    /* =====================================================
       UI OBSERVER (RENDER-SAFE)
       ===================================================== */

    function observeUI() {

        var injected = false;

        var observer = new MutationObserver(function () {

            var menu = document.getElementById("menu");
            if (!menu) return;

            var panelExists = document.getElementById("cookiekeys-panel");

            // If DOM was rebuilt, allow reinjection
            if (!panelExists) injected = false;

            if (injected) return;

            var container = menu.querySelector(".subsection") || menu;
            if (!container) return;

            injectUI(container);

            injected = true;

            console.log("[CookieKeys] UI injected");

        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    /* =====================================================
       UI INJECTION
       ===================================================== */

    function injectUI(container) {

        if (document.getElementById("cookiekeys-panel")) return;

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
                style="width:100%;height:120px;margin-top:8px;
                       background:#111;color:#0f0;"></textarea>
        `;

        container.appendChild(panel);

        bindUI();
    }


    /* =====================================================
       IMPORT / EXPORT CORE
       ===================================================== */

    function getData() {
        return window.CookieShortcuts?.config
            || window.CookieShortcuts?.bindings
            || window.CookieShortcuts
            || {};
    }


    function applyData(data) {
        if (!window.CookieShortcuts) {
            console.warn("[CookieKeys] CookieShortcuts not ready");
            return;
        }

        if (window.CookieShortcuts.config) {
            window.CookieShortcuts.config = data;
        } else if (window.CookieShortcuts.bindings) {
            window.CookieShortcuts.bindings = data;
        } else {
            Object.assign(window.CookieShortcuts, data);
        }

        console.log("[CookieKeys] applying imported data");

        // 🔥 force reapply hooks (critical fix)
        try {
            window.CookieShortcuts.init?.();
            window.CookieShortcuts.refresh?.();
            window.CookieShortcuts.update?.();
        } catch (e) {
            console.warn("[CookieKeys] reapply error:", e);
        }
    }


    /* =====================================================
       UI BINDING
       ===================================================== */

    function bindUI() {

        var box = document.getElementById("ck-box");

        document.getElementById("ck-export").onclick = function () {
            var data = getData();

            console.log("[CookieKeys] export:", data);

            box.value = JSON.stringify(data, null, 2);
        };

        document.getElementById("ck-import").onclick = function () {
            try {
                var parsed = JSON.parse(box.value);

                console.log("[CookieKeys] import:", parsed);

                applyData(parsed);

                console.log("[CookieKeys] import complete");

            } catch (e) {
                console.error("[CookieKeys] invalid JSON:", e);
            }
        };
    }

})();