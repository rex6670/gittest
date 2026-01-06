const heroChoices = [
  {
    id: "fighter",
    name: "戰士",
    description: "穩定輸出，可在一次失敗檢定後 +2 修正。",
    bonus: { force: 2 },
    perk: "guard",
  },
  {
    id: "rogue",
    name: "盜賊",
    description: "擅長詭計與潛行，特定行動 +3 修正。",
    bonus: { sneak: 3 },
    perk: "sneak",
  },
  {
    id: "mage",
    name: "法師",
    description: "可以重擲一次魔法檢定。",
    bonus: { spell: 3 },
    perk: "reroll",
  },
];

const encounters = [
  {
    title: "廢棄哨塔",
    text: "森林中的哨塔阻擋前路，一名哥布林在上方巡邏。",
    difficulty: 12,
    choices: [
      {
        label: "衝上階梯正面突破",
        key: "force",
        outcome: {
          success: "你強勢突入，還順手找到一包治療草。",
          fail: "警報大作，你的時間被拖延。",
        },
      },
      {
        label: "從灌木間潛行穿過",
        key: "sneak",
        outcome: {
          success: "你悄然通過並搜出一枚幸運符。",
          fail: "樹枝作響，哥布林警覺了。",
        },
      },
      {
        label: "施放幻術吸引注意",
        key: "spell",
        outcome: {
          success: "幻術生效，你無聲通過。",
          fail: "法術失焦，你被迫撤退。",
        },
      },
    ],
  },
  {
    title: "搖晃吊橋",
    text: "吊橋連接峽谷兩端，木板嘎吱作響。",
    difficulty: 13,
    choices: [
      {
        label: "穩定步伐慢慢通過",
        key: "force",
        outcome: {
          success: "你成功跨越，還撿到一顆閃亮寶石。",
          fail: "你滑了一跤，背包掉進深谷。",
        },
      },
      {
        label: "加速衝刺過去",
        key: "sneak",
        outcome: {
          success: "你迅速通過，沒有觸發陷阱。",
          fail: "橋身劇烈搖晃，你不得不停下。",
        },
      },
      {
        label: "尋找繞行路線",
        key: "spell",
        outcome: {
          success: "你找到安全路徑，節省不少力氣。",
          fail: "你迷失方向，浪費時間。",
        },
      },
    ],
  },
  {
    title: "受傷的狼",
    text: "一頭受傷的狼擋住道路，低吼卻無力。",
    difficulty: 11,
    choices: [
      {
        label: "以食物安撫牠",
        key: "force",
        outcome: {
          success: "狼平靜下來，讓出一條道路。",
          fail: "狼仍保持警戒，你不得不退後。",
        },
      },
      {
        label: "以威嚇逼退",
        key: "sneak",
        outcome: {
          success: "你成功嚇退牠，找到藏匿的銅幣。",
          fail: "狼沒有退卻，你失去先機。",
        },
      },
      {
        label: "用魔法治療",
        key: "spell",
        outcome: {
          success: "魔法安撫了牠，牠帶你到一處藏寶處。",
          fail: "魔法失效，狼仍戒備。",
        },
      },
    ],
  },
  {
    title: "遺跡之門",
    text: "你抵達破損神殿，魔法封印之門擋住去路。",
    difficulty: 14,
    choices: [
      {
        label: "用力量撬開",
        key: "force",
        outcome: {
          success: "門被你撬開，房間內光芒閃動。",
          fail: "你用力過猛，結界反彈。",
        },
      },
      {
        label: "拆解鎖頭",
        key: "sneak",
        outcome: {
          success: "你熟練開鎖，門扉敞開。",
          fail: "機關發出聲響，時間被拖延。",
        },
      },
      {
        label: "解讀符文",
        key: "spell",
        outcome: {
          success: "你解開符文，力量逐漸消散。",
          fail: "符文反制你，你被迫後退。",
        },
      },
    ],
  },
];

const finale = {
  title: "幽魂騎士",
  text: "遺物被幽魂騎士守護，你必須完成最後考驗。",
  baseDifficulty: 12,
  choices: [
    {
      label: "正面決鬥",
      key: "force",
      success: "騎士致意，你成功取回遺物！",
      fail: "騎士的劍勢太快，你被迫撤退。",
    },
    {
      label: "巧妙詐術",
      key: "sneak",
      success: "你的假動作奏效，騎士讓路。",
      fail: "騎士看穿你的意圖。",
    },
    {
      label: "集中魔力",
      key: "spell",
      success: "魔力爆發，幽魂消散。",
      fail: "魔力不足，你被擊退。",
    },
  ],
};

const state = {
  hero: null,
  momentum: 0,
  encounterIndex: 0,
  rerollAvailable: false,
};

const heroName = document.getElementById("hero-name");
const momentumValue = document.getElementById("momentum");
const lastRoll = document.getElementById("last-roll");
const logList = document.getElementById("log");
const introPanel = document.getElementById("intro-panel");
const encounterPanel = document.getElementById("encounter-panel");
const resultPanel = document.getElementById("result-panel");
const encounterTitle = document.getElementById("encounter-title");
const encounterText = document.getElementById("encounter-text");
const encounterChoices = document.getElementById("encounter-choices");
const heroChoiceContainer = document.getElementById("hero-choices");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const restartButton = document.getElementById("restart");

const rollD20 = () => Math.floor(Math.random() * 20) + 1;

const updateStats = () => {
  heroName.textContent = state.hero ? state.hero.name : "尚未選擇";
  momentumValue.textContent = state.momentum;
};

const addLog = (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  logList.prepend(item);
};

const resolveCheck = ({ difficulty, bonus, allowReroll }) => {
  let roll = rollD20();
  let total = roll + bonus;
  if (allowReroll && state.rerollAvailable && total < difficulty) {
    addLog("法師的重擲能力啟動！再擲一次。 ");
    state.rerollAvailable = false;
    roll = rollD20();
    total = roll + bonus;
  }
  lastRoll.textContent = `${roll} (+${bonus}) = ${total}`;
  return total >= difficulty;
};

const renderEncounter = () => {
  const encounter = encounters[state.encounterIndex];
  encounterTitle.textContent = encounter.title;
  encounterText.textContent = encounter.text;
  encounterChoices.innerHTML = "";
  encounter.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.label;
    button.addEventListener("click", () => handleChoice(encounter, choice));
    encounterChoices.appendChild(button);
  });
};

const renderFinale = () => {
  encounterTitle.textContent = finale.title;
  encounterText.textContent = `${finale.text} 目前動能：${state.momentum}`;
  encounterChoices.innerHTML = "";
  finale.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.label;
    button.addEventListener("click", () => handleFinale(choice));
    encounterChoices.appendChild(button);
  });
};

const handleChoice = (encounter, choice) => {
  const bonus = state.hero.bonus[choice.key] || 0;
  const allowReroll = choice.key === "spell" && state.hero.perk === "reroll";
  const success = resolveCheck({
    difficulty: encounter.difficulty,
    bonus,
    allowReroll,
  });

  if (success) {
    state.momentum += 1;
    addLog(choice.outcome.success);
  } else {
    state.momentum -= 1;
    addLog(choice.outcome.fail);
    if (state.hero.perk === "guard" && state.momentum < 0) {
      addLog("戰士的護衛直覺啟動，動能不會低於 0。 ");
      state.momentum = 0;
    }
  }

  updateStats();
  state.encounterIndex += 1;

  if (state.encounterIndex >= encounters.length) {
    renderFinale();
  } else {
    renderEncounter();
  }
};

const handleFinale = (choice) => {
  const bonus = state.hero.bonus[choice.key] || 0;
  const difficulty = finale.baseDifficulty + Math.max(0, 2 - state.momentum);
  const allowReroll = choice.key === "spell" && state.hero.perk === "reroll";
  const success = resolveCheck({ difficulty, bonus, allowReroll });

  encounterPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  resultTitle.textContent = success ? "勝利！" : "失敗";
  resultText.textContent = success
    ? choice.success
    : choice.fail + " 你只能帶著經驗退回。";
};

const startAdventure = (hero) => {
  state.hero = hero;
  state.momentum = 0;
  state.encounterIndex = 0;
  state.rerollAvailable = hero.perk === "reroll";
  logList.innerHTML = "";
  lastRoll.textContent = "-";
  addLog(`你選擇了 ${hero.name}。冒險開始！`);
  updateStats();
  introPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  encounterPanel.classList.remove("hidden");
  renderEncounter();
};

const renderHeroChoices = () => {
  heroChoiceContainer.innerHTML = "";
  heroChoices.forEach((hero) => {
    const button = document.createElement("button");
    button.classList.add("primary");
    button.textContent = `${hero.name}｜${hero.description}`;
    button.addEventListener("click", () => startAdventure(hero));
    heroChoiceContainer.appendChild(button);
  });
};

restartButton.addEventListener("click", () => {
  introPanel.classList.remove("hidden");
  encounterPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  logList.innerHTML = "";
  lastRoll.textContent = "-";
});

renderHeroChoices();
updateStats();
