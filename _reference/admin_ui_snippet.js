setAdminUI(on) {
    chatAdmin = !!on;
    pan.classList.toggle('admin', chatAdmin);
    $('chstat').textContent = chatAdmin ? 'à¹à¸«à¸¡à¸à¹à¸­à¸à¸¡à¸´à¸ Â· à¸à¸­à¸à¹à¸à¸à¹à¸à¹' : 'à¸à¸­à¸à¸à¸¥à¸±à¸à¹à¸¡à¸·à¹à¸­à¸§à¹à¸²à¸à¸à¹à¸°';
    adminCid = '';
    if (chatAdmin) drawInbox(); else if (nm && cid) drawChat(); else drawName();
  }

  async function tryAdminLogin() {
    if (chatAdmin) { setAdminUI(false); return; }
    const pw = prompt('à¹à¸ªà¹à¸£à¸«à¸±à¸ªà¸«à¸¥à¸±à¸à¸à¹à¸²à¸à¹à¸à¸·à¹à¸­à¸à¸­à¸à¹à¸à¸à¹à¸à¸à¸²à¸à¸°à¹à¸­à¸à¸¡à¸´à¸');
    if (pw == null) return;
    if (!pw.trim()) return;
    let ok = false;
    try { ok = await adminLogin(pw.trim()); } catch {}
    if (ok) setAdminUI(true);
    else alert('à¸£à¸«à¸±à¸ªà¹à¸¡à¹à¸à¸¹à¸à¸à¹à¸­à¸ à¸«à¸£à¸·à¸­à¹à¸à¸·à¹à¸­à¸¡à¸à¹à¸­à¸£à¸°à¸à¸à¹à¸¡à¹à¹à¸à¹');
  }

  function toggleFull() {
    chatFull = !chatFull;
    pan.classList.toggle('full', chatFull);
    $('chfs').title = chatFull ? 'à¸¢à¹à¸­à¸«à¸à¹à¸²à¸à¹à¸²à¸' : 'à¸à¸¢à¸²à¸¢à¹à¸à¹à¸¡à¸à¸­';
  }

  function openChat() {
    isOpen = true;
    $('cht').textContent = adminName();
    if (D.avatar) { $('cha').style.backgroundImage = `url(${D.avatar})`; $('cha').textContent = ''; }
    else { $('cha').style.backgroundImage = ''; $('cha').textContent = adminName().slice(0, 1); }
    pan.hidden = false;
    $('chd').hidden = true;
    lastT = Date.now();
    if (chatAdmin) (adminCid ? drawChat() : drawInbox()); else (nm && cid) ? drawChat() : drawName();
    clearInterval(timer);
    timer = setInterval(() => { if (!document.hidden) refresh(); }, 4000);
  }
  function closeChat() {
    isOpen = false;
    pan.hidden = true;
    pan.classList.remove('full');
    chatFull = false;
    clearInterval(timer);
    timer = setInterval(peek, 20000);
  }

  window.chatAuthChanged = async () => {
    const u = getUser();
    if (u) {
      const old = cid; cid = 'u_' + u; nm = acc.nm || u; LS.set('lb_cid', cid); LS.set('lb_cn', nm);
      if (old && old !== cid && !/^u_/.test(old)) { try { const d = await db('lch/' + old); if (d) await db('lch/' + cid, d, 'PATCH'); await db('lch/' + old, null, 'DELETE'); } catch {} }
    } else { cid = ''; nm = ''; LS.set('lb_cid', ''); LS.set('lb_cn', ''); loc = []; }
    sig = '';
    if (isOpen && !chatAdmin) { (nm && cid) ? drawChat() : drawName(); } else peek();
  };
  fab.onclick = openChat;
  $('chx').onclick = closeChat;
  $('chfs').onclick = toggleFull;
  $('cha').onclick = tryAdminLogin;
  addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeChat(); });
  timer = setInterval(peek, 20000);
  setTimeout(peek, 2500);
})();

/* à¸£à¸´à¸à¹à¸à¸´à¸¥à¸§à¸à¹à¸ªà¸à¸à¸£à¸à¸à¸¸à¸à¸à¸µà¹à¸à¸à¸à¸¸à¹à¸¡ */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest && e.target.closest('.pkg,.cta,.btn2,.qbtn,.copy,.mu,.drop,.cartb,.chf');
  if (!b || b.disabled) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, d = document.createElement('i');
  d.className = 'rip'; d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(d); setTimeout(() => d.remove(), 780);
});



/* ===== à¹à¸à¸¥à¸: à¹à¸à¸°à¸à¸£à¸à¹à¸«à¸à¸à¹à¹à¸à¹à¹à¸à¸·à¹à¸­à¹à¸£à¸´à¹à¸¡à¹à¸¥à¹à¸ (à¹à¸à¸¥à¸¢à¹à¸¥à¸´à¸ªà¸à¹ song1-5.mp3 à¹à¸¥à¹à¸à¸§à¸à¸à¹à¸­à¹à¸à¸·à¹à¸­à¸) ===== */
(() => {
  const SONGS = ['song1.mp3', 'song2.mp3', 'song3.mp3', 'song4.mp3', 'song5.mp3']; // à¹à¸à¸´à¹à¸¡/à¸¥à¸à¸à¸·à¹à¸­à¹à¸à¸¥à¹à¸à¸£à¸à¸à¸µà¹à¹à¸à¹
  const a = $('bgm'), m = $('mu'), EV = ['pointerdown', 'touchend', 'click', 'keydown'];
  let i = 0, bad = 0;
  a.volume = .6; a.src = SONGS[0];
  const go = () => a.play().then(() => { bad = 0; m.classList.remove('off'); EV.forEach(e => document.removeEventListener(e, first, true)); }).catch(() => {});
  const next = () => { if (++bad > SONGS.length) return; i = (i + 1) % SONGS.length; a.src = SONGS[i]; a.play().catch(() => {}); };
  a.addEventListener('ended', () => { bad = 0; next(); bad = 0; });
  a.addEventListener('error', next); // à¹à¸à¸¥à¹à¹à¸«à¸à¹à¸¡à¹à¸¡à¸µ à¸à¹à¸²à¸¡à¹à¸à¹à¸à¸¥à¸à¸à¸±à¸à¹à¸
  function first(e){ if (e.target.closest && e.target.closest('#mu')) return; go(); }
  EV.forEach(e => document.addEventListener(e, first, true));
  m.onclick = () => { if (a.paused) go(); else { a.pause(); m.classList.add('off'); } };
  go();
})();

const legacy = t => { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); };
const cp = t => navigator.clipboard ? navigator.clipboard.writeText(t).catch(() => legacy(t)) : legacy(t);
const billTxt = r => ['ð§¾ à¸à¸´à¸¥ ' + r.id, 'à¸à¸´à¸§à¸à¸µà¹ ' + (r.no || '-'), 'à¸à¸·à¹à¸­: ' + r.name, 'à¸§à¸±à¸à¹à¸à¸´à¸: ' + thB(r.bd) + (r.bt ? ' à¹à¸§à¸¥à¸² ' + r.bt :