const SAVE_KEY = "vichirDailySave";
const MODE_KEY = "vichirDailyUiMode";
const SCRIPT_VERSION = "2026.06.25-compat-1";
const SAVE_VERSION = 2;
const MAX_ACTION_POINTS = 3;
const EVENT_DATA_URL = "data/events.json";
const STAT_LABELS = {
  diligence: "勤政",
  vision: "灵视",
  gold: "金币",
  madness: "疯狂",
};
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
  madness: 0,
  todayLogs: [],
  historyLogs: [],
  triggeredEvents: [],
  triggeredDiligenceRewardStages: [],
  todayStatChanges: {},
  todayTriggeredEvents: [],
  dayEndPending: false,
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
      id: "sultan_reward_1",
      type: "diligenceReward",
      stage: 1,
      title: "苏丹的奖励Ⅰ",
      body: "占位文本：你的勤政达到新的阶段，苏丹赐下第一份奖励。",
      logText: "事件触发：【苏丹的奖励Ⅰ】。",
      effects: {},
      options: [],
      rewards: [],
      image: "",
    },
    {
      id: "sultan_reward_2",
      type: "diligenceReward",
      stage: 2,
      title: "苏丹的奖励Ⅱ",
      body: "占位文本：你的勤政再次得到苏丹嘉许。",
      logText: "事件触发：【苏丹的奖励Ⅱ】。",
      effects: {},
      options: [],
      rewards: [],
      image: "",
    },
    {
      id: "sultan_reward_3",
      type: "diligenceReward",
      stage: 3,
      title: "苏丹的奖励Ⅲ",
      body: "占位文本：你的勤政第三次被写入宫廷记录。",
      logText: "事件触发：【苏丹的奖励Ⅲ】。",
      effects: {},
      options: [],
      rewards: [],
      image: "",
    },
    {
      id: "sultan_reward_template",
      type: "diligenceRewardTemplate",
      titleTemplate: "苏丹的奖励{stage}",
      body: "占位文本：你的勤政继续累积，苏丹再次给予奖励。",
      logTextTemplate: "事件触发：【苏丹的奖励{stage}】。",
      effects: {},
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
    {
      id: "abyss_invitation",
      title: "深渊的邀请",
      body: "占位文本：深处传来一封只属于邪恶化身的请柬。",
      logText: "事件触发：【深渊的邀请】。",
      trigger: {
        stat: "vision",
        operator: ">=",
        value: 3,
        chance: 1,
      },
      effects: {
        vision: "reset",
        madness: 1,
      },
      options: [],
      rewards: [],
      image: "",
      evilOnly: true,
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
  madnessRow: document.getElementById("madnessRow"),
  madnessText: document.getElementById("madnessText"),
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
  dayEndModal: document.getElementById("dayEndModal"),
  dayEndTitle: document.getElementById("dayEndTitle"),
  dayEndBody: document.getElementById("dayEndBody"),
  nextDayButton: document.getElementById("nextDayButton"),
  devToggleButton: document.getElementById("devToggleButton"),
  devPanel: document.getElementById("devPanel"),
  devButtons: document.querySelectorAll("[data-dev-action]"),
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
  elements.nextDayButton.addEventListener("click", enterNextDay);
  elements.devToggleButton.addEventListener("click", toggleDevPanel);
  elements.devButtons.forEach((button) => {
    button.addEventListener("click", () => handleDevAction(button.dataset.devAction));
  });
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
    triggeredDiligenceRewardStages: [],
    todayStatChanges: {},
    todayTriggeredEvents: [],
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
    triggeredDiligenceRewardStages: Array.isArray(state.triggeredDiligenceRewardStages)
      ? state.triggeredDiligenceRewardStages
      : [],
    todayStatChanges: state.todayStatChanges && typeof state.todayStatChanges === "object" ? state.todayStatChanges : {},
    todayTriggeredEvents: Array.isArray(state.todayTriggeredEvents) ? state.todayTriggeredEvents : [],
    dayEndPending: Boolean(state.dayEndPending),
  });
}

function loadUiMode() {
  const savedMode = readStorage(MODE_KEY);

  return UI_MODES[savedMode] ? savedMode : "";
}

// 事件正式编辑请优先修改 data/events.json。
// 当用户双击 index.html 运行时，部分浏览器会阻止 fetch 读取本地 JSON；
// 这种情况下才会使用 DEFAULT_EVENT_DATA 作为兜底，避免游戏完全无法运行。
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
  elements.madnessText.textContent = gameState.madness;
  elements.madnessRow.hidden = selectedUiMode !== "evil";

  renderTodayLog();
  renderActionButtons();
  renderDevVisibility();

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
  const disabled = gameState.actionPoints <= 0 || !elements.eventModal.hidden || !elements.dayEndModal.hidden;

  document.querySelectorAll(".action-card").forEach((button) => {
    button.disabled = disabled;
  });
}

function renderDevVisibility() {
  elements.devButtons.forEach((button) => {
    if (button.classList.contains("evil-only")) {
      button.hidden = selectedUiMode !== "evil";
    }
  });
}

function performAction(actionId) {
  if (gameState.actionPoints <= 0) {
    prepareDayEnd();
    saveGame();
    render();
    showNextModal();
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
    prepareDayEnd();
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
  checkDiligenceRewardEvents();
  checkVisionEvents();

  eventData.statEvents.forEach((event) => {
    if (event.type === "diligenceReward" || event.type === "diligenceRewardTemplate") {
      return;
    }

    if (event.id === "fluffy_promise" || event.id === "abyss_invitation") {
      return;
    }

    if (event.evilOnly && selectedUiMode !== "evil") {
      return;
    }

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

function checkVisionEvents() {
  if (Number(gameState.vision || 0) < 3) {
    return;
  }

  if (selectedUiMode === "evil") {
    const eventId = Math.random() < 0.7 ? "fluffy_promise" : "abyss_invitation";
    const event = findEventById(eventId);

    if (event) {
      triggerEvent(event);
    }

    return;
  }

  const fluffyEvent = findEventById("fluffy_promise");

  if (fluffyEvent) {
    triggerEvent(fluffyEvent);
  }
}

function checkDiligenceRewardEvents() {
  const maxStage = Math.floor(Number(gameState.diligence || 0) / 10);

  for (let stage = 1; stage <= maxStage; stage += 1) {
    if (gameState.triggeredDiligenceRewardStages.includes(stage)) {
      continue;
    }

    const event = getDiligenceRewardEvent(stage);
    gameState.triggeredDiligenceRewardStages.push(stage);
    triggerEvent(event);
  }
}

function getDiligenceRewardEvent(stage) {
  const exactEvent = eventData.statEvents.find((event) => event.type === "diligenceReward" && Number(event.stage) === stage);

  if (exactEvent) {
    return exactEvent;
  }

  const template = eventData.statEvents.find((event) => event.type === "diligenceRewardTemplate") || {};
  const stageText = toRomanStage(stage);
  const title = (template.titleTemplate || "苏丹的奖励{stage}").replace("{stage}", stageText);
  const logText = (template.logTextTemplate || "事件触发：【苏丹的奖励{stage}】。").replace("{stage}", stageText);

  return Object.assign({}, template, {
    id: `sultan_reward_${stage}`,
    type: "diligenceReward",
    stage,
    title,
    logText,
    body: template.body || "占位文本：你的勤政继续累积，苏丹再次给予奖励。",
    effects: template.effects || {},
  });
}

function triggerEvent(event) {
  applyEffects(event.effects);
  addLog(event.logText || `触发事件：【${event.title}】`);
  recordTriggeredEventForToday(event.title || "未命名事件");

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
      recordStatChange(key, -Number(gameState[key] || 0));
      gameState[key] = 0;
      return;
    }

    const amount = Number(value);
    gameState[key] += amount;
    recordStatChange(key, amount);
  });
}

function recordStatChange(stat, amount) {
  if (!amount || Number.isNaN(amount)) {
    return;
  }

  gameState.todayStatChanges[stat] = Number(gameState.todayStatChanges[stat] || 0) + amount;
}

function recordTriggeredEventForToday(title) {
  gameState.todayTriggeredEvents.push(title);
}

function showNextModal() {
  if (activeModalEvent || modalQueue.length === 0) {
    if (!activeModalEvent && modalQueue.length === 0 && gameState.dayEndPending) {
      showDayEndModal();
    }

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

function prepareDayEnd() {
  gameState.dayEndPending = true;
}

function showDayEndModal() {
  elements.dayEndTitle.textContent = `Day ${gameState.day} 结束`;
  elements.dayEndBody.innerHTML = renderDayEndSummary();
  elements.dayEndModal.hidden = false;
  renderActionButtons();
}

function renderDayEndSummary() {
  return [
    renderSummarySection("今日行动摘要", gameState.todayLogs.map((log) => log.text)),
    renderSummarySection("今日数值变化", formatStatChanges()),
    renderSummarySection("今日触发事件", gameState.todayTriggeredEvents),
  ].join("");
}

function renderSummarySection(title, items) {
  const listItems = items.length > 0 ? items : ["无"];

  return `
    <section class="day-end-section">
      <h3>${escapeHtml(title)}</h3>
      <ul>
        ${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function formatStatChanges() {
  return Object.entries(gameState.todayStatChanges)
    .filter(([, value]) => Number(value) !== 0)
    .map(([stat, value]) => {
      const sign = Number(value) > 0 ? "+" : "";
      return `${STAT_LABELS[stat] || stat} ${sign}${value}`;
    });
}

function enterNextDay() {
  elements.dayEndModal.hidden = true;
  gameState.day += 1;
  gameState.actionPoints = MAX_ACTION_POINTS;
  gameState.todayLogs = [];
  gameState.todayStatChanges = {};
  gameState.todayTriggeredEvents = [];
  gameState.dayEndPending = false;
  addLog(`Day ${gameState.day} 开始。行动力恢复至 ${MAX_ACTION_POINTS}。`);
  saveGame();
  render();
  showNextModal();
}

function endDay() {
  enterNextDay();
}

function toggleDevPanel() {
  elements.devPanel.hidden = !elements.devPanel.hidden;
  renderDevVisibility();
}

function handleDevAction(action) {
  if (action === "reset-save") {
    resetToModeSelection();
    return;
  }

  if (action === "diligence") {
    applyEffects({ diligence: 1 });
    addLog("开发者模式：勤政 +1。");
    checkStatEvents();
  }

  if (action === "vision") {
    applyEffects({ vision: 1 });
    addLog("开发者模式：灵视 +1。");
    checkStatEvents();
  }

  if (action === "gold") {
    applyEffects({ gold: 1 });
    addLog("开发者模式：金币 +1。");
    checkStatEvents();
  }

  if (action === "madness" && selectedUiMode === "evil") {
    applyEffects({ madness: 1 });
    addLog("开发者模式：疯狂 +1。");
    checkStatEvents();
  }

  if (action === "restore-ap") {
    gameState.actionPoints = MAX_ACTION_POINTS;
    gameState.dayEndPending = false;
    elements.dayEndModal.hidden = true;
    addLog(`开发者模式：行动力恢复至 ${MAX_ACTION_POINTS}。`);
  }

  if (action === "next-day") {
    addLog("开发者模式：直接进入下一天。");
    enterNextDay();
    return;
  }

  if (action === "sultan-1") {
    triggerManualEvent(getDiligenceRewardEvent(1));
  }

  if (action === "fluffy") {
    triggerManualEvent(findEventById("fluffy_promise"));
  }

  if (action === "abyss" && selectedUiMode === "evil") {
    triggerManualEvent(findEventById("abyss_invitation"));
  }

  saveGame();
  render();
  showNextModal();
}

function triggerManualEvent(event) {
  if (!event) {
    return;
  }

  triggerEvent(event);
}

function findEventById(id) {
  return eventData.statEvents.find((event) => event.id === id) || null;
}

function resetToModeSelection() {
  removeStorage(SAVE_KEY);
  removeStorage(MODE_KEY);
  savedGameAvailable = false;
  gameState = createDefaultState();
  selectedUiMode = "";
  modalQueue = [];
  activeModalEvent = null;
  elements.eventModal.hidden = true;
  elements.dayEndModal.hidden = true;
  elements.devPanel.hidden = true;
  beginNewGame();
}

function toRomanStage(value) {
  const numerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];
  let number = Number(value);
  let result = "";

  numerals.forEach(([symbol, amount]) => {
    while (number >= amount) {
      result += symbol;
      number -= amount;
    }
  });

  return result || String(value);
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
