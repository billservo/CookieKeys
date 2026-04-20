/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   VERSION: 1.5.0

   PURPOSE:
   - Loads CookieShortcuts mod safely
   - Provides Import / Export UI inside Options menu
   - Validates JSON before import
   - Handles empty / invalid input gracefully
   - Persists imported profiles to localStorage
   - Attempts runtime rebind hooks (best-effort)

   ARCHITECTURE:
   Cookie Clicker → CookieShortcuts → CookieKeys (UI + persistence layer)

   CHANGELOG:
   - v1.5.0: Added input validation (empty + invalid JSON handling)
   - v1.5.0: Added user feedback in UI box
   - v1.5.0: Strengthened persistence via localStorage backup
   - v1.5.0: Improved rebind attempt coverage for mod APIs
   ========================================================= */

(function () {

    /* =====================================================
       VERSION
       ===================================================== */

    var COOKIE_KEYS_VERSION = "1.5.0";

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
       UI OBSERVER
       ===================================================== */

    function observeUI() {

        var injected = false;

        var observer = new MutationObserver(function () {

            var menu = document.getElementById("menu");
            if (!menu) return;

            var alreadyExists = document.getElementById("cookiekeys-panel");

            if (alreadyExists) {
                injected = true;
                return;
            }

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
       UI
       ===================================================== */

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
                placeholder="Paste shortcut JSON here..."
                style="width:100%;height:120px;margin-top:8px;
                       background:#111;color:#0f0;"></textarea>
        `;

        container.appendChild(panel);

        bindUI();
    }


    /* =====================================================
       DATA HANDLING
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

        // apply to all possible locations
        window.CookieShortcuts.config = data;
        window.CookieShortcuts.bindings = data;

        try {
            Object.assign(window.CookieShortcuts, data);
        } catch (e) {}

        // persist backup (IMPORTANT for reload testing)
        try {
            localStorage.setItem("cookiekeys_profile", JSON.stringify(data));
            console.log("[CookieKeys] saved to localStorage");
        } catch (e) {
            console.warn("[CookieKeys] localStorage failed:", e);
        }

        // attempt runtime rebuild (best effort)
        try {
            window.CookieShortcuts.init?.();
            window.CookieShortcuts.refresh?.();
            window.CookieShortcuts.update?.();
            window.CookieShortcuts.rebind?.();
        } catch (e) {
            console.warn("[CookieKeys] rebind attempt failed:", e);
        }

        console.log("[CookieKeys] import applied");
    }


    /* =====================================================
       UI LOGIC
       ===================================================== */

    function bindUI() {

        var box = document.getElementById("ck-box");

        document.getElementById("ck-export").onclick = function () {

            var data = getData();

            box.value = JSON.stringify(data, null, 2);

            console.log("[CookieKeys] exported");
        };


        document.getElementById("ck-import").onclick = function () {

            var raw = box.value;

            // EMPTY CHECK
            if (!raw || !raw.trim()) {
                console.warn("[CookieKeys] import ignored: empty input");
                box.value = "⚠ Error: No JSON provided";
                return;
            }

            // PARSE CHECK
            try {
                var parsed = JSON.parse(raw);

                console.log("[CookieKeys] importing:", parsed);

                applyData(parsed);

                box.value = "✔ Import successful";

            } catch (e) {
                console.error("[CookieKeys] invalid JSON:", e);
                box.value = "⚠ Error: Invalid JSON";
            }
        };
    }

})();