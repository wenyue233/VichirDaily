const SAVE_KEY = "vichirDailySave";
const MAX_ACTION_POINTS = 3;
const EVENT_DATA_URL = "data/events.json";

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

let gameState = loadGame();
let eventData = {
  wanderTables: [],
  statEvents: [],
};
let modalQueue = [];
let activeModalEvent = null;

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
};

init();

async function init() {
  eventData = await loadEventData();
  renderActions();
  bindUiEvents();
  render();
}

function bindUiEvents() {
  elements.historyButton.addEventListener("click", () => {
    elements.historyPanel.hidden = !elements.historyPanel.hidden;
    renderHistory();
  });

  elements.eventConfirmButton.addEventListener("click", closeEventModal);
}

function createDefaultState() {
  return {
    ...defaultState,
    todayLogs: [],
    historyLogs: [],
    triggeredEvents: [],
  };
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);

  if (!saved) {
    return createDefaultState();
  }

  try {
    return {
      ...createDefaultState(),
      ...JSON.parse(saved),
    };
  } catch (error) {
    console.warn("存档读取失败，已使用默认状态。", error);
    return createDefaultState();
  }
}

async function loadEventData() {
  try {
    const response = await fetch(EVENT_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`事件数据读取失败：${response.status}`);
    }

    return normalizeEventData(await response.json());
  } catch (error) {
    console.warn("事件数据读取失败。请确认 data/events.json 可被当前浏览器读取。", error);
    addLog("事件数据读取失败：请确认 data/events.json 存在，或使用本地预览服务打开页面。");
    saveGame();
    return normalizeEventData({});
  }
}

function normalizeEventData(data) {
  return {
    wanderTables: Array.isArray(data.wanderTables) ? data.wanderTables : [],
    statEvents: Array.isArray(data.statEvents) ? data.statEvents : [],
  };
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
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
    elements.actionList.appendChild(button);
  });
}

function render() {
  elements.dayText.textContent = `Day ${gameState.day}`;
  elements.modeText.textContent = gameState.mode;
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
    effects: {
      ...(table.effects || {}),
      ...(event.effects || {}),
    },
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

    if (!passesChance(event.trigger?.chance)) {
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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
