document.addEventListener('DOMContentLoaded', function() {
  let store = {
    taInfo: { name: "梦角", avatarUrl: "" },
    myInfo: { name: "我", avatarUrl: "" },
    delay: { min: 20, max: 120 },
    chatBg: "",
    appIcon: { chat: "", card: "", theme: "", mail: "", calendar: "", setting: "", placeholder: "" },
    wallpaper: "",
    groups: {},
    currentSelectGroup: "",
    letters: [],
    inbox: [],
    emojiList: [],
    messages: [],
    currentStatus: "",
    calendar: {},
    chatSettings: { patSuffix: "拍了拍", videoBg: "", avatarStyle: "circle" },
    videoCall: { active: false, caller: "", startTime: null, answered: false, folded: false, timer: null },
    isTyping: false,
    profile: { cover: "", avatar: "", name: "TATA", location: "爱尔兰", locationIcon: "https://i.ibb.co/pjyVcqxM/position.png", signature: "浅尝辄止 是命运轻轻放过了我" },
    decoImage: "",
    appliedFont: "",
    rippleEnabled: true
  };

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // DOM 引用（略，与之前相同，但需确保所有变量声明完整）
  const topHeader = $('.top-header');
  const chatWrap = $('#chatWrap');
  const inputText = $('#inputText');
  const sendBtn = $('#sendBtn');
  const emojiSendBtn = $('#emojiSendBtn');
  const emojiPanel = $('#emojiPanel');
  const emojiGrid = $('#emojiGrid');
  const albumBtn = $('#albumBtn');

  const imageSelectMask = $('#imageSelectMask');
  const modalTitle = $('#modalTitle');
  const imagePreviewBox = $('#imagePreviewBox');
  const imagePreviewImg = $('#imagePreviewImg');
  const imagePreviewPlaceholder = $('#imagePreviewPlaceholder');
  const localImageBtn = $('#localImageBtn');
  const localImageFile = $('#localImageFile');
  const imageLinkInput = $('#imageLinkInput');
  const closeImageModal = $('#closeImageModal');
  const confirmImageBtn = $('#confirmImageBtn');

  const editTextMask = $('#editTextMask');
  const editTextTitle = $('#editTextTitle');
  const editTextInput = $('#editTextInput');
  const closeEditText = $('#closeEditText');
  const saveEditText = $('#saveEditText');

  const wallpaperPreview = $('#wallpaperPreview');
  const chatBgPreview = $('#chatBgPreview');
  const changeIconBtns = $$('.icon-change-btn');
  const openChatSettingPage = $('#openChatSettingPage');
  const saveChatSetting = $('#saveChatSetting');
  const chatSetBack = $('.chat-set-back');

  const heBtn = $('#heBtn');
  const meBtn = $('#meBtn');
  const blockDelay = $('#blockDelay');
  const delayRange = $('#delayRange');
  const delayRangeValue = $('#delayRangeValue');
  const blockPatSuffix = $('#blockPatSuffix');
  const blockVideoBg = $('#blockVideoBg');

  const taMask = $('#taMask');
  const taLocalBtn = $('#taLocalBtn');
  const taAvatarFile = $('#taAvatarFile');
  const taAvatarLink = $('#taAvatarLink');
  const taNameInput = $('#taNameInput');
  const closeTaSet = $('#closeTaSet');
  const saveTaSet = $('#saveTaSet');

  const meMask = $('#meMask');
  const meLocalBtn = $('#meLocalBtn');
  const meAvatarFile = $('#meAvatarFile');
  const meAvatarLink = $('#meAvatarLink');
  const meNameInput = $('#meNameInput');
  const closeMeSet = $('#closeMeSet');
  const saveMeSet = $('#saveMeSet');

  const patMask = $('#patMask');
  const patSuffixInput = $('#patSuffixInput');
  const closePatSet = $('#closePatSet');
  const savePatSet = $('#savePatSet');

  const videoBgMask = $('#videoBgMask');
  const videoBgFile = $('#videoBgFile');
  const videoBgLink = $('#videoBgLink');
  const closeVideoBg = $('#closeVideoBg');
  const saveVideoBg = $('#saveVideoBg');

  const mailTabs = $$('.mail-tab');
  const sentList = $('#sentList');
  const inboxWrap = $('#inboxWrap');
  const mailAddBtn = $('#mailAddBtn');

  const writeLetterMask = $('#writeLetterMask');
  const letterContentInput = $('#letterContentInput');
  const closeLetterModal = $('#closeLetterModal');
  const sendLetterConfirm = $('#sendLetterConfirm');

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
  const exportChatBtn = $('#exportChatBtn');
  const importChatBtn = $('#importChatBtn');
  const exportCardsBtn = $('#exportCardsBtn');
  const importCardsBtn = $('#importCardsBtn');

  const importConfirmMask = $('#importConfirmMask');
  const importConfirmTitle = $('#importConfirmTitle');
  const importConfirmMsg = $('#importConfirmMsg');
  const importCancelBtn = $('#importCancelBtn');
  const importConfirmBtn = $('#importConfirmBtn');

  const videoWindow = $('#videoWindow');
  const videoBg = $('#videoBg');
  const videoTimer = $('#videoTimer');
  const videoFoldBtn = $('#videoFoldBtn');
  const videoAvatar = $('#videoAvatar');
  const videoHangupBtn = $('#videoHangupBtn');
  const videoAnswerArea = $('#videoAnswerArea');
  const videoAnswerBtn = $('#videoAnswerBtn');
  const videoRejectBtn = $('#videoRejectBtn');
  const videoCapsule = $('#videoCapsule');
  const capsuleTimer = $('#capsuleTimer');
  const capsuleExpand = $('#capsuleExpand');
  const videoTopBtn = $('#videoTopBtn');

  const profileCover = $('#profileCover');
  const coverImage = $('#coverImage');
  const profileAvatar = $('#profileAvatar');
  const avatarImage = $('#avatarImage');
  const profileName = $('#profileName');
  const profileLocation = $('#profileLocation');
  const locationText = $('#locationText');
  const locationIcon = $('#locationIcon');
  const profileSignature = $('#profileSignature');

  const decoImage = $('#decoImage');
  const decoImg = $('#decoImg');
  const fontFileInput = $('#fontFileInput');
  const applyFontBtn = $('#applyFontBtn');
  const placeholderApp = $('#placeholderApp');
  const placeholderIcon = $('#placeholderIcon');
  const bottomBarItems = $$('.bar-item');
  const rippleToggle = $('#rippleToggle');
  const inboxBadge = $('#inboxBadge');

  // 注意：styleOptions 在 DOM 加载后才获取
  let styleOptions = [];

  let currentEditTarget = null;
  let currentMailTab = 'sent';
  let typingTimer = null;
  let letterTimer = null;
  let selectedMoodEmoji = null;
  let currentDateStr = null;
  let quoteMsg = null;
  let videoTimerInterval = null;
  let importCallback = null;

  // ===== 工具函数 =====
  function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && !(source[key] instanceof File)) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }

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

  // ===== 页面切换 =====
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
      setTimeout(() => chatWrap.scrollTop = chatWrap.scrollHeight, 50);
    }
    if (pageName === 'calendar-page') renderCalendar();
    if (pageName === 'mail-page') renderMail();
  }

  // ===== 导航事件 =====
  $$('.app-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.dataset.target;
      if (target) switchPage(target);
    });
  });

  bottomBarItems.forEach(item => {
    if (item.classList.contains('placeholder')) return;
    item.addEventListener('click', function(e) {
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

  if (videoTopBtn) {
    videoTopBtn.addEventListener('click', function() {
      initiateVideoCall('me');
    });
  }

  // ===== 动画开关 =====
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

  // ===== 粒子特效 =====
  let particleEnabled = true;
  let particleCtx = null, particleCanvas = null, particles = [], trails = [], particleAnimId = null;

  function initParticleCanvas() {
    if (particleCanvas) return;
    particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particleCanvas';
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '9998';
    document.body.appendChild(particleCanvas);
    particleCtx = particleCanvas.getContext('2d');
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);
    particleLoop();
  }

  function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function particleLoop() {
    if (!particleCtx) return;
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    // 拖尾
    for (let i = trails.length - 1; i >= 0; i--) {
      const t = trails[i];
      t.x += t.vx;
      t.y += t.vy;
      t.life -= 0.02;
      t.vy += 0.015;
      if (t.life <= 0) { trails.splice(i, 1); continue; }
      const alpha = t.life * 0.35;
      particleCtx.beginPath();
      particleCtx.arc(t.x, t.y, t.size * t.life * 0.8, 0, Math.PI * 2);
      particleCtx.fillStyle = 'rgba(170,170,180,' + alpha + ')';
      particleCtx.fill();
    }
    // 碎片
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life -= 0.015;
      p.vx *= 0.99;
      p.vy *= 0.99;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      const alpha = p.life * 0.5;
      const size = p.size * p.life * 0.8;
      particleCtx.globalAlpha = alpha;
      particleCtx.fillStyle = 'rgba(180,180,190,0.5)';
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
      particleCtx.fill();
      particleCtx.globalAlpha = 1;
    }
    particleAnimId = requestAnimationFrame(particleLoop);
  }

  function emitParticles(x, y, count, color) {
    if (!particleEnabled || !particleCtx) return;
    count = Math.min(count, 12);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        size: 2 + Math.random() * 4.5,
        life: 0.5 + Math.random() * 0.6,
        color: color || 'rgba(180,180,190,0.5)'
      });
    }
  }

  function emitTrail(x, y) {
    if (!particleEnabled || !particleCtx) return;
    for (let i = 0; i < 3; i++) {
      trails.push({
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -0.4 - Math.random() * 0.4,
        size: 1.8 + Math.random() * 2.5,
        life: 0.45 + Math.random() * 0.25
      });
    }
  }

  document.addEventListener('click', function(e) {
    if (!particleEnabled) return;
    emitParticles(e.clientX, e.clientY, 8 + Math.floor(Math.random() * 4));
  });

  document.addEventListener('touchstart', function(e) {
    if (!particleEnabled) return;
    const touch = e.touches[0];
    if (touch) {
      emitParticles(touch.clientX, touch.clientY, 6 + Math.floor(Math.random() * 3));
    }
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!particleEnabled) return;
    const touch = e.touches[0];
    if (touch) {
      emitTrail(touch.clientX, touch.clientY);
      if (Math.random() < 0.25) emitParticles(touch.clientX, touch.clientY, 2);
    }
  }, { passive: true });

  if (rippleToggle) {
    if (store.rippleEnabled !== undefined) particleEnabled = store.rippleEnabled;
    if (particleEnabled) {
      rippleToggle.classList.add('active');
      initParticleCanvas();
    }
    rippleToggle.addEventListener('click', function() {
      particleEnabled = !particleEnabled;
      this.classList.toggle('active');
      store.rippleEnabled = particleEnabled;
      saveLocal();
      if (particleEnabled) {
        if (!particleCanvas) initParticleCanvas();
      } else {
        if (particleCanvas) particleCanvas.style.display = 'none';
        if (particleAnimId) { cancelAnimationFrame(particleAnimId);
          particleAnimId = null; }
      }
    });
  }

  // ===== 通用图片弹窗 =====
  function openImageModal(title, targetKey) {
    currentEditTarget = targetKey;
    modalTitle.innerText = title;
    localImageFile.value = '';
    imageLinkInput.value = '';
    let existing = '';
    if (targetKey === 'wallpaper') existing = store.wallpaper;
    else if (targetKey === 'chatBg') existing = store.chatBg;
    else if (targetKey === 'videoBg') existing = store.chatSettings.videoBg;
    else if (targetKey === 'profileCover') existing = store.profile.cover;
    else if (targetKey === 'profileAvatar') existing = store.profile.avatar;
    else if (targetKey === 'decoImage') existing = store.decoImage;
    else existing = store.appIcon[targetKey] || '';
    imageLinkInput.value = existing;
    updateImagePreview(existing);
    imageSelectMask.style.display = 'flex';
  }

  function updateImagePreview(url, previewBox, previewImg) {
    if (!previewBox) previewBox = imagePreviewBox;
    if (!previewImg) previewImg = imagePreviewImg;
    if (url && url.trim()) {
      previewImg.src = url;
      previewBox.classList.add('has-image');
    } else {
      previewImg.src = '';
      previewBox.classList.remove('has-image');
    }
  }

  if (localImageBtn) {
    localImageBtn.addEventListener('click', function() {
      localImageFile.click();
    });
  }
  if (localImageFile) {
    localImageFile.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const url = ev.target.result;
        updateImagePreview(url);
        imageLinkInput.value = '';
      };
      reader.readAsDataURL(file);
    });
  }
  if (imageLinkInput) {
    imageLinkInput.addEventListener('input', function() {
      updateImagePreview(this.value);
    });
  }

  // 壁纸预览图点击
  const wallpaperPreviewContainer = document.querySelector('.preview-box.rect-h');
  if (wallpaperPreviewContainer) {
    wallpaperPreviewContainer.addEventListener('click', function(e) {
      e.stopPropagation();
      openImageModal('设置主页壁纸', 'wallpaper');
    });
  }

  // 聊天背景预览图点击
  const chatBgPreviewContainer = document.querySelector('.preview-box.rect-v');
  if (chatBgPreviewContainer) {
    chatBgPreviewContainer.addEventListener('click', function(e) {
      e.stopPropagation();
      openImageModal('设置聊天背景', 'chatBg');
    });
  }

  // 图标更改按钮
  changeIconBtns.forEach(b => {
    b.addEventListener('click', function() {
      const type = this.dataset.type;
      const map = { chat: '聊天', card: '字卡', theme: '外观', mail: '信箱', calendar: '日历', setting: '设置', placeholder: '占位' };
      openImageModal('更改 ' + map[type], type);
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
      if (!url) { alert('请选择图片或输入链接'); return; }
      if (currentEditTarget === 'wallpaper') {
        store.wallpaper = url;
        wallpaperPreview.src = url;
      } else if (currentEditTarget === 'chatBg') {
        store.chatBg = url;
        chatBgPreview.src = url;
      } else if (currentEditTarget === 'videoBg') {
        store.chatSettings.videoBg = url;
        applyVideoBg();
      } else if (currentEditTarget === 'profileCover') {
        store.profile.cover = url;
        coverImage.src = url;
      } else if (currentEditTarget === 'profileAvatar') {
        store.profile.avatar = url;
        avatarImage.src = url;
      } else if (currentEditTarget === 'decoImage') {
        store.decoImage = url;
        decoImg.src = url;
      } else if (currentEditTarget === 'emoji') {
        store.emojiList.push(url);
        renderEmojiGrid();
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

  // ===== 首页个人资料交互 =====
  if (profileCover) {
    profileCover.addEventListener('click', function(e) {
      e.stopPropagation();
      openImageModal('选择封面', 'profileCover');
    });
  }
  if (profileAvatar) {
    profileAvatar.addEventListener('click', function(e) {
      e.stopPropagation();
      openImageModal('选择头像', 'profileAvatar');
    });
  }
  if (profileName) {
    profileName.addEventListener('click', function(e) {
      e.stopPropagation();
      openEditText('修改昵称', store.profile.name, function(val) {
        store.profile.name = val;
        profileName.innerText = val;
        saveLocal();
      });
    });
  }
  if (profileLocation) {
    profileLocation.addEventListener('click', function(e) {
      e.stopPropagation();
      const panel = document.querySelector('#editTextMask .panel');
      const originalContent = panel.innerHTML;
      panel.innerHTML = `
        <h3>修改位置</h3>
        <div style="margin-bottom:12px;">
          <label style="font-size:14px;color:#555;">位置名称</label>
          <input type="text" id="editLocationText" value="${store.profile.location}" style="width:100%;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:16px;margin-top:4px;">
        </div>
        <div>
          <label style="font-size:14px;color:#555;">位置图标链接</label>
          <input type="text" id="editLocationIcon" value="${store.profile.locationIcon}" style="width:100%;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:16px;margin-top:4px;">
        </div>
        <div class="btns-wrap">
          <button class="close" id="editLocationCancel">取消</button>
          <button class="save" id="editLocationSave">保存</button>
        </div>
      `;
      document.getElementById('editLocationCancel').onclick = function() {
        panel.innerHTML = originalContent;
        editTextMask.style.display = 'none';
      };
      document.getElementById('editLocationSave').onclick = function() {
        const newText = document.getElementById('editLocationText').value.trim();
        const newIcon = document.getElementById('editLocationIcon').value.trim();
        if (newText) {
          store.profile.location = newText;
          locationText.innerText = newText;
        }
        if (newIcon) {
          store.profile.locationIcon = newIcon;
          locationIcon.src = newIcon;
        }
        saveLocal();
        panel.innerHTML = originalContent;
        editTextMask.style.display = 'none';
      };
      editTextMask.style.display = 'flex';
    });
  }
  if (profileSignature) {
    profileSignature.addEventListener('click', function(e) {
      e.stopPropagation();
      openEditText('修改签名', store.profile.signature, function(val) {
        store.profile.signature = val;
        profileSignature.innerText = val;
        saveLocal();
      });
    });
  }

  // 装饰图点击
  if (decoImage) {
    decoImage.addEventListener('click', function() {
      openImageModal('更换装饰图', 'decoImage');
    });
  }

  // ===== 文本编辑弹窗 =====
  function openEditText(title, currentValue, callback) {
    editTextTitle.innerText = title;
    editTextInput.value = currentValue;
    editTextMask.style.display = 'flex';
    const newSave = function() {
      const val = editTextInput.value.trim();
      if (val) callback(val);
      editTextMask.style.display = 'none';
    };
    saveEditText.onclick = newSave;
    closeEditText.onclick = function() {
      editTextMask.style.display = 'none';
    };
  }

  // ===== HE / ME 弹窗 =====
  if (heBtn) {
    heBtn.addEventListener('click', function() {
      taNameInput.value = store.taInfo.name;
      taAvatarLink.value = store.taInfo.avatarUrl || '';
      taAvatarFile.value = '';
      taMask.style.display = 'flex';
    });
  }
  if (meBtn) {
    meBtn.addEventListener('click', function() {
      meNameInput.value = store.myInfo.name;
      meAvatarLink.value = store.myInfo.avatarUrl || '';
      meAvatarFile.value = '';
      meMask.style.display = 'flex';
    });
  }

  // 关于TA保存
  if (taLocalBtn) {
    taLocalBtn.addEventListener('click', function() {
      taAvatarFile.click();
    });
  }
  if (taAvatarFile) {
    taAvatarFile.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const url = ev.target.result;
        taAvatarLink.value = url;
      };
      reader.readAsDataURL(file);
    });
  }
  if (taAvatarLink) {
    taAvatarLink.addEventListener('input', function() {});
  }
  if (closeTaSet) {
    closeTaSet.addEventListener('click', function() {
      taMask.style.display = 'none';
    });
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

  // 关于我保存
  if (meLocalBtn) {
    meLocalBtn.addEventListener('click', function() {
      meAvatarFile.click();
    });
  }
  if (meAvatarFile) {
    meAvatarFile.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const url = ev.target.result;
        meAvatarLink.value = url;
      };
      reader.readAsDataURL(file);
    });
  }
  if (meAvatarLink) {
    meAvatarLink.addEventListener('input', function() {});
  }
  if (closeMeSet) {
    closeMeSet.addEventListener('click', function() {
      meMask.style.display = 'none';
    });
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

  // ===== 其他聊天设置 =====
  if (blockDelay) {
    blockDelay.addEventListener('click', function() { /* 进度条无需弹窗 */ });
  }
  if (delayRange) {
    delayRange.addEventListener('input', function() {
      const val = parseInt(this.value);
      delayRangeValue.textContent = val + '秒';
      store.delay.min = val;
      store.delay.max = val + 20;
      saveLocal();
    });
    const loadDelay = function() {
      const min = store.delay.min || 20;
      delayRange.value = min;
      delayRangeValue.textContent = min + '秒';
    };
    setTimeout(loadDelay, 100);
    if (saveChatSetting) {
      saveChatSetting.addEventListener('click', function() {
        const val = parseInt(delayRange.value);
        store.delay.min = val;
        store.delay.max = val + 20;
        saveLocal();
      });
    }
  }

  if (blockPatSuffix) {
    blockPatSuffix.addEventListener('click', function() {
      patSuffixInput.value = store.chatSettings.patSuffix || '拍了拍';
      patMask.style.display = 'flex';
    });
  }
  if (closePatSet) {
    closePatSet.addEventListener('click', function() {
      patMask.style.display = 'none';
    });
  }
  if (savePatSet) {
    savePatSet.addEventListener('click', function() {
      const val = patSuffixInput.value.trim();
      if (val) {
        store.chatSettings.patSuffix = val;
        saveLocal();
      }
      patMask.style.display = 'none';
    });
  }

  if (blockVideoBg) {
    blockVideoBg.addEventListener('click', function() {
      videoBgLink.value = store.chatSettings.videoBg || '';
      videoBgFile.value = '';
      videoBgMask.style.display = 'flex';
    });
  }
  if (closeVideoBg) {
    closeVideoBg.addEventListener('click', function() {
      videoBgMask.style.display = 'none';
    });
  }
  if (saveVideoBg) {
    saveVideoBg.addEventListener('click', async function() {
      let url = '';
      if (videoBgFile.files && videoBgFile.files[0]) {
        url = await fileToDataUrl(videoBgFile.files[0]);
      } else if (videoBgLink.value.trim()) {
        url = videoBgLink.value.trim();
      }
      if (url) {
        store.chatSettings.videoBg = url;
        applyVideoBg();
        saveLocal();
      }
      videoBgMask.style.display = 'none';
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

  // ===== 头像样式 =====
  styleOptions = $$('.style-option');  // 先获取
  styleOptions.forEach(opt => {
    opt.addEventListener('click', function() {
      styleOptions.forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      const style = this.dataset.style;
      store.chatSettings.avatarStyle = style;
      saveLocal();
      renderMessages();
    });
  });

  // ===== 字体 =====
  if (applyFontBtn) {
    applyFontBtn.addEventListener('click', function() {
      const file = fontFileInput.files[0];
      if (!file) { alert('请先选择字体文件'); return; }
      const reader = new FileReader();
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const fontName = file.name.replace(/\.[^.]+$/, '');
        const fontFace = new FontFace(fontName, arrayBuffer);
        fontFace.load().then(function(loadedFace) {
          document.fonts.add(loadedFace);
          document.documentElement.style.fontFamily = fontName + ', "Microsoft Yahei", system-ui, sans-serif';
          store.appliedFont = fontName;
          saveLocal();
          alert('字体应用成功！当前会话有效，刷新后需重新上传。');
        }).catch(function(err) {
          alert('字体加载失败：' + err.message);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // ===== 表情包 =====
  function renderEmojiGrid() {
    emojiGrid.innerHTML = '';
    const addDiv = document.createElement('div');
    addDiv.className = 'emoji-item add-btn';
    addDiv.textContent = '＋';
    addDiv.addEventListener('click', function() {
      openImageModal('添加表情', 'emoji');
    });
    emojiGrid.appendChild(addDiv);
    store.emojiList.forEach(src => {
      const div = document.createElement('div');
      div.className = 'emoji-item';
      div.innerHTML = `<img src="${src}" loading="lazy">`;
      div.addEventListener('click', function() {
        sendMessageByText(`[emoji:${src}]`);
        emojiPanel.classList.remove('show');
      });
      emojiGrid.appendChild(div);
    });
  }
  if (emojiSendBtn) {
    emojiSendBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      emojiPanel.classList.toggle('show');
    });
  }
  document.addEventListener('click', function(e) {
    if (emojiPanel && !emojiPanel.contains(e.target) && e.target !== emojiSendBtn) {
      emojiPanel.classList.remove('show');
    }
  });

  // ===== 相册 =====
  if (albumBtn) {
    albumBtn.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
          const dataUrl = ev.target.result;
          sendImageMessage(dataUrl);
        };
        reader.readAsDataURL(file);
        input.value = '';
      };
      input.click();
    });
  }

  function sendImageMessage(imageUrl) {
    const quote = quoteMsg;
    quoteMsg = null;
    quoteBar.style.display = 'none';
    const now = Date.now();
    addMessage('', true, now, quote, false, false, imageUrl);
    updateRandomStatus();
    store.isTyping = true;
    renderMessages();
    const min = store.delay.min * 1000,
      max = (store.delay.min + 20) * 1000,
      wait = Math.floor(Math.random() * (max - min) + min);
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      store.isTyping = false;
      const replyList = getRandomReplyArr();
      let quoteReply = null;
      if (Math.random() < 0.2 && store.messages.length > 1) {
        const lastUser = [...store.messages].reverse().find(m => m.isUser);
        if (lastUser) quoteReply = lastUser;
      }
      const placeholder = chatWrap.querySelector('.typing-placeholder');
      if (placeholder) placeholder.remove();
      replyList.forEach((item, idx) => {
        setTimeout(() => {
          addMessage(item.text, false, Date.now(), quoteReply);
        }, idx * 500);
      });
      setTimeout(() => {
        updateRandomStatus();
      }, replyList.length * 500 + 100);
      typingTimer = null;
    }, wait);
  }

  // ===== 信箱 =====
  function renderMail() { renderSentList();
    renderInbox();
    updateBadge(); }

  function renderSentList() {
    if (!sentList) return;
    sentList.innerHTML = '';
    if (store.letters.length === 0) {
      sentList.innerHTML = '<div style="color:#999;text-align:center;padding:20px 0;">暂无寄出的信件</div>';
      return;
    }
    store.letters.slice().reverse().forEach((letter, idx) => {
      const div = document.createElement('div');
      div.className = 'sent-item';
      const status = letter.replied ? '<span style="color:#888;font-size:11px;margin-left:6px;">已回信</span>' : '<span style="color:#e74c3c;font-size:11px;margin-left:6px;">暂未回信</span>';
      const preview = letter.text.length > 20 ? letter.text.slice(0, 20) + '...' : letter.text;
      div.innerHTML = `<span class="sent-time">${formatTime(letter.create)}</span><span class="sent-preview">${escapeHtml(preview)}</span>${status}`;
      sentList.appendChild(div);
    });
  }

  function updateBadge() {
    if (!inboxBadge) return;
    const unreadCount = store.inbox.filter(item => !item.read).length;
    inboxBadge.style.display = unreadCount > 0 ? 'inline' : 'none';
  }

  function renderInbox() {
    if (!inboxWrap) return;
    inboxWrap.innerHTML = '';
    if (store.inbox.length === 0) {
      inboxWrap.innerHTML = '<div style="color:#999;text-align:center;padding:40px 0;">暂无回信</div>';
      updateBadge();
      return;
    }
    [...store.inbox].reverse().forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'letter-item';
      const isUnread = !item.read;
      div.innerHTML = `
        <div class="letter-header" data-idx="${index}">
          <span class="letter-time">${formatTime(item.time)}</span>
          ${isUnread ? '<span class="unread-dot">●</span>' : ''}
          <span class="letter-expand">展开 ▾</span>
        </div>
        <div class="letter-body" style="display:none;">
          <div class="letter-note">
            <div class="note-origin">
              <span class="note-label">📩 原信</span>
              <span class="note-origin-text">${escapeHtml(item.originText)}</span>
            </div>
            <div class="note-reply">
              <span class="note-label">💬 回信</span>
              <span class="note-reply-text">${escapeHtml(item.replyText)}</span>
            </div>
            <button class="letter-close">✕</button>
          </div>
        </div>
      `;
      inboxWrap.appendChild(div);

      const header = div.querySelector('.letter-header');
      const body = div.querySelector('.letter-body');
      const expandBtn = header.querySelector('.letter-expand');
      header.addEventListener('click', function(e) {
        if (e.target.closest('.letter-close')) return;
        const isOpen = body.style.display === 'block';
        body.style.display = isOpen ? 'none' : 'block';
        expandBtn.textContent = isOpen ? '展开 ▾' : '收起 ▴';
        if (!item.read) {
          item.read = true;
          const dot = header.querySelector('.unread-dot');
          if (dot) dot.style.display = 'none';
          saveLocal();
          updateBadge();
        }
      });

      const closeBtn = div.querySelector('.letter-close');
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        body.style.display = 'none';
        expandBtn.textContent = '展开 ▾';
      });
    });
    updateBadge();
  }

  mailTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      mailTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentMailTab = this.dataset.tab;
      document.querySelector('.sent-box').classList.toggle('hidden', currentMailTab !== 'sent');
      inboxWrap.classList.toggle('hidden', currentMailTab !== 'inbox');
      if (currentMailTab === 'inbox') renderInbox();
    });
  });

  if (mailAddBtn) {
    mailAddBtn.addEventListener('click', function() {
      writeLetterMask.style.display = 'flex';
    });
  }
  if (closeLetterModal) {
    closeLetterModal.addEventListener('click', function() {
      writeLetterMask.style.display = 'none';
    });
  }
  if (sendLetterConfirm) {
    sendLetterConfirm.addEventListener('click', function() {
      const text = letterContentInput.value.trim();
      if (!text) return;
      const now = Date.now();
      const len = text.length;
      const delayHour = 12 + (len / 500) * 12;
      const realDelay = Math.min(Math.max(delayHour, 12), 24) * 3600 * 1000;
      const replyTime = now + realDelay;
      store.letters.push({ text, create: now, replyTime, done: false, replied: false });
      letterContentInput.value = '';
      writeLetterMask.style.display = 'none';
      saveLocal();
      renderSentList();
      scheduleLetterReplies();
      alert(`信件已寄出，预计 ${Math.round(realDelay / 3600000)} 小时后收到回信。`);
    });
  }

  function scheduleLetterReplies() {
    if (letterTimer) { clearTimeout(letterTimer);
      letterTimer = null; }
    const now = Date.now();
    let earliest = Infinity;
    store.letters.forEach(l => {
      if (!l.done && l.replyTime > now && l.replyTime < earliest) earliest = l.replyTime;
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
      letter.replied = true;
      changed = true;
      const count = randomInt(5, 20);
      let reply = [];
      for (let i = 0; i < count; i++) {
        if (allCards.length === 0) reply.push('（暂无字卡）');
        else reply.push(allCards[randomInt(0, allCards.length - 1)].text);
      }
      store.inbox.push({ replyText: reply.join(''), originText: letter.text, time: letter.replyTime, read: false, originLetterId: Date.now() + Math.random() });
    });
    if (changed) { saveLocal();
      renderInbox();
      renderSentList(); }
    scheduleLetterReplies();
  }

  // ===== 聊天核心 =====
  function updateRandomStatus() {
    const allCards = getAllValidCards();
    if (allCards.length > 0) {
      const idx = randomInt(0, allCards.length - 1);
      store.currentStatus = allCards[idx].text;
    } else {
      store.currentStatus = '暂无状态字卡';
    }
    if (currentStatusText) currentStatusText.innerText = store.currentStatus;
  }

  function renderHeaderAvatar() {
    headerTaAvatar.src = store.taInfo.avatarUrl || '';
    headerMyAvatar.src = store.myInfo.avatarUrl || '';
    updateRandomStatus();
  }

  function applyBgStyle() {
    document.body.style.setProperty('--wallpaper', store.wallpaper ? `url(${store.wallpaper})` : 'none');
    document.documentElement.style.setProperty('--chat-bg', store.chatBg ? `url(${store.chatBg})` : 'none');
  }

  function applyVideoBg() {
    if (videoBg) videoBg.style.backgroundImage = store.chatSettings.videoBg ? `url(${store.chatSettings.videoBg})` : 'none';
  }

  function refreshAllIconPreview() {
    const keys = ['chat', 'card', 'theme', 'mail', 'calendar', 'setting', 'placeholder'];
    keys.forEach(key => {
      const el = document.getElementById(key + 'AppIcon');
      const prev = document.getElementById(key + 'IconPreview');
      const src = store.appIcon[key] || '';
      if (el) el.src = src;
      if (prev) prev.src = src;
    });
    if (placeholderIcon) placeholderIcon.src = store.appIcon.placeholder || '';
    if (decoImg) decoImg.src = store.decoImage || '';
  }

  function parseEmojiText(text) {
    return text.replace(/\[emoji:(.+?)\]/g, (m, src) => `<img class="msg-emoji-inside" src="${src}" loading="lazy">`);
  }

  function randomAttachEmoji() {
    if (store.emojiList.length === 0) return null;
    if (Math.random() < 0.25) return store.emojiList[randomInt(0, store.emojiList.length - 1)];
    return null;
  }

  function renderMessages() {
    if (!chatWrap) return;
    chatWrap.innerHTML = '';
    let lastTime = 0;
    store.messages.forEach(msg => {
      if (msg.time - lastTime > 10 * 60 * 1000) {
        const div = document.createElement('div');
        div.className = 'time-divider';
        div.innerText = formatTime(msg.time);
        chatWrap.appendChild(div);
      }
      lastTime = msg.time;
      appendMessageElement(msg);
    });
    if (store.isTyping) {
      const tempItem = document.createElement('div');
      tempItem.className = 'msg-item target-msg typing-placeholder';
      tempItem.innerHTML = `<div class="msg-avatar ${store.chatSettings.avatarStyle === 'square' ? 'square' : ''}">${store.taInfo.avatarUrl ? `<img src="${store.taInfo.avatarUrl}" loading="lazy">` : ''}</div><div class="msg-bubble-wrap"><div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`;
      chatWrap.appendChild(tempItem);
    }
    chatWrap.scrollTop = chatWrap.scrollHeight;
  }

  function appendMessageElement(msg) {
    if (msg.system) {
      const div = document.createElement('div');
      div.className = msg.isRed ? 'pat-message red' : 'pat-message';
      div.innerText = msg.text;
      chatWrap.appendChild(div);
      return;
    }
    if (msg.imageUrl) {
      const item = document.createElement('div');
      item.className = `msg-item ${msg.isUser ? 'user-msg' : 'target-msg'}`;
      const avatarSrc = msg.isUser ? store.myInfo.avatarUrl : store.taInfo.avatarUrl;
      let hideAvatar = false;
      const msgs = store.messages;
      const idx = msgs.indexOf(msg);
      if (idx > 0) {
        const prev = msgs[idx - 1];
        if (!prev.system && prev.isUser === msg.isUser && (msg.time - prev.time) < 3000) hideAvatar = true;
      }
      const avatarClass = store.chatSettings.avatarStyle === 'square' ? 'square' : '';
      const avatarHtml = hideAvatar ? '' : `<div class="msg-avatar ${avatarClass}" data-msgid="${msg.id}">${avatarSrc ? `<img src="${avatarSrc}" loading="lazy">` : ''}</div>`;
      const avatarPlaceholder = hideAvatar ? `<div class="msg-avatar ${avatarClass}" style="visibility:hidden;"></div>` : avatarHtml;
      item.innerHTML = `${avatarPlaceholder}<div class="msg-bubble-wrap"><img class="msg-image" src="${msg.imageUrl}" loading="lazy"></div>`;
      chatWrap.appendChild(item);
      return;
    }

    const isEmojiOnly = /^\[emoji:.+\]$/.test(msg.text.trim());
    const item = document.createElement('div');
    item.className = `msg-item ${msg.isUser ? 'user-msg' : 'target-msg'}`;
    if (isEmojiOnly) item.classList.add('emoji-only');
    item.dataset.msgId = msg.id;

    let hideAvatar = false;
    const msgs = store.messages;
    const idx = msgs.indexOf(msg);
    if (idx > 0) {
      const prev = msgs[idx - 1];
      if (!prev.system && prev.isUser === msg.isUser && (msg.time - prev.time) < 3000) hideAvatar = true;
    }

    let quoteHtml = '';
    if (msg.quote) { quoteHtml = `<div class="msg-quote">${escapeHtml(msg.quote.text)}</div>`; }
    let html = '';
    if (isEmojiOnly) {
      const src = msg.text.match(/\[emoji:(.+?)\]/)[1];
      html = `<img class="emoji-big" src="${src}" loading="lazy">`;
    } else {
      html = parseEmojiText(msg.text);
      let emojiSrc = null;
      if (!msg.isUser) emojiSrc = randomAttachEmoji();
      if (emojiSrc && msg.text.trim() === '') {
        html = `<img class="msg-emoji-inside" style="width:40px;height:40px;" src="${emojiSrc}">`;
      } else if (emojiSrc) { html += `<img class="msg-emoji-inside" src="${emojiSrc}">`; }
    }
    const avatarSrc = msg.isUser ? store.myInfo.avatarUrl : store.taInfo.avatarUrl;
    const avatarClass = store.chatSettings.avatarStyle === 'square' ? 'square' : '';
    const avatarHtml = hideAvatar ? '' : `<div class="msg-avatar ${avatarClass}" data-msgid="${msg.id}">${avatarSrc ? `<img src="${avatarSrc}" loading="lazy">` : ''}</div>`;
    const avatarPlaceholder = hideAvatar ? `<div class="msg-avatar ${avatarClass}" style="visibility:hidden;"></div>` : avatarHtml;
    item.innerHTML = `${avatarPlaceholder}<div class="msg-bubble-wrap">${quoteHtml}${isEmojiOnly ? '' : `<div class="msg-bubble">${html}</div>`}${isEmojiOnly ? html : ''}</div>`;

    let longPressTimer = null,
      isLongPress = false,
      touchStartX = 0,
      touchStartY = 0;
    item.addEventListener('touchstart', function(e) {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isLongPress = false;
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        if (navigator.vibrate) navigator.vibrate(10);
      }, 300);
    }, { passive: true });

    item.addEventListener('touchmove', function(e) {
      if (!isLongPress) return;
      const touch = e.touches[0];
      const diffX = touchStartX - touch.clientX;
      if (diffX < -30) {
        e.preventDefault();
        clearTimeout(longPressTimer);
        longPressTimer = null;
        isLongPress = false;
        this.style.transition = 'transform 0.2s ease';
        this.style.transform = 'translateX(20px)';
        setTimeout(() => { this.style.transform = ''; }, 300);
        quoteMsg = msg;
        quoteContent.innerText = msg.text;
        quoteBar.style.display = 'flex';
        item.removeEventListener('touchend', touchEndHandler);
        item.removeEventListener('touchcancel', touchEndHandler);
      }
    }, { passive: false });

    const touchEndHandler = function() {
      clearTimeout(longPressTimer);
      longPressTimer = null;
      isLongPress = false;
    };
    item.addEventListener('touchend', touchEndHandler, { passive: true });
    item.addEventListener('touchcancel', touchEndHandler, { passive: true });

    chatWrap.appendChild(item);
  }

  function addMessage(text, isUser, time, quote, system, isRed, imageUrl) {
    const msg = { id: Date.now() + Math.random(), text, isUser, time: time || Date.now(), quote: quote || null, system: system || false, isRed: isRed || false, imageUrl: imageUrl || null };
    store.messages.push(msg);
    saveLocal();
    if (!system && needTimeStamp()) addTimeDivider();
    store.lastChatTime = Date.now();
    appendMessageElement(msg);
    chatWrap.scrollTop = chatWrap.scrollHeight;
    if (!system && !isUser && Math.random() < 0.1) {
      setTimeout(() => {
        const target = Math.random() < 0.5 ? 'user' : 'ta';
        const targetName = target === 'user' ? store.myInfo.name : store.taInfo.name;
        const cards = getAllValidCards();
        let suffix = '拍了拍';
        if (cards.length > 0) { const idx = randomInt(0, cards.length - 1);
          suffix = cards[idx].text; }
        const patText = `${store.taInfo.name} 拍了拍 ${targetName} ${suffix}`;
        addMessage(patText, false, Date.now(), null, true, false);
      }, 1500);
    }
    if (!system && !isUser && Math.random() < 0.05) {
      setTimeout(() => { initiateVideoCall('ta'); }, 1000);
    }
  }

  function needTimeStamp() {
    if (store.messages.length === 0) return false;
    const last = store.messages[store.messages.length - 1];
    return (Date.now() - last.time) > 10 * 60 * 1000;
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
    if (pool.length === 0) return [{ text: '暂无可用字卡，请前往字卡库添加' }];
    let arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[r]] = [arr[r], arr[i]];
    }
    const take = Math.floor(Math.random() * 3) + 1;
    return arr.slice(0, take);
  }

  function sendMessageByText(text) {
    const quote = quoteMsg;
    quoteMsg = null;
    quoteBar.style.display = 'none';
    const now = Date.now();
    addMessage(text, true, now, quote);
    inputText.value = '';
    updateRandomStatus();
    store.isTyping = true;
    renderMessages();

    const min = store.delay.min * 1000,
      max = (store.delay.min + 20) * 1000,
      wait = Math.floor(Math.random() * (max - min) + min);
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      store.isTyping = false;
      const replyList = getRandomReplyArr();
      let quoteReply = null;
      if (Math.random() < 0.2 && store.messages.length > 1) {
        const lastUser = [...store.messages].reverse().find(m => m.isUser);
        if (lastUser) quoteReply = lastUser;
      }
      const placeholder = chatWrap.querySelector('.typing-placeholder');
      if (placeholder) placeholder.remove();
      replyList.forEach((item, idx) => {
        setTimeout(() => {
          addMessage(item.text, false, Date.now(), quoteReply);
        }, idx * 500);
      });
      setTimeout(() => {
        updateRandomStatus();
      }, replyList.length * 500 + 100);
      typingTimer = null;
    }, wait);
  }

  function sendMessage() {
    const content = inputText.value.trim();
    if (!content) return;
    sendMessageByText(content);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (inputText) {
    inputText.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault();
        sendMessage(); }
    });
  }
  if (quoteClose) {
    quoteClose.addEventListener('click', function() {
      quoteMsg = null;
      quoteBar.style.display = 'none';
    });
  }

  // ===== 拍一拍 =====
  function handlePat(avatarEl, isUser) {
    const initiator = store.myInfo.name;
    let targetName = '';
    if (isUser) targetName = store.myInfo.name;
    else targetName = store.taInfo.name;
    const suffix = store.chatSettings.patSuffix || '拍了拍';
    const patText = `${initiator} 拍了拍 ${targetName} ${suffix}`;
    addMessage(patText, false, Date.now(), null, true, false);
  }
  let clickCount = 0,
    clickTimer = null;
  chatWrap.addEventListener('click', function(e) {
    const avatar = e.target.closest('.msg-avatar');
    if (!avatar) return;
    clickCount++;
    if (clickCount === 2) {
      clearTimeout(clickTimer);
      clickCount = 0;
      const msgItem = avatar.closest('.msg-item');
      if (!msgItem) return;
      const isUser = msgItem.classList.contains('user-msg');
      handlePat(avatar, isUser);
    } else {
      clickTimer = setTimeout(() => { clickCount = 0; }, 400);
    }
  });

  // ===== 视频通话 =====
  function startVideoTimer() {
    if (videoTimerInterval) clearInterval(videoTimerInterval);
    const start = Date.now();
    videoTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      const timeStr = `${h}:${m}:${s}`;
      videoTimer.textContent = timeStr;
      capsuleTimer.textContent = timeStr;
    }, 1000);
  }

  function stopVideoTimer() {
    if (videoTimerInterval) { clearInterval(videoTimerInterval);
      videoTimerInterval = null; }
  }

  function showVideoWindow(caller) {
    videoWindow.classList.add('active');
    videoCapsule.classList.remove('active');
    const avatarUrl = caller === 'ta' ? store.taInfo.avatarUrl : store.myInfo.avatarUrl;
    videoAvatar.src = avatarUrl || '';
    videoAnswerArea.style.display = 'none';
    videoHangupBtn.style.display = 'block';
    applyVideoBg();
    startVideoTimer();
    store.videoCall.active = true;
    store.videoCall.caller = caller;
    store.videoCall.startTime = Date.now();
    store.videoCall.folded = false;
    enableVideoDrag();
  }

  function hideVideoWindow() {
    videoWindow.classList.remove('active');
    videoCapsule.classList.remove('active');
    stopVideoTimer();
    store.videoCall.active = false;
    store.videoCall.caller = '';
    store.videoCall.startTime = null;
  }

  function foldVideoWindow() {
    if (videoWindow.classList.contains('active')) {
      videoWindow.classList.remove('active');
      videoCapsule.classList.add('active');
      store.videoCall.folded = true;
      capsuleTimer.textContent = videoTimer.textContent;
    }
  }

  function unfoldVideoWindow() {
    videoCapsule.classList.remove('active');
    videoWindow.classList.add('active');
    store.videoCall.folded = false;
  }

  if (videoFoldBtn) videoFoldBtn.addEventListener('click', foldVideoWindow);
  if (capsuleExpand) capsuleExpand.addEventListener('click', unfoldVideoWindow);
  if (videoHangupBtn) {
    videoHangupBtn.addEventListener('click', function() {
      const caller = store.videoCall.caller;
      const name = caller === 'ta' ? store.taInfo.name : store.myInfo.name;
      let msg = '';
      if (caller === 'ta') { msg = `你挂断了${name}的电话`; } else { msg = `${name}挂断了你的电话`; }
      addMessage(msg, false, Date.now(), null, true, true);
      hideVideoWindow();
    });
  }

  let dragData = null;

  function enableVideoDrag() {
    const el = videoWindow;
    el.addEventListener('touchstart', onDragStart, { passive: false });
    el.addEventListener('mousedown', onDragStart);
  }

  function onDragStart(e) {
    if (e.target.closest('button')) return;
    const el = videoWindow;
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragData = { offsetX: clientX - rect.left, offsetY: clientY - rect.top, el: el };
    el.classList.add('dragging');
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('mouseup', onDragEnd);
    e.preventDefault();
  }

  function onDragMove(e) {
    if (!dragData) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const el = dragData.el;
    el.style.left = (clientX - dragData.offsetX) + 'px';
    el.style.top = (clientY - dragData.offsetY) + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    e.preventDefault();
  }

  function onDragEnd() {
    if (dragData) dragData.el.classList.remove('dragging');
    dragData = null;
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    document.removeEventListener('mouseup', onDragEnd);
  }

  function initiateVideoCall(caller) {
    if (store.videoCall.active) return;
    if (caller === 'ta') {
      videoWindow.classList.add('active');
      videoCapsule.classList.remove('active');
      videoAvatar.src = store.taInfo.avatarUrl || '';
      videoAnswerArea.style.display = 'flex';
      videoHangupBtn.style.display = 'none';
      videoTimer.textContent = '来电...';
      applyVideoBg();
      store.videoCall.active = true;
      store.videoCall.caller = 'ta';
      store.videoCall.startTime = null;
      enableVideoDrag();
      videoAnswerBtn.onclick = function() {
        videoAnswerArea.style.display = 'none';
        videoHangupBtn.style.display = 'block';
        videoTimer.textContent = '00:00:00';
        startVideoTimer();
        store.videoCall.answered = true;
        store.videoCall.startTime = Date.now();
        addMessage(`${store.taInfo.name} 接听了你的视频`, false, Date.now(), null, true, false);
      };
      videoRejectBtn.onclick = function() {
        hideVideoWindow();
        addMessage(`${store.taInfo.name} 正忙，未接听`, false, Date.now(), null, true, true);
        store.videoCall.active = false;
      };
    } else {
      showVideoWindow('me');
      const answer = Math.random() < 0.8;
      if (answer) {
        setTimeout(() => {
          videoTimer.textContent = '00:00:00';
          startVideoTimer();
          store.videoCall.answered = true;
          addMessage(`${store.taInfo.name} 接听了你的视频`, false, Date.now(), null, true, false);
        }, 2000);
      } else {
        setTimeout(() => {
          hideVideoWindow();
          addMessage(`${store.taInfo.name} 正忙，未接听`, false, Date.now(), null, true, true);
        }, 3000);
      }
    }
  }

// ===== 字卡管理 =====
// 折叠控制
const collapseHeader = document.getElementById('groupCollapseHeader');
const collapseBody = document.getElementById('groupCollapseBody');
const collapseArrow = document.getElementById('collapseArrow');
let isCollapsed = true; // 默认折叠

if (collapseHeader) {
  collapseHeader.addEventListener('click', function() {
    isCollapsed = !isCollapsed;
    collapseBody.style.display = isCollapsed ? 'none' : 'block';
    collapseArrow.classList.toggle('open', !isCollapsed);
  });
}

// 管理字卡弹窗
const cardManageModal = document.getElementById('cardManageModal');
const cardManageList = document.getElementById('cardManageList');
const cardManageTitle = document.getElementById('cardManageTitle');
const cardManageCount = document.getElementById('cardManageCount');
const cardManageClose = document.getElementById('cardManageClose');
const manageCardBtn = document.getElementById('manageCardBtn');

function openCardManageModal() {
  const g = store.currentSelectGroup;
  if (!g || !store.groups[g]) {
    alert('请先选择或创建分组');
    return;
  }
  cardManageTitle.textContent = `📝 管理「${g}」字卡`;
  renderCardManageList();
  cardManageModal.style.display = 'flex';
}

function renderCardManageList() {
  const g = store.currentSelectGroup;
  if (!g || !store.groups[g]) {
    cardManageList.innerHTML = '<div class="card-manage-empty">暂无字卡</div>';
    cardManageCount.textContent = '共 0 条';
    return;
  }
  const list = store.groups[g];
  cardManageList.innerHTML = '';
  list.forEach((card, idx) => {
    const div = document.createElement('div');
    div.className = `card-manage-item ${card.disabled ? 'disabled' : ''}`;
    div.innerHTML = `
      <span class="card-manage-text">${escapeHtml(card.text)}</span>
      <div class="card-manage-opts">
        <button class="edit-btn" data-idx="${idx}"><img src="https://i.ibb.co/sdw1Gc33/bianjiheibeifen.png" alt="编辑"></button>
        <button class="del-btn" data-idx="${idx}"><img src="https://i.ibb.co/24WKj9F/shanchu.png" alt="删除"></button>
        <button class="switch-btn" data-idx="${idx}"><img src="https://i.ibb.co/0pTRWNG4/Shield-pingbi.png" alt="${card.disabled ? '启用' : '屏蔽'}"></button>
      </div>
    `;
    div.querySelector('.edit-btn').addEventListener('click', function() {
      const i = parseInt(this.dataset.idx);
      const res = prompt('修改字卡', list[i].text);
      if (res && res.trim()) { list[i].text = res.trim(); saveLocal(); renderCardManageList(); refreshGroupSelect(); }
    });
    div.querySelector('.del-btn').addEventListener('click', function() {
      const i = parseInt(this.dataset.idx);
      if (confirm('确定要删除该字卡吗？')) {
        list.splice(i, 1);
        saveLocal();
        renderCardManageList();
        refreshGroupSelect();
      }
    });
    div.querySelector('.switch-btn').addEventListener('click', function() {
      const i = parseInt(this.dataset.idx);
      list[i].disabled = !list[i].disabled;
      saveLocal();
      renderCardManageList();
      refreshGroupSelect();
    });
    cardManageList.appendChild(div);
  });
  cardManageCount.textContent = `共 ${list.length} 条`;
}

// 管理按钮事件
if (manageCardBtn) {
  manageCardBtn.addEventListener('click', openCardManageModal);
}
if (cardManageClose) {
  cardManageClose.addEventListener('click', function() {
    cardManageModal.style.display = 'none';
  });
}
// 点击遮罩关闭弹窗
if (cardManageModal) {
  cardManageModal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });
}

// 创建分组
if (createGroupBtn) {
  createGroupBtn.addEventListener('click', function() {
    const name = newGroupName.value.trim();
    if (!name) { alert('请输入分组名称'); return; }
    if (store.groups[name]) { alert('分组已存在'); return; }
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

// 刷新分组下拉和总数量（并保持折叠状态）
function refreshGroupSelect() {
  const keys = Object.keys(store.groups);
  groupListWrap.innerHTML = '';
  currentGroupSelect.innerHTML = '';

  // 总数量
  let total = 0;
  keys.forEach(g => { total += store.groups[g].length; });
  const totalEl = document.getElementById('totalCardCount');
  if (totalEl) totalEl.textContent = total;

  if (keys.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '请先创建分组';
    currentGroupSelect.appendChild(opt);
    if (manageCardBtn) manageCardBtn.style.display = 'none';
    // 如果弹窗开着就关掉
    if (cardManageModal) cardManageModal.style.display = 'none';
    return;
  }
  if (manageCardBtn) manageCardBtn.style.display = 'block';

  keys.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `${g} (${store.groups[g].length}条)`;
    currentGroupSelect.appendChild(opt);
    const row = document.createElement('div');
    row.className = 'group-item-row';
    row.innerHTML = `<span>${g}</span><span class="del-group-btn" data-group="${g}">删除</span>`;
    row.querySelector('.del-group-btn').addEventListener('click', function() {
      const gName = this.dataset.group;
      if (confirm(`确定删除分组「${gName}」及其所有字卡吗？`)) {
        delete store.groups[gName];
        if (store.currentSelectGroup === gName) store.currentSelectGroup = Object.keys(store.groups)[0] || '';
        saveLocal();
        refreshGroupSelect();
        // 如果弹窗打开且删除的是当前分组，关闭弹窗
        if (cardManageModal && cardManageModal.style.display === 'flex') {
          cardManageModal.style.display = 'none';
        }
      }
    });
    groupListWrap.appendChild(row);
  });
  if (!keys.includes(store.currentSelectGroup)) store.currentSelectGroup = keys[0];
  currentGroupSelect.value = store.currentSelectGroup;
  currentGroupSelect.onchange = function() {
    store.currentSelectGroup = this.value;
    saveLocal();
    // 如果弹窗打开，刷新内容
    if (cardManageModal && cardManageModal.style.display === 'flex') {
      renderCardManageList();
    }
  };
}

// 添加单条字卡
if (addSingleCard) {
  addSingleCard.addEventListener('click', function() {
    const text = newCardInput.value.trim();
    const g = store.currentSelectGroup;
    if (!text) { alert('请输入字卡内容'); return; }
    if (!g || !store.groups[g]) { alert('请先选择或创建分组'); return; }

    const exists = store.groups[g].some(item => item.text === text);
    if (exists) {
      alert('该字卡在当前分组中已存在，不会重复添加。');
      newCardInput.value = '';
      return;
    }

    store.groups[g].push({ id: Date.now() + Math.random(), text, disabled: false });
    newCardInput.value = '';
    saveLocal();
    refreshGroupSelect();
    // 如果弹窗打开，刷新列表
    if (cardManageModal && cardManageModal.style.display === 'flex') {
      renderCardManageList();
    }
  });
}
if (newCardInput) {
  newCardInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addSingleCard.click();
  });
}

// 批量导入
if (batchImportBtn) {
  batchImportBtn.addEventListener('click', function() {
    const text = batchTextarea.value.trim();
    const g = store.currentSelectGroup;
    if (!text) { alert('请填入要导入的字卡'); return; }
    if (!g || !store.groups[g]) { alert('请先选择或创建分组'); return; }

    const arr = text.split('\n').map(s => s.trim()).filter(s => s);
    if (arr.length === 0) { alert('没有有效的字卡内容'); return; }

    const existingTexts = new Set(store.groups[g].map(item => item.text));
    let addedCount = 0;
    let duplicateCount = 0;

    arr.forEach(t => {
      if (existingTexts.has(t)) {
        duplicateCount++;
      } else {
        store.groups[g].push({ id: Date.now() + Math.random(), text: t, disabled: false });
        existingTexts.add(t);
        addedCount++;
      }
    });

    batchTextarea.value = '';
    saveLocal();
    refreshGroupSelect();
    // 如果弹窗打开，刷新列表
    if (cardManageModal && cardManageModal.style.display === 'flex') {
      renderCardManageList();
    }

    if (duplicateCount > 0) {
      alert(`导入完成！成功添加 ${addedCount} 条，跳过 ${duplicateCount} 条重复字卡。`);
    } else {
      alert(`成功添加 ${addedCount} 条字卡。`);
    }
  });
}
  // ===== 日历 =====
  function renderCalendar() {
    if (!calendarGrid) return;
    const now = new Date();
    const year = now.getFullYear(),
      month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarGrid.innerHTML = '';
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calendarGrid.appendChild(empty);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toISOString().slice(0, 10);
      const dayDiv = document.createElement('div');
      dayDiv.className = 'cal-day';
      dayDiv.innerHTML = `<div class="day-number">${d}</div>`;
      const data = store.calendar[dateStr] || {};
      const taEmoji = data.taEmoji || '';
      const meEmoji = data.meEmoji || '';
      const emojiGroup = document.createElement('div');
      emojiGroup.className = 'day-emoji-group';
      if (taEmoji && meEmoji) {
        const s1 = document.createElement('span');
        s1.className = 'emoji-single small';
        s1.textContent = taEmoji;
        const s2 = document.createElement('span');
        s2.className = 'emoji-single small';
        s2.textContent = meEmoji;
        emojiGroup.appendChild(s1);
        emojiGroup.appendChild(s2);
      } else if (taEmoji) {
        const s = document.createElement('span');
        s.className = 'emoji-single large';
        s.textContent = taEmoji;
        emojiGroup.appendChild(s);
      } else if (meEmoji) {
        const s = document.createElement('span');
        s.className = 'emoji-single large';
        s.textContent = meEmoji;
        emojiGroup.appendChild(s);
      }
      dayDiv.appendChild(emojiGroup);
      calendarGrid.appendChild(dayDiv);
    }
    const todayStr = now.toISOString().slice(0, 10);
    const todayData = store.calendar[todayStr] || {};
    calTaText.innerText = todayData.taText || 'TA今天还没有记录哦～';
    calMeText.innerText = todayData.meText || '今天有什么想说的。';
  }

  if (openMoodModal) {
    openMoodModal.addEventListener('click', function(e) {
      e.stopPropagation();
      const now = new Date();
      currentDateStr = now.toISOString().slice(0, 10);
      const data = store.calendar[currentDateStr] || {};
      selectedMoodEmoji = data.meEmoji || null;
      moodTextInput.value = data.meText || '';
      renderMoodEmojis();
      moodModal.style.display = 'flex';
    });
  }

  function renderMoodEmojis() {
    const emojis = ['😭', '🥺', '🥰', '🥹', '😆', '😎', '🥳', '😖', '😫', '😴', '☺️', '😡', '😳', '😶‍🌫️', '🔞', '😨'];
    moodEmojiGrid.innerHTML = '';
    emojis.forEach(emo => {
      const span = document.createElement('span');
      span.textContent = emo;
      if (selectedMoodEmoji === emo) span.classList.add('selected');
      span.addEventListener('click', function() {
        selectedMoodEmoji = emo;
        renderMoodEmojis();
      });
      moodEmojiGrid.appendChild(span);
    });
  }

  if (closeMoodModal) {
    closeMoodModal.addEventListener('click', function() {
      moodModal.style.display = 'none';
      selectedMoodEmoji = null;
    });
  }
  if (saveMoodModal) {
    saveMoodModal.addEventListener('click', function() {
      const dateStr = currentDateStr;
      if (!dateStr) return;
      const text = moodTextInput.value.trim();
      const data = store.calendar[dateStr] || {};
      data.meEmoji = selectedMoodEmoji || data.meEmoji;
      data.meText = text || data.meText;
      if (!data.taEmoji) {
        const taEmojis = ['😊', '😌', '😄', '🤗', '😏', '😜', '🤔', '😴', '🥱'];
        data.taEmoji = taEmojis[randomInt(0, taEmojis.length - 1)];
      }
      if (!data.taText) {
        const cards = getAllValidCards();
        if (cards.length > 0) {
          const count = Math.min(randomInt(1, 3), cards.length);
          const shuffled = [...cards].sort(() => Math.random() - 0.5);
          data.taText = shuffled.slice(0, count).map(c => c.text).join(' ');
        } else {
          data.taText = '今天没有什么想说的～';
        }
      }
      store.calendar[dateStr] = data;
      saveLocal();
      renderCalendar();
      openMoodModal.textContent = '修改';
      moodModal.style.display = 'none';
      selectedMoodEmoji = null;
    });
  }

  // ===== 导入导出 =====
  function showImportConfirm(title, msg, callback) {
    importConfirmTitle.innerText = title;
    importConfirmMsg.innerText = msg;
    importConfirmMask.style.display = 'flex';
    importCallback = callback;
  }
  if (importCancelBtn) {
    importCancelBtn.addEventListener('click', function() {
      importConfirmMask.style.display = 'none';
      importCallback = null;
    });
  }
  if (importConfirmBtn) {
    importConfirmBtn.addEventListener('click', function() {
      importConfirmMask.style.display = 'none';
      if (importCallback) {
        const cb = importCallback;
        importCallback = null;
        cb();
      }
    });
  }

  // 导出聊天记录
  if (exportChatBtn) {
    exportChatBtn.addEventListener('click', function() {
      const data = { messages: store.messages };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat_history_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  // 导入聊天记录
  if (importChatBtn) {
    importChatBtn.addEventListener('click', function() {
      showImportConfirm('导入聊天记录', '导入将覆盖当前所有聊天消息，是否继续？', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function(ev) {
            try {
              const data = JSON.parse(ev.target.result);
              if (data.messages) {
                store.messages = data.messages;
                saveLocal();
                renderMessages();
                alert('聊天记录导入成功！');
              } else { alert('无效的数据文件'); }
            } catch (err) { alert('解析失败：' + err.message); }
          };
          reader.readAsText(file);
        };
        input.click();
      });
    });
  }

  // 导出字卡
  if (exportCardsBtn) {
    exportCardsBtn.addEventListener('click', function() {
      const data = { groups: store.groups };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cards_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  // 导入字卡
  if (importCardsBtn) {
    importCardsBtn.addEventListener('click', function() {
      showImportConfirm('导入字卡', '导入将覆盖当前所有字卡分组及内容，是否继续？', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function(ev) {
            try {
              const data = JSON.parse(ev.target.result);
              if (data.groups) {
                store.groups = data.groups;
                const keys = Object.keys(store.groups);
                if (keys.length > 0) store.currentSelectGroup = keys[0];
                else store.currentSelectGroup = '';
                saveLocal();
                refreshGroupSelect();
                alert('字卡导入成功！');
              } else { alert('无效的数据文件'); }
            } catch (err) { alert('解析失败：' + err.message); }
          };
          reader.readAsText(file);
        };
        input.click();
      });
    });
  }

  // 导出全部数据
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', function() {
      const data = { store: store };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `full_data_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  // 导入全部数据
  if (importDataBtn) {
    importDataBtn.addEventListener('click', function() {
      showImportConfirm('导入全部数据', '导入将覆盖所有当前数据，是否继续？', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function(ev) {
            try {
              const data = JSON.parse(ev.target.result);
              if (data.store) {
                store = data.store;
                saveLocal();
                renderHeaderAvatar();
                refreshAllIconPreview();
                applyBgStyle();
                refreshGroupSelect();
                renderEmojiGrid();
                renderInbox();
                renderMessages();
                updateAnimToggleUI();
                renderCalendar();
                applyVideoBg();
                renderMail();
                coverImage.src = store.profile.cover || '';
                avatarImage.src = store.profile.avatar || '';
                profileName.innerText = store.profile.name || 'TATA';
                locationText.innerText = store.profile.location || '爱尔兰';
                locationIcon.src = store.profile.locationIcon || 'https://i.ibb.co/pjyVcqxM/position.png';
                profileSignature.innerText = store.profile.signature || '浅尝辄止 是命运轻轻放过了我';
                decoImg.src = store.decoImage || '';
                const style = store.chatSettings.avatarStyle || 'circle';
                styleOptions.forEach(o => { o.classList.toggle('active', o.dataset.style === style); });
                alert('数据导入成功！');
              } else { alert('无效的数据文件'); }
            } catch (err) { alert('解析失败：' + err.message); }
          };
          reader.readAsText(file);
        };
        input.click();
      });
    });
  }

  // ===== 存储 =====
  function loadLocal() {
    try {
      const raw = localStorage.getItem('dreamCardStore');
      if (raw) {
        const parsed = JSON.parse(raw);
        store = deepMerge(store, parsed);
      }
    } catch (e) { console.warn('Load local error', e); }
    if (!store.messages) store.messages = [];
    if (!store.calendar) store.calendar = {};
    if (!store.appIcon) store.appIcon = {};
    if (!store.chatSettings) store.chatSettings = { patSuffix: '拍了拍', videoBg: '', avatarStyle: 'circle' };
    if (!store.profile) store.profile = { cover: '', avatar: '', name: 'TATA', location: '爱尔兰', locationIcon: 'https://i.ibb.co/pjyVcqxM/position.png', signature: '浅尝辄止 是命运轻轻放过了我' };
    if (!store.groups) store.groups = {};
    if (!store.letters) store.letters = [];
    if (!store.inbox) store.inbox = [];
    if (!store.emojiList) store.emojiList = [];
    if (!store.appliedFont) store.appliedFont = '';
    if (store.rippleEnabled === undefined) store.rippleEnabled = true;

    renderHeaderAvatar();
    refreshAllIconPreview();
    if (wallpaperPreview) wallpaperPreview.src = store.wallpaper || '';
    if (chatBgPreview) chatBgPreview.src = store.chatBg || '';
    applyBgStyle();
    applyVideoBg();
    refreshGroupSelect();
    renderEmojiGrid();
    renderInbox();
    renderMessages();
    updateAnimToggleUI();
    scheduleLetterReplies();
    renderCalendar();
    renderMail();
    coverImage.src = store.profile.cover || '';
    avatarImage.src = store.profile.avatar || '';
    profileName.innerText = store.profile.name || 'TATA';
    locationText.innerText = store.profile.location || '爱尔兰';
    locationIcon.src = store.profile.locationIcon || 'https://i.ibb.co/pjyVcqxM/position.png';
    profileSignature.innerText = store.profile.signature || '浅尝辄止 是命运轻轻放过了我';
    decoImg.src = store.decoImage || '';
    if (placeholderIcon) placeholderIcon.src = store.appIcon.placeholder || '';
    const style = store.chatSettings.avatarStyle || 'circle';
    styleOptions.forEach(o => { o.classList.toggle('active', o.dataset.style === style); });

    if (rippleToggle) {
      if (store.rippleEnabled !== undefined) particleEnabled = store.rippleEnabled;
      if (particleEnabled) {
        rippleToggle.classList.add('active');
        if (!particleCanvas) initParticleCanvas();
        else particleCanvas.style.display = 'block';
      } else {
        rippleToggle.classList.remove('active');
        if (particleCanvas) particleCanvas.style.display = 'none';
      }
    }
    if (openMoodModal) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const hasRecord = store.calendar[todayStr] && (store.calendar[todayStr].meEmoji || store.calendar[todayStr].meText);
      openMoodModal.textContent = hasRecord ? '修改' : '记录心情';
    }
    if (delayRange) {
      const min = store.delay.min || 20;
      delayRange.value = min;
      delayRangeValue.textContent = min + '秒';
    }
  }

  function saveLocal() {
    try {
      localStorage.setItem('dreamCardStore', JSON.stringify(store));
    } catch (e) { console.warn('Save local error', e); }
  }

  window.addEventListener('beforeunload', function() {
    saveLocal();
  });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  }, { passive: false });
  document.querySelectorAll('input, textarea').forEach(el => el.style.fontSize = '16px');

  loadLocal();
  applyBgStyle();
  applyVideoBg();
  if (document.querySelector('.chat-page.active') && chatWrap) setTimeout(() => chatWrap.scrollTop = chatWrap.scrollHeight, 100);
  console.log('✅ 梦角字卡传讯已启动 | 动画:', store.animEnabled ? '开启' : '关闭');
});
