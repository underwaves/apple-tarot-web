
/* ===== à¸à¸±à¹à¸à¸à¹à¸²à¸à¸£à¸±à¹à¸à¹à¸à¸µà¸¢à¸§ ===== */
const CONFIG = {
  fbKey: 'AIzaSyCj5gPaMZoRSBvRKW6RAmi6ZUsMYnCgGKI',
  fbDb: 'https://morjeng-b49fe-default-rtdb.firebaseio.com',
  fbProject: 'morjeng-b49fe',
  adminEmail: 'morjeng@config.web'
};
/* à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸±à¹à¸à¸à¹à¸ */
const DEFAULTS = {
  shop:'à¸«à¸¡à¸­à¹à¸à¹à¸ à¹à¸à¹à¸²à¹à¸¡à¹à¸¡à¸¹à¹à¸à¸¥à¸¹', title:'à¸«à¸¡à¸­à¹à¸à¹à¸\nà¹à¸à¹à¸²à¹à¸¡à¹à¸¡à¸¹à¹à¸à¸¥à¸¹', sub:'à¸à¸¹à¸à¸§à¸ Â· à¸ªà¸µà¸¡à¸à¸à¸¥ Â· à¹à¸¥à¸à¸¡à¸à¸à¸¥ Â· à¸à¸­à¸à¹à¸ªà¸£à¸´à¸¡à¸à¸§à¸',
  h2:'à¸à¹à¸­à¸¡à¸¹à¸¥à¸¥à¸¹à¸à¸à¹à¸²', h3:'à¸ªà¹à¸à¸à¸à¹à¸²à¸¢', h4:'à¹à¸à¸à¸ªà¸¥à¸´à¸',
  namePh:'à¸à¸·à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²', bdL:'à¸§à¸±à¸/à¹à¸à¸·à¸­à¸/à¸à¸µà¹à¸à¸´à¸', btL:'à¹à¸§à¸¥à¸²à¹à¸à¸´à¸ (à¸à¹à¸²à¸à¸£à¸²à¸)', zL:'à¸£à¸²à¸¨à¸µ', zPh:'à¹à¸¥à¸·à¸­à¸à¸£à¸²à¸¨à¸µ', cL:'à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­à¸¥à¸¹à¸à¸à¹à¸² (à¸à¸£à¸­à¸à¸­à¸¢à¹à¸²à¸à¸à¹à¸­à¸¢ 1 à¸à¹à¸­à¸à¸à¸²à¸)', cTypes:'LINE,Instagram,à¹à¸à¸­à¸£à¹à¹à¸à¸£', qL:'à¸à¸³à¸à¸²à¸¡ / à¹à¸£à¸·à¹à¸­à¸à¸à¸µà¹à¸­à¸¢à¸²à¸à¸à¸¹ (à¸à¹à¸²à¸¡à¸µ)', qPh:'à¹à¸à¹à¸ à¹à¸£à¸·à¹à¸­à¸à¸à¸²à¸ à¸à¸§à¸²à¸¡à¸£à¸±à¸ à¸à¸²à¸£à¹à¸à¸´à¸',
  mBd:'à¸à¸£à¸¸à¸à¸²à¸à¸£à¸­à¸à¸§à¸±à¸à¹à¸à¸·à¸­à¸à¸à¸µà¹à¸à¸´à¸à¸à¹à¸°', mZ:'à¸à¸£à¸¸à¸à¸²à¹à¸¥à¸·à¸­à¸à¸£à¸²à¸¨à¸µà¸à¹à¸°', mCt:'à¸à¸£à¸¸à¸à¸²à¸à¸£à¸­à¸à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­à¸­à¸¢à¹à¸²à¸à¸à¹à¸­à¸¢ 1 à¸à¹à¸­à¸à¸à¸²à¸à¸à¹à¸°',
  qBtn:'à¸à¸¹à¸à¸´à¸§', rvBtn:'à¸à¸¹à¸£à¸µà¸§à¸´à¸§', rvT:'à¸£à¸µà¸§à¸´à¸§à¸à¸²à¸à¸¥à¸¹à¸à¸à¹à¸²', rvEmpty:'à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸£à¸µà¸§à¸´à¸§à¸à¹à¸° à¸¡à¸²à¹à¸à¹à¸à¸à¸à¹à¸£à¸à¹à¸¥à¸¢à¸à¸°à¸à¸°', qT:'à¸à¸´à¸§à¸à¸­à¸à¸¥à¸¹à¸à¸à¹à¸²', qEmpty:'à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸à¸´à¸§à¹à¸à¸à¸­à¸à¸à¸µà¹à¸à¹à¸°', bSend:'à¸ªà¹à¸à¸à¸´à¸¥ + à¸à¹à¸­à¸¡à¸¹à¸¥à¹à¸à¸à¸²à¸à¸à¸­à¸à¹à¸à¸', bCopy:'à¸ªà¹à¸à¸à¸´à¸¥à¹à¸«à¹à¸£à¹à¸²à¸', stDef:'à¸£à¸­à¸à¸£à¸§à¸à¸ªà¸¥à¸´à¸', stList:'à¸£à¸­à¸à¸£à¸§à¸à¸ªà¸¥à¸´à¸,à¸£à¸­à¸à¸£à¸§à¸à¸à¸´à¸§,à¸à¸³à¸¥à¸±à¸à¸à¸¹à¸à¸§à¸,à¹à¸ªà¸£à¹à¸à¹à¸¥à¹à¸§', contacts:[], socials:[{type:'LINE',name:'@688ijgqw',url:'https://line.me/R/ti/p/@688ijgqw'}], ctBtn:'à¸à¸´à¸à¸à¹à¸­', ctT:'à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­', ctEmpty:'à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­à¸à¹à¸°',
  drop:'à¹à¸à¸°à¹à¸à¸·à¹à¸­à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¸ªà¸¥à¸´à¸', send:'à¸ªà¹à¸à¸à¹à¸­à¸¡à¸¹à¸¥à¸£à¸±à¸à¸à¸´à¸¥', amtLabel:'à¸¢à¸­à¸à¸à¸µà¹à¸à¹à¸­à¸à¹à¸­à¸ (à¸à¸²à¸)', ppLabel:'à¸à¸£à¹à¸­à¸¡à¹à¸à¸¢à¹',
  mPkg:'à¸à¸£à¸¸à¸à¸²à¹à¸¥à¸·à¸­à¸à¹à¸à¹à¸à¹à¸à¸à¸à¹à¸­à¸à¸à¹à¸°', mName:'à¸à¸£à¸¸à¸à¸²à¸à¸£à¸­à¸à¸à¸·à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²à¸à¹à¸­à¸à¸ªà¹à¸à¸ªà¸¥à¸´à¸à¸à¹à¸°', mSlip:'à¸à¸£à¸¸à¸à¸²à¹à¸à¸à¸£à¸¹à¸à¸ªà¸¥à¸´à¸à¸à¹à¸­à¸à¸ªà¹à¸à¸à¹à¸°',
  mSend:'à¸à¸³à¸¥à¸±à¸à¸ªà¹à¸à¸à¹à¸­à¸¡à¸¹à¸¥...', mFail:'à¸ªà¹à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸ à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸ à¸«à¸£à¸·à¸­à¸à¸±à¸à¹à¸­à¸à¸¡à¸´à¸à¸£à¹à¸²à¸à¸à¸£à¹à¸­à¸¡à¸ªà¸¥à¸´à¸à¹à¸à¹à¹à¸¥à¸¢à¸à¹à¸°',
  introT:'à¸«à¸¡à¸­à¹à¸à¹à¸', whOrder:'', whChat:'', loginBtn:'à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸', ptT:'à¸ªà¸°à¸ªà¸¡à¹à¸à¹à¸¡', ptInfo:'à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸à¸à¹à¸­à¸à¸ªà¸±à¹à¸à¸à¸·à¹à¸­ à¸à¸¸à¸à¸à¸£à¸±à¹à¸à¸à¸µà¹à¹à¸­à¸à¸¡à¸´à¸à¸à¸£à¸§à¸à¸ªà¸¥à¸´à¸à¹à¸¥à¹à¸§à¸à¸°à¹à¸à¹ 1 à¹à¸à¹à¸¡à¸à¹à¸° â¦', chName:'à¹à¸­à¸à¸¡à¸´à¸', chHi:'à¸ªà¸§à¸±à¸ªà¸à¸µà¸à¹à¸° à¸¢à¸´à¸à¸à¸µà¸à¹à¸­à¸à¸£à¸±à¸à¸à¹à¸° ð\nà¸à¸±à¸à¹à¸­à¸à¸¡à¸´à¸à¹à¸à¹à¹à¸¥à¸¢ à¸«à¸£à¸·à¸­à¸à¸à¸à¸¸à¹à¸¡à¸¥à¸±à¸à¸à¹à¸²à¸à¸¥à¹à¸²à¸à¹à¸à¹à¸à¸°à¸à¸°\nà¹à¸­à¸à¸¡à¸´à¸à¸à¸°à¸à¸­à¸à¸à¸¥à¸±à¸à¹à¸¡à¸·à¹à¸­à¸§à¹à¸²à¸à¸à¹à¸° â¦', chFb:'', chKw:[{id:'kpay',k:'pay, à¹à¸­à¸, à¸à¹à¸²à¸¢, à¸à¸³à¸£à¸°',b:'à¸à¹à¸­à¸à¸à¸²à¸à¹à¸­à¸à¹à¸à¸´à¸',tx:'à¸à¹à¸­à¸à¸à¸²à¸à¸à¸²à¸£à¸à¸³à¸£à¸°à¹à¸à¸´à¸à¸à¹à¸° â¦\nà¹à¸­à¸à¹à¸¥à¹à¸§à¸ªà¹à¸à¸ªà¸¥à¸´à¸à¹à¸«à¹à¹à¸­à¸à¸¡à¸´à¸à¹à¸à¹à¹à¸¥à¸¢à¸à¸°à¸à¸°',im:0}], doneT:'à¸ªà¹à¸à¸ªà¸¥à¸´à¸à¹à¸£à¸µà¸¢à¸à¸£à¹à¸­à¸¢', doneP:'à¸£à¹à¸²à¸à¹à¸à¹à¸£à¸±à¸à¸à¹à¸­à¸¡à¸¹à¸¥à¹à¸¥à¹à¸§ à¸£à¸­à¸à¸²à¸£à¸¢à¸·à¸à¸¢à¸±à¸à¸à¸²à¸à¸à¸²à¸à¸£à¹à¸²à¸à¹à¸à¹à¹à¸¥à¸¢à¸à¸°à¸à¸°', foot:'à¸à¸­à¸à¸à¸¸à¸à¸à¸µà¹à¸­à¸¸à¸à¸«à¸à¸¸à¸à¸«à¸¡à¸­à¹à¸à¹à¸ à¹à¸à¹à¸²à¹à¸¡à¹à¸¡à¸¹à¹à¸à¸¥à¸¹ â¦',
  banner:'', avatar:'', promptpay:'0800000000', accountName:'à¸à¸·à¹à¸­à¸à¸±à¸à¸à¸µà¸£à¸±à¸à¹à¸à¸´à¸', bankName:'K PLUS', bankNumber:'000-0-00000-0',
  categories:[]
};
const FIELDS = [
 ['à¸à¹à¸­à¸à¸§à¸²à¸¡à¸«à¸à¹à¸²à¹à¸£à¸',[['title','à¸à¸·à¹à¸­à¸£à¹à¸²à¸à¸«à¸à¹à¸²à¹à¸£à¸ (à¸à¸¶à¹à¸à¸à¸£à¸£à¸à¸±à¸à¹à¸«à¸¡à¹à¹à¸à¹)',1],['sub','à¸à¹à¸­à¸à¸§à¸²à¸¡à¹à¸à¹à¸à¸·à¹à¸­à¸£à¹à¸²à¸']]],
 ['à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¸à¹à¸²à¸à¹',[['h2','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¸à¸£à¸­à¸à¸à¹à¸­à¸¡à¸¹à¸¥à¸¥à¸¹à¸à¸à¹à¸²'],['h3','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¸ªà¹à¸à¸à¸à¹à¸²à¸¢'],['h4','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¹à¸à¸à¸ªà¸¥à¸´à¸']]],
 ['à¸à¸­à¸£à¹à¸¡à¹à¸¥à¸°à¸à¸¸à¹à¸¡',[['namePh','à¸à¹à¸­à¸à¸à¸·à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²'],['bdL','à¸à¹à¸²à¸¢à¸§à¸±à¸à¹à¸à¸´à¸'],['btL','à¸à¹à¸²à¸¢à¹à¸§à¸¥à¸²à¹à¸à¸´à¸'],['zL','à¸à¹à¸²à¸¢à¸£à¸²à¸¨à¸µ'],['zPh','à¸à¹à¸­à¸à¸§à¸²à¸¡à¹à¸à¸à¹à¸­à¸à¹à¸¥à¸·à¸­à¸à¸£à¸²à¸¨à¸µ'],['cL','à¸à¹à¸²à¸¢à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²'],['cTypes','à¸à¹à¸­à¸à¸à¸²à¸à¸à¸µà¹à¹à¸«à¹à¸¥à¸¹à¸à¸à¹à¸²à¸à¸£à¸­à¸ (à¸à¸±à¹à¸à¸à¹à¸§à¸¢ , )'],['qL','à¸à¹à¸²à¸¢à¸à¸³à¸à¸²à¸¡'],['qPh','à¸à¸±à¸§à¸­à¸¢à¹à¸²à¸à¹à¸à¸à¹à¸­à¸à¸à¸³à¸à¸²à¸¡'],['drop','à¸à¸¥à¹à¸­à¸à¹à¸à¸à¸ªà¸¥à¸´à¸'],['send','à¸à¸¸à¹à¸¡à¸ªà¹à¸à¸ªà¸¥à¸´à¸'],['amtLabel','à¸à¹à¸²à¸¢à¸¢à¸­à¸à¹à¸­à¸'],['ppLabel','à¸à¹à¸²à¸¢à¸à¸£à¹à¸­à¸¡à¹à¸à¸¢à¹']]],
 ['à¸à¹à¸­à¸à¸§à¸²à¸¡à¹à¸à¹à¸à¹à¸à¸·à¸­à¸',[['mPkg','à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¹à¸¥à¸·à¸­à¸à¹à¸à¹à¸à¹à¸à¸'],['mName','à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¸à¸£à¸­à¸à¸à¸·à¹à¸­'],['mBd','à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¸à¸£à¸­à¸à¸§à¸±à¸à¹à¸à¸´à¸'],['mZ','à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¹à¸¥à¸·à¸­à¸à¸£à¸²à¸¨à¸µ'],['mCt','à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¸à¸£à¸­à¸à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­'],['mSlip','à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¹à¸à¸à¸ªà¸¥à¸´à¸'],['mSend','à¸£à¸°à¸«à¸§à¹à¸²à¸à¸à¸³à¸¥à¸±à¸à¸ªà¹à¸'],['mFail','à¸ªà¹à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸']]],
 ['à¸«à¸¥à¸±à¸à¸ªà¹à¸à¸ªà¸¥à¸´à¸ à¹à¸¥à¸°à¸à¹à¸²à¸¢à¸«à¸à¹à¸²',[['doneT','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸¥à¸±à¸à¸ªà¹à¸à¸ªà¸³à¹à¸£à¹à¸'],['doneP','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸«à¸¥à¸±à¸à¸ªà¹à¸à¸ªà¸³à¹à¸£à¹à¸',1],['foot','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¹à¸²à¸¢à¸«à¸à¹à¸²']]],
 ['à¸à¸±à¸à¸à¸µà¸£à¸±à¸à¹à¸à¸´à¸',[['promptpay','à¹à¸à¸­à¸£à¹à¸à¸£à¹à¸­à¸¡à¹à¸à¸¢à¹ (10 à¸«à¸¥à¸±à¸) à¸«à¸£à¸·à¸­à¹à¸¥à¸ à¸à¸à¸./à¸à¸´à¸à¸´à¸à¸¸à¸à¸à¸¥ (13 à¸«à¸¥à¸±à¸)'],['accountName','à¸à¸·à¹à¸­à¸à¸±à¸à¸à¸µ (à¹à¸ªà¸à¸à¹à¸à¹ QR)'],['bankName','à¸à¸·à¹à¸­à¸à¸à¸²à¸à¸²à¸£à¸ªà¸³à¸£à¸­à¸ (à¹à¸§à¹à¸à¸§à¹à¸²à¸à¹à¸à¸·à¹à¸­à¸à¹à¸­à¸)'],['bankNumber','à¹à¸¥à¸à¸à¸±à¸à¸à¸µà¸ªà¸³à¸£à¸­à¸']]],
 ['Discord Webhook',[['whOrder','Webhook à¸­à¸­à¹à¸à¸­à¸£à¹ (à¸ªà¹à¸à¸à¸´à¸¥+à¸ªà¸¥à¸´à¸à¹à¸à¹à¸² Discord)'],['whChat','Webhook à¹à¸à¸ (à¹à¸à¹à¸à¹à¸à¸·à¸­à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¸¥à¸¹à¸à¸à¹à¸²)']]],
 ['à¹à¸à¸à¸à¸±à¸à¹à¸­à¸à¸¡à¸´à¸',[['chName','à¸à¸·à¹à¸­à¹à¸­à¸à¸¡à¸´à¸à¸à¸µà¹à¹à¸ªà¸à¸à¹à¸à¹à¸à¸'],['chHi','à¸à¹à¸­à¸à¸§à¸²à¸¡à¹à¸à¸°à¸à¸³à¸à¸±à¸§ (à¹à¸à¹à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¹à¸£à¸à¹à¸à¹à¸à¸)',1],['chFb','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸­à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´à¹à¸¡à¸·à¹à¸­à¹à¸¡à¹à¸à¸£à¸à¸à¸µà¸¢à¹à¹à¸§à¸´à¸£à¹à¸à¹à¸«à¸ (à¸à¸­à¸à¸à¸£à¸±à¹à¸à¹à¸à¸µà¸¢à¸§à¸à¹à¸­ 30 à¸à¸²à¸à¸µ à¹à¸§à¹à¸à¸§à¹à¸²à¸ = à¹à¸¡à¹à¸à¸­à¸)',1]]],
 ['à¸«à¸à¹à¸²à¹à¸«à¸¥à¸',[['introT','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸«à¸à¹à¸²à¹à¸«à¸¥à¸ (à¸à¸µà¹à¹à¸à¸§à¹à¸à¸­à¸à¹à¸à¸´à¸à¹à¸§à¹à¸)']]],
 ['à¸ªà¸°à¸ªà¸¡à¹à¸à¹à¸¡ / à¸ªà¸¡à¸²à¸à¸´à¸',[['loginBtn','à¸à¸¸à¹à¸¡à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸ (à¸à¸­à¸à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸)'],['ptT','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¸ªà¸°à¸ªà¸¡à¹à¸à¹à¸¡'],['ptInfo','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸­à¸à¸´à¸à¸²à¸¢à¸à¸²à¸£à¸ªà¸°à¸ªà¸¡à¹à¸à¹à¸¡',1]]],
 ['à¸à¸´à¸§à¹à¸¥à¸°à¸à¸´à¸¥',[['qBtn','à¸à¸¸à¹à¸¡à¸à¸¹à¸à¸´à¸§'],['rvBtn','à¸à¸¸à¹à¸¡à¸à¸¹à¸£à¸µà¸§à¸´à¸§'],['ctBtn','à¸à¸¸à¹à¸¡à¸à¸´à¸à¸à¹à¸­'],['rvT','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¸£à¸µà¸§à¸´à¸§'],['rvEmpty','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸­à¸à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸£à¸µà¸§à¸´à¸§'],['qT','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¸à¸´à¸§'],['qEmpty','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸­à¸à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸à¸´à¸§'],['ctT','à¸«à¸±à¸§à¸à¹à¸­à¸«à¸à¹à¸²à¸à¸´à¸à¸à¹à¸­'],['ctEmpty','à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸­à¸à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­'],['bSend','à¸«à¸±à¸§à¸à¹à¸­à¸à¸¸à¹à¸¡à¸ªà¹à¸à¸à¸´à¸¥'],['bCopy','à¸à¸¸à¹à¸¡à¸à¸±à¸à¸¥à¸­à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸´à¸¥'],['stDef','à¸ªà¸à¸²à¸à¸°à¸à¸±à¹à¸à¸à¹à¸à¸à¸­à¸à¸à¸´à¸§à¹à¸«à¸¡à¹'],['stList','à¸à¸±à¸§à¹à¸¥à¸·à¸­à¸à¸ªà¸à¸²à¸à¸°à¸à¸µà¹à¹à¸¥à¸·à¸­à¸à¹à¸£à¹à¸§ (à¸à¸±à¹à¸à¸à¹à¸§à¸¢ , )']]]
];

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = n => Number(n).toLocaleString('th-TH');
let D = {...DEFAULTS}, chosen = null, PK = [];

function norm(){
  const A = x => Array.isArray(x) ? x.filter(Boolean) : x && typeof x === 'object' ? Object.values(x).filter(Boolean) : [];
  let cs = A(D.categories).map(c => ({
    name: String(c.name || ''),
    desc: String(c.desc || ''),
    packages: A(c.packages).map(p => ({
      name: String(p.name || ''),
      desc: String(p.desc || ''),
      price: +p.price || 0
    }))
  }));
  // à¸à¹à¸²à¹à¸à¸¢à¸¡à¸µ packages à¹à¸à¸à¹à¸à¹à¸² (à¹à¸¡à¹à¸¡à¸µ categories) à¸à¹à¸­à¸¢à¸¢à¹à¸²à¸¢à¸à¸£à¸±à¹à¸à¹à¸à¸µà¸¢à¸§ â à¹à¸¡à¹à¸à¸¶à¸à¸à¸­à¸à¹à¸à¹à¸¡à¹à¸à¸¥à¸±à¸
  if (!cs.length) {
    const old = A(D.packages);
    if (old.length) cs = [{ name: 'à¹à¸à¹à¸à¹à¸à¸', desc: '', packages: old }];
  }
  // à¸à¸£à¸­à¸à¸«à¸¡à¸§à¸à¸à¸µà¹à¹à¸¡à¹à¸¡à¸µà¹à¸à¹à¸à¸­à¸­à¸à¹à¸à¹à¸à¸²à¸¡à¹à¸ (à¹à¸à¹à¸à¸«à¸¡à¸§à¸à¸§à¹à¸²à¸à¹à¸§à¹à¹à¸«à¹à¹à¸à¹à¸à¹à¸­à¹à¸à¸«à¸¥à¸±à¸à¸à¹à¸²à¸)
  D.categories = cs;
  delete D.packages;
  PK = cs.flatMap(c => c.packages.map(p => ({ ...p, cat: c.name })));
}

const tlv = (t, v) => t + String(v.length).padStart(2, '0') + v;
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function promptpay(id, amount){
  id = String(id).replace(/\D/g, '');
  let tag = '01';
  if (id.length >= 15) tag = '03';
  else if (id.length >= 13) tag = '02';
  else id = '0066' + id.replace(/^0/, '');
  const acc = tlv('00', 'A000000677010111') + tlv(tag, id);
  const p = tlv('00','01') + tlv('01','12') + tlv('29', acc) + tlv('53','764') + tlv('54', amount.toFixed(2)) + tlv('58','TH') + '6304';
  return p + crc16(p);
}

const ICON = {
  wallet: '<path d="M4 7.5h15.5A1.5 1.5 0 0 1 21 9v8.5a1.5 1.5 0 0 1-1.5 1.5H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13"/><path d="M16 13h3"/>',
  bank: '<path d="M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M2.5 20h19M3 8l9-5 9 5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>'
};
function copyRow(icon, label, value){
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'copy';
  b.innerHTML = `<svg viewBox="0 0 24 24">${ICON[icon]}</svg><span><small>${esc(label)}</small><strong>${esc(value)}</strong></span><em>à¸à¸±à¸à¸¥à¸­à¸</em>`;
  b.onclick = async () => {
    const raw = value.replace(/[^\d.]/g, '') || value;
    try { await navigator.clipboard.writeText(raw); }
    catch { const t = document.createElement('textarea'); t.value = raw; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    b.classList.add('ok'); b.querySelector('em').textContent = 'à¸à¸±à¸à¸¥à¸­à¸à¹à¸¥à¹à¸§';
    setTimeout(() => { b.classList.remove('ok'); b.querySelector('em').textContent = 'à¸à¸±à¸à¸¥à¸­à¸'; }, 1400);
  };
  return b;
}

let cart = {};
function renderPk(){
  const root = $('cats'); root.innerHTML = ''; let k = 0;
  D.categories.forEach(c => {
    if (!c.packages.length) return;
    const sec = document.createElement('div'); sec.className = 'cat';
    sec.innerHTML = `<h2 class="ch"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#st"/></svg><span>${esc(c.name)}</span></h2>${c.desc ? `<p class="cd">${esc(c.desc)}</p>` : ''}<div class="pk"></div>`;
    const g = sec.querySelector('.pk');
    c.packages.forEach(p => {
      const i = k++, w = document.createElement('div'); w.className = 'pw'; w.dataset.i = i;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pkg'; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<span><b>${esc(p.name)}</b><small>${esc(p.desc)}</small></span><span class="pr"><span class="qn" hidden></span><span><s>à¸¿</s>${fmt(p.price)}</span><span class="add">+</span></span>`;
      b.onclick = () => setQ(i, 1);
      const m = document.createElement('button');
      m.type = 'button'; m.className = 'mn'; m.textContent = 'â'; m.setAttribute('aria-label', 'à¸¥à¸à¸à¸³à¸à¸§à¸'); m.dataset.q = i; m.dataset.d = -1;
      w.append(b, m); g.appendChild(w);
    });
    root.appendChild(sec);
  });
  upd();
}
function applyAll(){
  norm();
  document.title = D.shop;
  const im = (box, img, u) => { const ok = /^(data:image\/|https?:\/\/)/.test(u || ''); box.hidden = !ok; if (ok) img.src = u; };
  im($('ban'),$('banImg'), D.banner); im($('av'),$('avImg'), D.avatar);
  document.querySelectorAll('[data-t]').forEach(e => e.textContent = D[e.dataset.t]); try { localStorage.setItem('lb_intro', D.introT || ''); } catch {}
  document.querySelectorAll('[data-p]').forEach(e => e.placeholder = D[e.dataset.p]);
  $('zd').innerHTML = `<option value="" disabled selected>${esc(D.zPh)}</option>` + ZD.map(z => `<option>${z}</option>`).join('');
  $('cs').innerHTML = String(D.cTypes).split(',').map(x => x.trim()).filter(Boolean).map(x => `<textarea class="ag" rows="1" data-c="${esc(x)}" placeholder="${esc(x)}" maxlength="100"></textarea>`).join('');
  cart = {};
  renderPk(); refreshPb();
}

const qty = () => Object.values(cart).reduce((a, b) => a + b, 0);
const total = () => PK.reduce((t, p, i) => t + p.price * (cart[i] || 0), 0);
const sumTxt = () => PK.map((p, i) => cart[i] ? p.name + (cart[i] > 1 ? ' x' + cart[i] : '') : '').filter(Boolean).join(' + ');
function setQ(i, d){ const n = Math.max(0, Math.min(99, (cart[i] || 0) + d)); if (n) cart[i] = n; else delete cart[i]; cur = null; upd(); }
function upd(){
  document.querySelectorAll('.pw').forEach(w => { const i = +w.dataset.i, n = cart[i] || 0, b = w.firstChild, q = b.querySelector('.qn');
    w.classList.toggle('has', n > 0); b.setAttribute('aria-pressed', n > 0); q.hidden = !n; q.textContent = 'x' + n; });
  const n = qty(); $('cbt').hidden = !n;
  $('cbn').textContent = 'à¸à¸°à¸à¸£à¹à¸² Â· ' + n + ' à¸£à¸²à¸¢à¸à¸²à¸£'; $('cbp').textContent = baht(total());
  if (!n) closeM(); else if (!$('mc').hidden) drawCart();
}
function drawCart(){
  $('cartl').innerHTML = PK.map((p, i) => cart[i] ? `<div class="ci"><span>${esc(p.name)}<small>${esc(baht(p.price))} à¸à¹à¸­à¹à¸à¹à¸</small></span><span class="st"><button type="button" data-q="${i}" data-d="-1">â</button>${cart[i]}<button type="button" data-q="${i}" data-d="1">+</button></span><b>${esc(baht(p.price * cart[i]))}</b></div>` : '').join('');
  $('ct').textContent = baht(total());
}
const MS = ['mc', 's2', 's3', 's4', 'mk'];
function openM(id){ MS.forEach(m => $(m).hidden = m !== id); document.body.style.overflow = 'hidden'; document.body.classList.add('mo'); if (id === 'mc') {$('cm').textContent = ''; drawCart(); } if (id === 's2') userBar(); }
function closeM(){ MS.forEach(m => $(m).hidden = true); document.body.classList.remove('mo'); if ($('adm').hidden &&$('ov').hidden) document.body.style.overflow = ''; }
function openPay(){
  const t = total();
  $('qr').innerHTML = '';
  new QRCode($('qr'), { text: promptpay(D.promptpay, t), width: 220, height: 220, colorDark: '#000000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
  $('amt').textContent = baht(t);$('who').textContent = D.accountName;
  const c = $('copies'); c.innerHTML = '';
  c.append(copyRow('tag', D.amtLabel, t.toFixed(2)), copyRow('wallet', D.ppLabel, D.promptpay));
  if (D.bankNumber) c.append(copyRow('bank', D.bankName, D.bankNumber));
  openM('s3');
}
$('cbt').onclick = () => openM('mc');
$('go').onclick = () => getUser() ? openM('s2') : openAuth('lg', 'à¸à¸£à¸¸à¸à¸²à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸à¸à¹à¸­à¸à¸ªà¸±à¹à¸à¸à¸·à¹à¸­ à¸à¸°à¹à¸à¹à¹à¸à¹à¸à¹à¸à¹à¸¡à¹à¸¥à¸°à¸à¸£à¸°à¸§à¸±à¸à¸´à¹à¸à¸à¹à¸§à¹à¹à¸«à¹à¸à¹à¸° â¦', () => openM('s2'));
$('bk2').onclick = () => openM('mc');$('to3').onclick = () => {
  const miss = (el, m) => { $('m2').textContent = m; el.focus(); };
  if (!$('name').value.trim()) return miss($('name'), D.mName);
  if (!$('bd').value) return miss($('bd'), D.mBd);
  if (!$('zd').value) return miss($('zd'), D.mZ);
  if (![...document.querySelectorAll('[data-c]')].some(i => i.value.trim())) return miss(document.querySelector('[data-c]'), D.mCt);
  $('m2').textContent = ''; openPay();
};
$('tos4').onclick = () => openM('s4');$('bk').onclick = () => openM('s3');
document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('#lg,#rg')) { if (t.closest('[data-x]') || t.classList.contains('modal')) closeAuth(); return; }
  if (t.closest('[data-x]') || t.classList.contains('modal')) closeM();
  const q = t.closest('[data-q]'); if (q) setQ(+q.dataset.q, +q.dataset.d);
});
$('form').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.preventDefault(); });
const grow = t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; };
document.addEventListener('input', e => { if (e.target.classList && e.target.classList.contains('ag')) grow(e.target); });

$('slip').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  $('prev').src = URL.createObjectURL(f);$('prev').hidden = false;
  $('droptxt').textContent = f.name;
});
function say(t, good){ $('msg').textContent = t; $('msg').className = 'msg' + (good ? ' good' : ''); }

const ZD = 'à¹à¸¡à¸©,à¸à¸¤à¸©à¸ ,à¹à¸¡à¸à¸¸à¸,à¸à¸£à¸à¸,à¸ªà¸´à¸à¸«à¹,à¸à¸±à¸à¸¢à¹,à¸à¸¸à¸¥à¸¢à¹,à¸à¸´à¸à¸´à¸,à¸à¸à¸¹,à¸¡à¸±à¸à¸à¸£,à¸à¸¸à¸¡à¸ à¹,à¸¡à¸µà¸,à¹à¸¡à¹à¸à¸£à¸²à¸'.split(',');
const hook = (url, content, file, name) => {
  if (!/^https:\/\/(canary\.|ptb\.)?discord(app)?\.com\/api\/webhooks\//.test(url || '')) return Promise.resolve();
  const fd = new FormData(), pl = { content: String(content).slice(0, 1900), allowed_mentions: { parse: [] } };
  if (name) pl.username = String(name).slice(0, 80);
  fd.append('payload_json', JSON.stringify(pl)); if (file) fd.append('files[0]', file, 'slip.jpg');
  return fetch(url, { method: 'POST', body: fd }).catch(() => {});
};

const AUTH = { t: '', exp: 0 };
const LSg = k => { try { return localStorage.getItem(k) || ''; } catch { return ''; } };
const LSs = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch {} };
const setSess = (t, exp, rt) => { AUTH.t = t; AUTH.exp = Date.now() + (+exp) * 1000; LSs('lb_rt', rt); };
async function idTok(){
  if (AUTH.t && Date.now() < AUTH.exp - 60000) return AUTH.t;
  const rt = LSg('lb_rt'); if (!rt) return '';
  try {
    const r = await fetch('https://securetoken.googleapis.com/v1/token?key=' + CONFIG.fbKey, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(rt) });
    const j = await r.json(); if (!r.ok) throw 0;
    setSess(j.id_token, j.expires_in, j.refresh_token); return AUTH.t;
  } catch { AUTH.t = ''; LSs('lb_rt', ''); return ''; }
}
async function adminLogin(pw){
  try {
    const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + CONFIG.fbKey, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: CONFIG.adminEmail, password: pw, returnSecureToken: true }) });
    const j = await r.json(); if (!r.ok) return false;
    setSess(j.idToken, j.expiresIn, j.refreshToken); return true;
  } catch { return false; }
}

const SITE = 'config';
const FSU = id => `https://firestore.googleapis.com/v1/projects/${CONFIG.fbProject}/databases/(default)/documents/site/${id}?key=${CONFIG.fbKey}`;
const fsGet = async id => { const r = await fetch(FSU(id)); if (r.status === 404) return {}; if (!r.ok) throw new Error(r.status); try { return JSON.parse((await r.json()).fields.j.stringValue); } catch { return {}; } };
const fsSet = async (id, o) => {
  const t = await idTok(); if (!t) throw new Error('à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¹à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸à¹à¸­à¸à¸¡à¸´à¸');
  const r = await fetch(FSU(id), { method: 'PATCH', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { j: { stringValue: JSON.stringify(o) } } }) });
  if (!r.ok) throw new Error('Firestore à¸à¸­à¸à¸à¸¥à¸±à¸ ' + r.status);
};
const db = async (p, v, m) => {
  const t = (await idTok()) || (await userTok()), r = await fetch(CONFIG.fbDb + '/' + p + '.json' + (t ? '?auth=' + t : ''), v === undefined ? {} : { method: m || 'PUT', body: JSON.stringify(v) });
  if (!r.ok) throw new Error(r.status); return r.json();
};
const fit = (file, w, q) => new Promise((ok, no) => {
  const im = new Image();
  im.onload = () => { const k = Math.min(1, w / im.width), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k;
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(im.src); ok(c.toDataURL('image/jpeg', q)); };
  im.onerror = no; im.src = URL.createObjectURL(file);
});
const mask = n => [...(window.Intl && Intl.Segmenter ? new Intl.Segmenter('th').segment(n) : [...n].map(x => ({ segment: x })))].slice(0, 2).map(x => x.segment).join('') + 'â¢â¢â¢';
const thB = d => d ? new Date(d + 'T00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
const baht = n => 'à¸¿' + Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 });
const getMine = () => { try { return JSON.parse(localStorage.getItem('lb_mine') || '[]'); } catch { return []; } };
const addMine = id => { try { localStorage.setItem('lb_mine', JSON.stringify([...getMine(), id])); } catch {} };

let cur = null;
$('form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!getUser()) { closeM(); return openAuth('lg', 'à¸à¸£à¸¸à¸à¸²à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸à¸à¹à¸­à¸à¸ªà¸±à¹à¸à¸à¸·à¹à¸­à¸à¹à¸°', () => openM('s4')); }
  const name = $('name').value.trim(), f =$('slip').files[0];
  const cs = [...document.querySelectorAll('[data-c]')].map(i => [i.dataset.c, i.value.trim()]).filter(c => c[1]);
  if (!qty()) return say(D.mPkg);
  if (!name) { $('name').focus(); return say(D.mName); }
  if (!$('bd').value) {$('bd').focus(); return say(D.mBd); }
  if (!$('zd').value) {$('zd').focus(); return say(D.mZ); }
  if (!cs.length) { document.querySelector('[data-c]').focus(); return say(D.mCt); }
  if (!f) return say(D.mSlip);
  if (!f.type.startsWith('image/')) return say('à¹à¸à¸¥à¹à¸ªà¸¥à¸´à¸à¸à¹à¸­à¸à¹à¸à¹à¸à¸£à¸¹à¸à¸ à¸²à¸à¹à¸à¹à¸²à¸à¸±à¹à¸à¸à¹à¸°');
  if (f.size > 8 * 1024 * 1024) return say('à¸£à¸¹à¸à¹à¸«à¸à¹à¹à¸à¸´à¸ 8 MB à¸¥à¸­à¸à¹à¸à¸à¸«à¸à¹à¸²à¸à¸­à¸ªà¸¥à¸´à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸à¸à¹à¸°');
  $('send').disabled = true; say(D.mSend, true);
  try {
    const u = await ensureUser();
    if (!cur) {
      const d = new Date(), p = n => String(n).padStart(2, '0');
      cur = { id: 'LB' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
        no: 0, name, bd: $('bd').value, bt:$('bt').value, zd: $('zd').value, q:$('q').value.trim(), cs, pkg: sumTxt(), price: total(), t: Date.now(), st: D.stDef, u };
    }
    if (!cur.link) {
      const pub = await db('lpub') || {};
      cur.no = Math.max(0, ...Object.entries(pub).filter(([k]) => k !== cur.id).map(([, x]) => x.no || 0)) + 1;
      const sl = await fit(f, 900, .7);
      await Promise.all([db('lq/' + cur.id, cur), db('lslip/' + cur.id, sl), db('lpub/' + cur.id, { no: cur.no, nm: mask(name), pkg: cur.pkg, st: cur.st, t: cur.t })]);
      cur.link = location.href.split('#')[0] + '#slip=' + cur.id;
      hook(D.whOrder, [`ð§¾ à¸­à¸­à¹à¸à¸­à¸£à¹ ${cur.id} (à¸à¸´à¸§ ${cur.no})`, `ð¤ à¸à¸·à¹à¸­: ${name}`, u ? `ð à¸¢à¸¹à¸ª: @${u}` : '', `ð à¸§à¸±à¸à¹à¸à¸´à¸: ${thB(cur.bd)}${cur.bt ? ' Â· à¹à¸§à¸¥à¸² ' + cur.bt : ''}`, `â à¸£à¸²à¸¨à¸µ: ${cur.zd}`, `ð¦ ${cur.pkg} Â· ${baht(cur.price)}`, `ð à¸à¸´à¸à¸à¹à¸­: ${cs.map(c => c.join(': ')).join(', ')}`, cur.q ? `â à¸à¸³à¸à¸²à¸¡: ${cur.q}` : ''].filter(Boolean).join('\n'), f, D.shop);
    }
    const b = cur; cur = null; addMine(b.id);
    closeM(); $('form').style.display = 'none'; showBill(b); $('done').style.display = 'block';$('done').scrollIntoView({ behavior: 'smooth' });
  } catch (err) { $('send').disabled = false; say(D.mFail); }
});

/* ===== à¸«à¸à¹à¸²à¸à¸¹à¸à¸´à¸§ / à¸à¸¹à¸ªà¸¥à¸´à¸ ===== */
let qt;
const closeOv = () => { clearInterval(qt); clearInterval(pt); $('ov').hidden = true; document.body.style.overflow = ''; if (location.hash.startsWith('#slip=')) history.replaceState(null, '', location.pathname + location.search); };
function openQ(){
  const o = $('ov'); document.body.style.overflow = 'hidden'; o.hidden = false;
  o.innerHTML = `<div><h3>${esc(D.qT)}</h3><div id="ql" style="margin-top:16px"></div><button type="button" class="btn2" id="oc" style="width:100%;margin-top:14px">à¸à¸´à¸</button></div>`;
  $('oc').onclick = closeOv;
  const draw = async () => {
    const me = getMine();
    try {
      const p = await db('lpub') || {}, rows = Object.entries(p).map(([id, r]) => ({ ...r, id })).sort((a, b) => a.no - b.no);
      $('ql').innerHTML = rows.length ? rows.map(r => `<div class="qi${me.includes(r.id) ? ' me' : ''}"><i>${esc(r.no)}</i><span><b>${esc(r.pkg)}</b><small>${esc(r.nm)}${me.includes(r.id) ? ' Â· à¸à¸´à¸§à¸à¸­à¸à¸à¸¸à¸' : ''}</small></span><em>${esc(r.st)}</em></div>`).join('') : `<p class="sub">${esc(D.qEmpty)}</p>`;
    } catch { if ($('ql'))$('ql').innerHTML = '<p class="msg">à¹à¸«à¸¥à¸à¸à¸´à¸§à¹à¸¡à¹à¹à¸à¹ à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸à¸à¸°à¸à¸°</p>'; }
  };
  draw(); clearInterval(qt); qt = setInterval(() => $('ql') ? draw() : clearInterval(qt), 15000);
}
$('qb').onclick = openQ;

/* ===== à¸à¸±à¸à¸à¸µà¸ªà¸¡à¸²à¸à¸´à¸ (Firebase Auth: à¸¢à¸¹à¸ª + à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸) ===== */
const getUser = () => LSg('lb_user');
const UA = { t: '', exp: 0 }, acc = { nm: '' };
const UNAME = /^[a-z0-9_]{3,20}$/;
const mailOf = u => u + '@user.morjeng.web';
const authErr = c => { c = String(c || '');
  if (/EMAIL_EXISTS/.test(c)) return 'à¸¢à¸¹à¸ªà¸à¸µà¹à¸¡à¸µà¸à¸à¹à¸à¹à¹à¸¥à¹à¸§à¸à¹à¸° à¸¥à¸­à¸à¸à¸·à¹à¸­à¸­à¸·à¹à¸à¸à¸°à¸à¸°';
  if (/INVALID_LOGIN_CREDENTIALS|EMAIL_NOT_FOUND|INVALID_PASSWORD|INVALID_EMAIL/.test(c)) return 'à¸¢à¸¹à¸ªà¸«à¸£à¸·à¸­à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¹à¸¡à¹à¸à¸¹à¸à¸à¹à¸­à¸à¸à¹à¸°';
  if (/WEAK_PASSWORD/.test(c)) return 'à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¸ªà¸±à¹à¸à¹à¸à¸´à¸à¹à¸ à¹à¸à¹à¸­à¸¢à¹à¸²à¸à¸à¹à¸­à¸¢ 6 à¸à¸±à¸§à¸à¸°à¸à¸°';
  if (/TOO_MANY_ATTEMPTS/.test(c)) return 'à¸¥à¸­à¸à¸«à¸¥à¸²à¸¢à¸à¸£à¸±à¹à¸à¹à¸à¸´à¸à¹à¸ à¸£à¸­à¸ªà¸±à¸à¸à¸£à¸¹à¹à¹à¸¥à¹à¸§à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸à¸°à¸à¸°';
  if (/OPERATION_NOT_ALLOWED/.test(c)) return 'à¸£à¸°à¸à¸à¸ªà¸¡à¸±à¸à¸£à¸ªà¸¡à¸²à¸à¸´à¸à¸¢à¸±à¸à¹à¸¡à¹à¹à¸à¸´à¸ (à¸à¹à¸­à¸à¹à¸à¸´à¸ Email/Password à¹à¸ Firebase Authentication)';
  return 'à¹à¸à¸·à¹à¸­à¸¡à¸à¹à¸­à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸ à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸à¸à¸°à¸à¸°'; };
async function userTok(){
  if (UA.t && Date.now() < UA.exp - 60000) return UA.t;
  const rt = LSg('lb_urt'); if (!rt) return '';
  try {
    const r = await fetch('https://securetoken.googleapis.com/v1/token?key=' + CONFIG.fbKey, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(rt) });
    const j = await r.json();
    if (!r.ok) { if (/TOKEN_EXPIRED|INVALID_REFRESH_TOKEN|USER_NOT_FOUND|USER_DISABLED|INVALID_GRANT/.test(JSON.stringify(j))) dropUser(); return ''; }
    UA.t = j.id_token; UA.exp = Date.now() + (+j.expires_in) * 1000; LSs('lb_urt', j.refresh_token); return UA.t;
  } catch { return ''; }
}
async function authCall(kind, u, pw){
  const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:' + kind + '?key=' + CONFIG.fbKey, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: mailOf(u), password: pw, returnSecureToken: true }) });
  const j = await r.json(); if (!r.ok) throw new Error((j.error && j.error.message) || 'ERR'); return j;
}
function refreshPb(){ const u = getUser(), s = $('pbt'); if (s) s.textContent = u || D.loginBtn || 'à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸'; }
function dropUser(){
  UA.t = ''; UA.exp = 0; acc.nm = ''; LSs('lb_user', ''); LSs('lb_urt', '');
  refreshPb(); if (window.chatAuthChanged) window.chatAuthChanged();
}
async function startSess(u, j){
  UA.t = j.idToken; UA.exp = Date.now() + (+j.expiresIn) * 1000; LSs('lb_urt', j.refreshToken); LSs('lb_user', u);
  acc.nm = '';
  try {
    const me = await db('lu/' + u);
    if (me) acc.nm = me.nm || ''; else await db('lu/' + u, { uid: j.localId, t: Date.now(), pts: 0, nm: '' });
  } catch {}
  refreshPb(); if (window.chatAuthChanged) await window.chatAuthChanged();
}

let afterAuth = null;
function openAuth(which, note, then){
  afterAuth = then || null;
  $('lg').hidden = which !== 'lg'; $('rg').hidden = which !== 'rg';
  $('lgn').textContent = $('rgn').textContent = note || '';
  $('lgm').textContent = $('rgm').textContent = '';
  document.body.style.overflow = 'hidden';
  setTimeout(() => $(which === 'lg' ? 'lgu' : 'rgu').focus(), 120);
}
function closeAuth(){
  $('lg').hidden = true; $('rg').hidden = true; afterAuth = null;
  if (!(MS.some(m => !$(m).hidden) || !$('ov').hidden || !$('adm').hidden)) document.body.style.overflow = '';
}
function finishAuth(msg){ const f = afterAuth; closeAuth(); if (f) f(msg); }
$('lg2rg').onclick = () => openAuth('rg', $('lgn').textContent, afterAuth);
$('rg2lg').onclick = () => openAuth('lg', $('rgn').textContent, afterAuth);

$('lgf').addEventListener('submit', async e => {
  e.preventDefault();
  const u = $('lgu').value.trim().toLowerCase().replace(/^@/, ''), p = $('lgp').value, m = $('lgm'), b = $('lgs');
  const say2 = (t, good) => { m.textContent = t; m.className = 'msg' + (good ? ' good' : ''); };
  if (!u) { $('lgu').focus(); return say2('à¸à¸£à¸¸à¸à¸²à¹à¸ªà¹usernameà¸à¹à¸°'); }
  if (!p) { $('lgp').focus(); return say2('à¸à¸£à¸¸à¸à¸²à¹à¸ªà¹à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¸à¹à¸°'); }
  if (!UNAME.test(u)) return say2('à¸¢à¸¹à¸ªà¸«à¸£à¸·à¸­à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¹à¸¡à¹à¸à¸¹à¸à¸à¹à¸­à¸à¸à¹à¸°');
  b.disabled = true; say2('à¸à¸³à¸¥à¸±à¸à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸...', true);
  try { const j = await authCall('signInWithPassword', u, p); await startSess(u, j); b.disabled = false; $('lgp').value = ''; finishAuth('à¹à¸à¹à¸²à¸ªà¸¹à¹à¸£à¸°à¸à¸à¹à¸£à¸µà¸¢à¸à¸£à¹à¸­à¸¢à¸à¹à¸° â¦'); }
  catch (err) { b.disabled = false; say2(authErr(err.message)); }
});
$('rgf').addEventListener('submit', async e => {
  e.preventDefault();
  const u = $('rgu').value.trim().toLowerCase().replace(/^@/, ''), p = $('rgp').value, p2 = $('rgp2').value, m = $('rgm'), b = $('rgs');
  const say2 = (t, good) => { m.textContent = t; m.className = 'msg' + (good ? ' good' : ''); };
  if (!UNAME.test(u)) { $('rgu').focus(); return say2('à¸¢à¸¹à¸ªà¹à¸à¹à¹à¸à¹à¹à¸à¸à¸²à¸°à¸à¸±à¸§à¸­à¸±à¸à¸©à¸£à¸­à¸±à¸à¸à¸¤à¸© à¸à¸±à¸§à¹à¸¥à¸ à¸«à¸£à¸·à¸­ _ à¸à¸§à¸²à¸¡à¸¢à¸²à¸§ 3â20 à¸à¸±à¸§à¸à¹à¸°'); }
  if (p.length < 6) { $('rgp').focus(); return say2('à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¸à¹à¸­à¸à¸¡à¸µà¸­à¸¢à¹à¸²à¸à¸à¹à¸­à¸¢ 6 à¸à¸±à¸§à¸à¹à¸°'); }
  if (p !== p2) { $('rgp2').focus(); return say2('à¸£à¸«à¸±à¸ªà¸à¹à¸²à¸à¸ªà¸­à¸à¸à¹à¸­à¸à¹à¸¡à¹à¸à¸£à¸à¸à¸±à¸à¸à¹à¸°'); }
  b.disabled = true; say2('à¸à¸³à¸¥à¸±à¸à¸ªà¸¡à¸±à¸à¸£à¸ªà¸¡à¸²à¸à¸´à¸...', true);
  try {
    let taken = false; try { taken = !!(await db('lu/' + u)); } catch {}
    if (taken) throw new Error('EMAIL_EXISTS');
    const j = await authCall('signUp', u, p);
    UA.t = j.idToken; UA.exp = Date.now() + (+j.expiresIn) * 1000;
    try { await db('lu/' + u, { uid: j.localId, t: Date.now(), pts: 0, nm: '' }); } catch {}
    await startSess(u, j); b.disabled = false; $('rgp').value = $('rgp2').value = ''; finishAuth('à¸ªà¸¡à¸±à¸à¸£à¸ªà¸¡à¸²à¸à¸´à¸à¹à¸£à¸µà¸¢à¸à¸£à¹à¸­à¸¢à¸à¹à¸° â¦');
  } catch (err) { b.disabled = false; say2(authErr(err.message)); }
});

async function ensureUser(){ const u = getUser(); if (!u) throw new Error('login'); return u; }

let pt;
function userBar(){
  const u = getUser(), b = $('ubar'); if (!b) return;
  b.style.display = u ? '' : 'none';
  b.innerHTML = u ? `<span>â¦ à¸ªà¸±à¹à¸à¹à¸à¸à¸·à¹à¸­à¸¢à¸¹à¸ª <b>@${esc(u)}</b> Â· à¸£à¸±à¸ 1 à¹à¸à¹à¸¡à¹à¸¡à¸·à¹à¸­à¹à¸­à¸à¸¡à¸´à¸à¸à¸£à¸§à¸à¸ªà¸¥à¸´à¸à¹à¸¥à¹à¸§</span>` : '';
  const n = $('name'); if (u && acc.nm && !n.value.trim()) { n.value = acc.nm; grow(n); }
}

function openPts(note){
  if (!getUser()) return openAuth('lg', '', m => openPts(m));
  const o = $('ov'); clearInterval(qt); document.body.style.overflow = 'hidden'; o.hidden = false;
  o.innerHTML = `<div><h3>${esc(D.ptT)}</h3><p class="sub" style="margin:14px 0">${esc(D.ptInfo)}</p><p class="msg good" style="min-height:0;margin:0 0 6px">${esc(typeof note === 'string' ? note : '')}</p><div id="pbody"><p class="msg" style="color:var(--mute)">à¸à¸³à¸¥à¸±à¸à¹à¸«à¸¥à¸...</p></div><button type="button" class="btn2" id="oc" style="width:100%;margin-top:14px">à¸à¸´à¸</button></div>`;
  $('oc').onclick = closeOv; drawPts();
}
async function drawPts(){
  const b = $('pbody'); if (!b) return;
  const u = getUser(); if (!u) return;
  const k = encodeURIComponent(u);
  let me = null, av = '';
  try { [me, av] = await Promise.all([db('lu/' + k), db('lua/' + k)]); } catch { if ($('pbody')) b.innerHTML = '<p class="msg">à¹à¸«à¸¥à¸à¸à¹à¸­à¸¡à¸¹à¸¥à¹à¸¡à¹à¹à¸à¹ à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸à¸à¸°à¸à¸°</p>'; return; }
  if (!$('pbody')) return;
  acc.nm = (me && me.nm) || '';
  const A = 'accept="image/jpeg,image/png,image/webp"';
  b.innerHTML = `<div class="pc"><div class="rav" id="pav" style="width:84px;height:84px;margin:0 auto 10px;font-size:34px">${esc(ini(u))}</div><small>${esc(acc.nm || 'à¹à¸à¹à¸¡à¸ªà¸°à¸ªà¸¡à¸à¸­à¸à¸à¸¸à¸')}</small><b>${esc((me && +me.pts) || 0)}</b><span>@${esc(u)}</span></div>
  <h4 class="pht">à¹à¸à¸£à¹à¸à¸¥à¹</h4>
  <label class="lb" for="pn">à¸à¸·à¹à¸­à¸à¸µà¹à¹à¸ªà¸à¸ (à¹à¸¡à¹à¸à¸±à¸à¸à¸±à¸)</label><input type="text" id="pn" maxlength="40" value="${esc(acc.nm)}">
  <label class="lb">à¸£à¸¹à¸à¹à¸à¸£à¹à¸à¸¥à¹</label><p class="rnote">à¹à¸¥à¸·à¸­à¸à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡à¹à¸à¹à¸²à¸à¸±à¹à¸à¸à¸°à¸à¸°</p>
  <label class="drop"><input type="file" id="pf" ${A}><span id="pft">à¹à¸à¸°à¹à¸à¸·à¹à¸­à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¹à¸à¸£à¹à¸à¸¥à¹à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡</span><img id="pfv" class="rd" alt="" hidden></label>
  <button type="button" class="cta" id="ps">à¸à¸±à¸à¸à¸¶à¸à¹à¸à¸£à¹à¸à¸¥à¹</button><p class="msg" id="rm" role="status"></p>
  <button type="button" class="btn2" id="pl" style="width:100%;margin-top:18px">à¸­à¸­à¸à¸à¸²à¸à¸£à¸°à¸à¸</button>`;
  if (RV_OK.test(av || '')) { $('pav').style.backgroundImage = `url("${av}")`; $('pav').textContent = ''; }
  pickImg($('pf'), $('pft'), $('pfv'), 'à¹à¸à¸°à¹à¸à¸·à¹à¸­à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¹à¸à¸£à¹à¸à¸¥à¹à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡');
  $('ps').onclick = async () => {
    const f = $('pf').files[0], m = $('rm'), btn = $('ps'); btn.disabled = true; m.className = 'msg good'; m.textContent = 'à¸à¸³à¸¥à¸±à¸à¸à¸±à¸à¸à¸¶à¸...';
    try { const nn = $('pn').value.trim(); await db('lu/' + k + '/nm', nn); if (f) await db('lua/' + k, await shrink(f, 160, 160, .8)); acc.nm = nn; if (window.chatAuthChanged) window.chatAuthChanged(); drawPts(); }
    catch { btn.disabled = false; m.className = 'msg'; m.textContent = 'à¸à¸±à¸à¸à¸¶à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸ à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸à¸à¸°à¸à¸°'; }
  };
  $('pl').onclick = () => { dropUser(); closeOv(); };
}
$('pb').onclick = () => getUser() ? openPts() : openAuth('lg', '', m => openPts(m));



/* ===== à¹à¸à¸à¸à¸±à¸à¹à¸­à¸à¸¡à¸´à¸ (à¸à¸µà¹à¸à¸à¹à¹à¸à¸ index + à¹à¸à¸à¸ªà¹à¸¡ + Discord) ===== */
(() => {
  const LS = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const mkId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const tm = t => { const d = new Date(t), n = new Date(), h = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); return d.toDateString() === n.toDateString() ? h : d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) + ' ' + h; };
  const toList = o => Object.entries(o || {}).map(([id, m]) => ({ ...m, id })).sort((a, b) => (a.t || 0) - (b.t || 0));
  const fitTa = t => { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 110) + 'px'; };
  const adminName = () => (D.chName || '').trim() || 'à¹à¸­à¸à¸¡à¸´à¸';
  const rules = () => Array.isArray(D.chKw) ? D.chKw.filter(r => r && (r.k || r.b)) : [];
  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const keysOf = r => String(r.k || '').split(/[,\n]/).concat(r.b ? [r.b] : []).map(norm).filter(Boolean);
  const matchKw = tx => { const q = norm(tx), rs = rules(); return rs.find(r => keysOf(r).includes(q)) || rs.find(r => keysOf(r).some(k => q.includes(k))); };

  let cid = getUser() ? 'u_' + getUser() : LS.get('lb_cid'), nm = getUser() ? (LS.get('lb_cn') || getUser()) : (LS.get('lb_cn') || ''), isOpen = false, chatAdmin = false, chatFull = false, sig = '', timer, lastT = 0, loc = [], adminCid = '';
  const fab = $('chf'), pan = $('chp'), body = $('chbody');
  const chatPath = () => 'lch/' + (chatAdmin ? adminCid : cid);
  const chatSay = (t, good) => { let m = body.querySelector('.chmsg'); if (!m) { m = document.createElement('p'); m.className = 'chmsg'; body.prepend(m); } m.textContent = t || ''; m.className = 'chmsg' + (good ? ' good' : ''); };

  const intro = () => D.chHi && !chatAdmin ? `<div class="bb ot"><em class="bl">${esc(adminName())}</em>${esc(D.chHi)}</div>` : '';

  function bubbles(list) {
    return list.map(m => {
      const isAd = m.s === 'a' || m.f === 'a' || m.f === 'b';
      let cls;
      if (chatAdmin) cls = isAd ? 'me' : 'ot';
      else cls = isAd ? 'ot' : 'me';
      const who = isAd ? adminName() : (m.nick || (chatAdmin ? 'à¸¥à¸¹à¸à¸à¹à¸²' : nm) || 'à¸à¸¸à¸');
      const showWho = isAd || chatAdmin;
      return `<div class="bb ${cls}">${showWho ? `<em class="bl">${esc(who)}</em>` : ''}${esc(m.tx || '')}<small>${esc(tm(m.t))}</small></div>`;
    }).join('');
  }

  function drawName() {
    body.innerHTML = `<div class="chb"><div class="chn">${intro()}<label class="lb" for="chnm" style="margin-top:16px">à¸à¸·à¹à¸­à¸à¸­à¸à¸à¸¸à¸</label><input type="text" id="chnm" maxlength="40" placeholder="à¸à¸·à¹à¸­à¸à¸µà¹à¸­à¸¢à¸²à¸à¹à¸«à¹à¹à¸­à¸à¸¡à¸´à¸à¹à¸£à¸µà¸¢à¸" autocomplete="name" value="${esc(nm)}"><button type="button" class="cta" id="chgo" style="margin-top:4px">à¹à¸£à¸´à¹à¸¡à¹à¸à¸</button></div></div>`;
    const go = () => {
      const v = $('chnm').value.trim();
      if (!v) return $('chnm').focus();
      nm = v; LS.set('lb_cn', nm);
      if (!cid) {
        cid = 'C' + Math.random().toString(36).slice(2, 11);
        LS.set('lb_cid', cid);
      }
      drawChat();
    };
    $('chgo').onclick = go;
    $('chnm').onkeydown = e => { if (e.key === 'Enter') go(); };
    setTimeout(() => $('chnm') && $('chnm').focus(), 150);
  }

  async function drawInbox() {
    adminCid = '';
    body.innerHTML = '<div class="chb" id="chm"><p style="text-align:center;opacity:.7;margin:20px 0">à¸à¸³à¸¥à¸±à¸à¹à¸«à¸¥à¸à¹à¸à¸à¸¥à¸¹à¸à¸à¹à¸²...</p></div>';
    await loadInbox();
  }
  async function loadInbox() {
    const el = $('chm'); if (!el || !chatAdmin || adminCid) return;
    try {
      const all = await db('lch') || {};
      const isAd = m => m.s === 'a' || m.f === 'a' || m.f === 'b';
      const rows = Object.entries(all).map(([id, th]) => {
        const l = toList(th), last = l[l.length - 1] || {}, cu = [...l].reverse().find(m => !isAd(m));
        return { id, last, name: (cu && cu.nick) || 'à¸¥à¸¹à¸à¸à¹à¸²', t: last.t || 0, wait: !!last.t && !isAd(last) };
      }).sort((a, b) => b.t - a.t);
      if (!$('chm') || adminCid) return;
      el.innerHTML = rows.length ? rows.map(r => `<button type="button" class="ibx" data-ci="${esc(r.id)}"><b>${esc(r.name)}${r.wait ? '<i class="ibd"></i>' : ''}</b><span>${esc(String(r.last.tx || '').slice(0, 60))}</span><small>${r.t ? esc(tm(r.t)) : ''}</small></button>`).join('') : '<p style="text-align:center;opacity:.7;margin:20px 0">à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¹à¸à¸à¸à¸²à¸à¸¥à¸¹à¸à¸à¹à¸²à¸à¹à¸°</p>';
      el.querySelectorAll('[data-ci]').forEach(b => b.onclick = () => { adminCid = b.dataset.ci; drawChat(); });
    } catch { el.innerHTML = '<p style="text-align:center;opacity:.8;margin:20px 12px">à¹à¸«à¸¥à¸à¹à¸à¸à¹à¸¡à¹à¹à¸à¹ à¸à¸£à¸§à¸à¸§à¹à¸² Rules à¸à¸­à¸ Realtime Database à¹à¸«à¹à¹à¸­à¸à¸¡à¸´à¸à¸­à¹à¸²à¸ lch à¹à¸à¹</p>'; }
  }

  function drawChat() {
    const chips = rules().filter(r => r.b);
    body.innerHTML = `<div class="chb" id="chm">${intro()}</div>${chatAdmin ? `<div class="chq"><button type="button" id="chback">â à¸à¸¸à¸à¹à¸à¸</button><button type="button" id="chdel">à¸¥à¸à¹à¸à¸à¸à¸µà¹</button></div>` : chips.length ? `<div class="chq">${chips.map((r, i) => `<button type="button" data-cq="${i}">${esc(r.b)}</button>`).join('')}</div>` : ''}<div class="chi"><textarea id="chtx" rows="1" maxlength="500" placeholder="${chatAdmin ? 'à¸à¸­à¸à¹à¸à¸à¸²à¸à¸°à¹à¸­à¸à¸¡à¸´à¸...' : 'à¸à¸´à¸¡à¸à¹à¸à¹à¸­à¸à¸§à¸²à¸¡...'}"></textarea><button type="button" id="chsd" aria-label="à¸ªà¹à¸">â¤</button></div>`;
    sig = '';
    if (chatAdmin) {
      $('chback').onclick = () => drawInbox();
      $('chdel').onclick = async () => { if (!confirm('à¸¥à¸à¹à¸à¸à¸à¸µà¹à¸à¸±à¹à¸à¸«à¸¡à¸?')) return; try { await db('lch/' + adminCid, null, 'DELETE'); drawInbox(); } catch { $('chdel').textContent = 'à¸¥à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸'; } };
    }
    const t = $('chtx');
    t.oninput = () => fitTa(t);
    t.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } };
    $('chsd').onclick = () => send();
    body.querySelectorAll('[data-cq]').forEach(b => b.onclick = () => { if (!chatAdmin) send(chips[+b.dataset.cq].b); });
    refresh();
    setTimeout(() => t.focus(), 100);
  }

  async function refresh() {
    if (chatAdmin && !adminCid) return loadInbox();
    if (!(chatAdmin ? adminCid : cid) || !isOpen || !$('chm')) return;
    try {
      let data = {}; try { data = await db(chatPath()) || {}; } catch {}
      const list = toList(data).concat(chatAdmin ? [] : loc).sort((a, b) => (a.t || 0) - (b.t || 0));
      const s = list.map(m => m.id).join();
      if (s !== sig) {
        sig = s;
        const el = $('chm');
        el.innerHTML = intro() + bubbles(list);
        el.scrollTop = el.scrollHeight;
      }
      // unread when closed handled by peek
    } catch {}
  }

  async function send(over) {
    const t = $('chtx'), b = $('chsd');
    if (!t || !b) return;
    const tx = (over || t.value).trim();
    if (!tx || b.disabled) return;
    b.disabled = true;
    const now = Date.now();
    try {
      const id = (chatAdmin ? 'a' : 'm') + mkId();
      const msg = { s: chatAdmin ? 'a' : 'u', f: chatAdmin ? 'a' : 'c', tx: tx.slice(0, 500), t: now, nick: chatAdmin ? adminName() : nm };
      await db(chatPath() + '/' + id, msg);
      if (!over) { t.value = ''; fitTa(t); }
      await refresh();
      if (!chatAdmin) {
        // à¸à¸­à¸à¸à¸¥à¸±à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´ (à¸à¸µà¸¢à¹à¹à¸§à¸´à¸£à¹à¸ à¸«à¸£à¸·à¸­à¸à¹à¸­à¸à¸§à¸²à¸¡à¸ªà¸³à¸£à¸­à¸à¹à¸¡à¸·à¹à¸­à¹à¸¡à¹à¸à¸£à¸)
        try {
          const r = matchKw(tx);
          let rt = r && r.tx ? String(r.tx) : '';
          if (!rt && (D.chFb || '').trim() && Date.now() - (+LS.get('lb_fbt') || 0) > 1800000) { rt = String(D.chFb).trim(); LS.set('lb_fbt', String(Date.now())); }
          if (rt) {
            await new Promise(ok => setTimeout(ok, 400));
            await db(chatPath() + '/' + ('a' + mkId()), { s: 'a', f: 'b', tx: rt.slice(0, 1000), t: Date.now(), nick: adminName() });
            await refresh();
          }
        } catch { if (t) t.placeholder = 'à¸à¸­à¸à¸à¸¥à¸±à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸ (à¹à¸à¹à¸ Rules à¸à¸­à¸ Realtime Database à¹à¸«à¹à¹à¸à¸µà¸¢à¸ lch à¹à¸à¹)'; }
        // Discord
        if (D.whChat) hook(D.whChat, `ð¬ à¹à¸à¸à¸à¸²à¸ ${nm || 'à¸¥à¸¹à¸à¸à¹à¸²'}${getUser() ? ' (@' + getUser() + ')' : ''}\n${tx.slice(0, 300)}`, null, adminName());
      }
      lastT = now;
    } catch {
      // à¸à¸²à¸à¸à¹à¸­à¸¡à¸¹à¸¥à¸£à¸±à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¹à¸¡à¹à¹à¸à¹ (à¸¡à¸±à¸à¹à¸à¹à¸à¹à¸à¸£à¸²à¸° Rules) â à¸¢à¸±à¸à¹à¸ªà¸à¸à¸à¸à¸ªà¸à¸à¸à¸²à¹à¸¥à¸°à¸à¸³à¸à¸­à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´à¹à¸à¹à¸à¸£à¸·à¹à¸­à¸à¹à¸«à¹à¸¥à¸¹à¸à¸à¹à¸²à¹à¸«à¹à¸
      if (!chatAdmin) {
        loc.push({ id: 'Lu' + mkId(), s: 'u', f: 'c', tx: tx.slice(0, 500), t: now, nick: nm });
        const r = matchKw(tx);
        if (r && r.tx) loc.push({ id: 'La' + mkId(), s: 'a', f: 'b', tx: String(r.tx).slice(0, 1000), t: now + 1, nick: adminName() });
        if (!over && t) { t.value = ''; fitTa(t); }
        sig = ''; await refresh();
      }
      if (t) t.placeholder = chatAdmin ? 'à¸ªà¹à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸ à¹à¸à¹à¸ Rules à¸à¸­à¸ Realtime Database' : 'à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸µà¹à¸¢à¸±à¸à¹à¸¡à¹à¸à¸¶à¸à¹à¸­à¸à¸¡à¸´à¸ (à¸£à¸°à¸à¸à¸£à¸±à¸à¹à¸à¸à¸à¸±à¸à¸à¹à¸­à¸à¸à¸±à¹à¸§à¸à¸£à¸²à¸§) à¸à¸±à¸à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­à¹à¸à¹à¹à¸¥à¸¢à¸à¹à¸°';
    }
    b.disabled = false;
    if (!over && t) t.focus();
  }

  async function peek() {
    if (!cid || isOpen || document.hidden) return;
    try {
      const data = await db(chatPath()) || {};
      const list = toList(data);
      const last = list[list.length - 1];
      $('chd').hidden = !(last && (last.s === 'a' || last.f === 'a' || last.f === 'b') && last.t > lastT);
    } catch {}
  }

  function setAdminUI(on) {
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
const billTxt = r => ['ð§¾ à¸à¸´à¸¥ ' + r.id, 'à¸à¸´à¸§à¸à¸µà¹ ' + (r.no || '-'), 'à¸à¸·à¹à¸­: ' + r.name, 'à¸§à¸±à¸à¹à¸à¸´à¸: ' + thB(r.bd) + (r.bt ? ' à¹à¸§à¸¥à¸² ' + r.bt : ''), 'à¸£à¸²à¸¨à¸µ: ' + r.zd,
  'à¸à¸´à¸à¸à¹à¸­: ' + r.cs.map(c => c[0] + ' ' + c[1]).join(' / '), 'à¹à¸à¹à¸à¹à¸à¸: ' + r.pkg + (r.q ? '\nà¸à¸³à¸à¸²à¸¡: ' + r.q : ''), 'à¸¢à¸­à¸à¹à¸­à¸: ' + baht(r.price), r.link ? 'à¸ªà¸¥à¸´à¸: ' + r.link : ''].filter(Boolean).join('\n');

function showBill(r){
  const tx = billTxt(r);
  $('done').innerHTML = `<svg class="crown" viewBox="0 0 48 36" style="width:46px"><path d="M5 29 2 10l12 9L24 4l10 15 12-9-3 19z"/><path d="M5 33h38"/></svg><h3>${esc(D.doneT)}</h3><p>${esc(D.doneP)}</p>
  <div class="tk"><span class="stamp">PAID â¦</span><div class="bn"><small>BILL NO.</small><b>${esc(r.id)}</b></div><hr><dl>
  <dt>à¸à¸´à¸§à¸à¸µà¹</dt><dd>${esc(r.no || '-')}</dd><dt>à¸à¸·à¹à¸­</dt><dd>${esc(r.name)}</dd><dt>à¸§à¸±à¸à¹à¸à¸´à¸</dt><dd>${esc(thB(r.bd))}${r.bt ? ' Â· ' + esc(r.bt) : ''}</dd><dt>à¸£à¸²à¸¨à¸µ</dt><dd>${esc(r.zd)}</dd>
  <dt>à¸à¸´à¸à¸à¹à¸­</dt><dd>${r.cs.map(c => esc(c[0] + ': ' + c[1])).join('<br>')}</dd><dt>à¹à¸à¹à¸à¹à¸à¸</dt><dd>${esc(r.pkg)}</dd>${r.q ? '<dt>à¸à¸³à¸à¸²à¸¡</dt><dd>' + esc(r.q) + '</dd>' : ''}</dl><hr>
  <div class="tot"><span>à¸¢à¸­à¸à¹à¸­à¸</span><b>${esc(baht(r.price))}</b></div><div style="margin-top:14px;text-align:center"><span class="chip">${esc(r.st)}</span></div></div>
  <div class="cb" id="cb" style="display:block"></div><p class="msg good" id="bm"></p><button type="button" class="btn2" id="exitb" style="width:100%;margin-top:14px">à¸­à¸­à¸</button>`;
  const big = document.createElement('button'); big.type = 'button'; big.className = 'cta'; big.textContent = D.bCopy; $('cb').append(big);
  big.onclick = () => { cp(tx); $('bm').textContent = 'à¸à¸±à¸à¸¥à¸­à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¸´à¸¥à¹à¸¥à¹à¸§ à¸§à¸²à¸à¹à¸à¹à¸à¸à¹à¸à¹à¹à¸¥à¸¢à¸à¸°à¸à¸° â¦'; openCt(true); };
  $('exitb').onclick = () => { try { history.replaceState(null, '', location.pathname + location.search); } catch {} location.reload(); };
  $('done').classList.add('show');
}
async function openSlip(id){
  const o = $('ov'); document.body.style.overflow = 'hidden'; o.hidden = false;
  o.innerHTML = '<div style="text-align:center"><h3>à¸ªà¸¥à¸´à¸à¹à¸­à¸à¹à¸à¸´à¸</h3><p class="sub" id="sm">à¸à¸³à¸¥à¸±à¸à¹à¸«à¸¥à¸...</p><img id="si" style="max-width:100%;border-radius:4px" alt=""><button type="button" class="btn2" id="oc" style="width:100%;margin-top:18px">à¸à¸´à¸</button></div>';
  $('oc').onclick = closeOv;
  try { const u = await db('lslip/' + encodeURIComponent(id)); if (!/^data:image\//.test(u || '')) throw 0; $('si').src = u; $('sm').remove(); } catch { $('sm').textContent = 'à¹à¸¡à¹à¸à¸à¸£à¸¹à¸à¸ªà¸¥à¸´à¸à¸à¸µà¹à¸à¹à¸°'; }
}
/* ===== à¸«à¸à¹à¸²à¸£à¸µà¸§à¸´à¸§ ===== */
const RV_OK = /^data:image\//, RV_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ini = n => { const a = [...(window.Intl && Intl.Segmenter ? new Intl.Segmenter('th').segment(n) : [...n].map(x => ({ segment: x })))]; return a.length ? a[0].segment : 'â¦'; };
const rvDate = t => new Date(t).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
const rvCard = r => `<div class="rv"><div class="rh"><div class="rav"${r.a ? ` data-ra="${esc(r.id)}"` : ''}>${esc(ini(r.nm || ''))}</div><span><b>${esc(r.nm)}</b><small>${esc(rvDate(r.t))}</small></span></div><p>${esc(r.tx)}</p>${r.p ? `<img class="rph" data-rp="${esc(r.id)}" alt="à¸£à¸¹à¸à¸à¸²à¸à¸£à¸µà¸§à¸´à¸§" hidden>` : ''}</div>`;

function openR(note){
  const o = $('ov'); document.body.style.overflow = 'hidden'; o.hidden = false; clearInterval(qt);
  o.innerHTML = `<div><h3>${esc(D.rvT)}</h3><p class="msg good" style="min-height:0;margin:6px 0 0">${esc(typeof note === 'string' ? note : '')}</p><button type="button" class="cta" id="rw" style="margin:12px 0 20px">â à¹à¸à¸µà¸¢à¸à¸£à¸µà¸§à¸´à¸§</button><div id="rl"><p class="msg" style="color:var(--mute)">à¸à¸³à¸¥à¸±à¸à¹à¸«à¸¥à¸...</p></div><button type="button" class="btn2" id="oc" style="width:100%;margin-top:14px">à¸à¸´à¸</button></div>`;
  $('oc').onclick = closeOv; $('rw').onclick = openRW;
  loadRvList();
}
async function loadRvList(){
  try {
    const p = await db('lrv') || {};
    const rows = Object.entries(p).map(([id, r]) => ({ ...r, id })).sort((a, b) => b.t - a.t).slice(0, 50);
    if (!$('rl')) return;
    $('rl').innerHTML = rows.length ? rows.map(rvCard).join('') : `<p class="msg" style="color:var(--mute)">${esc(D.rvEmpty)}</p>`;
    $('rl').querySelectorAll('[data-ra]').forEach(async el => {
      try { const u = await db('lrva/' + encodeURIComponent(el.dataset.ra)); if (RV_OK.test(u || '')) { el.style.backgroundImage = `url("${u}")`; el.textContent = ''; } } catch {}
    });
    $('rl').querySelectorAll('[data-rp]').forEach(async el => {
      try { const u = await db('lrvp/' + encodeURIComponent(el.dataset.rp)); if (RV_OK.test(u || '')) { el.src = u; el.hidden = false; } } catch {}
    });
  } catch { if ($('rl')) $('rl').innerHTML = '<p class="msg">à¹à¸«à¸¥à¸à¸£à¸µà¸§à¸´à¸§à¹à¸¡à¹à¹à¸à¹ à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸à¸à¸°à¸à¸°</p>'; }
}
function pickImg(inp, txt, img, ph){
  inp.addEventListener('change', () => {
    const f = inp.files[0];
    if (!f) { txt.textContent = ph; img.hidden = true; return; }
    if (!RV_TYPES.includes(f.type)) { inp.value = ''; txt.textContent = ph; img.hidden = true; $('rm').textContent = 'à¹à¸¥à¸·à¸­à¸à¹à¸à¹à¹à¸à¸à¸²à¸°à¸£à¸¹à¸ JPG / PNG / WebP à¸à¹à¸°'; return; }
    $('rm').textContent = ''; img.src = URL.createObjectURL(f); img.hidden = false; txt.textContent = f.name;
  });
}
function openRW(){
  const A = 'accept="image/jpeg,image/png,image/webp"';  /* à¹à¸¡à¹à¹à¸ªà¹ capture = à¹à¸¡à¹à¸à¸±à¸à¸à¸±à¸à¹à¸à¸´à¸à¸à¸¥à¹à¸­à¸ à¹à¸«à¹à¹à¸¥à¸·à¸­à¸à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡ */
  $('ov').innerHTML = `<div><h3>à¹à¸à¸µà¸¢à¸à¸£à¸µà¸§à¸´à¸§</h3>
  <label class="lb" for="rn">à¸à¸·à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²</label><input type="text" id="rn" maxlength="60" placeholder="à¸à¸·à¹à¸­à¸à¸µà¹à¸­à¸¢à¸²à¸à¹à¸«à¹à¹à¸ªà¸à¸" autocomplete="name">
  <label class="lb" for="rt">à¸à¹à¸­à¸à¸§à¸²à¸¡à¸£à¸µà¸§à¸´à¸§</label><textarea id="rt" rows="5" maxlength="600" placeholder="à¹à¸¥à¹à¸²à¸à¸§à¸²à¸¡à¸à¸£à¸°à¸à¸±à¸à¹à¸à¹à¸«à¹à¸à¸±à¸à¸«à¸à¹à¸­à¸¢à¸à¸°à¸à¸°"></textarea>
  <label class="lb">à¸£à¸¹à¸à¸à¸µà¹à¸­à¸¢à¸²à¸à¹à¸à¸à¹à¸ªà¹à¸£à¸µà¸§à¸´à¸§ (à¸à¹à¸²à¸¡à¸µ)</label>
  <label class="drop"><input type="file" id="rp" ${A}><span id="rpt">à¹à¸à¸°à¹à¸à¸·à¹à¸­à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡</span><img id="rpv" alt="" hidden></label>
  <label class="lb" style="margin-top:14px">à¸£à¸¹à¸à¹à¸à¸£à¹à¸à¸¥à¹à¸¥à¸¹à¸à¸à¹à¸²</label>
  <p class="rnote">à¹à¸¥à¸·à¸­à¸à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡à¹à¸à¹à¸²à¸à¸±à¹à¸à¸à¸°à¸à¸°</p>
  <label class="drop"><input type="file" id="ra" ${A}><span id="rat">à¹à¸à¸°à¹à¸à¸·à¹à¸­à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¹à¸à¸£à¹à¸à¸¥à¹à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡</span><img id="rav" class="rd" alt="" hidden></label>
  <button type="button" class="cta" id="rs">à¸ªà¹à¸à¸£à¸µà¸§à¸´à¸§</button><p class="msg" id="rm" role="status"></p>
  <button type="button" class="btn2" id="rbk" style="width:100%">â à¸à¸¥à¸±à¸</button></div>`;
  pickImg($('rp'), $('rpt'), $('rpv'), 'à¹à¸à¸°à¹à¸à¸·à¹à¸­à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡');
  pickImg($('ra'), $('rat'), $('rav'), 'à¹à¸à¸°à¹à¸à¸·à¹à¸­à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¹à¸à¸£à¹à¸à¸¥à¹à¸à¸²à¸à¸­à¸±à¸¥à¸à¸±à¹à¸¡');
  $('rbk').onclick = () => openR();
  $('rs').onclick = async () => {
    const nm = $('rn').value.trim(), tx = $('rt').value.trim(), fp = $('rp').files[0], fa = $('ra').files[0], m = $('rm'), b = $('rs');
    if (!nm) { $('rn').focus(); return m.textContent = 'à¸à¸£à¸¸à¸à¸²à¸à¸£à¸­à¸à¸à¸·à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²à¸à¹à¸­à¸à¸à¹à¸°'; }
    if (!tx) { $('rt').focus(); return m.textContent = 'à¸à¸£à¸¸à¸à¸²à¹à¸à¸µà¸¢à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¸£à¸µà¸§à¸´à¸§à¸à¹à¸­à¸à¸à¹à¸°'; }
    if ([fp, fa].some(f => f && f.size > 8 * 1024 * 1024)) return m.textContent = 'à¸£à¸¹à¸à¹à¸«à¸à¹à¹à¸à¸´à¸ 8 MB à¸¥à¸­à¸à¹à¸¥à¸·à¸­à¸à¸£à¸¹à¸à¸­à¸·à¹à¸à¸à¸°à¸à¸°';
    b.disabled = true; m.className = 'msg good'; m.textContent = 'à¸à¸³à¸¥à¸±à¸à¸ªà¹à¸à¸£à¸µà¸§à¸´à¸§...';
    try {
      const id = 'RV' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
      const [ph, av] = await Promise.all([fp ? fit(fp, 800, .72) : '', fa ? shrink(fa, 160, 160, .8) : '']);
      const r = { nm, tx, t: Date.now(), a: av ? 1 : 0, p: ph ? 1 : 0 };
      await Promise.all([db('lrv/' + id, r), av && db('lrva/' + id, av), ph && db('lrvp/' + id, ph)]);
      openR('à¸à¸­à¸à¸à¸¸à¸à¸ªà¸³à¸«à¸£à¸±à¸à¸£à¸µà¸§à¸´à¸§à¸à¹à¸° â¦');
    } catch { b.disabled = false; m.className = 'msg'; m.textContent = 'à¸ªà¹à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸ à¸¥à¸­à¸à¹à¸«à¸¡à¹à¸­à¸µà¸à¸à¸£à¸±à¹à¸à¸à¸°à¸à¸°'; }
  };
}
/* ===== à¸à¸¸à¹à¸¡à¸à¸´à¸à¸à¹à¸­ (popup) ===== */
const SI = {
 LINE:'<path d="M12 3.5c-4.7 0-8.5 3-8.5 6.8 0 3.3 2.9 6 6.8 6.7l-.4 3 4-3.2c3.7-.6 6.6-3.3 6.6-6.5 0-3.8-3.8-6.8-8.5-6.8z"/><path d="M8.5 10.3h.01M12 10.3h.01M15.5 10.3h.01"/>',
 Facebook:'<circle cx="12" cy="12" r="9"/><path d="M13.5 20v-7h2.3l.4-2.7h-2.7V8.8c0-.8.3-1.3 1.4-1.3h1.4V5.1C15.6 5 14.8 5 14 5c-2.1 0-3.5 1.3-3.5 3.6v1.7H8.2V13h2.3v7"/>',
 Instagram:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.01"/>',
 TikTok:'<path d="M14 4v10.2a3.2 3.2 0 1 1-3.2-3.2"/><path d="M14 4c.3 2.3 1.8 3.8 4.2 4"/>',
 X:'<path d="M5 5l14 14M19 5L5 19"/>',
 YouTube:'<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10.5 9.5v5l4-2.5z"/>',
 Telegram:'<path d="M20.5 4L3.5 10.8l5.3 2 1.8 5.7 3-3.7 4.6 3.4z"/><path d="M8.8 12.8L20.5 4"/>',
 'à¹à¸à¸£':'<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4.5 6a2 2 0 0 1 2-2z"/>',
 'à¸­à¸µà¹à¸¡à¸¥':'<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
 'à¸¥à¸´à¸à¸à¹à¸­à¸·à¹à¸':'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};
const STY = Object.keys(SI);
const siKey = t => STY.find(k => k.toLowerCase() === String(t || '').trim().toLowerCase()) || 'à¸¥à¸´à¸à¸à¹à¸­à¸·à¹à¸';
const lnk = (t, u) => { t = siKey(t); u = String(u || '').trim(); if (/^(https?:|tel:|mailto:)/i.test(u)) return u; if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return ''; if (t === 'à¹à¸à¸£') return 'tel:' + u.replace(/[^\d+]/g, ''); if (t === 'à¸­à¸µà¹à¸¡à¸¥') return 'mailto:' + u; return 'https://' + u; };
function openCt(bill){
  const l = [...(D.socials || []), ...(bill === true ? (D.contacts || []).map(c => ({ type: 'à¸¥à¸´à¸à¸à¹à¸­à¸·à¹à¸', name: c.label, url: c.url })) : [])].map(c => ({ ...c, h: lnk(c.type, c.url) })).filter(c => c.h);
  $('ctl').innerHTML = l.length ? l.map(c => `<a class="ck" href="${esc(c.h)}" target="${/^https?:/i.test(c.h) ? '_blank' : '_self'}" rel="noopener"><i><svg viewBox="0 0 24 24">${SI[siKey(c.type)]}</svg></i><span><b>${esc(c.name || c.type)}</b><small>${esc(c.type)}</small></span><em>âº</em></a>`).join('') : `<p class="sub">${esc(D.ctEmpty)}</p>`;
  $('ctn').textContent = bill === true ? 'à¸à¸±à¸à¸¥à¸­à¸à¸à¸´à¸¥à¹à¸¥à¹à¸§ à¹à¸¥à¸·à¸­à¸à¸à¹à¸­à¸à¸à¸²à¸à¸à¹à¸²à¸à¸¥à¹à¸²à¸à¹à¸¥à¹à¸§à¸§à¸²à¸à¹à¸à¹à¸à¸à¹à¸à¹à¹à¸¥à¸¢à¸à¸°à¸à¸° â¦' : '';
  openM('mk');
}
$('ctb').onclick = () => openCt();
$('rb').onclick = () => openR();

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
  rm.onclick = async () => { if (!confirm('à¸¥à¸à¸à¸´à¸§à¸à¸µà¹?')) return; try { await Promise.all(['lq', 'lslip', 'lpub'].map(k => db(k + '/' + r.id, null, 'DELETE'))); d.remove(); } catch {} };
  return d;
}
async function loadQ(){
  const b = $('qs'); b.textContent = 'à¸à¸³à¸¥à¸±à¸à¹à¸«à¸¥à¸...';
  try {
    const rows = Object.values(await db('lq') || {}).sort((x, y) => x.t - y.t);
    b.innerHTML = '<datalist id="stl">' + String(D.stList).split(',').map(x => `<option value="${esc(x.trim())}">`).join('') + '</datalist>' + (rows.length ? '' : '<p class="sub">à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸à¸´à¸§</p>');
    rows.forEach(r => b.appendChild(qrow(r)));
  } catch (e) { b.textContent = 'à¹à¸«à¸¥à¸à¸à¸´à¸§à¹à¸¡à¹à¹à¸à¹ (' + e.message + ') à¹à¸à¹à¸ Rules à¸à¸­à¸ Realtime Database'; }
}
async function loadRv(){
  const b = $('rvs'); if (!b) return; b.textContent = 'à¸à¸³à¸¥à¸±à¸à¹à¸«à¸¥à¸...';
  try {
    const rows = Object.entries(await db('lrv') || {}).map(([id, r]) => ({ ...r, id })).sort((x, y) => y.t - x.t);
    b.innerHTML = rows.length ? '' : '<p class="sub">à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¸£à¸µà¸§à¸´à¸§</p>';
    rows.forEach(r => {
      const d = document.createElement('div'); d.className = 'qrow';
      d.innerHTML = `<b>${esc(r.nm)}</b><small>${esc(r.id)} Â· ${esc(new Date(r.t).toLocaleString('th-TH'))}${r.p ? ' Â· à¸¡à¸µà¸£à¸¹à¸à¹à¸à¸' : ''}</small><p>${esc(r.tx)}</p><div class="qa"><button type="button" class="btn2">à¸¥à¸à¸£à¸µà¸§à¸´à¸§</button></div>`;
      d.querySelector('button').onclick = async () => { if (!confirm('à¸¥à¸à¸£à¸µà¸§à¸´à¸§à¸à¸µà¹?')) return; try { await Promise.all(['lrv', 'lrva', 'lrvp'].map(k => db(k + '/' + r.id, null, 'DELETE'))); d.remove(); } catch {} };
      b.appendChild(d);
    });
  } catch (e) { b.textContent = 'à¹à¸«à¸¥à¸à¸£à¸µà¸§à¸´à¸§à¹à¸¡à¹à¹à¸à¹ (' + e.message + ')'; }
}
const newId = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return 'LB' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(); };
function mqHtml(){
  const ct = String(D.cTypes).split(',').map(x => x.trim()).filter(Boolean);
  return `<div class="qrow"><label>à¸à¸·à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²</label><input type="text" id="mqn" maxlength="100">
  <label>à¹à¸à¹à¸à¹à¸à¸</label><select id="mqp">${(() => { let k = 0; return D.categories.map(c => c.packages.length ? `<optgroup label="${esc(c.name)}">` + c.packages.map(p => `<option value="${k++}">${esc(p.name)} Â· ${esc(baht(p.price))}</option>`).join('') + '</optgroup>' : '').join(''); })()}</select>
  <label>à¸£à¸²à¸à¸² (à¸à¸²à¸) à¹à¸à¹à¹à¸à¹</label><input type="number" id="mqx" min="0" step="0.01" value="${esc((PK[0] || {}).price || 0)}">
  <div class="two"><div><label>à¸§à¸±à¸à¹à¸à¸´à¸</label><input type="date" id="mqd"></div><div><label>à¹à¸§à¸¥à¸²à¹à¸à¸´à¸</label><input type="time" id="mqt"></div></div>
  <label>à¸£à¸²à¸¨à¸µ</label><select id="mqz">${ZD.map(z => `<option${z === 'à¹à¸¡à¹à¸à¸£à¸²à¸' ? ' selected' : ''}>${z}</option>`).join('')}</select>
  <label>à¸à¹à¸­à¸à¸à¸²à¸à¸à¸´à¸à¸à¹à¸­</label>${ct.map(x => `<input type="text" data-mc="${esc(x)}" placeholder="${esc(x)}" maxlength="100">`).join('')}
  <label>à¸à¸³à¸à¸²à¸¡ / à¹à¸£à¸·à¹à¸­à¸à¸à¸µà¹à¸­à¸¢à¸²à¸à¸à¸¹</label><textarea id="mqq" rows="2" maxlength="400"></textarea>
  <label>à¸ªà¸à¸²à¸à¸°</label><input type="text" id="mqs" list="stl" value="${esc(D.stDef)}">
  <div class="qa"><button type="button" class="btn2" id="mqv">à¸à¸±à¸à¸à¸¶à¸à¸à¸´à¸§</button><button type="button" class="btn2" id="mqc">à¸¢à¸à¹à¸¥à¸´à¸</button></div><p class="msg" id="mqm"></p></div>`;
}
function openMq(){
  const w = $('mqw'); w.innerHTML = mqHtml();
  $('mqp').onchange = () => $('mqx').value = PK[$('mqp').value].price;
  $('mqc').onclick = () => w.innerHTML = '';
  $('mqv').onclick = async () => {
    const m = $('mqm'), v = $('mqv'), name = $('mqn').value.trim(), price = parseFloat($('mqx').value), pk = PK[$('mqp').value];
    if (!pk) return $('mqm').textContent = 'à¸¢à¸±à¸à¹à¸¡à¹à¸¡à¸µà¹à¸à¹à¸à¹à¸à¸ à¹à¸à¸´à¹à¸¡à¹à¸à¹à¸à¹à¸à¸à¸à¹à¸­à¸à¸à¹à¸°';
    if (!name) { $('mqn').focus(); return m.textContent = 'à¸à¸£à¸¸à¸à¸²à¸à¸£à¸­à¸à¸à¸·à¹à¸­à¸¥à¸¹à¸à¸à¹à¸²à¸à¹à¸­à¸à¸à¹à¸°'; }
    if (!(price >= 0)) return m.textContent = 'à¸£à¸²à¸à¸²à¹à¸¡à¹à¸à¸¹à¸à¸à¹à¸­à¸';
    v.disabled = true; m.className = 'msg good'; m.textContent = 'à¸à¸³à¸¥à¸±à¸à¸à¸±à¸à¸à¸¶à¸...';
    try {
      const pub = await db('lpub') || {};
      const r = { id: newId(), no: Math.max(0, ...Object.values(pub).map(x => x.no || 0)) + 1, name, bd: $('mqd').value, bt: $('mqt').value, zd: $('mqz').value, q: $('mqq').value.trim(),
        cs: [...document.querySelectorAll('#mqw [data-mc]')].map(i => [i.dataset.mc, i.value.trim()]).filter(c => c[1]),
        pkg: pk.name, price, t: Date.now(), st: $('mqs').value.trim() || D.stDef, man: 1 };
      await Promise.all([db('lq/' + r.id, r), db('lpub/' + r.id, { no: r.no, nm: mask(name), pkg: r.pkg, st: r.st, t: r.t })]);
      w.innerHTML = ''; loadQ();
    } catch (e) { v.disabled = false; m.className = 'msg'; m.textContent = 'à¸à¸±à¸à¸à¸¶à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸ (' + e.message + ')'; }
  };
}
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
    catch (err) { $('am').className = 'msg'; $('am').textContent = 'à¸à¸±à¸à¸à¸¶à¸à¹à¸¡à¹à¸ªà¸³à¹à¸£à¹à¸: ' + err.message; }
  };
}
const route = () => { const h = location.hash; if (h === '#admin') openAdm(); else if (h.startsWith('#slip=')) openSlip(decodeURIComponent(h.slice(6))); };
addEventListener('hashchange', route);

// à¸à¸à¸à¹à¸­à¸à¸§à¸²à¸¡à¸à¹à¸²à¸¢à¹à¸§à¹à¸à¹à¸à¸·à¹à¸­à¹à¸à¸´à¸à¸«à¸¥à¸±à¸à¸à¹à¸²à¸
document.addEventListener('click', e => {
  if (e.target.closest && e.target.closest('#foot')) {
    openAdm();
  }
});

(async () => {
  let d = {};
  try { d = JSON.parse(localStorage.getItem('kd_data') || '{}'); } catch (e) {}
  try {
    const r = await Promise.race([fsGet(SITE), new Promise(ok => setTimeout(() => ok(null), 2500))]);
    if (r && Object.keys(r).length) { d = r; try { localStorage.setItem('kd_data', JSON.stringify(r)); } catch (e) {} }
  } catch (e) {}
  D = { ...DEFAULTS, ...d };
  if (D.ptInfo === 'à¸ªà¸¡à¸±à¸à¸£à¸¢à¸¹à¸ªà¹à¸¥à¹à¸§à¹à¸ªà¹à¸¢à¸¹à¸ªà¸à¸­à¸à¸ªà¸±à¹à¸ à¸à¸¸à¸à¸à¸£à¸±à¹à¸à¸à¸µà¹à¹à¸­à¸à¸¡à¸´à¸à¸à¸£à¸§à¸à¸ªà¸¥à¸´à¸à¹à¸¥à¹à¸§à¸à¸°à¹à¸à¹ 1 à¹à¸à¹à¸¡à¸à¹à¸° â¦') D.ptInfo = DEFAULTS.ptInfo;
  applyAll(); endIntro();
  if (getUser()) db('lu/' + getUser() + '/nm').then(n => { acc.nm = n || ''; if (window.chatAuthChanged) window.chatAuthChanged(); }).catch(() => {});
  route();
})();
