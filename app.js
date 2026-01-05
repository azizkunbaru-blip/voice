const form = document.getElementById('scriptForm');
const productPhoto = document.getElementById('productPhoto');
const photoPreview = document.getElementById('photoPreview');
const previewImage = photoPreview.querySelector('img');
const removePhoto = document.getElementById('removePhoto');
const pasteLink = document.getElementById('pasteLink');
const resetForm = document.getElementById('resetForm');
const toast = document.getElementById('toast');
const shuffleCaption = document.getElementById('shuffleCaption');

const outputs = {
  vo: document.getElementById('voOutput'),
  screen: document.getElementById('screenOutput'),
  caption: document.getElementById('captionOutput'),
};

const outputSummary = document.getElementById('outputSummary');
let captionPool = [];
let captionIndex = 0;

const templates = {
  'Kekinian Santai': [
    'Eh, ini {product} lagi rame banget, lihat deh!',
    'Coba tebak kenapa {product} ini viral?',
    'Buat kamu yang suka simpel tapi tetap keren, ini jawabannya.',
    'Stop scroll, {product} ini bikin hidup lebih praktis.',
    'Ini dia {product} yang vibe-nya anak kampus banget.',
  ],
  'Fast Hype': [
    'Wow, {product} ini gila sih!',
    'Stop! Ini {product} yang lagi diserbu!',
    'Siap-siap kepo, {product} ini langsung auto pengen.',
    'Cepet lihat, {product} ini bikin beda!',
    'Boom! {product} ini bikin auto checkout.',
  ],
  'Calm Premium': [
    'Kalau kamu suka yang elegan, ini pilihannya.',
    '{product} ini terasa clean dan classy dari first look.',
    'Detailnya halus, cocok buat yang suka premium feel.',
    'Ini {product} dengan aura tenang tapi tetap standout.',
    'Untuk kamu yang suka rapi dan kualitas, ini pas.',
  ],
  'Lucu Receh': [
    'Aku nemu {product}, dan dompetku ikutan bahagia.',
    'Kalau barang bisa ngomong, {product} ini bilang: pilih aku!',
    'Si {product} ini kecil-kecil cabe rawit.',
    'Lihat {product} ini, auto senyum-senyum sendiri.',
    'Nih barang, bikin hari jadi lebih fun.',
  ],
  'Soft Selling': [
    'Pelan-pelan aja, coba lihat {product} ini.',
    'Kalau kamu butuh yang reliable, ini bisa jadi opsi.',
    'Nggak heboh, tapi kualitasnya keliatan.',
    '{product} ini cocok buat daily use tanpa ribet.',
    'Simpel, fungsional, dan enak dipakai.',
  ],
  'Hard Selling (tetap sopan)': [
    'Biar nggak ketinggalan, {product} ini wajib kamu cek.',
    'Serius, ini best deal buat {category} sekarang.',
    'Kalau kamu butuh {product}, ini waktunya ambil.',
    'Jangan tunggu lama, stok model begini cepat habis.',
    'Langsung cek sebelum kehabisan ya.',
  ],
  Edukatif: [
    'Kalau pilih {category}, pastikan ada fitur seperti ini.',
    'Biar nggak salah pilih, lihat detail {product} ini.',
    'Tips cepat: cek bahan dan fungsi utamanya dulu.',
    'Ini contoh {category} yang spesifikasinya rapi.',
    'Buat pemula, ini pilihan yang aman dan jelas.',
  ],
  Storytelling: [
    'Kemarin aku cari {product} yang nggak ribet, ketemu ini.',
    'Aku butuh {category} yang bisa dipakai harian, lalu nemu ini.',
    'Awalnya cuma iseng, ternyata {product} ini kepake banget.',
    'Ceritanya, aku mau yang simple, tapi tetap stylish.',
    'Singkatnya, ini yang akhirnya aku pilih.',
  ],
};

const screenHooks = {
  'Kekinian Santai': ['Lagi rame banget!', 'Simple tapi keren', 'Bikin hidup praktis', 'Vibe anak kampus', 'Anti ribet!'],
  'Fast Hype': ['Auto pengen sekarang!', 'Gila sih ini', 'Langsung cek!', 'Bikin auto checkout', 'Stop scroll!'],
  'Calm Premium': ['Elegan tanpa effort', 'Clean & classy', 'Premium feel', 'Detail halus', 'Minimal tapi mewah'],
  'Lucu Receh': ['Dompetku senyum', 'Kecil-kecil nagih', 'Bikin ngakak', 'Mood booster', 'Receh tapi oke'],
  'Soft Selling': ['Tenang tapi berkelas', 'Daily use safe', 'Pilihan yang nyaman', 'Simple & fungsional', 'Worth dicoba'],
  'Hard Selling (tetap sopan)': ['Wajib cek sekarang', 'Jangan sampai kehabisan', 'Best deal hari ini', 'Saatnya ambil', 'Gas checkout'],
  Edukatif: ['Cek fitur penting', 'Tips pilih {category}', 'Jangan salah pilih', 'Bahan itu penting', 'Detail menentukan'],
  Storytelling: ['Cerita singkatku', 'Awalnya iseng...', 'Akhirnya ketemu', 'Aku pilih yang ini', 'Ini alasanku'],
};

const captionTemplates = [
  'Lagi cari {product}? Ini {style} yang bikin {benefit}.',
  'Buat {audience}, {product} ini paling pas buat {benefit}.',
  '{product} dengan {features} siap nemenin aktivitas kamu.',
  'Vibe {mood} + {style}, cocok buat yang suka {benefit}.',
  'Sederhana tapi berfungsi, ini {product} pilihan hari ini.',
  'Kalau mau {benefit}, cek {product} ini dulu.',
  'Banyak yang cari model begini, {product} ini jawabannya.',
  'Untuk daily use yang aman, {product} ini worth it.',
  'Satu kata: praktis. {product} dengan {features}.',
  'Kalau kamu tim rapi, {product} ini pas banget.',
];

const ctaMap = {
  'Cek keranjang kuning': 'Yuk cek keranjang kuningnya sekarang.',
  'Klik link di bio': 'Langsung klik link di bio buat cek detailnya.',
  'Klik tombol beli sekarang': 'Klik tombol beli sekarang biar nggak kehabisan.',
};

const promotionMap = {
  'Product Showcase (Clean)': 'fokus di detail dan look-nya',
  'Review Cepat (UGC)': 'versi review singkat dan jujur',
  Unboxing: 'momen buka box yang satisfying',
  'Problem–Solution': 'solusi praktis buat problem harian',
  'Before–After': 'perbandingan sebelum-sesudah yang jelas',
  Comparison: 'perbandingan singkat yang bikin yakin',
};

const durationMap = {
  15: 2,
  20: 3,
  30: 4,
};

const pillState = {
  ratio: '9:16',
  duration: '20',
};

const toastMessage = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove('show'), 1600);
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seededPick = (arr, seed) => arr[seed % arr.length];

const parseFeatures = (input) => input
  .split(/,|\n/)
  .map((item) => item.trim())
  .filter(Boolean);

const getPillValue = (group) => pillState[group];

const updatePillGroup = (group, value) => {
  pillState[group] = value;
  document.querySelectorAll(`[data-pill-group="${group}"] .pill`).forEach((pill) => {
    pill.classList.toggle('active', pill.dataset.value === value);
  });
};

document.querySelectorAll('.pill-group').forEach((group) => {
  group.addEventListener('click', (event) => {
    const pill = event.target.closest('.pill');
    if (!pill) return;
    updatePillGroup(group.dataset.pillGroup, pill.dataset.value);
  });
});

productPhoto.addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    photoPreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

removePhoto.addEventListener('click', () => {
  productPhoto.value = '';
  previewImage.src = '';
  photoPreview.hidden = true;
});

pasteLink.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      document.getElementById('productLink').value = text.trim();
      toastMessage('Link ditempel.');
    }
  } catch (error) {
    toastMessage('Clipboard tidak tersedia.');
  }
});

resetForm.addEventListener('click', () => {
  updatePillGroup('ratio', '9:16');
  updatePillGroup('duration', '20');
  outputs.vo.textContent = 'Upload data produk, pilih style, lalu klik Generate.';
  outputs.screen.textContent = 'Hook singkat akan muncul di sini.';
  outputs.caption.textContent = 'Caption otomatis siap copy.';
  outputSummary.innerHTML = '<span>Style: -</span><span>Durasi: -</span><span>Mood: -</span><span>Ratio: -</span>';
  captionPool = [];
  captionIndex = 0;
});

const buildCaption = (options, seed) => {
  const template = seededPick(captionTemplates, seed);
  const benefits = options.features.slice(0, 2).join(' & ') || 'benefit utamanya';
  return template
    .replace('{product}', options.product)
    .replace('{style}', options.voiceStyle)
    .replace('{benefit}', benefits)
    .replace('{audience}', options.audience || 'kamu')
    .replace('{features}', options.features.slice(0, 3).join(', '))
    .replace('{mood}', options.mood);
};

const buildHashtags = (category) => {
  const safeCategory = category.toLowerCase().replace(/\s+/g, '');
  return [`#${safeCategory}`, '#tiktokaffiliate', '#fyp'];
};

const generateScript = (formData) => {
  const seed = hashString(formData.link);
  const features = parseFeatures(formData.features);
  const featureCount = durationMap[formData.duration] || 3;
  const pickedFeatures = features.slice(0, featureCount);

  const hook = seededPick(templates[formData.voiceStyle] || templates['Kekinian Santai'], seed)
    .replace('{product}', formData.product)
    .replace('{category}', formData.category);
  const quickValue = `Versi ${formData.promoStyle} dengan vibe ${formData.mood.toLowerCase()}.`;
  const featureLine = `Highlight: ${pickedFeatures.join(', ')}.`;
  const socialProof = 'Banyak yang cari model begini karena simpel dan kepake.';
  const cta = ctaMap[formData.cta] || ctaMap['Cek keranjang kuning'];

  const vo = [hook, quickValue, featureLine, socialProof, cta].join(' ');
  const screenHook = seededPick(screenHooks[formData.voiceStyle] || screenHooks['Kekinian Santai'], seed + 7)
    .replace('{category}', formData.category);

  captionPool = Array.from({ length: 10 }, (_, index) => {
    return buildCaption({
      product: formData.product,
      voiceStyle: formData.voiceStyle,
      mood: formData.mood,
      audience: formData.audience,
      features: features,
    }, seed + index * 13);
  });
  captionIndex = 0;
  const caption = `${captionPool[captionIndex]}\n${buildHashtags(formData.category).join(' ')}`;

  return { vo, screenHook, caption };
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const link = document.getElementById('productLink').value.trim();
  const features = document.getElementById('keyFeatures').value.trim();
  const voiceStyle = document.getElementById('voiceStyle').value;

  if (!link || !features || !voiceStyle) {
    toastMessage('Lengkapi field wajib dulu ya.');
    return;
  }

  const productName = document.getElementById('productName').value.trim();
  const category = document.getElementById('productType').value;
  const promoStyle = document.getElementById('promotionStyle').value;
  const mood = document.getElementById('visualMood').value;
  const duration = getPillValue('duration');
  const ratio = getPillValue('ratio');
  const audience = document.getElementById('targetAudience').value.trim();
  const price = document.getElementById('priceRange').value.trim();
  const cta = document.getElementById('ctaStyle').value;

  const product = productName || `${category} favoritmu`;
  const data = {
    link,
    features,
    voiceStyle,
    category,
    promoStyle,
    mood,
    duration,
    ratio,
    audience,
    price,
    cta,
    product,
  };

  const result = generateScript(data);
  outputs.vo.textContent = result.vo;
  outputs.screen.textContent = result.screenHook;
  outputs.caption.textContent = result.caption;

  outputSummary.innerHTML = `
    <span>Style: ${voiceStyle}</span>
    <span>Durasi: ${duration}s</span>
    <span>Mood: ${mood}</span>
    <span>Ratio: ${ratio}</span>
  `;
});

shuffleCaption.addEventListener('click', () => {
  if (!captionPool.length) {
    toastMessage('Generate dulu sebelum shuffle.');
    return;
  }
  captionIndex = (captionIndex + 1) % captionPool.length;
  const hashtags = buildHashtags(document.getElementById('productType').value).join(' ');
  outputs.caption.textContent = `${captionPool[captionIndex]}\n${hashtags}`;
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const key = button.dataset.copy;
    const text = outputs[key].textContent;
    try {
      await navigator.clipboard.writeText(text);
      toastMessage('Copied!');
    } catch (error) {
      toastMessage('Gagal copy.');
    }
  });
});
