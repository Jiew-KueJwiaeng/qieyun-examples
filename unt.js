/* unt 切韻擬音
 *
 * 包含 4 個版本：
 *
 * - 2019：切韻朗讀音
 *   https://zhuanlan.zhihu.com/p/58227457
 *
 * - 2020：切韻擬音 J（原版）
 *   https://zhuanlan.zhihu.com/p/305516512 & https://zhuanlan.zhihu.com/p/313005024
 *
 * - 2020：切韻擬音 J（2022 新版）
 *
 * - 2022：切韻擬音 L
 *   暫無專門文章，可參閱 https://zhuanlan.zhihu.com/p/541263851
 *
 * 前兩個版本已過時，僅作爲歷史存檔，不建議使用，默認不啟用。如需啟用請勾選專業模式
 * 
 * 切韻擬音 J 和 L 的對比見 https://phesoca.com/comparison-of-reconstructions
 *
 * @author unt
 */

const is = (...x) => 音韻地位.屬於(...x);
const when = (...x) => 音韻地位.判斷(...x);

const is專業模式 = 選項.專業模式 ?? false;
const isL = 選項.版本?.includes('L') ?? true;
const isJ新版 = Boolean(選項.版本?.includes('J') && 選項.版本?.includes('新版'));
const isJ原版 = Boolean(選項.版本?.includes('J') && 選項.版本?.includes('原版'));
const is朗讀音 = Boolean(選項.版本?.includes('朗讀音'));

function get選項列表() {
  return [
    ['版本', [is專業模式 ? 4 : 2,
      '2019：切韻朗讀音',
      '2020：切韻擬音 J（原版）',
      '2020：切韻擬音 J（2022 新版）',
      '2022：切韻擬音 L',
    ].filter((_, i) => is專業模式 || [0, 3, 4].includes(i))],
    ['專業模式', is專業模式],

    // 以下一些選項內容後加了空格，是爲了在切換回其他方案時不保持改選項
    '基本選項',
    ['　【基本選項】後低元音', !is朗讀音 ? [1, 'a', 'ɑ'] : [1, 'ɑ ']],
    ['祭泰夬廢韻尾', !is朗讀音 ? [2, 'j', 'ɹ'] : [1, 'jɕ']],
    ['聲調記號', [1,
      '上ˊ 去ˋ',
      '上ʔ 去h',
      '上ˀ 去ʰ', // 上標的 ʔ Unicode 未收，以 ˀ 代替
      '五度符號',
      '五度符號（帶拖腔）',
    ].filter((_, i) => (is專業模式 || [0, 1, 3, 4].includes(i)) && !(is朗讀音 && i === 4))],
    ['鈍C介音',
      isL && [1, '開∅ 合w'] ||
      // β、ʋ 都代表雙唇近音（即 β̞ = ʋ̟）
      isJ新版 && [1, '開j̈ 唇ʋ 合w', '開j̈ 唇ʋ 合ɥ̈', '開j̈ 唇β 合ɥ̈'].slice(0, is專業模式 ? 4 : 3) ||
      isJ原版 && [1, '開j̈ 唇β 合ɥ̈ '] ||
      is朗讀音 && [1, '開j̈ 唇ɥ̈ 合ẅ'],
    ],

    is專業模式 && '高級選項',
    ['　【高級選項】知組', is專業模式 ? !isJ原版 ? [1, 'ʈ', 'tɹ'] : [2, 'ʈ ', 'tɹ '] : null],
    ['二等元音記號', is專業模式 && !is朗讀音 ? [1,
      '咽化 ◌ˤ',
      'r音鉤（帶空隙）◌˞ ',
      'r音鉤（無空隙）◌˞',
      '下等號 ◌͇',
      '雙下橫線 ◌̳', // 僅在下等號顯示不正常時使用
    ] : null],
    ['顯示純音位形式', is專業模式 && isL ? false : null],
  ].map(e => { // TODO: 推導器更新 v0.2 後簡化
    const is新推導器 = typeof document === 'undefined' || document.getElementsByTagName('nav')[0].innerText.includes('0.2');
    if (is新推導器 && typeof e === 'object') e[0] = e[0].replace(/　【.*】/, '');
    return e;
  });
}

function 調整選項() {
  選項.後低元音 = 選項.後低元音 ?? 選項['　【基本選項】後低元音'];
  選項.知組 = 選項.知組 ?? 選項['　【高級選項】知組']; // TODO: 推導器更新 v0.2 後簡化
  選項.後低元音 = 選項.後低元音.trim();
  選項.知組 = 選項.知組?.trim();
}

function 調整音韻地位() {
  function 調整(表達式, 調整屬性) { if (is(表達式)) 音韻地位 = 音韻地位.調整(調整屬性); }
  調整('明母 尤韻', { 等: '一', 韻: '侯' }); // 實爲一等
  調整('云母 非 三等 或 云母 重紐A類', { 母: '匣' }); // 現在廣韻資料中無，但其他資料中可能有
  調整('臻韻', { 韻: '眞' });
  調整('銳音 幽韻', { 韻: '尤' });
}

function get聲母() {
  return when([
    ['云母 開口 非 (侵鹽韻 入聲)', { 云: '' }], // 煜曄兩小韻爲“合口”
    ['(鈍音 非 羣母 非 三等) 或 (來母 非 三等) 或 (匣母)', {
      // 羣母一律按三等寫，匣母一律按非三等寫
      幫: 'ᵱ', 滂: 'ᵱʰ', 並: 'ᵬ', 明: 'ᵯ',
      見: 'q', 溪: 'qʰ', 疑: 'ɴ',
      影: 'ʡ', 曉: 'χ', 匣: 'ʁ',
      來: 'ɫ',
    }],
    ['', {
      幫: 'p', 滂: 'pʰ', 並: 'b', 明: 'm',
      端: 't', 透: 'tʰ', 定: 'd', 泥: 'n', 來: 'l',
      知: 'ʈ', 徹: 'ʈʰ', 澄: 'ɖ', 孃: 'ɳ',
      見: 'k', 溪: 'kʰ', 羣: 'ɡ', 疑: 'ŋ', 云: 'w',
      影: 'ʔ', 曉: 'x',
      精: 'ts', 清: 'tsʰ', 從: 'dz', 心: 's', 邪: 'z',
      莊: 'tʂ', 初: 'tʂʰ', 崇: 'dʐ', 生: 'ʂ', 俟: 'ʐ',
      章: 'tɕ', 昌: 'tɕʰ', 常: 'dʑ', 書: 'ɕ', 船: 'ʑ', 日: 'ɲ', 以: 'j',
    }]
  ])[音韻地位.母];
}

function get韻基() {
  const 韻核列表 = [...'ɨəa'];
  const 所有韻 = [
    { is三等: 1, 韻列表: '　|之　', 舒聲尾: 'ɨ' },
    { is三等: 1, 韻列表: '　|　尤', 舒聲尾: 'u' },
    { is三等: 0, 韻列表: '　|　侯', 舒聲尾: 'u' },
    { is三等: 1, 韻列表: '支|　　', 舒聲尾: 'e' },
    { is三等: 1, 韻列表: '　|魚虞', 舒聲尾: 'ə' }, // 後響二合元音的後半部分也按韻尾處理
    { is三等: 1, 韻列表: '　|　　‖　|　|　　‖麻|歌', 舒聲尾: '' },
    { is三等: 0, 韻列表: '　|　　‖　|佳|　模‖麻|歌', 舒聲尾: '' },
    { is三等: 1, 韻列表: '　|蒸　‖　|　|　　‖庚清|', 舒聲尾: 'ŋ', 入聲尾: 'k' },
    { is三等: 0, 韻列表: '　|　　‖青|耕|登　‖庚|　', 舒聲尾: 'ŋ', 入聲尾: 'k' },
    { is三等: 1, 韻列表: '　|　東‖　|　|　鍾‖　|陽', 舒聲尾: 'ɴ', 入聲尾: 'q' },
    { is三等: 0, 韻列表: '　|　東‖　|江|　冬‖　|唐', 舒聲尾: 'ɴ', 入聲尾: 'q' },
    { is三等: 1, 韻列表: '脂|微　‖祭|　|廢　‖　|　', 舒聲尾: 'j' },
    { is三等: 0, 韻列表: '　|　　‖齊|皆|咍灰‖夬|泰', 舒聲尾: 'j' },
    { is三等: 1, 韻列表: '眞|欣文‖仙|　|元　‖　|　', 舒聲尾: 'n', 入聲尾: 't' }, // 臻韻已併入眞韻
    { is三等: 0, 韻列表: '　|　　‖先|山|痕魂‖刪|寒', 舒聲尾: 'n', 入聲尾: 't' },
    { is三等: 1, 韻列表: '幽|　　‖宵|　|　　‖　|　', 舒聲尾: 'w' },
    { is三等: 0, 韻列表: '　|　　‖蕭|　|豪　‖肴|　', 舒聲尾: 'w' },
    { is三等: 1, 韻列表: '侵|　　‖鹽|　|嚴凡‖　|　', 舒聲尾: 'm', 入聲尾: 'p' },
    { is三等: 0, 韻列表: '　|　　‖添|咸|覃　‖銜|談', 舒聲尾: 'm', 入聲尾: 'p' },
  ];

  let 韻核;
  let 韻尾;
  所有韻.some(e => {
    if (e.韻列表.includes(音韻地位.韻)) {
      韻核 = 韻核列表[e.韻列表.split('‖').findIndex(v => { return v.includes(音韻地位.韻); })];
      韻尾 = is`舒聲` ? e.舒聲尾 : e.入聲尾;
      return true;
    }
  });
  if (is`祭泰夬廢韻 去聲`) 韻尾 = 選項.祭泰夬廢韻尾;
  return [韻核, 韻尾];
}

function get介音() {
  const A = 'j';
  const B = 'ɹ';
  const C = '';
  let 等類介音 = when([
    ['四等', A],
    ['二等', B],
    ['一等', C],

    ['銳音', [ // 銳音包含以母
      ['端精組', A], // 加入端組是爲了包含爹小韻
      ['', ''],
    ]],
    ['重紐A類', A],
    ['重紐B類', B],
    ['云母 支脂祭眞臻仙宵麻庚清蒸幽侵鹽韻', B], // TODO: qieyun-js 更新後簡化
    ['庚韻', B],
    ['幽韻 幫組', B],
    ['蒸韻 非 開口', B],
    ['麻清幽韻', A],
    ['', C],
  ]);
  let 合口介音 = is`(合口 或 虞韻) 非 (幫組 或 云母)` ? 'w' : ''; // TODO: qieyun-js 更新後刪去虞韻
  return 等類介音 + 合口介音;
}

function get聲調() {
  if (!選項.聲調記號.includes('五度符號')) {
    if (is`平入聲`) return '';
    let 聲調記號 = 選項.聲調記號.split(' ')[+is`去聲`].slice(1);
    if (is朗讀音 && is`祭泰夬廢韻 去聲` && ['ʰ', 'h'].includes(聲調記號)) return '';
    return { 'ˊ': '́', 'ˋ': '̀' }[聲調記號] ?? 聲調記號;
  }

  const 五度符號列表 = is朗讀音 ? [
    '˦', '˦˦˥', '˥˩', '˥',
    '˨˩', '˨˨˧', '˧˩˨', '˨˩',
  ] : 選項.聲調記號.includes('帶拖腔') ? [
    '˦˦˨', '˦˥', '˦˩˨', '˦',
    '˨˨˩', '˨˦', '˨˩˨', '˨',
  ] : [
    '˦', '˦˥', '˦˩', '˦',
    '˨', '˨˦', '˨˩', '˨',
  ];
  const is陽調 = is`全濁 或 次濁 非 上聲` && !(is朗讀音 && is`次濁 入聲`);
  return 五度符號列表['平上去入'.indexOf(音韻地位.聲) + is陽調 * 4];
}

function 音位to音值(音節) {
  const is雙唇韻尾 = [...'wmp'].includes(音節.韻尾);
  const is展唇鈍尾 = [...'ɨŋk'].includes(音節.韻尾);
  const is圓唇鈍尾 = [...'uɴq'].includes(音節.韻尾);
  const is後部韻尾 = is展唇鈍尾 || is圓唇鈍尾 || 音節.韻尾 === 'ə'; // ə 介於圓展之間
  const is音節首含銳 = !['', 'w'].includes(音節.介音) || is`銳音 三等`;
  const is音節首含唇 = 音節.介音.includes('w') || is`幫組` || 音節.聲母 === 'w';

  // (1) 韻核前化
  //     韻核前的非小舌化銳音使韻核前化，但後部韻尾使韻核不被前化（-K 只使 /ɨ/ 不被前化）。
  if (
    is音節首含銳 &&
    !(is後部韻尾 && (is圓唇鈍尾 || 音節.韻核 === 'ɨ')) &&
    !is`廢韻 非 去聲` // 茝佁䑂 3 小韻也除外
  ) {
    音節.替換('韻核', 'ɨ', 'i');
    音節.替換('韻核', 'ə', 'e');
  }

  // (2) 韻核圓唇化
  //     a.  圓唇鈍韻尾使韻核圓唇化
  //     b1. 含唇音的三　等音節首使 ɨ 圓唇化（三　等 w 實現爲 u̯，同化 ɨ）
  //     b2. 含唇音的非三等音節首使 ə 圓唇化（非三等 w 實現爲 o̯，同化 ə）
  //     b3. 但展唇鈍韻尾和雙唇韻尾排斥圓唇，使韻核保持展唇
  //     c.  模韻圓唇化（原因不明）
  if (is圓唇鈍尾) {
    音節.替換('韻核', 'ɨ', 'u');
    音節.替換('韻核', 'ə', 'o');
  }
  if (is音節首含唇 && !is展唇鈍尾 && !is雙唇韻尾) {
    if (is`三等`) {
      音節.替換('韻核', 'ɨ', 'u');
      音節.替換('韻尾', 'ə', 'o'); // 虞韻
    } else {
      音節.替換('韻核', 'ə', 'o');
    }
  } // 豪韻唇音可能也是獨立的，但爲了簡便不處理它
  if (!is`三等` && !音節.韻尾) 音節.替換('韻核', 'ə', 'o');

  // (3) 韻核咽化
  //     非三等 ɹ 實現爲 ʕ，使韻核咽化
  if (!is`三等` && 音節.介音.includes('ɹ')) {
    音節.韻核 += 'ˤ';
  }

  // (4) 省略與韻核同質的介音、韻尾
  [ // 介音, 韻核, 韻尾, 條件
    ['j', 'i', 'j', true],
    [' ', 'ɨ', 'ɨ', true],
    ['w', 'u', 'u', true],
    ['j', 'e', ' ', !is`三等`], // 非三等 j 實現爲 e̯
    ['w', 'o', ' ', !is`三等`],
    ['ɹ', 音節.韻核, ' ', !is`三等` && 音節.韻核.includes('ˤ')],
  ].some(e => {
    if (e[3] && 音節.韻核 === e[1]) {
      音節.替換('介音', e[0], '');
      音節.替換('韻尾', e[2], '');
      return true;
    }
  });

  // (5) 豪覃韻韻核寫作 ʌ
  if (!is`三等` && is雙唇韻尾) 音節.替換('韻核', 'ə', 'ʌ');

  // 後處理：按需顯示 ɑ，包括𦣛小韻（銳音歌三合）
  if (!is音節首含銳 || is圓唇鈍尾 || is`歌韻 三等 合口`) 音節.替換('韻核', 'a', 選項.後低元音);
}

function 調整聲母(音節) {
  const 舊版聲母字典 = [
    [!isL, { 'ᵱ': 'p', 'ᵬ': 'b', 'ᵯ': 'm' }],
    [isJ原版 || is朗讀音, { 'ʡ': 'ʔ', 'ɫ': 'l', 'x': 'h' }],
    [選項.知組 === 'tɹ', { 'ʈ': 'tɹ', 'ɖ': 'dɹ', 'ɳ': 'nɹ' }],
  ].reduce((prev, cur) => Object.assign(prev, cur[0] ? cur[1] : {}), {});

  if (Object.keys(舊版聲母字典).includes(音節.聲母[0])) {
    音節.聲母 = 舊版聲母字典[音節.聲母[0]] + 音節.聲母.slice(1);
  }
}

function 調整鈍C介音(音節) {
  if (選項.鈍C介音.includes('∅')) return;
  const [鈍C開, 鈍C唇, 鈍C合] = 選項.鈍C介音.trim().split(' ').map(e => e.slice(1));
  音節.介音 = when([
    [音節.韻核 !== 'i' && '三等 鈍音 非 云母', [
      [音節.介音 === 'w', 鈍C合],
      [音節.介音 === '', [
        ['幫組', 鈍C唇],
        [!['ɨ', 'u'].includes(音節.韻核) || '東尤韻', 鈍C開],
      ]],
    ]],
    ['', 音節.介音],
  ], '', true);
}

function 調整二等元音(音節) {
  const 默認記號 = 'ˤ';
  let 新記號 = 選項.二等元音記號?.split('◌')[1];
  if (!新記號 || 新記號 === 默認記號 || !音節.韻核.includes(默認記號)) return;

  if (新記號[0] === '˞' && is`端組 或 來母 庚韻`) 新記號 = '';
  音節.替換('韻核', 默認記號, 新記號);
  if (音節.韻核 === 'e' && !音節.韻尾) { // 箉小韻，無附加符號時改作 -aj
    音節.韻核 = 'a';
    音節.韻尾 = 'j';
  }
}

function 音值toJ(音節) {
  if (選項.鈍C介音.includes('ɥ̈') && is`三等 非 東尤韻`) 音節.替換('韻核', 'u', 'ʉ');
  if (isJ新版) return;

  if (
    音節.介音.includes('w') ||
    音節.介音 === 'ɥ̈' ||
    [...'ʉuo'].includes(音節.韻核) && is`(合口 或 鍾虞韻) 非 (幫組 或 云母)` // TODO: qieyun-js 更新後刪去虞韻
  ) {
    音節.聲母 += 'ʷ';
    音節.替換('聲母', 'ʰʷ', 'ʷʰ');
    音節.替換('聲母', 'jʷ', 'ɥ');
    音節.替換('介音', 'w', '');
    音節.替換('介音', 'j', 'ɥ');
  }

  音節.韻核 = when([
    ['蒸韻', 'i'],
    ['莊組 眞臻欣韻 開口', 'ɹ̩'],
    ['侯韻 非 明母', 'ɘu'],

    ['清韻 非 重紐B類', 'iæ'],
    ['陽韻', (is`開口 或 重紐A類` ? 'ɨ' : 'ʉ') + 'ɐ'],
    ['鍾韻', 'ʉɔ'],

    ['江韻', 'œˤ'],
    ['嚴凡韻 幫組', 'œ'],
    ['', 音節.韻核],
  ]);

  音節.介音 = when([
    [音節.聲母.includes('ʷ') && 音節.韻核[0] !== 'ʉ' && '精組 三等', 'ɹ'],
    ['精組 三等 東尤韻', 'ɹ'],
    [音節.韻核[0] === 'i' && (['j', 'ɥ'].includes(音節.介音) || '知組 或 來母'), ''],
    [[...'iɨʉ'].includes(音節.韻核[0]) && (['j̈', 'ɥ̈'].includes(音節.介音) || '銳音'), ''],
    [選項.知組 !== 'tɹ' && '知組 三等', 'ɹ'],
    ['來母 三等', 'ɹ'],
    ['', 音節.介音],
  ]);

  音節.韻尾 = {
    微: 'i', 幽: 'u',
    支: 'ɛ', 魚: 'ʌ', 虞: 'ɔ',
  }[音韻地位.韻] ?? 音節.韻尾;
}

function 音值to朗讀音(音節) {
  if (is朗讀音 && 音節.聲母.replace('ʰ', '').length > 1) {
    音節.聲母 = 音節.聲母[0] + '͡' + 音節.聲母.slice(1);
  }

  const hasW = 音節.聲母 === 'w' || 音節.介音.includes('w') || ['u', 'o'].includes(音節.韻核);
  音節.替換('聲母', 'w', '');
  音節.介音 = when([
    ['三等', [
      ['幽韻', is`幫組` ? 'j' : 'ɥ'],
      [[...'iea'].includes(音節.韻核[0]) || '蒸韻 或 重紐A類 或 重紐B類', [
        [音節.介音.includes('ɹ') || '知莊組 或 蒸韻 鈍音', hasW ? 'ɻɥ' : 'ɻj'], // B
        ['', hasW ? 'ɥ' : 'j'], // A
      ]],
      ['', is`幫組 或 尤韻` ? 'ɥ̈' : hasW ? 'ẅ' : 'j̈'], // C
    ]],
    ['二等 非 (端組 或 來母 庚韻)', is`知莊組` ? 'ɻ' + 音節.介音 : 音節.介音 + 'ɻ'],
    [音節.韻核 === 'o' && '一等 非 (冬模韻 或 幫組)', 'w'],
    ['', 音節.介音],
  ]);
  if (音節.聲母 === 'j' && ['j', 'ɥ'].includes(音節.介音)) 音節.聲母 = '';

  if (音節.韻核.includes('ˤ')) {
    音節.替換('韻核', 'eˤ', 'æ');
    音節.替換('韻核', 'oˤ', 'æ');
    音節.替換('韻核', 'aˤ', 'a');
  } else {
    音節.韻核 = when([
      ['三等', [
        ['蒸韻', 'i'],
        ['莊組 眞臻欣韻 開口', 'i˞ '],
        ['微韻', 'ɨ'],
        ['幽韻', 'ÿ'],
        [音節.韻核 === 'e' || '支清韻', 'ɛ'],
        ['魚韻', 'ə'],
        [音節.韻核 === 'o' || '虞韻', 'ɔ'],
        ['陽韻', 'ɐ'],
        ['嚴凡韻 幫組', 'ɞ'],
        ['', 音節.韻核],
      ]],
      ['侯韻 非 幫組', 'ɘu'],
      ['豪韻', 'ɑ'],
      ['覃韻 或 咍灰韻 開口', 'ɐ'],
      ['咍灰韻', 'ɔ̞'],
      [音節.韻核 === 'ə', 'ɘ'],
      ['', 音節.韻核],
    ]);
  }

  音節.韻尾 = when([
    ['通江攝', is`舒聲` ? 'ŋʷ' : 'kʷ'],
    ['宕攝', is`舒聲` ? 'ŋ' : 'k'],
    ['梗攝', is`舒聲` ? 'ɲ' : 'c'],
    ['支魚虞幽韻', ''],
    ['', 音節.韻尾],
  ]);

  [['j', 'i'], ['j̈', 'ɨ']].forEach(e => {
    if (音節.韻核[0] === e[1] && (音節.聲母 || 音節.介音[0] === 'ɻ')) 音節.替換('介音', e[0], '');
  });
}

function get音節() {
  const 音節 = {
    聲母: get聲母(),
    介音: get介音(),
    聲調: get聲調(),
    替換(propertyName, from, to) { this[propertyName] = this[propertyName].replace(from, to); }
  };
  [音節.韻核, 音節.韻尾] = get韻基();

  if (!選項.顯示純音位形式) 音位to音值(音節);
  調整聲母(音節);
  調整鈍C介音(音節);
  if (isJ新版 || isJ原版) 音值toJ(音節);
  if (is朗讀音) 音值to朗讀音(音節);
  調整二等元音(音節);

  let 聲調記號插入位置 = ['̩', '͇', '̳', 'ɘu'].some(e => 音節.韻核.includes(e)) ? 2 : 1;
  音節.韻基 = 音節.韻核 + 音節.韻尾;
  音節.帶調韻基 = 選項.聲調記號.includes('ˊ') ?
    音節.韻核.slice(0, 聲調記號插入位置) + 音節.聲調 + 音節.韻核.slice(聲調記號插入位置) + 音節.韻尾 :
    音節.韻核 + 音節.韻尾 + 音節.聲調;
  音節.韻母 = 音節.介音 + 音節.韻基;
  音節.帶調韻母 = 音節.介音 + 音節.帶調韻基;
  return 音節;
}

if (!音韻地位) return get選項列表();
調整選項();
調整音韻地位();
const 音節 = get音節();
return 音節.聲母 + 音節.帶調韻母;
