/* =========================================================
   CookieKeys.js
   - Loads CookieShortcuts safely
   - Waits for initialization
   - Then applies CookieKeys enhancements
   ========================================================= */

(function () {

    /* =====================================================
       CONFIG
       ===================================================== */

    const COOKIE_SHORTCUTS_URL =
        "https://mastarcheeze.github.io/cookie-clicker-mods/cookieshortcuts/main.js";

    const COOKIE_KEYS_URL =
        "https://billservo.github.io/CookieKeys/CookieKeys.js";


    /* =====================================================
       COOKIE KEYS CORE (your layer)
       ===================================================== */

    const CookieKeys = {

        init() {
            console.log("[CookieKeys] init");

            // ensure dependency is ready
            if (!window.CookieShortcuts) {
                console.warn("[CookieKeys] CookieShortcuts missing at init time");
            }

            this.enhance();
        },

        enhance() {
            console.log("[CookieKeys] enhance running");

            if (window.CookieShortcuts?.enhance) {
                window.CookieShortcuts.enhance();
            }

            // YOUR CUSTOM SHORTCUT LOGIC GOES HERE
            // Example:
            // this.registerHotkeys();
        },

        registerHotkeys() {
            console.log("[CookieKeys] registering hotkeys");

            document.addEventListener("keydown", (e) => {
                // example hook
                if (e.ctrlKey && e.key === "k") {
                    console.log("CookieKeys hotkey triggered");
                }
            });
        }
    };


    /* expose globally for debugging / interop */
    window.CookieKeys = CookieKeys;


    /* =====================================================
       LOADER: CookieShortcuts → CookieKeys
       ===================================================== */

    function loadCookieShortcuts() {

        console.log("[Loader] Loading CookieShortcuts...");

        Game.LoadMod(COOKIE_SHORTCUTS_URL);

        waitForCookieShortcuts();
    }


    function waitForCookieShortcuts() {

        const interval = setInterval(() => {

            if (window.CookieShortcuts) {

                clearInterval(interval);

                console.log("[Loader] CookieShortcuts ready");

                onCookieShortcutsReady();
            }

        }, 50);
    }


    function onCookieShortcutsReady() {

        // Optional safe init call if the mod supports it
        try {
            window.CookieShortcuts.init?.();
        } catch (e) {
            console.warn("[Loader] CookieShortcuts init failed:", e);
        }

        loadCookieKeysLayer();
    }


    function loadCookieKeysLayer() {

        console.log("[Loader] Loading CookieKeys layer...");

        const script = document.createElement("script");
        script.src = COOKIE_KEYS_URL;

        script.onload = () => {
            console.log("[Loader] CookieKeys script injected");

            waitForCookieKeysInit();
        };

        script.onerror = () => {
            console.error("[Loader] Failed to load CookieKeys");
        };

        document.head.appendChild(script);
    }


    function waitForCookieKeysInit() {

        const interval = setInterval(() => {

            if (window.CookieKeys) {

                clearInterval(interval);

                console.log("[Loader] CookieKeys ready");

                window.CookieKeys.init();
            }

        }, 50);
    }


    /* =====================================================
       BOOTSTRAP
       ===================================================== */

    function start() {
        console.log("[Bootstrap] starting loader chain");

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

})();