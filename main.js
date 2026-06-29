document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  //  DATA STORE
  // ============================================================
  let store = {
    taInfo: { name: "梦角", avatarUrl: "" },
    myInfo: { name: "我", avatarUrl: "" },
    delay: { min: 20, max: 120 },
    chatBg: "",
    appIcon: { chat: "", card: "", theme: "", mail: "", calendar: "", setting: "" },
    wallpaper: "",
    groups: {},
    currentSelectGroup: "",
    letters: [],
    inbox: [],
    emojiList: [],
    lastChatTime: 0,
    animEnabled: true,
    messages: [],
    currentStatus: "", // 改为空，由字卡随机填充
    calendar: {}
  };

  // ============================================================
  //  DOM REFS
  // ============================================================
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const topHeader = $('.top-header');
  const chatWrap = $('#chatWrap');
  const inputText = $('#inputText');
  const sendBtn = $('#sendBtn');
  const emojiToggle = $('#emojiToggle');
  const emojiPanel = $('#emojiPanel');
  const emojiFileInput = $('#emojiFileInput');
  const emojiLinkInput = $('#emojiLinkInput');
  const addEmojiBtn = $('#addEmojiBtn');
  const emojiList = $('#emojiList');

  const imageSelectMask = $('#imageSelectMask');
  const modalTitle = $('#modalTitle');
  const localImageFile = $('#localImageFile');
  const imageLinkInput = $('#imageLinkInput');
  const closeImageModal = $('#closeImageModal');
  const confirmImageBtn = $('#confirmImageBtn');

  const wallpaperPreview = $('#wallpaperPreview');
  const openWallpaperModal = $('#openWallpaperModal');
  const chatBgPreview = $('#chatBgPreview');
  const openChatBgModal = $('#openChatBgModal');

  const changeIconBtns = $$('.icon-change-btn');

  const openChatSettingPage = $('#openChatSettingPage');
  const saveChatSetting = $('#saveChatSetting');
  const chatSetBack = $('.chat-set-back');

  const blockTa = $('#blockTa');
  const blockMe = $('#blockMe');
  const blockDelay = $('#blockDelay');

  const taMask = $('#taMask');
  const taAvatarFile = $('#taAvatarFile');
  const taAvatarLink = $('#taAvatarLink');
  const taNameInput = $('#taNameInput');
  const closeTaSet = $('#closeTaSet');
  const saveTaSet = $('#saveTaSet');

  const meMask = $('#meMask');
  const meAvatarFile = $('#meAvatarFile');
  const meAvatarLink = $('#meAvatarLink');
  const meNameInput = $('#meNameInput');
  const closeMeSet = $('#closeMeSet');
  const saveMeSet = $('#saveMeSet');

  const delayMask = $('#delayMask');
  const minDelayInput = $('#minDelayInput');
  const maxDelayInput = $('#maxDelayInput');
  const closeDelaySet = $('#closeDelaySet');
  const saveDelaySet = $('#saveDelaySet');

  const mailTabs = $$('.mail-tab');
  const letterInput = $('#letterInput');
  const sendLetterBtn = $('#sendLetterBtn');
  const inboxWrap = $('#inboxWrap');

  const newGroupName = $('#newGroupName');
  const createGroupBtn = $('#createGroupBtn');
  const groupListWrap = $('#groupListWrap');
  const currentGroupSelect = $('#currentGroupSelect');
  const newCardInput = $('#newCardInput');
  const addSingleCard = $('#addSingleCard');
  const batchTextarea = $('#batchTextarea');
  const batchImportBtn = $('#batchImportBtn');
  const cardListWrap = $('#cardListWrap');

  const headerTaAvatar = $('#headerTaAvatar');
  const headerMyAvatar = $('#headerMyAvatar');
  const currentStatusText = $('#currentStatusText');

  const animToggle = $('#animToggle');

  const quoteBar = $('#quoteBar');
  const quoteContent = $('#quoteContent');
  const quoteClose = $('#quoteClose');

  const calendarGrid = $('#calendarGrid');
  const calTaText = $('#calTaText');
  const calMeText = $('#calMeText');
  const openMoodModal = $('#openMoodModal');
  const moodModal = $('#moodModal');
  const moodEmojiGrid = $('#moodEmojiGrid');
  const moodTextInput = $('#moodTextInput');
  const closeMoodModal = $('#closeMoodModal');
  const saveMoodModal = $('#saveMoodModal');

  const exportDataBtn = $('#exportDataBtn');
  const importDataBtn = $('#importDataBtn');
  const importConfirmMask = $('#importConfirmMask');
  const importCancelBtn = $('#importCancelBtn');
  const importConfirmBtn = $('#importConfirmBtn');

  let currentEditTarget = null;
  let currentMailTab = 'write';
  let typingTimer = null;
  let letterTimer = null;
  let selectedMoodEmoji = null;
  let currentDateStr = null;

  // ============================================================
  //  PAGE SWITCHING
  // ============================================================
  function switchPage(pageName) {
    const pages = $$('.page');
    const target = document.querySelector(`.${pageName}`);
    if (!target) return;

    pages.forEach(p => p.classList.remove('active'));
    target.classList.add('active');

    if (topHeader) topHeader.classList.toggle('show', pageName === 'chat-page');
    document.body.classList.toggle('home-bg', pageName === 'home-page');

    if (pageName === 'chat-page') {
      renderMessages();
      setTimeout(() => { chatWrap.scrollTop = chatWrap.scrollHeight; }, 50);
    }
    if (pageName === 'calendar-page') {
      renderCalendar();
    }
  }

  // ============================================================
  //  NAVIGATION
  // ============================================================
  $$('.app-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.dataset.target;
      if (target) switchPage(target);
    });
  });

  $$('.back-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      switchPage('home-page');
    });
  });

  if (chatSetBack) {
    chatSetBack.addEventListener('click', function(e) {
      e.stopPropagation();
      switchPage('chat-page');
    });
  }

  if (openChatSettingPage) {
    openChatSettingPage.addEventListener('click', function() {
      switchPage('chat-set-page');
    });
  }

  // ============================================================
  //  ANIMATION TOGGLE
  // ============================================================
  function updateAnimToggleUI() {
    if (!animToggle) return;
    if (store.animEnabled) {
      animToggle.classList.add('active');
      document.body.classList.remove('no-transition');
    } else {
      animToggle.classList.remove('active');
      document.body.classList.add('no-transition');
    }
  }
  if (animToggle) {
    animToggle.addEventListener('click', function() {
      store.animEnabled = !store.animEnabled;
      updateAnimToggleUI();
      saveLocal();
    });
  }

  // ============================================================
  //  WALLPAPER / ICON MODALS
  // ============================================================
  function openImageModal(title, targetKey) {
    currentEditTarget = targetKey;
    modalTitle.innerText = title;
    localImageFile.value = '';
    let existing = '';
    if (targetKey === 'wallpaper') existing = store.wallpaper;
    else if (targetKey === 'chatBg') existing = store.chatBg;
    else existing = store.appIcon[targetKey] || '';
    imageLinkInput.value = existing;
    imageSelectMask.style.display = 'flex';
  }

  if (openWallpaperModal) {
    openWallpaperModal.addEventListener('click', function() {
      openImageModal('设置主页壁纸', 'wallpaper');
    });
  }
  if (openChatBgModal) {
    openChatBgModal.addEventListener('click', function() {
      openImageModal('设置聊天背景', 'chatBg');
    });
  }

  changeIconBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      const labelMap = { chat:'聊天', card:'字卡', theme:'外观', mail:'信箱', calendar:'日历', setting:'设置' };
      openImageModal('更改 ' + (labelMap[type]||'图标'), type);
    });
  });

  if (closeImageModal) {
    closeImageModal.addEventListener('click', function() {
      imageSelectMask.style.display = 'none';
      currentEditTarget = null;
    });
  }

  if (confirmImageBtn) {
    confirmImageBtn.addEventListener('click', async function() {
      let url = '';
      if (localImageFile.files && localImageFile.files[0]) {
        url = await fileToDataUrl(localImageFile.files[0]);
      } else if (imageLinkInput.value.trim()) {
        url = imageLinkInput.value.trim();
      }
      if (!url) return;

      if (currentEditTarget === 'wallpaper') {
        store.wallpaper = url;
        wallpaperPreview.src = url;
      } else if (currentEditTarget === 'chatBg') {
        store.chatBg = url;
        chatBgPreview.src = url;
      } else {
        store.appIcon[currentEditTarget] = url;
        refreshAllIconPreview();
      }
      saveLocal();
      applyBgStyle();
      imageSelectMask.style.display = 'none';
      currentEditTarget = null;
    });
  }

  // ============================================================
  //  CHAT SETTINGS (不含状态)
  // ============================================================
  if (blockTa) {
    blockTa.addEventListener('click', function() {
      taNameInput.value = store.taInfo.name;
      taAvatarLink.value = store.taInfo.avatarUrl || '';
      taAvatarFile.value = '';
      taMask.style.display = 'flex';
    });
  }
  if (closeTaSet) {
    closeTaSet.addEventListener('click', function() { taMask.style.display = 'none'; });
  }
  if (saveTaSet) {
    saveTaSet.addEventListener('click', async function() {
      store.taInfo.name = taNameInput.value.trim() || '梦角';
      let url = store.taInfo.avatarUrl;
      if (taAvatarFile.files && taAvatarFile.files[0]) {
        url = await fileToDataUrl(taAvatarFile.files[0]);
      } else if (taAvatarLink.value.trim()) {
        url = taAvatarLink.value.trim();
      }
      store.taInfo.avatarUrl = url;
      renderHeaderAvatar();
      saveLocal();
      taMask.style.display = 'none';
    });
  }

  if (blockMe) {
    blockMe.addEventListener('click', function() {
      meNameInput.value = store.myInfo.name;
      meAvatarLink.value = store.myInfo.avatarUrl || '';
      meAvatarFile.value = '';
      meMask.style.display = 'flex';
    });
  }
  if (closeMeSet) {
    closeMeSet.addEventListener('click', function() { meMask.style.display = 'none'; });
  }
  if (saveMeSet) {
    saveMeSet.addEventListener('click', async function() {
      store.myInfo.name = meNameInput.value.trim() || '我';
      let url = store.myInfo.avatarUrl;
      if (meAvatarFile.files && meAvatarFile.files[0]) {
        url = await fileToDataUrl(meAvatarFile.files[0]);
      } else if (meAvatarLink.value.trim()) {
        url = meAvatarLink.value.trim();
      }
      store.myInfo.avatarUrl = url;
      renderHeaderAvatar();
      saveLocal();
      meMask.style.display = 'none';
    });
  }

  if (blockDelay) {
    blockDelay.addEventListener('click', function() {
      minDelayInput.value = store.delay.min;
      maxDelayInput.value = store.delay.max;
      delayMask.style.display = 'flex';
    });
  }
  if (closeDelaySet) {
    closeDelaySet.addEventListener('click', function() { delayMask.style.display = 'none'; });
  }
  if (saveDelaySet) {
    saveDelaySet.addEventListener('click', function() {
      let min = Math.max(Number(minDelayInput.value) || 20, 20);
      let max = Math.min(Number(maxDelayInput.value) || 120, 120);
      if (min > max)[min, max] = [max, min];
      store.delay.min = min;
      store.delay.max = max;
      saveLocal();
      delayMask.style.display = 'none';
    });
  }

  if (saveChatSetting) {
    saveChatSetting.addEventListener('click', function() {
      applyBgStyle();
      saveLocal();
      renderHeaderAvatar();
      switchPage('chat-page');
    });
  }

  // ============================================================
  //  EMOJI
  // ============================================================
  if (emojiToggle) {
    emojiToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      emojiPanel.classList.toggle('show');
    });
  }
  document.addEventListener('click', function(e) {
    if (emojiPanel && emojiToggle && !emojiPanel.contains(e.target) && e.target !== emojiToggle) {
      emojiPanel.classList.remove('show');
    }
  });

  if (addEmojiBtn) {
    addEmojiBtn.addEventListener('click', async function() {
      let url = '';
      if (emojiFileInput.files && emojiFileInput.files[0]) {
        url = await fileToDataUrl(emojiFileInput.files[0]);
      } else if (emojiLinkInput.value.trim()) {
        url = emojiLinkInput.value.trim();
      }
      if (!url) return;
      store.emojiList.push(url);
      emojiFileInput.value = '';
      emojiLinkInput.value = '';
      saveLocal();
      renderEmojiList();
    });
  }

  function renderEmojiList() {
    if (!emojiList) return;
    emojiList.innerHTML = '';
    store.emojiList.forEach(src => {
      const div = document.createElement('div');
      div.className = 'emoji-item';
      div.innerHTML = `<img src="${src}" loading="lazy">`;
      div.addEventListener('click', function() {
        inputText.value += `[emoji:${src}]`;
        inputText.focus();
      });
      emojiList.appendChild(div);
    });
  }

  // ============================================================
  //  MAIL
  // ============================================================
  mailTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      mailTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentMailTab = this.dataset.tab;
      const writeBox = document.querySelector('.write-box');
      const inboxBox = document.getElementById('inboxWrap');
      if (writeBox) writeBox.classList.toggle('hidden', currentMailTab !== 'write');
      if (inboxBox) inboxBox.classList.toggle('hidden', currentMailTab !== 'inbox');
      if (currentMailTab === 'inbox') renderInbox();
    });
  });

  if (sendLetterBtn) {
    sendLetterBtn.addEventListener('click', function() {
      const text = letterInput.value.trim();
      if (!text) return;
      const len = text.length;
      const delayHour = 12 + (len / 500) * 12;
      const realDelay = Math.min(Math.max(delayHour, 12), 24) * 3600 * 1000;
      const create = Date.now();
      const replyTime = create + realDelay;
      store.letters.push({ text, create, replyTime, done: false });
      letterInput.value = '';
      saveLocal();
      scheduleLetterReplies();
      const hours = Math.round(realDelay / 3600000);
      alert(`信件已寄出，预计 ${hours} 小时后收到回信。`);
    });
  }

  function scheduleLetterReplies() {
    if (letterTimer) { clearTimeout(letterTimer); letterTimer = null; }
    const now = Date.now();
    let earliest = Infinity;
    store.letters.forEach(l => {
      if (!l.done && l.replyTime > now && l.replyTime < earliest) earliest = l.replyTime;
    });
    if (earliest !== Infinity) {
      const delay = earliest - now + 1000;
      letterTimer = setTimeout(() => { processLetterReplies(); }, Math.max(delay, 1000));
    }
  }

  function processLetterReplies() {
    const allCards = getAllValidCards();
    let changed = false;
    store.letters.forEach(letter => {
      if (letter.done || Date.now() < letter.replyTime) return;
      letter.done = true;
      changed = true;
      const count = randomInt(5, 20);
      let reply = [];
      for (let i=0; i<count; i++) {
        if (allCards.length===0) reply.push('（暂无字卡）');
        else reply.push(allCards[randomInt(0, allCards.length-1)].text);
      }
      store.inbox.push({ replyText: reply.join(''), originText: letter.text, time: letter.replyTime });
    });
    if (changed) { saveLocal(); renderInbox(); }
    scheduleLetterReplies();
  }

  function renderInbox() {
    if (!inboxWrap) return;
    inboxWrap.innerHTML = '';
    if (store.inbox.length === 0) {
      inboxWrap.innerHTML = '<div style="text-align:center;color:#aaa;padding:40px 0;">暂无回信</div>';
      return;
    }
    [...store.inbox].reverse().forEach(item => {
      const div = document.createElement('div');
      div.className = 'letter-item';
      div.innerHTML = `
        <div class="letter-origin">我方原信：${escapeHtml(item.originText)}</div>
        <div class="letter-time">${formatTime(item.time)}</div>
        <div class="letter-content">${escapeHtml(item.replyText)}</div>
      `;
      inboxWrap.appendChild(div);
    });
  }

  // ============================================================
  //  CHAT
  // ============================================================
  // [状态随机抽取] 从字卡库随机取一条作为状态
  function updateRandomStatus() {
    const allCards = getAllValidCards();
    if (allCards.length > 0) {
      const randomIndex = randomInt(0, allCards.length - 1);
      store.currentStatus = allCards[randomIndex].text;
    } else {
      store.currentStatus = '暂无状态字卡';
    }
    if (currentStatusText) {
      currentStatusText.innerText = store.currentStatus;
    }
  }

  function renderHeaderAvatar() {
    headerTaAvatar.src = store.taInfo.avatarUrl || '';
    headerMyAvatar.src = store.myInfo.avatarUrl || '';
    // 更新状态（每次加载时随机抽取）
    updateRandomStatus();
  }

  function applyBgStyle() {
    document.body.style.setProperty('--wallpaper', store.wallpaper ? `url(${store.wallpaper})` : 'none');
    document.documentElement.style.setProperty('--chat-bg', store.chatBg ? `url(${store.chatBg})` : 'none');
  }

  function refreshAllIconPreview() {
    const icons = ['chat','card','theme','mail','calendar','setting'];
    icons.forEach(key => {
      const el = document.getElementById(key + 'AppIcon');
      const prev = document.getElementById(key + 'IconPreview');
      const src = store.appIcon[key] || '';
      if (el) el.src = src;
      if (prev) prev.src = src;
    });
  }

  function parseEmojiText(text) {
    return text.replace(/\[emoji:(.+?)\]/g, (m, src) => `<img class="msg-emoji-inside" src="${src}" loading="lazy">`);
  }

  function randomAttachEmoji() {
    if (store.emojiList.length === 0) return null;
    if (Math.random() < 0.25) return store.emojiList[randomInt(0, store.emojiList.length-1)];
    return null;
  }

  function renderMessages() {
    if (!chatWrap) return;
    chatWrap.innerHTML = '';
    let lastTime = 0;
    store.messages.forEach(msg => {
      if (msg.time - lastTime > 10*60*1000) {
        const div = document.createElement('div');
        div.className = 'time-divider';
        div.innerText = formatTime(msg.time);
        chatWrap.appendChild(div);
      }
      lastTime = msg.time;
      appendMessageElement(msg);
    });
    chatWrap.scrollTop = chatWrap.scrollHeight;
  }

  function appendMessageElement(msg) {
    const item = document.createElement('div');
    item.className = `msg-item ${msg.isUser ? 'user-msg' : 'target-msg'}`;
    item.dataset.msgId = msg.id;

    let quoteHtml = '';
    if (msg.quote) {
      quoteHtml = `<div class="msg-quote">📎 ${escapeHtml(msg.quote.text)}</div>`;
    }

    let html = parseEmojiText(msg.text);
    let emojiSrc = null;
    if (!msg.isUser)
