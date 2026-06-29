let store = {
  base: {
    name: "梦角",
    head: "角",
    avatarUrl: "",
    minDelay: 20,
    maxDelay: 60
  },
  appIcon: {
    chat: "",
    card: "",
    theme: ""
  },
  wallpaper: "",
  groups: {},
  currentSelectGroup: ""
};

const topHeader = document.querySelector('.top-header');
const chatWrap = document.getElementById('chatWrap');
const inputText = document.getElementById('inputText');
const sendBtn = document.getElementById('sendBtn');
const inputWrap = document.getElementById('inputWrap');
const mask = document.getElementById('mask');
const openSet = document.getElementById('openSet');
const closeSet = document.getElementById('closeSet');
const saveSet = document.getElementById('saveSet');
const nameInput = document.getElementById('nameInput');
const headText = document.getElementById('headText');
const minDelaySec = document.getElementById('minDelaySec');
const maxDelaySec = document.getElementById('maxDelaySec');
const targetName = document.getElementById('targetName');
const avatarImg = document.getElementById('avatarImg');
const avatarText = document.getElementById('avatarText');
const avatarClickEdit = document.getElementById('avatarClickEdit');

// 通用图片弹窗
const imageSelectMask = document.getElementById('imageSelectMask');
const modalTitle = document.getElementById('modalTitle');
const localImageFile = document.getElementById('localImageFile');
const imageLinkInput = document.getElementById('imageLinkInput');
const closeImageModal = document.getElementById('closeImageModal');
const confirmImageBtn = document.getElementById('confirmImageBtn');

// 头像弹窗
const avatarMask = document.getElementById('avatarMask');
const avatarLocalFile = document.getElementById('avatarLocalFile');
const avatarLinkInput = document.getElementById('avatarLinkInput');
const closeAvatarSet = document.getElementById('closeAvatarSet');
const saveAvatarBtn = document.getElementById('saveAvatarBtn');

// 壁纸
const wallpaperPreview = document.getElementById('wallpaperPreview');
const openWallpaperModal = document.getElementById('openWallpaperModal');

// 图标预览
const chatIconPreview = document.getElementById('chatIconPreview');
const cardIconPreview = document.getElementById('cardIconPreview');
const themeIconPreview = document.getElementById('themeIconPreview');
const chatAppIcon = document.getElementById('chatAppIcon');
const cardAppIcon = document.getElementById('cardAppIcon');
const themeAppIcon = document.getElementById('themeAppIcon');
const changeIconBtns = document.querySelectorAll('.icon-change-btn');

let currentEditTarget = null;

// 页面切换
function switchPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelector(`.${pageName}`).classList.add('active');
  topHeader.classList.toggle('show', pageName === 'chat-page');
}

// 返回按钮
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.onclick = function() {
    switchPage('home-page');
  }
});

// 首页卡片跳转
document.querySelectorAll('.app-card').forEach(card => {
  card.onclick = function() {
    const target = this.dataset.target;
    if(target) switchPage(target);
  }
});

// 打开壁纸弹窗
openWallpaperModal.onclick = function() {
  currentEditTarget = 'wallpaper';
  modalTitle.innerText = '设置主页壁纸';
  localImageFile.value = '';
  imageLinkInput.value = store.wallpaper;
  imageSelectMask.style.display = 'flex';
};

// 图标修改按钮
changeIconBtns.forEach(btn => {
  btn.onclick = function() {
    const type = this.dataset.type;
    currentEditTarget = type;
    modalTitle.innerText = '更改图标';
    localImageFile.value = '';
    imageLinkInput.value = store.appIcon[type];
    imageSelectMask.style.display = 'flex';
  }
});

closeImageModal.onclick = function() {
  imageSelectMask.style.display = 'none';
  currentEditTarget = null;
};

// 确认图片
confirmImageBtn.onclick = async function() {
  let url = '';
  if(localImageFile.files[0]) {
    url = await fileToDataUrl(localImageFile.files[0]);
  } else if(imageLinkInput.value.trim()) {
    url = imageLinkInput.value.trim();
  }
  if(!url) return;

  if(currentEditTarget === 'wallpaper') {
    store.wallpaper = url;
    document.body.style.setProperty('--wallpaper', `url(${url})`);
    wallpaperPreview.src = url;
  } else {
    store.appIcon[currentEditTarget] = url;
    refreshAllIconPreview();
  }
  saveLocal();
  imageSelectMask.style.display = 'none';
  currentEditTarget = null;
};

// 头像点击打开弹窗
avatarClickEdit.onclick = function() {
  avatarLocalFile.value = '';
  avatarLinkInput.value = store.base.avatarUrl;
  avatarMask.style.display = 'flex';
};
closeAvatarSet.onclick = function() {
  avatarMask.style.display = 'none';
};
saveAvatarBtn.onclick = async function() {
  let url = '';
  if(avatarLocalFile.files[0]) {
    url = await fileToDataUrl(avatarLocalFile.files[0]);
  } else if(avatarLinkInput.value.trim()) {
    url = avatarLinkInput.value.trim();
  }
  if(url) {
    store.base.avatarUrl = url;
    renderHeader();
    saveLocal();
  }
  avatarMask.style.display = 'none';
};

// 文件转base64
function fileToDataUrl(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

function refreshAllIconPreview() {
  chatAppIcon.src = store.appIcon.chat;
  cardAppIcon.src = store.appIcon.card;
  themeAppIcon.src = store.appIcon.theme;
  chatIconPreview.src = store.appIcon.chat;
  cardIconPreview.src = store.appIcon.card;
  themeIconPreview.src = store.appIcon.theme;
}

// 键盘适配
window.visualViewport.addEventListener('resize', () => {
  const safe = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;
  if(window.visualViewport.height < window.innerHeight - 100) {
    inputWrap.style.bottom = (safe + window.innerHeight - window.visualViewport.height) + 'px';
  } else {
    inputWrap.style.bottom = safe + 'px';
  }
});

function loadLocal() {
  const raw = localStorage.getItem('dreamCardStore');
  if(raw) store = JSON.parse(raw);
  renderHeader();
  refreshAllIconPreview();
  wallpaperPreview.src = store.wallpaper;
  if(store.wallpaper) document.body.style.setProperty('--wallpaper', `url(${store.wallpaper})`);
  refreshGroupSelect();
}
function saveLocal() {
  localStorage.setItem('dreamCardStore', JSON.stringify(store));
}

function renderHeader() {
  targetName.innerText = store.base.name;
  avatarText.innerText = store.base.head;
  if(store.base.avatarUrl) {
    avatarImg.src = store.base.avatarUrl;
    avatarImg.classList.add('show');
  } else {
    avatarImg.classList.remove('show');
  }
}

function getNowTime() {
  const d = new Date();
  let h = String(d.getHours()).padStart(2,'0');
  let m = String(d.getMinutes()).padStart(2,'0');
  return h + ':' + m;
}

function addBubble(text, isUser, time, isTyping = false) {
  const item = document.createElement('div');
  item.className = `msg-item ${isUser ? 'user-msg' : 'target-msg'}`;
  if(isTyping) {
    item.innerHTML = `
      <div class="msg-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
      <div class="time-text">${time}</div>
    `;
  } else {
    item.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <div class="time-text">${time}</div>
    `;
  }
  chatWrap.appendChild(item);
  chatWrap.scrollTop = chatWrap.scrollHeight;
  return item;
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
  if(pool.length === 0) return ["暂无可用字卡，请前往字卡库添加分组与词条"];
  let arr = [...pool];
  for(let i = arr.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[r]] = [arr[r], arr[i]];
  }
  const take = Math.floor(Math.random() * 3) + 1;
  return arr.slice(0, take);
}

function sendMessage() {
  const content = inputText.value.trim();
  if(!content) return;
  addBubble(content, true, getNowTime());
  inputText.value = '';

  const min = store.base.minDelay * 1000;
  const max = store.base.maxDelay * 1000;
  const wait = Math.floor(Math.random() * (max - min) + min);
  const tip = addBubble('', false, getNowTime(), true);

  setTimeout(() => {
    tip.remove();
    const reply = getRandomReplyArr();
    reply.forEach((item, idx) => {
      setTimeout(() => addBubble(item.text, false, getNowTime()), idx * 500);
    });
  }, wait);
}

sendBtn.onclick = sendMessage;
inputText.onkeydown = e => {
  if(e.key === 'Enter') sendMessage();
};

// 基础设置弹窗
openSet.onclick = function() {
  nameInput.value = store.base.name;
  headText.value = store.base.head;
  minDelaySec.value = store.base.minDelay;
  maxDelaySec.value = store.base.maxDelay;
  mask.style.display = 'flex';
};
closeSet.onclick = function() {
  mask.style.display = 'none';
};
saveSet.onclick = function() {
  let min = Number(minDelaySec.value) || 1;
  let max = Number(maxDelaySec.value) || min;
  store.base.name = nameInput.value.trim() || '梦角';
  store.base.head = headText.value.trim() || '角';
  store.base.minDelay = Math.min(min, max);
  store.base.maxDelay = Math.max(min, max);
  renderHeader();
  saveLocal();
  mask.style.display = 'none';
};

// 分组
const newGroupName = document.getElementById('newGroupName');
const createGroupBtn = document.getElementById('createGroupBtn');
const groupListWrap = document.getElementById('groupListWrap');
const currentGroupSelect = document.getElementById('currentGroupSelect');
const newCardInput = document.getElementById('newCardInput');
const addSingleCard = document.getElementById('addSingleCard');
const batchTextarea = document.getElementById('batchTextarea');
const batchImportBtn = document.getElementById('batchImportBtn');
const cardListWrap = document.getElementById('cardListWrap');

createGroupBtn.onclick = function() {
  const name = newGroupName.value.trim();
  if(!name || store.groups[name]) return;
  store.groups[name] = [];
  newGroupName.value = '';
  saveLocal();
  refreshGroupSelect();
};

function refreshGroupSelect() {
  const keys = Object.keys(store.groups);
  groupListWrap.innerHTML = '';
  currentGroupSelect.innerHTML = '';
  keys.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `${g} (${store.groups[g].length}条)`;
    currentGroupSelect.appendChild(opt);
    const row = document.createElement('div');
    row.className = 'group-item-row';
    row.innerHTML = `<span>${g}</span><span class="del-group-btn">删除</span>`;
    row.querySelector('.del-group-btn').onclick = function() {
      delete store.groups[g];
      saveLocal();
      refreshGroupSelect();
    };
    groupListWrap.appendChild(row);
  });
  if(keys.length && !keys.includes(store.currentSelectGroup)) {
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
  if(!g || !store.groups[g]) return;
  const list = store.groups[g];
  list.forEach((card, idx) => {
    const div = document.createElement('div');
    div.className = `card-item ${card.disabled ? 'disabled' : ''}`;
    div.innerHTML = `
      <div class="card-text">${card.text}</div>
      <div class="card-opts">
        <button class="edit-btn">编辑</button>
        <button class="del-btn">删除</button>
        <button class="switch-btn">${card.disabled ? '启用' : '屏蔽'}</button>
      </div>
    `;
    div.querySelector('.edit-btn').onclick = function() {
      const res = prompt('修改字卡', card.text);
      if(res?.trim()) {
        list[idx].text = res.trim();
        saveLocal();
        renderCurrentCardList();
      }
    };
    div.querySelector('.del-btn').onclick = function() {
      list.splice(idx, 1);
      saveLocal();
      renderCurrentCardList();
    };
    div.querySelector('.switch-btn').onclick = function() {
      list[idx].disabled = !list[idx].disabled;
      saveLocal();
      renderCurrentCardList();
    };
    cardListWrap.appendChild(div);
  });
}

addSingleCard.onclick = function() {
  const text = newCardInput.value.trim();
  const g = store.currentSelectGroup;
  if(!text || !g) return;
  store.groups[g].push({id: Date.now(), text: text, disabled: false});
  newCardInput.value = '';
  saveLocal();
  renderCurrentCardList();
};
newCardInput.onkeydown = e => {
  if(e.key === 'Enter') addSingleCard.click();
};

batchImportBtn.onclick = function() {
  const text = batchTextarea.value.trim();
  const g = store.currentSelectGroup;
  if(!text || !g) return;
  const arr = text.split('\n').map(s => s.trim()).filter(s => s);
  arr.forEach(t => {
    store.groups[g].push({id: Date.now() + Math.random(), text: t, disabled: false});
  });
  batchTextarea.value = '';
  saveLocal();
  renderCurrentCardList();
};

loadLocal();
