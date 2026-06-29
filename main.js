// 数据结构
let store = {
  base: {
    name: "梦角",
    head: "角",
    minDelay: 20,
    maxDelay: 60
  },
  cards: [] // {id, text, disabled}
};

// DOM元素
const chatWrap = document.getElementById('chatWrap');
const inputText = document.getElementById('inputText');
const sendBtn = document.getElementById('sendBtn');
const mask = document.getElementById('mask');
const openSet = document.getElementById('openSet');
const closeSet = document.getElementById('closeSet');
const saveSet = document.getElementById('saveSet');
const nameInput = document.getElementById('nameInput');
const headText = document.getElementById('headText');
const minDelaySec = document.getElementById('minDelaySec');
const maxDelaySec = document.getElementById('maxDelaySec');
const targetName = document.getElementById('targetName');
const avatarText = document.getElementById('avatarText');

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
  }
})

// 本地持久化
function loadLocal(){
  const raw = localStorage.getItem('dreamCardStore');
  if(raw) store = JSON.parse(raw);
  renderHeader();
  renderCardList();
}
function saveLocal(){
  localStorage.setItem('dreamCardStore', JSON.stringify(store));
}
function renderHeader(){
  targetName.innerText = store.base.name;
  avatarText.innerText = store.base.head;
}

// 时间格式化
function getNowTime(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,'0');
  const m = String(d.getMinutes()).padStart(2,'0');
  return `${h}:${m}`;
}

// 添加消息气泡
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

// 获取可用词条（过滤屏蔽）
function getValidCards(){
  return store.cards.filter(item => !item.disabled);
}

// 随机抽取1~3条
function getRandomReplyArr(){
  const pool = getValidCards();
  if(pool.length === 0) return ["暂无可用字卡，请在字卡库添加并启用词条"];
  let arr = [...pool];
  // 洗牌
  for(let i=arr.length-1;i>0;i--){
    const r = Math.floor(Math.random()*(i+1));
    [arr[i],arr[r]] = [arr[r],arr[i]];
  }
  const take = Math.floor(Math.random()*3)+1;
  return arr.slice(0,take);
}

// 发送消息逻辑
function sendMessage(){
  const content = inputText.value.trim();
  if(!content) return;
  addBubble(content, true, getNowTime());
  inputText.value = '';

  // 计算随机延迟
  const min = store.base.minDelay * 1000;
  const max = store.base.maxDelay * 1000;
  const waitTime = Math.floor(Math.random()*(max-min)+min);

  // 插入正在输入动画
  const typingDom = addBubble('', false, getNowTime(), true);

  setTimeout(()=>{
    typingDom.remove();
    const replyList = getRandomReplyArr();
    // 逐条延迟弹出
    replyList.forEach((card, idx)=>{
      setTimeout(()=>{
        addBubble(card.text, false, getNowTime());
      }, idx * 500);
    })
  }, waitTime);
}

sendBtn.onclick = sendMessage;
inputText.onkeydown = e=>{
  if(e.key === 'Enter') sendMessage();
}

// 设置弹窗逻辑
openSet.onclick = ()=>{
  nameInput.value = store.base.name;
  headText.value = store.base.head;
  minDelaySec.value = store.base.minDelay;
  maxDelaySec.value = store.base.maxDelay;
  mask.style.display = 'flex';
}
closeSet.onclick = ()=>mask.style.display = 'none';
saveSet.onclick = ()=>{
  const min = Number(minDelaySec.value) || 1;
  const max = Number(maxDelaySec.value) || min;
  store.base.name = nameInput.value.trim() || '梦角';
  store.base.head = headText.value.trim() || '角';
  store.base.minDelay = Math.min(min, max);
  store.base.maxDelay = Math.max(min, max);
  renderHeader();
  saveLocal();
  mask.style.display = 'none';
}

// 字卡管理渲染
function renderCardList(){
  cardListWrap.innerHTML = '';
  store.cards.forEach((card, index)=>{
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
    // 编辑
    div.querySelector('.edit-btn').onclick = ()=>{
      const newText = prompt("修改字卡内容", card.text);
      if(newText && newText.trim()){
        store.cards[index].text = newText.trim();
        saveLocal();
        renderCardList();
      }
    }
    // 删除
    div.querySelector('.del-btn').onclick = ()=>{
      store.cards.splice(index,1);
      saveLocal();
      renderCardList();
    }
    // 屏蔽/启用
    div.querySelector('.switch-btn').onclick = ()=>{
      store.cards[index].disabled = !store.cards[index].disabled;
      saveLocal();
      renderCardList();
    }
    cardListWrap.appendChild(div);
  })
}

// 单条添加字卡
addSingleCard.onclick = ()=>{
  const text = newCardInput.value.trim();
  if(!text) return;
  store.cards.push({
    id: Date.now(),
    text,
    disabled: false
  });
  newCardInput.value = '';
  saveLocal();
  renderCardList();
}
newCardInput.onkeydown = e=>{
  if(e.key === 'Enter') addSingleCard.click();
}

// 批量导入
batchImportBtn.onclick = ()=>{
  const text = batchTextarea.value.trim();
  if(!text) return;
  const list = text.split('\n').map(s=>s.trim()).filter(s=>s);
  list.forEach(t=>{
    store.cards.push({
      id: Date.now()+Math.random(),
      text: t,
      disabled: false
    })
  })
  batchTextarea.value = '';
  saveLocal();
  renderCardList();
}

loadLocal();