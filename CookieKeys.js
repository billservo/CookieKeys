CookieShortcuts.UpdateMenu = (function (sub) {
    return function () {
        sub();
        if (Game.onMenu == 'prefs') {
            var menu = l('menu');
            if (!menu) return;

            // === NEW: BACKUP AND RESTORE SECTION ===
            var restoreSection = document.createElement('div');
            restoreSection.className = 'section';
            restoreSection.innerHTML = `
                <div class="title" style="color:#ecc606;">Backup and Restore</div>
                <div class="listing">
                    <div class="optionBox" style="padding:10px; background:rgba(0,0,0,0.2); border:1px solid #444;">
                        <div style="margin-bottom:10px;">
                            <input type="file" id="cs_file_import" accept=".json" style="display:none;">
                            <a class="smallFancyButton" onclick="l('cs_file_import').click();">Load Backup File</a>
                            <span style="font-size:11px; opacity:0.6; margin-left:10px;">Select your 2026-04-17 JSON</span>
                        </div>
                        <div style="margin-bottom:5px; font-size:12px;">Or paste JSON below:</div>
                        <textarea id="cs_text_import" style="width:100%; height:60px; background:rgba(0,0,0,0.5); color:#fff; border:1px solid #333; font-family:monospace; font-size:10px;"></textarea>
                        <div style="margin-top:10px;">
                            <a class="smallFancyButton" onclick="CookieShortcuts.ManualImport();">Apply Pasted JSON</a>
                        </div>
                    </div>
                </div>
            `;
            
            // Inject at the top of the menu
            menu.insertBefore(restoreSection, menu.firstChild);

            // Add Event Listener for File Input
            l('cs_file_import').onchange = function(e) {
                var file = e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function(e) {
                    CookieShortcuts.ProcessImport(e.target.result);
                };
                reader.readAsText(file);
            };

            // Define the Processing Logic
            CookieShortcuts.ProcessImport = function(content) {
                try {
                    var parsed = JSON.parse(content);
                    CookieShortcuts.config = parsed;
                    localStorage.setItem('CookieShortcuts', JSON.stringify(CookieShortcuts.config));
                    Game.Popup('Shortcuts Restored');
                    Game.UpdateMenu();
                } catch (err) {
                    Game.Popup('Error: Invalid JSON format');
                }
            };

            CookieShortcuts.ManualImport = function() {
                var content = l('cs_text_import').value;
                if (content) CookieShortcuts.ProcessImport(content);
            };
            // === END BACKUP AND RESTORE SECTION ===

            // Original "General" Section follows...
            var generalDiv = document.createElement('div');
            generalDiv.className = 'section';
            // ... [Rest of the original script follows here]