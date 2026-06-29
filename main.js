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

// 通用图片选择弹窗
const imageSelectMask = document.getElementById('imageSelectMask');
const modalTitle = document.getElementById('modalTitle');
const localImageFile = document.getElementById('localImageFile');
const imageLinkInput = document.getElementById('imageLinkInput');
const closeImageModal = document.getElementById('closeImageModal');
const confirmImageBtn = document.getElementById('confirmImageBtn');

// 头像专属弹窗
const avatarMask = document.getElementById('avatarMask');
const avatarLocalFile = document.getElementById('avatarLocalFile');
const avatarLinkInput = document.getElementById('avatarLinkInput');
const closeAvatarSet = document.getElementById('closeAvatarSet');
const saveAvatarBtn = document.getElementById('saveAvatarBtn');

// 壁纸预览
const wallpaperPreview = document.getElementById('wallpaperPreview');
const openWallpaperModal = document.getElementById('openWallpaperModal');

// 图标预览与修改按钮
const chatIconPreview = document.getElementById('chatIconPreview');
const cardIconPreview = document.getElementById('cardIconPreview');
const themeIconPreview = document.getElementById('themeIconPreview');
const chatAppIcon = document.getElementById('chatAppIcon');
const cardAppIcon = document.getElementById('cardAppIcon');
const themeAppIcon = document.getElementById('themeAppIcon');
const changeIconBtns = document.querySelectorAll('.change-btn[data-type]');

let currentEditTarget = null; // wallpaper / chat / card / theme

// 返回按钮
const backBtns = document.querySelectorAll('.back-btn');
backBtns.forEach(btn => {
  btn.onclick = () => switchPage('home-page');
});

// 页面切换
function switchPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelector(`.${pageName}`).classList.add('active');
  topHeader.classList.toggle('show', pageName === 'chat-page');
}

document.querySelectorAll('.app-card').forEach(card => {
  card.onclick = function() {
    const target = this.getAttribute('data-target');
    if(target) switchPage(target);
  }
})

// 打开壁纸弹窗
openWallpaperModal.onclick = () => {
  currentEditTarget = 'wallpaper';
  modalTitle.textContent = '设置主页壁纸';
  localImageFile.value = '';
  imageLinkInput.value = store.wallpaper;
  imageSelectMask.style.display = 'flex';
}

// 打开图标修改弹窗
changeIconBtns.forEach(btn => {
  btn.onclick = () => {
    const type = btn.dataset.type;
    currentEditTarget = type;
    modalTitle.textContent = '更改图标';
    localImageFile.value = '';
    imageLinkInput.value = store.appIcon[type];
    imageSelectMask.style.display = 'flex';
  }
})

closeImageModal.onclick = () => {
  imageSelectMask.style.display = 'none';
  currentEditTarget = null;
}

// 确认图片选择
confirmImageBtn.onclick = async () => {
  let finalUrl = "";
  if(localImageFile.files[0]) {
    finalUrl = await fileToBlobUrl(localImageFile.files[0]);
  } else if(imageLinkInput.value.trim()) {
    finalUrl = imageLinkInput.value.trim();
  }
  if(!finalUrl) return;

  if(currentEditTarget === 'wallpaper') {
    store.wallpaper = finalUrl;
    document.body.style.setProperty('--wallpaper', `url(${finalUrl})`);
    wallpaperPreview.src = finalUrl;
  } else {
    store.appIcon[currentEditTarget] = finalUrl;
    refreshAllIconPreview();
  }
  saveLocal();
  imageSelectMask.style.display = 'none';
  currentEditTarget = null;
}

// 头像修改逻辑
avatarClickEdit.onclick = () => {
  avatarLocalFile.value = '';
  avatarLinkInput.value = store.base.avatarUrl;
  avatarMask.style.display = 'flex';
}
closeAvatarSet.onclick = () => avatarMask.style.display = 'none';
saveAvatarBtn.onclick = async () => {
  let url = "";
  if(avatarLocalFile.files[0]) {
    url = await fileToBlobUrl(avatarLocalFile.files[0]);
  } else if(avatarLinkInput.value.trim()) {
    url = avatarLinkInput.value.trim();
  }
  if(url) {
    store.base.avatarUrl = url;
    renderHeader();
    saveLocal();
  }
  avatarMask.style.display = 'none';
}

// 文件转blob本地链接
function fileToBlobUrl(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  })
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
  const safeBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;
  if(window.visualViewport.height < window.innerHeight - 100){
    inputWrap.style.bottom = (safeBottom + window.innerHeight - window.visualViewport.height) + 'px';
  }else{
    inputWrap.style.bottom = `${safeBottom}px`;
  }
})

function loadLocal(){
  const raw = localStorage.getItem('dreamCardStore');
  if(raw) store = JSON.parse(raw);
  renderHeader();
  refreshAllIconPreview();
  wallpaperPreview.src = store.wallpaper;
  if(store.wallpaper) document.body.style.setProperty('--wallpaper', `url(${store.wallpaper})`);
  refreshGroupSelect();
}
function saveLocal(){
  localStorage.setItem('dreamCardStore', JSON.stringify(store));
}

function renderHeader(){
  targetName.innerText = store.base.name;
  avatarText.innerText = store.base.head;
  if(store.base.avatarUrl){
    avatarImg.src = store.base.avatarUrl;
    avatarImg.classList.add('show');
  }else{
    avatarImg.classList.remove('show');
  }
}

function getNowTime(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,'0');
  const m = String(d.getMinutes()).padStart(2,'0');
  return `${h}:${m}`;
}

function addBubble(text, isUser, time, isTyping = false){
  const item = document.createElement('div');
  item.className = `msg-item ${isUser?'user-msg':'target-msg'}`;
  if(isTyping){
    item.innerHTML = `
      <div class="msg-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
      <div class="time-text">${time}</div>
    `;
  }else{
    item.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <div class="time-text">${time}</div>
    `;
  }
  chatWrap.appendChild(item);
  chatWrap.scrollTop = chatWrap.scrollHeight;
  return item;
}

function getAllValidCards(){
  let res = [];
  Object.values(store.groups).forEach(list=>{
    res = res.concat(list.filter(item => !item.disabled));
  })
  return res;
}

function getRandomReplyArr(){
  const pool = getAllValidCards();
  if(pool.length === 0) return ["暂无可用字卡，请前往字卡库添加分组与词条"];
  let arr = [...pool];
  for(let i=arr.length-1;i>0;i--){
    const r = Math.floor(Math.random()*(i+1));
    [arr[i],arr[r]] = [arr[r],arr[i]];
  }
  const take = Math.floor(Math.random()*3)+1;
  return arr.slice(0,take);
}

function sendMessage(){
  const content = inputText.value.trim();
  if(!content) return;
  addBubble(content, true, getNowTime());
  inputText.value = '';

  const min = store.base.minDelay * 1000;
  const max = store.base.maxDelay * 1000;
  const waitTime = Math.floor(Math.random()*(max-min)+min);
  const typingDom = addBubble('', false, getNowTime(), true);

  setTimeout(()=>{
    typingDom.remove();
    const replyList = getRandomReplyArr();
    replyList.forEach((card, idx)=>{
      setTimeout(()=>{
        addBubble(card.text, false, getNowTime());
      }, idx * 500);
    })
  }, waitTime);
}

sendBtn.onclick = sendMessage;
inputText.onkeydown = e=> e.key === 'Enter' && sendMessage();

openSet.onclick = ()=>{
  nameInput.value = store.base.name;
  headText.value = store.base.head;
  minDelaySec.value = store.base.minDelay;
  maxDelaySec.value = store.base.maxDelay;
  mask.style.display = 'flex';
}
closeSet.onclick = ()=>mask.style.display = 'none';
saveSet.onclick = ()=>{
  let min = Number(minDelaySec.value) || 1;
  let max = Number(maxDelaySec.value) || min;
  store.base.name = nameInput.value.trim() || '梦角';
  store.base.head = headText.value.trim() || '角';
  store.base.minDelay = Math.min(min,max);
  store.base.maxDelay = Math.max(min,max);
  renderHeader();
  saveLocal();
  mask.style.display = 'none';
}

createGroupBtn.onclick = ()=>{
  const name = newGroupName.value.trim();
  if(!name || store.groups[name]) return;
  store.groups[name] = [];
  newGroupName.value = '';
  saveLocal();
  refreshGroupSelect();
}

function refreshGroupSelect(){
  const keys = Object.keys(store.groups);
  groupListWrap.innerHTML = '';
  currentGroupSelect.innerHTML = '';
  keys.forEach(g=>{
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `${g} (${store.groups[g].length}条)`;
    currentGroupSelect.appendChild(opt);
    const row = document.createElement('div');
    row.className = 'group-item-row';
    row.innerHTML = `<span>${g}</span><span class="del-group-btn">删除</span>`;
    row.querySelector('.del-group-btn').onclick = ()=>{
      delete store.groups[g];
      saveLocal();
      refreshGroupSelect();
    }
    groupListWrap.appendChild(row);
  })
  if(keys.length && !keys.includes(store.currentSelectGroup)){
    store.currentSelectGroup = keys[0];
  }
  currentGroupSelect.value = store.currentSelectGroup;
  currentGroupSelect.onchange = ()=>{
    store.currentSelectGroup = currentGroupSelect.value;
    saveLocal();
    renderCurrentCardList();
  }
  renderCurrentCardList();
}

function renderCurrentCardList(){
  cardListWrap.innerHTML = '';
  const targetGroup = store.currentSelectGroup;
  if(!targetGroup || !store.groups[targetGroup]) return;
  const list = store.groups[targetGroup];
  list.forEach((card, idx)=>{
    const div = document.createElement('div');
    div.className = `card-item ${card.disabled?'disabled':''}`;
    div.innerHTML = `
      <div class="card-text">${card.text}</div>
      <div class="card-opts">
        <button class="edit-btn">编辑</button>
        <button class="del-btn">删除</button>
        <button class="switch-btn">${card.disabled?'启用':'屏蔽'}</button>
      </div>
    `;
    div.querySelector('.edit-btn').onclick = ()=>{
      const res = prompt('修改字卡', card.text);
      if(res?.trim()){
        list[idx].text = res.trim();
        saveLocal();
        renderCurrentCardList();
      }
    }
    div.querySelector('.del-btn').onclick = ()=>{
      list.splice(idx,1);
      saveLocal();
      renderCurrentCardList();
    }
    div.querySelector('.switch-btn').onclick = ()=>{
      list[idx].disabled = !list[idx].disabled;
      saveLocal();
      renderCurrentCardList();
    }
    cardListWrap.appendChild(div);
  })
}

addSingleCard.onclick = ()=>{
  const txt = newCardInput.value.trim();
  const g = store.currentSelectGroup;
  if(!txt || !g) return;
  store.groups[g].push({id:Date.now(),text:txt,disabled:false});
  newCardInput.value = '';
  saveLocal();
  renderCurrentCardList();
}
newCardInput.onkeydown = e=>e.key==='Enter'&&addSingleCard.click();

batchImportBtn.onclick = ()=>{
  const txt = batchTextarea.value.trim();
  const g = store.currentSelectGroup;
  if(!txt || !g) return;
  const arr = txt.split('\n').map(i=>i.trim()).filter(i=>i);
  arr.forEach(t=>{
    store.groups[g].push({id:Date.now()+Math.random(),text:t,disabled:false});
  })
  batchTextarea.value = '';
  saveLocal();
  renderCurrentCardList();
}

loadLocal();
