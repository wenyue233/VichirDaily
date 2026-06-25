const SAVE_KEY = "vichirDailySave";
const MODE_KEY = "vichirDailyUiMode";
const SCRIPT_VERSION = "2026.06.25-compat-1";
const SAVE_VERSION = 2;
const MAX_ACTION_POINTS = 3;
const EVENT_DATA_URL = "data/events.json";
const UI_MODES = {
  normal: {
    label: "普通模式",
  },
  evil: {
    label: "邪恶化身模式",
  },
};

const defaultState = {
  day: 1,
  mode: "通常",
  actionPoints: MAX_ACTION_POINTS,
  diligence: 0,
  vision: 0,
  gold: 0,
  todayLogs: [],
  historyLogs: [],
  triggeredEvents: [],
};

const actions = [
  {
    id: "court_duties",
    name: "处理公务",
    description: "勤政 +1",
  },
  {
    id: "wander",
    name: "随处走走",
    description: "随机闲逛结果",
  },
  {
    id: "estate",
    name: "治理家业",
    description: "金币 +1",
  },
];

const DEFAULT_EVENT_DATA = {
  wanderTables: [
    {
      id: "wander_normal",
      type: "normal",
      title: "普通闲逛",
      weight: 60,
      effects: {},
      fallbackText: "随处走走：宫廷今日平静无事。",
      events: [
        {
          id: "corridor_whisper",
          title: "长廊低语",
          body: "你在长廊听见几句未成形的传闻。",
          logText: "随处走走：你在长廊听见几句未成形的传闻。",
          options: [],
          rewards: [],
          image: "",
        },
        {
          id: "quiet_courtyard",
          title: "安静庭院",
          body: "庭院风沙渐起，今日暂无特别收获。",
          logText: "随处走走：庭院风沙渐起，今日暂无特别收获。",
          options: [],
          rewards: [],
          image: "",
        },
      ],
    },
    {
      id: "wander_vision",
      type: "vision",
      title: "灵视浮现",
      weight: 25,
      effects: {
        vision: 1,
      },
      fallbackText: "随处走走：你察觉到一丝异样气息，灵视 +1。",
      events: [
        {
          id: "silver_shadow",
          title: "银色影子",
          body: "你在帘幕后看见一抹银色影子，很快又消失不见。",
          logText: "随处走走：你看见一抹银色影子，灵视 +1。",
          options: [],
          rewards: ["灵视 +1"],
          image: "",
        },
      ],
    },
    {
      id: "wander_gold",
      type: "gold",
      title: "意外收获",
      weight: 10,
      effects: {
        gold: 1,
      },
      fallbackText: "随处走走：你捡到一枚遗落的金币，金币 +1。",
      events: [
        {
          id: "lost_coin",
          title: "遗落金币",
          body: "一枚金币滚到你的靴边，没人前来认领。",
          logText: "随处走走：你捡到一枚遗落的金币，金币 +1。",
          options: [],
          rewards: ["金币 +1"],
          image: "",
        },
      ],
    },
    {
      id: "wander_special",
      type: "special",
      title: "特殊闲逛事件",
      weight: 5,
      effects: {},
      fallbackText: "随处走走：一个特殊事件正在等待补完。",
      events: [
        {
          id: "veiled_guest",
          title: "蒙面访客",
          body: "一个蒙面人从柱影后向你点头，随即消失在人群中。",
          logText: "随处走走：你遇见一名蒙面访客。特殊事件占位。",
          options: [],
          rewards: [],
          image: "",
        },
      ],
    },
  ],
  statEvents: [
    {
      id: "sultan_reward",
      title: "苏丹的奖励",
      body: "占位文本：你的勤政被苏丹看见，一份奖励正在拟定。",
      logText: "事件触发：【苏丹的奖励】。勤政归零。",
      trigger: {
        stat: "diligence",
        operator: ">=",
        value: 10,
        chance: 1,
      },
      effects: {
        diligence: "reset",
      },
      options: [],
      rewards: [],
      image: "",
    },
    {
      id: "fluffy_promise",
      title: "毛茸茸之约",
      body: "占位文本：某个毛茸茸的存在回应了你的灵视。",
      logText: "事件触发：【毛茸茸之约】。灵视归零。",
      trigger: {
        stat: "vision",
        operator: ">=",
        value: 3,
        chance: 1,
      },
      effects: {
        vision: "reset",
      },
      options: [],
      rewards: [],
      image: "",
    },
    {
      id: "angel_investor",
      title: "天使投资人",
      body: "占位文本：一位神秘投资人对你的财富管理产生兴趣。",
      logText: "事件触发：【天使投资人】。",
      trigger: {
        stat: "gold",
        operator: ">=",
        value: 3,
        chance: 0.1,
      },
      effects: {},
      options: [],
      rewards: [],
      image: "",
    },
  ],
};

let savedGameAvailable = hasSavedGame();
let gameState = createDefaultState();
let eventData = {
  wanderTables: [],
  statEvents: [],
};
let selectedUiMode = "";
let modalQueue = [];
let activeModalEvent = null;
let eventDataSource = "unloaded";
let diligenceButtonBound = false;

const elements = {
  dayText: document.getElementById("dayText"),
  modeText: document.getElementById("modeText"),
  actionPointText: document.getElementById("actionPointText"),
  diligenceText: document.getElementById("diligenceText"),
  visionText: document.getElementById("visionText"),
  goldText: document.getElementById("goldText"),
  todayLog: document.getElementById("todayLog"),
  actionList: document.getElementById("actionList"),
  historyButton: document.getElementById("historyButton"),
  historyPanel: document.getElementById("historyPanel"),
  historyList: document.getElementById("historyList"),
  eventModal: document.getElementById("eventModal"),
  eventTitle: document.getElementById("eventTitle"),
  eventBody: document.getElementById("eventBody"),
  eventRewards: document.getElementById("eventRewards"),
  eventOptions: document.getElementById("eventOptions"),
  eventImageSlot: document.getElementById("eventImageSlot"),
  eventConfirmButton: document.getElementById("eventConfirmButton"),
  startModal: document.getElementById("startModal"),
  continueButton: document.getElementById("continueButton"),
  restartButton: document.getElementById("restartButton"),
  modeModal: document.getElementById("modeModal"),
  modeSwitchButton: document.getElementById("modeSwitchButton"),
  modeOptions: document.querySelectorAll("[data-mode-choice]"),
  saveButton: document.getElementById("saveButton"),
  clearSaveButton: document.getElementById("clearSaveButton"),
};

init();

async function init() {
  eventData = await loadEventData();
  renderActions();
  bindUiEvents();
  setupEntryUi();
  render();
  logStartupDiagnostics();
}

function bindUiEvents() {
  elements.historyButton.addEventListener("click", () => {
    elements.historyPanel.hidden = !elements.historyPanel.hidden;
    renderHistory();
  });

  elements.eventConfirmButton.addEventListener("click", closeEventModal);
  elements.continueButton.addEventListener("click", continueSavedGame);
  elements.restartButton.addEventListener("click", restartGame);
  elements.saveButton.addEventListener("click", () => {
    saveGame();
    flashSaveButton();
  });
  elements.clearSaveButton.addEventListener("click", clearSavedGame);
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn("localStorage 读取失败。", key, error);
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn("localStorage 写入失败。", key, error);
    return false;
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn("localStorage 删除失败。", key, error);
  }
}

function logStartupDiagnostics() {
  const diligenceButton = document.querySelector('[data-action-id="court_duties"]');
  const modalStyle = elements.eventModal ? window.getComputedStyle(elements.eventModal) : null;
  const diagnostics = {
    scriptVersion: SCRIPT_VERSION,
    localStorageKeys: {
      save: SAVE_KEY,
      mode: MODE_KEY,
    },
    diligenceButtonBound: diligenceButtonBound && Boolean(diligenceButton),
    eventModalFound: Boolean(elements.eventModal && elements.eventTitle && elements.eventConfirmButton),
    eventModalCss: modalStyle
      ? {
          zIndex: modalStyle.zIndex,
          display: modalStyle.display,
          visibility: modalStyle.visibility,
          pointerEvents: modalStyle.pointerEvents,
        }
      : null,
    eventDataSource: eventDataSource,
    protocol: window.location.protocol,
  };

  console.log("[VichirDaily startup] " + JSON.stringify(diagnostics));
}

function setupEntryUi() {
  elements.modeOptions.forEach((button) => {
    button.addEventListener("click", () => {
      applyUiMode(button.dataset.modeChoice);
    });
  });

  elements.modeSwitchButton.addEventListener("click", showModeModal);

  if (savedGameAvailable) {
    showStartModal();
    return;
  }

  beginNewGame();
}

function showStartModal() {
  document.body.classList.add("mode-normal");
  elements.startModal.hidden = false;
  elements.modeModal.hidden = true;
  elements.modeSwitchButton.hidden = true;
  document.body.classList.add("mode-pending");
}

function continueSavedGame() {
  const saved = loadSavedGame();

  if (!saved) {
    savedGameAvailable = false;
    beginNewGame();
    return;
  }

  gameState = saved.gameState;
  selectedUiMode = saved.uiMode || loadUiMode() || "";
  modalQueue = saved.modalQueue;
  activeModalEvent = null;

  if (saved.activeModalEvent) {
    modalQueue.unshift(saved.activeModalEvent);
  }

  elements.startModal.hidden = true;
  applyUiMode(selectedUiMode || "normal", { persist: false, save: false });
  render();
  showNextModal();
}

function restartGame() {
  removeStorage(SAVE_KEY);
  removeStorage(MODE_KEY);
  savedGameAvailable = false;
  beginNewGame();
}

function beginNewGame() {
  gameState = createDefaultState();
  selectedUiMode = "";
  modalQueue = [];
  activeModalEvent = null;
  elements.startModal.hidden = true;
  elements.eventModal.hidden = true;
  document.body.classList.add("mode-normal");
  render();
  showModeModal();
}

function showModeModal() {
  elements.modeModal.hidden = false;
  elements.modeSwitchButton.hidden = true;
  document.body.classList.add("mode-pending");
}

function applyUiMode(mode, options = {}) {
  if (!UI_MODES[mode]) {
    return;
  }

  const shouldPersist = options.persist !== false;
  const shouldSave = options.save !== false;
  selectedUiMode = mode;

  if (shouldPersist) {
    writeStorage(MODE_KEY, mode);
  }

  document.body.classList.toggle("mode-normal", mode === "normal");
  document.body.classList.toggle("mode-evil", mode === "evil");
  document.body.classList.remove("mode-pending");
  elements.startModal.hidden = true;
  elements.modeModal.hidden = true;
  elements.modeSwitchButton.hidden = false;
  render();

  if (shouldSave) {
    saveGame();
  }
}

function createDefaultState() {
  return Object.assign({}, defaultState, {
    todayLogs: [],
    historyLogs: [],
    triggeredEvents: [],
  });
}

function hasSavedGame() {
  return Boolean(readStorage(SAVE_KEY));
}

function loadSavedGame() {
  const saved = readStorage(SAVE_KEY);

  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);

    if (parsed && parsed.gameState) {
      return {
        gameState: normalizeGameState(parsed.gameState),
        uiMode: UI_MODES[parsed.uiMode] ? parsed.uiMode : "",
        modalQueue: Array.isArray(parsed.modalQueue) ? parsed.modalQueue : [],
        activeModalEvent: parsed.activeModalEvent || null,
      };
    }

    return {
      gameState: normalizeGameState(parsed),
      uiMode: loadUiMode(),
      modalQueue: [],
      activeModalEvent: null,
    };
  } catch (error) {
    console.warn("存档读取失败，已使用默认状态。", error);
    return null;
  }
}

function normalizeGameState(state = {}) {
  return Object.assign({}, createDefaultState(), state, {
    todayLogs: Array.isArray(state.todayLogs) ? state.todayLogs : [],
    historyLogs: Array.isArray(state.historyLogs) ? state.historyLogs : [],
    triggeredEvents: Array.isArray(state.triggeredEvents) ? state.triggeredEvents : [],
  });
}

function loadUiMode() {
  const savedMode = readStorage(MODE_KEY);

  return UI_MODES[savedMode] ? savedMode : "";
}

async function loadEventData() {
  try {
    const response = await fetch(EVENT_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`事件数据读取失败：${response.status}`);
    }

    eventDataSource = EVENT_DATA_URL;
    return normalizeEventData(await response.json());
  } catch (error) {
    console.warn("事件数据读取失败。请确认 data/events.json 可被当前浏览器读取。", error);
    eventDataSource = "built-in fallback";
    return cloneEventData(DEFAULT_EVENT_DATA);
  }
}

function normalizeEventData(data) {
  return {
    wanderTables: Array.isArray(data.wanderTables) ? data.wanderTables : [],
    statEvents: Array.isArray(data.statEvents) ? data.statEvents : [],
  };
}

function cloneEventData(data) {
  return normalizeEventData(JSON.parse(JSON.stringify(data)));
}

function saveGame() {
  const modeLabel = selectedUiMode ? UI_MODES[selectedUiMode].label : gameState.mode;
  const saveData = {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    uiMode: selectedUiMode,
    gameState: Object.assign({}, gameState, {
      mode: modeLabel,
    }),
    modalQueue,
    activeModalEvent,
  };

  writeStorage(SAVE_KEY, JSON.stringify(saveData));

  if (selectedUiMode) {
    writeStorage(MODE_KEY, selectedUiMode);
  }
}

function clearSavedGame() {
  removeStorage(SAVE_KEY);
  removeStorage(MODE_KEY);
  savedGameAvailable = false;
  elements.clearSaveButton.textContent = "已清除";
  window.setTimeout(() => {
    elements.clearSaveButton.textContent = "清除存档";
  }, 900);
}

function flashSaveButton() {
  elements.saveButton.textContent = "已保存";
  window.setTimeout(() => {
    elements.saveButton.textContent = "保存游戏";
  }, 900);
}

function renderActions() {
  elements.actionList.innerHTML = "";

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "action-card";
    button.type = "button";
    button.dataset.actionId = action.id;
    button.title = action.description;
    button.textContent = action.name;
    button.addEventListener("click", () => performAction(action.id));
    if (action.id === "court_duties") {
      diligenceButtonBound = true;
    }
    elements.actionList.appendChild(button);
  });
}

function render() {
  elements.dayText.textContent = `Day ${gameState.day}`;
  elements.modeText.textContent = selectedUiMode ? UI_MODES[selectedUiMode].label : gameState.mode;
  elements.actionPointText.textContent = `${gameState.actionPoints} / ${MAX_ACTION_POINTS}`;
  elements.diligenceText.textContent = gameState.diligence;
  elements.visionText.textContent = gameState.vision;
  elements.goldText.textContent = gameState.gold;

  renderTodayLog();
  renderActionButtons();

  if (!elements.historyPanel.hidden) {
    renderHistory();
  }
}

function renderTodayLog() {
  if (gameState.todayLogs.length === 0) {
    elements.todayLog.textContent = "今日尚未行动";
    return;
  }

  elements.todayLog.innerHTML = gameState.todayLogs
    .map((log) => `<p>${escapeHtml(log.text)}</p>`)
    .join("");
}

function renderHistory() {
  if (gameState.historyLogs.length === 0) {
    elements.historyList.innerHTML = "<p>尚无历史记录。</p>";
    return;
  }

  elements.historyList.innerHTML = gameState.historyLogs
    .slice()
    .reverse()
    .map((log) => `<p><span>Day ${log.day}</span>${escapeHtml(log.text)}</p>`)
    .join("");
}

function renderActionButtons() {
  const disabled = gameState.actionPoints <= 0 || !elements.eventModal.hidden;

  document.querySelectorAll(".action-card").forEach((button) => {
    button.disabled = disabled;
  });
}

function performAction(actionId) {
  if (gameState.actionPoints <= 0) {
    addLog("今日行动力已耗尽。");
    endDay();
    saveGame();
    render();
    return;
  }

  const actionResult = resolveAction(actionId);

  if (!actionResult) {
    return;
  }

  applyEffects(actionResult.effects);
  gameState.actionPoints -= 1;
  addLog(actionResult.logText);

  checkStatEvents();

  if (gameState.actionPoints === 0) {
    addLog(`Day ${gameState.day} 结束。`);
    endDay();
  }

  saveGame();
  render();
  showNextModal();
}

function resolveAction(actionId) {
  if (actionId === "court_duties") {
    return {
      logText: "处理公务：勤政 +1。",
      effects: { diligence: 1 },
    };
  }

  if (actionId === "estate") {
    return {
      logText: "治理家业：金币 +1。",
      effects: { gold: 1 },
    };
  }

  if (actionId === "wander") {
    return resolveWanderEvent();
  }

  return null;
}

function resolveWanderEvent() {
  const table = pickWeighted(eventData.wanderTables);

  if (!table) {
    return {
      logText: "随处走走：今日宫中平静无事。",
      effects: {},
    };
  }

  const event = pickRandom(table.events);

  if (!event) {
    return {
      logText: table.fallbackText || "随处走走：今日宫中平静无事。",
      effects: table.effects || {},
    };
  }

  return {
    id: event.id,
    title: event.title || table.title,
    logText: event.logText || event.body || table.fallbackText,
    effects: Object.assign({}, table.effects || {}, event.effects || {}),
    event,
  };
}

function checkStatEvents() {
  eventData.statEvents.forEach((event) => {
    if (event.once && gameState.triggeredEvents.includes(event.id)) {
      return;
    }

    if (!isTriggerMet(event.trigger)) {
      return;
    }

    if (!passesChance(event.trigger && event.trigger.chance)) {
      return;
    }

    triggerEvent(event);
  });
}

function triggerEvent(event) {
  applyEffects(event.effects);
  addLog(event.logText || `触发事件：【${event.title}】`);

  if (event.once && !gameState.triggeredEvents.includes(event.id)) {
    gameState.triggeredEvents.push(event.id);
  }

  modalQueue.push(event);
}

function isTriggerMet(trigger = {}) {
  const statValue = Number(gameState[trigger.stat] || 0);
  const targetValue = Number(trigger.value || 0);

  if (trigger.operator === ">=") {
    return statValue >= targetValue;
  }

  if (trigger.operator === ">") {
    return statValue > targetValue;
  }

  if (trigger.operator === "===") {
    return statValue === targetValue;
  }

  return false;
}

function passesChance(chance = 1) {
  return Math.random() < Number(chance);
}

function applyEffects(effects = {}) {
  Object.entries(effects).forEach(([key, value]) => {
    if (!(key in gameState)) {
      return;
    }

    if (value === "reset") {
      gameState[key] = 0;
      return;
    }

    gameState[key] += Number(value);
  });
}

function showNextModal() {
  if (activeModalEvent || modalQueue.length === 0) {
    renderActionButtons();
    return;
  }

  activeModalEvent = modalQueue.shift();
  elements.eventTitle.textContent = activeModalEvent.title || "事件";
  elements.eventBody.textContent = activeModalEvent.body || "事件正文待填写。";
  elements.eventImageSlot.textContent = activeModalEvent.image || "";
  elements.eventRewards.innerHTML = renderRewards(activeModalEvent.rewards);
  elements.eventOptions.innerHTML = renderOptions(activeModalEvent.options);
  elements.eventModal.hidden = false;
  renderActionButtons();
}

function closeEventModal() {
  elements.eventModal.hidden = true;
  activeModalEvent = null;
  renderActionButtons();
  showNextModal();
  saveGame();
}

function renderRewards(rewards = []) {
  if (!Array.isArray(rewards) || rewards.length === 0) {
    return "";
  }

  return rewards
    .map((reward) => `<p>${escapeHtml(reward)}</p>`)
    .join("");
}

function renderOptions(options = []) {
  if (!Array.isArray(options) || options.length === 0) {
    return "";
  }

  return options
    .map((option) => `<button type="button" disabled>${escapeHtml(option.label || option.text || "选项")}</button>`)
    .join("");
}

function addLog(text) {
  const entry = {
    day: gameState.day,
    text,
    createdAt: new Date().toISOString(),
  };

  gameState.todayLogs.push(entry);
  gameState.historyLogs.push(entry);
}

function endDay() {
  gameState.day += 1;
  gameState.actionPoints = MAX_ACTION_POINTS;
  gameState.todayLogs = [];
  addLog(`Day ${gameState.day} 开始。行动力恢复至 ${MAX_ACTION_POINTS}。`);
}

function pickWeighted(items = []) {
  const totalWeight = items.reduce((sum, item) => sum + Number(item.weight || 0), 0);

  if (totalWeight <= 0) {
    return null;
  }

  let roll = Math.random() * totalWeight;

  for (const item of items) {
    roll -= Number(item.weight || 0);

    if (roll <= 0) {
      return item;
    }
  }

  return items[items.length - 1] || null;
}

function pickRandom(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
