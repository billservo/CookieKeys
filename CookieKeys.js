/* =========================================================
   CookieKeys.js (FULL STANDALONE VERSION)
   - Loads CookieShortcuts
   - Waits for readiness
   - Injects Options UI for Import/Export
   ========================================================= */

(function () {

    /* =====================================================
       BOOTSTRAP
       ===================================================== */

    function start() {
        console.log("[CookieKeys] starting loader chain");

        loadCookieShortcuts();
    }

    function waitForGame() {
        if (typeof Game !== "undefined") {
            start();
        } else {
            setTimeout(waitForGame, 100);
        }
    }

    waitForGame();


    /* =====================================================
       LOAD COOKIE SHORTCUTS
       ===================================================== */

    const COOKIE_SHORTCUTS_URL =
        "https://mastarcheeze.github.io/cookie-clicker-mods/cookieshortcuts/main.js";

    function loadCookieShortcuts() {
        console.log("[CookieKeys] loading CookieShortcuts");

        Game.LoadMod(COOKIE_SHORTCUTS_URL);

        waitForCookieShortcuts();
    }

    function waitForCookieShortcuts() {
        const interval = setInterval(() => {

            if (window.CookieShortcuts) {
                clearInterval(interval);

                console.log("[CookieKeys] CookieShortcuts ready");

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
       COOKIE KEYS UI (OPTIONS PANEL)
       ===================================================== */

    function initUI() {
        waitForOptionsMenu();
    }

    function waitForOptionsMenu() {
        const interval = setInterval(() => {

            const menu = document.getElementById("menu");
            const optionsPanel = menu?.querySelector(".subsection") || menu;

            if (menu && optionsPanel) {
                clearInterval(interval);
                injectUI(optionsPanel);
            }

        }, 300);
    }

    function injectUI(container) {

        if (document.getElementById("cookiekeys-panel")) return;

        const panel = document.createElement("div");
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
                style="width:100%;height:100px;margin-top:8px;
                       background:#111;color:#0f0;"></textarea>
        `;

        container.appendChild(panel);

        bindUI();
    }


    /* =====================================================
       UI LOGIC
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

        const box = document.getElementById("ck-box");

        document.getElementById("ck-export").onclick = () => {
            const data = getShortcutData();
            box.value = JSON.stringify(data, null, 2);
            console.log("[CookieKeys] exported");
        };

        document.getElementById("ck-import").onclick = () => {
            try {
                const data = JSON.parse(box.value);
                applyShortcutData(data);
                console.log("[CookieKeys] imported");
            } catch (e) {
                console.error("[CookieKeys] invalid JSON", e);
            }
        };
    }

})();