/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   VERSION: 1.3.0

   PURPOSE:
   - Loads CookieShortcuts mod
   - Provides Import / Export UI for shortcut JSON
   - Injects UI into ACTIVE Cookie Clicker Options panel
   - Avoids DOM rebuild / hidden container issues

   ARCHITECTURE:
   Cookie Clicker → CookieShortcuts → CookieKeys (UI + persistence layer)

   CHANGELOG:
   - v1.3.0: Fixed UI not appearing due to incorrect DOM injection target
   - v1.3.0: Now injects into active visible Options subsection
   - v1.3.0: Improved MutationObserver stability
   ========================================================= */

(function () {

    /* =====================================================
       VERSION LOGGING (ALWAYS FIRST)
       ===================================================== */

    var COOKIE_KEYS_VERSION = "1.3.0";

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
       UI OBSERVER (FIXED TARGETING)
       ===================================================== */

    function observeUI() {

        var injected = false;

        var observer = new MutationObserver(function () {

            if (injected) return;

            var menu = document.getElementById("menu");
            if (!menu) return;

            // IMPORTANT FIX:
            // target ACTIVE Options content, not just menu shell
            var optionsContent =
                menu.querySelector(".subsection") ||
                menu.querySelector("#menu") ||
                menu;

            if (!optionsContent) return;

            var visible = window.getComputedStyle(optionsContent).display !== "none";
            if (!visible) return;

            console.log("[CookieKeys] injecting UI into Options");

            injectUI(optionsContent);

            injected = true;

            console.log("[CookieKeys] UI injected successfully");

        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    /* =====================================================
       UI CREATION
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
       IMPORT / EXPORT LOGIC
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
            box.value = JSON.stringify(data, null, 2);
            console.log("[CookieKeys] exported");
        };

        document.getElementById("ck-import").onclick = function () {
            try {
                applyData(JSON.parse(box.value));
                console.log("[CookieKeys] imported");
            } catch (e) {
                console.error("[CookieKeys] import failed:", e);
            }
        };
    }

})();