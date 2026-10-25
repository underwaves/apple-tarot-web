function showEdit(){
  const fld = (k, l, a) => `<label>${l}</label>` + (a ? `<textarea data-k="${k}" rows="2">${esc(D[k])}</textarea>` : `<textarea class="ag" rows="1" data-k="${k}">${esc(D[k])}</textarea>`);
  let h = '<div><h3>à¸«à¸¥à¸±à¸à¸à¹à¸²à¸</h3><p class="sub" style="margin:0">à¹à¸à¹à¹à¸¥à¹à¸§à¸à¸à¸à¸±à¸à¸à¸¶à¸ à¸«à¸à¹à¸²à¹à¸§à¹à¸à¸à¸°à¸­à¸±à¸à¹à¸à¸à¸à¸±à¸à¸à¸µ</p>';
  h += '<h4>à¸à¸´à¸§à¸¥à¸¹à¸à¸à¹à¸²</h4><button type="button" class="btn2" id="aq" style="margin-bottom:12px">+ à¹à¸à¸´à¹à¸¡à¸à¸´à¸§à¹à¸­à¸</button><div id="mqw"></div><div id="qs"></div><button type="button" class="btn2" id="rq">à¸£à¸µà¹à¸à¸£à¸à¸à¸´à¸§</button><h4>à¸£à¸µà¸§à¸´à¸§à¸¥à¸¹à¸à¸à¹à¸²</h4><div id="rvs"></div><button type="button" class="btn2" id="rrv">à¸£à¸µà¹à¸à¸£à¸à¸£à¸µà¸§à¸´à¸§</button>';
  h += imgField('banner', 'à¹à¸à¸à¹à¸à¸­à¸£à¹ ') + imgField('avatar', 'à¹à¸à¸£à¹à¸à¸¥à¹', 1);
  FIELDS.forEach(([t, fs]) => h += `<h4>${t}</h4>` + fs.map(x => fld(...x)).join(''));
  h += '<h4>à¸«à¸¡à¸§à¸à¸«à¸¡à¸¹à¹à¹à¸¥à¸°à¹à¸à¹à¸à¹à¸à¸</h4><p class="sub" style="margin:-4px 0 14px;font-size:12.5px">à¹à¸à¹à¸¥à¸°à¸«à¸¡à¸§à¸à¸¡à¸µà¹à¸à¹à¸à¹à¸à¸à¸à¸­à¸à¸à¸±à¸§à¹à¸­à¸ à¸«à¸¡à¸§à¸à¸à¸µà¹à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¹à¸à¹à¸à¹à¸à¸à¸à¸°à¹à¸¡à¹à¹à¸ªà¸à¸à¸«à¸à¹à¸²à¹à¸§à¹à¸</p><div id="cgs"></div><button type="button" class="btn2" id="addg">+ à¹à¸à¸´à¹à¸¡à¸«à¸¡à¸§à¸à¸«à¸¡à¸¹à¹</button>' +
    '<h4>à¸à¸­à¸à¸à¸¥à¸±à¸à¹à¸à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´ (à¸à¸µà¸¢à¹à¹à¸§à¸´à¸£à¹à¸)</h4><p class="sub" style="margin:-4px 0 14px;font-size:12.5px">à¸¥à¸¹à¸à¸à¹à¸²à¸à¸´à¸¡à¸à¹à¸à¸³à¸à¸µà¹à¸à¸£à¸à¸à¸±à¸à¸à¸µà¸¢à¹à¹à¸§à¸´à¸£à¹à¸ à¸£à¸°à¸à¸à¸à¸°à¸à¸­à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸µà¹à¸à¸±à¹à¸à¹à¸§à¹à¸à¸±à¸à¸à¸µ à¸à¹à¸²à¹à¸ªà¹à¸à¸·à¹à¸­à¸à¸¸à¹à¸¡ à¸à¸°à¸¡à¸µà¸à¸¸à¹à¸¡à¸¥à¸±à¸à¹à¸«à¹à¸¥à¸¹à¸à¸à¹à¸²à¸à¸à¹à¸à¹à¸à¸à¸à¹à¸§à¸¢</p><div id="kws"></div><button type="button" class="btn2" id="addk">+ à¹à¸à¸´à¹à¸¡à¸à¸³à¸à¸­à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´</button>' +
    '<h4>à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­ (à¸à¸¸à¹à¸¡à¸à¸´à¸à¸à¹à¸­à¸«à¸à¹à¸²à¹à¸§à¹à¸)</h4><div id="sos"></div><button type="button" class="btn2" id="adds">+ à¹à¸à¸´à¹à¸¡à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­</button>' +
    '<h4>à¸à¸­à¸à¹à¸à¸à¸£à¹à¸²à¸ (à¸à¸¸à¹à¸¡à¸ªà¹à¸à¸à¸´à¸¥à¹à¸«à¹à¸¥à¸¹à¸à¸à¹à¸²)</h4><div id="cts"></div><button type="button" class="btn2" id="addc">+ à¹à¸à¸´à¹à¸¡à¸à¸­à¸à¹à¸à¸</button>' +
    '<button type="button" class="cta" id="sv">à¸à¸±à¸à¸à¸¶à¸</button><p class="msg" id="am"></p><button type="button" class="btn2" id="cl" style="width:100%">à¸à¸´à¸à¸«à¸¥à¸±à¸à¸à¹à¸²à¸</button></div>';
  $('adm').innerHTML = h; wireImg();
  D.categories.forEach(c => $('cgs').appendChild(cgrow(c)));
  (D.contacts || []).forEach(c => $('cts').appendChild(crow(c)));
  $('addc').onclick = () => $('cts').appendChild(crow());
  (Array.isArray(D.chKw) ? D.chKw : []).forEach(c => $('kws').appendChild(krow(c))); $('addk').onclick = () => { const r = krow(); $('kws').appendChild(r); r.querySelector('input').focus(); };
  (D.socials || []).forEach(c => $('sos').appendChild(srow(c))); $('adds').onclick = () => $('sos').appendChild(srow());
  document.querySelectorAll('#adm textarea.ag').forEach(grow); $('rq').onclick = loadQ; $('aq').onclick = openMq; loadQ(); $('rrv').onclick = loadRv; loadRv();
  $('addg').onclick = () => { const g = cgrow({ name: '', desc: '', packages: [{}] }); $('cgs').appendChild(g); g.querySelector('.cgn').focus(); };
  $('cl').onclick = closeAdmin;
  $('sv').onclick = async () => {
    const nd = {...D};
    document.querySelectorAll('#adm [data-k]').forEach(e => nd[e.dataset.k] = e.value);
    nd.categories = [...document.querySelectorAll('#cgs .cgrow')].map(g => ({
      name: g.querySelector('.cgn').value.trim(), desc: g.querySelector('.cgdesc').value.trim(),
      packages: [...g.querySelectorAll('.prow')].map(r => { const i = r.querySelectorAll('input'); return { name: i[0].value.trim(), price: parseFloat(i[1].value), desc: r.querySelector('textarea').value.trim() }; }).filter(p => p.name && p.price > 0)
    })).filter(c => c.name || c.packages.length).map(c => ({ ...c, name: c.name || 'à¹à¸à¹à¸à¹à¸à¸' }));
    delete nd.packages;
    nd.chKw = [...document.querySelectorAll('.krow')].map(r => { const i = r.querySelectorAll('input'); return { id: r.dataset.id || ('k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)), k: i[0].value.trim(), b: i[1].value.trim(), tx: r.querySelector('textarea').value.trim(), im: 0 }; }).filter(c => (c.k || c.b) && c.tx);
    nd.contacts = [...document.querySelectorAll('.crow:not(.krow)')].map(r => { const i = r.querySelectorAll('input'); return { label: i[0].value.trim(), url: i[1].value.trim() }; }).filter(c => c.label && c.url);
    nd.socials = [...document.querySelectorAll('.srow')].map(r => { const i = r.querySelectorAll('input'); return { type: i[0].value.trim() || 'à¸¥à¸´à¸à¸à¹à¸­à¸·à¹à¸', name: i[1].value.trim(), url: i[2].value.trim() }; }).filter(c => c.url);
    if (!nd.categories.some(c => c.packages.length)) return $('am').textContent = 'à¸à¹à¸­à¸à¸¡à¸µà¹à¸à¹à¸à¹à¸à¸à¸­à¸¢à¹à¸²à¸à¸à¹à¸­à¸¢ 1 à¸£à¸²à¸¢à¸à¸²à¸£ (à¹à¸ªà¹à¸à¸·à¹à¸­à¹à¸¥à¸°à¸£à¸²à¸à¸²)';
    $('am').className = 'msg good'; $('am').textContent = 'à¸à¸³à¸¥à¸±à¸à¸à¸±à¸à¸à¸¶à¸...';
    try { if (JSON.stringify(nd).length > 900000) throw new Error('à¸à¹à¸­à¸¡à¸¹à¸¥à¹à¸«à¸à¹à¹à¸à¸´à¸ 1 MB (à¸ªà¹à¸§à¸à¹à¸«à¸à¹à¸¡à¸²à¸à¸²à¸à¸£à¸¹à¸) à¸¥à¸­à¸à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¹à¸¥à¹à¸à¸¥à¸'); await fsSet(SITE, nd); try { localStorage.setItem('kd_data', JSON.stringify(nd)); } catch {} D = nd; applyAll(); $('am').textContent = 'à¸à¸±à¸à¸à¸¶à¸à¹à¸¥à¹à¸§ â à¸«à¸à¹à¸²à¹à¸§à¹à¸à¸­à¸±à¸à¹à¸à¸à¸à¸±à¸à¸à¸µ'; }
    catch (err) { $('am').className = 'msg'; $('am').tex