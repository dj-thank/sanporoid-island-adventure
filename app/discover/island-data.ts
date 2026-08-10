export type LatLng = [number, number];

export type Photo = {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
};

export type MapPoint = {
  id: string;
  title: string;
  label: string;
  position: LatLng;
  summary: string;
};

export type MapRoute = {
  label: string;
  positions: LatLng[];
  color: string;
  dash?: boolean;
};

export type Island = {
  slug: "kozushima" | "oshima" | "niijima";
  order: string;
  name: string;
  reading: string;
  english: string;
  verifiedAt: string;
  oneLine: string;
  coverLine: string;
  shortIntro: string;
  longIntro: string;
  sectionTitles: {
    plan: string;
    conditions: string;
    missions: string;
    map: string;
    stories: string;
    route: string;
    food: string;
    stay: string;
    access: string;
  };
  hero: Photo;
  cover: Photo;
  mapCenter: LatLng;
  mapZoom: number;
  facts: { value: string; label: string }[];
  fit: { label: string; value: string }[];
  conditionPlans: {
    label: string;
    title: string;
    lead: string;
    steps: string[];
    note: string;
    sourceLabel: string;
    sourceUrl: string;
  }[];
  friendMissions: {
    number: string;
    title: string;
    copy: string;
    payoff: string;
  }[];
  spots: MapPoint[];
  chapters: {
    number: string;
    eyebrow: string;
    title: string;
    copy: string[];
    image: Photo;
    note: string;
    sourceLabel: string;
    sourceUrl: string;
  }[];
  itinerary: {
    day: string;
    theme: string;
    items: { time: string; title: string; detail: string; spotId?: string }[];
  }[];
  food: { title: string; copy: string }[];
  stays: { title: string; type: string; copy: string; url: string; cta: string }[];
  access: { route: string; time: string; copy: string; url: string }[];
  rules: string[];
  official: { label: string; url: string }[];
};

const photos = {
  kozushimaAerial: {
    src: "/photos/kozushima-aerial.jpg",
    alt: "海に浮かぶ神津島を上空から見た全景",
    credit: "Photo: ブルーノ・プラス / Wikimedia Commons / CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kouzu_island_aerial_shoot.jpg",
  },
  kozushimaTenjo: {
    src: "/photos/kozushima-tenjo.jpg",
    alt: "白い山肌が見える神津島・天上山",
    credit: "Photo: Saigen Jiro / Wikimedia Commons / CC0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kozushima_island.JPG",
  },
  kozushimaTako: {
    src: "/photos/kozushima-tako.jpg",
    alt: "白い岩壁と青い入り江が続く神津島の多幸湾",
    credit: "Photo: ブルーノ・プラス / Wikimedia Commons / CC BY 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Tako_Beach.jpg",
  },
  kozushimaMaehama: {
    src: "/photos/kozushima-maehama.jpg",
    alt: "神津島・前浜海岸の澄んだ青い海",
    credit: "Photo: Tomaz Vajngerl / Wikimedia Commons / CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Maehama_beach_(DSC03401).jpeg",
  },
  kozushimaAkasaki: {
    src: "/photos/kozushima-akasaki.jpg",
    alt: "神津島・赤崎遊歩道入口の案内とバス停",
    credit: "Photo: Olegushka / Wikimedia Commons / CC0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:AkasakiWalkingPath_Kozushima_20180430.jpg",
  },
  oshimaMihara: {
    src: "/photos/oshima-mihara.jpg",
    alt: "伊豆大島・三原山の黒い火山地形",
    credit: "Photo: Kentaro Ohno / Wikimedia Commons / CC BY 2.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Mount_Mihara_on_Izu_Oshima_in_Japan_-_2016-03-26_A.jpg",
  },
  oshimaStrata: {
    src: "/photos/oshima-strata.jpg",
    alt: "伊豆大島の道路沿いに続く巨大な地層大切断面",
    credit: "Photo: 斑猫 / Wikimedia Commons / CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:地層大切断面-03.jpg",
  },
  oshimaAerial: {
    src: "/photos/oshima-aerial.jpg",
    alt: "上空から見た伊豆大島の海岸線",
    credit: "Photo: Japan Coast Guard / Wikimedia Commons / Attribution",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Izu-Oshima_20120308.jpg",
  },
  niijimaShiromama: {
    src: "/photos/niijima-shiromama.jpg",
    alt: "新島の白ママ断崖と黒い砂浜",
    credit: "Photo: massan4632 / Wikimedia Commons / CC BY 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Tokyo_to_Niijima_mura_Shiromama_danso_20190527.jpg",
  },
  niijimaHabushiura: {
    src: "/photos/niijima-habushiura.jpg",
    alt: "高台から見下ろす新島・羽伏浦海岸",
    credit: "Photo: Soica2001 / Wikimedia Commons / Public domain",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Niijima_Habushiura_Beach.jpg",
  },
  niijimaYunohama: {
    src: "/photos/niijima-yunohama.jpg",
    alt: "海辺に建つギリシャ風の湯の浜露天温泉",
    credit: "Photo: DDD DDD / Wikimedia Commons / Public domain",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Yunohama_Onsen.jpg",
  },
} satisfies Record<string, Photo>;

export const islands: Island[] = [
  {
    slug: "kozushima",
    order: "01",
    name: "神津島",
    reading: "こうづしま",
    english: "KŌZUSHIMA",
    verifiedAt: "2026.08.10",
    oneLine: "朝は天上山、午後は海辺、夜は星空。神津島は2泊3日で楽しみたい。",
    coverLine: "天上山と星空を楽しむ2泊3日",
    shortIntro: "天上山、多幸湾、赤崎遊歩道、星空を2泊3日で回る。山と海の両方を楽しみたい3人旅に向く。",
    longIntro: "神津島には、標高572mの天上山、白い岩壁に囲まれた多幸湾、木道が続く赤崎遊歩道がある。夜は東京都で初めて認定された星空保護区の空を待つ。朝・昼・夜でやりたいことがはっきり分かれるため、2泊すると天候による変更もしやすい。",
    sectionTitles: {
      plan: "神津島は宿と帰りの便から決める",
      conditions: "天上山に登れない日の選択肢も持つ",
      missions: "3人で楽しむ神津島の小さな遊び",
      map: "天上山・港・海岸の位置を確認する",
      stories: "朝の天上山から夜の星空まで",
      route: "神津島を2泊3日で回る基本コース",
      food: "金目鯛と島の水を味わう",
      stay: "登山と星空の拠点になる宿を探す",
      access: "船と飛行機を帰りの便まで比べる",
    },
    hero: photos.kozushimaAerial,
    cover: photos.kozushimaTako,
    mapCenter: [34.212, 139.139],
    mapZoom: 12,
    facts: [
      { value: "約180km", label: "東京から南へ" },
      { value: "22km", label: "島の周囲" },
      { value: "572m", label: "天上山の標高" },
      { value: "2020", label: "星空保護区認定" },
    ],
    fit: [
      { label: "GO FOR", value: "登る・潜る・星を待つ" },
      { label: "PACE", value: "2泊3日で朝昼夜を分ける" },
      { label: "MOVE", value: "村落は徒歩＋遠方はバス／車" },
      { label: "BOOK FIRST", value: "宿 → 船／飛行機 → 山・海のガイド" },
    ],
    conditionPlans: [
      {
        label: "CLEAR + CALM",
        title: "晴れて風が弱い日：天上山へ",
        lead: "天上山は朝のうちに歩く。午後は赤崎か多幸湾、夜は雲が少なければ星空観察へ。",
        steps: [
          "朝のうちに天上山へ。コースと下山時刻を宿かガイドに共有する。",
          "午後は赤崎か多幸湾のどちらか一方。帰りのバス／配車を先に決める。",
          "夕食後に雲量を見て、晴れている夜だけ星空へ出る。",
        ],
        note: "山頂部は晴れていても風・霧が出る。低山という数字より当日の条件を優先。",
        sourceLabel: "神津島観光協会｜天上山",
        sourceUrl: "https://kozushima.com/kankospot/yama/",
      },
      {
        label: "WIND + ROUGH SEA",
        title: "強風や高波の日：村を歩く",
        lead: "海岸と山は避け、港から歩ける村の中へ。神社、郷土資料館、商店を順に回る。",
        steps: [
          "港から徒歩圏の物忌奈命神社へ。島の『神々が集まった』物語から入る。",
          "郷土資料館で、古文書・民具・船の遺物から暮らしの時間を読む。",
          "商店と飲食店を回り、黒曜石や島の水を使った飲み物を探す。",
        ],
        note: "強風時は海岸・遊歩道・天上山へ無理に近づかない。施設の開館と島内交通を当日確認。",
        sourceLabel: "神津島観光協会｜雨でも楽しめる島時間",
        sourceUrl: "https://kozushima.com/workation/",
      },
      {
        label: "RAIN",
        title: "雨の日：黒曜石と郷土資料館",
        lead: "屋内体験を中心にする。黒曜石入りキャンドル作り、郷土資料館、早めの夕食を組み合わせる。",
        steps: [
          "黒曜石入りキャンドル作りを予約。雨天時は用意された材料で体験できる。",
          "郷土資料館で島の歴史を見て、晴れた日の景色に背景を足す。",
          "宿か予約店で地魚の夜。翌日の山・海・帰路を同時に組み直す。",
        ],
        note: "体験は前日締切や定員がある。料金・開催時刻・空きは公式予約画面で直前確認。",
        sourceLabel: "神津島観光協会｜黒曜石入りキャンドル作り",
        sourceUrl: "https://kozushima.com/tour/ecotour/514/",
      },
    ],
    friendMissions: [
      {
        number: "01",
        title: "白・青・黒を1人1色で撮る",
        copy: "白は天上山、青は入り江、黒は夜空。担当する色を決め、各自が一番気に入った写真を1枚選ぶ。",
        payoff: "3枚を並べて旅の表紙にする",
      },
      {
        number: "02",
        title: "神社と資料館で島の伝承をたどる",
        copy: "物忌奈命神社と郷土資料館を訪ね、神々と水の伝承を調べる。村の路地も歩けば半日のコースになる。",
        payoff: "強風や雨の日にも楽しめる",
      },
      {
        number: "03",
        title: "翌日の3案を夕食中に決める",
        copy: "山、海、村歩きの3案を用意する。全員が納得できる内容にして、朝の天気を見て1つ選ぶ。",
        payoff: "朝は天気を見て選ぶだけ",
      },
    ],
    spots: [
      { id: "tenjo", title: "天上山", label: "HIKE", position: [34.2196, 139.1486], summary: "白砂の裏砂漠、池、断崖の展望をつなぐ島の主峰。" },
      { id: "akasaki", title: "赤崎遊歩道", label: "SWIM", position: [34.2429, 139.1305], summary: "木の遊歩道と入り江。夏は泳ぎとシュノーケルの拠点。" },
      { id: "maehama", title: "前浜海岸", label: "SUNSET", position: [34.2052, 139.1308], summary: "村のすぐ前に延びる砂浜。夕方の基準点。" },
      { id: "tako", title: "多幸湾", label: "COAST", position: [34.2153, 139.1621], summary: "天上山の白い崖を海側から見る東岸の入り江。" },
      { id: "onsen", title: "神津島温泉保養センター", label: "BATH", position: [34.2247, 139.1265], summary: "海辺の露天風呂。営業と利用条件は当日確認。" },
      { id: "yotane", title: "よたね広場周辺", label: "STARS", position: [34.2078, 139.1392], summary: "村から歩ける星空観察候補。照明と足元に配慮。" },
      { id: "port", title: "神津島港", label: "GATE", position: [34.2045, 139.1327], summary: "船の玄関口。海況で発着地や時刻が変わることがある。" },
      { id: "airport", title: "神津島空港", label: "FLIGHT", position: [34.1886, 139.1335], summary: "調布便の玄関口。荷物制限を予約前に確認。" },
      { id: "shrine", title: "物忌奈命神社", label: "MYTH", position: [34.2084495, 139.1342223], summary: "港から歩ける島の開祖の社。村歩きの物語の入口。" },
      { id: "museum", title: "神津島村郷土資料館", label: "HISTORY", position: [34.208007, 139.1357374], summary: "古文書、民具、船の遺物から島の暮らしを読む雨天候補。" },
    ],
    chapters: [
      {
        number: "01",
        eyebrow: "MORNING / MT. TENJŌ",
        title: "天上山は山頂部の景色が面白い",
        copy: [
          "天上山は標高572m。黒島登山口から登ると、樹林、急な登り、表砂漠と裏砂漠、池、断崖の展望が短い距離で続く。山頂に着くだけでなく、山頂部を歩く時間をしっかり取りたい。",
          "3人で登るなら、写真、地図、水分の確認を分担すると動きやすい。裏砂漠展望地などの集合場所と下山時刻も先に決めておく。",
        ],
        image: photos.kozushimaTenjo,
        note: "低山でも風・霧・強い日差しがある。明るいうちに下山し、当日の登山情報と装備を優先。",
        sourceLabel: "神津島観光協会｜天上山モデルコース",
        sourceUrl: "https://kozushima.com/tour/tourroute/866/",
      },
      {
        number: "02",
        eyebrow: "NOON / EAST COAST",
        title: "多幸湾から天上山の白い崖を見る",
        copy: [
          "多幸湾では、天上山の白い山肌を海側から見られる。午前に登った山を午後に湾から眺めると、島の地形と距離がよく分かる。",
          "泳ぐ場合は、監視員、海況、遊泳範囲の案内を優先する。海に入れない日は、浜から岩壁を眺める時間に切り替える。",
        ],
        image: photos.kozushimaTako,
        note: "多幸湾へは村落から距離がある。バス時刻と帰路を先に確保し、海況が悪ければ展望中心へ切り替える。",
        sourceLabel: "神津島観光協会｜観光スポット",
        sourceUrl: "https://kozushima.com/kankospot/",
      },
      {
        number: "03",
        eyebrow: "AFTERNOON / AKASAKI",
        title: "赤崎遊歩道は歩くだけでも楽しい",
        copy: [
          "島の北端にある赤崎遊歩道は、岩場と入り江を約500mの木道でつなぐ。高い場所から海を眺め、階段で入り江へ降りられる。泳がない人も散策だけで楽しめる。",
          "夏は売店やバスが動く一方、足元、飛び込み、岩場、波には注意が必要だ。泳ぐ人と散策する人に分かれるなら、集合時刻を決めておく。",
        ],
        image: photos.kozushimaAkasaki,
        note: "港から車・バスで約15分の案内。季節運行、売店、遊泳条件は直前に公式情報を確認。",
        sourceLabel: "神津島観光協会｜赤崎遊歩道",
        sourceUrl: "https://kozushima.com/kanko/umi/beach/240/",
      },
      {
        number: "04",
        eyebrow: "NIGHT / DARK SKY ISLAND",
        title: "神津島の夜は星空観察を1晩入れる",
        copy: [
          "神津島は2020年12月、東京都で初めて国際ダークスカイ協会の星空保護区に認定された。屋外照明の見直しなど、暗い夜を守る島の取り組みも知っておきたい。",
          "夕食後に雲量を確認し、晴れた夜だけ観察へ出る。赤いライト、上着、温かい飲み物があると過ごしやすい。曇った日は無理に出かけず、翌朝の予定に備える。",
        ],
        image: photos.kozushimaMaehama,
        note: "掲載写真は前浜の昼景。星空の見え方は月齢・雲・照明で変わる。暗所では近隣と安全に配慮。",
        sourceLabel: "神津島観光協会｜星空保護区",
        sourceUrl: "https://kozushima.com/star/hogoku/",
      },
    ],
    itinerary: [
      {
        day: "DAY 01",
        theme: "到着後に赤崎と前浜へ",
        items: [
          { time: "ARRIVE", title: "港／空港 → 宿へ", detail: "まず宿に荷物を置き、翌日の天上山と帰路を確認。", spotId: "port" },
          { time: "PM", title: "赤崎遊歩道", detail: "バスの最終便から逆算。泳げない日は木道散歩へ。", spotId: "akasaki" },
          { time: "SUNSET", title: "前浜海岸", detail: "夕食前の30分を空け、水平線の色を見る。", spotId: "maehama" },
          { time: "NIGHT", title: "星空の第一候補", detail: "晴天時だけ実行。月齢と雲量で場所を変える。", spotId: "yotane" },
        ],
      },
      {
        day: "DAY 02",
        theme: "天上山と多幸湾を回る",
        items: [
          { time: "07:00", title: "天上山へ", detail: "早出。コースと下山時刻はガイド／宿に相談。", spotId: "tenjo" },
          { time: "NOON", title: "村で地魚の昼食", detail: "営業日と売り切れを想定し、第二候補まで持つ。" },
          { time: "PM", title: "多幸湾へ", detail: "朝に登った山を海側から見返す。", spotId: "tako" },
          { time: "EVENING", title: "温泉で回復", detail: "営業・送迎・水着条件を直前確認。", spotId: "onsen" },
        ],
      },
      {
        day: "DAY 03",
        theme: "運航を確認して港へ",
        items: [
          { time: "AM", title: "前浜を散歩", detail: "欠航や条件付き運航の情報を先に確認。", spotId: "maehama" },
          { time: "DEPART", title: "港／空港へ", detail: "発着地・集合時刻・荷物制限をもう一度確認。", spotId: "airport" },
        ],
      },
    ],
    food: [
      { title: "金目鯛", copy: "島の水揚げを象徴する魚。煮付け、刺身、炙りなど、その日の入荷で選ぶ。" },
      { title: "地魚の夜", copy: "店を一軒に固定しすぎず、宿の食事か予約店を軸にして売り切れリスクを避ける。" },
      { title: "島の水とクラフトビール", copy: "東京名湧水57選に選ばれた水を生かした一杯。提供店と在庫を確認し、温泉や星空の前後に置く。" },
      { title: "山の行動食", copy: "朝出発に備え、前日に飲み物と携行食を確保。島では夜間に買える場所が限られる。" },
    ],
    stays: [
      { title: "島の宿を公式予約", type: "OFFICIAL PORTAL", copy: "旅館・民宿・ゲストハウスを公式ポータルから比較。野宿はできないため、交通より先に滞在先を確保する。", url: "https://kozushima.com/yado-list/", cta: "公式宿一覧" },
      { title: "指定キャンプ場を予約", type: "DESIGNATED CAMP", copy: "キャンプは村が案内する指定施設だけ。設備、受入状況、工事、予約条件を公式で確認する。", url: "https://www.vill.kouzushima.tokyo.jp/camp/", cta: "村の利用案内" },
      { title: "星空ガイドと組み合わせる", type: "NIGHT GUIDE", copy: "星の場所・時間・安全を現地ガイドに委ねる選択肢。月齢と催行条件を確認する。", url: "https://kozushima.com/star/guide/", cta: "星空ガイド" },
      { title: "島の体験をまとめて探す", type: "ECOTOUR", copy: "山・海・自然体験は公式エコツアー窓口から。繁忙期は宿と並行して問い合わせる。", url: "https://kozushima.com/", cta: "公式観光サイト" },
    ],
    access: [
      { route: "調布 → 神津島", time: "約45分", copy: "飛行機。便数、運賃、手荷物上限、天候条件を予約画面で確認。", url: "https://central-air.co.jp/schedule-fee.html?stt_lang=ja" },
      { route: "竹芝 → 神津島", time: "高速船／大型客船", copy: "所要時間と運航日は季節で変動。宿を押さえてから往復を検索。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "新島 ↔ 神津島", time: "高速船 約25分の案内", copy: "島間移動は便・海況で成立条件が変わる。旅程の接続は同日便で再確認。", url: "https://www.tokyo-islands.com/access/" },
      { route: "島内を動く", time: "村営バス／公共ライドシェア", copy: "船・飛行機の発着後にバス時刻が組まれる。遠方へ出る日は帰路と配車を先に確保。", url: "https://www.vill.kouzushima.tokyo.jp/transport/" },
      { route: "出発当日の運航", time: "船／飛行機", copy: "発着港、欠航、条件付き運航を当日に再確認。予定より公式の運航判断を優先。", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
    rules: [
      "野宿と指定場所以外のキャンプは禁止。宿または指定キャンプ場を予約してから来島する。",
      "船・飛行機は欠航や条件付き運航がある。帰京日の予定を詰めすぎない。",
      "天上山は明るいうちに下山。低山という数字だけで装備を軽くしない。",
      "海は監視員・現地掲示・波の条件を優先。飛び込みや岩場は無理をしない。",
      "星を見る暗所では、足元・車・住宅・照明に配慮する。",
    ],
    official: [
      { label: "神津島観光協会", url: "https://kozushima.com/" },
      { label: "神津島村｜交通・滞在ルール", url: "https://www.vill.kouzushima.tokyo.jp/transport/" },
      { label: "東京宝島｜神津島", url: "https://www.tokyo-islands.com/about/kozushima/" },
      { label: "東海汽船", url: "https://www.tokaikisen.co.jp/" },
      { label: "新中央航空", url: "https://central-air.co.jp/" },
    ],
  },
  {
    slug: "oshima",
    order: "02",
    name: "大島",
    reading: "おおしま",
    english: "ŌSHIMA",
    verifiedAt: "2026.08.10",
    oneLine: "三原山を歩き、地層大切断面を見て、夕方は海辺の温泉へ。",
    coverLine: "三原山と島南部を回る1泊2日",
    shortIntro: "三原山、裏砂漠、地層大切断面を1泊2日で回る。島を広く動くなら車が便利だ。",
    longIntro: "大島では、標高758mの三原山、黒い火山原が広がる裏砂漠、道路沿いに続く地層大切断面を見られる。朝に火山を歩き、午後は南部の地層と波浮港へ。西岸へ戻れる日は、夕日と浜の湯まで続けて楽しめる。",
    sectionTitles: {
      plan: "大島は宿と島内の移動手段から決める",
      conditions: "三原山が見えない日は南部へ回る",
      missions: "3人で試したい大島の遊び",
      map: "三原山・南部・2つの港を確認する",
      stories: "三原山、地層、温泉を1泊2日に組む",
      route: "大島を1泊2日で回る基本コース",
      food: "べっこうと椿、大島の味",
      stay: "火山の近くか港の近くかで宿を選ぶ",
      access: "当日の発着港まで確認する",
    },
    hero: photos.oshimaMihara,
    cover: photos.oshimaStrata,
    mapCenter: [34.737, 139.387],
    mapZoom: 11,
    facts: [
      { value: "758m", label: "三原山の標高" },
      { value: "約2万年", label: "地層の記録" },
      { value: "630m", label: "地層切断面の長さ" },
      { value: "2 ports", label: "元町／岡田" },
    ],
    fit: [
      { label: "GO FOR", value: "火山・一周ドライブ・温泉" },
      { label: "PACE", value: "1泊2日から濃く遊べる" },
      { label: "MOVE", value: "広く回るなら車、絞るならバス" },
      { label: "BOOK FIRST", value: "船 → 宿 → 車／送迎" },
    ],
    conditionPlans: [
      {
        label: "CLEAR + CALM",
        title: "晴れて風が弱い日：三原山と南部へ",
        lead: "朝は三原山を歩き、午後は地層大切断面と波浮港へ。西岸へ戻れる日は浜の湯に寄る。",
        steps: [
          "発着港を確認してから三原山山頂口へ。火口周回か短い展望歩きかを決める。",
          "車なら地層大切断面と波浮港をつなぐ。バスなら山か南部のどちらかに絞る。",
          "西岸へ戻れる日は、夕日と浜の湯を一つの予定にする。",
        ],
        note: "火山・道路・バスの最新情報を優先。霧や強風が出たら山頂計画を短縮する。",
        sourceLabel: "大島観光協会｜遊ぶ",
        sourceUrl: "https://izu-oshima.or.jp/play.html",
      },
      {
        label: "FOG + STRONG WIND",
        title: "霧や強風の日：地層と港町へ",
        lead: "山を外し、地層大切断面、波浮港、泉津から移動しやすい2か所を選ぶ。",
        steps: [
          "地層大切断面は遠景・近景・人との比較の三枚を撮る。",
          "波浮港では展望台から港の丸い地形を見て、坂と路地へ降りる。",
          "北へ戻るなら泉津の切通し、元町へ戻るなら温泉を選ぶ。",
        ],
        note: "島一周を目的にしない。風雨と帰りの港が変われば、同じ側の場所だけで完結させる。",
        sourceLabel: "伊豆大島ジオパーク｜ジオサイト",
        sourceUrl: "https://izuoshima-geo.org/know/highlights/geosite/",
      },
      {
        label: "RAIN",
        title: "雨の日：ジオノスと温泉へ",
        lead: "ジオノスで火山と島の暮らしを知り、営業していれば温泉へ。食事はべっこうや椿料理を探す。",
        steps: [
          "伊豆大島ミュージアム ジオノスで、大地・生態系・暮らし・防災をまとめて見る。",
          "御神火温泉か営業中の屋内施設へ。休館と利用条件を公式で確認する。",
          "べっこう、椿、くさやから一つ選び、雨の日の島を味覚で残す。",
        ],
        note: "旧・火山博物館の情報ではなく、現行のジオノス公式案内で開館・料金を確認する。",
        sourceLabel: "伊豆大島ジオパーク｜ジオノス",
        sourceUrl: "https://izuoshima-geo.org/know/shisetsu.html",
      },
    ],
    friendMissions: [
      {
        number: "01",
        title: "火山の黒を3枚ずつ撮る",
        copy: "溶岩、砂、影、湯気、靴底から、各自が黒いものを3つ撮る。同じ場所でも選ぶ対象に違いが出る。",
        payoff: "写真を見せ合う時間まで楽しめる",
      },
      {
        number: "02",
        title: "移動中に聴く曲を1人1曲選ぶ",
        copy: "山へ向かう曲、南部を走る曲、港へ戻る曲を1人1曲ずつ選ぶ。車で回る時間にも役割をつくる。",
        payoff: "3曲の旅プレイリストができる",
      },
      {
        number: "03",
        title: "べっこうを2軒で食べ比べる",
        copy: "青唐辛子醤油の辛さや魚は店によって違う。昼と夜で1品ずつ頼み、好みを比べる。",
        payoff: "辛さと魚の違いを話せる",
      },
    ],
    spots: [
      { id: "mihara", title: "三原山山頂口", label: "HIKE", position: [34.7275, 139.3949], summary: "火口周回へ入る火山歩きの基準点。" },
      { id: "urasabaku", title: "裏砂漠", label: "VOLCANO", position: [34.7379, 139.4213], summary: "風と噴火がつくった黒い火山原。" },
      { id: "strata", title: "地層大切断面", label: "GEOLOGY", position: [34.6925, 139.3748], summary: "道路沿いに約630m続く縞状の地層。" },
      { id: "hamanoyu", title: "元町 浜の湯", label: "BATH", position: [34.7536, 139.3501], summary: "夕日の海辺にある水着着用の混浴露天。" },
      { id: "sunset", title: "サンセットパームライン", label: "SUNSET", position: [34.7627, 139.3507], summary: "西岸の海沿い。富士山と夕日の候補。" },
      { id: "habu", title: "波浮港", label: "TOWN", position: [34.6843, 139.4381], summary: "火口湖跡の港町。坂と路地を歩く。" },
      { id: "senzu", title: "泉津の切通し", label: "FOREST", position: [34.793, 139.407], summary: "巨木の根に挟まれた石段の小さな寄り道。" },
      { id: "motomachi", title: "元町港", label: "GATE", position: [34.7529, 139.3519], summary: "西の玄関口。発着港は当日変更の可能性あり。" },
      { id: "okata", title: "岡田港", label: "GATE", position: [34.7895, 139.3907], summary: "北の玄関口。船の到着港を当日確認。" },
      { id: "geonos", title: "伊豆大島ミュージアム ジオノス", label: "MUSEUM", position: [34.7440119, 139.3599974], summary: "火山・生態系・暮らし・防災をつなぐ、雨の日の拠点。" },
    ],
    chapters: [
      {
        number: "01",
        eyebrow: "MORNING / VOLCANO",
        title: "三原山は朝のうちに歩く",
        copy: [
          "三原山では、山頂口から火口周辺へ近づくにつれて、植物のある道から黒い溶岩地形へ景色が変わる。裏砂漠まで歩くか、短い展望コースにするかを出発前に決めたい。",
          "午前中に歩けば、霧や風が出たときも午後の予定を変えやすい。3人で歩くなら、各自が気になった火山の黒を3枚ずつ撮って見せ合うのも楽しい。",
        ],
        image: photos.oshimaMihara,
        note: "山頂付近は風・霧・気温差が大きい。当日の火山・道路・バス情報を確認。",
        sourceLabel: "伊豆大島観光協会｜遊ぶ",
        sourceUrl: "https://izu-oshima.or.jp/play.html",
      },
      {
        number: "02",
        eyebrow: "AFTERNOON / EARTH ARCHIVE",
        title: "地層大切断面は車を止めて見たい",
        copy: [
          "島の南西側には、高さ約24m、長さ約630mと案内される地層大切断面がある。噴火と堆積でできた縞模様が道路沿いに続き、車で走っていても大きさが分かる。",
          "波浮港へ向かう途中でも、見学時間は確保したい。全体が分かる遠景、地層の近景、人を入れた大きさの比較を撮ると、規模をあとで思い出しやすい。",
        ],
        image: photos.oshimaStrata,
        note: "道路沿いのため駐停車と横断に注意。安全な見学場所と交通を優先。",
        sourceLabel: "東京宝島｜大島",
        sourceUrl: "https://www.tokyo-islands.com/about/oshima/",
      },
      {
        number: "03",
        eyebrow: "EVENING / WEST COAST",
        title: "西岸の夕日と浜の湯を続けて楽しむ",
        copy: [
          "西岸のサンセットパームラインを走った後は、元町の浜の湯へ立ち寄れる。水着を朝から持っていけば、夕日と海辺の露天風呂を続けて楽しめる。",
          "大島は発着港が当日に変わることがある。元町港だけを前提にせず、岡田港を使う場合の移動と荷物の預け方を宿に相談しておく。",
        ],
        image: photos.oshimaAerial,
        note: "浜の湯は水着着用。8月の営業時間や天候休業は大島町の当日案内を確認。",
        sourceLabel: "大島町｜元町浜の湯",
        sourceUrl: "https://www.town.oshima.tokyo.jp/soshiki/kankou/hamanoyu.html",
      },
    ],
    itinerary: [
      {
        day: "DAY 01",
        theme: "三原山を歩き、西岸の温泉へ",
        items: [
          { time: "ARRIVE", title: "到着港 → 宿／車", detail: "元町・岡田のどちらかを当日確認。", spotId: "motomachi" },
          { time: "AM", title: "三原山を歩く", detail: "風と霧でコースを短縮できる構成に。", spotId: "mihara" },
          { time: "PM", title: "裏砂漠または島一周へ", detail: "全員の体力と車の有無で二択。", spotId: "urasabaku" },
          { time: "SUNSET", title: "西岸 → 浜の湯", detail: "水着を朝からデイバッグへ。", spotId: "hamanoyu" },
        ],
      },
      {
        day: "DAY 02",
        theme: "地層大切断面と波浮港へ",
        items: [
          { time: "AM", title: "地層大切断面", detail: "南回りで波浮港へ。", spotId: "strata" },
          { time: "NOON", title: "波浮港を歩く", detail: "坂道と港町の時間をゆっくり取る。", spotId: "habu" },
          { time: "DEPART", title: "発着港へ戻る", detail: "当日の港とバス・送迎を再確認。", spotId: "okata" },
        ],
      },
    ],
    food: [
      { title: "べっこう", copy: "青唐辛子醤油に漬けた島の魚。寿司や丼で、店ごとの辛さを比べる。" },
      { title: "伊勢エビと磯もの", copy: "溶岩地形の岩礁で育つ海のもの。入荷と旬を店で聞き、その日にある一皿を選ぶ。" },
      { title: "島の牛乳", copy: "大島の酪農文化を、牛乳・アイス・菓子で休憩に組み込む。" },
      { title: "椿油", copy: "食と手仕事の両方につながる島の素材。土産だけでなく料理でも探す。" },
    ],
    stays: [
      { title: "大島温泉ホテル", type: "VOLCANO + ONSEN", copy: "三原山を望む温泉宿。火山歩きを旅の中心にしたいチーム向き。", url: "https://www.oshima-onsen.co.jp/", cta: "公式サイト" },
      { title: "Book Tea Bed 伊豆大島", type: "PORT + BAR", copy: "元町港から徒歩圏。バーや遊びまで一か所に集めたい身軽な旅向き。", url: "https://btb-oshima.jp/", cta: "公式サイト" },
      { title: "島の宿を横断比較", type: "OFFICIAL DIRECTORY", copy: "民宿、旅館、ホテル、ゲストハウスを公式一覧で比較。送迎条件も見る。", url: "https://www.izu-oshima.or.jp/accommodation.html", cta: "公式宿一覧" },
    ],
    access: [
      { route: "竹芝 → 大島", time: "高速船／大型客船", copy: "季節と便で所要時間が変わる。到着港は当日の運航情報で確認。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "調布 → 大島", time: "飛行機", copy: "便数、運賃、手荷物上限を新中央航空で確認。", url: "https://central-air.co.jp/schedule-fee.html?stt_lang=ja" },
      { route: "島内", time: "バス／車／自転車", copy: "火山と南部を一日でつなぐなら車が有力。タクシーは予約前提。", url: "https://izu-oshima.or.jp/transportation.html" },
      { route: "出発当日の運航", time: "元町港／岡田港", copy: "どちらの港を使うかを当日確認。宿の送迎と荷物の動線も発着港に合わせる。", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
    rules: [
      "発着港は元町港・岡田港のどちらになるか当日まで変わることがある。",
      "三原山は風・霧・火山情報を優先し、無理に予定を完遂しない。",
      "島を広く回る日は車、範囲を絞る日はバスと徒歩。タクシーは予約する。",
      "浜の湯は水着着用。天候や設備で休業・時間変更がある。",
      "地層大切断面は道路沿い。撮影時も車と横断に注意する。",
    ],
    official: [
      { label: "伊豆大島観光協会", url: "https://izu-oshima.or.jp/" },
      { label: "東京宝島｜大島", url: "https://www.tokyo-islands.com/about/oshima/" },
      { label: "大島町", url: "https://www.town.oshima.tokyo.jp/" },
      { label: "ジオノス｜現行施設案内", url: "https://izuoshima-geo.org/know/shisetsu.html" },
      { label: "東海汽船", url: "https://www.tokaikisen.co.jp/" },
    ],
  },
  {
    slug: "niijima",
    order: "03",
    name: "新島",
    reading: "にいじま",
    english: "NIIJIMA",
    verifiedAt: "2026.08.10",
    oneLine: "羽伏浦を自転車で走り、ガラスを見て、夕方は海辺の温泉へ。",
    coverLine: "羽伏浦とガラスを巡る1泊2日",
    shortIntro: "羽伏浦、湯の浜露天温泉、新島ガラスを1泊2日で回る。中心部は自転車で動きやすい。",
    longIntro: "新島では、白ママ断崖と羽伏浦の白い海岸、海辺の露天温泉、淡いオリーブ色の新島ガラスを楽しめる。中心部から羽伏浦までは自転車で移動し、気に入った場所で長く過ごしたい。大島の次に訪れるなら、予定を詰めず休む時間も取る。",
    sectionTitles: {
      plan: "新島は宿の送迎と夕食から決める",
      conditions: "海が荒れたらガラスとモヤイへ",
      missions: "3人で試したい新島の遊び",
      map: "羽伏浦・本村・港の位置を確認する",
      stories: "羽伏浦、ガラス、湯の浜をゆっくり回る",
      route: "新島を1泊2日で回る基本コース",
      food: "くさやと島焼酎、新島の味",
      stay: "送迎と夕食の条件で宿を選ぶ",
      access: "船・飛行機・島間移動を比べる",
    },
    hero: photos.niijimaShiromama,
    cover: photos.niijimaHabushiura,
    mapCenter: [34.373, 139.259],
    mapZoom: 12,
    facts: [
      { value: "6.5km", label: "羽伏浦海岸" },
      { value: "100+", label: "島内のモヤイ像" },
      { value: "2 shores", label: "朝日と夕日の海岸" },
      { value: "0", label: "コンビニ" },
    ],
    fit: [
      { label: "GO FOR", value: "海・自転車・温泉・ガラス" },
      { label: "PACE", value: "1〜2泊、余白多め" },
      { label: "MOVE", value: "中心部は自転車、若郷は車" },
      { label: "BOOK FIRST", value: "宿 → 船 → 必要なら車" },
    ],
    conditionPlans: [
      {
        label: "CLEAR + CALM",
        title: "海が穏やかな日：羽伏浦と湯の浜へ",
        lead: "朝は羽伏浦、午後は新島ガラス、夕方は西岸の湯の浜露天温泉へ回る。",
        steps: [
          "自転車で羽伏浦へ。端まで制覇せず、気に入った場所で長く止まる。",
          "モヤイ像と新島ガラスをつなぎ、同じ石が像と色へ変わる過程を見る。",
          "営業を確認できたら湯の浜へ。夕食の予約時刻から逆算する。",
        ],
        note: "海は眺められても泳げるとは限らない。遊泳・波・監視・現地掲示を優先。",
        sourceLabel: "新島観光案内所｜絶景を満喫する",
        sourceUrl: "https://niijima-info.jp/spectacularview/",
      },
      {
        label: "WIND + ROUGH SEA",
        title: "強風や高波の日：本村とガラスへ",
        lead: "海には入らず、安全な場所から羽伏浦を見る。本村へ戻り、モヤイ像とガラス施設を回る。",
        steps: [
          "羽伏浦は安全な展望地点から見る。崖下や危険区域へ入らない。",
          "本村へ戻り、モヤイ像を三体だけ選んで名前を付ける。",
          "ガラス施設、商店、カフェから営業中の二つをつなぐ。",
        ],
        note: "平成新島トンネルは徒歩・自転車で通れない。若郷方面は車と道路情報を確認。",
        sourceLabel: "新島観光案内所｜島内移動",
        sourceUrl: "https://niijima-info.jp/ido/",
      },
      {
        label: "RAIN",
        title: "雨の日：ガラス施設と島の土産を探す",
        lead: "新島ガラスの制作と展示を見学する。残りの時間は商店を回り、くさやや島焼酎を探す。",
        steps: [
          "新島ガラスアートセンターの開館と体験枠を公式で確認する。",
          "くさや、島焼酎、コーガ石の土産から、島でしか話せない一品を選ぶ。",
          "温泉は利用可否を確認できたときだけ候補にし、宿で翌日の海と帰路を再編集する。",
        ],
        note: "『24時間いつでも入れる』と決め打ちせず、改修・清掃・天候を含む最新告知を確認。",
        sourceLabel: "新島村観光情報｜お知らせ",
        sourceUrl: "https://niijima.com/kankou/news/index.html",
      },
    ],
    friendMissions: [
      {
        number: "01",
        title: "好きなモヤイ像を1体選ぶ",
        copy: "島内にあるモヤイ像から、各自が気に入った1体を選ぶ。写真を撮り、選んだ理由を話す。",
        payoff: "本村を歩く目的ができる",
      },
      {
        number: "02",
        title: "新島の白を3種類撮る",
        copy: "崖、砂、波、建物から3種類の白を撮る。最後に、一番新島らしいと思った写真を選ぶ。",
        payoff: "崖・砂・建物を見比べられる",
      },
      {
        number: "03",
        title: "朝日と夕日の担当を分ける",
        copy: "早起きする人は東の羽伏浦、夕方まで動く人は西の前浜を撮る。宿で写真を見せ合う。",
        payoff: "3人で朝から夕方まで記録できる",
      },
    ],
    spots: [
      { id: "habushiura", title: "羽伏浦海岸", label: "SURF", position: [34.3802, 139.2818], summary: "約6.5km続く白い海岸。遊泳より海況を優先。" },
      { id: "shiromama", title: "白ママ断崖", label: "CLIFF", position: [34.409, 139.279], summary: "島の白い地質が海へ落ちる東岸の断崖。" },
      { id: "yunohama", title: "湯の浜露天温泉", label: "BATH", position: [34.3707, 139.2497], summary: "海辺のギリシャ風露天。無料・水着着用の公式案内。" },
      { id: "glass", title: "新島ガラスアートセンター", label: "CRAFT", position: [34.356, 139.2546], summary: "コーガ石から生まれるオリーブ色のガラス。" },
      { id: "moyai", title: "モヤイ像の丘", label: "ART", position: [34.3728, 139.2517], summary: "島の石と『力を合わせる』文化を探す。" },
      { id: "maehama", title: "前浜海岸", label: "SUNSET", position: [34.3763, 139.2503], summary: "村から近い西岸。夕方散歩の基準点。" },
      { id: "port", title: "新島港", label: "GATE", position: [34.3647, 139.252], summary: "船の玄関口。到着後の宿送迎を確認。" },
      { id: "airport", title: "新島空港", label: "FLIGHT", position: [34.3694, 139.2687], summary: "調布便の玄関口。荷物制限を確認。" },
    ],
    chapters: [
      {
        number: "01",
        eyebrow: "EAST COAST / WHITE CLIFF",
        title: "白ママ断崖が新島の白をつくる",
        copy: [
          "新島の東岸には白ママ断崖が続く。羽伏浦の白い砂や、新島ガラスの原料になるコーガ石も、島の地質を知る手がかりになる。",
          "崖、砂、波打ち際、建物では白の見え方が違う。写真を撮りながら比べると、海岸を歩く時間にも小さな目的ができる。",
        ],
        image: photos.niijimaShiromama,
        note: "崖下や海岸は落石・波・通行規制に注意。現地掲示を優先し、危険区域へ入らない。",
        sourceLabel: "東京宝島｜新島",
        sourceUrl: "https://www.tokyo-islands.com/about/niijima/",
      },
      {
        number: "02",
        eyebrow: "BICYCLE / HABUSHIURA",
        title: "羽伏浦は自転車で好きな場所まで",
        copy: [
          "羽伏浦海岸は約6.5km続く。端まで走ることを目標にせず、中心部から自転車で向かい、気に入った場所で休む。帰りにカフェかガラス施設へ寄ると動きやすい。",
          "サーフスポットとして知られる海だが、いつでも泳げるわけではない。遊泳可否と監視員の案内を優先し、波が強い日は浜から眺める。",
        ],
        image: photos.niijimaHabushiura,
        note: "中心部は自転車向き。若郷へ通じる平成新島トンネルは徒歩・自転車で通れない。",
        sourceLabel: "新島観光協会｜島内移動",
        sourceUrl: "https://niijima-info.jp/ido/",
      },
      {
        number: "03",
        eyebrow: "SUNSET / YUNOHAMA",
        title: "湯の浜露天温泉は夕方に立ち寄る",
        copy: [
          "湯の浜露天温泉は、海辺にあるギリシャ神殿風の温泉だ。水着で利用する施設として案内されている。改修、清掃、天候による変更がないか当日に確認したい。",
          "温泉の後は、予約した店か宿で夕食を取る。新島にはコンビニがなく、店の閉店も早い。飲み物や翌朝の食事は明るいうちに買っておく。",
        ],
        image: photos.niijimaYunohama,
        note: "設備・清掃・天候で利用条件が変わることがある。水着を持参し、現地掲示を確認。",
        sourceLabel: "新島観光協会｜温泉",
        sourceUrl: "https://niijima-info.jp/hotspring/",
      },
    ],
    itinerary: [
      {
        day: "DAY 01",
        theme: "羽伏浦と湯の浜露天温泉へ",
        items: [
          { time: "ARRIVE", title: "港 → 宿へ", detail: "送迎と帰りの集合場所を先に確認。", spotId: "port" },
          { time: "PM", title: "自転車で羽伏浦へ", detail: "波が強ければ海岸散歩と写真へ切り替え。", spotId: "habushiura" },
          { time: "SUNSET", title: "湯の浜露天温泉", detail: "水着とタオルを持って西岸へ。", spotId: "yunohama" },
          { time: "NIGHT", title: "予約店／宿で夕食", detail: "当日難民にならないよう一つだけ確保。" },
        ],
      },
      {
        day: "DAY 02",
        theme: "モヤイ像と新島ガラスを見る",
        items: [
          { time: "AM", title: "モヤイ探し", detail: "見つけた像に勝手な名前をつける。", spotId: "moyai" },
          { time: "PM", title: "新島ガラス体験", detail: "開館日と制作体験の予約枠を公式で確認。", spotId: "glass" },
          { time: "DEPART", title: "港／空港へ", detail: "船・飛行機の運航と荷物を再確認。", spotId: "airport" },
        ],
      },
    ],
    food: [
      { title: "島寿司と地魚", copy: "当日の魚と営業で選ぶ。店は席数が限られるため、夕食は予約候補を持つ。" },
      { title: "くさや", copy: "島の発酵文化を一口だけでも試す。店・宿・持ち帰りで、匂いへの配慮まで含めて選ぶ。" },
      { title: "島焼酎", copy: "東京諸島の麦麹で仕込む焼酎。小さなボトルや銘柄の違いを、土産店で聞いて選ぶ。" },
      { title: "カフェ休憩", copy: "自転車の途中に一軒だけ目的地を置き、海と温泉の間に余白をつくる。" },
      { title: "夜の買い出し", copy: "コンビニと24時間ATMはない。飲み物・朝食・現金を明るいうちに確保。" },
    ],
    stays: [
      { title: "新島の宿を公式一覧で探す", type: "OFFICIAL DIRECTORY", copy: "宿数が限られ、観光案内所は予約代行をしない。交通と並行して直接問い合わせる。", url: "https://niijima-info.jp/stay/", cta: "公式宿一覧" },
      { title: "グループの基地を選ぶ", type: "HOSTEL / VILLA", copy: "宿の場所、送迎、レンタサイクル、夕食の有無をセットで比較する。", url: "https://niijima-info.jp/stay/", cta: "宿タイプを比較" },
      { title: "食事条件まで先に見る", type: "DINNER PLAN", copy: "素泊まりなら夕食店を同時に確保。島の夜を空席探しで終わらせない。", url: "https://niijima-info.jp/restaurant/", cta: "飲食店一覧" },
    ],
    access: [
      { route: "竹芝 → 新島", time: "高速船／大型客船", copy: "季節で便・所要時間が変わる。東海汽船の同日検索を優先。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "調布 → 新島", time: "飛行機", copy: "発売時期、便数、手荷物制限を予約前に確認。", url: "https://central-air.co.jp/schedule-fee.html?stt_lang=ja" },
      { route: "神津島 → 新島", time: "島間船の候補", copy: "現在比較中の新島案。8/30の同日接続、海況、発着港、空席を確認するまでは未採用。", url: "https://www.tokyo-islands.com/access/" },
      { route: "出発当日の運航", time: "船／飛行機", copy: "島間移動を含め、同日の接続を運航情報で再確認。成立しなければ一島集中へ戻す。", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
    rules: [
      "宿は早めに直接予約。交通が取れるまで仮予約扱いになる宿もある。",
      "コンビニと24時間ATMはない。買い出しと現金準備を日中に済ませる。",
      "飲食店は席数・営業日が限られる。夕食は予約かテイクアウト候補を持つ。",
      "平成新島トンネルは徒歩・自転車で通れない。若郷方面は車を検討。",
      "海の遊泳可否は当日の海況・監視員・掲示を最優先する。",
    ],
    official: [
      { label: "新島観光協会", url: "https://niijima-info.jp/" },
      { label: "東京宝島｜新島", url: "https://www.tokyo-islands.com/about/niijima/" },
      { label: "新島公式マップ", url: "https://niijima-info.jp/cms24/wp-content/uploads/2026/06/niijimaA3MAP.pdf" },
      { label: "新島ガラスアートセンター", url: "https://niijimaglass.org/contents/center.html" },
      { label: "東海汽船", url: "https://www.tokaikisen.co.jp/" },
    ],
  },
];

export const islandsBySlug = Object.fromEntries(islands.map((island) => [island.slug, island])) as Record<Island["slug"], Island>;

export const overviewPoints: MapPoint[] = [
  { id: "tokyo", title: "竹芝客船ターミナル", label: "TOKYO", position: [35.6537, 139.7628], summary: "島旅の船の起点。" },
  { id: "oshima", title: "大島", label: "02 / VOLCANO", position: [34.737, 139.387], summary: "火山の黒と地層を歩く。" },
  { id: "niijima", title: "新島", label: "03 / WHITE", position: [34.373, 139.259], summary: "白い海岸を自転車でつなぐ。" },
  { id: "kozushima", title: "神津島", label: "01 / SKY", position: [34.212, 139.139], summary: "天上山、海、星を一つの島で。" },
  { id: "chofu", title: "調布飛行場", label: "FLIGHT", position: [35.6717, 139.528], summary: "神津島まで約45分の空路。" },
];

export const overviewRoutes: MapRoute[] = [
  {
    label: "共通案：東京 → 神津島（交通手段は未確定）",
    positions: [[35.6537, 139.7628], [34.212, 139.139]],
    color: "#ff4b2b",
    dash: true,
  },
  {
    label: "案A：神津島 → 大島（同日接続は未確認）",
    positions: [[34.212, 139.139], [34.737, 139.387]],
    color: "#d6ea4b",
    dash: true,
  },
  {
    label: "案B：神津島 → 新島（同日接続は未確認）",
    positions: [[34.212, 139.139], [34.373, 139.259]],
    color: "#0e6b77",
    dash: true,
  },
];

export const bookingLinks = [
  { index: "01", title: "船の空席を調べる", detail: "竹芝・島間・復路を同じ日付で確認。", status: "LIVE CHECK", url: "https://www.tokaikisenyoyaku.com/app/login" },
  { index: "02", title: "神津島の宿を先に押さえる", detail: "野宿不可。繁忙期は宿が旅程の成立条件。", status: "FIRST", url: "https://kozushima.com/yado-list/" },
  { index: "03", title: "大島の宿と島内交通", detail: "発着港変更と送迎条件まで比較。", status: "COMPARE", url: "https://www.izu-oshima.or.jp/accommodation.html" },
  { index: "04", title: "新島の宿と夕食", detail: "宿・飲食店とも数が限られるため並行確認。", status: "EARLY", url: "https://niijima-info.jp/stay/" },
];
