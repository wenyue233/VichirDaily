const SAVE_KEY = "vichirDailySave";
const MODE_KEY = "vichirDailyUiMode";
const SCRIPT_VERSION = "2026.06.25-compat-1";
const SAVE_VERSION = 2;
const MAX_ACTION_POINTS = 3;
const EVENT_DATA_URL = "data/events.json";
const SHOP_DATA_URL = "data/shop.json";
const APPEARANCE_DATA_URL = "data/appearance.json";
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

const APPEARANCE_CHARACTER_IDS = ["arzu", "nawfal"];
const HEADWEAR_SLOT = "headwear";
const APPEARANCE_ACCESSORY_SLOTS = [HEADWEAR_SLOT, "veil", "face", "neck", "body", "hand"];
const DEFAULT_MODE_HEADWEAR = {
  normal: "hat_01",
  evil: "hat_02",
};
const APPEARANCE_ID_ALIASES = {
  arzu_hair_short: "hair_short",
  arzu_hair_long: "hair_long",
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
  goldLine: {
    completed: [],
    gold002CompletedDay: null,
  },
  inventory: {},
  unlockedAppearance: {},
  equippedAppearance: {},
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

const DEFAULT_SHOP_DATA = [
  {
    id: "veil_blue",
    name: "海蓝面纱",
    price: 8,
    description: "海蓝色的轻薄面纱，垂落时像一小片安静的潮水。",
    image: "assets/items/item_veil_blue.png",
    useIn: "sultan_reward",
    slot: "",
    equipTargets: [],
    availableIn: ["normal", "evil"],
  },
  {
    id: "lip_piercing_formal",
    name: "庄重唇钉",
    price: 6,
    description: "细小而克制的唇饰，在仪典场合也不会显得轻浮。",
    image: "assets/items/item_lip_piercing.png",
    useIn: "sultan_reward",
    slot: "",
    equipTargets: [],
    availableIn: ["normal", "evil"],
  },
  {
    id: "body_chain_luxury",
    name: "华丽身体链",
    price: 14,
    description: "金色链饰贴合衣袍纹路，行走时会泛起细碎的光。",
    image: "assets/items/item_body_chain.png",
    useIn: "sultan_reward",
    slot: "",
    equipTargets: [],
    availableIn: ["normal", "evil"],
  },
  {
    id: "sapphire",
    name: "蓝宝石",
    price: 10,
    description: "从原石中切割出来的大块蓝宝石，你知道它应属于谁。",
    image: "assets/items/item_sapphire.png",
    useIn: "sultan_reward",
    slot: "",
    equipTargets: [],
    availableIn: ["normal", "evil"],
  },
  {
    id: "nafele_necklace",
    name: "奈费勒的项链？",
    price: 12,
    description: "不，它不应该出现在这个结局。",
    image: "assets/items/item_nafele_necklace.png",
    useIn: "sultan_reward",
    slot: "",
    equipTargets: [],
    availableIn: ["evil"],
  },
  {
    id: "thorn_ring",
    name: "荆棘戒指",
    price: 9,
    description: "一件礼物，一个契约，一枚种子......?",
    image: "assets/items/item_thorn_ring.png",
    useIn: "sultan_reward",
    slot: "",
    equipTargets: [],
    availableIn: ["evil"],
  },
];

const DEFAULT_APPEARANCE_DATA = {
  characters: {
    arzu: {
      id: "arzu",
      name: "阿尔图",
      base: [
        {
          id: "arzu_base",
          name: "阿尔图基础立绘",
          type: "base",
          modes: ["all"],
          image: "assets/appearance/arzu/arzu_base.png",
          unlocked: true,
        },
      ],
      hair: [
        {
          id: "hair_short",
          name: "短发",
          type: "hair",
          defaultUnlocked: true,
          defaultEquipped: true,
          image: "assets/appearance/arzu/arzu_hair_short.png",
          unlocked: true,
        },
        {
          id: "hair_long",
          name: "长发",
          type: "hair",
          defaultUnlocked: true,
          defaultEquipped: false,
          image: "assets/appearance/arzu/arzu_hair_long.png",
          unlocked: true,
        },
      ],
      costume: [],
      accessories: [
        {
          id: "hat_01",
          name: "默认帽子",
          type: "headwear",
          slot: HEADWEAR_SLOT,
          image: "assets/appearance/arzu/hat_01.png",
          unlocked: true,
          defaultUnlocked: true,
        },
        {
          id: "hat_02",
          name: "邪恶模式帽子",
          type: "headwear",
          slot: HEADWEAR_SLOT,
          image: "assets/appearance/arzu/hat_02.png",
          unlocked: true,
          defaultUnlocked: true,
        },
        {
          id: "crown_01",
          name: "头冠",
          type: "headwear",
          slot: HEADWEAR_SLOT,
          image: "assets/appearance/arzu/crown_01.png",
          unlocked: true,
          defaultUnlocked: true,
        },
      ],
    },
    nawfal: {
      id: "nawfal",
      name: "奈费勒",
      base: [
        {
          id: "nawfal_base_default",
          name: "奈费勒基础立绘",
          modes: ["all"],
          image: "",
        },
      ],
      hair: [
        {
          id: "nawfal_hair_short",
          name: "短发",
          defaultUnlocked: true,
          defaultEquipped: true,
          image: "",
        },
        {
          id: "nawfal_hair_long",
          name: "长发",
          defaultUnlocked: false,
          defaultEquipped: false,
          image: "",
        },
      ],
      costume: [],
      accessories: [],
    },
  },
  accessorySlots: APPEARANCE_ACCESSORY_SLOTS,
};

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
        {
          id: "Walk002",
          title: "无事发生",
          body: "过于风平浪静的一天，你开始考虑要不要教贝姬夫人学后空翻。",
          logText: "过于风平浪静的一天，你开始考虑要不要教贝姬夫人学后空翻。",
          options: [],
          rewards: ["无"],
          image: "",
        },
        {
          id: "Walk003",
          title: "无事发生",
          body: "过于风平浪静的一天，你准备夜袭苏丹寝宫来创造一点惊喜。",
          logText: "过于风平浪静的一天，你准备夜袭苏丹寝宫来创造一点惊喜。",
          options: [],
          rewards: ["无"],
          image: "",
        },
        {
          id: "Walk004",
          title: "无事发生",
          body: "过于风平浪静的一天，你觉得还不如回去整理议案。",
          logText: "过于风平浪静的一天，你觉得还不如回去整理议案。",
          options: [],
          rewards: ["无"],
          image: "",
        },
        {
          id: "Walk005",
          title: "稀客",
          body: "马尔基娜来访了。她是来询问你对那件安眠袍子的感受的。……真是谢谢了啊。",
          logText: "马尔基娜来访了。她是来询问你对那件安眠袍子的感受的。……真是谢谢了啊。",
          options: [],
          rewards: ["无"],
          image: "",
        },
        {
          id: "Walk006",
          title: "无事发生",
          body: "过于风平浪静的一天，你决定去书店听听阿萨尔和他的出版计划，希望不要有麻烦事找上你。",
          logText: "过于风平浪静的一天，你决定去书店听听阿萨尔和他的出版计划，希望不要有麻烦事找上你。",
          options: [],
          rewards: ["无"],
          image: "",
        },
        {
          id: "Walk007",
          title: "摸鱼被抓",
          body: "在花园的一觉睡得太开心了。当你掀开不知何时被盖在身上的长袍时，天已经黑了。",
          logText: "在花园的一觉睡得太开心了。当你掀开不知何时被盖在身上的长袍时，天已经黑了。",
          options: [],
          rewards: ["勤政 -1"],
          image: "",
          note: "如果当前勤政值大于 0，则勤政 -1。\n如果当前勤政值已经为 0，则本事件不扣除勤政（不要出现负数）。",
        },
        {
          id: "Walk008",
          title: "带薪摸鱼",
          body: "就算是议长也要午休！在你的强烈抗议下，你和仁慈的至高苏丹一起享用了下午茶。",
          logText: "就算是议长也要午休！在你的强烈抗议下，你和仁慈的至高苏丹一起享用了下午茶。",
          options: [],
          rewards: ["无"],
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
        {
          id: "Walk001",
          title: "家贼难防",
          body: "你和你的苏丹总是为这样那样的事奔波，很久才能碰上一面；但偶尔，书桌上消失的点心会告诉你某人来过。",
          logText: "你和你的苏丹总是为这样那样的事奔波，很久才能碰上一面；但偶尔，书桌上消失的点心会告诉你某人来过。",
          options: [],
          rewards: ["金币＋1"],
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
  goldLineEvents: [
    {
      id: "Gold001",
      type: "goldLine",
      title: "天使投资人Ⅰ",
      body: "你收到了来自苗圃的信件。你让阿里木偶尔代理校长的位置，他也时不时给你分享孩子们的近况。看来，被玛希尔的教育理念打动的孩子不在少数—手工课的材料开销也是大大增加了！老阿里木表示自己对合法渠道弄来金币没有头绪，所以，议长大人愿意成为这位\"天使投资人\"吗？",
      trigger: {
        id: "Gold001",
        requiresGold: 3,
        requiresIncomplete: "Gold001",
      },
      options: [
        {
          label: "总之先拨款",
          resultText: "你当然不介意满足孩子们的好奇心。",
          effects: {
            gold: -2,
            completeGoldEvent: "Gold001",
            unlockGoldEvent: "Gold002",
          },
          effectText: "金币 -2\n解锁 Gold002 \nGold001 标记为已完成 ",
        },
        {
          label: "我再想想",
          resultText: "繁忙的公务使你把这封信暂时搁置到了书架上。",
          effects: {},
          effectText: "本次不消耗金币 \nGold001 不标记完成 \n后续满足触发条件时，仍有概率再次触发 Gold001 ",
        },
      ],
      rewards: [],
      image: "",
      note: "这是金币线的起始事件。\n选择“我再想想”不会关闭剧情线，只是暂时放弃，本事件以后仍可能再次出现。",
    },
    {
      id: "Gold002",
      type: "goldLine",
      title: "天使投资人Ⅱ",
      body: "又是一封来自苗圃的信件，署名来自你们上次看望过的孩子。歪歪扭扭的字迹也难掩激动的心情，看来，你们亲手栽下的幼苗，正在茁壮成长。",
      trigger: {
        id: "Gold002",
        requiresCompleted: "Gold001",
        requiresGold: 8,
        requiresIncomplete: "Gold002",
      },
      options: [
        {
          label: "继续资助",
          resultText: "你乐意看到更多的结果",
          effects: {
            gold: -4,
            completeGoldEvent: "Gold002",
            unlockGoldEvent: "Gold003",
            setGold002CompletedDay: true,
          },
          effectText: "金币 -4\n解锁 Gold003 \nGold002 标记为已完成 ",
        },
        {
          label: "暂缓投资",
          resultText: "你在想要不要先挑个时间和你的陛下分享这件事。",
          effects: {},
          effectText: "本次不消耗金币 \nGold002 不标记完成 \n后续满足触发条件时，仍有概率再次触发 Gold002 ",
        },
      ],
      rewards: [],
      image: "",
      unlockText: "Gold003（仅限选择“继续资助”后解锁）",
      note: "如果玩家选择暂缓投资，本事件不会结束，以后仍可能再次出现，直到玩家真正决定继续投资。",
    },
    {
      id: "Gold003",
      type: "goldLine",
      title: "天使投资人Ⅲ",
      body: "你收到了成果汇报的邀请函。同时，孩孩子们希望你能带走一份属于他们努力的证明。",
      trigger: {
        id: "Gold003",
        requiresCompleted: "Gold002",
        requiresIncomplete: "Gold003",
        minDaysAfterGold002: 7,
      },
      options: [
        {
          label: "混合动力小帆船（的罗盘）",
          resultText: "谁来了都会惊讶的成果！虽然不精于操作，让你们废了好大功夫才返航，但毫无疑问，这是让人心情畅快的一天。",
          effects: {
            completeGoldEvent: "Gold003",
            item: {
              name: "给投资人的回礼",
              amount: 1,
            },
          },
          effectText: "获得 给投资人的回礼x1（你迫不及待想展示给奈费勒看了）",
        },
        {
          label: "微缩模型",
          resultText: "谁来了都会惊讶的成果！虽然不精于操作，让你们废了好大功夫才返航，但毫无疑问，这是让人心情畅快的一天。",
          effects: {
            completeGoldEvent: "Gold003",
            item: {
              name: "给投资人的回礼",
              amount: 1,
            },
          },
          effectText: "获得 给投资人的回礼x1（你迫不及待想展示给奈费勒看了）",
        },
      ],
      rewards: ["获得 给投资人的回礼x1（你迫不及待想展示给奈费勒看了）"],
      image: "",
    },
  ],
};

let savedGameAvailable = hasSavedGame();
let appearanceData = cloneAppearanceData(DEFAULT_APPEARANCE_DATA);
let appearanceAssetsPreloaded = false;
let gameState = createDefaultState();
let eventData = {
  wanderTables: [],
  statEvents: [],
  goldLineEvents: [],
};
let selectedUiMode = "";
let modalQueue = [];
let activeModalEvent = null;
let activeModalResultMode = false;
let shopItems = [];
let eventDataSource = "unloaded";
let diligenceButtonBound = false;
let selectedAppearanceCharacter = "arzu";
const preloadedImageUrls = new Set();

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
  shopButton: document.getElementById("shopButton"),
  appearanceButton: document.getElementById("appearanceButton"),
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
  shopModal: document.getElementById("shopModal"),
  shopGrid: document.getElementById("shopGrid"),
  shopGoldText: document.getElementById("shopGoldText"),
  shopCloseButton: document.getElementById("shopCloseButton"),
  appearanceModal: document.getElementById("appearanceModal"),
  appearanceTabs: document.getElementById("appearanceTabs"),
  appearanceContent: document.getElementById("appearanceContent"),
  appearanceCloseButton: document.getElementById("appearanceCloseButton"),
  devToggleButton: document.getElementById("devToggleButton"),
  devPanel: document.getElementById("devPanel"),
  devButtons: document.querySelectorAll("[data-dev-action]"),
};

init();

async function init() {
  eventData = await loadEventData();
  shopItems = await loadShopData();
  appearanceData = await loadAppearanceData();
  gameState = normalizeGameState(gameState);
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

  elements.shopButton.addEventListener("click", openShopModal);
  elements.shopCloseButton.addEventListener("click", closeShopModal);
  elements.appearanceButton.addEventListener("click", openAppearanceModal);
  elements.appearanceCloseButton.addEventListener("click", closeAppearanceModal);
  elements.appearanceTabs.addEventListener("click", handleAppearanceTabClick);
  elements.appearanceContent.addEventListener("click", handleAppearanceChoiceClick);
  elements.eventConfirmButton.addEventListener("click", closeEventModal);
  elements.eventOptions.addEventListener("click", handleEventOptionClick);
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
    goldLine: {
      completed: [],
      gold002CompletedDay: null,
    },
    inventory: {},
    unlockedAppearance: createDefaultUnlockedAppearance(),
    equippedAppearance: createDefaultEquippedAppearance(),
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
    goldLine: normalizeGoldLineState(state.goldLine),
    inventory: state.inventory && typeof state.inventory === "object" ? state.inventory : {},
    unlockedAppearance: normalizeUnlockedAppearance(state.unlockedAppearance),
    equippedAppearance: normalizeEquippedAppearance(state.equippedAppearance, state.unlockedAppearance),
  });
}

function normalizeGoldLineState(goldLine = {}) {
  return {
    completed: Array.isArray(goldLine.completed) ? goldLine.completed : [],
    gold002CompletedDay: Number.isFinite(Number(goldLine.gold002CompletedDay)) ? Number(goldLine.gold002CompletedDay) : null,
  };
}

function getAppearanceCharacters() {
  return appearanceData && appearanceData.characters ? appearanceData.characters : DEFAULT_APPEARANCE_DATA.characters;
}

function getAppearanceCharacter(characterId) {
  return getAppearanceCharacters()[characterId] || null;
}

function getAppearanceItems(characterId, category) {
  const character = getAppearanceCharacter(characterId);

  return character && Array.isArray(character[category]) ? character[category] : [];
}

function createEmptyAccessorySlots() {
  return APPEARANCE_ACCESSORY_SLOTS.reduce((slots, slot) => {
    slots[slot] = "";
    return slots;
  }, {});
}

function createDefaultUnlockedAppearance() {
  return APPEARANCE_CHARACTER_IDS.reduce((result, characterId) => {
    result[characterId] = {
      hair: getAppearanceItems(characterId, "hair")
        .filter((item) => item.defaultUnlocked)
        .map((item) => item.id),
      costume: getAppearanceItems(characterId, "costume")
        .filter((item) => item.defaultUnlocked)
        .map((item) => item.id),
      accessories: getAppearanceItems(characterId, "accessories")
        .filter((item) => item.defaultUnlocked)
        .map((item) => item.id),
    };
    return result;
  }, {});
}

function createDefaultEquippedAppearance() {
  return APPEARANCE_CHARACTER_IDS.reduce((result, characterId) => {
    const defaultHair = getAppearanceItems(characterId, "hair").find((item) => item.defaultEquipped);
    const defaultCostume = getAppearanceItems(characterId, "costume").find((item) => item.defaultEquipped);

    result[characterId] = {
      hair: defaultHair ? defaultHair.id : "",
      costume: defaultCostume ? defaultCostume.id : "",
      headwear: null,
      accessories: createEmptyAccessorySlots(),
    };
    return result;
  }, {});
}

function normalizeUnlockedAppearance(saved = {}) {
  const defaults = createDefaultUnlockedAppearance();

  APPEARANCE_CHARACTER_IDS.forEach((characterId) => {
    const savedCharacter = saved && saved[characterId] && typeof saved[characterId] === "object" ? saved[characterId] : {};

    ["hair", "costume", "accessories"].forEach((category) => {
      const validIds = getAppearanceItems(characterId, category).map((item) => item.id);
      const savedIds = Array.isArray(savedCharacter[category]) ? savedCharacter[category] : [];
      defaults[characterId][category] = Array.from(
        new Set(defaults[characterId][category].concat(savedIds.filter((id) => validIds.includes(id))))
      );
    });
  });

  return defaults;
}

function normalizeEquippedAppearance(saved = {}, savedUnlocked = {}) {
  const unlocked = normalizeUnlockedAppearance(savedUnlocked);
  const defaults = createDefaultEquippedAppearance();

  APPEARANCE_CHARACTER_IDS.forEach((characterId) => {
    const savedCharacter = saved && saved[characterId] && typeof saved[characterId] === "object" ? saved[characterId] : {};
    const savedHair = normalizeAppearanceId(savedCharacter.hair);
    const savedCostume = normalizeAppearanceId(savedCharacter.costume);

    if (unlocked[characterId].hair.includes(savedHair)) {
      defaults[characterId].hair = savedHair;
    }

    if (unlocked[characterId].costume.includes(savedCostume)) {
      defaults[characterId].costume = savedCostume;
    }

    const savedAccessories =
      savedCharacter.accessories && typeof savedCharacter.accessories === "object" ? savedCharacter.accessories : {};
    const savedHeadwear = normalizeAppearanceId(savedCharacter.headwear);

    APPEARANCE_ACCESSORY_SLOTS.forEach((slot) => {
      const appearanceId = normalizeAppearanceId(savedAccessories[slot]);
      if (appearanceId && unlocked[characterId].accessories.includes(appearanceId)) {
        defaults[characterId].accessories[slot] = appearanceId;
      }
    });

    if (savedHeadwear && unlocked[characterId].accessories.includes(savedHeadwear)) {
      defaults[characterId].accessories[HEADWEAR_SLOT] = savedHeadwear;
      defaults[characterId].headwear = savedHeadwear;
    } else {
      defaults[characterId].headwear = defaults[characterId].accessories[HEADWEAR_SLOT] || null;
    }
  });

  return defaults;
}

function normalizeAppearanceId(appearanceId) {
  if (!appearanceId) {
    return "";
  }

  const id = String(appearanceId);

  return APPEARANCE_ID_ALIASES[id] || id;
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
    goldLineEvents: Array.isArray(data.goldLineEvents) ? data.goldLineEvents : [],
  };
}

function cloneEventData(data) {
  return normalizeEventData(JSON.parse(JSON.stringify(data)));
}

// 正式编辑角色装扮时优先修改 data/appearance.json。
// 直接双击 index.html 时，部分浏览器会阻止 fetch 读取本地 JSON；失败时使用这里的 fallback。
async function loadAppearanceData() {
  try {
    const response = await fetch(APPEARANCE_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`装扮数据读取失败：${response.status}`);
    }

    return normalizeAppearanceData(await response.json());
  } catch (error) {
    console.warn("装扮数据读取失败，请确认 data/appearance.json 可被当前浏览器读取。", error);
    return cloneAppearanceData(DEFAULT_APPEARANCE_DATA);
  }
}

function normalizeAppearanceData(data) {
  const characters = data && data.characters && typeof data.characters === "object" ? data.characters : {};
  const normalized = {
    characters: {},
    accessorySlots: APPEARANCE_ACCESSORY_SLOTS,
  };

  APPEARANCE_CHARACTER_IDS.forEach((characterId) => {
    const fallback = DEFAULT_APPEARANCE_DATA.characters[characterId];
    const source = characters[characterId] || fallback;

    normalized.characters[characterId] = {
      id: characterId,
      name: source.name || fallback.name,
      base: normalizeAppearanceItems(source.base || fallback.base),
      hair: normalizeAppearanceItems(source.hair || fallback.hair),
      costume: normalizeAppearanceItems(source.costume || fallback.costume),
      accessories: normalizeAppearanceItems(source.accessories || fallback.accessories),
    };
  });

  return normalized;
}

function normalizeAppearanceItems(items = []) {
  return Array.isArray(items)
    ? items
        .filter((item) => item && item.id)
        .map((item) => ({
          id: String(item.id),
          name: item.name ? String(item.name) : String(item.id),
          type: item.type ? String(item.type) : "",
          modes: Array.isArray(item.modes) ? item.modes.map(String) : [],
          slot: item.slot ? String(item.slot) : "",
          image: item.image ? String(item.image) : "",
          inventoryItemId: item.inventoryItemId ? String(item.inventoryItemId) : "",
          equipTargets: Array.isArray(item.equipTargets) ? item.equipTargets.filter((id) => APPEARANCE_CHARACTER_IDS.includes(id)) : [],
          unlocked: Boolean(item.unlocked),
          defaultUnlocked: Boolean(item.defaultUnlocked || item.unlocked),
          defaultEquipped: Boolean(item.defaultEquipped),
        }))
    : [];
}

function cloneAppearanceData(data) {
  return normalizeAppearanceData(JSON.parse(JSON.stringify(data)));
}

async function loadShopData() {
  try {
    const response = await fetch(SHOP_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`商店数据读取失败：${response.status}`);
    }

    return normalizeShopData(await response.json());
  } catch (error) {
    console.warn("商店数据读取失败。请确认 data/shop.json 可被当前浏览器读取。", error);
    return cloneShopData(DEFAULT_SHOP_DATA);
  }
}

function normalizeShopData(data) {
  const items = Array.isArray(data) ? data : data && Array.isArray(data.items) ? data.items : [];

  return items
    .filter((item) => item && item.id && item.name && item.image)
    .map((item) => ({
      id: String(item.id),
      name: String(item.name),
      description: item.description ? String(item.description) : "",
      price: Math.max(0, Number(item.price || 0)),
      image: String(item.image),
      useIn: item.useIn ? String(item.useIn) : "",
      slot: item.slot ? String(item.slot) : "",
      equipTargets: Array.isArray(item.equipTargets) ? item.equipTargets.filter((id) => APPEARANCE_CHARACTER_IDS.includes(id)) : [],
      availableIn: Array.isArray(item.availableIn)
        ? item.availableIn.filter((mode) => UI_MODES[mode])
        : ["normal", "evil"],
    }));
}

function cloneShopData(data) {
  return normalizeShopData(JSON.parse(JSON.stringify(data)));
}

function openShopModal() {
  renderShop();
  elements.shopModal.hidden = false;
}

function closeShopModal() {
  elements.shopModal.hidden = true;
}

function openAppearanceModal() {
  selectedAppearanceCharacter = selectedAppearanceCharacter || "arzu";
  elements.appearanceModal.hidden = false;
  renderAppearance();
  preloadUnequippedAppearanceAssetsOnce();
}

function closeAppearanceModal() {
  elements.appearanceModal.hidden = true;
}

function handleAppearanceTabClick(event) {
  const button = event.target.closest("[data-appearance-character]");

  if (!button) {
    return;
  }

  selectedAppearanceCharacter = button.dataset.appearanceCharacter;
  renderAppearance();
}

function handleAppearanceChoiceClick(event) {
  const button = event.target.closest("[data-appearance-choice]");

  if (!button) {
    return;
  }

  const category = button.dataset.appearanceCategory;
  const appearanceId = button.dataset.appearanceChoice;

  equipAppearance(selectedAppearanceCharacter, category, appearanceId, {
    slot: button.dataset.appearanceSlot || "",
  });
}

function renderAppearance() {
  if (!elements.appearanceTabs || !elements.appearanceContent) {
    return;
  }

  elements.appearanceTabs.innerHTML = APPEARANCE_CHARACTER_IDS.map((characterId) => {
    const character = getAppearanceCharacter(characterId);
    const active = selectedAppearanceCharacter === characterId ? " is-active" : "";
    return `<button class="appearance-tab${active}" type="button" data-appearance-character="${characterId}">${escapeHtml(character.name)}</button>`;
  }).join("");

  const character = getAppearanceCharacter(selectedAppearanceCharacter);
  const currentMode = selectedUiMode || loadUiMode() || "normal";
  const renderState = getCharacterRenderState(selectedAppearanceCharacter, currentMode);
  const baseItem = getAppearanceItem(selectedAppearanceCharacter, "base", renderState.base);
  const hairItem = getAppearanceItem(selectedAppearanceCharacter, "hair", renderState.hair);
  const headwearItem = getResolvedHeadwearItem(selectedAppearanceCharacter, currentMode);

  if (elements.appearanceContent.dataset.characterId !== selectedAppearanceCharacter) {
    elements.appearanceContent.dataset.characterId = selectedAppearanceCharacter;
    elements.appearanceContent.innerHTML = `
      <section class="appearance-current">
        <div class="appearance-preview" aria-label="${escapeHtml(character.name)} 当前装扮预览">
          <img class="appearance-layer" data-appearance-layer="hair" alt="发型" decoding="async">
          <img class="appearance-layer" data-appearance-layer="base" alt="基础立绘" decoding="async">
          <img class="appearance-layer" data-appearance-layer="headwear" alt="头饰" decoding="async">
        </div>
        <div class="appearance-current-summary">
          <h3></h3>
          <dl class="appearance-summary-list">
            <div>
              <dt>发型</dt>
              <dd data-appearance-summary="hair">未装备</dd>
            </div>
            <div>
              <dt>头饰</dt>
              <dd data-appearance-summary="headwear">未装备</dd>
            </div>
          </dl>
        </div>
      </section>
      <div data-appearance-section="hair"></div>
      <div data-appearance-section="costume"></div>
      <div data-appearance-section="accessories"></div>
    `;
  }

  updateAppearanceLayer("base", baseItem, "基础立绘");
  updateAppearanceLayer("hair", hairItem, "发型");
  updateAppearanceLayer("headwear", headwearItem, "头饰");
  updateAppearanceHairLayerOrder(hairItem);
  updateAppearanceSummary(character, hairItem, headwearItem, renderState);
  updateAppearanceSections(selectedAppearanceCharacter);
}

function updateAppearanceHairLayerOrder(hairItem) {
  const preview = elements.appearanceContent.querySelector(".appearance-preview");

  if (!preview) {
    return;
  }

  preview.classList.toggle("portrait--short-hair", Boolean(hairItem && hairItem.id === "hair_short"));
  preview.classList.toggle("portrait--long-hair", Boolean(hairItem && hairItem.id === "hair_long"));
}

function updateAppearanceLayer(layerName, item, label) {
  const image = elements.appearanceContent.querySelector(`[data-appearance-layer="${layerName}"]`);

  if (!image) {
    return;
  }

  const nextSrc = item && item.image ? item.image : "";

  image.alt = label;
  if (image.getAttribute("src") !== nextSrc) {
    if (nextSrc) {
      image.src = nextSrc;
    } else {
      image.removeAttribute("src");
    }
  }
}

function updateAppearanceSummary(character, hairItem, headwearItem, renderState) {
  const title = elements.appearanceContent.querySelector(".appearance-current-summary h3");
  const hair = elements.appearanceContent.querySelector('[data-appearance-summary="hair"]');
  const headwear = elements.appearanceContent.querySelector('[data-appearance-summary="headwear"]');

  if (title) {
    title.textContent = character.name;
  }

  if (hair) {
    hair.textContent = hairItem ? hairItem.name : renderState.hair || "未装备";
  }

  if (headwear) {
    headwear.textContent = headwearItem ? headwearItem.name : "未装备";
  }
}

function updateAppearanceSections(characterId) {
  const hairSection = elements.appearanceContent.querySelector('[data-appearance-section="hair"]');
  const costumeSection = elements.appearanceContent.querySelector('[data-appearance-section="costume"]');
  const accessoriesSection = elements.appearanceContent.querySelector('[data-appearance-section="accessories"]');

  if (hairSection) {
    hairSection.innerHTML = renderAppearanceCategory(characterId, "hair", "发型");
  }

  if (costumeSection) {
    costumeSection.innerHTML = renderAppearanceCategory(characterId, "costume", "服装");
  }

  if (accessoriesSection) {
    accessoriesSection.innerHTML = renderAppearanceAccessories(characterId);
  }
}

function preloadUnequippedAppearanceAssetsOnce() {
  if (appearanceAssetsPreloaded) {
    return;
  }

  appearanceAssetsPreloaded = true;

  const currentMode = selectedUiMode || loadUiMode() || "normal";
  const renderState = getCharacterRenderState(selectedAppearanceCharacter, currentMode);
  const visibleUrls = new Set(
    [
      getAppearanceItem(selectedAppearanceCharacter, "base", renderState.base),
      getAppearanceItem(selectedAppearanceCharacter, "hair", renderState.hair),
      getResolvedHeadwearItem(selectedAppearanceCharacter, currentMode),
    ]
      .map((item) => (item && item.image ? item.image : ""))
      .filter(Boolean)
  );
  const preloadUrls = getAllAppearanceImageUrls().filter((url) => !visibleUrls.has(url));

  scheduleIdleTask(() => preloadImagesOnce(preloadUrls));
}

function getAllAppearanceImageUrls() {
  const urls = [];

  APPEARANCE_CHARACTER_IDS.forEach((characterId) => {
    ["base", "hair", "costume", "accessories"].forEach((category) => {
      getAppearanceItems(characterId, category).forEach((item) => {
        if (item.image) {
          urls.push(item.image);
        }
      });
    });
  });

  return Array.from(new Set(urls));
}

function preloadImagesOnce(urls) {
  urls.forEach((url) => {
    if (!url || preloadedImageUrls.has(url)) {
      return;
    }

    preloadedImageUrls.add(url);
    const image = new Image();
    image.decoding = "async";
    image.src = url;
  });
}

function scheduleIdleTask(callback) {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 1200 });
    return;
  }

  window.setTimeout(callback, 0);
}

function renderAppearanceCategory(characterId, category, title) {
  const items = getAppearanceItems(characterId, category);

  if (items.length === 0) {
    return `
      <section class="appearance-section">
        <h3>${escapeHtml(title)}</h3>
        <p class="appearance-empty">暂无可选项目。</p>
      </section>
    `;
  }

  return `
    <section class="appearance-section">
      <h3>${escapeHtml(title)}</h3>
      <div class="appearance-choice-list">
        ${items.map((item) => renderAppearanceChoice(characterId, category, item)).join("")}
      </div>
    </section>
  `;
}

function renderAppearanceAccessories(characterId) {
  const items = getAccessoryAppearanceItems(characterId);

  if (items.length === 0) {
    return `
      <section class="appearance-section">
        <h3>饰品</h3>
        <p class="appearance-empty">暂无可装备饰品。</p>
      </section>
    `;
  }

  return `
    <section class="appearance-section">
      <h3>已解锁装饰</h3>
      ${APPEARANCE_ACCESSORY_SLOTS.map((slot) => {
        const slotItems = items.filter((item) => item.slot === slot);
        if (slotItems.length === 0) {
          return "";
        }
        return `
          <div class="appearance-slot">
            <h4>${escapeHtml(slot)}</h4>
            <div class="appearance-choice-list">
              ${renderUnequipAccessoryChoice(characterId, slot)}
              ${slotItems.map((item) => renderAppearanceChoice(characterId, "accessories", item)).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </section>
  `;
}

function renderUnequipAccessoryChoice(characterId, slot) {
  const equipped = getEquippedAppearance(characterId);
  const current = slot === HEADWEAR_SLOT ? equipped.headwear : equipped.accessories[slot];
  const active = current ? "" : " is-equipped";
  const label = slot === HEADWEAR_SLOT ? "使用模式默认" : "不装备";

  return `<button class="appearance-choice${active}" type="button" data-appearance-category="accessories" data-appearance-choice="" data-appearance-slot="${slot}">${label}</button>`;
}

function renderAppearanceChoice(characterId, category, item) {
  const unlocked = isAppearanceUnlocked(characterId, category, item.id);
  const equipped = isAppearanceEquipped(characterId, category, item);
  const lockedClass = unlocked ? "" : " is-locked";
  const equippedClass = equipped ? " is-equipped" : "";
  const disabled = unlocked ? "" : " disabled";
  const status = equipped ? "已装备" : unlocked ? "可装备" : "未解锁";

  return `
    <button class="appearance-choice${lockedClass}${equippedClass}" type="button" data-appearance-category="${category}" data-appearance-choice="${escapeHtml(item.id)}"${disabled}>
      <span>${escapeHtml(item.name)}</span>
      <small>${escapeHtml(status)}</small>
    </button>
  `;
}

function getAccessoryAppearanceItems(characterId) {
  const dataItems = getAppearanceItems(characterId, "accessories");
  const shopAccessoryItems = shopItems
    .filter((item) => item.slot && item.equipTargets.includes(characterId))
    .map((item) => ({
      id: item.id,
      name: item.name,
      slot: item.slot,
      image: item.image,
      inventoryItemId: item.id,
      equipTargets: item.equipTargets,
    }));

  return dataItems.concat(shopAccessoryItems);
}

function getAppearanceItem(characterId, category, appearanceId) {
  const source = category === "accessories" ? getAccessoryAppearanceItems(characterId) : getAppearanceItems(characterId, category);

  return source.find((item) => item.id === appearanceId) || null;
}

function isAppearanceUnlocked(characterId, category, appearanceId) {
  const unlocked = gameState.unlockedAppearance && gameState.unlockedAppearance[characterId];

  if (!unlocked || !appearanceId) {
    return false;
  }

  if (category === "accessories") {
    const item = getAppearanceItem(characterId, category, appearanceId);
    const inventoryId = item && item.inventoryItemId ? item.inventoryItemId : appearanceId;
    return unlocked.accessories.includes(appearanceId) || Number(gameState.inventory[inventoryId] || 0) > 0;
  }

  return Array.isArray(unlocked[category]) && unlocked[category].includes(appearanceId);
}

function isAppearanceEquipped(characterId, category, item) {
  const equipped = getEquippedAppearance(characterId);

  if (category === "accessories") {
    return item.slot === HEADWEAR_SLOT ? equipped.headwear === item.id : item.slot && equipped.accessories[item.slot] === item.id;
  }

  return equipped[category] === item.id;
}

function unlockAppearance(characterId, appearanceId) {
  const category = findAppearanceCategory(characterId, appearanceId);

  if (!category) {
    return false;
  }

  const unlocked = gameState.unlockedAppearance[characterId][category];

  if (!unlocked.includes(appearanceId)) {
    unlocked.push(appearanceId);
    saveGame();
    renderAppearance();
  }

  return true;
}

function equipAppearance(characterId, category, appearanceId, options = {}) {
  if (!APPEARANCE_CHARACTER_IDS.includes(characterId)) {
    return false;
  }

  if (category === "accessories" && !appearanceId) {
    const slot = options.slot || "";
    if (slot && gameState.equippedAppearance[characterId].accessories[slot] !== undefined) {
      gameState.equippedAppearance[characterId].accessories[slot] = "";
      if (slot === HEADWEAR_SLOT) {
        gameState.equippedAppearance[characterId].headwear = null;
      }
      saveGame();
      renderAppearance();
      return true;
    }
    return false;
  }

  const item = getAppearanceItem(characterId, category, appearanceId);

  if (!item || !isAppearanceUnlocked(characterId, category, appearanceId)) {
    return false;
  }

  if (category === "accessories") {
    if (!item.slot || !APPEARANCE_ACCESSORY_SLOTS.includes(item.slot)) {
      return false;
    }

    const inventoryId = item.inventoryItemId || item.id;
    if (Number(gameState.inventory[inventoryId] || 0) <= 0 && !gameState.unlockedAppearance[characterId].accessories.includes(item.id)) {
      return false;
    }

    gameState.equippedAppearance[characterId].accessories[item.slot] = item.id;
    if (item.slot === HEADWEAR_SLOT) {
      gameState.equippedAppearance[characterId].headwear = item.id;
    }
  } else if (category === "hair" || category === "costume") {
    gameState.equippedAppearance[characterId][category] = item.id;
  } else {
    return false;
  }

  saveGame();
  renderAppearance();
  return true;
}

function findAppearanceCategory(characterId, appearanceId) {
  return ["hair", "costume", "accessories"].find((category) =>
    getAppearanceItems(characterId, category).some((item) => item.id === appearanceId)
  );
}

function getEquippedAppearance(characterId) {
  const equipped = gameState.equippedAppearance && gameState.equippedAppearance[characterId];
  const accessories = Object.assign(createEmptyAccessorySlots(), equipped && equipped.accessories ? equipped.accessories : {});
  const headwear = equipped && Object.prototype.hasOwnProperty.call(equipped, "headwear") ? equipped.headwear : accessories[HEADWEAR_SLOT];

  return {
    hair: equipped && equipped.hair ? equipped.hair : "",
    costume: equipped && equipped.costume ? equipped.costume : "",
    headwear: headwear || null,
    accessories,
  };
}

function getCharacterBase(characterId, mode) {
  const baseItems = getAppearanceItems(characterId, "base");
  const currentMode = UI_MODES[mode] ? mode : "normal";
  const matched = baseItems.find((item) => item.modes.includes(currentMode)) || baseItems.find((item) => item.modes.includes("all"));

  return matched ? matched.id : "";
}

function getCharacterRenderState(characterId, mode) {
  const equipped = getEquippedAppearance(characterId);
  const headwear = getResolvedHeadwearItem(characterId, mode);

  return {
    characterId,
    mode,
    base: getCharacterBase(characterId, mode),
    hair: equipped.hair,
    costume: equipped.costume,
    headwear: headwear ? headwear.id : null,
    accessories: equipped.accessories,
  };
}

function getResolvedHeadwearItem(characterId, mode) {
  const equipped = getEquippedAppearance(characterId);
  const currentMode = UI_MODES[mode] ? mode : "normal";
  const headwearId = equipped.headwear || DEFAULT_MODE_HEADWEAR[currentMode];

  return getAppearanceItem(characterId, "accessories", headwearId);
}

function renderShop() {
  elements.shopGoldText.textContent = gameState.gold;
  elements.shopGrid.innerHTML = "";

  const visibleItems = shopItems.filter((item) => isShopItemAvailable(item));

  if (visibleItems.length === 0) {
    elements.shopGrid.innerHTML = '<p class="shop-empty">暂无商品。</p>';
    return;
  }

  visibleItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "shop-item";

    const image = document.createElement("img");
    image.className = "shop-item-image";
    image.loading = "lazy";
    image.decoding = "async";
    image.src = item.image;
    image.alt = item.name;

    const name = document.createElement("h3");
    name.textContent = item.name;

    const description = document.createElement("p");
    description.className = "shop-item-description";
    description.textContent = item.description;

    const price = document.createElement("p");
    price.className = "shop-item-price";
    price.textContent = `金币 ${item.price}`;

    const button = document.createElement("button");
    button.className = "shop-buy-button";
    button.type = "button";
    button.textContent = "购买";
    button.addEventListener("click", () => buyShopItem(item));

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(button);
    elements.shopGrid.appendChild(card);
  });
}

function isShopItemAvailable(item) {
  const mode = selectedUiMode || loadUiMode() || "normal";

  return item.availableIn.includes(mode);
}

function buyShopItem(item) {
  if (gameState.gold < item.price) {
    window.alert("金币不足");
    return;
  }

  gameState.gold -= item.price;
  addInventoryItem(item.id, 1);
  addLog(`购买：${item.name}，金币 -${item.price}。`);
  saveGame();
  render();
  renderShop();
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

  if (elements.shopGoldText) {
    elements.shopGoldText.textContent = gameState.gold;
  }

  renderTodayLog();
  renderActionButtons();
  renderDevVisibility();

  if (elements.appearanceModal && !elements.appearanceModal.hidden) {
    renderAppearance();
  }

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
  checkGoldLineEvents();

  eventData.statEvents.forEach((event) => {
    if (event.type === "diligenceReward" || event.type === "diligenceRewardTemplate") {
      return;
    }

    if (event.id === "fluffy_promise" || event.id === "abyss_invitation") {
      return;
    }

    if (event.id === "angel_investor") {
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

function checkGoldLineEvents() {
  const event = eventData.goldLineEvents.find((item) => isGoldLineEventReady(item));

  if (event) {
    triggerEvent(event);
  }
}

function isGoldLineEventReady(event) {
  const trigger = event.trigger || {};

  if (trigger.requiresIncomplete && isGoldEventCompleted(trigger.requiresIncomplete)) {
    return false;
  }

  if (trigger.requiresCompleted && !isGoldEventCompleted(trigger.requiresCompleted)) {
    return false;
  }

  if (Number.isFinite(Number(trigger.requiresGold)) && Number(gameState.gold || 0) < Number(trigger.requiresGold)) {
    return false;
  }

  if (Number.isFinite(Number(trigger.minDaysAfterGold002))) {
    if (!Number.isFinite(Number(gameState.goldLine.gold002CompletedDay))) {
      return false;
    }

    return Number(gameState.day || 1) - Number(gameState.goldLine.gold002CompletedDay) >= Number(trigger.minDaysAfterGold002);
  }

  return true;
}

function isGoldEventCompleted(id) {
  return gameState.goldLine.completed.includes(id);
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

  applyAppearanceUnlockEffects(effects.unlockAppearance);
}

function applyOptionEffects(effects = {}) {
  const statEffects = {};

  Object.entries(effects).forEach(([key, value]) => {
    if (key in gameState && typeof value !== "object") {
      statEffects[key] = value;
    }
  });

  applyEffects(statEffects);

  if (effects.completeGoldEvent) {
    completeGoldEvent(effects.completeGoldEvent);
  }

  if (effects.setGold002CompletedDay) {
    gameState.goldLine.gold002CompletedDay = gameState.day;
  }

  if (effects.item && effects.item.name) {
    addInventoryItem(effects.item.name, effects.item.amount || 1);
  }

  applyAppearanceUnlockEffects(effects.unlockAppearance);
}

function applyAppearanceUnlockEffects(unlockData) {
  if (!unlockData) {
    return;
  }

  const unlocks = Array.isArray(unlockData) ? unlockData : [unlockData];

  unlocks.forEach((item) => {
    if (item && item.characterId && item.appearanceId) {
      unlockAppearance(item.characterId, item.appearanceId);
    }
  });
}

function completeGoldEvent(id) {
  if (!gameState.goldLine.completed.includes(id)) {
    gameState.goldLine.completed.push(id);
  }
}

function addInventoryItem(name, amount) {
  gameState.inventory[name] = Number(gameState.inventory[name] || 0) + Number(amount || 1);
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
  activeModalResultMode = false;
  elements.eventTitle.textContent = activeModalEvent.title || "事件";
  elements.eventBody.textContent = activeModalEvent.body || "事件正文待填写。";
  elements.eventImageSlot.textContent = activeModalEvent.image || "";
  elements.eventRewards.innerHTML = hasInteractiveOptions(activeModalEvent) ? "" : renderRewards(activeModalEvent.rewards);
  elements.eventOptions.innerHTML = renderOptions(activeModalEvent.options);
  elements.eventConfirmButton.hidden = hasInteractiveOptions(activeModalEvent);
  elements.eventConfirmButton.textContent = "确定";
  elements.eventModal.hidden = false;
  renderActionButtons();
}

function closeEventModal() {
  elements.eventModal.hidden = true;
  activeModalEvent = null;
  activeModalResultMode = false;
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
    .map((option, index) => {
      const disabled = option.resultText ? "" : " disabled";
      return `<button type="button" data-option-index="${index}"${disabled}>${escapeHtml(option.label || option.text || "选项")}</button>`;
    })
    .join("");
}

function hasInteractiveOptions(event) {
  return Array.isArray(event.options) && event.options.some((option) => option.resultText);
}

function handleEventOptionClick(event) {
  const button = event.target.closest("[data-option-index]");

  if (!button || !activeModalEvent || activeModalResultMode) {
    return;
  }

  const option = activeModalEvent.options[Number(button.dataset.optionIndex)];

  if (!option || !option.resultText) {
    return;
  }

  activeModalResultMode = true;
  elements.eventBody.textContent = option.resultText;
  elements.eventRewards.innerHTML = renderRewards(option.rewards || activeModalEvent.rewards);
  elements.eventOptions.innerHTML = "";
  elements.eventConfirmButton.hidden = false;
  elements.eventConfirmButton.textContent = "继续";
  applyOptionEffects(option.effects || {});
  addLog(option.resultText);
  saveGame();
  render();
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
