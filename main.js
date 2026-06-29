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
  groups: {},
  currentSelectGroup: ""
};

// 基础DOM
const topHeader = document.querySelector('.top-header');
const tabBarWrap = document.getElementById('tabBarWrap');
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

// 头像弹窗
const avatarMask = document.getElementById('avatarMask');
const avatarUrlInput = document.getElementById('avatarUrlInput');
const closeAvatarSet = document.getElementById('closeAvatarSet');
const saveAvatarBtn = document.getElementById('saveAvatarBtn');

// 外观图标DOM
const chatAppIcon = document.getElementById('chatAppIcon');
const cardAppIcon = document.getElementById('cardAppIcon');
const themeAppIcon = document.getElementById('themeAppIcon');
const chatIconUrl = document.getElementById('chatIconUrl');
const cardIconUrl = document.getElementById('cardIconUrl');
const themeIconUrl = document.getElementById('themeIconUrl');
const saveThemeBtn = document.getElementById('saveThemeBtn');

// 分组字卡DOM
const newGroupName = document.getElementById('newGroupName');
const createGroupBtn = document.getElementById('createGroupBtn');
const groupListWrap = document.getElementById('groupListWrap');
const currentGroupSelect = document.getElementById('currentGroupSelect');
const newCardInput = document.getElementById('newCardInput');
const addSingleCard = document.getElementById('addSingleCard');
const batchTextarea = document.getElementById('batchTextarea');
const batchImportBtn = document.getElementById('batchImportBtn');
const cardListWrap = document.getElementById('cardListWrap');

// Tab切换
const tabItems = document.querySelectorAll('.tab-item');
const pages = document.querySelectorAll('.page');
tabItems.forEach(tab=>{
  tab.onclick = ()=>{
    const targetPage = tab.dataset.page;
    tabItems.forEach(i=>i.classList.remove('active'));
    tab.classList.add('active');
    pages.forEach(p=>p.classList.remove('active'));
    document.querySelector(`.${targetPage}`).classList.add('active');
    // 首页隐藏底部栏，其他页面显示底部栏
    tabBarWrap.classList.toggle('show', targetPage !== 'home-page');
    topHeader.classList.toggle('show', targetPage === 'chat-page');
  }
})

// 首页卡片点击跳转（仅图标点击，不依赖底部栏）
document.querySelectorAll('.app-card').forEach(card=>{
  card.onclick = ()=>{
    const target = card.dataset.target;
    tabItems.forEach(t=>{
      if(t.dataset.page === target) t.click();
    })
  }
})

// 头像点击打开头像修改弹窗
avatarClickEdit.onclick = ()=>{
  avatarUrlInput.value = store.base.avatarUrl;
  avatarMask.style.display = 'flex';
}
closeAvatarSet.onclick = ()=> avatarMask.style.display = 'none';
saveAvatarBtn.onclick = ()=>{
  store.base.avatarUrl = avatarUrlInput.value.trim();
  saveLocal();
  renderHeader();
  avatarMask.style.display = 'none';
}

// 键盘适配
window.visualViewport.addEventListener('resize', () => {
  const safeBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;
  if(window.visualViewport.height < window.innerHeight - 100){
    inputWrap.style.bottom = (50 + safeBottom + window.innerHeight - window.visualViewport.height) + 'px';
  }else{
    inputWrap.style.bottom = `calc(50px + ${safeBottom}px)`;
  }
})

// 本地存储
function loadLocal(){
  const raw = localStorage.getItem('dreamCardStore');
  if(raw) store = JSON.parse(raw);
  renderHeader();
  renderAppIcon();
  refreshGroupSelect();
  // 初始为首页，隐藏底部导航
  tabBarWrap.classList.remove('show');
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
function renderAppIcon(){
  chatIconUrl.value = store.appIcon.chat;
  cardIconUrl.value = store.appIcon.card;
  themeIconUrl.value = store.appIcon.theme;
  if(store.appIcon.chat) chatAppIcon.src = store.appIcon.chat;
  if(store.appIcon.card) cardAppIcon.src = store.appIcon.card;
  if(store.appIcon.theme) themeAppIcon.src = store.appIcon.theme;
}

// 保存外观全部图标
saveThemeBtn.onclick = ()=>{
  store.appIcon.chat = chatIconUrl.value.trim();
  store.appIcon.card = cardIconUrl.value.trim();
  store.appIcon.theme = themeIconUrl.value.trim();
  saveLocal();
  renderAppIcon();
  alert('图标配置已保存，刷新页面生效');
}

// 时间格式化
function getNowTime(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,'0');
  const m = String(d.getMinutes()).padStart(2,'0');
  return `${h}:${m}`;
}

// 消息气泡
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

// 获取全部未屏蔽字卡
function getAllValidCards(){
  let res = [];
  Object.values(store.groups).forEach(list=>{
    res = res.concat(list.filter(item => !item.disabled));
  })
  return res;
}

// 随机抽取1~3条
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

// 发送消息
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

// 基础设置弹窗
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

// 分组创建与管理
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

// 渲染当前分组字卡
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

// 单条添加字卡
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

// 批量导入字卡
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
