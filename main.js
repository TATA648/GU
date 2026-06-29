let store = {
  taInfo: {
    name: "梦角",
    avatarUrl: ""
  },
  myInfo: {
    name: "我",
    avatarUrl: ""
  },
  delay: {
    min: 20,
    max: 120
  },
  chatBg: "",
  appIcon: {
    chat: "",
    card: "",
    theme: "",
    mail: ""
  },
  wallpaper: "",
  groups: {},
  currentSelectGroup: "",
  letters: [],
  inbox: [],
  emojiList: [],
  lastChatTime: 0
};

const topHeader = document.querySelector('.top-header');
const chatWrap = document.getElementById('chatWrap');
const inputText = document.getElementById('inputText');
const sendBtn = document.getElementById('sendBtn');
const inputWrap = document.getElementById('inputWrap');

// 顶部双头像
const headerTaAvatar = document.getElementById('headerTaAvatar');
const headerMyAvatar = document.getElementById('headerMyAvatar');
const targetName = document.getElementById('targetName');

// 表情面板
const emojiToggle = document.getElementById('emojiToggle');
const emojiPanel = document.getElementById('emojiPanel');
const emojiFileInput = document.getElementById('emojiFileInput');
const emojiLinkInput = document.getElementById('emojiLinkInput');
const addEmojiBtn = document.getElementById('addEmojiBtn');
const emojiList = document.getElementById('emojiList');

// 通用图片弹窗
const imageSelectMask = document.getElementById('imageSelectMask');
const modalTitle = document.getElementById('modalTitle');
const localImageFile = document.getElementById('localImageFile');
const imageLinkInput = document.getElementById('imageLinkInput');
const closeImageModal = document.getElementById('closeImageModal');
const confirmImageBtn = document.getElementById('confirmImageBtn');

// 主页壁纸、聊天背景
const wallpaperPreview = document.getElementById('wallpaperPreview');
const openWallpaperModal = document.getElementById('openWallpaperModal');
const chatBgPreview = document.getElementById('chatBgPreview');
const openChatBgModal = document.getElementById('openChatBgModal');

// 图标预览
const chatIconPreview = document.getElementById('chatIconPreview');
const cardIconPreview = document.getElementById('cardIconPreview');
const themeIconPreview = document.getElementById('themeIconPreview');
const mailIconPreview = document.getElementById('mailIconPreview');
const chatAppIcon = document.getElementById('chatAppIcon');
const cardAppIcon = document.getElementById('cardAppIcon');
const themeAppIcon = document.getElementById('themeAppIcon');
const mailAppIcon = document.getElementById('mailAppIcon');
const changeIconBtns = document.querySelectorAll('.icon-change-btn');

// 聊天设置页面
const openChatSettingPage = document.getElementById('openChatSettingPage');
const saveChatSetting = document.getElementById('saveChatSetting');
const chatSetBack = document.querySelector('.chat-set-back');

// 四大设置区块
const blockTa = document.getElementById('blockTa');
const blockMe = document.getElementById('blockMe');
const blockDelay = document.getElementById('blockDelay');

// 关于TA弹窗
const taMask = document.getElementById('taMask');
const taAvatarFile = document.getElementById('taAvatarFile');
const taAvatarLink = document.getElementById('taAvatarLink');
const taNameInput = document.getElementById('taNameInput');
const closeTaSet = document.getElementById('closeTaSet');
const saveTaSet = document.getElementById('saveTaSet');

// 关于我弹窗
const meMask = document.getElementById('meMask');
const meAvatarFile = document.getElementById('meAvatarFile');
const meAvatarLink = document.getElementById('meAvatarLink');
const meNameInput = document.getElementById('meNameInput');
const closeMeSet = document.getElementById('closeMeSet');
const saveMeSet = document.getElementById('saveMeSet');

// 时长弹窗
const delayMask = document.getElementById('delayMask');
const minDelayInput = document.getElementById('minDelayInput');
const maxDelayInput = document.getElementById('maxDelayInput');
const closeDelaySet = document.getElementById('closeDelaySet');
const saveDelaySet = document.getElementById('saveDelaySet');

// 信箱
const mailTabs = document.querySelectorAll('.mail-tab');
const letterInput = document.getElementById('letterInput');
const sendLetterBtn = document.getElementById('sendLetterBtn');
const inboxWrap = document.getElementById('inboxWrap');
let currentMailTab = 'write';

let currentEditTarget = null;

// 页面切换
function switchPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelector(`.${pageName}`).classList.add('active');
  topHeader.classList.toggle('show', pageName === 'chat-page');
  document.body.classList.toggle('home-bg', pageName === 'home-page');
}

// 返回按钮统一绑定
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.onclick = function() {
    switchPage('home-page');
  }
});
chatSetBack.onclick = () => switchPage('chat-page');

// 首页应用图标跳转（修复点击失效核心）
document.querySelectorAll('.app-card').forEach(card => {
  card.onclick = function() {
    const target = this.dataset.target;
    if(target) switchPage(target);
  }
});

// 主页壁纸弹窗
openWallpaperModal.onclick = function() {
  currentEditTarget = 'wallpaper';
  modalTitle.innerText = '设置主页壁纸';
  localImageFile.value = '';
  imageLinkInput.value = store.wallpaper;
  imageSelectMask.style.display = 'flex';
};
// 聊天背景弹窗
openChatBgModal.onclick = function() {
  currentEditTarget = 'chatBg';
  modalTitle.innerText = '设置聊天背景';
  localImageFile.value = '';
  imageLinkInput.value = store.chatBg;
  imageSelectMask.style.display = 'flex';
};

// 所有更改图标按钮绑定
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
    wallpaperPreview.src = url;
  } else if(currentEditTarget === 'chatBg') {
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
};

// 表情面板
emojiToggle.onclick = ()=>emojiPanel.classList.toggle('show');
document.addEventListener('click',e=>{
  if(!emojiPanel.contains(e.target) && e.target !== emojiToggle){
    emojiPanel.classList.remove('show');
  }
})
addEmojiBtn.onclick = async ()=>{
  let url = '';
  if(emojiFileInput.files[0]) url = await fileToDataUrl(emojiFileInput.files[0]);
  else if(emojiLinkInput.value.trim()) url = emojiLinkInput.value.trim();
  if(!url) return;
  store.emojiList.push(url);
  emojiFileInput.value = '';
  emojiLinkInput.value = '';
  saveLocal();
  renderEmojiList();
}
function renderEmojiList(){
  emojiList.innerHTML = '';
  store.emojiList.forEach(src=>{
    const div = document.createElement('div');
    div.className = 'emoji-item';
    div.innerHTML = `<img src="${src}">`;
    div.onclick = ()=>{
      inputText.value += `[emoji:${src}]`;
    }
    emojiList.appendChild(div);
  })
}

// 打开聊天设置
openChatSettingPage.onclick = ()=>switchPage('chat-set-page');
saveChatSetting.onclick = ()=>{
  applyBgStyle();
  saveLocal();
  renderHeaderAvatar();
  switchPage('chat-page');
}

// 关于TA弹窗
blockTa.onclick = ()=>{
  taNameInput.value = store.taInfo.name;
  taAvatarLink.value = store.taInfo.avatarUrl;
  taAvatarFile.value = '';
  taMask.style.display = 'flex';
}
closeTaSet.onclick = ()=>taMask.style.display = 'none';
saveTaSet.onclick = async ()=>{
  store.taInfo.name = taNameInput.value.trim() || '梦角';
  let url = store.taInfo.avatarUrl;
  if(taAvatarFile.files[0]) url = await fileToDataUrl(taAvatarFile.files[0]);
  else if(taAvatarLink.value.trim()) url = taAvatarLink.value.trim();
  store.taInfo.avatarUrl = url;
  renderHeaderAvatar();
  saveLocal();
  taMask.style.display = 'none';
}

// 关于我弹窗
blockMe.onclick = ()=>{
  meNameInput.value = store.myInfo.name;
  meAvatarLink.value = store.myInfo.avatarUrl;
  meAvatarFile.value = '';
  meMask.style.display = 'flex';
}
closeMeSet.onclick = ()=>meMask.style.display = 'none';
saveMeSet.onclick = async ()=>{
  store.myInfo.name = meNameInput.value.trim() || '我';
  let url = store.myInfo.avatarUrl;
  if(meAvatarFile.files[0]) url = await fileToDataUrl(meAvatarFile.files[0]);
  else if(meAvatarLink.value.trim()) url = meAvatarLink.value.trim();
  store.myInfo.avatarUrl = url;
  renderHeaderAvatar();
  saveLocal();
  meMask.style.display = 'none';
}

// 回复时长弹窗
blockDelay.onclick = ()=>{
  minDelayInput.value = store.delay.min;
  maxDelayInput.value = store.delay.max;
  delayMask.style.display = 'flex';
}
closeDelaySet.onclick = ()=>delayMask.style.display = 'none';
saveDelaySet.onclick = ()=>{
  let min = Math.max(Number(minDelayInput.value)||20,20);
  let max = Math.min(Number(maxDelayInput.value)||120,120);
  if(min>max) [min,max] = [max,min];
  store.delay.min = min;
  store.delay.max = max;
  saveLocal();
  delayMask.style.display = 'none';
}

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
  mailAppIcon.src = store.appIcon.mail;
  chatIconPreview.src = store.appIcon.chat;
  cardIconPreview.src = store.appIcon.card;
  themeIconPreview.src = store.appIcon.theme;
  mailIconPreview.src = store.appIcon.mail;
}

function applyBgStyle() {
  document.body.style.setProperty('--wallpaper', store.wallpaper ? `url(${store.wallpaper})` : 'none');
  document.documentElement.style.setProperty('--chat-bg', store.chatBg ? `url(${store.chatBg})` : 'none');
}

function renderHeaderAvatar(){
  targetName.innerText = store.taInfo.name;
  headerTaAvatar.src = store.taInfo.avatarUrl || '';
  headerMyAvatar.src = store.myInfo.avatarUrl || '';
}

// 信箱标签切换
mailTabs.forEach(tab => {
  tab.onclick = function() {
    mailTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    currentMailTab = this.dataset.tab;
    document.querySelector('.write-box').classList.toggle('hidden', currentMailTab !== 'write');
    inboxWrap.classList.toggle('hidden', currentMailTab !== 'inbox');
    renderInbox();
  }
});

// 发送信件
sendLetterBtn.onclick = function() {
  const text = letterInput.value.trim();
  if(!text) return;
  const len = text.length;
  const delayHour = 12 + (len / 500) * 12;
  const realDelay = Math.min(Math.max(delayHour, 12), 24) * 3600 * 1000;
  const create = Date.now();
  const replyTime = create + realDelay;
  store.letters.push({text,create,replyTime,done:false});
  letterInput.value = '';
  saveLocal();
  setTimeout(()=>processLetterReply(), realDelay);
};

function processLetterReply() {
  const allCards = getAllValidCards();
  store.letters.forEach(letter => {
    if(letter.done || Date.now() < letter.replyTime) return;
    letter.done = true;
    const count = randomInt(5, 20);
    let reply = [];
    for(let i=0;i<count;i++) reply.push(allCards[randomInt(0, allCards.length-1)].text);
    store.inbox.push({replyText: reply.join(''),originText:letter.text,time:letter.replyTime});
  });
  saveLocal();
  renderInbox();
}

function renderInbox() {
  inboxWrap.innerHTML = '';
  [...store.inbox].reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'letter-item';
    div.innerHTML = `
      <div class="letter-origin">我方原信：${item.originText}</div>
      <div class="letter-time">${formatTime(item.time)}</div>
      <div class="letter-content">${item.replyText}</div>
    `;
    inboxWrap.appendChild(div);
  });
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getMonth()+1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function pad(n) {return String(n).padStart(2,'0');}

// 10分钟时间分割线
function needTimeStamp(){
  const now = Date.now();
  if(now - store.lastChatTime > 10 * 60 * 1000){
    store.lastChatTime = now;
    return true;
  }
  return false;
}
function addTimeDivider(){
  const div = document.createElement('div');
  div.className = 'time-divider';
  div.innerText = getNowTime();
  chatWrap.appendChild(div);
}

// 解析文本表情
function parseEmojiText(text){
  return text.replace(/\[emoji:(.+?)\]/g,(m,src)=>{
    return `<img class="msg-emoji-inside" src="${src}">`;
  })
}

// 角色随机附带表情
function randomAttachEmoji(){
  const r = Math.random();
  if(store.emojiList.length === 0) return null;
  if(r < 0.15){
    return store.emojiList[randomInt(0, store.emojiList.length-1)];
  }else if(r < 0.5){
    return store.emojiList[randomInt(0, store.emojiList.length-1)];
  }
  return null;
}

function addBubble(text, isUser, time){
  if(needTimeStamp()) addTimeDivider();
  store.lastChatTime = Date.now();
  const item = document.createElement('div');
  item.className = `msg-item ${isUser ? 'user-msg' : 'target-msg'}`;
  let html = parseEmojiText(text);
  let emojiSrc = null;
  if(!isUser) emojiSrc = randomAttachEmoji();
  if(emojiSrc && text.trim() === ''){
    html = `<img class="msg-emoji-inside" style="width:40px;height:40px;" src="${emojiSrc}">`;
  }else if(emojiSrc){
    html += `<img class="msg-emoji-inside" src="${emojiSrc}">`;
  }
  const avatarSrc = isUser ? store.myInfo.avatarUrl : store.taInfo.avatarUrl;
  item.innerHTML = `
    <div class="msg-avatar">
      ${avatarSrc ? `<img src="${avatarSrc}">` : ''}
    </div>
    <div class="msg-bubble-wrap">
      <div class="msg-bubble">${html}</div>
      <div class="time-text">${time}</div>
    </div>
  `;
  chatWrap.appendChild(item);
  chatWrap.scrollTop = chatWrap.scrollHeight;
}

function getNowTime(){
  const d = new Date();
  let h = String(d.getHours()).padStart(2,'0');
  let m = String(d.getMinutes()).padStart(2,'0');
  return h + ':' + m;
}

function getAllValidCards(){
  let list = [];
  Object.values(store.groups).forEach(arr => {
    list = list.concat(arr.filter(item => !item.disabled));
  });
  return list;
}

function getRandomReplyArr(){
  const pool = getAllValidCards();
  if(pool.length === 0) return [{text:"暂无可用字卡，请前往字卡库添加分组与词条"}];
  let arr = [...pool];
  for(let i = arr.length - 1; i > 0; i--){
    const r = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[r]] = [arr[r], arr[i]];
  }
  const take = Math.floor(Math.random() * 3) + 1;
  return arr.slice(0, take);
}

function sendMessage(){
  const content = inputText.value.trim();
  if(!content) return;
  addBubble(content, true, getNowTime());
  inputText.value = '';

  const min = store.delay.min * 1000;
  const max = store.delay.max * 1000;
  const wait = Math.floor(Math.random() * (max - min) + min);
  // 打字占位
  const tempItem = document.createElement('div');
  tempItem.className = `msg-item target-msg`;
  tempItem.innerHTML = `
    <div class="msg-avatar">${store.taInfo.avatarUrl ? `<img src="${store.taInfo.avatarUrl}">` : ''}</div>
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

  setTimeout(() => {
    tempItem.remove();
    const replyList = getRandomReplyArr();
    replyList.forEach((item, idx) => {
      setTimeout(() => addBubble(item.text, false, getNowTime()), idx * 500);
    });
  }, wait);
}

sendBtn.onclick = sendMessage;
inputText.onkeydown = e => {
  if(e.key === 'Enter') sendMessage();
};

// 字卡逻辑
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

function refreshGroupSelect(){
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

function renderCurrentCardList(){
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

function loadLocal(){
  const raw = localStorage.getItem('dreamCardStore');
  if(raw) store = JSON.parse(raw);
  renderHeaderAvatar();
  refreshAllIconPreview();
  wallpaperPreview.src = store.wallpaper;
  chatBgPreview.src = store.chatBg;
  applyBgStyle();
  refreshGroupSelect();
  renderEmojiList();
  renderInbox();
}
function saveLocal(){
  localStorage.setItem('dreamCardStore', JSON.stringify(store));
}

// 定时执行信件到期检测
setInterval(()=>processLetterReply(), 10000);

// 全局兜底禁止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

loadLocal();
