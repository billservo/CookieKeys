// ==UserScript==
// @name         Cookie Keys (Cookie Shortcuts with Import and Export)
// @version      2.0
// @description  Cookie Shortcuts with import/export + save integration
// ==/UserScript==

(function () {
    const ORIGINAL_SRC = "https://mastarcheeze.github.io/cookie-clicker-mods/cookieshortcuts/main.js";

    function loadOriginal(callback) {
        const script = document.createElement("script");
        script.src = ORIGINAL_SRC;
        script.onload = callback;
        document.head.appendChild(script);
    }

    function enhance() {
        if (!window.CookieShortcuts) {
            console.error("CookieShortcuts not found.");
            return;
        }

        const CS = window.CookieShortcuts;

        /* =========================
           EXPORT / IMPORT CORE
        ========================== */

        CS.exportData = function () {
            return JSON.stringify({
                version: 2,
                prefs: this.prefs,
                keybinds: this.keybinds,
                collapsibles: this.collapsibles
            }, null, 2);
        };

        CS.importData = function (json) {
            try {
                const data = typeof json === "string" ? JSON.parse(json) : json;

                if (!data.keybinds) throw new Error("Invalid shortcut file");

                this.prefs = data.prefs || this.prefs;
                this.keybinds = data.keybinds || {};
                this.collapsibles = data.collapsibles || [];

                this.save();
                if (this.reload) this.reload();

                Game.Notify("Cookie Shortcuts", "Import successful!", [16, 5]);
            } catch (e) {
                console.error(e);
                Game.Notify("Cookie Shortcuts", "Import failed!", [16, 5]);
            }
        };

        /* =========================
           UI INJECTION
        ========================== */

        const originalMenu = CS.getMenuString;

        CS.getMenuString = function () {
            let menu = originalMenu.call(this);

            const inject = `
                <div class="listing">
                    <a class="option" id="csImport">Import shortcuts</a>
                    <a class="option" id="csExport">Export shortcuts</a>
                </div>
            `;

            // Insert at top of General section
            menu = menu.replace(
                '<div class="subsection">',
                '<div class="subsection">' + inject
            );

            return menu;
        };

        const originalMenuInit = CS.initMenu;

        CS.initMenu = function () {
            originalMenuInit.call(this);

            const importBtn = document.getElementById("csImport");
            const exportBtn = document.getElementById("csExport");

            if (importBtn) {
                importBtn.onclick = function () {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".json";

                    input.onchange = e => {
                        const file = e.target.files[0];
                        const reader = new FileReader();

                        reader.onload = evt => {
                            CS.importData(evt.target.result);
                        };

                        reader.readAsText(file);
                    };

                    input.click();
                };
            }

            if (exportBtn) {
                exportBtn.onclick = function () {
                    const data = CS.exportData();
                    const blob = new Blob([data], { type: "application/json" });

                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = "CookieShortcuts.json";
                    a.click();
                };
            }
        };

        /* =========================
           SAVE EXPORT HOOK
        ========================== */

        (function () {
            const originalExport = Game.ExportSave;

            Game.ExportSave = function () {
                let save = originalExport();

                try {
                    const shortcuts = btoa(CS.exportData());
                    save += "\n!COOKIE_SHORTCUTS:" + shortcuts;
                } catch (e) {
                    console.error("Shortcut export failed", e);
                }

                return save;
            };
        })();

        /* =========================
           SAVE IMPORT HOOK
        ========================== */

        (function () {
            const originalImport = Game.ImportSave;

            Game.ImportSave = function (save) {
                const match = save.match(/!COOKIE_SHORTCUTS:([A-Za-z0-9+/=]+)/);

                if (match) {
                    try {
                        const json = atob(match[1]);
                        CS.importData(json);
                    } catch (e) {
                        console.error("Shortcut import failed", e);
                    }
                }

                return originalImport(save);
            };
        })();

        console.log("Cookie Shortcuts v2 loaded");
    }

    loadOriginal(enhance);
})();