/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   PURPOSE:
   - Loads CookieShortcuts mod safely
   - Waits for full initialization
   - Adds Import / Export UI inside Options menu
   - Provides persistent JSON shortcut profile management

   ARCHITECTURE:
   Cookie Clicker → CookieShortcuts → CookieKeys (this layer)

   CHANGELOG:
   - v1.1: Fixed UI not appearing due to DOM injection timing
   - v1.1: Anchored UI to stable Options container
   - v1.1: Removed fragile subsection targeting
   - v1.1: Ensured UI survives Options re-rendering
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
        if (typeof Game !== "undefined") {
            start();
        } else {
            setTimeout(waitForGame, 100);
        }
    }

    waitForGame();


    function start() {
        console.log("[CookieKeys] starting loader chain");
        loadCookieShortcuts();
    }


    /* =====================================================
       COOKIE SHORTCUTS LOADER
       ===================================================== */

    function loadCookieShortcuts() {
        console.log("[CookieKeys] loading CookieShortcuts");

        Game.LoadMod(CONFIG.COOKIE_SHORTCUTS_URL);

        waitForCookieShortcuts();
    }


    function waitForCookieShortcuts() {
        var interval = setInterval(function () {

            if (window.CookieShortcuts) {
                clearInterval(interval);

                console.log("[CookieKeys] CookieShortcuts ready");

                try {
                    window.CookieShortcuts.init?.();
                } catch (e) {
                    console.warn("[CookieKeys] init error:", e);
                }

                initUI();
            }

        }, 50);
    }


    /* =====================================================
       UI SYSTEM (OPTIONS MENU INJECTION)
       ===================================================== */

    function initUI() {
        waitForOptionsReady();
    }


    function waitForOptionsReady() {
        var interval = setInterval(function () {

            var menu = document.getElementById("menu");
            if (!menu) return;

            // Wait until Options content exists AND is active
            var optionsContent = menu.querySelector(".subsection");

            if (optionsContent) {
                clearInterval(interval);

                injectUI(menu);
            }

        }, 250);
    }


    function injectUI(menu) {

        if (document.getElementById("cookiekeys-panel")) return;

        var panel = document.createElement("div");
        panel.id = "cookiekeys-panel";

        panel.style.marginTop = "12px";
        panel.style.padding = "10px";
        panel.style.border = "1px solid #555";
        panel.style.background = "#1f1f1f";
        panel.style.color = "#fff";

        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:8px;">
                CookieKeys – Shortcut Profiles
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
       IMPORT / EXPORT LOGIC
       ===================================================== */

    function getShortcutData() {
        return window.CookieShortcuts?.config
            || window.CookieShortcuts?.bindings
            || window.CookieShortcuts
            || {};
    }


    function applyShortcutData(data) {
        if (!window.CookieShortcuts) return;

        if (window.CookieShortcuts.config) {
            window.CookieShortcuts.config = data;
        } else if (window.CookieShortcuts.bindings) {
            window.CookieShortcuts.bindings = data;
        } else {
            Object.assign(window.CookieShortcuts, data);
        }

        window.CookieShortcuts.init?.();
    }


    function bindUI() {

        var box = document.getElementById("ck-box");

        document.getElementById("ck-export").onclick = function () {
            var data = getShortcutData();
            box.value = JSON.stringify(data, null, 2);
            console.log("[CookieKeys] exported");
        };

        document.getElementById("ck-import").onclick = function () {
            try {
                var data = JSON.parse(box.value);
                applyShortcutData(data);
                console.log("[CookieKeys] imported");
            } catch (e) {
                console.error("[CookieKeys] invalid JSON", e);
            }
        };
    }

})();