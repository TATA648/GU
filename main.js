document.addEventListener('DOMContentLoaded', function() {
  let store = {
    taInfo:{name:"梦角",avatarUrl:""},
    myInfo:{name:"我",avatarUrl:""},
    delay:{min:20,max:120},
    chatBg:"",
    appIcon:{chat:"",card:"",theme:"",mail:"",calendar:"",setting:""},
    wallpaper:"",
    groups:{},
    currentSelectGroup:"",
    letters:[],
    inbox:[],
    emojiList:[],
    messages:[],
    currentStatus:"",
    calendar:{},
    chatSettings:{
      patSuffix:"拍了拍",
      videoBg:""
    },
    videoCall:{active:false, caller:"", startTime:null, answered:false, folded:false, timer:null}
  };

  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
  const topHeader=$('.top-header'), chatWrap=$('#chatWrap'), inputText=$('#inputText'), sendBtn=$('#sendBtn');
  const emojiSendBtn=$('#emojiSendBtn'), emojiPanel=$('#emojiPanel'), emojiGrid=$('#emojiGrid');
  const imageSelectMask=$('#imageSelectMask'), modalTitle=$('#modalTitle'), localImageFile=$('#localImageFile'), imageLinkInput=$('#imageLinkInput'), closeImageModal=$('#closeImageModal'), confirmImageBtn=$('#confirmImageBtn');
  const wallpaperPreview=$('#wallpaperPreview'), openWallpaperModal=$('#openWallpaperModal'), chatBgPreview=$('#chatBgPreview'), openChatBgModal=$('#openChatBgModal');
  const changeIconBtns=$$('.icon-change-btn');
  const openChatSettingPage=$('#openChatSettingPage'), saveChatSetting=$('#saveChatSetting'), chatSetBack=$('.chat-set-back');
  const blockTa=$('#blockTa'), blockMe=$('#blockMe'), blockDelay=$('#blockDelay'), blockPatSuffix=$('#blockPatSuffix'), blockVideoBg=$('#blockVideoBg');
  const taMask=$('#taMask'), taAvatarFile=$('#taAvatarFile'), taAvatarLink=$('#taAvatarLink'), taNameInput=$('#taNameInput'), closeTaSet=$('#closeTaSet'), saveTaSet=$('#saveTaSet');
  const meMask=$('#meMask'), meAvatarFile=$('#meAvatarFile'), meAvatarLink=$('#meAvatarLink'), meNameInput=$('#meNameInput'), closeMeSet=$('#closeMeSet'), saveMeSet=$('#saveMeSet');
  const delayMask=$('#delayMask'), minDelayInput=$('#minDelayInput'), maxDelayInput=$('#maxDelayInput'), closeDelaySet=$('#closeDelaySet'), saveDelaySet=$('#saveDelaySet');
  const patMask=$('#patMask'), patSuffixInput=$('#patSuffixInput'), closePatSet=$('#closePatSet'), savePatSet=$('#savePatSet');
  const videoBgMask=$('#videoBgMask'), videoBgFile=$('#videoBgFile'), videoBgLink=$('#videoBgLink'), closeVideoBg=$('#closeVideoBg'), saveVideoBg=$('#saveVideoBg');
  const mailTabs=$$('.mail-tab'), sentList=$('#sentList'), inboxWrap=$('#inboxWrap'), mailAddBtn=$('#mailAddBtn');
  const writeLetterMask=$('#writeLetterMask'), letterContentInput=$('#letterContentInput'), closeLetterModal=$('#closeLetterModal'), sendLetterConfirm=$('#sendLetterConfirm');
  const newGroupName=$('#newGroupName'), createGroupBtn=$('#createGroupBtn'), groupListWrap=$('#groupListWrap'), currentGroupSelect=$('#currentGroupSelect');
  const newCardInput=$('#newCardInput'), addSingleCard=$('#addSingleCard'), batchTextarea=$('#batchTextarea'), batchImportBtn=$('#batchImportBtn'), cardListWrap=$('#cardListWrap');
  const headerTaAvatar=$('#headerTaAvatar'), headerMyAvatar=$('#headerMyAvatar'), currentStatusText=$('#currentStatusText');
  const animToggle=$('#animToggle'), quoteBar=$('#quoteBar'), quoteContent=$('#quoteContent'), quoteClose=$('#quoteClose');
  const calendarGrid=$('#calendarGrid'), calTaText=$('#calTaText'), calMeText=$('#calMeText'), openMoodModal=$('#openMoodModal'), moodModal=$('#moodModal'), moodEmojiGrid=$('#moodEmojiGrid'), moodTextInput=$('#moodTextInput'), closeMoodModal=$('#closeMoodModal'), saveMoodModal=$('#saveMoodModal');
  const exportDataBtn=$('#exportDataBtn'), importDataBtn=$('#importDataBtn'), importConfirmMask=$('#importConfirmMask'), importCancelBtn=$('#importCancelBtn'), importConfirmBtn=$('#importConfirmBtn');
  const videoWindow=$('#videoWindow'), videoBg=$('#videoBg'), videoTimer=$('#videoTimer'), videoFoldBtn=$('#videoFoldBtn'), videoAvatar=$('#videoAvatar'), videoHangupBtn=$('#videoHangupBtn');
  const videoAnswerArea=$('#videoAnswerArea'), videoAnswerBtn=$('#videoAnswerBtn'), videoRejectBtn=$('#videoRejectBtn');
  const videoCapsule=$('#videoCapsule'), capsuleTimer=$('#capsuleTimer'), capsuleExpand=$('#capsuleExpand');

  let currentEditTarget=null, currentMailTab='sent', typingTimer=null, letterTimer=null, selectedMoodEmoji=null, currentDateStr=null;
  let quoteMsg=null, videoTimerInterval=null;

  // ========== 页面切换 ==========
  function switchPage(pageName) {
    const pages=$$('.page'), target=document.querySelector(`.${pageName}`);
    if(!target) return;
    pages.forEach(p=>p.classList.remove('active'));
    target.classList.add('active');
    if(topHeader) topHeader.classList.toggle('show', pageName==='chat-page');
    document.body.classList.toggle('home-bg', pageName==='home-page');
    if(pageName==='chat-page'){ renderMessages(); setTimeout(()=>chatWrap.scrollTop=chatWrap.scrollHeight,50); }
    if(pageName==='calendar-page') renderCalendar();
    if(pageName==='mail-page') renderMail();
  }

  // ========== 导航 ==========
  $$('.app-card').forEach(c=>c.addEventListener('click',function(e){ e.preventDefault(); const t=this.dataset.target; if(t) switchPage(t); }));
  $$('.back-btn').forEach(b=>b.addEventListener('click',function(e){ e.stopPropagation(); switchPage('home-page'); }));
  if(chatSetBack) chatSetBack.addEventListener('click',function(e){ e.stopPropagation(); switchPage('chat-page'); });
  if(openChatSettingPage) openChatSettingPage.addEventListener('click',function(){ switchPage('chat-set-page'); });

  // ========== 动画开关 ==========
  function updateAnimToggleUI(){ if(!animToggle) return; store.animEnabled?animToggle.classList.add('active'):animToggle.classList.remove('active'); document.body.classList.toggle('no-transition',!store.animEnabled); }
  if(animToggle) animToggle.addEventListener('click',function(){ store.animEnabled=!store.animEnabled; updateAnimToggleUI(); saveLocal(); });

  // ========== 图片弹窗（含表情添加） ==========
  function openImageModal(title,targetKey){
    currentEditTarget=targetKey; modalTitle.innerText=title; localImageFile.value='';
    let existing='';
    if(targetKey==='wallpaper') existing=store.wallpaper;
    else if(targetKey==='chatBg') existing=store.chatBg;
    else if(targetKey==='videoBg') existing=store.chatSettings.videoBg;
    else existing=store.appIcon[targetKey]||'';
    imageLinkInput.value=existing; imageSelectMask.style.display='flex';
  }
  if(openWallpaperModal) openWallpaperModal.addEventListener('click',()=>openImageModal('设置主页壁纸','wallpaper'));
  if(openChatBgModal) openChatBgModal.addEventListener('click',()=>openImageModal('设置聊天背景','chatBg'));
  changeIconBtns.forEach(b=>b.addEventListener('click',function(){ const type=this.dataset.type; const map={chat:'聊天',card:'字卡',theme:'外观',mail:'信箱',calendar:'日历',setting:'设置'}; openImageModal('更改 '+map[type],type); }));
  if(closeImageModal) closeImageModal.addEventListener('click',function(){ imageSelectMask.style.display='none'; currentEditTarget=null; });
  if(confirmImageBtn) confirmImageBtn.addEventListener('click',async function(){
    let url='';
    if(localImageFile.files&&localImageFile.files[0]) url=await fileToDataUrl(localImageFile.files[0]);
    else if(imageLinkInput.value.trim()) url=imageLinkInput.value.trim();
    if(!url) return;
    if(currentEditTarget==='wallpaper'){ store.wallpaper=url; wallpaperPreview.src=url; }
    else if(currentEditTarget==='chatBg'){ store.chatBg=url; chatBgPreview.src=url; }
    else if(currentEditTarget==='videoBg'){ store.chatSettings.videoBg=url; applyVideoBg(); }
    else if(currentEditTarget==='emoji'){ store.emojiList.push(url); renderEmojiGrid(); }
    else{ store.appIcon[currentEditTarget]=url; refreshAllIconPreview(); }
    saveLocal(); applyBgStyle(); imageSelectMask.style.display='none'; currentEditTarget=null;
  });

  // ========== 聊天设置 ==========
  if(blockTa) blockTa.addEventListener('click',()=>{ taNameInput.value=store.taInfo.name; taAvatarLink.value=store.taInfo.avatarUrl||''; taAvatarFile.value=''; taMask.style.display='flex'; });
  if(closeTaSet) closeTaSet.addEventListener('click',()=>taMask.style.display='none');
  if(saveTaSet) saveTaSet.addEventListener('click',async function(){ store.taInfo.name=taNameInput.value.trim()||'梦角'; let url=store.taInfo.avatarUrl; if(taAvatarFile.files&&taAvatarFile.files[0]) url=await fileToDataUrl(taAvatarFile.files[0]); else if(taAvatarLink.value.trim()) url=taAvatarLink.value.trim(); store.taInfo.avatarUrl=url; renderHeaderAvatar(); saveLocal(); taMask.style.display='none'; });
  if(blockMe) blockMe.addEventListener('click',()=>{ meNameInput.value=store.myInfo.name; meAvatarLink.value=store.myInfo.avatarUrl||''; meAvatarFile.value=''; meMask.style.display='flex'; });
  if(closeMeSet) closeMeSet.addEventListener('click',()=>meMask.style.display='none');
  if(saveMeSet) saveMeSet.addEventListener('click',async function(){ store.myInfo.name=meNameInput.value.trim()||'我'; let url=store.myInfo.avatarUrl; if(meAvatarFile.files&&meAvatarFile.files[0]) url=await fileToDataUrl(meAvatarFile.files[0]); else if(meAvatarLink.value.trim()) url=meAvatarLink.value.trim(); store.myInfo.avatarUrl=url; renderHeaderAvatar(); saveLocal(); meMask.style.display='none'; });
  if(blockDelay) blockDelay.addEventListener('click',()=>{ minDelayInput.value=store.delay.min; maxDelayInput.value=store.delay.max; delayMask.style.display='flex'; });
  if(closeDelaySet) closeDelaySet.addEventListener('click',()=>delayMask.style.display='none');
  if(saveDelaySet) saveDelaySet.addEventListener('click',function(){ let min=Math.max(Number(minDelayInput.value)||20,20); let max=Math.min(Number(maxDelayInput.value)||120,120); if(min>max)[min,max]=[max,min]; store.delay.min=min; store.delay.max=max; saveLocal(); delayMask.style.display='none'; });
  if(blockPatSuffix) blockPatSuffix.addEventListener('click',()=>{ patSuffixInput.value=store.chatSettings.patSuffix||'拍了拍'; patMask.style.display='flex'; });
  if(closePatSet) closePatSet.addEventListener('click',()=>patMask.style.display='none');
  if(savePatSet) savePatSet.addEventListener('click',function(){ const val=patSuffixInput.value.trim(); if(val){ store.chatSettings.patSuffix=val; saveLocal(); } patMask.style.display='none'; });
  if(blockVideoBg) blockVideoBg.addEventListener('click',()=>{ videoBgLink.value=store.chatSettings.videoBg||''; videoBgFile.value=''; videoBgMask.style.display='flex'; });
  if(closeVideoBg) closeVideoBg.addEventListener('click',()=>videoBgMask.style.display='none');
  if(saveVideoBg) saveVideoBg.addEventListener('click',async function(){ let url=''; if(videoBgFile.files&&videoBgFile.files[0]) url=await fileToDataUrl(videoBgFile.files[0]); else if(videoBgLink.value.trim()) url=videoBgLink.value.trim(); if(url){ store.chatSettings.videoBg=url; applyVideoBg(); saveLocal(); } videoBgMask.style.display='none'; });
  if(saveChatSetting) saveChatSetting.addEventListener('click',function(){ applyBgStyle(); saveLocal(); renderHeaderAvatar(); switchPage('chat-page'); });

  // ========== 表情包 ==========
  function renderEmojiGrid(){
    emojiGrid.innerHTML='';
    const addDiv=document.createElement('div');
    addDiv.className='emoji-item add-btn';
    addDiv.textContent='＋';
    addDiv.addEventListener('click',function(){ openImageModal('添加表情','emoji'); });
    emojiGrid.appendChild(addDiv);
    store.emojiList.forEach(src=>{
      const div=document.createElement('div');
      div.className='emoji-item';
      div.innerHTML=`<img src="${src}" loading="lazy">`;
      div.addEventListener('click',function(){
        sendMessageByText(`[emoji:${src}]`);
        emojiPanel.classList.remove('show');
      });
      emojiGrid.appendChild(div);
    });
  }
  if(emojiSendBtn) emojiSendBtn.addEventListener('click',function(e){ e.stopPropagation(); emojiPanel.classList.toggle('show'); });
  document.addEventListener('click',function(e){ if(emojiPanel&&!emojiPanel.contains(e.target)&&e.target!==emojiSendBtn) emojiPanel.classList.remove('show'); });

  // ========== 信箱 ==========
  function renderMail(){ renderSentList(); renderInbox(); }
  function renderSentList(){
    if(!sentList) return;
    sentList.innerHTML='';
    if(store.letters.length===0){ sentList.innerHTML='<div style="color:#999;text-align:center;padding:20px 0;">暂无寄出的信件</div>'; return; }
    store.letters.slice().reverse().forEach((letter,idx)=>{
      const div=document.createElement('div');
      div.className='sent-item';
      const preview=letter.text.length>20?letter.text.slice(0,20)+'...':letter.text;
      div.innerHTML=`<span class="sent-time">${formatTime(letter.create)}</span><span class="sent-preview">${escapeHtml(preview)}</span><div class="sent-detail">${escapeHtml(letter.text)}</div>`;
      div.addEventListener('click',function(){ this.classList.toggle('expanded'); });
      sentList.appendChild(div);
    });
  }
  function renderInbox(){
    if(!inboxWrap) return;
    inboxWrap.innerHTML='';
    if(store.inbox.length===0){ inboxWrap.innerHTML='<div style="color:#999;text-align:center;padding:20px 0;">暂无回信</div>'; return; }
    [...store.inbox].reverse().forEach(item=>{
      const div=document.createElement('div');
      div.className='letter-item';
      div.innerHTML=`<div class="letter-origin">我方原信：${escapeHtml(item.originText)}</div><div class="letter-time">${formatTime(item.time)}</div><div class="letter-content">${escapeHtml(item.replyText)}</div>`;
      inboxWrap.appendChild(div);
    });
  }
  mailTabs.forEach(tab=>{
    tab.addEventListener('click',function(){
      mailTabs.forEach(t=>t.classList.remove('active'));
      this.classList.add('active');
      currentMailTab=this.dataset.tab;
      document.querySelector('.sent-box').classList.toggle('hidden',currentMailTab!=='sent');
      inboxWrap.classList.toggle('hidden',currentMailTab!=='inbox');
      if(currentMailTab==='inbox') renderInbox();
    });
  });
  if(mailAddBtn) mailAddBtn.addEventListener('click',function(){ writeLetterMask.style.display='flex'; });
  if(closeLetterModal) closeLetterModal.addEventListener('click',()=>writeLetterMask.style.display='none');
  if(sendLetterConfirm) sendLetterConfirm.addEventListener('click',function(){
    const text=letterContentInput.value.trim();
    if(!text) return;
    const now=Date.now();
    const len=text.length;
    const delayHour=12+(len/500)*12;
    const realDelay=Math.min(Math.max(delayHour,12),24)*3600*1000;
    const replyTime=now+realDelay;
    store.letters.push({text, create:now, replyTime, done:false});
    letterContentInput.value='';
    writeLetterMask.style.display='none';
    saveLocal();
    renderSentList();
    scheduleLetterReplies();
    alert(`信件已寄出，预计 ${Math.round(realDelay/3600000)} 小时后收到回信。`);
  });

  // ========== 信件回复调度 ==========
  function scheduleLetterReplies(){ if(letterTimer){ clearTimeout(letterTimer); letterTimer=null; } const now=Date.now(); let earliest=Infinity; store.letters.forEach(l=>{ if(!l.done&&l.replyTime>now&&l.replyTime<earliest) earliest=l.replyTime; }); if(earliest!==Infinity){ const delay=earliest-now+1000; letterTimer=setTimeout(()=>{ processLetterReplies(); },Math.max(delay,1000)); } }
  function processLetterReplies(){ const allCards=getAllValidCards(); let changed=false; store.letters.forEach(letter=>{ if(letter.done||Date.now()<letter.replyTime) return; letter.done=true; changed=true; const count=randomInt(5,20); let reply=[]; for(let i=0;i<count;i++){ if(allCards.length===0) reply.push('（暂无字卡）'); else reply.push(allCards[randomInt(0,allCards.length-1)].text); } store.inbox.push({replyText:reply.join(''), originText:letter.text, time:letter.replyTime}); }); if(changed){ saveLocal(); renderInbox(); } scheduleLetterReplies(); }

  // ========== 聊天核心 ==========
  function updateRandomStatus(){ const allCards=getAllValidCards(); if(allCards.length>0){ const idx=randomInt(0,allCards.length-1); store.currentStatus=allCards[idx].text; } else { store.currentStatus='暂无状态字卡'; } if(currentStatusText) currentStatusText.innerText=store.currentStatus; }
  function renderHeaderAvatar(){ headerTaAvatar.src=store.taInfo.avatarUrl||''; headerMyAvatar.src=store.myInfo.avatarUrl||''; updateRandomStatus(); }
  function applyBgStyle(){ document.body.style.setProperty('--wallpaper',store.wallpaper?`url(${store.wallpaper})`:'none'); document.documentElement.style.setProperty('--chat-bg',store.chatBg?`url(${store.chatBg})`:'none'); }
  function applyVideoBg(){ if(videoBg) videoBg.style.backgroundImage=store.chatSettings.videoBg?`url(${store.chatSettings.videoBg})`:'none'; }
  function refreshAllIconPreview(){ ['chat','card','theme','mail','calendar','setting'].forEach(key=>{ const el=document.getElementById(key+'AppIcon'); const prev=document.getElementById(key+'IconPreview'); const src=store.appIcon[key]||''; if(el) el.src=src; if(prev) prev.src=src; }); }
  function parseEmojiText(text){ return text.replace(/\[emoji:(.+?)\]/g,(m,src)=>`<img class="msg-emoji-inside" src="${src}" loading="lazy">`); }
  function randomAttachEmoji(){ if(store.emojiList.length===0) return null; if(Math.random()<0.25) return store.emojiList[randomInt(0,store.emojiList.length-1)]; return null; }
  function renderMessages(){ if(!chatWrap) return; chatWrap.innerHTML=''; let lastTime=0; store.messages.forEach(msg=>{ if(msg.time-lastTime>10*60*1000){ const div=document.createElement('div'); div.className='time-divider'; div.innerText=formatTime(msg.time); chatWrap.appendChild(div); } lastTime=msg.time; appendMessageElement(msg); }); chatWrap.scrollTop=chatWrap.scrollHeight; }
  function appendMessageElement(msg){
    if(msg.system){
      const div=document.createElement('div');
      div.className=msg.isRed?'pat-message red':'pat-message';
      div.innerText=msg.text;
      chatWrap.appendChild(div);
      return;
    }
    // 判断是否为纯表情消息（内容只包含一个[emoji:xxx]）
    const isEmojiOnly = /^\[emoji:.+\]$/.test(msg.text.trim());
    const item=document.createElement('div');
    item.className=`msg-item ${msg.isUser?'user-msg':'target-msg'}`;
    if(isEmojiOnly){
      item.classList.add('emoji-only');
    }
    item.dataset.msgId=msg.id;
    let quoteHtml='';
    if(msg.quote){ quoteHtml=`<div class="msg-quote">📎 ${escapeHtml(msg.quote.text)}</div>`; }
    let html='';
    if(isEmojiOnly){
      // 直接显示大图
      const src=msg.text.match(/\[emoji:(.+?)\]/)[1];
      html=`<img class="emoji-big" src="${src}" loading="lazy">`;
    } else {
      html=parseEmojiText(msg.text);
      let emojiSrc=null;
      if(!msg.isUser) emojiSrc=randomAttachEmoji();
      if(emojiSrc&&msg.text.trim()===''){ html=`<img class="msg-emoji-inside" style="width:40px;height:40px;" src="${emojiSrc}">`; } else if(emojiSrc){ html+=`<img class="msg-emoji-inside" src="${emojiSrc}">`; }
    }
    const avatarSrc=msg.isUser?store.myInfo.avatarUrl:store.taInfo.avatarUrl;
    item.innerHTML=`<div class="msg-avatar" data-msgid="${msg.id}">${avatarSrc?`<img src="${avatarSrc}" loading="lazy">`:''}</div><div class="msg-bubble-wrap">${quoteHtml}${isEmojiOnly?'':`<div class="msg-bubble">${html}</div>`}${isEmojiOnly?html:''}</div>`;
    // 引用滑动：从左向右滑（diff < -30）
    let startX=0, isSwiping=false;
    item.addEventListener('touchstart',function(e){ const touch=e.touches[0]; startX=touch.clientX; isSwiping=true; });
    item.addEventListener('touchmove',function(e){ if(!isSwiping) return; const touch=e.touches[0]; const diff=startX-touch.clientX; if(diff < -30){ // 从左向右滑
      e.preventDefault();
      isSwiping=false;
      // 回弹效果：平移然后复位
      this.style.transition='transform 0.2s ease';
      this.style.transform='translateX(20px)';
      setTimeout(()=>{ this.style.transform=''; }, 300);
      quoteMsg=msg; quoteContent.innerText=msg.text; quoteBar.style.display='flex';
    } });
    item.addEventListener('touchend',function(){ isSwiping=false; });
    chatWrap.appendChild(item);
  }
  function addMessage(text,isUser,time,quote,system,isRed){
    const msg={id:Date.now()+Math.random(), text, isUser, time:time||Date.now(), quote:quote||null, system:system||false, isRed:isRed||false};
    store.messages.push(msg); saveLocal();
    if(!system && needTimeStamp()) addTimeDivider();
    store.lastChatTime=Date.now();
    appendMessageElement(msg);
    chatWrap.scrollTop=chatWrap.scrollHeight;
    // 角色主动拍一拍（在回复后触发）
    if(!system && !isUser && Math.random()<0.1) {
      setTimeout(()=>{
        const target=Math.random()<0.5?'user':'ta';
        const targetName=target==='user'?store.myInfo.name:store.taInfo.name;
        const cards=getAllValidCards();
        let suffix='拍了拍';
        if(cards.length>0){ const idx=randomInt(0,cards.length-1); suffix=cards[idx].text; }
        const patText=`${store.taInfo.name} 拍了拍 ${targetName} ${suffix}`;
        addMessage(patText, false, Date.now(), null, true, false);
      }, 1500);
    }
    // 随机发起视频
    if(!system && !isUser && Math.random()<0.05) {
      setTimeout(()=>{ initiateVideoCall('ta'); }, 1000);
    }
  }
  function needTimeStamp(){ if(store.messages.length===0) return false; const last=store.messages[store.messages.length-1]; return (Date.now()-last.time)>10*60*1000; }
  function addTimeDivider(){ const div=document.createElement('div'); div.className='time-divider'; div.innerText=getNowTime(); chatWrap.appendChild(div); }
  function getNowTime(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
  function getAllValidCards(){ let list=[]; Object.values(store.groups).forEach(arr=>{ list=list.concat(arr.filter(item=>!item.disabled)); }); return list; }
  function getRandomReplyArr(){ const pool=getAllValidCards(); if(pool.length===0) return [{text:'暂无可用字卡，请前往字卡库添加'}]; let arr=[...pool]; for(let i=arr.length-1;i>0;i--){ const r=Math.floor(Math.random()*(i+1)); [arr[i],arr[r]]=[arr[r],arr[i]]; } const take=Math.floor(Math.random()*3)+1; return arr.slice(0,take); }
  function sendMessageByText(text){
    const quote=quoteMsg; quoteMsg=null; quoteBar.style.display='none';
    const now=Date.now();
    addMessage(text, true, now, quote);
    inputText.value='';
    updateRandomStatus();
    const min=store.delay.min*1000, max=store.delay.max*1000, wait=Math.floor(Math.random()*(max-min)+min);
    const tempItem=document.createElement('div');
    tempItem.className='msg-item target-msg';
    tempItem.innerHTML=`<div class="msg-avatar">${store.taInfo.avatarUrl?`<img src="${store.taInfo.avatarUrl}" loading="lazy">`:''}</div><div class="msg-bubble-wrap"><div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`;
    chatWrap.appendChild(tempItem); chatWrap.scrollTop=chatWrap.scrollHeight;
    if(typingTimer) clearTimeout(typingTimer);
    typingTimer=setTimeout(()=>{
      tempItem.remove();
      const replyList=getRandomReplyArr();
      let quoteReply=null;
      if(Math.random()<0.2 && store.messages.length>1){ const lastUser=[...store.messages].reverse().find(m=>m.isUser); if(lastUser) quoteReply=lastUser; }
      replyList.forEach((item,idx)=>{ setTimeout(()=>{ addMessage(item.text, false, Date.now(), quoteReply); }, idx*500); });
      setTimeout(()=>{ updateRandomStatus(); }, replyList.length*500+100);
      typingTimer=null;
    }, wait);
  }
  function sendMessage(){ const content=inputText.value.trim(); if(!content) return; sendMessageByText(content); }
  if(sendBtn) sendBtn.addEventListener('click',sendMessage);
  if(inputText) inputText.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); sendMessage(); } });
  if(quoteClose) quoteClose.addEventListener('click',function(){ quoteMsg=null; quoteBar.style.display='none'; });

  // ========== 拍一拍（双击消息头像） ==========
  function handlePat(avatarEl, isUser){
    // isUser: 头像所属消息的发送者是否为用户
    // 发起者始终是“我”（用户），目标是头像所属人
    const initiator=store.myInfo.name;
    let targetName='';
    if(isUser){
      targetName=store.myInfo.name; // 拍自己
    } else {
      targetName=store.taInfo.name; // 拍对方
    }
    const suffix=store.chatSettings.patSuffix||'拍了拍';
    const patText=`${initiator} 拍了拍 ${targetName} ${suffix}`;
    addMessage(patText, false, Date.now(), null, true, false);
  }
  let lastTapTime=0;
  chatWrap.addEventListener('touchstart', function(e){
    const avatar=e.target.closest('.msg-avatar');
    if(!avatar) return;
    const now=Date.now();
    if(now-lastTapTime<400){
      e.preventDefault();
      const msgItem=avatar.closest('.msg-item');
      if(!msgItem) return;
      const isUser=msgItem.classList.contains('user-msg');
      handlePat(avatar, isUser);
      lastTapTime=0;
    } else { lastTapTime=now; }
  }, {passive:false});
  let clickCount=0, clickTimer=null;
  chatWrap.addEventListener('click', function(e){
    const avatar=e.target.closest('.msg-avatar');
    if(!avatar) return;
    clickCount++;
    if(clickCount===2){ clearTimeout(clickTimer); clickCount=0; const msgItem=avatar.closest('.msg-item'); if(!msgItem) return; const isUser=msgItem.classList.contains('user-msg'); handlePat(avatar, isUser); }
    else { clickTimer=setTimeout(()=>{ clickCount=0; }, 400); }
  });

  // ========== 视频通话 ==========
  function startVideoTimer(){
    if(videoTimerInterval) clearInterval(videoTimerInterval);
    const start=Date.now();
    videoTimerInterval=setInterval(()=>{
      const elapsed=Math.floor((Date.now()-start)/1000);
      const h=String(Math.floor(elapsed/3600)).padStart(2,'0');
      const m=String(Math.floor((elapsed%3600)/60)).padStart(2,'0');
      const s=String(elapsed%60).padStart(2,'0');
      const timeStr=`${h}:${m}:${s}`;
      videoTimer.textContent=timeStr;
      capsuleTimer.textContent=timeStr;
    }, 1000);
  }
  function stopVideoTimer(){ if(videoTimerInterval){ clearInterval(videoTimerInterval); videoTimerInterval=null; } }
  function showVideoWindow(caller){
    videoWindow.classList.add('active');
    videoCapsule.classList.remove('active');
    const avatarUrl=caller==='ta'?store.taInfo.avatarUrl:store.myInfo.avatarUrl;
    videoAvatar.src=avatarUrl||'';
    videoAnswerArea.style.display='none';
    videoHangupBtn.style.display='block';
    applyVideoBg();
    startVideoTimer();
    store.videoCall.active=true;
    store.videoCall.caller=caller;
    store.videoCall.startTime=Date.now();
    store.videoCall.folded=false;
    enableVideoDrag();
  }
  function hideVideoWindow(){
    videoWindow.classList.remove('active');
    videoCapsule.classList.remove('active');
    stopVideoTimer();
    store.videoCall.active=false;
    store.videoCall.caller='';
    store.videoCall.startTime=null;
  }
  function foldVideoWindow(){
    if(videoWindow.classList.contains('active')){
      videoWindow.classList.remove('active');
      videoCapsule.classList.add('active');
      store.videoCall.folded=true;
      capsuleTimer.textContent=videoTimer.textContent;
    }
  }
  function unfoldVideoWindow(){
    videoCapsule.classList.remove('active');
    videoWindow.classList.add('active');
    store.videoCall.folded=false;
  }
  if(videoFoldBtn) videoFoldBtn.addEventListener('click',foldVideoWindow);
  if(capsuleExpand) capsuleExpand.addEventListener('click',unfoldVideoWindow);
  if(videoHangupBtn) videoHangupBtn.addEventListener('click',function(){
    const caller=store.videoCall.caller;
    const name=caller==='ta'?store.taInfo.name:store.myInfo.name;
    let msg='';
    if(caller==='ta'){ msg=`你挂断了${name}的电话`; }
    else { msg=`${name}挂断了你的电话`; }
    addMessage(msg, false, Date.now(), null, true, true);
    hideVideoWindow();
  });

  let dragData=null;
  function enableVideoDrag(){
    const el=videoWindow;
    el.addEventListener('touchstart', onDragStart, {passive:false});
    el.addEventListener('mousedown', onDragStart);
  }
  function onDragStart(e){
    if(e.target.closest('button')) return;
    const el=videoWindow;
    const rect=el.getBoundingClientRect();
    const clientX=e.touches?e.touches[0].clientX:e.clientX;
    const clientY=e.touches?e.touches[0].clientY:e.clientY;
    dragData={offsetX:clientX-rect.left, offsetY:clientY-rect.top, el:el};
    el.classList.add('dragging');
    document.addEventListener('touchmove', onDragMove, {passive:false});
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('mouseup', onDragEnd);
    e.preventDefault();
  }
  function onDragMove(e){
    if(!dragData) return;
    const clientX=e.touches?e.touches[0].clientX:e.clientX;
    const clientY=e.touches?e.touches[0].clientY:e.clientY;
    const el=dragData.el;
    el.style.left=(clientX-dragData.offsetX)+'px';
    el.style.top=(clientY-dragData.offsetY)+'px';
    el.style.right='auto';
    el.style.bottom='auto';
    e.preventDefault();
  }
  function onDragEnd(){
    if(dragData) dragData.el.classList.remove('dragging');
    dragData=null;
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    document.removeEventListener('mouseup', onDragEnd);
  }

  function initiateVideoCall(caller){
    if(store.videoCall.active) return;
    if(caller==='ta'){
      videoWindow.classList.add('active');
      videoCapsule.classList.remove('active');
      videoAvatar.src=store.taInfo.avatarUrl||'';
      videoAnswerArea.style.display='flex';
      videoHangupBtn.style.display='none';
      videoTimer.textContent='来电...';
      applyVideoBg();
      store.videoCall.active=true;
      store.videoCall.caller='ta';
      store.videoCall.startTime=null;
      enableVideoDrag();
      videoAnswerBtn.onclick=function(){
        videoAnswerArea.style.display='none';
        videoHangupBtn.style.display='block';
        videoTimer.textContent='00:00:00';
        startVideoTimer();
        store.videoCall.answered=true;
        store.videoCall.startTime=Date.now();
        addMessage(`${store.taInfo.name} 接听了你的视频`, false, Date.now(), null, true, false);
      };
      videoRejectBtn.onclick=function(){
        hideVideoWindow();
        addMessage(`${store.taInfo.name} 正忙，未接听`, false, Date.now(), null, true, true);
        store.videoCall.active=false;
      };
    } else {
      showVideoWindow('me');
      const answer=Math.random()<0.8;
      if(answer){
        setTimeout(()=>{
          videoTimer.textContent='00:00:00';
          startVideoTimer();
          store.videoCall.answered=true;
          addMessage(`${store.taInfo.name} 接听了你的视频`, false, Date.now(), null, true, false);
        }, 2000);
      } else {
        setTimeout(()=>{
          hideVideoWindow();
          addMessage(`${store.taInfo.name} 正忙，未接听`, false, Date.now(), null, true, true);
        }, 3000);
      }
    }
  }
  const videoCallBtn=document.createElement('button');
  videoCallBtn.textContent='📹';
  videoCallBtn.style.background='transparent'; videoCallBtn.style.border='none'; videoCallBtn.style.fontSize='22px'; videoCallBtn.style.cursor='pointer'; videoCallBtn.style.minHeight='40px'; videoCallBtn.style.padding='0 8px';
  videoCallBtn.addEventListener('click',function(){ initiateVideoCall('me'); });
  document.querySelector('.emoji-btn-wrapper').appendChild(videoCallBtn);

  // ========== 字卡管理 ==========
  if(createGroupBtn) createGroupBtn.addEventListener('click',function(){ const name=newGroupName.value.trim(); if(!name){alert('请输入分组名称');return;} if(store.groups[name]){alert('分组已存在');return;} store.groups[name]=[]; newGroupName.value=''; saveLocal(); refreshGroupSelect(); });
  if(newGroupName) newGroupName.addEventListener('keydown',function(e){ if(e.key==='Enter') createGroupBtn.click(); });
  function refreshGroupSelect(){ const keys=Object.keys(store.groups); groupListWrap.innerHTML=''; currentGroupSelect.innerHTML=''; if(keys.length===0){ const opt=document.createElement('option'); opt.value=''; opt.textContent='请先创建分组'; currentGroupSelect.appendChild(opt); cardListWrap.innerHTML='<div style="color:#999;text-align:center;padding:20px 0;">暂无分组</div>'; return; } keys.forEach(g=>{ const opt=document.createElement('option'); opt.value=g; opt.textContent=`${g} (${store.groups[g].length}条)`; currentGroupSelect.appendChild(opt); const row=document.createElement('div'); row.className='group-item-row'; row.innerHTML=`<span>${g}</span><span class="del-group-btn" data-group="${g}">删除</span>`; row.querySelector('.del-group-btn').addEventListener('click',function(){ const gName=this.dataset.group; if(confirm(`确定删除分组「${gName}」及其所有字卡吗？`)){ delete store.groups[gName]; if(store.currentSelectGroup===gName) store.currentSelectGroup=Object.keys(store.groups)[0]||''; saveLocal(); refreshGroupSelect(); } }); groupListWrap.appendChild(row); }); if(!keys.includes(store.currentSelectGroup)) store.currentSelectGroup=keys[0]; currentGroupSelect.value=store.currentSelectGroup; currentGroupSelect.onchange=function(){ store.currentSelectGroup=this.value; saveLocal(); renderCurrentCardList(); }; renderCurrentCardList(); }
  function renderCurrentCardList(){ cardListWrap.innerHTML=''; const g=store.currentSelectGroup; if(!g||!store.groups[g]||store.groups[g].length===0){ cardListWrap.innerHTML='<div style="color:#999;text-align:center;padding:20px 0;">暂无字卡</div>'; return; } const list=store.groups[g]; list.forEach((card,idx)=>{ const div=document.createElement('div'); div.className=`card-item ${card.disabled?'disabled':''}`; div.innerHTML=`<div class="card-text">${escapeHtml(card.text)}</div><div class="card-opts"><button class="edit-btn" data-idx="${idx}">编辑</button><button class="del-btn" data-idx="${idx}">删除</button><button class="switch-btn" data-idx="${idx}">${card.disabled?'启用':'屏蔽'}</button></div>`; div.querySelector('.edit-btn').addEventListener('click',function(){ const i=parseInt(this.dataset.idx); const res=prompt('修改字卡',list[i].text); if(res&&res.trim()){ list[i].text=res.trim(); saveLocal(); renderCurrentCardList(); } }); div.querySelector('.del-btn').addEventListener('click',function(){ const i=parseInt(this.dataset.idx); list.splice(i,1); saveLocal(); renderCurrentCardList(); }); div.querySelector('.switch-btn').addEventListener('click',function(){ const i=parseInt(this.dataset.idx); list[i].disabled=!list[i].disabled; saveLocal(); renderCurrentCardList(); }); cardListWrap.appendChild(div); }); }
  if(addSingleCard) addSingleCard.addEventListener('click',function(){ const text=newCardInput.value.trim(); const g=store.currentSelectGroup; if(!text){alert('请输入字卡内容');return;} if(!g||!store.groups[g]){alert('请先选择或创建分组');return;} store.groups[g].push({id:Date.now()+Math.random(), text, disabled:false}); newCardInput.value=''; saveLocal(); renderCurrentCardList(); refreshGroupSelect(); });
  if(newCardInput) newCardInput.addEventListener('keydown',function(e){ if(e.key==='Enter') addSingleCard.click(); });
  if(batchImportBtn) batchImportBtn.addEventListener('click',function(){ const text=batchTextarea.value.trim(); const g=store.currentSelectGroup; if(!text){alert('请填入要导入的字卡');return;} if(!g||!store.groups[g]){alert('请先选择或创建分组');return;} const arr=text.split('\n').map(s=>s.trim()).filter(s=>s); if(arr.length===0){alert('没有有效的字卡内容');return;} arr.forEach(t=>{ store.groups[g].push({id:Date.now()+Math.random(), text:t, disabled:false}); }); batchTextarea.value=''; saveLocal(); renderCurrentCardList(); refreshGroupSelect(); });

  // ========== 日历 ==========
  function renderCalendar(){ if(!calendarGrid) return; const now=new Date(); const year=now.getFullYear(), month=now.getMonth(); const firstDay=new Date(year,month,1).getDay(); const daysInMonth=new Date(year,month+1,0).getDate(); calendarGrid.innerHTML=''; for(let i=0;i<firstDay;i++){ const empty=document.createElement('div'); empty.className='cal-day empty'; calendarGrid.appendChild(empty); } for(let d=1;d<=daysInMonth;d++){ const dateObj=new Date(year,month,d); const dateStr=dateObj.toISOString().slice(0,10); const dayDiv=document.createElement('div'); dayDiv.className='cal-day'; dayDiv.innerHTML=`<div class="day-number">${d}</div>`; const data=store.calendar[dateStr]||{}; const taEmoji=data.taEmoji||''; const meEmoji=data.meEmoji||''; const emojiGroup=document.createElement('div'); emojiGroup.className='day-emoji-group'; if(taEmoji&&meEmoji){ const s1=document.createElement('span'); s1.className='emoji-single small'; s1.textContent=taEmoji; const s2=document.createElement('span'); s2.className='emoji-single small'; s2.textContent=meEmoji; emojiGroup.appendChild(s1); emojiGroup.appendChild(s2); } else if(taEmoji){ const s=document.createElement('span'); s.className='emoji-single large'; s.textContent=taEmoji; emojiGroup.appendChild(s); } else if(meEmoji){ const s=document.createElement('span'); s.className='emoji-single large'; s.textContent=meEmoji; emojiGroup.appendChild(s); } dayDiv.appendChild(emojiGroup); calendarGrid.appendChild(dayDiv); } const todayStr=now.toISOString().slice(0,10); const todayData=store.calendar[todayStr]||{}; calTaText.innerText=todayData.taText||'TA今天还没有记录哦～'; calMeText.innerText=todayData.meText||'今天有什么想说的。'; }
  if(openMoodModal) openMoodModal.addEventListener('click',function(){ const now=new Date(); currentDateStr=now.toISOString().slice(0,10); const data=store.calendar[currentDateStr]||{}; selectedMoodEmoji=data.meEmoji||null; moodTextInput.value=data.meText||''; renderMoodEmojis(); moodModal.style.display='flex'; });
  function renderMoodEmojis(){ const emojis=['😭','🥺','🥰','🥹','😆','😎','🥳','😖','😫','😴']; moodEmojiGrid.innerHTML=''; emojis.forEach(emo=>{ const span=document.createElement('span'); span.textContent=emo; if(selectedMoodEmoji===emo) span.classList.add('selected'); span.addEventListener('click',function(){ selectedMoodEmoji=emo; renderMoodEmojis(); }); moodEmojiGrid.appendChild(span); }); }
  if(closeMoodModal) closeMoodModal.addEventListener('click',function(){ moodModal.style.display='none'; selectedMoodEmoji=null; });
  if(saveMoodModal) saveMoodModal.addEventListener('click',function(){ const dateStr=currentDateStr; if(!dateStr) return; const text=moodTextInput.value.trim(); const data=store.calendar[dateStr]||{}; data.meEmoji=selectedMoodEmoji||data.meEmoji; data.meText=text||data.meText; if(!data.taEmoji){ const taEmojis=['😊','😌','😄','🤗','😏','😜','🤔','😴','🥱']; data.taEmoji=taEmojis[randomInt(0,taEmojis.length-1)]; } if(!data.taText){ const cards=getAllValidCards(); if(cards.length>0){ const count=Math.min(randomInt(1,3),cards.length); const shuffled=[...cards].sort(()=>Math.random()-0.5); data.taText=shuffled.slice(0,count).map(c=>c.text).join(' '); } else { data.taText='今天没有什么想说的～'; } } store.calendar[dateStr]=data; saveLocal(); renderCalendar(); moodModal.style.display='none'; selectedMoodEmoji=null; });

  // ========== 数据管理 ==========
  if(exportDataBtn) exportDataBtn.addEventListener('click',function(){ const data={version:'1.0', exportTime:new Date().toISOString(), store}; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`dreamcard_data_${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); });
  if(importDataBtn) importDataBtn.addEventListener('click',function(){ importConfirmMask.style.display='flex'; });
  if(importCancelBtn) importCancelBtn.addEventListener('click',function(){ importConfirmMask.style.display='none'; });
  if(importConfirmBtn) importConfirmBtn.addEventListener('click',function(){ importConfirmMask.style.display='none'; const input=document.createElement('input'); input.type='file'; input.accept='.json'; input.onchange=function(e){ const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=function(ev){ try{ const data=JSON.parse(ev.target.result); if(data.store){ store=data.store; saveLocal(); renderHeaderAvatar(); refreshAllIconPreview(); applyBgStyle(); refreshGroupSelect(); renderEmojiGrid(); renderInbox(); renderMessages(); updateAnimToggleUI(); renderCalendar(); applyVideoBg(); renderMail(); alert('数据导入成功！'); } else { alert('无效的数据文件'); } } catch(err){ alert('文件解析失败：'+err.message); } }; reader.readAsText(file); }; input.click(); });

  // ========== 工具 ==========
  function fileToDataUrl(file){ return new Promise(resolve=>{ const reader=new FileReader(); reader.onload=e=>resolve(e.target.result); reader.readAsDataURL(file); }); }
  function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function formatTime(ts){ const d=new Date(ts); return `${d.getMonth()+1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`; }
  function pad(n){ return String(n).padStart(2,'0'); }
  function escapeHtml(text){ const div=document.createElement('div'); div.textContent=text; return div.innerHTML; }

  // ========== 存储 ==========
  function loadLocal(){ try{ const raw=localStorage.getItem('dreamCardStore'); if(raw){ const parsed=JSON.parse(raw); store={...store,...parsed}; } }catch(e){console.warn('Load local error',e);} if(!store.messages) store.messages=[]; if(!store.calendar) store.calendar={}; if(!store.appIcon.setting) store.appIcon.setting=''; if(!store.chatSettings) store.chatSettings={patSuffix:'拍了拍',videoBg:''}; renderHeaderAvatar(); refreshAllIconPreview(); if(wallpaperPreview) wallpaperPreview.src=store.wallpaper||''; if(chatBgPreview) chatBgPreview.src=store.chatBg||''; applyBgStyle(); applyVideoBg(); refreshGroupSelect(); renderEmojiGrid(); renderInbox(); renderMessages(); updateAnimToggleUI(); scheduleLetterReplies(); renderCalendar(); renderMail(); }
  function saveLocal(){ try{ localStorage.setItem('dreamCardStore',JSON.stringify(store)); }catch(e){console.warn('Save local error',e);} }

  // ========== 防缩放 ==========
  let lastTouchEnd=0; document.addEventListener('touchend',function(e){ const now=Date.now(); if(now-lastTouchEnd<=300) e.preventDefault(); lastTouchEnd=now; },{passive:false}); document.addEventListener('gesturestart',function(e){ e.preventDefault(); },{passive:false}); document.querySelectorAll('input,textarea').forEach(el=>el.style.fontSize='16px');

  // ========== 初始化 ==========
  loadLocal(); applyBgStyle(); applyVideoBg();
  if(document.querySelector('.chat-page.active')&&chatWrap) setTimeout(()=>chatWrap.scrollTop=chatWrap.scrollHeight,100);
  console.log('✅ 梦角字卡传讯已启动 | 动画:', store.animEnabled?'开启':'关闭');
});
