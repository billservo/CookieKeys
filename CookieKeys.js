/* =========================================================
   COOKIE KEYS (Cookie Clicker Mod)
   ---------------------------------------------------------
   VERSION: 1.9.0

   FIXES:
   - Race Condition: Added a 1.5s delay before reload to ensure 
     localStorage write-completion.
   - Key Redundancy: Injects into 'CookieShortcuts' AND 'CookieKeys'
     to ensure compatibility with different Webpack builds.
   - Feedback: UI now shows "Ready to Refresh" once the 
     injection is confirmed.

   GOAL: Finalizing 2026-04-17 recovery for 650 You push.
   ========================================================= */

(function() {
    console.log("Cookie Keys v1.9.0: Persistent Restoration Active.");

    window.processRestore = function(data) {
        try {
            // 1. Validate JSON
            const parsed = JSON.parse(data);
            
            // 2. Multi-Key Injection (Brute Force Persistence)
            const targets = ['CookieShortcuts', 'CookieKeys', 'CookieShortcuts_v2'];
            targets.forEach(key => {
                localStorage.setItem(key, data);
            });

            // 3. Visual Confirmation
            const btn = l('restore_btn_label');
            if (btn) {
                btn.innerHTML = "DATA LOCKED. REFRESHING IN 2s...";
                btn.style.color = "#00ff00";
            }
            
            Game.Popup('Data Injected. Awaiting Sync...');

            // 4. Delayed Reload to prevent race conditions with Game.Save()
            setTimeout(() => { 
                location.reload(); 
            }, 2000);

        } catch (e) {
            Game.Popup('Error: Invalid JSON File');
            console.error("Restore failed:", e);
        }
    };

    const injectRestoreUI = () => {
        if (Game.onMenu !== 'prefs') return;
        
        const menu = l('menu');
        if (menu && !l('restore_ui_added')) {
            const div = document.createElement('div');
            div.id = 'restore_ui_added';
            div.className = 'section';
            div.innerHTML = `
                <div class="title" style="color:#ecc606;">Backup and Restore (v1.9.0)</div>
                <div class="listing">
                    <input type="file" id="file_picker" accept=".json" style="display:none;">
                    <a class="option" id="restore_btn_label" onclick="l('file_picker').click();">Load 2026-04-17 JSON</a>
                    <label>Injects Garden/Grimoire data and reloads game safely.</label>
                </div>
            `;

            const sections = menu.getElementsByClassName('section');
            let placed = false;
            for (let s of sections) {
                if (s.innerText.includes('General')) {
                    s.parentNode.insertBefore(div, s);
                    placed = true;
                    break;
                }
            }
            if (!placed) menu.insertBefore(div, menu.firstChild);

            const picker = l('file_picker');
            if (picker) {
                picker.onchange = function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => window.processRestore(ev.target.result);
                        reader.readAsText(file);
                    }
                };
            }
        }
    };

    const menuObserver = new MutationObserver(() => {
        if (Game.onMenu === 'prefs') injectRestoreUI();
    });

    menuObserver.observe(document.body, { childList: true, subtree: true });
    setTimeout(injectRestoreUI, 500);
})();

/* =========================================================
   PASTE THE ENTIRE CONTENT OF CookieShortcuts.js BELOW
   ========================================================= */

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _menu_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _keybind__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _actions_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);





const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// FUTURE export/load keymappings to/from string
class Mod {
    id = _storage__WEBPACK_IMPORTED_MODULE_0__["default"].id;
    name = _storage__WEBPACK_IMPORTED_MODULE_0__["default"].name;
    init() {
        // listen for and trigger keyboard shortcuts
        function keyDown(e) {
            let shortcutName;
            const toRun = [];
            for (shortcutName in _actions_actions__WEBPACK_IMPORTED_MODULE_4__["default"]) {
                for (const shortcutPair of _storage__WEBPACK_IMPORTED_MODULE_0__["default"].keybinds[shortcutName]) {
                    if (shortcutPair == null)
                        continue;
                    const [keybind] = shortcutPair;
                    if (keybind == null)
                        continue;
                    if (_keybind__WEBPACK_IMPORTED_MODULE_3__["default"].prototype.match.call(keybind, e)) {
                        toRun.push([shortcutPair[1], shortcutName, shortcutPair[2]]);
                    }
                }
            }
            toRun.sort((a, b) => a[0] - b[0]); // sort smallest to largest
            (async () => {
                let lastOrder = -100;
                for (const [order, shortcutName, args] of toRun) {
                    _actions_actions__WEBPACK_IMPORTED_MODULE_4__["default"][shortcutName](...args);
                    if (order != lastOrder)
                        await sleep(150);
                    lastOrder = order;
                }
            })();
        }
        document.addEventListener("keydown", keyDown, false);
        // remove the default game keybinds ctrl+s and ctrl+o by countering them
        _aliases__WEBPACK_IMPORTED_MODULE_2__.w.addEventListener("keydown", (e) => {
            if (_storage__WEBPACK_IMPORTED_MODULE_0__["default"].allowDefault) {
                _storage__WEBPACK_IMPORTED_MODULE_0__["default"].allowDefault = false;
                return;
            }
            if (!_aliases__WEBPACK_IMPORTED_MODULE_2__.Game.OnAscend && _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.AscendTimer == 0) {
                if (e.ctrlKey && e.keyCode == 83) {
                    _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.toSave = false; // prevent save
                }
                else if (e.ctrlKey && e.keyCode == 79) {
                    _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.ClosePrompt(); // close load save
                }
            }
        });
        // override click cookie to prevent clicks when autoclicking is enabled
        (0,_aliases__WEBPACK_IMPORTED_MODULE_2__.$)("#bigCookie").removeEventListener("click", _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.ClickCookie, false);
        const oldFunc = _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.ClickCookie;
        _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.ClickCookie = function (...args) {
            if (_storage__WEBPACK_IMPORTED_MODULE_0__["default"].autoclickerInterval == null || _storage__WEBPACK_IMPORTED_MODULE_0__["default"].callFromAutoClicker) {
                _storage__WEBPACK_IMPORTED_MODULE_0__["default"].callFromAutoClicker = false;
                return oldFunc(...args);
            }
        };
        if (!_aliases__WEBPACK_IMPORTED_MODULE_2__.Game.mods.CookieMonster) {
            // Cookie monster already overrides big cookie click event
            (0,_aliases__WEBPACK_IMPORTED_MODULE_2__.$)("#bigCookie").addEventListener("click", _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.ClickCookie, false);
        }
    }
    delayedInit() {
        (0,_menu_menu__WEBPACK_IMPORTED_MODULE_1__["default"])();
    }
    save() {
        const save = JSON.stringify(_storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveObj);
        return save;
    }
    load(str) {
        let parsed;
        try {
            parsed = JSON.parse(str);
        }
        catch (error) {
            console.warn(`${name} - Unable to load settings. Reverting to defaults.`);
            return;
        }
        _storage__WEBPACK_IMPORTED_MODULE_0__["default"].saveObj = parsed;
        _aliases__WEBPACK_IMPORTED_MODULE_2__.Game.UpdateMenu();
    }
    exposed = _storage__WEBPACK_IMPORTED_MODULE_0__["default"].exposed;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Mod());


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _keybind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


class Storage {
    id = "CookieShortcuts";
    name = "Cookie Shortcuts";
    defaultOrder = 0;
    // set defaults
    tempPrefs = {
        protectVeil: true,
        protectShiny: true,
        verbose: true,
        runButtons: false,
        advanced: false,
        cheats: false,
    };
    tempKeybinds = ((obj) => obj)({
        "general.autoclicker": [[new _keybind__WEBPACK_IMPORTED_MODULE_1__["default"]("Space"), this.defaultOrder, [10]]],
        "general.clickGoldenCookie": [[new _keybind__WEBPACK_IMPORTED_MODULE_1__["default"]("Period"), this.defaultOrder, [true, false]]],
        "general.clickFortuneCookie": [[new _keybind__WEBPACK_IMPORTED_MODULE_1__["default"]("Period"), this.defaultOrder, []]],
        "general.popWrinkler": [[null, this.defaultOrder, [true]]],
        "general.save": [[new _keybind__WEBPACK_IMPORTED_MODULE_1__["default"]("Ctrl", "KeyS"), this.defaultOrder, []]],
        "general.exportSave": [[null, this.defaultOrder, []]],
        "general.exportSaveToFile": [[null, this.defaultOrder, []]],
        "general.exportSaveToClipboard": [[new _keybind__WEBPACK_IMPORTED_MODULE_1__["default"]("Ctrl", "KeyE"), this.defaultOrder, []]],
        "general.importSave": [[new _keybind__WEBPACK_IMPORTED_MODULE_1__["default"]("Ctrl", "KeyO"), this.defaultOrder, []]],
        "general.importSaveFromFile": [[null, this.defaultOrder, []]],
        "general.importSaveFromClipboard": [[null, this.defaultOrder, []]],
        "general.ascend": [[null, this.defaultOrder, [false, true]]],
        "general.options": [[null, this.defaultOrder, []]],
        "general.info": [[null, this.defaultOrder, []]],
        "general.stats": [[null, this.defaultOrder, []]],
        "upgrades.buyAll": [[null, this.defaultOrder, []]],
        "upgrades.switchSeason": [[null, this.defaultOrder, ["Toggle", "Christmas"]]],
        "upgrades.goldenSwitch": [[null, this.defaultOrder, ["Toggle"]]],
        "upgrades.shimmeringVeil": [[null, this.defaultOrder, ["Toggle"]]],
        "upgrades.sugarFrenzy": [[null, this.defaultOrder, [false]]],
        "buildings.building": [[null, this.defaultOrder, ["Buy", "1", 0, "Cursor", false]]],
        "krumblor.setAura": [[null, this.defaultOrder, ["No aura", false]]],
        "krumblor.upgrade": [[null, this.defaultOrder, []]],
        "krumblor.pet": [[null, this.defaultOrder, []]],
        "santa.upgrade": [[null, this.defaultOrder, []]],
        "garden.seed": [[null, this.defaultOrder, [true, false, "Baker's wheat", 1, 1, true, true, false]]],
        "garden.freeze": [[null, this.defaultOrder, ["Toggle"]]],
        "garden.changeSoil": [[null, this.defaultOrder, ["Dirt"]]],
        "garden.convert": [[null, this.defaultOrder, [false]]],
        "market.good": [[null, this.defaultOrder, ["Buy", "1", 0, "CRL", false]]],
        "market.loan": [[null, this.defaultOrder, ["1st loan"]]],
        "market.hireBroker": [[null, this.defaultOrder, []]],
        "market.upgradeOffice": [[null, this.defaultOrder, []]],
        "pantheon.slot": [[null, this.defaultOrder, [true, "Holobore", "Jade", "Cancel", "Jade"]]],
        "grimoire.cast": [[null, this.defaultOrder, ["Conjure Baked Goods"]]],
        "cheats.cookies": [[null, this.defaultOrder, ["Set to", 1e72]]],
        "cheats.lumps": [[null, this.defaultOrder, ["Set to", 1e9]]],
        "cheats.heavenlyChips": [[null, this.defaultOrder, ["Set to", 1e18]]],
        "cheats.openSesame": [[null, this.defaultOrder, []]],
        "cheats.ruinTheFun": [[null, this.defaultOrder, []]],
        "cheats.party": [[null, this.defaultOrder, []]],
        "others.wipeSave": [[null, this.defaultOrder, [false]]],
        "others.resetDefaults": [[null, this.defaultOrder, []]],
    });
    defaultPrefs = structuredClone(this.tempPrefs);
    defaultKeybinds = structuredClone(this.tempKeybinds);
    prefs = structuredClone(this.defaultPrefs);
    keybinds = structuredClone(this.defaultKeybinds);
    collapsibles = [];
    autoclickerInterval = null; // id of auto clicker setinterval
    callFromAutoClicker = false; // flag variable to show if click cookie is called from shortcut autoclicker
    allowDefault = false; // used for overriding the default game keybinds ctrl+s and ctrl+o
    constructor() {
        Object.seal(this.prefs);
        Object.seal(this.keybinds);
    }
    get saveObj() {
        return {
            prefs: this.prefs,
            keybinds: this.keybinds,
            collapsibles: this.collapsibles,
        };
    }
    set saveObj(value) {
        this.prefs = { ...this.prefs, ...value["prefs"] };
        this.keybinds = { ...this.keybinds, ...value["keybinds"] };
        this.collapsibles = value["collapsibles"];
    }
    resetAllToDefaults = () => {
        Object.assign(this.prefs, structuredClone(this.defaultPrefs));
        Object.assign(this.keybinds, structuredClone(this.defaultKeybinds));
    };
    // exposed functions for keybind editor for string callbacks
    exposed = {};
}
const instance = new Storage();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instance);
_aliases__WEBPACK_IMPORTED_MODULE_0__.w.Storage = instance;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ $),
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   Garden: () => (/* binding */ Garden),
/* harmony export */   Grimoire: () => (/* binding */ Grimoire),
/* harmony export */   Market: () => (/* binding */ Market),
/* harmony export */   Pantheon: () => (/* binding */ Pantheon),
/* harmony export */   w: () => (/* binding */ w)
/* harmony export */ });
const $ = document.querySelector.bind(document);
const w = window;
const Game = w.Game;
let Garden;
let Market;
let Pantheon;
let Grimoire;
// initialise shortened minigame variables
const gardenInterval = setInterval(() => {
    if (Game.Objects["Farm"]["minigameLoaded"]) {
        Garden = Game.Objects["Farm"]["minigame"];
        // w.Garden = Garden; // DEBUG
        clearInterval(gardenInterval);
    }
}, 1000);
const marketInterval = setInterval(() => {
    if (Game.Objects["Bank"]["minigameLoaded"]) {
        Market = Game.Objects["Bank"]["minigame"];
        // w.Market = Market; // DEBUG
        // w.Market.secondsPerTick = 1; // DEBUG
        clearInterval(marketInterval);
    }
}, 1000);
const pantheonInterval = setInterval(() => {
    if (Game.Objects["Temple"]["minigameLoaded"]) {
        Pantheon = Game.Objects["Temple"]["minigame"];
        // w.Pantheon = Pantheon; // DEBUG
        clearInterval(pantheonInterval);
    }
}, 1000);
const grimoireInterval = setInterval(() => {
    if (Game.Objects["Wizard tower"]["minigameLoaded"]) {
        Grimoire = Game.Objects["Wizard tower"]["minigame"];
        // w.Grimoire = Grimoire; // DEBUG
        clearInterval(grimoireInterval);
    }
}, 1000);


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Keybind)
/* harmony export */ });
class Keybind {
    ctrl = false;
    shift = false;
    alt = false;
    code;
    constructor(...keys) {
        if (keys.includes("Ctrl") ||
            keys.includes("Control") ||
            keys.includes("ControlLeft") ||
            keys.includes("ControlRight")) {
            this.ctrl = true;
        }
        if (keys.includes("Shift") || keys.includes("ShiftLeft") || keys.includes("ShiftRight")) {
            this.shift = true;
        }
        if (keys.includes("Alt") || keys.includes("AltLeft") || keys.includes("AltRight")) {
            this.alt = true;
        }
        const firstNotModifierKey = keys.filter((key) => ![
            "Ctrl",
            "Control",
            "ControlLeft",
            "ControlRight",
            "Shift",
            "ShiftLeft",
            "ShiftRight",
            "Alt",
            "AltLeft",
            "AltRight",
        ].includes(key))[0];
        if (firstNotModifierKey)
            this.code = firstNotModifierKey;
    }
    match(obj) {
        return (this.ctrl === obj.ctrlKey &&
            this.shift === obj.shiftKey &&
            this.alt === obj.altKey &&
            (this.code == null || this.code === obj.code));
    }
    toString() {
        const displayKeys = [];
        if (this.ctrl)
            displayKeys.push("Ctrl");
        if (this.shift)
            displayKeys.push("Shift");
        if (this.alt)
            displayKeys.push("Alt");
        if (this.code) {
            displayKeys.push(Keybind.codeMap[this.code] ?? this.code);
        }
        return displayKeys.join(" + ");
    }
    static codeMap = Object.freeze({
        Backquote: "`",
        Digit1: "1",
        Digit2: "2",
        Digit3: "3",
        Digit4: "4",
        Digit5: "5",
        Digit6: "6",
        Digit7: "7",
        Digit8: "8",
        Digit9: "9",
        Digit0: "0",
        Minus: "-",
        Equal: "=",
        KeyA: "A",
        KeyB: "B",
        KeyC: "C",
        KeyD: "D",
        KeyE: "E",
        KeyF: "F",
        KeyG: "G",
        KeyH: "H",
        KeyI: "I",
        KeyJ: "J",
        KeyK: "K",
        KeyL: "L",
        KeyM: "M",
        KeyN: "N",
        KeyO: "O",
        KeyP: "P",
        KeyQ: "Q",
        KeyR: "R",
        KeyS: "S",
        KeyT: "T",
        KeyU: "U",
        KeyV: "V",
        KeyW: "W",
        KeyX: "X",
        KeyY: "Y",
        KeyZ: "Z",
        BracketLeft: "[",
        BracketRight: "]",
        Backslash: "\\",
        Semicolon: ";",
        Quote: "'",
        Comma: ",",
        Period: ".",
        Slash: "/",
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
    });
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ build)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _general__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(24);
/* harmony import */ var _upgrades__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(26);
/* harmony import */ var _buildings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(27);
/* harmony import */ var _krumblor_and_santa__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(28);
/* harmony import */ var _market__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _garden__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(30);
/* harmony import */ var _pantheon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(31);
/* harmony import */ var _grimoire__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(32);
/* harmony import */ var _cheats__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(33);
/* harmony import */ var _others__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(34);
/* harmony import */ var _base_menu_injector__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(35);













function build() {
    const menu = new _component__WEBPACK_IMPORTED_MODULE_0__.Collapsible(_storage__WEBPACK_IMPORTED_MODULE_1__["default"].name, 22, undefined);
    menu.add(_general__WEBPACK_IMPORTED_MODULE_2__["default"], _upgrades__WEBPACK_IMPORTED_MODULE_3__["default"], _buildings__WEBPACK_IMPORTED_MODULE_4__["default"], _krumblor_and_santa__WEBPACK_IMPORTED_MODULE_5__["default"], _garden__WEBPACK_IMPORTED_MODULE_7__["default"], _market__WEBPACK_IMPORTED_MODULE_6__["default"], _pantheon__WEBPACK_IMPORTED_MODULE_8__["default"], _grimoire__WEBPACK_IMPORTED_MODULE_9__["default"], _cheats__WEBPACK_IMPORTED_MODULE_10__["default"], _others__WEBPACK_IMPORTED_MODULE_11__["default"]);
    (0,_base_menu_injector__WEBPACK_IMPORTED_MODULE_12__.injectMenu)(menu);
    (0,_base_menu_injector__WEBPACK_IMPORTED_MODULE_12__.injectCss)(_component__WEBPACK_IMPORTED_MODULE_0__.css);
}


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Collapsible: () => (/* binding */ Collapsible),
/* harmony export */   PrefButton: () => (/* binding */ PrefButton),
/* harmony export */   Shortcut: () => (/* binding */ Shortcut),
/* harmony export */   TitleShortcut: () => (/* binding */ TitleShortcut),
/* harmony export */   css: () => (/* binding */ css)
/* harmony export */ });
/* harmony import */ var _actions_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _base_menu_stringtohtml__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21);
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _keybind__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);






let css = "";
class Collapsible extends _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Collapsible {
    text;
    size;
    static count = 0;
    count;
    constructor(text, size = 16, header = false) {
        super(text, size);
        this.text = text;
        this.size = size;
        this.count = Collapsible.count++;
        this.value.attachGetterSetter(() => _storage__WEBPACK_IMPORTED_MODULE_4__["default"].collapsibles[this.count], (value) => (_storage__WEBPACK_IMPORTED_MODULE_4__["default"].collapsibles[this.count] = value));
        if (this.value._ === undefined) {
            this.value._ = false;
        }
        this.addStyle("margin-bottom: 12px;");
        if (!header)
            this.addStyle("display: flex; flex-direction: column; gap: 8px;");
    }
}
class PrefButton extends _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Listing {
    prefName;
    label;
    button;
    constructor(prefName, text, label, defaultValue = 0) {
        if (!(prefName in _storage__WEBPACK_IMPORTED_MODULE_4__["default"].defaultPrefs))
            throw new Error(`Preference '${prefName}' does not exist`);
        super();
        this.prefName = prefName;
        this.label = label;
        if (typeof text === "string") {
            this.button = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.OnOffButton(text);
            this.button.value.attachGetterSetter(() => _storage__WEBPACK_IMPORTED_MODULE_4__["default"].prefs[this.prefName], (value) => (_storage__WEBPACK_IMPORTED_MODULE_4__["default"].prefs[this.prefName] = value));
        }
        else {
            this.button = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.ToggleButton(text);
            this.button.value.attachGetterSetter(() => _storage__WEBPACK_IMPORTED_MODULE_4__["default"].prefs[this.prefName], 
            // @ts-expect-error this is here because there is currently no number prefs
            (value) => (_storage__WEBPACK_IMPORTED_MODULE_4__["default"].prefs[this.prefName] = value));
        }
        this.add(this.button);
        if (label)
            this.add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Label(label));
    }
}
// trim all undefineds from the end of an array
function arrayTrimEnd(array) {
    let i;
    for (i = array.length; i >= 0; i--) {
        if (array[i] != null)
            break;
    }
    array.splice(i + 1);
}
css += `
    p * {
        margin-right: 5px;
    }
`;
class Shortcut extends _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Listing {
    shortcutName;
    writeContent;
    constructor(shortcutName, writeContent) {
        if (!(shortcutName in _storage__WEBPACK_IMPORTED_MODULE_4__["default"].defaultKeybinds))
            throw new Error(`Shortcut '${shortcutName}' does not exist`);
        super();
        this.shortcutName = shortcutName;
        this.writeContent = writeContent;
    }
    writeRow(i) {
        const shortcutPair = _storage__WEBPACK_IMPORTED_MODULE_4__["default"].keybinds[this.shortcutName][i];
        if (!shortcutPair)
            return new DocumentFragment();
        const [keybind, args] = shortcutPair;
        const container = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Listing();
        container.addStyle("display: flex;");
        // left div
        const leftDiv = (0,_base_menu_stringtohtml__WEBPACK_IMPORTED_MODULE_1__.elementFromString)(`<div></div>`);
        const p = (0,_base_menu_stringtohtml__WEBPACK_IMPORTED_MODULE_1__.elementFromString)(`<p style="text-indent: 0px;"></p>`);
        leftDiv.appendChild(p);
        // if (i !== 0) leftDiv.appendChild(new Base.Text("📋&nbsp;").write());
        for (const frag of this.writeContent(shortcutPair[2])) {
            p.appendChild(frag);
        }
        // right div
        const rightDiv = (0,_base_menu_stringtohtml__WEBPACK_IMPORTED_MODULE_1__.elementFromString)(`<div style="text-align: right; padding-left: 16px; margin-left: auto; flex: 1 0 auto;"></div>`);
        const keybindDisplay = (0,_base_menu_stringtohtml__WEBPACK_IMPORTED_MODULE_1__.elementFromString)(`
                <div
                    class="smallFancyButton"
                    style="display: inline; padding-right: 8px; font-size: 12px; vertical-align: middle; pointer-events: none;">
                    ${keybind != null ? _keybind__WEBPACK_IMPORTED_MODULE_3__["default"].prototype.toString.call(keybind) : "Not set"}
                </div>
            `);
        rightDiv.appendChild(keybindDisplay);
        const editButton = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Button("✎");
        editButton.addStyle("width: 10px; padding: 4px 5px; text-align: center;");
        editButton.triggerCallback.attach(() => (0,_ui__WEBPACK_IMPORTED_MODULE_5__.showShortcutEditor)(shortcutPair));
        rightDiv.appendChild(editButton.write());
        if (_storage__WEBPACK_IMPORTED_MODULE_4__["default"].prefs.runButtons) {
            const run = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Button("▶");
            run.addStyle("width: 10px; padding: 4px 5px; text-align: center;");
            run.triggerCallback.attach(() => _actions_actions__WEBPACK_IMPORTED_MODULE_0__["default"][this.shortcutName].apply(undefined, shortcutPair[2]));
            rightDiv.appendChild(run.write());
        }
        if (_storage__WEBPACK_IMPORTED_MODULE_4__["default"].prefs.advanced) {
            const order = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.NumberInput(-99, 99);
            order.value._ = shortcutPair[1];
            order.triggerCallback.attach(() => (shortcutPair[1] = order.value._));
            order.addStyle("margin-right: 4px;");
            rightDiv.appendChild(order.write());
            if (i === 0) {
                // original shortcut, duplicate button
                const duplicateButton = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Button("＋");
                duplicateButton.addStyle("width: 12px; padding: 4px 5px; text-align: center;");
                duplicateButton.triggerCallback.attach(() => _storage__WEBPACK_IMPORTED_MODULE_4__["default"].keybinds[this.shortcutName].splice(1, 0, [
                    null,
                    _storage__WEBPACK_IMPORTED_MODULE_4__["default"].defaultKeybinds[this.shortcutName][0][1],
                    [..._storage__WEBPACK_IMPORTED_MODULE_4__["default"].defaultKeybinds[this.shortcutName][0][2]],
                ]));
                rightDiv.appendChild(duplicateButton.write());
            }
            else {
                // duplicated shortcut, remove button
                const removeButton = new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Button("－");
                removeButton.addStyle("width: 12px; padding: 4px 5px; text-align: center;");
                removeButton.triggerCallback.attach(() => {
                    _storage__WEBPACK_IMPORTED_MODULE_4__["default"].keybinds[this.shortcutName][i] = null;
                    if (i === _storage__WEBPACK_IMPORTED_MODULE_4__["default"].keybinds[this.shortcutName].length - 1)
                        arrayTrimEnd(_storage__WEBPACK_IMPORTED_MODULE_4__["default"].keybinds[this.shortcutName]);
                });
                rightDiv.appendChild(removeButton.write());
            }
        }
        container.add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.WrapperComponent(leftDiv), new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.WrapperComponent(rightDiv));
        return container.write();
    }
    write() {
        const frag = new DocumentFragment();
        for (let i = 0; i < _storage__WEBPACK_IMPORTED_MODULE_4__["default"].keybinds[this.shortcutName].length; i++) {
            frag.appendChild(this.writeRow(i));
        }
        return frag;
    }
}
class TitleShortcut extends Shortcut {
    shortcutName;
    text;
    label;
    constructor(shortcutName, text, label, writeContent = () => []) {
        super(shortcutName, (params) => {
            const frag = new DocumentFragment();
            const div = (0,_base_menu_stringtohtml__WEBPACK_IMPORTED_MODULE_1__.elementFromString)("<div></div>");
            div.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Text(this.text).write());
            if (this.label)
                div.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_2__.Label(this.label).write());
            frag.appendChild(div);
            return [frag, ...writeContent(params)];
        });
        this.shortcutName = shortcutName;
        this.text = text;
        this.label = label;
    }
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _general__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _upgrades__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _buildings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _krumblor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _santa__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(14);
/* harmony import */ var _garden__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15);
/* harmony import */ var _market__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(16);
/* harmony import */ var _pantheon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(17);
/* harmony import */ var _grimoire__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(18);
/* harmony import */ var _cheats__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(19);
/* harmony import */ var _others__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(20);











function addPrefix(prefix, object) {
    const newObj = {};
    for (const key in object) {
        newObj[prefix + key] = object[key];
    }
    return newObj;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    ...addPrefix("general.", _general__WEBPACK_IMPORTED_MODULE_0__["default"]),
    ...addPrefix("upgrades.", _upgrades__WEBPACK_IMPORTED_MODULE_1__["default"]),
    ...addPrefix("buildings.", _buildings__WEBPACK_IMPORTED_MODULE_2__["default"]),
    ...addPrefix("krumblor.", _krumblor__WEBPACK_IMPORTED_MODULE_3__["default"]),
    ...addPrefix("santa.", _santa__WEBPACK_IMPORTED_MODULE_4__["default"]),
    ...addPrefix("garden.", _garden__WEBPACK_IMPORTED_MODULE_5__["default"]),
    ...addPrefix("market.", _market__WEBPACK_IMPORTED_MODULE_6__["default"]),
    ...addPrefix("pantheon.", _pantheon__WEBPACK_IMPORTED_MODULE_7__["default"]),
    ...addPrefix("grimoire.", _grimoire__WEBPACK_IMPORTED_MODULE_8__["default"]),
    ...addPrefix("cheats.", _cheats__WEBPACK_IMPORTED_MODULE_9__["default"]),
    ...addPrefix("others.", _others__WEBPACK_IMPORTED_MODULE_10__["default"]),
});


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _keybind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    autoclicker: (cps) => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("Shimmering veil [off]") && _storage__WEBPACK_IMPORTED_MODULE_3__["default"].prefs["protectVeil"]) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_2__.notify)("Shimmering veil is on");
            return;
        }
        if (_storage__WEBPACK_IMPORTED_MODULE_3__["default"].autoclickerInterval == null) {
            _storage__WEBPACK_IMPORTED_MODULE_3__["default"].callFromAutoClicker = true;
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ClickCookie(null, 0);
            _storage__WEBPACK_IMPORTED_MODULE_3__["default"].autoclickerInterval = setInterval(() => {
                _storage__WEBPACK_IMPORTED_MODULE_3__["default"].callFromAutoClicker = true;
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ClickCookie(null, 0);
            }, 1000 / cps);
            const keyUp = (e) => {
                for (const shortcutPair of _storage__WEBPACK_IMPORTED_MODULE_3__["default"].keybinds["general.autoclicker"]) {
                    if (shortcutPair && _keybind__WEBPACK_IMPORTED_MODULE_1__["default"].prototype.match.call(shortcutPair[0], e)) {
                        clearInterval(_storage__WEBPACK_IMPORTED_MODULE_3__["default"].autoclickerInterval);
                        _storage__WEBPACK_IMPORTED_MODULE_3__["default"].autoclickerInterval = null;
                        document.removeEventListener("keyup", keyUp);
                    }
                }
            };
            document.addEventListener("keyup", keyUp);
        }
    },
    clickGoldenCookie: (all, wrath) => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("Shimmering veil [off]") && _storage__WEBPACK_IMPORTED_MODULE_3__["default"].prefs["protectVeil"]) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_2__.notify)("Shimmering veil is on");
            return;
        }
        for (const shimmer of [..._aliases__WEBPACK_IMPORTED_MODULE_0__.Game.shimmers]) {
            if (shimmer.wrath != 1 || // is golden cookie
                wrath || // click wrath setting is on
                shimmer.force === "cookie storm drop" || // is cookie storm drop
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.shimmerTypes[shimmer.type].chain // is chain cookie
            ) {
                shimmer.pop();
                if (!all) {
                    return;
                }
            }
        }
    },
    clickFortuneCookie: () => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.TickerEffect && _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.TickerEffect.type === "fortune") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.tickerL.click();
        }
    },
    popWrinkler: (fattest) => {
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.wrinklers.some((wrinkler) => wrinkler.phase === 2)) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_2__.notify)("You don't have any wrinklers");
            return;
        }
        if (fattest) {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.wrinklers.reduce(function (highest, current) {
                return current.sucked > highest.sucked && (current.type === 0 || !_storage__WEBPACK_IMPORTED_MODULE_3__["default"].prefs["protectShiny"])
                    ? current
                    : highest;
            }, { sucked: -Infinity }).hp = -10;
        }
        else {
            // pop all
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.wrinklers.forEach((wrinkler) => {
                if (wrinkler.phase === 2 && (wrinkler.type === 0 || !_storage__WEBPACK_IMPORTED_MODULE_3__["default"].prefs["protectShiny"]))
                    wrinkler.hp = -10;
            });
        }
    },
    save: () => {
        _storage__WEBPACK_IMPORTED_MODULE_3__["default"].allowDefault = true;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.toSave = true;
    },
    exportSave: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ExportSave();
    },
    exportSaveToFile: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.FileSave();
    },
    exportSaveToClipboard: () => {
        navigator.clipboard.writeText(_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.WriteSave(1));
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Notify("Save exported to clipboard", "", undefined, true);
    },
    importSave: () => {
        _storage__WEBPACK_IMPORTED_MODULE_3__["default"].allowDefault = true;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ImportSave();
    },
    importSaveFromFile: () => {
        var input = document.createElement("input");
        input.type = "file";
        input.addEventListener("change", (e) => _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.FileLoad(e));
        input.click();
    },
    importSaveFromClipboard: async () => {
        const save = await navigator.clipboard.readText();
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.LoadSave(save)) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_2__.notify)("Invalid save string");
        }
    },
    ascend: (force, skipAnimation) => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.AscendTimer === 0) {
            if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.OnAscend) {
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Ascend(force);
                if (skipAnimation)
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.AscendTimer = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.AscendDuration;
            }
            else {
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Reincarnate(force);
                if (skipAnimation)
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ReincarnateTimer = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ReincarnateDuration;
            }
        }
    },
    options: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ShowMenu("prefs");
    },
    info: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ShowMenu("log");
    },
    stats: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ShowMenu("stats");
    },
});


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   notify: () => (/* binding */ notify),
/* harmony export */   showShortcutEditor: () => (/* binding */ showShortcutEditor)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _keybind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);




function notify(text) {
    if (_storage__WEBPACK_IMPORTED_MODULE_2__["default"].prefs["verbose"])
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Notify(text, "", undefined, 1.5);
}
function showShortcutEditor(shortcutPair) {
    const strPath = `Game.mods["${_storage__WEBPACK_IMPORTED_MODULE_2__["default"].id}"].exposed`;
    const pressedKeys = [];
    const capturedKeys = [];
    let currentKeybind = null;
    // keyboard input events
    _storage__WEBPACK_IMPORTED_MODULE_2__["default"].exposed.shortcutEditorKeyDown = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.metaKey) {
            (0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)("#shortcutEditorDisplay").textContent = "The Cmd key is not supported";
            currentKeybind = null;
            return;
        }
        if (e.repeat === true)
            return;
        if (!pressedKeys.includes(e.code))
            pressedKeys.push(e.code);
        capturedKeys.length = 0;
        capturedKeys.push(...pressedKeys);
        // display sorted input shortcut on prompt
        currentKeybind = new _keybind__WEBPACK_IMPORTED_MODULE_1__["default"](...capturedKeys);
        (0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)("#shortcutEditorDisplay").textContent = _keybind__WEBPACK_IMPORTED_MODULE_1__["default"].prototype.toString.call(currentKeybind);
    };
    _storage__WEBPACK_IMPORTED_MODULE_2__["default"].exposed.shortcutEditorKeyUp = function (e) {
        e.stopPropagation();
        e.preventDefault();
        // remove from pressed keys
        const index = pressedKeys.indexOf(e.code);
        if (index > -1)
            pressedKeys.splice(index, 1);
    };
    document.addEventListener("keydown", _storage__WEBPACK_IMPORTED_MODULE_2__["default"].exposed.shortcutEditorKeyDown, true);
    document.addEventListener("keyup", _storage__WEBPACK_IMPORTED_MODULE_2__["default"].exposed.shortcutEditorKeyUp, true);
    _storage__WEBPACK_IMPORTED_MODULE_2__["default"].exposed.shortcutEditorSave = function () {
        shortcutPair[0] = currentKeybind;
    };
    _storage__WEBPACK_IMPORTED_MODULE_2__["default"].exposed.shortcutEditorClear = function () {
        shortcutPair[0] = null;
    };
    currentKeybind = shortcutPair[0];
    const initialStr = shortcutPair[0] != null ? _keybind__WEBPACK_IMPORTED_MODULE_1__["default"].prototype.toString.call(shortcutPair[0]) : "&nbsp;";
    const prompt = `
        <noClose>
        <h3>Edit Keyboard Shortcut</h3>
        <div class="block" style="padding-bottom:15px;">
            Press desired key combination<br><br>
            <span id="shortcutEditorDisplay">${initialStr}</span>
        </div>
    `;
    const resetAndClose = `
        document.removeEventListener('keydown', ${strPath}.shortcutEditorKeyDown, true);
        document.removeEventListener('keyup', ${strPath}.shortcutEditorKeyUp, true);
        Game.ClosePrompt();
    `;
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Prompt(prompt, [
        ["Save", resetAndClose + `${strPath}.shortcutEditorSave(); Game.UpdateMenu();`, "float: right;"],
        ["Clear", resetAndClose + `${strPath}.shortcutEditorClear(); Game.UpdateMenu();`, "float: right;"],
        ["Cancel", resetAndClose, "float: right;"],
    ]);
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);


const seasonMap = {
    "Christmas": ["Festive biscuit", "christmas"],
    "Halloween": ["Ghostly biscuit", "halloween"],
    "Valentine's day": ["Lovesick biscuit", "valentines"],
    "Business day": ["Fool's biscuit", "fools"],
    "Easter": ["Bunny biscuit", "easter"],
    "Any season": [],
}; // season to biscuit name and season id
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    buyAll: () => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.storeBuyAll() === false) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have Inspired checklist unlocked yet");
        }
    },
    switchSeason: (action, season) => {
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.HasUnlocked("Season switcher")) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have Season switcher unlocked yet");
            return;
        }
        const [upgrade, seasonName] = seasonMap[season];
        if (upgrade !== undefined) {
            if (action === "Toggle") {
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades[upgrade].buy();
            }
            else if (action === "Switch on") {
                if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.season !== seasonName)
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades[upgrade].buy();
            }
            else if (action === "Switch off") {
                if (season !== "Any season") {
                    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.season === seasonName)
                        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades[upgrade].buy();
                }
            }
        }
        else if (action === "Switch off") {
            const upgrade = {
                "christmas": "Festive biscuit",
                "halloween": "Ghostly biscuit",
                "valentines": "Lovesick biscuit",
                "fools": "Fool's biscuit",
                "easter": "Bunny biscuit",
                "": null,
            }[_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.season];
            if (upgrade != null)
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades[upgrade].buy();
        }
    },
    goldenSwitch: (action) => {
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("Golden switch")) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have Golden switch unlocked yet");
            return;
        }
        if (action === "Toggle") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Golden switch [off]"].buy() || _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Golden switch [on]"].buy();
        }
        else if (action === "Switch on") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Golden switch [off]"].buy();
        }
        else if (action === "Switch off") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Golden switch [on]"].buy();
        }
    },
    shimmeringVeil: (action) => {
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("Shimmering veil")) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have Shimmering veil unlocked yet");
            return;
        }
        if (action === "Toggle") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Shimmering veil [off]"].buy() || _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Shimmering veil [on]"].buy();
        }
        else if (action === "Switch on") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Shimmering veil [off]"].buy();
        }
        else if (action === "Switch off") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Shimmering veil [on]"].buy();
        }
    },
    sugarFrenzy: (force) => {
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("Sugar craving")) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have Sugar craving unlocked yet");
            return;
        }
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("Sugar frenzy")) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You already activated a Sugar frenzy this acension");
            return;
        }
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Sugar frenzy"].canBuy()) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You can't afford Sugar frenzy");
            return;
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Upgrades["Sugar frenzy"].buy();
        if (force)
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ConfirmPrompt();
    },
});


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);


const buildingIndexMap = [
    "Cursor",
    "Grandma",
    "Farm",
    "Mine",
    "Factory",
    "Bank",
    "Temple",
    "Wizard tower",
    "Shipment",
    "Alchemy lab",
    "Portal",
    "Time machine",
    "Antimatter condenser",
    "Prism",
    "Chancemaker",
    "Fractal engine",
    "Javascript console",
    "Idleverse",
    "Cortex baker",
    "You",
    "All buildings",
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    building: (actionStr, amountStr, amountCustom, building, over) => {
        const buy = actionStr.startsWith("Buy");
        const untilHave = actionStr.endsWith("until have");
        let buildingObj;
        let amount;
        const oldBuyMode = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyMode;
        const oldBulk = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyBulk;
        if (amountStr === "Max" || amountStr === "All") {
            amount = 9999;
            over = true;
        }
        else {
            // concrete number
            if (amountStr === "Custom")
                amount = amountCustom;
            else
                amount = parseInt(amountStr);
        }
        if (building !== "All buildings") {
            buildingObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects[building];
            if (untilHave) {
                if (amount === buildingObj.amount) {
                    (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You have enough buildings");
                    return;
                }
                if (buy) {
                    amount = amount - buildingObj.amount;
                    if (amount <= 0) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You have more than enough buildings");
                        return;
                    }
                }
                else if (!buy) {
                    amount = buildingObj.amount - amount;
                    if (amount <= 0) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You have less than enough buildings");
                        return;
                    }
                }
            }
            if (buy) {
                if (!over && _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies < buildingObj.getSumPrice(amount)) {
                    (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough cookies to buy buildings");
                    return;
                }
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyMode = 1;
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyBulk = amount;
                buildingObj.buy();
            }
            else {
                if (!over && buildingObj.amount < amount) {
                    (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough buildings to sell");
                    return;
                }
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyMode = -1;
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyBulk = amount;
                buildingObj.sell();
            }
        }
        else {
            const amountMap = {};
            for (const buildingName_ in _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects) {
                const buildingName = buildingName_;
                if (!untilHave)
                    amountMap[buildingName] = amount;
                else if (buy)
                    amountMap[buildingName] = amount - _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects[buildingName].amount;
                else
                    amountMap[buildingName] = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects[buildingName].amount - amount;
            }
            if (buy) {
                if (!over) {
                    let totalPrice = 0;
                    for (const [buildingName, amount] of Object.entries(amountMap)) {
                        totalPrice += _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects[buildingName].getSumPrice(amount);
                    }
                    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies < totalPrice) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough cookies to buy buildings");
                        return;
                    }
                }
                // distribute cookies among buildings evenly by looping through and buying 1 of each building repeatedly
                while (true) {
                    let bought = false;
                    for (const [buildingName, amount] of Object.entries(amountMap)) {
                        if (amount <= 0)
                            continue;
                        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyMode = 1;
                        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyBulk = 1;
                        buildingObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects[buildingName];
                        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies >= buildingObj.price) {
                            buildingObj.buy();
                            bought = true;
                            amountMap[buildingName]--;
                        }
                    }
                    if (!bought)
                        break; // break when cannot buy any building at all
                }
            }
            else {
                if (!over) {
                    for (const [buildingName, amount] of Object.entries(amountMap)) {
                        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects[buildingName].amount < amount) {
                            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough buildings to sell");
                            return;
                        }
                    }
                }
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyMode = -1;
                for (const [buildingName, amount] of Object.entries(amountMap)) {
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyBulk = amount;
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects[buildingName].sell();
                }
            }
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyMode = oldBuyMode;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.buyBulk = oldBulk;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.storeToRefresh = 1;
    },
});


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _applydecorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);




const auraLevelRequiredMap = {
    "No aura": 0,
    "Breath of Milk": 5,
    "Dragon Cursor": 6,
    "Elder Battalion": 7,
    "Reaper of Fields": 8,
    "Earth Shatterer": 9,
    "Master of the Armory": 10,
    "Fierce Hoarder": 11,
    "Dragon God": 12,
    "Arcane Aura": 13,
    "Dragonflight": 14,
    "Ancestral Metamorphosis": 15,
    "Unholy Dominion": 16,
    "Epoch Manipulator": 17,
    "Mind Over Matter": 18,
    "Radiant Appetite": 19,
    "Dragon's Fortune": 20,
    "Dragon's Curve": 21,
    "Reality Bending": 22,
    "Dragon Orbs": 23,
    "Supreme Intellect": 24,
    "Dragon Guts": 25,
};
const krumblor = {
    setAura: (aura, slot) => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.hasAura(aura) && aura !== "No aura")
            return;
        const levelRequired = auraLevelRequiredMap[aura];
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.dragonLevel < levelRequired) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)(`You don't have the aura ${aura} unlocked yet`);
            return;
        }
        if (slot == true && _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.dragonLevel < 27) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have secondary auras unlocked yet");
            return;
        }
        const auraIndex = Object.keys(auraLevelRequiredMap).indexOf(aura);
        let oldTab = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab;
        if (oldTab !== "dragon") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab = "dragon";
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(1);
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.SetDragonAura(auraIndex, slot);
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ConfirmPrompt();
        if (oldTab !== "dragon")
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(0);
        if (oldTab !== "") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab = oldTab;
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(1);
        }
    },
    upgrade: () => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.dragonLevels[_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.dragonLevel].cost === undefined) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Krumblor is fully upgraded");
            return;
        }
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.dragonLevels[_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.dragonLevel].cost()) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough resources to upgrade Krumblor");
            return;
        }
        let oldTab = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab;
        if (oldTab !== "dragon") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab = "dragon";
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(1);
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.UpgradeDragon();
        if (oldTab !== "dragon")
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(0);
        if (oldTab !== "") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab = oldTab;
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(1);
        }
    },
    pet: () => {
        if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("Pet the dragon")) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have Pet the dragon unlocked yet");
            return;
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab = "dragon";
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(1);
        (0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)("#specialPic").click();
    },
};
(0,_applydecorator__WEBPACK_IMPORTED_MODULE_2__["default"])(krumblor, (target) => (...args) => {
    if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("How to bake your dragon")) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have How to bake your dragon unlocked yet");
        return;
    }
    if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("A crumbly egg")) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have A crumbly egg unlocked yet");
        return;
    }
    return target(...args);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (krumblor);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ applyDecorator)
/* harmony export */ });
// apply decorator to all methods in object
function applyDecorator(object, decorator) {
    let shortcutName;
    for (shortcutName in object) {
        if (!(object[shortcutName] instanceof Function))
            continue;
        const oldFunc = object[shortcutName];
        object[shortcutName] = decorator(oldFunc).bind(object);
    }
    return object;
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _applydecorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);



const santa = {
    upgrade: () => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.santaLevel >= 14) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Santa is fully upgraded");
            return;
        }
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies < Math.pow(_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.santaLevel + 1, _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.santaLevel + 1)) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough resources to upgrade Santa");
            return;
        }
        let oldTab = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab;
        if (oldTab !== "santa") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab = "santa";
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(1);
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.UpgradeSanta();
        if (oldTab !== "santa")
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(0);
        if (oldTab !== "") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.specialTab = oldTab;
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.ToggleSpecialMenu(1);
        }
    },
};
(0,_applydecorator__WEBPACK_IMPORTED_MODULE_2__["default"])(santa, (target) => (...args) => {
    if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Has("A festive hat")) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have A festive hat unlocked yet");
        return;
    }
    return target(...args);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (santa);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _applydecorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);




const plantIndexes = [
    "Baker's wheat",
    "Thumbcorn",
    "Cronerice",
    "Gildmillet",
    "Ordinary clover",
    "Golden clover",
    "Shimmerlily",
    "Elderwort",
    "Bakeberry",
    "Chocoroot",
    "White chocoroot",
    "White mildew",
    "Brown mold",
    "Meddleweed",
    "Whiskerbloom",
    "Chimerose",
    "Nursetulip",
    "Drowsyfern",
    "Wardlichen",
    "Keenmoss",
    "Queenbeet",
    "Juicy queenbeet",
    "Duketater",
    "Crumbspore",
    "Doughshroom",
    "Glovemorel",
    "Cheapcap",
    "Fool's bolete",
    "Wrinklegill",
    "Green rot",
    "Shriekbulb",
    "Tidygrass",
    "Everdaisy",
    "Ichorpuff",
    "Any plant",
];
const soilRequiredFarmsMap = {
    "Dirt": 0,
    "Fertilizer": 50,
    "Clay": 100,
    "Pebbles": 200,
    "Wood chips": 300,
};
function harvestOne(plant, tileRow, tileCol, mature, mortal) {
    const [minCol, minRow] = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plotLimits[Math.min(_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Farm"].level - 1, 8)];
    const x = minCol + tileCol - 1;
    const y = minRow + tileRow - 1;
    const tile = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plot[y][x];
    if (tile[0] === 0)
        return;
    const plantObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plantsById[tile[0] - 1];
    if (!(plant === "Any plant" || plant === plantObj.name))
        return;
    if (mortal && plantObj.immortal)
        return;
    if (mature && tile[1] < plantObj.mature)
        return;
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.harvest(x, y, true);
    setTimeout(function () {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.w.PlaySound("snd/harvest1.mp3", 1, 0.2);
    }, 50);
}
function harvestAll(plant, mature, mortal) {
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.harvestAll(_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plantsById[plantIndexes.indexOf(plant)], mature, mortal);
}
function plantOne(plant, tileRow, tileCol, harvestExisting) {
    const [minCol, minRow] = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plotLimits[Math.min(_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Farm"].level - 1, 8)];
    const x = minCol + tileCol - 1;
    const y = minRow + tileRow - 1;
    const plantIndex = plantIndexes.indexOf(plant);
    if (!_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.canPlant(_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plantsById[plantIndex])) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough cookies to plant seed");
        return;
    }
    const tile = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plot[y][x];
    if (tile[0] !== 0) {
        if (harvestExisting)
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.harvest(x, y, true);
        else
            return;
    }
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.seedSelected = plantIndex;
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.clickTile(x, y);
}
function plantAll(plant, harvestExisting) {
    const plantIndex = plantIndexes.indexOf(plant);
    // search phase
    let emptyTileCount = 0;
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.isTileUnlocked(x, y)) {
                const tile = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plot[y][x];
                if (tile[0] === 0) {
                    emptyTileCount++;
                }
            }
        }
    }
    const price = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.getCost(_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plantsById[plantIndex]) * emptyTileCount;
    if (price > _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough cookies to plant seed");
        return;
    }
    // harvest/plant phase
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.isTileUnlocked(x, y)) {
                const tile = _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plot[y][x];
                if (tile[0] === 0 || harvestExisting) {
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.harvest(x, y, true);
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.seedSelected = plantIndex;
                    _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.clickTile(x, y);
                }
            }
        }
    }
}
const garden = {
    seed: (harvest, one, plant, tileRow, tileCol, mature, mortal, harvestExisting) => {
        if (harvest) {
            if (one)
                harvestOne(plant, tileRow, tileCol, mature, mortal);
            else
                harvestAll(plant, mature, mortal);
        }
        else {
            if (one)
                plantOne(plant, tileRow, tileCol, harvestExisting);
            else
                plantAll(plant, harvestExisting);
        }
    },
    freeze: (action) => {
        if (action === "Toggle" ||
            (action === "Switch on" && !_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.freeze) ||
            (action === "Switch off" && _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.freeze)) {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.tools.freeze.func.call((0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)("#gardenTool-2"));
        }
    },
    changeSoil: (soil) => {
        const requiredFarms = soilRequiredFarmsMap[soil];
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Farm"].amount < requiredFarms) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have this soil unlocked");
            return;
        }
        const soilIndex = ["Dirt", "Fertilizer", "Clay", "Pebbles", "Wood chips"].indexOf(soil);
        if (new Date().getTime() < _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.nextSoil) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Soil changing is on cooldown");
            return;
        }
        (0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)(`#gardenSoil-${soilIndex}`).click();
    },
    convert: (force) => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plantsUnlockedN < _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.plantsN) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have all seeds discovered");
            return;
        }
        if (!force)
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.askConvert();
        else
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Garden.convert();
    },
};
(0,_applydecorator__WEBPACK_IMPORTED_MODULE_2__["default"])(garden, (target) => (...args) => {
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Farm"].level < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have the Garden unlocked yet");
        return;
    }
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Farm"].amount < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have any Farms");
        return;
    }
    return target(...args);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (garden);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _applydecorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);




function buyGood(goodObj, amount) {
    const success = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.buyGood(goodObj.id, amount);
    if (success) {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.hoverOnGood = goodObj.id;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.toRedraw = 2;
    }
    return success;
}
function sellGood(goodObj, amount) {
    const success = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.sellGood(goodObj.id, amount);
    if (success) {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.hoverOnGood = goodObj.id;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.toRedraw = 2;
    }
    return success;
}
function calcGoodPrice(goodObj) {
    const costIn$ = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.getGoodPrice(goodObj);
    const cost = _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookiesPsRawHighest * costIn$;
    const overhead = 1 + 0.01 * (20 * Math.pow(0.95, _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.brokers));
    return cost * overhead;
}
const goodIndexMap = [
    "CRL",
    "CHC",
    "BTR",
    "SUG",
    "NUT",
    "SLT",
    "VNL",
    "EGG",
    "CNM",
    "CRM",
    "JAM",
    "WCH",
    "HNY",
    "CKI",
    "RCP",
    "SBD",
    "PBL",
    "YOU",
];
const loanMap = {
    "1st loan": "bankLoan1",
    "2nd loan": "bankLoan2",
    "3rd loan": "bankLoan3",
};
const loanBuffMap = {
    "1st loan": "Loan 1",
    "2nd loan": "Loan 2",
    "3rd loan": "Loan 3",
};
const loanOfficeLevelRequired = {
    "1st loan": 2,
    "2nd loan": 4,
    "3rd loan": 5,
};
const market = {
    good: (actionStr, amountStr, amountCustom, good, overbuy) => {
        const buy = actionStr.startsWith("Buy");
        const untilHave = actionStr.endsWith("until have");
        let goodObj;
        let amount;
        if (amountStr === "Max" || amountStr === "All") {
            amount = 9999;
            overbuy = true;
        }
        else {
            // concrete number
            if (amountStr === "Custom")
                amount = amountCustom;
            else
                amount = parseInt(amountStr);
        }
        if (good !== "All stocks") {
            goodObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.goodsById[goodIndexMap.indexOf(good)];
            if (goodObj.building.amount <= 0) {
                (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have the building for this stock");
                return;
            }
            if (untilHave) {
                if (amount === goodObj.stock) {
                    (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You have enough stocks");
                    return;
                }
                if (buy) {
                    amount = amount - goodObj.stock;
                    if (amount <= 0) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You have more than enough stocks");
                        return;
                    }
                }
                else if (!buy) {
                    amount = goodObj.stock - amount;
                    if (amount <= 0) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You have less than enough stocks");
                        return;
                    }
                }
            }
            const maxStock = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.getGoodMaxStock(goodObj);
            if (amount + goodObj.stock > maxStock)
                amount = maxStock - goodObj.stock; // cap amount at max goods you can buy
            if (buy) {
                if (goodObj.last === 2) {
                    (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You cannot buy and sell the same stock in the same tick");
                    return;
                }
                // buy n amount of one good
                if (!buyGood(goodObj, amount)) {
                    // buy as many as possible if unable to buy desired amount
                    if (overbuy || amountStr === "Max") {
                        buyGood(goodObj, Math.floor(_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies / calcGoodPrice(goodObj)));
                    }
                    else {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough cookies to buy stock");
                    }
                }
            }
            else {
                if (goodObj.last === 1) {
                    (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You cannot buy and sell the same stock in the same tick");
                    return;
                }
                // sell n amount of one good
                sellGood(goodObj, amount);
            }
        }
        else {
            const amountMap = {};
            for (const goodSymbol of goodIndexMap) {
                goodObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.goodsById[goodIndexMap.indexOf(goodSymbol)];
                if (goodObj.building.amount <= 0)
                    continue;
                if (!untilHave)
                    amountMap[goodSymbol] = amount;
                else if (buy)
                    amountMap[goodSymbol] = amount - goodObj.stock;
                else
                    amountMap[goodSymbol] = goodObj.stock - amount;
            }
            if (buy) {
                for (const goodObj of Object.values(_aliases__WEBPACK_IMPORTED_MODULE_0__.Market.goods)) {
                    if (goodObj.last === 2) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You cannot buy and sell the same stock in the same tick");
                        return;
                    }
                }
                // buy n amount of all goods
                if (!overbuy) {
                    let totalPrice = 0;
                    for (const [goodName, amount] of Object.entries(amountMap)) {
                        totalPrice +=
                            calcGoodPrice(_aliases__WEBPACK_IMPORTED_MODULE_0__.Market.goodsById[goodIndexMap.indexOf(goodName)]) * amount;
                    }
                    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies < totalPrice) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough cookies to buy stock");
                        return;
                    }
                }
                // distribute cookies among stocks evenly by looping through and buying 1 of each stock repeatedly
                while (true) {
                    let bought = false;
                    for (const [goodName, amount] of Object.entries(amountMap)) {
                        if (amount <= 0)
                            continue;
                        goodObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.goodsById[goodIndexMap.indexOf(goodName)];
                        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies >= calcGoodPrice(goodObj)) {
                            buyGood(goodObj, 1);
                            bought = true;
                            amountMap[goodName]--;
                        }
                    }
                    if (!bought)
                        return; // return when cannot buy any building at all
                }
            }
            else {
                for (const goodObjLoop of Object.values(_aliases__WEBPACK_IMPORTED_MODULE_0__.Market.goods)) {
                    if (goodObjLoop.last === 1) {
                        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You cannot buy and sell the same stock in the same tick");
                        return;
                    }
                }
                // sell n amount of all goods
                for (const [goodName, amount] of Object.entries(amountMap)) {
                    goodObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.goodsById[goodIndexMap.indexOf(goodName)];
                    sellGood(goodObj, amount);
                }
            }
        }
    },
    loan: (loan) => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Market.officeLevel < loanOfficeLevelRequired[loan]) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have this loan unlocked yet");
            return;
        }
        const loanBuff = loanBuffMap[loan];
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.hasBuff(loanBuff) || _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.hasBuff(loanBuff + " (interest)")) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You're already taking this loan");
            return;
        }
        (0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)(`#${loanMap[loan]}`).click();
    },
    hireBroker: () => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Market.brokers >= _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.getMaxBrokers()) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You already have the maximum amount of brokers");
            return;
        }
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies < _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.getBrokerPrice()) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough cookies to buy a broker");
            return;
        }
        (0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)("#bankBrokersBuy").click();
    },
    upgradeOffice: () => {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Market.officeLevel >= 5) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Your offices are at max level");
            return;
        }
        const office = _aliases__WEBPACK_IMPORTED_MODULE_0__.Market.offices[_aliases__WEBPACK_IMPORTED_MODULE_0__.Market.officeLevel];
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Cursor"].level < office.cost[1]) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have the required Cursor level");
            return;
        }
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Cursor"].amount < office.cost[0]) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have enough Cursors");
            return;
        }
        (0,_aliases__WEBPACK_IMPORTED_MODULE_0__.$)("#bankOfficeUpgrade").click();
    },
};
(0,_applydecorator__WEBPACK_IMPORTED_MODULE_2__["default"])(market, (target) => (...args) => {
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Bank"].level < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have the Stock Market unlocked yet");
        return;
    }
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Bank"].amount < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have any Banks");
        return;
    }
    return target(...args);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (market);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _applydecorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);



const godIndexMap = [
    "Holobore",
    "Vomitrax",
    "Godzamok",
    "Cyclius",
    "Selebrak",
    "Dotjeiess",
    "Muridal",
    "Jeremy",
    "Mokalsium",
    "Skruuia",
    "Rigidel",
];
const slotIndexMap = ["Diamond", "Ruby", "Jade"];
function slot(god, to, ifOccupied) {
    const godObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.godsById[godIndexMap.indexOf(god)];
    const slot = slotIndexMap.indexOf(to);
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slot[slot] !== -1) {
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slot[slot] === godObj.id)
            return;
        if (ifOccupied === "Cancel") {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("That slot is already occupied by another god");
            return;
        }
        else if (ifOccupied === "Unslot") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dragging = _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.godsById[_aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slot[slot]];
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slotHovered = -1;
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dropGod();
        }
    }
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dragging = godObj;
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slotHovered = slot;
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dropGod();
    _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slotHovered = -1;
}
function unslot(god, from) {
    if (god !== "Any god") {
        const godId = godIndexMap.indexOf(god);
        const godObj = _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.godsById[godId];
        if (from !== "Any slot" && _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slot[slotIndexMap.indexOf(from)] !== godId) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Cannot find god at slot");
            return;
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dragging = godObj;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slotHovered = -1;
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dropGod();
    }
    else if (from !== "Any slot") {
        const slot = slotIndexMap.indexOf(from);
        const godId = _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slot[slot];
        if (godId !== -1) {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dragging = _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.godsById[godId];
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slotHovered = -1;
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dropGod();
        }
    }
    else {
        for (const godId of _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slot) {
            if (godId !== -1) {
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dragging = _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.godsById[godId];
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.slotHovered = -1;
                _aliases__WEBPACK_IMPORTED_MODULE_0__.Pantheon.dropGod();
            }
        }
    }
}
const pantheon = {
    slot: (toSlot, god, to, ifOccupied, from) => {
        if (toSlot && god !== "Any god") {
            slot(god, to, ifOccupied);
        }
        else if (!toSlot) {
            unslot(god, from);
        }
        else {
            throw new Error("Invalid arguments");
        }
    },
};
(0,_applydecorator__WEBPACK_IMPORTED_MODULE_2__["default"])(pantheon, (target) => (...args) => {
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Temple"].level < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have the Pantheon unlocked yet");
        return;
    }
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Temple"].amount < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have any Temples");
        return;
    }
    return target(...args);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pantheon);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _applydecorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);



const spellIndexMap = [
    "Conjure Baked Goods",
    "Force the Hand of Fate",
    "Stretch Time",
    "Spontaneous Edifice",
    "Haggler's Charm",
    "Summon Crafty Pixies",
    "Gambler's Fever Dream",
    "Resurrect Abomination",
    "Diminish Ineptitude",
];
const grimoire = {
    cast: (spell) => {
        const spellId = spellIndexMap.indexOf(spell);
        if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Grimoire.getSpellCost(_aliases__WEBPACK_IMPORTED_MODULE_0__.Grimoire.spellsById[spellId]) > _aliases__WEBPACK_IMPORTED_MODULE_0__.Grimoire.magic) {
            (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("Not enough magic to cast this spell");
            return;
        }
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Grimoire.castSpell(_aliases__WEBPACK_IMPORTED_MODULE_0__.Grimoire.spellsById[spellId]);
    },
};
(0,_applydecorator__WEBPACK_IMPORTED_MODULE_2__["default"])(grimoire, (target) => (...args) => {
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Wizard tower"].level < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have Grimoire unlocked yet");
        return;
    }
    if (_aliases__WEBPACK_IMPORTED_MODULE_0__.Game.Objects["Wizard tower"].amount < 1) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have any Wizard towers");
        return;
    }
    return target(...args);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (grimoire);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _menu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _applydecorator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);




const cheats = {
    cookies: (action, amount) => {
        if (action === "Gain") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies += amount;
        }
        else if (action === "Set to") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.cookies = amount;
        }
    },
    lumps: (action, amount) => {
        if (action === "Gain") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.lumps += amount;
        }
        else if (action === "Set to") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.lumps = amount;
        }
    },
    heavenlyChips: (action, amount) => {
        if (action === "Gain") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.heavenlyChips += amount;
        }
        else if (action === "Set to") {
            _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.heavenlyChips = amount;
        }
    },
    openSesame: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.OpenSesame();
    },
    ruinTheFun: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.RuinTheFun();
    },
    party: () => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.PARTY = true;
    },
};
(0,_applydecorator__WEBPACK_IMPORTED_MODULE_3__["default"])(cheats, (target) => (...args) => {
    if (!_storage__WEBPACK_IMPORTED_MODULE_2__["default"].prefs.cheats) {
        (0,_menu_ui__WEBPACK_IMPORTED_MODULE_1__.notify)("You don't have cheats enabled");
        return;
    }
    return target(...args);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cheats);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    wipeSave: (force) => {
        _aliases__WEBPACK_IMPORTED_MODULE_0__.Game.HardReset(force ? 2 : 0);
    },
});


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   elementFromString: () => (/* binding */ elementFromString),
/* harmony export */   fragmentFromString: () => (/* binding */ fragmentFromString)
/* harmony export */ });
function fragmentFromString(str) {
    const template = document.createElement("template");
    template.innerHTML = str.trim();
    return template.content;
}
function elementFromString(str) {
    const template = document.createElement("template");
    template.innerHTML = str.trim();
    const element = template.content.firstChild;
    if (!(element instanceof HTMLElement))
        throw new Error(`Invalid html string '${str}'`);
    return element;
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button),
/* harmony export */   Collapsible: () => (/* binding */ Collapsible),
/* harmony export */   Dropdown: () => (/* binding */ Dropdown),
/* harmony export */   Label: () => (/* binding */ Label),
/* harmony export */   Listing: () => (/* binding */ Listing),
/* harmony export */   NumberInput: () => (/* binding */ NumberInput),
/* harmony export */   OnOffButton: () => (/* binding */ OnOffButton),
/* harmony export */   Slider: () => (/* binding */ Slider),
/* harmony export */   StaticHTMLComponent: () => (/* binding */ StaticHTMLComponent),
/* harmony export */   Text: () => (/* binding */ Text),
/* harmony export */   ToggleButton: () => (/* binding */ ToggleButton),
/* harmony export */   WrapperComponent: () => (/* binding */ WrapperComponent),
/* harmony export */   css: () => (/* binding */ css)
/* harmony export */ });
/* harmony import */ var _stringtohtml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _componentbase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);


const w = window;
let css = "";
function tickSound() {
    w.PlaySound("snd/tick.mp3");
}
function updateMenu() {
    w.Game.UpdateMenu.call(w.Game);
}
class WrapperComponent extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    frag;
    constructor(value) {
        super();
        if (value instanceof DocumentFragment) {
            this.frag = value;
        }
        else if (value instanceof HTMLElement) {
            this.frag = new DocumentFragment();
            this.frag.appendChild(value);
        }
        else if (typeof value === "string") {
            this.frag = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.fragmentFromString)(value);
        }
        else {
            throw new Error(`Invalid argument '${value}'`);
        }
    }
    write() {
        return this.frag;
    }
}
class StaticHTMLComponent extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    str;
    constructor(str) {
        super();
        this.str = str;
    }
    write() {
        return (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.fragmentFromString)(this.str);
    }
}
// grouping components
class Listing extends StaticHTMLComponent {
    constructor() {
        super(`<div set-element set-container class="listing"></div>`);
    }
}
class Collapsible extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    text;
    size;
    static {
        css += `
            .collapsibleButton {
                cursor: pointer;
                display: inline-block;
                height: 14px;
                width: 14px;
                border-radius: 7px;
                text-align: center;
                background-color: rgb(192, 192, 192);
                color: black;
                font-size: 13px;
                vertical-align: middle;
            }
        `;
    }
    value;
    constructor(text, size = 16) {
        super();
        this.text = text;
        this.size = size;
        this.value = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.ValueModule(true);
    }
    triggerCallbackFunc() {
        this.value._ = !this.value._;
        updateMenu();
        tickSound();
    }
    write() {
        const frag = new DocumentFragment();
        const header = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`
            <div set-id class="title" style="font-size: ${this.size}px; margin-bottom: 0px;">
                ${this.text}
            </div>
        `);
        const button = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<span class="collapsibleButton">${this.value._ ? "-" : "+"}</span>`);
        button.addEventListener("click", this.triggerCallbackFunc.bind(this));
        header.appendChild(button);
        const collapsible = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)("<div set-class set-style set-container></div>");
        if (!this.value._)
            collapsible.style.cssText += "display: none !important;";
        frag.appendChild(header);
        frag.appendChild(collapsible);
        return frag;
    }
}
// standalone components
class Text extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    text;
    size;
    constructor(text, size = 14) {
        super();
        this.text = text;
        this.size = size;
    }
    write() {
        return (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.fragmentFromString)(`
            <div set-element style="display: inline-block; font-size: ${this.size}px; vertical-align: middle;">${this.text}</div>
        `);
    }
}
class Label extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    text;
    constructor(text) {
        super();
        this.text = text;
    }
    write() {
        return (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.fragmentFromString)(`<label set-element>${this.text}</label>`);
    }
}
class Button extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    text;
    active;
    enabled;
    triggerCallback = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.CallbackModule();
    constructor(text, active = true, enabled = true) {
        super();
        this.text = text;
        this.active = active;
        this.enabled = enabled;
    }
    triggerCallbackFunc() {
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }
    write() {
        const button = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<a set-element class="smallFancyButton option">${this.text}</a>`);
        if (!this.active)
            button.classList.add("off");
        if (this.enabled) {
            button.addEventListener("click", this.triggerCallbackFunc.bind(this));
        }
        else {
            button.disabled = true;
        }
        const frag = new DocumentFragment();
        frag.appendChild(button);
        return frag;
    }
}
class ToggleButton extends Button {
    texts;
    active;
    enabled;
    value;
    triggerCallbackFunc() {
        this.value._ = (this.value._ + 1) % this.texts.length;
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }
    constructor(texts, active = true, enabled = true) {
        super(texts[0], active, enabled);
        this.texts = texts;
        this.active = active;
        this.enabled = enabled;
        this.value = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.ValueModule(0);
    }
    write() {
        this.text = this.texts[this.value._];
        return super.write();
    }
}
class OnOffButton extends Button {
    labelText;
    enabled;
    value;
    triggerCallbackFunc() {
        this.value._ = !this.value._;
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }
    constructor(labelText, enabled = true) {
        super(labelText + ( false ? 0 : w.OFF), false, enabled);
        this.labelText = labelText;
        this.enabled = enabled;
        this.value = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.ValueModule(false);
    }
    write() {
        this.text = this.labelText + (this.value._ ? w.ON : w.OFF);
        this.active = Boolean(this.value._);
        return super.write();
    }
}
class Dropdown extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    options;
    altValues;
    enabled;
    triggerCallback = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.CallbackModule();
    value;
    constructor(options, altValues, enabled = true) {
        super();
        this.options = options;
        this.altValues = altValues;
        this.enabled = enabled;
        this.value = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.ValueModule(this.altValues?.[0] ?? this.options[0]);
    }
    triggerCallbackFunc() {
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }
    write() {
        const frag = new DocumentFragment();
        const dropdown = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<select set-element></select>`);
        if (this.enabled) {
            dropdown.addEventListener("change", () => {
                this.value._ = dropdown.value;
                this.triggerCallbackFunc.call(this);
            });
        }
        else {
            dropdown.disabled = true;
        }
        if (!(this.altValues ?? this.options).includes(this.value._))
            this.value._ = this.altValues?.[0] ?? this.options[0];
        for (const [i, option] of this.options.entries()) {
            dropdown.appendChild((0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`
                    <option
                        value="${this.altValues?.[i] ?? option}"
                        ${this.value._ === (this.altValues?.[i] ?? option) ? "selected" : ""}>
                        ${option}
                    </option>
                `));
        }
        frag.appendChild(dropdown);
        return frag;
    }
}
class NumberInput extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    min;
    max;
    wholeNumber;
    enabled;
    triggerCallback = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.CallbackModule();
    value;
    constructor(min, max, wholeNumber = true, enabled = true) {
        super();
        this.min = min;
        this.max = max;
        this.wholeNumber = wholeNumber;
        this.enabled = enabled;
        this.value = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.ValueModule(0);
    }
    triggerCallbackFunc() {
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }
    write() {
        const frag = new DocumentFragment();
        const input = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`
            <input set-element type="number">
        `);
        if (isNaN(this.value._) || !isFinite(this.value._))
            this.value._ = this.min ?? 0; // reset if invalid
        if (this.min != null && this.value._ < this.min)
            this.value._ = this.min; // reset if out of range
        if (this.max != null && this.value._ > this.max)
            this.value._ = this.max; // reset if out of range
        if (!Number.isInteger(this.value._))
            this.value._ = Math.floor(this.value._); // floor if float
        if (this.enabled) {
            if (this.min != null)
                input.min = this.min.toString();
            if (this.max != null)
                input.max = this.max.toString();
            input.addEventListener("change", () => {
                this.value._ = parseFloat(input.value);
                this.triggerCallbackFunc.call(this);
            });
        }
        else {
            input.disabled = true;
        }
        input.value = this.value._.toString();
        frag.appendChild(input);
        return frag;
    }
}
class Slider extends _componentbase__WEBPACK_IMPORTED_MODULE_1__.Component {
    title;
    valueText;
    min;
    max;
    step;
    enabled;
    triggerCallback = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.CallbackModule();
    value;
    constructor(title, valueText, min, max, step, enabled = true) {
        super();
        this.title = title;
        this.valueText = valueText;
        this.min = min;
        this.max = max;
        this.step = step;
        this.enabled = enabled;
        this.value = new _componentbase__WEBPACK_IMPORTED_MODULE_1__.ValueModule(0);
    }
    triggerCallbackFunc() {
        this.triggerCallback.call();
        tickSound();
        updateMenu();
    }
    write() {
        const frag = new DocumentFragment();
        const container = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<div set-element class="sliderBox" style="margin: 2px 4px 2px 0px;"></div>`);
        const title = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<div class="smallFancyButton" style="float: left;">${this.title}</div>`);
        const displayText = this.valueText.replace("[$]", this.value._.toString());
        const valueText = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<div class="smallFancyButton" style="float: right;">${displayText}</div>`);
        const slider = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`
            <input
                class="slider"
                style="clear: both;"
                type="range"
                min="${this.min}"
                max="${this.max}"
                step="${this.step}"
                value="${this.value}"/>
        `);
        slider.value = this.value._.toString();
        if (this.enabled) {
            const updateValue = () => {
                this.value._ = parseFloat(slider.value);
                const displayText = this.valueText.replace("[$]", this.value._.toString());
                valueText.textContent = displayText;
            };
            slider.addEventListener("change", () => {
                updateValue();
                this.triggerCallbackFunc.call(this);
            });
            slider.addEventListener("input", updateValue);
        }
        else {
            slider.disabled = true;
        }
        container.appendChild(title);
        container.appendChild(valueText);
        container.appendChild(slider);
        frag.appendChild(container);
        return frag;
    }
}


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CallbackModule: () => (/* binding */ CallbackModule),
/* harmony export */   Component: () => (/* binding */ Component),
/* harmony export */   ValueModule: () => (/* binding */ ValueModule)
/* harmony export */ });
class Component {
    id = "";
    class = [];
    style = "";
    visible = true;
    writeCallback = new CallbackModule();
    _parent = null;
    _children = [];
    constructor() {
        this.write = ((target) => {
            return function () {
                this.writeCallback.call();
                if (this.visible) {
                    const html = target.call(this);
                    const element = html.querySelector("[set-element]");
                    if (element)
                        element.removeAttribute("set-element");
                    // set id
                    const idElement = element || html.querySelector("[set-id]");
                    if (idElement) {
                        if (this.id) {
                            idElement.setAttribute("id", this.id);
                        }
                        idElement.removeAttribute("set-id");
                    }
                    // set class
                    const classesElement = element || html.querySelector("[set-class]");
                    if (classesElement) {
                        if (this.class.length > 0) {
                            classesElement.classList.add(...this.class);
                        }
                        classesElement.removeAttribute("set-class");
                    }
                    // set style
                    const styleElement = element || html.querySelector("[set-style]");
                    if (styleElement) {
                        if (this.style && styleElement instanceof HTMLElement) {
                            styleElement.style.cssText += this.style;
                        }
                        styleElement.removeAttribute("set-style");
                    }
                    // add children
                    const containerElement = html.querySelector("[set-container]");
                    if (containerElement) {
                        for (const child of this.children) {
                            containerElement.appendChild(child.write.call(child));
                        }
                        containerElement.removeAttribute("set-container");
                    }
                    return html;
                }
                else {
                    return new DocumentFragment(); // return nothing
                }
            };
        })(this.write);
    }
    setId(value) {
        this.id = value;
        return this;
    }
    addClass(...classes) {
        this.class.push(...classes);
        return this;
    }
    addStyle(value) {
        this.style += value;
        return this;
    }
    get parent() {
        return this._parent;
    }
    get children() {
        return this._children;
    }
    add(...children) {
        for (const child of children) {
            this._children.push(child);
            child._parent = this;
        }
        return this;
    }
    remove(...children) {
        for (const child of children) {
            const i = this._children.indexOf(child);
            if (i > -1) {
                this._children.splice(i, 1);
            }
        }
        return this;
    }
}
class CallbackModule {
    _callbacks = [];
    attach(...callbacks) {
        this._callbacks.push(...callbacks);
        return this;
    }
    remove(...children) {
        for (const child of children) {
            let i = 0;
            while (i !== -1) {
                i = this._callbacks.indexOf(child);
                if (i !== -1) {
                    this._callbacks.splice(i, 1);
                }
            }
        }
        return this;
    }
    get callbacks() {
        return [...this._callbacks];
    }
    call() {
        for (const callback of this.callbacks) {
            callback();
        }
    }
}
class ValueModule {
    _value;
    constructor(initialValue) {
        this._value = initialValue;
    }
    getter() {
        return this._value;
    }
    setter(value) {
        this._value = value;
    }
    attachGetterSetter(getter, setter) {
        this.getter = getter.bind(this);
        this.setter = setter.bind(this);
        return this;
    }
    get _() {
        return this.getter();
    }
    set _(value) {
        this.setter(value);
    }
}


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("🍪 General").add(new _component__WEBPACK_IMPORTED_MODULE_1__.PrefButton("protectVeil", "Protect shimmering veil", "Prevents some shortcuts from running to protect the shimmering veil."), new _component__WEBPACK_IMPORTED_MODULE_1__.PrefButton("protectShiny", "Protect shiny wrinklers"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.autoclicker", "Click big cookie", undefined, (params) => {
    const slider = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Slider("Click speed", "[$] CPS", 5, 20, 0.1);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(slider, params, 0);
    return [slider.write()];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("general.clickGoldenCookie", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Click golden cookie").write());
    const amount = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.ToggleButton(["One GC", "All GCs"]);
    amount.addStyle("width: 75px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParamIntToBool)(amount, params, 0);
    frag.appendChild(amount.write());
    const wrath = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton("Wrath");
    wrath.addStyle("width: 75px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(wrath, params, 1);
    frag.appendChild(wrath.write());
    return [frag];
}), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Also clicks wrath type cookie storm drops and chain cookies regardless of wrath setting, and reindeer.")), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.clickFortuneCookie", "Click fortune cookie"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Click fortune cookies on the news ticker.")), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("general.popWrinkler", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Pop").write());
    const which = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.ToggleButton(["All", "Fattest"]);
    which.addStyle("width: 45px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParamIntToBool)(which, params, 0);
    frag.appendChild(which.write());
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("wrinkler").write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("general.ascend", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Ascend/reincarcenate").write());
    const force = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton(`${_helpers__WEBPACK_IMPORTED_MODULE_2__.warning} Skip menu`);
    force.addStyle("width: 100px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(force, params, 0);
    frag.appendChild(force.write());
    if (force.value._) {
        const force = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton(`Skip animation`);
        force.addStyle("width: 110px;");
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(force, params, 1);
        frag.appendChild(force.write());
    }
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.save", "Save game"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.exportSave", "Export save", "Opens the export save menu"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.exportSaveToFile", "Export save to file"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.exportSaveToClipboard", "Export save to clipboard", "Copies the save string to your clipboard"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.importSave", "Import save", "Opens the import save menu"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.importSaveFromFile", "Import save from file"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.importSaveFromClipboard", "Import save from clipboard", "Imports a game from the save string on your clipboard"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.options", "Options menu"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.info", "Info menu"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("general.stats", "Stats menu")));


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignParam: () => (/* binding */ assignParam),
/* harmony export */   assignParamIntToBool: () => (/* binding */ assignParamIntToBool),
/* harmony export */   cheat: () => (/* binding */ cheat),
/* harmony export */   notRecommended: () => (/* binding */ notRecommended),
/* harmony export */   warning: () => (/* binding */ warning)
/* harmony export */ });
const warning = "<span title='This setting makes drastic changes. Use at your own risk.'>⚠️</dfn>";
const notRecommended = "<span title='This setting is not recommended as it alters the gameplay and makes the game less enjoyable.'>👎🏻</dfn>";
const cheat = "<span title='This setting is a cheat.'>🛠️</dfn>";
function assignParam(object, params, i) {
    object.value.attachGetterSetter(() => params[i], (value) => (params[i] = value));
}
function assignParamIntToBool(object, params, i) {
    object.value.attachGetterSetter(() => Number(params[i]), (value) => (params[i] = Boolean(value)));
}


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("⬆️ Upgrades").add(new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("upgrades.buyAll", "Buy all upgrades"), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("upgrades.switchSeason", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Season switcher").write());
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Toggle", "Switch on", "Switch off"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    const seasons = ["Christmas", "Halloween", "Valentine's day", "Business day", "Easter"];
    if (action.value._ === "Switch off")
        seasons.push("Any season");
    const season = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(seasons);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(season, params, 1);
    frag.appendChild(season.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("upgrades.goldenSwitch", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Golden switch").write());
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Toggle", "Switch on", "Switch off"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("upgrades.shimmeringVeil", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Shimmering veil").write());
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Toggle", "Switch on", "Switch off"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("upgrades.sugarFrenzy", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Sugar frenzy").write());
    const force = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton(`${_helpers__WEBPACK_IMPORTED_MODULE_2__.warning} Skip menu`);
    force.addStyle("width: 100px");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(force, params, 0);
    frag.appendChild(force.write());
    return [frag];
})));


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);



const buildings = [
    "Cursor",
    "Grandma",
    "Farm",
    "Mine",
    "Factory",
    "Bank",
    "Temple",
    "Wizard tower",
    "Shipment",
    "Alchemy lab",
    "Portal",
    "Time machine",
    "Antimatter condenser",
    "Prism",
    "Chancemaker",
    "Fractal engine",
    "Javascript console",
    "Idleverse",
    "Cortex baker",
    "You",
    "All buildings",
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("🧱 Buildings").add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("buildings.building", (params) => {
    const frags = [];
    const frag = new DocumentFragment();
    frags.push(frag);
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Buy", "Buy until have", "Sell", "Sell until have"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    const amounts = ["1", "10", "100", "Custom"];
    if (params[0].startsWith("Buy"))
        amounts.splice(3, 0, "Max");
    else
        amounts.splice(3, 0, "All");
    const amount = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(amounts);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(amount, params, 1);
    frag.appendChild(amount.write());
    if (amount.value._ === "Custom") {
        const custom = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.NumberInput(0, 9999);
        custom.addStyle("width: 45px;");
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(custom, params, 2);
        frag.appendChild(custom.write());
    }
    else {
        params[2] = 0;
    }
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("of").write());
    const building = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown([...buildings]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(building, params, 3);
    frag.appendChild(building.write());
    if (amount.value._ !== "Max" && amount.value._ !== "All") {
        const frag2 = new DocumentFragment();
        const over = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton(action.value._.startsWith("Buy") ? "Overbuy" : "Oversell");
        over.addStyle("width: 75px;");
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(over, params, 4);
        frag2.appendChild(over.write());
        frags.push(frag2);
    }
    else {
        params[4] = false;
    }
    return frags;
}), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Overbuy"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Allow spending max cookies to buy buildings when you can't buy all. Example: buy 70 buildings with all your cookies when in buy-100 mode.")), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Oversell"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Allow spending selling all of your remaining buildings when you don't have enough to sell. Example: sell last 70 buildings when in sell-100 mode."))));


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("🎄 Krumblor and Santa").add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("krumblor.setAura", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Set Krumblor aura to").write());
    const aura = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown([
        "No aura",
        "Breath of Milk",
        "Dragon Cursor",
        "Elder Battalion",
        "Reaper of Fields",
        "Earth Shatterer",
        "Master of the Armory",
        "Fierce Hoarder",
        "Dragon God",
        "Arcane Aura",
        "Dragonflight",
        "Ancestral Metamorphosis",
        "Unholy Dominion",
        "Epoch Manipulator",
        "Mind Over Matter",
        "Radiant Appetite",
        "Dragon's Fortune",
        "Dragon's Curve",
        "Reality Bending",
        "Dragon Orbs",
        "Supreme Intellect",
        "Dragon Guts",
    ]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(aura, params, 0);
    frag.appendChild(aura.write());
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("in").write());
    const slot = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.ToggleButton(["Primary slot", "Secondary slot"]);
    slot.addStyle("width: 85px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParamIntToBool)(slot, params, 1);
    frag.appendChild(slot.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("krumblor.upgrade", "Upgrade Krumblor"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("krumblor.pet", "Pet Krumblor"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("santa.upgrade", "Upgrade Santa")));


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("📈 Stock market").add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("market.good", (params) => {
    const frag = new DocumentFragment();
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Buy", "Buy until have", "Sell", "Sell until have"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    const amounts = ["1", "10", "100", "Custom"];
    if (params[0].startsWith("Buy"))
        amounts.splice(3, 0, "Max");
    else if (params[0] === "Sell")
        amounts.push("All");
    const amount = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(amounts);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(amount, params, 1);
    frag.appendChild(amount.write());
    if (amount.value._ === "Custom") {
        const custom = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.NumberInput(0, 9999);
        custom.addStyle("width: 45px;");
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(custom, params, 2);
        frag.appendChild(custom.write());
    }
    else {
        params[2] = 0;
    }
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("of").write());
    const stocks = [
        "CRL Cereals",
        "CHC Chocolate",
        "BTR Butter",
        "SUG Sugar",
        "NUT Nuts",
        "SLT Salt",
        "VNL Vanilla",
        "EGG Eggs",
        "CNM Cinnamon",
        "CRM Cream",
        "JAM Jam",
        "WCH White chocolate",
        "HNY Honey",
        "CKI Cookies",
        "RCP Recipes",
        "SBD Subsidiaries",
        "PBL Publicists",
        `YOU ${_aliases__WEBPACK_IMPORTED_MODULE_3__.Game.bakeryName}`,
        "All stocks",
    ];
    const stockSymbols = [
        "CRL",
        "CHC",
        "BTR",
        "SUG",
        "NUT",
        "SLT",
        "VNL",
        "EGG",
        "CNM",
        "CRM",
        "JAM",
        "WCH",
        "HNY",
        "CKI",
        "RCP",
        "SBD",
        "PBL",
        "YOU",
        "All stocks",
    ];
    const good = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(stocks, stockSymbols);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(good, params, 3);
    frag.appendChild(good.write());
    if (action.value._ === "Buy" && amount.value._ !== "Max") {
        const over = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton("Overbuy");
        over.addStyle("width: 75px;");
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(over, params, 4);
        frag.appendChild(over.write());
    }
    else {
        params[4] = false;
    }
    return [frag];
}), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Overbuy"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Allow spending max cookies to buy stocks when you can't buy all. Example: buy 7 stocks with all your cookies when in buy-10 mode.")), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("market.loan", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Take loan").write());
    const loan = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["1st loan", "2nd loan", "3rd loan"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(loan, params, 0);
    frag.appendChild(loan.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("market.hireBroker", "Hire broker"), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("market.upgradeOffice", "Upgrade office")));


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);
/* harmony import */ var _aliases__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("🌱 Garden").add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("garden.seed", (params) => {
    const frag = new DocumentFragment();
    const harvest = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.ToggleButton(["Plant", "Harvest"]);
    harvest.addStyle("width: 45px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParamIntToBool)(harvest, params, 0);
    frag.appendChild(harvest.write());
    const one = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.ToggleButton(["All", "One"]);
    one.addStyle("width: 20px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParamIntToBool)(one, params, 1);
    frag.appendChild(one.write());
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("of").write());
    const plants = [
        "Baker's wheat",
        "Thumbcorn",
        "Cronerice",
        "Gildmillet",
        "Ordinary clover",
        "Golden clover",
        "Shimmerlily",
        "Elderwort",
        "Bakeberry",
        "Chocoroot",
        "White chocoroot",
        "White mildew",
        "Brown mold",
        "Meddleweed",
        "Whiskerbloom",
        "Chimerose",
        "Nursetulip",
        "Drowsyfern",
        "Wardlichen",
        "Keenmoss",
        "Queenbeet",
        "Juicy queenbeet",
        "Duketater",
        "Crumbspore",
        "Doughshroom",
        "Glovemorel",
        "Cheapcap",
        "Fool's bolete",
        "Wrinklegill",
        "Green rot",
        "Shriekbulb",
        "Tidygrass",
        "Everdaisy",
        "Ichorpuff",
    ];
    if (harvest.value._)
        plants.splice(0, 0, "Any plant");
    const plant = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(plants);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(plant, params, 2);
    frag.appendChild(plant.write());
    if (one.value._) {
        const [minCol, minRow, maxCol, maxRow] = _aliases__WEBPACK_IMPORTED_MODULE_3__.Garden.plotLimits[Math.min(_aliases__WEBPACK_IMPORTED_MODULE_3__.Game.Objects["Farm"].level - 1, 8)];
        frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("at row").write());
        const row = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.NumberInput(1, maxRow - minRow, true);
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(row, params, 3);
        frag.appendChild(row.write());
        frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("col").write());
        const col = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.NumberInput(1, maxCol - minCol, true);
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(col, params, 4);
        frag.appendChild(col.write());
    }
    else {
        params[3] = 1;
        params[4] = 1;
    }
    const frag2 = new DocumentFragment();
    if (harvest.value._) {
        params[7] = false;
        const mature = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton("Mature only", true);
        mature.addStyle("width: 100px;");
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(mature, params, 5);
        frag2.appendChild(mature.write());
        if (plant.value._ === "Any plant") {
            const mortal = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton("Mortal only", true);
            mortal.addStyle("width: 100px;");
            (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(mortal, params, 6);
            frag2.appendChild(mortal.write());
        }
    }
    else {
        params[5] = true;
        params[6] = true;
        const harvestExisting = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton("Harvest existing");
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(harvestExisting, params, 7);
        frag2.appendChild(harvestExisting.write());
    }
    return [frag, frag2];
}), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Mature only"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("When harvesting, only harvest plants that are mature.")), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Mortal only"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("When harvesting, only harvest plants that are mortal.")), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Harvest existing"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("When planting, harvest existing plants to make space for new seeds.")), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("garden.freeze", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Freeze").write());
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Toggle", "Switch on", "Switch off"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("garden.changeSoil", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Change soil to").write());
    const soil = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Dirt", "Fertilizer", "Clay", "Pebbles", "Wood chips"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(soil, params, 0);
    frag.appendChild(soil.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("garden.convert", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Sacrifice garden").write());
    const force = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton(`${_helpers__WEBPACK_IMPORTED_MODULE_2__.warning} Skip menu`);
    force.addStyle("width: 100px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(force, params, 0);
    frag.appendChild(force.write());
    return [frag];
})));


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("🏛 Pantheon").add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("pantheon.slot", (params) => {
    const frag = new DocumentFragment();
    const toSlot = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.ToggleButton(["Unslot", "Slot"]);
    toSlot.addStyle("width: 40px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParamIntToBool)(toSlot, params, 0);
    frag.appendChild(toSlot.write());
    const gods = [
        "Holobore",
        "Vomitrax",
        "Godzamok",
        "Cyclius",
        "Selebrak",
        "Dotjeiess",
        "Muridal",
        "Jeremy",
        "Mokalsium",
        "Skruuia",
        "Rigidel",
    ];
    const god = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown([...gods, ...(toSlot.value._ ? [] : ["Any god"])]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(god, params, 1);
    frag.appendChild(god.write());
    if (toSlot.value._) {
        frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("to").write());
        const to = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Jade", "Ruby", "Diamond"]);
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(to, params, 2);
        frag.appendChild(to.write());
        frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("If occupied:").write());
        const ifOccupied = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Cancel", "Unslot", "Swap"]);
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(ifOccupied, params, 3);
        frag.appendChild(ifOccupied.write());
    }
    else {
        frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("from").write());
        const from = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Jade", "Ruby", "Diamond", "Any slot"]);
        (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(from, params, 4);
        frag.appendChild(from.write());
    }
    return [frag];
}).addStyle("margin-bottom: 10px;"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("If occupied"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Behavior of slotting gods if the destination slot is already occupied by another god.")), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("&bull; Cancel"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Cancels the process. Nothing happens and you get a warning.")), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("&bull; Unslot"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Unslots the god occupying the destination slot and replace it with your chosen god.")), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("&bull; Swap"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Swaps the places of both gods. The god occupying the destination slot will be unslotted or moved to another slot depending on the location of your chosen god."))));


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);



const spells = [
    "Conjure Baked Goods",
    "Force the Hand of Fate",
    "Stretch Time",
    "Spontaneous Edifice",
    "Haggler's Charm",
    "Summon Crafty Pixies",
    "Gambler's Fever Dream",
    "Resurrect Abomination",
    "Diminish Ineptitude",
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("🧙‍♂️ Grimoire").add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("grimoire.cast", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Cast").write());
    const spell = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown([...spells]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.assignParam)(spell, params, 0);
    frag.appendChild(spell.write());
    return [frag];
})));


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(25);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
    const collapsible = new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("🤨 Cheats");
    collapsible.writeCallback.attach(() => (collapsible.visible = Boolean(_storage__WEBPACK_IMPORTED_MODULE_2__["default"].prefs["cheats"])));
    return collapsible;
})().add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("cheats.cookies", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Cookies").write());
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Gain", "Set to"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    const amount = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.NumberInput(0, undefined, true);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.assignParam)(amount, params, 1);
    frag.appendChild(amount.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("cheats.lumps", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Sugar lumps").write());
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Gain", "Set to"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    const amount = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.NumberInput(0, undefined, true);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.assignParam)(amount, params, 1);
    frag.appendChild(amount.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("cheats.heavenlyChips", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Heavenly chips").write());
    const action = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Dropdown(["Gain", "Set to"]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.assignParam)(action, params, 0);
    frag.appendChild(action.write());
    const amount = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.NumberInput(0, undefined, true);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.assignParam)(amount, params, 1);
    frag.appendChild(amount.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("cheats.openSesame", "Open sesame", "Opens the debug console."), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("cheats.ruinTheFun", "Ruin the fun", "Unlocks everything."), new _component__WEBPACK_IMPORTED_MODULE_1__.TitleShortcut("cheats.party", "PARTY", "EPILEPSY/SEIZURE WARNING: BRIGHT, FLASHING, COLORFUL LIGHTS AND VIGOROUS SHAKING ARE INCLUDED")));


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(25);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _component__WEBPACK_IMPORTED_MODULE_1__.Collapsible("⚙️ Others").add(new _component__WEBPACK_IMPORTED_MODULE_1__.Shortcut("others.wipeSave", (params) => {
    const frag = new DocumentFragment();
    frag.appendChild(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text(`${_helpers__WEBPACK_IMPORTED_MODULE_3__.warning} Wipe save`).write());
    const force = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.OnOffButton(`${_helpers__WEBPACK_IMPORTED_MODULE_3__.warning} Skip menu`);
    force.addStyle("width: 100px;");
    (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.assignParam)(force, params, 0);
    frag.appendChild(force.write());
    return [frag];
}), new _component__WEBPACK_IMPORTED_MODULE_1__.PrefButton("verbose", "Verbose", "Show notifications when a shortcut fails to run."), new _component__WEBPACK_IMPORTED_MODULE_1__.PrefButton("runButtons", "Run buttons", "Adds buttons to runs shortcuts directly without the need to set keybinds."), new _component__WEBPACK_IMPORTED_MODULE_1__.PrefButton("advanced", "Advanced mode", "Enables run button, run order number and duplicating shortcuts."), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Run order"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("When multiple shortcuts have the same keybind, the shortcut with the lower run order runs first. Useful for combo shortcuts. Note: you can set negative values.")), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add(new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Text("Duplicate ＋ / Remove －"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Enables assigning multiple keybinds to the same shortcut. Useful for combo shortcuts.")), new _component__WEBPACK_IMPORTED_MODULE_1__.PrefButton("cheats", "Cheats"), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Listing().add((() => {
    const button = new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Button("Reset all to defaults");
    button.triggerCallback.attach(() => {
        _storage__WEBPACK_IMPORTED_MODULE_2__["default"].resetAllToDefaults();
        (0,_ui__WEBPACK_IMPORTED_MODULE_4__.notify)("All Cookie Shortcut settings resetted to default");
    });
    return button;
})(), new _base_menu_component__WEBPACK_IMPORTED_MODULE_0__.Label("Reset all Cookie Shortcut settings to default."))));


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   injectCss: () => (/* binding */ injectCss),
/* harmony export */   injectMenu: () => (/* binding */ injectMenu)
/* harmony export */ });
/* harmony import */ var _stringtohtml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);


const w = window;
function injectMenu(menu) {
    if (w.Game === undefined)
        throw new Error("Game not found.");
    // override Game.UpdateMenu
    w.Game.UpdateMenu = ((target) => {
        return function (...args) {
            const retVal = target.apply(this, args);
            writeMenu(menu);
            return retVal;
        };
    })(w.Game.UpdateMenu);
    // Prevents the options menu from updating by set time interval.
    // This is to prevent dropdown menus from disappearing.
    // Getters/setters make sure the logic is always wrapping around the original function
    // no matter how many times and when it is modified by other mods,
    let updateMenu = w.Game.UpdateMenu.bind(w.Game);
    Object.defineProperty(w.Game, "UpdateMenu", {
        get() {
            if (w.Game.onMenu === "prefs" &&
                new Error().stack?.includes("Game.Logic") // hacky way to figure out if function is called by Game.Logic (menu update because of set time interval)
            ) {
                return () => undefined;
            }
            return updateMenu;
        },
        set(value) {
            updateMenu = value;
        },
    });
}
function writeMenu(menu) {
    // find place to insert menu
    const blocks = document.getElementsByClassName("block");
    let settingsBlock;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].textContent?.search(w.loc("Settings")) === 0) {
            settingsBlock = blocks[i];
        }
    }
    if (settingsBlock === undefined)
        return;
    // create menu
    const block = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<div class="block" style="padding: 0px; margin: 8px 4px;"></div>`);
    const subsection = (0,_stringtohtml__WEBPACK_IMPORTED_MODULE_0__.elementFromString)(`<div class="subsection" style="padding: 0px;"></div>`);
    block.appendChild(subsection);
    subsection.appendChild(menu.write());
    // insert menu
    settingsBlock.after(block);
}
function injectCss(css) {
    if (w.Game === undefined)
        throw new Error("Game not found.");
    // add css
    const style = document.createElement("style");
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(_component__WEBPACK_IMPORTED_MODULE_1__.css + css));
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

const w = window;
const gameReadyInterval = setInterval(() => {
    if (w.Game === undefined || w.Game.ready === undefined || !w.Game.ready)
        return;
    w.Game.registerMod(_mod__WEBPACK_IMPORTED_MODULE_0__["default"].id, _mod__WEBPACK_IMPORTED_MODULE_0__["default"]);
    w.Game.Notify(`${_mod__WEBPACK_IMPORTED_MODULE_0__["default"].name} loaded!`, "", undefined, 3);
    clearInterval(gameReadyInterval);
    const modsReadyInterval = setInterval(() => {
        for (const mod of Object.values(w.Game.mods)) {
            if (mod.init !== 0)
                return;
        }
        _mod__WEBPACK_IMPORTED_MODULE_0__["default"].delayedInit();
        clearInterval(modsReadyInterval);
    }, 100);
    // w.mod = mod; // DEBUG
}, 100);

})();

/******/ })()
;