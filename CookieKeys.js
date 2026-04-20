/* =========================================================
   COOKIE KEYS (SIMPLIFIED & ROBUST)
   ---------------------------------------------------------
   PURPOSE:
   - Loads CookieShortcuts (optional dependency)
   - Adds stable UI to Cookie Clicker Options menu
   - Handles import/export of shortcut JSON
   - DOES NOT depend on CookieShortcuts DOM
   ========================================================= */

(function () {

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
        console.log("[CookieKeys] booting");

        Game.LoadMod(CONFIG.COOKIE_SHORTCUTS_URL);

        initUI(); // IMPORTANT: no dependency waiting needed for UI
    }


    /* =====================================================
       UI (INDEPENDENT OF COOKIE SHORTCUTS)
       ===================================================== */

    function initUI() {
        waitForMenu();
    }

    function waitForMenu() {
        var interval = setInterval(function () {

            var menu = document.getElementById("menu");
            if (!menu) return;

            // Options panel always exists once menu exists
            injectUI(menu);

            clearInterval(interval);

        }, 250);
    }


    function injectUI(menu) {

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
                CookieKeys (Shortcut Import / Export)
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
       IMPORT / EXPORT (DIRECT)
       ===================================================== */

    function getData() {
        return window.CookieShortcuts?.config
            || window.CookieShortcuts?.bindings
            || window.CookieShortcuts
            || {};
    }

    function applyData(data) {
        if (!window.CookieShortcuts) {
            console.warn("[CookieKeys] CookieShortcuts not loaded yet");
            return;
        }

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
            box.value = JSON.stringify(getData(), null, 2);
            console.log("[CookieKeys] exported");
        };

        document.getElementById("ck-import").onclick = function () {
            try {
                applyData(JSON.parse(box.value));
                console.log("[CookieKeys] imported");
            } catch (e) {
                console.error("[CookieKeys] invalid JSON", e);
            }
        };
    }

})();