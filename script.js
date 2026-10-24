// ---------- НАЧАЛЬНЫЕ ПОКАЗАТЕЛИ ----------
let stats = {
    treasury: 50,
    religion: 50,
    army: 50,
    people: 50
};

let gameActive = true;
let currentEvent = null;

// ---------- БАЗА СОБЫТИЙ ----------
const events = [
    {
        id: 0,
        person: "🧑‍💼 Казначей",
        text: "Ваше Величество! В казне завелись крысы, золото тает на глазах. Что прикажете?",
        options: [
            { text: "🐭 Купить мышеловки и яд", effects: { treasury: -15, religion: 0, army: 0, people: +5 } },
            { text: "⚖️ Обвинить церковь и забрать их золото", effects: { treasury: +20, religion: -20, army: 0, people: -10 } }
        ]
    },
    {
        id: 1,
        person: "⚔️ Генерал",
        text: "Соседнее королевство собирает армию у границ. Мы должны действовать!",
        options: [
            { text: "🛡️ Мобилизация и укрепление границ", effects: { treasury: -30, religion: 0, army: +40, people: -20 } },
            { text: "💎 Отправить послов с богатыми дарами", effects: { treasury: -25, religion: +5, army: -10, people: +15 } }
        ]
    },
    {
        id: 2,
        person: "⛪ Верховный жрец",
        text: "Боги гневаются. Нужен великий собор, чтобы умилостивить небеса!",
        options: [
            { text: "🏗️ Построить собор (казну — на веру)", effects: { treasury: -40, religion: +30, army: 0, people: -10 } },
            { text: "🗡️ Деньги нужны армии, откажите церкви", effects: { treasury: -10, religion: -25, army: +20, people: +5 } }
        ]
    },
    {
        id: 3,
        person: "👨‍🌾 Крестьянский староста",
        text: "Неурожай, люди голодают, многие готовы бунтовать!",
        options: [
            { text: "🍞 Открыть королевские амбары бесплатно", effects: { treasury: -20, religion: +5, army: 0, people: +25 } },
            { text: "💰 Усилить охрану, продавать зерно дорого", effects: { treasury: +15, religion: -15, army: -5, people: -30 } }
        ]
    },
    {
        id: 4,
        person: "🏹 Командир стражи",
        text: "Народ ропщет на налоги. Но армии нужно новое вооружение!",
        options: [
            { text: "🔫 Выдать деньги на оружие", effects: { treasury: -25, religion: 0, army: +30, people: -5 } },
            { text: "📜 Пообещать снизить налоги в следующем году", effects: { treasury: +5, religion: -5, army: -15, people: -10 } }
        ]
    },
    {
        id: 5,
        person: "👑 Знатный герцог",
        text: "Ваш трон шатается. Я могу поддержать вас, но требую земель и титулов.",
        options: [
            { text: "🤝 Согласиться, но раздать наделы знати", effects: { treasury: -15, religion: -5, army: +10, people: -15 } },
            { text: "🚫 Отказать и пригрозить силой", effects: { treasury: 0, religion: +5, army: -10, people: +10 } }
        ]
    },
    {
        id: 6,
        person: "🧙 Монах-отшельник",
        text: "Я видел знамение: если вы не накажете еретиков, страна погибнет.",
        options: [
            { text: "🔥 Сжечь еретиков на костре", effects: { treasury: -5, religion: +25, army: 0, people: -20 } },
            { text: "📖 Устроить диспут, выслушать обе стороны", effects: { treasury: 0, religion: -20, army: -5, people: +12 } }
        ]
    },
	{
		id: 7,
		person: "🧙‍♀️ Придворный алхимик",
		text: "Я нашёл способ превращать свинец в золото! Нужно только финансировать мою лабораторию.",
		options: [
			{ text: "💰 Выделить золото на опыты", effects: { treasury: -25, religion: -5, army: 0, people: -5 } },
			{ text: "🔮 Отправить алхимика в монастырь замаливать грехи", effects: { treasury: 0, religion: +10, army: 0, people: +5 } }
    ]
	},
	{
		id: 8,
		person: "🐉 Посол северных земель",
		text: "За стеной видели дракона. Он сжёг три деревни. Дайте солдат или мы подчинимся дракону!",
		options: [
			{ text: "⚔️ Послать армию против дракона", effects: { treasury: -20, religion: -10, army: -25, people: +15 } },
			{ text: "🕯️ Молиться в соборах и принести жертву", effects: { treasury: -10, religion: +20, army: -5, people: -5 } }
    ]
	},
	{
		id: 9,
		person: "👸 Герцогиня-интриганка",
		text: "Ваш брат собирает заговор. Я могу выдать его сообщников... за небольшую плату и титул.",
		options: [
			{ text: "🤝 Согласиться, купить список заговорщиков", effects: { treasury: -20, religion: -5, army: -5, people: -10 } },
			{ text: "🗡️ Казнить доносчицу за клевету", effects: { treasury: 0, religion: +5, army: +10, people: +10 } }
    ]
	},
	{
		id: 10,
		person: "🌾 Староста рыбацкой деревни",
		text: "Море выбрасывает мёртвую рыбу. Люди голодают и винят ведьм. Что делать?",
		options: [
			{ text: "🔍 Устроить охоту на ведьм", effects: { treasury: -5, religion: +15, army: -5, people: -15 } },
			{ text: "🏭 Открыть королевские склады и раздать еду", effects: { treasury: -20, religion: +5, army: 0, people: +20 } }
    ]
	},
	{
		id: 11,
		person: "📜 Королевский летописец",
		text: "Я закончил хронику вашего правления. Но нужно вырезать некоторые... неудобные факты.",
		options: [
			{ text: "✂️ Вырезать всё, что позорит корону", effects: { treasury: 0, religion: -5, army: 0, people: -15 } },
			{ text: "📖 Оставить правду, как есть", effects: { treasury: 0, religion: +10, army: 0, people: +10 } }
    ]
	},
	{
		id: 12,
		person: "🏹 Капитан лучников",
		text: "Наши стрелы тупятся о вражескую броню. Нужно заказать стальные наконечники у гномов!",
		options: [
			{ text: "⚒️ Заказать партию дорогих наконечников", effects: { treasury: -30, religion: 0, army: +25, people: -5 } },
			{ text: "🏹 Тренировать стрельбу в уязвимые места", effects: { treasury: -5, religion: 0, army: +10, people: 0 } }
		]
	},
	{
		id: 13,
		person: "👻 Монахиня из приюта",
		text: "В приюте появилось привидение. Дети в ужасе. Нужно изгнать духа или закрыть приют.",
		options: [
			{ text: "🙏 Пригласить экзорциста", effects: { treasury: -10, religion: +15, army: 0, people: +5 } },
			{ text: "🏚️ Закрыть приют, сэкономить на детях", effects: { treasury: +15, religion: -20, army: 0, people: -25 } }
		]
	},
	{
		id: 14,
		person: "⚖️ Верховный судья",
		text: "Дворяне требуют права судить крестьян без вашего ведома. Это укрепит их лояльность.",
		options: [
			{ text: "📜 Передать судебную власть знати", effects: { treasury: +10, religion: 0, army: +5, people: -30 } },
			{ text: "👑 Оставить суд только королю", effects: { treasury: -5, religion: +5, army: 0, people: +15 } }
		]
	},
	{
		id: 15,
		person: "🎭 Бродячий театр",
		text: "Мы поставили пьесу, где король выглядит глупо. Народ смеётся. Казнить нас?",
		options: [
			{ text: "🔪 Казнить актёров за оскорбление", effects: { treasury: -5, religion: -10, army: -5, people: -20 } },
			{ text: "💰 Нанять их, чтобы писали хвалебные оды", effects: { treasury: -15, religion: 0, army: 0, people: +15 } }
		]
	},
	{
		id: 16,
		person: "💎 Купеческая гильдия",
		text: "Откройте свободную торговлю с восточными королевствами. Пошлины будут снижены, но казна потеряет часть доходов.",
		options: [
			{ text: "🌍 Открыть границы для торговли", effects: { treasury: -10, religion: +5, army: -5, people: +25 } },
			{ text: "🚫 Оставить пошлины и запреты", effects: { treasury: +10, religion: -5, army: +5, people: -10 } }
		]
	},
	{
    id: 17,
    person: "🧙‍♂️ Старый друид",
    text: "Лес мстит за вырубку. По ночам деревья оживают и нападают на деревни. Умиротворить духов?",
    options: [
        { text: "🌳 Запретить вырубку, сажать новые деревья", effects: { treasury: -15, religion: +15, army: 0, people: +10 } },
        { text: "🔥 Выжечь лес дотла с помощью армии", effects: { treasury: -20, religion: -20, army: +10, people: -15 } }
    ]
	},
	{
		id: 18,
		person: "💀 Могильщик",
		text: "Кладбища переполнены. Чума возвращается. Нужно сжигать тела, но церковь против.",
		options: [
			{ text: "🔥 Сжигать тела вопреки церкви", effects: { treasury: 0, religion: -25, army: 0, people: +20 } },
			{ text: "🙏 Хоронить по всем обрядам, копать новые могилы", effects: { treasury: -15, religion: +10, army: -5, people: -10 } }
		]
	},
	{
		id: 19,
		person: "🏰 Архитектор",
		text: "Замок разрушается. Нужно срочно ремонтировать стены, иначе враг пробьёт брешь.",
		options: [
			{ text: "🧱 Выделить камни и рабочих из деревень", effects: { treasury: -20, religion: 0, army: +15, people: -15 } },
			{ text: "💎 Взять кредит у ростовщиков на лучший камень", effects: { treasury: -35, religion: -5, army: +25, people: 0 } }
		]
	},
	{
		id: 20,
		person: "🐺 Охотник на оборотней",
		text: "В городе завёлся оборотень. Я знаю кто это, но мне нужны серебряные пули и оплата.",
		options: [
			{ text: "🔫 Купить серебро и нанять охотника", effects: { treasury: -15, religion: +5, army: 0, people: +10 } },
			{ text: "⚔️ Объявить комендантский час и ловить всех подозрительных", effects: { treasury: +15, religion: -10, army: -10, people: -20 } }
		]
	},
	{
		id: 21,
		person: "👰 Невеста короля",
		text: "Моя семья требует приданое — три золотых рудника. Или свадьбы не будет.",
		options: [
			{ text: "💍 Отдать рудники, жениться любой ценой", effects: { treasury: -40, religion: -5, army: -10, people: -5 } },
			{ text: "🚫 Расторгнуть помолвку и обвинить её в измене", effects: { treasury: +10, religion: +5, army: 0, people: -15 } }
		]
	},
	{
		id: 22,
		person: "🗡️ Тайный орден убийц",
		text: "Мы уберём любого вашего врага. Плата — 20% налогов города на год.",
		options: [
			{ text: "🤝 Согласиться на сделку с убийцами", effects: { treasury: -25, religion: -20, army: -5, people: -15 } },
			{ text: "⚔️ Объявить охоту на орден и перебить всех", effects: { treasury: -15, religion: +10, army: +5, people: +10 } }
		]
	},
	{
		id: 23,
		person: "🐎 Табунщик",
		text: "В степи появились дикие лошади невиданной силы. Если их поймать, армия станет непобедимой.",
		options: [
			{ text: "🏇 Снарядить экспедицию на поимку", effects: { treasury: -25, religion: 0, army: +30, people: 0 } },
			{ text: "💤 Проигнорировать — это просто слухи", effects: { treasury: 0, religion: -5, army: -10, people: +5 } }
		]
	},
	{
		id: 24,
		person: "🍷 Королевский дегустатор",
		text: "Вино отравлено! Я спас вам жизнь. Дайте мне поместье в награду.",
		options: [
			{ text: "🏡 Дать поместье в награду", effects: { treasury: -20, religion: 0, army: -5, people: -5 } },
			{ text: "🔍 Приказать пытать дегустатора — может, он сам отравитель", effects: { treasury: 0, religion: -15, army: -5, people: -10 } }
		]
	},
	{
		id: 25,
		person: "📖 Библиотекарь",
		text: "В древней книге найден рецепт эликсира бессмертия. Нужны редкие ингредиенты за границей.",
		options: [
			{ text: "⚗️ Снарядить экспедицию за ингредиентами", effects: { treasury: -30, religion: -10, army: -10, people: 0 } },
			{ text: "🔥 Сжечь книгу как еретическую", effects: { treasury: 0, religion: +20, army: 0, people: +5 } }
		]
	},
	{
		id: 26,
		person: "🎪 Цыганский барон",
		text: "Мы можем предсказывать будущее. За небольшую плату скажем, кто из министров вас предаст.",
		options: [
			{ text: "🔮 Заплатить за предсказание", effects: { treasury: -15, religion: -15, army: 0, people: +5 } },
			{ text: "🚫 Выгнать цыган из королевства", effects: { treasury: 0, religion: +10, army: 0, people: -10 } }
		]
	},
	{
		id: 27,
		person: "🕊️ Посол мира",
		text: "Соседи предлагают вечный мир в обмен на вашу единственную дочь в жёны их принцу.",
		options: [
			{ text: "💔 Согласиться на династический брак", effects: { treasury: 0, religion: +10, army: -20, people: +25 } },
			{ text: "⚔️ Отказать и готовиться к войне", effects: { treasury: -10, religion: -5, army: +25, people: -10 } }
		]
	},
	{
		id: 28,
		person: "⛏️ Шахтёрский староста",
		text: "В рудниках нашли огромный самородок. Но рабочие требуют половину или грозят забастовкой.",
		options: [
			{ text: "💎 Разделить золото поровну", effects: { treasury: -20, religion: 0, army: 0, people: +20 } },
			{ text: "🔨 Уволить забастовщиков и взять солдат в шахтёры", effects: { treasury: +30, religion: -15, army: -15, people: -25 } }
		]
	},
	{
		id: 29,
		person: "🧪 Алхимик-некромант",
		text: "Я оживил вашего покойного отца на час. Он хочет поговорить с вами. Стоит 1000 монет.",
		options: [
			{ text: "⚰️ Согласиться, услышать последнюю волю отца", effects: { treasury: -30, religion: -30, army: 0, people: -10 } },
			{ text: "🔨 Заточить некроманта в темницу за чёрную магию", effects: { treasury: +5, religion: +25, army: 0, people: +10 } }
		]
	},
	{
		id: 30,
		person: "🌋 Прорицательница",
		text: "Через месяц на город упадёт огненный камень с неба. Нужно строить подземные убежища.",
		options: [
			{ text: "🚧 Начать строительство убежищ", effects: { treasury: -40, religion: +15, army: -10, people: +20 } },
			{ text: "😅 Объявить прорицательницу лгуньей и казнить", effects: { treasury: +5, religion: -15, army: 0, people: -5 } }
		]
	},
	{
		id: 31,
		person: "💰 Купец из далёкой страны",
		text: "Я привёз редкостный шёлк и пряности. Готов купить у вас монополию на торговлю за 5000 монет.",
		options: [
			{ text: "🤝 Продать монополию купцу", effects: { treasury: +30, religion: -5, army: 0, people: -15 } },
			{ text: "🚫 Отказать и ввести госмонополию", effects: { treasury: -10, religion: 0, army: +5, people: +5 } }
		]
	},
	{
		id: 32,
		person: "⚖️ Сборщик налогов",
		text: "Я нашёл способ увеличить сборы втрое: просто отменить все льготы для бедных.",
		options: [
			{ text: "📈 Ввести жёсткий налоговый режим", effects: { treasury: +35, religion: -15, army: -5, people: -30 } },
			{ text: "❤️ Оставить льготы и повысить налоги богатым", effects: { treasury: +10, religion: +10, army: 0, people: +15 } }
		]
	},
	{
		id: 33,
		person: "🧂 Солевар",
		text: "Соль закончилась во всём королевстве. Я могу открыть новые копи, но пополам с казной.",
		options: [
			{ text: "🏭 Инвестировать в разработку соляных копей", effects: { treasury: +25, religion: 0, army: +5, people: +10 } },
			{ text: "💀 Конфисковать соль у купцов и продать дорого", effects: { treasury: +15, religion: -20, army: -10, people: -25 } }
		]
	},
	{
		id: 34,
		person: "🎭 Организатор турнира",
		text: "Рыцарский турнир привлечёт знатных гостей. Можно продавать места и брать входную плату.",
		options: [
			{ text: "🏇 Провести платный турнир", effects: { treasury: +20, religion: -5, army: +10, people: +5 } },
			{ text: "🎟️ Сделать турнир бесплатным для народа", effects: { treasury: -15, religion: +5, army: 0, people: +20 } }
		]
	},
	{
		id: 35,
		person: "🏦 Ростовщик",
		text: "Я дам королевству большой кредит под 50% годовых. Деньги нужны на войну?",
		options: [
			{ text: "💸 Взять кредит у ростовщика", effects: { treasury: +40, religion: -10, army: +15, people: -20 } },
			{ text: "🙅 Отказаться и продать часть земель", effects: { treasury: +10, religion: 0, army: -10, people: 0 } }
		]
	},
	{
		id: 36,
		person: "🗺️ Картограф",
		text: "Я нашёл карту сокровищ на необитаемом острове. Снарядите экспедицию, и золото наше.",
		options: [
			{ text: "⛵ Снарядить корабль за сокровищами", effects: { treasury: +45, religion: 0, army: -15, people: +5 } },
			{ text: "🔥 Сжечь карту как фальшивку", effects: { treasury: -5, religion: +10, army: 0, people: +5 } }
		]
	},
	{
		id: 37,
		person: "🐄 Скотопромышленник",
		text: "Скотина дохнет от мора. Я скуплю всех здоровых животных, а вы дадите мне монополию на мясо.",
		options: [
			{ text: "📄 Дать монополию в обмен на откуп", effects: { treasury: +25, religion: -5, army: 0, people: -15 } },
			{ text: "🏥 Бесплатно лечить скот и раздавать мясо", effects: { treasury: -20, religion: +15, army: +5, people: +20 } }
		]
	},
	{
		id: 38,
		person: "🔮 Базарный гадалка",
		text: "Я знаю, где зарыт клад предков. Покажу за 1000 монет. Гарантия — моя голова.",
		options: [
			{ text: "💰 Заплатить и откопать клад", effects: { treasury: +35, religion: -10, army: 0, people: -5 } },
			{ text: "🔪 Казнить гадалку за мошенничество", effects: { treasury: 0, religion: +5, army: 0, people: +5 } }
		]
	},
	{
		id: 39,
		person: "🏭 Мастер монетного двора",
		text: "Можно снизить содержание серебра в монетах вдвое. Казна наполнится, но народ возмутится.",
		options: [
			{ text: "🪙 Провести порчу монеты", effects: { treasury: +40, religion: -10, army: -5, people: -25 } },
			{ text: "⚖️ Сохранить честную монету", effects: { treasury: 0, religion: +5, army: 0, people: +10 } }
		]
	},
	{
		id: 40,
		person: "🧞 Джинн из бутылки",
		text: "Я исполню любое ваше желание за... одну монету. Но только одно, и цена будет потом.",
		options: [
			{ text: "✨ Загадать несметное золото", effects: { treasury: +60, religion: -20, army: -10, people: -20 } },
			{ text: "🔒 Прогнать джинна подальше", effects: { treasury: 0, religion: +5, army: +5, people: +5 } }
		]
	}
	
	];

// Для экономии места в ответе приведу лишь функцию сохранения и загрузки,
// но полный рабочий файл вы получите, объединив ранее созданные события + этот код.

// ---------- DOM элементы ----------
const treasuryFill = document.getElementById('treasury-fill');
const religionFill = document.getElementById('religion-fill');
const armyFill = document.getElementById('army-fill');
const peopleFill = document.getElementById('people-fill');
const treasuryVal = document.getElementById('treasury-value');
const religionVal = document.getElementById('religion-value');
const armyVal = document.getElementById('army-value');
const peopleVal = document.getElementById('people-value');

const eventText = document.getElementById('event-text');
const personIcon = document.querySelector('.person-icon');
const leftBtn = document.getElementById('choice-left');
const rightBtn = document.getElementById('choice-right');
const gameOverPanel = document.getElementById('game-over-panel');
const restartBtn = document.getElementById('restart-btn');

// ---------- Функция сохранения в localStorage ----------
function saveGame() {
    const saveData = {
        stats: stats,
        gameActive: gameActive,
        currentEvent: currentEvent
    };
    localStorage.setItem('reigns_save', JSON.stringify(saveData));
}

// ---------- Функция загрузки из localStorage ----------
function loadGame() {
    const saved = localStorage.getItem('reigns_save');
    if (!saved) return false;

    try {
        const data = JSON.parse(saved);
        stats = data.stats;
        gameActive = data.gameActive;
        currentEvent = data.currentEvent;
        return true;
    } catch(e) {
        console.error("Ошибка загрузки сохранения", e);
        return false;
    }
}

// ---------- Вспомогательные функции ----------
function updateUI() {
    treasuryFill.style.width = stats.treasury + '%';
    religionFill.style.width = stats.religion + '%';
    armyFill.style.width = stats.army + '%';
    peopleFill.style.width = stats.people + '%';
    
    treasuryVal.innerText = Math.floor(stats.treasury);
    religionVal.innerText = Math.floor(stats.religion);
    armyVal.innerText = Math.floor(stats.army);
    peopleVal.innerText = Math.floor(stats.people);
    
    // Меняем цвет полосок при критических значениях
    const lowColor = '#c2421a';
    const highColor = '#30b06b';
    treasuryFill.style.background = stats.treasury < 20 ? lowColor : (stats.treasury > 80 ? highColor : 'linear-gradient(90deg, #e0b45a, #ffd966)');
    religionFill.style.background = stats.religion < 20 ? lowColor : (stats.religion > 80 ? highColor : 'linear-gradient(90deg, #e0b45a, #ffd966)');
    armyFill.style.background = stats.army < 20 ? lowColor : (stats.army > 80 ? highColor : 'linear-gradient(90deg, #e0b45a, #ffd966)');
    peopleFill.style.background = stats.people < 20 ? lowColor : (stats.people > 80 ? highColor : 'linear-gradient(90deg, #e0b45a, #ffd966)');
}

function applyEffects(effects) {
    stats.treasury += effects.treasury || 0;
    stats.religion += effects.religion || 0;
    stats.army += effects.army || 0;
    stats.people += effects.people || 0;
    
    stats.treasury = Math.min(100, Math.max(0, stats.treasury));
    stats.religion = Math.min(100, Math.max(0, stats.religion));
    stats.army = Math.min(100, Math.max(0, stats.army));
    stats.people = Math.min(100, Math.max(0, stats.people));
    
    updateUI();
    
    // Проверка Game Over
    if (stats.treasury === 0 || stats.treasury === 100 ||
        stats.religion === 0 || stats.religion === 100 ||
        stats.army === 0 || stats.army === 100 ||
        stats.people === 0 || stats.people === 100) {
        gameActive = false;
        gameOverPanel.style.display = 'block';
        document.querySelector('.card').style.opacity = '0.6';
        leftBtn.disabled = true;
        rightBtn.disabled = true;
    }
    
    saveGame(); // сохраняем после каждого изменения
}

function getRandomEvent() {
    return events[Math.floor(Math.random() * events.length)];
}

function displayEvent(event) {
    if (!event) return;
    currentEvent = event;
    personIcon.innerText = event.person;
    eventText.innerText = event.text;
    leftBtn.innerText = event.options[0].text;
    rightBtn.innerText = event.options[1].text;
    saveGame(); // сохраняем текущее событие
}

function handleChoice(choiceIndex) {
    if (!gameActive) return;
    if (!currentEvent) return;
    
    const chosenOption = currentEvent.options[choiceIndex];
    applyEffects(chosenOption.effects);
    
    if (gameActive) {
        const nextEvent = getRandomEvent();
        displayEvent(nextEvent);
    }
}

function restartGame() {
    gameActive = true;
    stats = {
        treasury: 50,
        religion: 50,
        army: 50,
        people: 50
    };
    updateUI();
    gameOverPanel.style.display = 'none';
    document.querySelector('.card').style.opacity = '1';
    leftBtn.disabled = false;
    rightBtn.disabled = false;
    
    const startEvent = getRandomEvent();
    displayEvent(startEvent);
    saveGame(); // сохраняем новую игру
}

// ---------- Инициализация с проверкой сохранённой игры ----------
function init() {
    const loaded = loadGame();
    if (loaded && gameActive !== undefined && currentEvent !== null) {
        // Восстановили сохранённое состояние
        updateUI();
        // Отображаем сохранённое событие
        if (currentEvent) {
            personIcon.innerText = currentEvent.person;
            eventText.innerText = currentEvent.text;
            leftBtn.innerText = currentEvent.options[0].text;
            rightBtn.innerText = currentEvent.options[1].text;
        }
        if (!gameActive) {
            gameOverPanel.style.display = 'block';
            document.querySelector('.card').style.opacity = '0.6';
            leftBtn.disabled = true;
            rightBtn.disabled = true;
        } else {
            gameOverPanel.style.display = 'none';
            document.querySelector('.card').style.opacity = '1';
            leftBtn.disabled = false;
            rightBtn.disabled = false;
        }
    } else {
        // Нет сохранения – начинаем новую игру
        restartGame();
    }
    
    // Привязываем обработчики кнопок
    leftBtn.addEventListener('click', () => handleChoice(0));
    rightBtn.addEventListener('click', () => handleChoice(1));
    restartBtn.addEventListener('click', () => restartGame());
}

init();