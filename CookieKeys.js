/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   VERSION: 1.6.0

   FIXES:
   - Scope isolation: Integrated backup/restore logic directly 
     into the mod object to bypass 'undefined' console errors.
   - Menu Persistence: Modified UpdateMenu to inject recovery 
     tools as the first DOM element, preventing race conditions.
   - Data Loss: Added native JSON file parsing and manual 
     textarea injection to handle 2026-04-17 recovery files.

   GOAL: 
   - Ensure 100% recovery of Garden and Grimoire shortcuts 
     for high-level "650 You" achievement runs.
   ========================================================= */

var CookieShortcuts = {};

CookieShortcuts.Init = function () {
    console.log("Cookie Keys v1.6.0: Initializing Restoration Protocol...");
    
    // Core Configuration
    CookieShortcuts.config = {
        notifications: true,
        confirmations: true,
        shortcuts: {}
    };

    // Native Storage Retrieval
    var savedConfig = localStorage.getItem('CookieShortcuts');
    if (savedConfig) {
        try {
            CookieShortcuts.config = JSON.parse(savedConfig);
        } catch (e) {
            console.error("Cookie Keys: Persistent storage parse failed.");
        }
    }

    // Hooking Game.UpdateMenu
    CookieShortcuts.UpdateMenu = (function (sub) {
        return function () {
            sub();
            if (Game.onMenu == 'prefs') {
                var menu = l('menu');
                if (!menu) return;

                // --- BACKUP AND RESTORE CATEGORY ---
                var restoreSection = document.createElement('div');
                restoreSection.className = 'section';
                restoreSection.innerHTML = `
                    <div class="title" style="color:#ecc606;">Backup and Restore</div>
                    <div class="listing">
                        <div class="optionBox" style="padding:10px; background:rgba(0,0,0,0.2); border:1px solid #444;">
                            <div style="margin-bottom:10px;">
                                <input type="file" id="cs_file_import" accept=".json" style="display:none;">
                                <a class="smallFancyButton" onclick="l('cs_file_import').click();">Load Backup File</a>
                                <span style="font-size:11px; opacity:0.6; margin-left:10px;">Import CookieShortcuts_Backup_2026-04-17.json</span>
                            </div>
                            <div style="margin-bottom:5px; font-size:12px;">Manual JSON Paste:</div>
                            <textarea id="cs_text_import" style="width:100%; height:60px; background:rgba(0,0,0,0.5); color:#fff; border:1px solid #333; font-family:monospace; font-size:10px;"></textarea>
                            <div style="margin-top:10px;">
                                <a class="smallFancyButton" onclick="CookieShortcuts.ManualImport();">Apply Configuration</a>
                            </div>
                        </div>
                    </div>
                `;
                menu.insertBefore(restoreSection, menu.firstChild);

                // Internal Logic Handlers
                l('cs_file_import').onchange = function(e) {
                    var file = e.target.files[0];
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function(ev) { CookieShortcuts.ProcessImport(ev.target.result); };
                    reader.readAsText(file);
                };

                CookieShortcuts.ProcessImport = function(content) {
                    try {
                        var parsed = JSON.parse(content);
                        CookieShortcuts.config = parsed;
                        localStorage.setItem('CookieShortcuts', JSON.stringify(CookieShortcuts.config));
                        Game.Popup('Shortcuts Restored Successfully');
                        Game.UpdateMenu();
                    } catch (err) {
                        Game.Popup('Error: Invalid JSON Format');
                    }
                };

                CookieShortcuts.ManualImport = function() {
                    var content = l('cs_text_import').value;
                    if (content) CookieShortcuts.ProcessImport(content);
                };

                // --- ORIGINAL UI RE-INJECTION ---
                var generalDiv = document.createElement('div');
                generalDiv.className = 'section';
                generalDiv.innerHTML = '<div class="title">General Settings</div>';
                generalDiv.appendChild(CookieShortcuts.AddOption('notifications', 'Notifications', 'Receive feedback on shortcut execution.'));
                generalDiv.appendChild(CookieShortcuts.AddOption('confirmations', 'Confirmations', 'Require confirmation for high-stakes actions.'));
                menu.appendChild(generalDiv);

                // Draw existing mod categories (Garden, Grimoire, etc.)
                if (typeof CookieShortcuts.UpdateCategories === 'function') {
                    CookieShortcuts.UpdateCategories();
                }
            }
        };
    }(Game.UpdateMenu));

    // Apply the patched menu
    Game.UpdateMenu = CookieShortcuts.UpdateMenu;

    Game.Notify('Cookie Keys v1.6.0', 'Restoration Framework Active', [16, 5]);
    console.log("Cookie Keys v1.6.0: System Ready.");
};

// UI Element Factory
CookieShortcuts.AddOption = function (pref, label, desc) {
    var div = document.createElement('div');
    div.className = 'listing';
    var active = CookieShortcuts.config[pref] ? 'on' : 'off';
    div.innerHTML = `
        <a class="option ${active}" onclick="CookieShortcuts.Toggle('${pref}');">${label}</a>
        <label>${desc}</label>
    `;
    return div;
};

// Preference Toggle
CookieShortcuts.Toggle = function (pref) {
    CookieShortcuts.config[pref] = !CookieShortcuts.config[pref];
    localStorage.setItem('CookieShortcuts', JSON.stringify(CookieShortcuts.config));
    Game.UpdateMenu();
};

CookieShortcuts.Init();