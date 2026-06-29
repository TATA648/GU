document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  //  DATA STORE
  // ============================================================
  let store = {
    taInfo: { name: "梦角", avatarUrl: "" },
    myInfo: { name: "我", avatarUrl: "" },
    delay: { min: 20, max: 120 },
    chatBg: "",
    appIcon: { chat: "", card: "", theme: "", mail: "" },
    wallpaper: "",
    groups: {},
    currentSelectGroup: "",
    letters: [],
    inbox: [],
    emojiList: [],
    lastChatTime: 0,
    animEnabled: true
  };

  // ============================================================
  //  DOM REFS
  // ============================================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

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

  const chatIconPreview = $('#chatIconPreview');
  const cardIconPreview = $('#cardIconPreview');
  const themeIconPreview = $('#themeIconPreview');
  const mailIconPreview = $('#mailIconPreview');
  const chatAppIcon = $('#chatAppIcon');
  const cardAppIcon = $('#cardAppIcon');
  const themeAppIcon = $('#themeAppIcon');
  const mailAppIcon = $('#mailAppIcon');
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
  const targetName = $('#targetName');

  const animToggle = $('#animToggle');

  let currentEditTarget = null;
  let currentMailTab = 'write';
  let typingTimer = null;
  let letterTimer = null;

  // ============================================================
  //  PAGE SWITCHING with animation
  // ============================================================
  function switchPage(pageName) {
    const pages = $$('.page');
    const target = document.querySelector(`.${pageName}`);
    if (!target) return;

    pages.forEach(p => p.classList.remove('active'));

    if (store.animEnabled) {
      target.style.opacity = '0';
      target.style.transform = 'translateY(6px)';
      target.classList.add('active');
      requestAnimationFrame(() => {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      });
    } else {
      target.classList.add('active');
    }

    if (topHeader) topHeader.classList.toggle('show', pageName === 'chat-page');
    document.body.classList.toggle('home-bg', pageName === 'home-page');

    if (pageName === 'chat-page' && chatWrap) {
      setTimeout(() => {
        chatWrap.scrollTop = chatWrap.scrollHeight;
      }, 50);
    }
  }

  // ============================================================
  //  NAVIGATION BINDING
  // ============================================================
  $$('.app-card').forEach(card => {
    card.addEventListener('click', function() {
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
      const labelMap = { chat: '聊天传讯图标', card: '字卡管理图标', theme: '外观设置图标', mail: '信箱图标' };
      openImageModal('更改 ' + (labelMap[type] || '图标'), type);
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
  //  CHAT SETTINGS (关于TA / 关于我 / 回复时长)
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
  //  EMOJI PANEL
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
    if (letterTimer) {
      clearTimeout(letterTimer);
      letterTimer = null;
    }
    const now = Date.now();
    let earliest = Infinity;
    store.letters.forEach(l => {
      if (!l.done && l.replyTime > now) {
        if (l.replyTime < earliest) earliest = l.replyTime;
      }
    });
    if (earliest !== Infinity) {
      const delay = earliest - now + 1000;
      letterTimer = setTimeout(() => {
        processLetterReplies();
      }, Math.max(delay, 1000));
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
      for (let i = 0; i < count; i++) {
        if (allCards.length === 0) {
          reply.push('（暂无字卡，请前往字卡库添加）');
        } else {
          reply.push(allCards[randomInt(0, allCards.length - 1)].text);
        }
      }
      store.inbox.push({
        replyText: reply.join(''),
        originText: letter.text,
        time: letter.replyTime
      });
    });
    if (changed) {
      saveLocal();
      renderInbox();
    }
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
  function renderHeaderAvatar() {
    targetName.innerText = store.taInfo.name || '梦角';
    headerTaAvatar.src = store.taInfo.avatarUrl || '';
    headerMyAvatar.src = store.myInfo.avatarUrl || '';
  }

  function applyBgStyle() {
    document.body.style.setProperty('--wallpaper', store.wallpaper ? `url(${store.wallpaper})` : 'none');
    document.documentElement.style.setProperty('--chat-bg', store.chatBg ? `url(${store.chatBg})` : 'none');
  }

  function refreshAllIconPreview() {
    const icons = ['chat', 'card', 'theme', 'mail'];
    icons.forEach(key => {
      const el = document.getElementById(key + 'AppIcon');
      const prev = document.getElementById(key + 'IconPreview');
      const src = store.appIcon[key] || '';
      if (el) el.src = src;
      if (prev) prev.src = src;
    });
  }

  function parseEmojiText(text) {
    return text.replace(/\[emoji:(.+?)\]/g, (m, src) => {
      return `<img class="msg-emoji-inside" src="${src}" loading="lazy">`;
    });
  }

  function randomAttachEmoji() {
    if (store.emojiList.length === 0) return null;
    const r = Math.random();
    if (r < 0.25) return store.emojiList[randomInt(0, store.emojiList.length - 1)];
    return null;
  }

  function addBubble(text, isUser, time) {
    if (needTimeStamp()) addTimeDivider();
    store.lastChatTime = Date.now();

    const item = document.createElement('div');
    item.className = `msg-item ${isUser ? 'user-msg' : 'target-msg'}`;
    let html = parseEmojiText(text);
    let emojiSrc = null;
    if (!isUser) emojiSrc = randomAttachEmoji();
    if (emojiSrc && text.trim() === '') {
      html = `<img class="msg-emoji-inside" style="width:40px;height:40px;" src="${emojiSrc}">`;
    } else if (emojiSrc) {
      html += `<img class="msg-emoji-inside" src="${emojiSrc}">`;
    }
    const avatarSrc = isUser ? store.myInfo.avatarUrl : store.taInfo.avatarUrl;
    item.innerHTML = `
      <div class="msg-avatar">
        ${avatarSrc ? `<img src="${avatarSrc}" loading="lazy">` : ''}
      </div>
      <div class="msg-bubble-wrap">
        <div class="msg-bubble">${html}</div>
        <div class="time-text">${time}</div>
      </div>
    `;
    chatWrap.appendChild(item);
    chatWrap.scrollTop = chatWrap.scrollHeight;
  }

  function needTimeStamp() {
    const now = Date.now();
    if (now - store.lastChatTime > 10 * 60 * 1000) {
      store.lastChatTime = now;
      return true;
    }
    return false;
  }

  function addTimeDivider() {
    const div = document.createElement('div');
    div.className = 'time-divider';
    div.innerText = getNowTime();
    chatWrap.appendChild(div);
  }

  function getNowTime() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function getAllValidCards() {
    let list = [];
    Object.values(store.groups).forEach(arr => {
      list = list.concat(arr.filter(item => !item.disabled));
    });
    return list;
  }

  function getRandomReplyArr() {
    const pool = getAllValidCards();
    if (pool.length === 0) return [{ text: '暂无可用字卡，请前往字卡库添加分组与词条' }];
    let arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[r]] = [arr[r], arr[i]];
    }
    const take = Math.floor(Math.random() * 3) + 1;
    return arr.slice(0, take);
  }

  function sendMessage() {
    const content = inputText.value.trim();
    if (!content) return;
    addBubble(content, true, getNowTime());
    inputText.value = '';

    const min = store.delay.min * 1000;
    const max = store.delay.max * 1000;
    const wait = Math.floor(Math.random() * (max - min) + min);

    const tempItem = document.createElement('div');
    tempItem.className = 'msg-item target-msg';
    tempItem.innerHTML = `
      <div class="msg-avatar">${store.taInfo.avatarUrl ? `<img src="${store.taInfo.avatarUrl}" loading="lazy">` : ''}</div>
      <div class="msg-bubble-wrap">
        <div class="msg-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    chatWrap.appendChild(tempItem);
    chatWrap.scrollTop = chatWrap.scrollHeight;

    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      tempItem.remove();
      const replyList = getRandomReplyArr();
      replyList.forEach((item, idx) => {
        setTimeout(() => {
          addBubble(item.text, false, getNowTime());
        }, idx * 500);
      });
      typingTimer = null;
    }, wait);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  if (inputText) {
    inputText.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // ============================================================
  //  CARD MANAGEMENT
  // ============================================================
  if (createGroupBtn) {
    createGroupBtn.addEventListener('click', function() {
      const name = newGroupName.value.trim();
      if (!name) {
        alert('请输入分组名称');
        return;
      }
      if (store.groups[name]) {
        alert('分组已存在');
        return;
      }
      store.groups[name] = [];
      newGroupName.value = '';
      saveLocal();
      refreshGroupSelect();
    });
  }
  if (newGroupName) {
    newGroupName.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') createGroupBtn.click();
    });
  }

  function refreshGroupSelect() {
    const keys = Object.keys(store.groups);
    groupListWrap.innerHTML = '';
    currentGroupSelect.innerHTML = '';

    if (keys.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '请先创建分组';
      currentGroupSelect.appendChild(opt);
      cardListWrap.innerHTML = '<div style="color:#999;text-align:center;padding:20px 0;">暂无分组，请创建</div>';
      return;
    }

    keys.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = `${g} (${store.groups[g].length}条)`;
      currentGroupSelect.appendChild(opt);

      const row = document.createElement('div');
      row.className = 'group-item-row';
      row.innerHTML = `<span>${g}</span><span class="del-group-btn" data-group="${g}">删除</span>`;
      const delBtn = row.querySelector('.del-group-btn');
      delBtn.addEventListener('click', function() {
        const gName = this.dataset.group;
        if (confirm(`确定删除分组「${gName}」及其所有字卡吗？`)) {
          delete store.groups[gName];
          if (store.currentSelectGroup === gName) {
            store.currentSelectGroup = Object.keys(store.groups)[0] || '';
          }
          saveLocal();
          refreshGroupSelect();
        }
      });
      groupListWrap.appendChild(row);
    });

    if (!keys.includes(store.currentSelectGroup)) {
      store.currentSelectGroup = keys[0];
    }
    currentGroupSelect.value = store.currentSelectGroup;
    currentGroupSelect.onchange = function() {
      store.currentSelectGroup = this.value;
      saveLocal();
      renderCurrentCardList();
    };
    renderCurrentCardList();
  }

  function renderCurrentCardList() {
    cardListWrap.innerHTML = '';
    const g = store.currentSelectGroup;
    if (!g || !store.groups[g] || store.groups[g].length === 0) {
      cardListWrap.innerHTML = '<div style="color:#999;text-align:center;padding:20px 0;">暂无字卡</div>';
      return;
    }
    const list = store.groups[g];
    list.forEach((card, idx) => {
      const div = document.createElement('div');
      div.className = `card-item ${card.disabled ? 'disabled' : ''}`;
      div.innerHTML = `
        <div class="card-text">${escapeHtml(card.text)}</div>
        <div class="card-opts">
          <button class="edit-btn" data-idx="${idx}">编辑</button>
          <button class="del-btn" data-idx="${idx}">删除</button>
          <button class="switch-btn" data-idx="${idx}">${card.disabled ? '启用' : '屏蔽'}</button>
        </div>
      `;
      div.querySelector('.edit-btn').addEventListener('click', function() {
        const i = parseInt(this.dataset.idx);
        const res = prompt('修改字卡', list[i].text);
        if (res && res.trim()) {
          list[i].text = res.trim();
          saveLocal();
          renderCurrentCardList();
        }
      });
      div.querySelector('.del-btn').addEventListener('click', function() {
        const i = parseInt(this.dataset.idx);
        list.splice(i, 1);
        saveLocal();
        renderCurrentCardList();
      });
      div.querySelector('.switch-btn').addEventListener('click', function() {
        const i = parseInt(this.dataset.idx);
        list[i].disabled = !list[i].disabled;
        saveLocal();
        renderCurrentCardList();
      });
      cardListWrap.appendChild(div);
    });
  }

  if (addSingleCard) {
    addSingleCard.addEventListener('click', function() {
      const text = newCardInput.value.trim();
      const g = store.currentSelectGroup;
      if (!text) {
        alert('请输入字卡内容');
        return;
      }
      if (!g || !store.groups[g]) {
        alert('请先选择或创建一个分组');
        return;
      }
      store.groups[g].push({ id: Date.now() + Math.random(), text: text, disabled: false });
      newCardInput.value = '';
      saveLocal();
      renderCurrentCardList();
      refreshGroupSelect();
    });
  }
  if (newCardInput) {
    newCardInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addSingleCard.click();
    });
  }

  if (batchImportBtn) {
    batchImportBtn.addEventListener('click', function() {
      const text = batchTextarea.value.trim();
      const g = store.currentSelectGroup;
      if (!text) {
        alert('请填入要导入的字卡，每行一条');
        return;
      }
      if (!g || !store.groups[g]) {
        alert('请先选择或创建一个分组');
        return;
      }
      const arr = text.split('\n').map(s => s.trim()).filter(s => s);
      if (arr.length === 0) {
        alert('没有有效的字卡内容');
        return;
      }
      arr.forEach(t => {
        store.groups[g].push({ id: Date.now() + Math.random(), text: t, disabled: false });
      });
      batchTextarea.value = '';
      saveLocal();
      renderCurrentCardList();
      refreshGroupSelect();
    });
  }

  // ============================================================
  //  UTILITY
  // ============================================================
  function fileToDataUrl(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return `${d.getMonth()+1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  //  STORAGE
  // ============================================================
  function loadLocal() {
    try {
      const raw = localStorage.getItem('dreamCardStore');
      if (raw) {
        const parsed = JSON.parse(raw);
        store = { ...store, ...parsed };
      }
    } catch (e) { console.warn('Load local error', e); }
    renderHeaderAvatar();
    refreshAllIconPreview();
    if (wallpaperPreview) wallpaperPreview.src = store.wallpaper || '';
    if (chatBgPreview) chatBgPreview.src = store.chatBg || '';
    applyBgStyle();
    refreshGroupSelect();
    renderEmojiList();
    renderInbox();
    updateAnimToggleUI();
    scheduleLetterReplies();
  }

  function saveLocal() {
    try {
      localStorage.setItem('dreamCardStore', JSON.stringify(store));
    } catch (e) { console.warn('Save local error', e); }
  }

  // ============================================================
  //  INIT
  // ============================================================
  // 防止双击缩放 (全局)
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  loadLocal();
  applyBgStyle();

  if (document.querySelector('.chat-page.active') && chatWrap) {
    setTimeout(() => {
      chatWrap.scrollTop = chatWrap.scrollHeight;
    }, 100);
  }

  console.log('✅ 梦角字卡传讯已启动 | 动画:', store.animEnabled ? '开启' : '关闭');
});
