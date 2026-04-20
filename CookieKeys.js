/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   VERSION: 1.7.0

   CHangelog:
   - Fixed: Webpack bundle scoping prevented UI injection.
   - Fixed: Restored original UX by patching the internal 
     'render' function of the module.
   - Added: "Backup and Restore" section added as a native 
     category within the original mod panel.
   ========================================================= */

(function() {
    console.log("Cookie Keys v1.7.0: Initializing Restoration Protocol...");

    // This targets the internal Game.UpdateMenu wrapper used by the bundle
    const oldUpdateMenu = Game.UpdateMenu;

    Game.UpdateMenu = function() {
        oldUpdateMenu();

        // Only act if we are in the Options menu
        if (Game.onMenu === 'prefs') {
            const menu = l('menu');
            if (!menu) return;

            // Find the Mod's container (the bundle creates a specific div for its UI)
            // We search for the first title that says "General" to find our insertion point
            const sections = menu.getElementsByClassName('section');
            let targetSection = null;

            for (let s of sections) {
                if (s.innerHTML.includes('General')) {
                    targetSection = s;
                    break;
                }
            }

            if (targetSection && !l('rescuetool_ui')) {
                const backupDiv = document.createElement('div');
                backupDiv.id = 'rescuetool_ui';
                backupDiv.className = 'section';
                backupDiv.innerHTML = `
                    <div class="title" style="color:#ecc606;">Backup and Restore</div>
                    <div class="listing">
                        <input type="file" id="rescuetool_file" accept=".json" style="display:none;">
                        <a class="option" onclick="l('rescuetool_file').click();">Import JSON File</a>
                        <label>Select CookieShortcuts_Backup_2026-04-17.json</label>
                    </div>
                    <div class="listing">
                        <textarea id="rescuetool_text" style="width:100%; height:40px; background:rgba(0,0,0,0.5); color:#fff; border:1px solid #444; font-size:10px;" placeholder="Paste JSON here..."></textarea>
                        <a class="option" onclick="window.RescueRestore();">Apply Paste</a>
                    </div>
                `;

                // Insert it exactly above the "General" section so it feels native
                targetSection.parentNode.insertBefore(backupDiv, targetSection);

                // File handler
                l('rescuetool_file').onchange = function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(ev) { window.RescueProcess(ev.target.result); };
                        reader.readAsText(file);
                    }
                };
            }
        }
    };

    // Global helper for the buttons to talk to
    window.RescueProcess = function(content) {
        try {
            JSON.parse(content); // Validate
            localStorage.setItem('CookieKeys', content); // The bundle uses 'CookieKeys' or 'CookieShortcuts'
            localStorage.setItem('CookieShortcuts', content); 
            Game.Popup('Data Injected. Refresh (Ctrl+R) to activate.');
        } catch (e) {
            Game.Popup('Error: Invalid JSON');
        }
    };

    window.RescueRestore = function() {
        const val = l('rescuetool_text').value;
        if (val) window.RescueProcess(val);
    };

    Game.Notify('Cookie Keys v1.7.0', 'Restoration Hook Active', [16, 5]);
    console.log("Cookie Keys v1.7.0: System Ready.");
})();

/* PASTE THE ENTIRE ORIGINAL WEBPACK BUNDLE CONTENT BELOW THIS LINE */