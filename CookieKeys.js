/* =========================================================
   COOKIE KEYS (VERSIONED STABLE BUILD)
   ---------------------------------------------------------
   VERSION: 1.2.0

   PURPOSE:
   - Loads CookieShortcuts safely
   - Injects Import/Export UI into Cookie Clicker
   - Provides JSON shortcut persistence
   - Adds explicit version logging for debugging

   CHANGELOG:
   - v1.2.0: Added explicit versioning + startup trace logs
   - v1.2.0: Added guaranteed execution confirmation logs
   ========================================================= */

(function () {

    /* =====================================================
       VERSION INFO (ALWAYS LOGGED)
       ===================================================== */

    var COOKIE_KEYS_VERSION = "1.2.0";

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
        console.log("[CookieKeys] start() fired");

        Game.LoadMod(CONFIG.COOKIE_SHORTCUTS_URL);

        waitForCookieShortcuts();
    }


    /* =====================================================
       COOKIE SHORTCUTS READY CHECK
       ===================================================== */

    function waitForCookieShortcuts() {
        var interval = setInterval(function () {

            if (window.CookieShortcuts) {
                clearInterval(interval);

                console.log("[CookieKeys] CookieShortcuts detected");
                console.log("[CookieKeys] proceeding to UI injection");

                try {
                    window.CookieShortcuts.init?.();
                } catch (e) {
                    console.warn("[CookieKeys] CookieShortcuts init error:", e);
                }

                initUI();
            }

        }, 50);
    }


    /* =====================================================
       UI INJECTION
       ===================================================== */

    function initUI() {
        console.log("[CookieKeys] initUI()");
        observeMenu();
    }


    function observeMenu() {

        var injected = false;

        var observer = new MutationObserver(function () {

            var menu = document.getElementById("menu");
            if (!menu || injected) return;

            console.log("[CookieKeys] injecting UI into menu");

            injectUI(menu);
            injected = true;

            console.log("[CookieKeys] UI injection complete");

        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    function injectUI(menu) {

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

        menu.appendChild(panel);

        bindUI();
    }


    /* =====================================================
       IMPORT / EXPORT
       ===================================================== */

    function getData() {
        return window.CookieShortcuts?.config
            || window.CookieShortcuts?.bindings
            || window.CookieShortcuts
            || {};
    }

    function applyData(data) {
        if (!window.CookieShortcuts) return;

        if (window.CookieShortcuts.config) {
            window.CookieShortcuts.config = data;
        } else if (window.CookieShortcuts.bindings) {
            window.CookieShortcuts.bindings = data;
        } else {
            Object.assign(window.CookieShortcuts, data);
        }
    }


    function bindUI() {

        var box = document.getElementById("ck-box");

        document.getElementById("ck-export").onclick = function () {
            var data = getData();

            console.log("[CookieKeys] exporting data:", data);

            box.value = JSON.stringify(data, null, 2);
        };

        document.getElementById("ck-import").onclick = function () {
            try {
                var parsed = JSON.parse(box.value);

                console.log("[CookieKeys] importing data:", parsed);

                applyData(parsed);

                console.log("[CookieKeys] import complete");

            } catch (e) {
                console.error("[CookieKeys] import failed:", e);
            }
        };
    }

})();