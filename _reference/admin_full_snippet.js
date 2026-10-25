=> openR();

/* ===== à¸«à¸¥à¸±à¸à¸à¹à¸²à¸ (à¸à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¹à¸²à¸¢à¹à¸§à¹à¸ à¸«à¸£à¸·à¸­à¹à¸à¸´à¸¡ #admin à¸à¹à¸²à¸¢à¸¥à¸´à¸à¸à¹) ===== */
function krow(c = {}){
  const d = document.createElement('div'); d.className = 'crow krow'; d.dataset.id = c.id || '';
  d.innerHTML = `<input type="text" placeholder="à¸à¸µà¸¢à¹à¹à¸§à¸´à¸£à¹à¸ à¸à¸±à¹à¸à¸à¹à¸§à¸¢ , à¹à¸à¹à¸ à¸£à¸²à¸à¸², à¹à¸à¹à¸²à¹à¸£, à¸à¸µà¹à¸à¸²à¸" value="${esc(c.k)}"><input type="text" placeholder="à¸à¸·à¹à¸­à¸à¸¸à¹à¸¡à¸¥à¸±à¸à¹à¸à¹à¸à¸ (à¹à¸¡à¹à¸à¸±à¸à¸à¸±à¸)" maxlength="40" value="${esc(c.b)}"><textarea class="ag" rows="2" placeholder="à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸µà¹à¹à¸«à¹à¸£à¸°à¸à¸à¸à¸­à¸à¸à¸¥à¸±à¸">${esc(c.tx)}</textarea><button type="button" class="btn2">à¸¥à¸à¸à¹à¸­à¸à¸µà¹</button>`;
  d.querySelector('button').onclick = () => d.remove(); return d;
}
function closeAdmin(){ $('adm').hidden = true; document.body.style.overflow = ''; }
async function openAdm(){
  const pw = prompt('à¹à¸ªà¹à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¸«à¸¥à¸±à¸à¸à¹à¸²à¸');
  if (pw == null) return;
  if (!pw.trim()) { alert('à¸à¸£à¸¸à¸à¸²à¹à¸ªà¹à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸'); return; }
  let ok = false;
  try { ok = await adminLogin(pw.trim()); } catch (e) { ok = false; }
  if (!ok) { alert('à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¹à¸¡à¹à¸à¸¹à¸à¸à¹à¸­à¸ à¸«à¸£à¸·à¸­à¹à¸à¸·à¹à¸­à¸¡à¸à¹à¸­à¸£à¸°à¸à¸à¹à¸¡à¹à¹à¸à¹'); return; }
  LSs('lb_adm_pw', '');
  showEdit(); $('adm').hidden = false; document.body.style.overflow = 'hidden';
}
function cgrow(c = {}){
  const d = document.createElement('div'); d.className = 'cgrow';
  d.innerHTML = `<label>à¸à¸·à¹à¸­à¸«à¸¡à¸§à¸à¸«à¸¡à¸¹à¹</label><input type="text" class="cgn" placeholder="à¹à¸à¹à¸ à¸à¸³à¸à¸²à¸¡, à¸à¸¹à¸à¸§à¸à¸£à¸²à¸¢à¹à¸à¸·à¸­à¸" maxlength="80" value="${esc(c.name)}"><label>à¸à¸³à¸­à¸à¸´à¸à¸²à¸¢à¸«à¸¡à¸§à¸ (à¸à¹à¸²à¸¡à¸µ)</label><textarea class="ag cgdesc" rows="1" placeholder="à¹à¸ªà¸à¸à¹à¸à¹à¸à¸·à¹à¸­à¸«à¸¡à¸§à¸">${esc(c.desc)}</textarea><p class="cgl">à¹à¸à¹à¸à¹à¸à¸à¹à¸à¸«à¸¡à¸§à¸à¸à¸µà¹</p><div class="cgp"></div><button type="button" class="btn2 cga" style="width:100%">+ à¹à¸à¸´à¹à¸¡à¹à¸à¹à¸à¹à¸à¸à¹à¸à¸«à¸¡à¸§à¸à¸à¸µà¹</button><div class="qa cgq"><button type="button" class="btn2 cgu" aria-label="à¹à¸¥à¸·à¹à¸­à¸à¸«à¸¡à¸§à¸à¸à¸¶à¹à¸">â</button><button type="button" class="btn2 cgv" aria-label="à¹à¸¥à¸·à¹à¸­à¸à¸«à¸¡à¸§à¸à¸¥à¸">â</button><button type="button" class="btn2 cgx">à¸¥à¸à¸«à¸¡à¸§à¸à¸«à¸¡à¸¹à¹à¸à¸µà¹</button></div>`;
  const box = d.querySelector('.cgp');
  (c.packages || []).forEach(p => box.appendChild(prow(p)));
  d.querySelector('.cga').onclick = () => { const r = prow(); box.appendChild(r); r.querySelector('input').focus(); };
  d.querySelector('.cgu').onclick = () => { const x = d.previousElementSibling; if (x) d.parentNode.insertBefore(d, x); };
  d.querySelector('.cgv').onclick = () => { const x = d.nextElementSibling; if (x) d.parentNode.insertBefore(x, d); };
  d.querySelector('.cgx').onclick = () => { if (!box.querySelector('.prow') || confirm('à¸¥à¸à¸«à¸¡à¸§à¸à¸«à¸¡à¸¹à¹à¸à¸µà¹à¸à¸£à¹à¸­à¸¡à¹à¸à¹à¸à¹à¸à¸à¸à¹à¸²à¸à¹à¸à¸à¸±à¹à¸à¸«à¸¡à¸?')) d.remove(); };
  return d;
}
function prow(p = {}){
  const d = document.createElement('div'); d.className = 'prow';
  d.innerHTML = `<input type="text" placeholder="à¸à¸·à¹à¸­à¹à¸à¹à¸à¹à¸à¸" value="${esc(p.name)}"><input type="number" min="1" step="0.01" placeholder="à¸£à¸²à¸à¸²" value="${esc(p.price)}"><textarea class="ag" rows="1" placeholder="à¸£à¸²à¸¢à¸¥à¸°à¹à¸­à¸µà¸¢à¸">${esc(p.desc)}</textarea><button type="button" class="btn2">à¸¥à¸à¹à¸à¹à¸à¹à¸à¸à¸à¸µà¹</button>`;
  d.querySelector('button').onclick = () => d.remove();
  return d;
}
const shrink = (file, w, h, q) => new Promise((ok, no) => {
  const im = new Image();
  im.onload = () => {
    const r = w / h; let sw = im.width, sh = im.height, sx = 0, sy = 0;
    if (sw / sh > r) { const n = sh * r; sx = (sw - n) / 2; sw = n; } else { const n = sw / r; sy = (sh - n) / 2; sh = n; }
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.fillStyle = '#1a0e08'; g.fillRect(0, 0, w, h); g.drawImage(im, sx, sy, sw, sh, 0, 0, w, h);
    URL.revokeObjectURL(im.src); ok(c.toDataURL('image/jpeg', q));
  };
  im.onerror = no; im.src = URL.createObjectURL(file);
});
const imgField = (k, l, rd) => `<h4>${l}</h4><div class="ipv${rd ? ' rd' : ''}" id="pv_${k}"></div><input type="hidden" data-k="${k}" value=""><input type="file" accept="image/*" data-up="${k}"><input type="text" placeholder="à¸«à¸£à¸·à¸­à¸§à¸²à¸à¸¥à¸´à¸à¸à¹à¸£à¸¹à¸ https://..." data-url="${k}" value="${/^https?:/.test(D[k] || '') ? esc(D[k]) : ''}"><button type="button" class="btn2" data-clr="${k}">à¸¥à¸à¸£à¸¹à¸</button>`;
function wireImg(){
  const cfg = { banner: [900, 300, .72], avatar: [256, 256, .8] };
  const q = a => document.querySelector(a);
  Object.keys(cfg).forEach(k => {
    const set = v => { q(`#adm [data-k="${k}"]`).value = v; $('pv_' + k).style.backgroundImage = v ? `url("${v.replace(/"/g, '%22')}")` : ''; };
    set(D[k] || '');
    q(`[data-up="${k}"]`).onchange = async e => { const f = e.target.files[0]; if (!f) return;
      try { set(await shrink(f, ...cfg[k])); q(`[data-url="${k}"]`).value = ''; } catch { $('am').textContent = 'à¸­à¹à¸²à¸à¸£à¸¹à¸à¹à¸¡à¹à¹à¸à¹ à¸¥à¸­à¸à¹à¸à¸¥à¹à¸­à¸·à¹à¸à¸à¸°à¸à¸°'; } };
    q(`[data-url="${k}"]`).oninput = e => set(e.target.value.trim());
    q(`[data-clr="${k}"]`).onclick = () => { set(''); q(`[data-url="${k}"]`).value = ''; };
  });
}
function crow(c = {}){
  const d = document.createElement('div'); d.className = 'crow';
  d.innerHTML = `<input type="text" placeholder="à¸à¸·à¹à¸­à¸à¸¸à¹à¸¡ à¹à¸à¹à¸ LINE" value="${esc(c.label)}"><input type="text" placeholder="à¸¥à¸´à¸à¸à¹ à¹à¸à¹à¸ https://line.me/ti/p/~id" value="${esc(c.url)}"><button type="button" class="btn2">à¸¥à¸à¸à¸­à¸à¹à¸à¸à¸à¸µà¹</button>`;
  d.querySelector('button').onclick = () => d.remove(); return d;
}
if (!document.getElementById('styl')) { const dl = document.createElement('datalist'); dl.id = 'styl'; dl.innerHTML = STY.map(t => `<option value="${esc(t)}">`).join(''); document.body.appendChild(dl); }
function srow(c = {}){
  const d = document.createElement('div'); d.className = 'srow';
  d.innerHTML = `<input type="text" list="styl" placeholder="à¸à¸·à¹à¸­à¹à¸­à¸ à¹à¸à¹à¸ LINE" value="${esc(c.type)}" maxlength="30"><input type="text" placeholder="à¸à¸·à¹à¸­à¸à¸µà¹à¹à¸ªà¸à¸ à¹à¸à¹à¸ @lilibet" value="${esc(c.name)}" maxlength="60"><input type="text" placeholder="à¸¥à¸´à¸à¸à¹ à¹à¸à¹à¸ https://line.me/ti/p/~id (à¹à¸à¸£/à¸­à¸µà¹à¸¡à¸¥à¹à¸ªà¹à¹à¸à¸­à¸£à¹/à¸­à¸µà¹à¸¡à¸¥à¹à¸à¹à¹à¸¥à¸¢)" value="${esc(c.url)}"><button type="button" class="btn2">à¸¥à¸à¸à¹à¸­à¸à¸à¸²à¸à¸à¸µà¹</button>`;
  d.querySelector('button').onclick = () => d.remove(); return d;
}
function qrow(r){
  const d = document.createElement('div'); d.className = 'qrow';
  d.innerHTML = `<b>#${esc(r.no || '-')} Â· ${esc(r.name)}</b><small>${esc(r.id)} Â· ${esc(new Date(r.t).toLocaleString('th-TH'))}${r.u ? ' Â· à¸¢à¸¹à¸ª @' + esc(r.u) : ''}</small>
  <p>${(r.cs || []).map(c => esc(c[0] + ': ' + c[1])).join(' / ')}</p><p>${esc(r.pkg)} ${esc(baht(r.price))}${r.q ? ' Â· ' + esc(r.q) : ''}</p>
  <p>à¹à¸à¸´à¸ ${esc(thB(r.bd))}${r.bt ? ' ' + esc(r.bt) : ''} Â· à¸£à¸²à¸¨à¸µ ${esc(r.zd)}${r.man ? ' Â· à¹à¸à¸´à¹à¸¡à¹à¸­à¸' : ` Â· <a href="#slip=${encodeURIComponent(r.id)}" target="_blank" rel="noopener">à¸à¸¹à¸ªà¸¥à¸´à¸</a>`}</p>
  <input type="text" list="stl" value="${esc(r.st)}" placeholder="à¸ªà¸à¸²à¸à¸°"><div class="qa"><button type="button" class="btn2">à¸à¸±à¸à¸à¸¶à¸à¸ªà¸à¸²à¸à¸°</button><button type="button" class="btn2">à¸¥à¸à¸à¸´à¸§</button><button type="button" class="btn2">+1 à¹à¸à¹à¸¡</button></div>`;
  const [sv, rm, pt1] = d.querySelectorAll('button'), i = d.querySelector('input');
  sv.onclick = async () => { sv.textContent = '...'; try { await Promise.all(['lq', 'lpub'].map(k => db(k + '/' + r.id + '/st', i.value.trim()))); sv.textContent = 'à¸à¸±à¸à¸à¸¶à¸à¹à¸¥à¹à¸§ â'; } catch { sv.textContent = 'à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸'; } setTimeout(() => sv.textContent = 'à¸à¸±à¸à¸à¸¶à¸à¸ªà¸à¸²à¸à¸°', 1600); };
  if (r.pt || !r.u) { pt1.disabled = true; pt1.textContent = r.pt ? 'à¹à¸«à¹à¹à¸à¹à¸¡à¹à¸¥à¹à¸§' : 'à¹à¸¡à¹à¸¡à¸µà¸¢à¸¹à¸ª'; }
  pt1.onclick = async () => { pt1.disabled = true; pt1.textContent = '...'; try { const k = 'lu/' + encodeURIComponent(r.u); const n = (+(await db(k + '/pts'))) || 0; await db(k + '/pts', n + 1); await db('lq/' + r.id + '/pt', 1); pt1.textContent = 'à¹à¸«à¹à¹à¸à¹à¸¡à¹à¸¥à¹à¸§ â'; } catch { pt1.disabled = false; pt1.textContent = 'à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸'; } };
  rm.onc