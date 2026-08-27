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
  researchedFacts?: string[];
  cautions?: string[];
  sources?: Array<{ label: string; url: string }>;
};

export type MapRoute = {
  label: string;
  positions: LatLng[];
  color: string;
  dash?: boolean;
};

export type Island = {
  slug: "kozushima" | "oshima" | "niijima" | "toshima" | "shikinejima" | "miyakejima" | "mikurajima" | "hachijojima";
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

export const photos = {
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
  toshimaOffshore: {
    src: "/photos/toshima-offshore.jpg",
    alt: "海上から見た円すい形の利島",
    credit: "Photo: E-190 / Wikimedia Commons / CC BY-SA 3.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Toshima-Island(Izu-Islands).jpg",
  },
  toshimaStreet: {
    src: "/photos/toshima-street.jpg",
    alt: "利島の急な坂道と集落",
    credit: "Photo: ゆうき315 / Wikimedia Commons / CC BY-SA 3.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Toshima_street.jpg",
  },
  shikinejimaKanbiki: {
    src: "https://shikinejima.tokyo/cms/wp-content/uploads/2021/08/beach_01_photo01.jpg",
    alt: "緑の岬に囲まれた式根島の泊海水浴場",
    credit: "Photo: 一般社団法人式根島観光協会",
    creditUrl: "https://shikinejima.tokyo/play/beach/",
  },
  shikinejimaJinata: {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Chinata_spa_view_from_upper.jpg",
    alt: "崖の谷間から海へ続く式根島の地鉈温泉",
    credit: "Photo: Soica2001 / Wikimedia Commons / Public domain",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Chinata_spa_view_from_upper.jpg",
  },
  shikinejimaIshijiro: {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Ishijirogawa_Beach%2C_Shikinejima%2C_Tokyo%2C_Japan.JPG",
    alt: "式根島の石白川海水浴場",
    credit: "Photo: Shoestring / Wikimedia Commons / CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Ishijirogawa_Beach,_Shikinejima,_Tokyo,_Japan.JPG",
  },
  miyakejimaAerial: {
    src: "https://res-2.cloudinary.com/jnto/image/upload/w_1600,c_fill,f_auto,q_auto/v1646732908/tokyo/M_00521_010",
    alt: "海から立ち上がる三宅島の火山地形",
    credit: "Photo: JNTO / Travel Japan",
    creditUrl: "https://www.japan.travel/en/spot/1620/",
  },
  miyakejimaCrater: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Miyakejima_O-Yama_Volcano_crater.jpg/1280px-Miyakejima_O-Yama_Volcano_crater.jpg",
    alt: "三宅島・雄山の火口",
    credit: "Photo: さかおり / Wikimedia Commons / CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Miyakejima_O-Yama_Volcano_crater.jpg",
  },
  miyakejimaTrail: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Experience_the_Volcano_Hiking_Trail.jpg/1280px-Experience_the_Volcano_Hiking_Trail.jpg",
    alt: "溶岩原の中を通る三宅島の火山体験遊歩道",
    credit: "Photo: LT sfm / Wikimedia Commons / CC BY-SA 3.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Experience_the_Volcano_Hiking_Trail.jpg",
  },
  mikurajimaIsland: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mikura-jima.jpg/1280px-Mikura-jima.jpg",
    alt: "深い森に覆われた御蔵島の全景",
    credit: "Photo: Izawa Ryu / Wikimedia Commons / CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Mikura-jima.jpg",
  },
  mikurajimaDolphin: {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/46/Dolphin_Mikurajima_Tokyo_Japan.jpg",
    alt: "御蔵島の海を泳ぐミナミハンドウイルカ",
    credit: "Photo: Shinji / Wikimedia Commons / CC BY 2.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dolphin_Mikurajima_Tokyo_Japan.jpg",
  },
  mikurajimaInane: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Inane_Shrine_on_Mikurajima_Island-crop.jpg/1280px-Inane_Shrine_on_Mikurajima_Island-crop.jpg",
    alt: "御蔵島の稲根神社",
    credit: "Photo: ブルーノ・プラス / Wikimedia Commons / CC BY 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Inane_Shrine_on_Mikurajima_Island-crop.jpg",
  },
  hachijojimaFuji: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Mount_Hachijofuji.jpg/1280px-Mount_Hachijofuji.jpg",
    alt: "緑に覆われた八丈富士",
    credit: "Photo: akabane_hiro2 / Wikimedia Commons / CC BY-SA 2.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Mount_Hachijofuji.jpg",
  },
  hachijojimaUrami: {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/52/HachijyoCity_UramiGaTaki.JPG",
    alt: "亜熱帯の森を流れ落ちる八丈島の裏見ヶ滝",
    credit: "Photo: Kentagon / Wikimedia Commons / CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:HachijyoCity_UramiGaTaki.JPG",
  },
  hachijojimaFreesia: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Hachijojima_freesia_festival_2007-03-21.jpg/1280px-Hachijojima_freesia_festival_2007-03-21.jpg",
    alt: "八丈富士を背景に咲くフリージア",
    credit: "Photo: Geomr / Wikimedia Commons / CC BY-SA 3.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Hachijojima_freesia_festival_2007-03-21.jpg",
  },
} satisfies Record<string, Photo>;

export const islands: Island[] = [
  {
    slug: "kozushima",
    order: "05",
    name: "神津島",
    reading: "こうづしま",
    english: "KŌZUSHIMA",
    verifiedAt: "2026.08.12",
    oneLine: "朝は天上山、午後は海辺、夜は星空。神津島は2泊3日で楽しみたい。",
    coverLine: "天上山と星空を楽しむ2泊3日",
    shortIntro: "天上山、多幸湾、赤崎遊歩道、星空を2泊3日で回る。山と海の両方を楽しみたい2人旅に向く。",
    longIntro: "神津島には、標高572mの天上山、白い岩壁に囲まれた多幸湾、木道が続く赤崎遊歩道がある。夜は東京都で初めて認定された星空保護区の空を待つ。朝・昼・夜でやりたいことがはっきり分かれるため、2泊すると天候による変更もしやすい。",
    sectionTitles: {
      plan: "多幸湾のテント場とレンタカーを先に押さえる",
      conditions: "天上山に登れない日の選択肢も持つ",
      missions: "2人で楽しむ神津島の小さな遊び",
      map: "天上山・港・海岸の位置を確認する",
      stories: "朝の天上山から夜の星空まで",
      route: "神津島を2泊3日で回る基本コース",
      food: "金目鯛と島の水を味わう",
      stay: "指定キャンプ場で、山と星の夜をつくる",
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
      { label: "BOOK FIRST", value: "指定キャンプ場 → レンタカー → 船" },
    ],
    conditionPlans: [
      {
        label: "CLEAR + CALM",
        title: "晴れて風が弱い日：天上山へ",
        lead: "天上山は朝のうちに歩く。午後は赤崎か多幸湾、夜は雲が少なければ星空観察へ。",
        steps: [
          "朝のうちに天上山へ。コースと下山時刻を同行者と共有し、必要ならガイドへ相談する。",
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
          "予約店かキャンプ飯で地魚の夜。翌日の山・海・帰路を同時に組み直す。",
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
          "2人で登るなら、写真、地図、水分の確認を分担すると動きやすい。裏砂漠展望地などの集合場所と下山時刻も先に決めておく。",
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
          { time: "ARRIVE", title: "港／空港 → 車 → 多幸湾", detail: "車を受け取り、明るいうちに指定区画へ設営。翌日の天上山と船も確認。", spotId: "port" },
          { time: "PM", title: "赤崎遊歩道", detail: "バスの最終便から逆算。泳げない日は木道散歩へ。", spotId: "akasaki" },
          { time: "SUNSET", title: "前浜海岸", detail: "夕食前の30分を空け、水平線の色を見る。", spotId: "maehama" },
          { time: "NIGHT", title: "星空の第一候補", detail: "晴天時だけ実行。月齢と雲量で場所を変える。", spotId: "yotane" },
        ],
      },
      {
        day: "DAY 02",
        theme: "天上山と多幸湾を回る",
        items: [
          { time: "07:00", title: "天上山へ", detail: "早出。コースと下山時刻を同行者で共有し、必要ならガイドへ相談。", spotId: "tenjo" },
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
      { title: "地魚の夜", copy: "予約店、テイクアウト、キャンプ飯の順で候補を持ち、売り切れと閉店に備える。" },
      { title: "島の水とクラフトビール", copy: "東京名湧水57選に選ばれた水を生かした一杯。提供店と在庫を確認し、温泉や星空の前後に置く。" },
      { title: "山の行動食", copy: "朝出発に備え、前日に飲み物と携行食を確保。島では夜間に買える場所が限られる。" },
    ],
    stays: [
      { title: "多幸湾ファミリーキャンプ場", type: "FIXED / DESIGNATED CAMP", copy: "今回の1泊目候補。指定場所以外の野営は禁止。予約枠、2026年夏の受入、工事影響、テント区画を先に確認する。", url: "https://www.vill.kouzushima.tokyo.jp/camp/", cta: "村のキャンプ案内" },
      { title: "神津島のレンタカーを確保", type: "HARD GATE / CAR", copy: "車両数が少ない夏の最優先事項。あーす・アイラナ・神津島レンタカーへ、キャンプ利用でも借りられるか直接確認する。", url: "https://www.t-treasureislands.metro.tokyo.lg.jp/kouzushima/", cta: "東京都の交通案内" },
      { title: "星空ガイドと組み合わせる", type: "NIGHT GUIDE", copy: "星の場所・時間・安全を現地ガイドに委ねる選択肢。月齢と催行条件を確認する。", url: "https://kozushima.com/star/guide/", cta: "星空ガイド" },
      { title: "島の体験をまとめて探す", type: "ECOTOUR", copy: "山・海・自然体験は公式エコツアー窓口から。繁忙期はキャンプと車の確認に並行して問い合わせる。", url: "https://kozushima.com/", cta: "公式観光サイト" },
    ],
    access: [
      { route: "調布 → 神津島", time: "約45分", copy: "飛行機。便数、運賃、手荷物上限、天候条件を予約画面で確認。", url: "https://central-air.co.jp/schedule-fee.html?stt_lang=ja" },
      { route: "竹芝 → 神津島", time: "高速船／大型客船", copy: "所要時間と運航日は季節で変動。キャンプと車の受入を確かめ、同じ日付で往復を検索。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "神津島 → 新島", time: "8/30 10:30→11:45 / 13:25→14:05", copy: "大型客船とジェット船の両方が運航予定。8/30の客船運休日は東京発側で、神津島発2000便には当てはまらない。空席と当日の港は未確認。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "島内を動く", time: "島内レンタカー", copy: "今回の固定条件。夏は台数が少ないため、キャンプ場より先に借りられる事業者と港・空港での受渡しを確認する。", url: "https://www.t-treasureislands.metro.tokyo.lg.jp/kouzushima/" },
      { route: "出発当日の運航", time: "船／飛行機", copy: "発着港、欠航、条件付き運航を当日に再確認。予定より公式の運航判断を優先。", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
    rules: [
      "野宿と指定場所以外のキャンプは禁止。今回は指定キャンプ場を予約してから来島する。",
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
    order: "01",
    name: "大島",
    reading: "おおしま",
    english: "ŌSHIMA",
    verifiedAt: "2026.08.10",
    oneLine: "三原山を歩き、地層大切断面を見て、夕方は海辺の温泉へ。",
    coverLine: "三原山と島南部を回る1泊2日",
    shortIntro: "三原山、裏砂漠、地層大切断面を1泊2日で回る。島を広く動くなら車が便利だ。",
    longIntro: "大島では、標高758mの三原山、黒い火山原が広がる裏砂漠、道路沿いに続く地層大切断面を見られる。朝に火山を歩き、午後は南部の地層と波浮港へ。西岸へ戻れる日は、夕日と浜の湯まで続けて楽しめる。",
    sectionTitles: {
      plan: "トウシキの区画とレンタカーを同時に押さえる",
      conditions: "三原山が見えない日は南部へ回る",
      missions: "2人で試したい大島の遊び",
      map: "三原山・南部・2つの港を確認する",
      stories: "三原山、地層、温泉を1泊2日に組む",
      route: "大島を1泊2日で回る基本コース",
      food: "べっこうと椿、大島の味",
      stay: "トウシキで、海と星に近い一夜をつくる",
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
      { label: "BOOK FIRST", value: "トウシキ予約 → 車 → 船" },
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
          "午前中に歩けば、霧や風が出たときも午後の予定を変えやすい。2人で歩くなら、各自が気になった火山の黒を3枚ずつ撮って見せ合うのも楽しい。",
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
          "大島は発着港が当日に変わることがある。元町港だけを前提にせず、岡田港でも車を受け取れるか、キャンプ装備をどう運ぶかを予約時に確認しておく。",
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
          { time: "ARRIVE", title: "到着港 → 車 → トウシキ", detail: "元町・岡田のどちらかを当日確認し、車を受け取って指定区画へ。", spotId: "motomachi" },
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
      { title: "トウシキキャンプ場", type: "FIXED / FREE CAMP", copy: "今回の3泊目候補。無料だがWeb事前予約は必須。岡田港・元町港から車で約20〜25分、送迎はない。", url: "https://www.town.oshima.tokyo.jp/soshiki/kankou/toshiki-camp.html", cta: "大島町の予約案内" },
      { title: "レンタカーを港違いまで含めて予約", type: "HARD GATE / CAR", copy: "到着港は元町・岡田のどちらにもなり得る。受渡し、乗り捨て、営業時間を予約時に揃える。", url: "https://izu-oshima.or.jp/transportation.html", cta: "島内交通" },
    ],
    access: [
      { route: "竹芝 → 大島", time: "高速船／大型客船", copy: "季節と便で所要時間が変わる。到着港は当日の運航情報で確認。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "調布 → 大島", time: "飛行機", copy: "便数、運賃、手荷物上限を新中央航空で確認。", url: "https://central-air.co.jp/schedule-fee.html?stt_lang=ja" },
      { route: "新島 → 大島", time: "8/31 9:50→11:45", copy: "3島テント案の3区間目。ジェット船1420便で式根島・神津島を経由する。8/31は島発大型客船2000便の運休日。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "島内", time: "バス／車／自転車", copy: "火山と南部を一日でつなぐなら車が有力。タクシーは予約前提。", url: "https://izu-oshima.or.jp/transportation.html" },
      { route: "出発当日の運航", time: "元町港／岡田港", copy: "どちらの港を使うかを当日確認。車の返却場所とテント装備の動線も発着港に合わせる。", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
    rules: [
      "トウシキは無料でも事前Web予約必須。車はテント横付け前提にせず、指定駐車・施設ルールに従う。",
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
    verifiedAt: "2026.08.12",
    oneLine: "羽伏浦を自転車で走り、ガラスを見て、夕方は海辺の温泉へ。",
    coverLine: "羽伏浦とガラスを巡る1泊2日",
    shortIntro: "羽伏浦、湯の浜露天温泉、新島ガラスを1泊2日で回る。中心部は自転車で動きやすい。",
    longIntro: "新島では、白ママ断崖と羽伏浦の白い海岸、海辺の露天温泉、淡いオリーブ色の新島ガラスを楽しめる。中心部から羽伏浦までは自転車で移動し、気に入った場所で長く過ごしたい。大島の次に訪れるなら、予定を詰めず休む時間も取る。",
    sectionTitles: {
      plan: "羽伏浦の当日受付とレンタカーを先に組む",
      conditions: "海が荒れたらガラスとモヤイへ",
      missions: "2人で試したい新島の遊び",
      map: "羽伏浦・本村・港の位置を確認する",
      stories: "羽伏浦、ガラス、湯の浜をゆっくり回る",
      route: "新島を1泊2日で回る基本コース",
      food: "くさやと島焼酎、新島の味",
      stay: "羽伏浦で、白い海岸の夜をつくる",
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
      { label: "BOOK FIRST", value: "レンタカー → 船 → 当日キャンプ届" },
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
          "温泉は利用可否を確認できたときだけ候補にし、キャンプ場で翌日の海と帰路を組み直す。",
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
        copy: "早起きする人は東の羽伏浦、夕方まで動く人は西の前浜を撮る。テントへ戻ったら写真を見せ合う。",
        payoff: "2人で朝から夕方まで記録できる",
      },
    ],
    spots: [
      { id: "habushiura", title: "羽伏浦海岸", label: "SURF", position: [34.3802, 139.2818], summary: "約6.5km続く白い海岸。遊泳より海況を優先。" },
      { id: "shiromama", title: "白ママ断崖", label: "CLIFF", position: [34.409, 139.279], summary: "島の白い地質が海へ落ちる東岸の断崖。" },
      { id: "yunohama", title: "湯の浜露天温泉", label: "BATH", position: [34.3707, 139.2497], summary: "海辺のギリシャ風露天。無料・水着着用の公式案内。" },
      { id: "glass", title: "新島ガラスアートセンター", label: "CRAFT", position: [34.356, 139.2546], summary: "コーガ石から生まれるオリーブ色のガラス。" },
      { id: "moyai", title: "モヤイ像の丘", label: "ART", position: [34.3728, 139.2517], summary: "島の石と『力を合わせる』文化を探す。" },
      { id: "maehama", title: "前浜海岸", label: "SUNSET", position: [34.3763, 139.2503], summary: "村から近い西岸。夕方散歩の基準点。" },
      { id: "port", title: "新島港", label: "GATE", position: [34.3647, 139.252], summary: "船の玄関口。到着後すぐ車を受け取り、16時までにキャンプ届。" },
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
          "温泉の後は、予約店かテイクアウト、キャンプ飯で夕食を取る。新島にはコンビニがなく、店の閉店も早い。飲み物や翌朝の食事は明るいうちに買っておく。",
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
          { time: "ARRIVE", title: "港 → 車 → キャンプ受付", detail: "14:05着後に車を受け取り、16:00までに羽伏浦でキャンプ届。", spotId: "port" },
          { time: "PM", title: "自転車で羽伏浦へ", detail: "波が強ければ海岸散歩と写真へ切り替え。", spotId: "habushiura" },
          { time: "SUNSET", title: "湯の浜露天温泉", detail: "水着とタオルを持って西岸へ。", spotId: "yunohama" },
          { time: "NIGHT", title: "予約店／キャンプ飯", detail: "閉店前の買い出しを済ませ、火気と消灯のルールに従う。" },
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
      { title: "くさや", copy: "島の発酵文化を一口だけでも試す。店・持ち帰りの方法と、キャンプ場での匂いへの配慮まで含めて選ぶ。" },
      { title: "島焼酎", copy: "東京諸島の麦麹で仕込む焼酎。小さなボトルや銘柄の違いを、土産店で聞いて選ぶ。" },
      { title: "カフェ休憩", copy: "自転車の途中に一軒だけ目的地を置き、海と温泉の間に余白をつくる。" },
      { title: "夜の買い出し", copy: "コンビニと24時間ATMはない。飲み物・朝食・現金を明るいうちに確保。" },
    ],
    stays: [
      { title: "都立羽伏浦野営場", type: "FIXED / SAME-DAY CHECK-IN", copy: "今回の2泊目候補。無料・予約不要だが、利用開始日の9:00〜16:00にクラブハウスでキャンプ届を出す。先着100人。", url: "https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html", cta: "新島村の利用方法" },
      { title: "新島のレンタカーを予約", type: "HARD GATE / CAR", copy: "大きな荷物をバスへ載せられないため、テント装備を運べる車種・受渡港・営業時間を先に確認する。", url: "https://niijima-info.jp/ido/", cta: "島内交通一覧" },
      { title: "食材と燃料を明るいうちに確保", type: "CAMP SUPPLY", copy: "野営場では貸テント、食材、炭の販売も電源もない。ジェット船の手荷物制限と合わせて持込・現地調達を分ける。", url: "https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html", cta: "設備を確認" },
    ],
    access: [
      { route: "竹芝 → 新島", time: "高速船／大型客船", copy: "季節で便・所要時間が変わる。東海汽船の同日検索を優先。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "調布 → 新島", time: "飛行機", copy: "発売時期、便数、手荷物制限を予約前に確認。", url: "https://central-air.co.jp/schedule-fee.html?stt_lang=ja" },
      { route: "神津島 → 新島", time: "8/30 13:25→14:05", copy: "3島テント案の2区間目。ジェット船2430便。大型客船10:30→11:45も運航予定だが、装備の扱いと空席を同じ条件で照合する。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "新島 → 大島", time: "8/31 9:50→11:45", copy: "ジェット船1420便。式根島・神津島を経由して大島へ向かう。8/31は島発大型客船2000便の運休日。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "出発当日の運航", time: "船／飛行機", copy: "島間移動を含め、同日の接続を運航情報で再確認。成立しなければ一島集中へ戻す。", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
    rules: [
      "羽伏浦野営場は予約不要でも当日受付が必要。受付は先着順で、貸テント・燃料・食材・電源はない。",
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
  {
    slug: "toshima",
    order: "02",
    name: "利島",
    reading: "としま",
    english: "TOSHIMA",
    verifiedAt: "2026.08.12",
    oneLine: "海から見ると一つの山。上陸すると、椿畑と急坂と約300人の暮らしが近い。",
    coverLine: "椿の坂を歩き、島の小ささを味方にする一日",
    shortIntro: "利島は『何個スポットを回ったか』より、港から集落、椿畑、展望地までを自分の足でつないだ時間が残る島です。",
    longIntro: "面積4.04平方キロメートル、周囲約8キロメートル。平地がほとんどない円すい形の島に、集落と約20万本とされる椿が重なります。島内にバス、タクシー、レンタカーはありません。宿と食事を先に確保し、坂を歩ける装備で来ること。それ自体が利島を選ぶ条件です。",
    sectionTitles: {
      plan: "利島は、船より先に宿と食事へ電話する",
      conditions: "港と坂の島だから、風で一日を組み替える",
      missions: "小さな島で、友達と見つけるもの",
      map: "港、集落、椿畑、南ヶ山を一本の坂で読む",
      stories: "円すいの島に、椿と海の暮らしが重なる",
      route: "利島を急がず歩く一泊二日",
      food: "宿の食卓と島の海産物を中心にする",
      stay: "宿の少なさを、旅程の最初の条件にする",
      access: "着岸と復路を毎日確認する",
    },
    hero: photos.toshimaOffshore,
    cover: photos.toshimaStreet,
    mapCenter: [34.52, 139.28],
    mapZoom: 13,
    facts: [
      { value: "4.04 km²", label: "面積" },
      { value: "約8 km", label: "周囲" },
      { value: "508 m", label: "宮塚山" },
      { value: "約300人", label: "人口" },
      { value: "約20万本", label: "椿" },
    ],
    fit: [
      { label: "BEST FOR", value: "椿・巨樹・坂道・静かな集落" },
      { label: "PACE", value: "1泊2日。日帰り前提にしない" },
      { label: "MOVE", value: "徒歩中心。車は宿へ相談" },
      { label: "BOOK FIRST", value: "宿・夕食・復路" },
    ],
    conditionPlans: [
      { label: "晴れ・弱風", title: "南ヶ山まで歩き、島列を見る", lead: "集落から南へ上がり、海に並ぶ新島・式根島・神津島を一枚の風景にする。", steps: ["港と集落を歩く", "椿畑の段々を観察", "南ヶ山園地で休む"], note: "坂が続く。帰路の体力と日没時刻を残す。", sourceLabel: "利島村｜観る・遊ぶ", sourceUrl: "https://www.toshimamura.org/tourism/watch/" },
      { label: "強風・港注意", title: "集落と郷土資料館に範囲を絞る", lead: "遠くへ伸ばさず、縄文から海運までを資料館と集落で読む。", steps: ["当日の運航確認", "郷土資料館", "神社と石垣を歩く"], note: "船の条件が悪い日は、翌日の復路を最優先に確認。", sourceLabel: "東海汽船｜運航状況", sourceUrl: "https://www.tokaikisen.co.jp/schedule/" },
      { label: "雨", title: "宿の人から、椿と海の話を聞く", lead: "屋内施設は多くない。無理に観光を増やさず、資料館と宿の時間を主役にする。", steps: ["資料館の開館確認", "買い出し", "宿で翌日の相談"], note: "飲食店は事前連絡が前提。宿の食事条件も確認する。", sourceLabel: "利島村｜交通アクセス", sourceUrl: "https://www.toshimamura.org/tourism/come-to-toshima/access.html" },
    ],
    friendMissions: [
      { number: "01", title: "坂の角度を一枚で残す", copy: "海と集落が同時に入る場所を探す。", payoff: "島の地形が伝わる旅の表紙になる。" },
      { number: "02", title: "椿油の使い方を聞く", copy: "土産として買う前に、採取と搾油の話を聞く。", payoff: "花の写真が暮らしの話へ変わる。" },
      { number: "03", title: "見えた島を当てる", copy: "南ヶ山から島列を地図と照合する。", payoff: "次の島候補がその場で決まる。" },
    ],
    spots: [
      { id: "port", title: "利島港", label: "ARRIVAL", position: [34.5266, 139.2823], summary: "島の玄関。着岸状況は当日確認。" },
      { id: "museum", title: "利島村郷土資料館", label: "HISTORY", position: [34.5292, 139.2828], summary: "縄文から現在までの暮らしを読む。" },
      { id: "camellia", title: "椿畑", label: "LIVING LANDSCAPE", position: [34.5243, 139.2785], summary: "斜面に連なる段々畑。" },
      { id: "miyatsuka", title: "宮塚山展望台", label: "FOREST", position: [34.5217, 139.2757], summary: "巨樹めぐりの道の入口。" },
      { id: "minamigayama", title: "南ヶ山園地", label: "VIEW", position: [34.5076, 139.2768], summary: "南の島々を望む草地。" },
    ],
    chapters: [
      { number: "01", eyebrow: "CONE & SLOPE", title: "平らな島ではない。港から暮らしまで、ずっと坂だ", copy: ["利島は海底火山の活動でできた、円すい形の島です。北側の斜面に一つの集落がまとまり、砂浜はありません。海から見た単純な輪郭の内側に、生活のための道、石垣、畑が細かく刻まれています。", "島を徒歩で回ることは、観光手段の不足ではなく、地形を身体で読む方法です。港から集落へ上がるだけで、この島が海とどう付き合ってきたかが分かります。"], image: photos.toshimaOffshore, note: "港から先は急坂。荷物は軽くし、宿の送迎可否を確認。", sourceLabel: "利島村｜島の紹介", sourceUrl: "https://toshimamura.org/about/toshima.html" },
      { number: "02", eyebrow: "CAMELLIA ECONOMY", title: "約20万本の椿は、花畑ではなく仕事の風景", copy: ["利島の斜面を覆う椿は、冬の名所であると同時に、種から油を採る生業の基盤です。村は椿油の生産量が全国でも有数で、何度も日本一になったと紹介しています。", "段々の椿畑を歩くときは、写真映えだけでなく、斜面を管理し、実を拾い、搾る仕事まで想像したい。私有地へ入らず、道から風景を読みます。"], image: photos.toshimaStreet, note: "椿畑は生活と生産の場所。道を外れず、作業を妨げない。", sourceLabel: "利島村｜歴史・概要", sourceUrl: "https://toshimamura.org/about/toshima.html" },
      { number: "03", eyebrow: "SEA CONNECTIONS", title: "小さな島は、六千年前から海の中継地だった", copy: ["利島村の紹介では、約六千年前に渡来した人々が神津島産黒曜石を運ぶ中継地として島を使った可能性が示されています。縄文・弥生土器も見つかり、海は孤立ではなく移動の道でした。", "現在も船が生活と旅を支えます。ただし桟橋は海況の影響を受けやすい。古い海上交流と、今日の着岸条件を同じ島の現実として見る特集です。"], image: photos.toshimaOffshore, note: "日程には予備を持ち、当日の運航情報を優先。", sourceLabel: "利島村｜歴史・概要", sourceUrl: "https://toshimamura.org/about/toshima.html" },
    ],
    itinerary: [
      { day: "DAY 1", theme: "港から集落へ、島の輪郭を歩く", items: [
        { time: "ARRIVE", title: "宿へ荷物を預ける", detail: "送迎と食事時間を確認。", spotId: "port" },
        { time: "AM", title: "郷土資料館", detail: "海運、民具、遺跡から島の時間軸をつかむ。", spotId: "museum" },
        { time: "PM", title: "椿畑と神社", detail: "生活道から段々畑を読む。", spotId: "camellia" },
        { time: "NIGHT", title: "宿で夕食", detail: "外食先探しを当日に残さない。" },
      ] },
      { day: "DAY 2", theme: "宮塚山か南ヶ山を一つ選ぶ", items: [
        { time: "AM", title: "展望地へ", detail: "天候と体力で宮塚山か南ヶ山を選択。", spotId: "minamigayama" },
        { time: "NOON", title: "集落へ戻る", detail: "復路の運航を再確認。" },
        { time: "DEPART", title: "利島港", detail: "早めに港へ。", spotId: "port" },
      ] },
    ],
    food: [
      { title: "宿の島ごはん", copy: "魚、自家製野菜、季節の食材。宿選びと夕食選びを一つにする。" },
      { title: "伊勢えび・サザエ", copy: "漁期と水揚げ次第。必ず食べられる名物ではなく、当日の恵みとして聞く。" },
      { title: "椿油", copy: "食用・化粧用など用途を確認し、島の生業の話と一緒に持ち帰る。" },
    ],
    stays: [
      { title: "利島の民宿へ直接問い合わせる", type: "GUESTHOUSE", copy: "村役場は空室を把握せず、予約代行もしない。各宿へ直接連絡する。", url: "https://www.toshimamura.org/tourism/stay/guesthouse.html", cta: "民宿一覧" },
      { title: "食事と送迎を同時に確認", type: "MEAL / PICKUP", copy: "夕食、朝食、港送迎、荷物預かりを予約時にまとめて聞く。", url: "https://www.toshimamura.org/tourism/stay/guesthouse.html", cta: "条件を確認" },
    ],
    access: [
      { route: "竹芝 → 利島", time: "ジェット船／大型客船", copy: "季節で便と寄港順が変わる。乗船日検索で確認。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "下田 → 利島", time: "神新汽船", copy: "東海汽船ではなく神新汽船の運航。曜日と島順を確認。", url: "http://shinshin-kisen.jp/" },
      { route: "島内", time: "徒歩", copy: "公共交通とレンタカーはない。宿へ送迎の相談をする。", url: "https://www.toshimamura.org/tourism/come-to-toshima/access.html" },
    ],
    rules: [
      "キャンプ・野宿は禁止。宿を確保してから乗船する。",
      "島内にバス、タクシー、レンタカー、レンタバイクはない。",
      "食堂利用は事前連絡し、宿にも食事条件を相談する。",
      "椿畑や作業地へ無断で入らない。",
      "往復の運航を当日確認し、欠航時の余白を持つ。",
    ],
    official: [
      { label: "利島村", url: "https://www.toshimamura.org/" },
      { label: "利島村｜観光", url: "https://www.toshimamura.org/tourism/" },
      { label: "東海汽船｜利島", url: "https://www.tokaikisen.co.jp/island/toshima/" },
      { label: "東海汽船｜運航状況", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
  },
  {
    slug: "shikinejima",
    order: "04",
    name: "式根島",
    reading: "しきねじま",
    english: "SHIKINEJIMA",
    verifiedAt: "2026.08.12",
    oneLine: "入り江で泳ぎ、潮の時刻に温泉へ。小ささが一日の密度を上げる島。",
    coverLine: "自転車で海岸を渡り歩き、最後は海中温泉へ",
    shortIntro: "式根島は、絶景を遠くから眺める島ではありません。入り江、展望台、海中温泉が自転車の距離でつながり、潮と風に合わせて順番を変えられます。",
    longIntro: "面積3.67平方キロメートル、南北2.5キロメートル。リアス式海岸が複雑な入り江をつくり、地鉈温泉では湧き出す熱い湯と海水が混ざる場所を探します。新島から連絡船で渡れる近さも大きな魅力。三島案の中では、新島と組む理由が最も分かりやすい島です。",
    sectionTitles: {
      plan: "式根島は、潮と風から一日の順番を決める",
      conditions: "海に入れない日も、温泉と展望台がある",
      missions: "友達と遊ぶ、海と温泉の小さな課題",
      map: "野伏港から、入り江と温泉を円にしてつなぐ",
      stories: "入り組んだ海岸に、温泉と暮らしが宿る",
      route: "式根島を自転車で味わう一泊二日",
      food: "海遊びの前後に、島の食堂と買い出しを置く",
      stay: "集落の中に泊まり、朝夕の海を手に入れる",
      access: "新島との近さと、本土便を使い分ける",
    },
    hero: photos.shikinejimaKanbiki,
    cover: photos.shikinejimaJinata,
    mapCenter: [34.324, 139.216],
    mapZoom: 13,
    facts: [
      { value: "3.67 km²", label: "面積" },
      { value: "12.2 km", label: "海岸延長" },
      { value: "2.5 km", label: "南北" },
      { value: "3か所", label: "無料露天温泉" },
      { value: "約10分", label: "新島から連絡船" },
    ],
    fit: [
      { label: "BEST FOR", value: "入り江・海中温泉・自転車" },
      { label: "PACE", value: "1泊2日。日中一日でも輪郭は見える" },
      { label: "MOVE", value: "自転車＋徒歩" },
      { label: "CURRENT TRIP", value: "2026年度はキャンプ場閉場のため対象外" },
    ],
    conditionPlans: [
      { label: "晴れ・海穏やか", title: "泊海岸から地鉈温泉へ", lead: "朝は穏やかな入り江、午後は潮位を見て温泉。", steps: ["泊海水浴場", "神引展望台", "地鉈温泉"], note: "遊泳可否と温泉の湯加減は当日現地で判断。", sourceLabel: "式根島観光協会", sourceUrl: "https://shikinejima.tokyo/" },
      { label: "強風・遊泳不可", title: "展望台と集落を自転車でつなぐ", lead: "海へ入らず、神引・ぐんじ山・足地山の眺めを比較する。", steps: ["レンタサイクル確認", "展望台を二つ選ぶ", "松が下雅湯"], note: "岬では風が強い。自転車を降りる判断を早めに。", sourceLabel: "式根島観光協会｜観光", sourceUrl: "https://shikinejima.tokyo/play/" },
      { label: "雨", title: "温泉と集落の短い往復にする", lead: "憩の家、商店、屋根のある休憩を中心にして詰め込まない。", steps: ["憩の家の営業確認", "集落で昼食", "雨が弱まれば海岸散歩"], note: "屋外露天温泉は足元が滑りやすい。無理をしない。", sourceLabel: "新島村｜式根島ガイド", sourceUrl: "https://www.niijima.com/kankou/files/230323shikinejimaA4.pdf" },
    ],
    friendMissions: [
      { number: "01", title: "ちょうどいい湯船を探す", copy: "地鉈温泉で海水との混ざり方を比べる。", payoff: "潮の満ち引きを体で覚える。" },
      { number: "02", title: "一番好きな入り江を決める", copy: "泊、中の浦、石白川を同じ角度で撮る。", payoff: "島の海岸線の違いが見える。" },
      { number: "03", title: "新島を見つける", copy: "展望台から隣島との距離を確かめる。", payoff: "二島旅が一本の地理になる。" },
    ],
    spots: [
      { id: "nobushi", title: "野伏港", label: "ARRIVAL", position: [34.3315, 139.2188], summary: "東海汽船と連絡船の玄関。" },
      { id: "tomari", title: "泊海水浴場", label: "COVE", position: [34.3288, 139.218], summary: "扇形に囲まれた穏やかな入り江。" },
      { id: "kanbiki", title: "神引展望台", label: "VIEW", position: [34.331, 139.2102], summary: "島々と複雑な海岸線を見渡す。" },
      { id: "jinata", title: "地鉈温泉", label: "GEO ONSEN", position: [34.3197, 139.2136], summary: "海水で適温を探す海中温泉。" },
      { id: "miyabi", title: "松が下雅湯", label: "ONSEN", position: [34.3176, 139.2226], summary: "24時間無料、要水着の露天湯。" },
      { id: "ishijiro", title: "石白川海水浴場", label: "BEACH", position: [34.3186, 139.2165], summary: "集落と商店に近い白砂の浜。" },
    ],
    chapters: [
      { number: "01", eyebrow: "RIA COAST", title: "海岸線が入り組むほど、一日の選択肢が増える", copy: ["式根島は小さな台地状の島ですが、周囲の海岸線は湾と岬が細かく入り組んでいます。泊、中の浦、大浦、石白川は、同じ島の海でも波の入り方と景色が違います。", "海況が一様ではないからこそ、当日の風向きと遊泳情報を見て場所を選べます。『全部行く』より、二つの入り江を比べる方が式根島らしい一日になります。"], image: photos.shikinejimaKanbiki, note: "海水浴場の開設と遊泳可否は現地掲示を優先。", sourceLabel: "東海汽船｜式根島", sourceUrl: "https://www.tokaikisen.co.jp/island/shikinejima/" },
      { number: "02", eyebrow: "TIDE & HEAT", title: "地鉈温泉では、潮が温度を決める", copy: ["地鉈温泉は、鉈で割ったような谷間に湧く海中温泉です。源泉は熱く、潮が入り込むことで入れる温度の場所が生まれます。つまり訪問時刻だけでなく、潮位が体験の一部です。", "足付温泉、松が下雅湯、憩の家と並べると、自然湧出から引湯、屋内施設まで、島が温泉と付き合う複数の方法が見えてきます。"], image: photos.shikinejimaJinata, note: "要水着。高温部と濡れた岩に注意し、現地ルールを守る。", sourceLabel: "式根島観光協会｜温泉", sourceUrl: "https://shikinejima.tokyo/play/onsen/" },
      { number: "03", eyebrow: "TWO ISLANDS", title: "新島まで約4キロ。二島を別々に考えない", copy: ["式根島は新島村の一部で、新島の南約4キロにあります。連絡船にしきで結ばれ、観光でも暮らしでも近い関係です。", "一方、式根島には吹之江や石白川の縄文遺跡があり、独自の集落と海岸文化があります。新島の付録ではなく、近さを使って性格の違いを比べる島です。"], image: photos.shikinejimaIshijiro, note: "連絡船は天候で変わる。往復便を当日に確認。", sourceLabel: "東京都環境局｜新島と式根島の歴史", sourceUrl: "https://www.kankyo1.metro.tokyo.lg.jp/naturepark/know/park/introduction/kokuritsu/fujihakone/niijima/history.html" },
    ],
    itinerary: [
      { day: "DAY 1", theme: "入り江と展望台を自転車で比べる", items: [
        { time: "ARRIVE", title: "野伏港で自転車を受け取る", detail: "荷物と宿送迎を確認。", spotId: "nobushi" },
        { time: "AM", title: "泊海水浴場", detail: "遊泳情報を見て、入るか眺めるか決める。", spotId: "tomari" },
        { time: "PM", title: "神引展望台", detail: "入り組んだ海岸線を上から読む。", spotId: "kanbiki" },
        { time: "EVENING", title: "地鉈温泉", detail: "潮と湯温を確認。", spotId: "jinata" },
      ] },
      { day: "DAY 2", theme: "朝の海と集落の温泉", items: [
        { time: "AM", title: "石白川海岸", detail: "朝の集落から歩ける浜。", spotId: "ishijiro" },
        { time: "LATE AM", title: "松が下雅湯", detail: "水着とタオルを持って短く入浴。", spotId: "miyabi" },
        { time: "DEPART", title: "野伏港", detail: "新島連絡船または本土便へ。", spotId: "nobushi" },
      ] },
    ],
    food: [
      { title: "たたき・島の魚", copy: "当日の魚を食堂か宿で。夕食は宿条件と一緒に確認。" },
      { title: "明日葉", copy: "天ぷら、和え物、麺。海遊び後の食事で島の苦味を試す。" },
      { title: "商店で補給", copy: "自転車の前に水と軽食を確保。閉店時間を先に見る。" },
    ],
    stays: [
      { title: "2026年度は野営場を使えない", type: "CLOSED / CURRENT YEAR", copy: "新島村の現行案内では、式根島地区の野営場は管理体制の都合で継続閉場中。野宿も禁止のため、今回のテント3泊候補には入れない。", url: "https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html", cta: "新島村の現行案内" },
      { title: "島の記事は次の旅のために残す", type: "EDITORIAL FILE", copy: "海中温泉と入り江は大きな魅力。キャンプ場が再開した年度に、公式発表を確認して候補へ戻す。", url: "https://shikinejima.tokyo/", cta: "式根島観光協会" },
    ],
    access: [
      { route: "竹芝 → 式根島", time: "ジェット船／大型客船", copy: "季節便。東海汽船の乗船日検索で確認。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "新島 ↔ 式根島", time: "連絡船にしき", copy: "約10分。運航時刻と欠航情報を新島村で確認。", url: "https://www.niijima.com/kankou/shikinejima/access/" },
      { route: "島内", time: "自転車／徒歩", copy: "坂と未舗装区間がある。電動自転車も比較。", url: "https://shikinejima.tokyo/" },
    ],
    rules: [
      "2026年度は式根島地区の野営場が継続閉場中。島内の野宿も禁止。今回の固定条件とは両立しない。",
      "海中温泉は要水着。源泉の高温部と滑る岩に注意。",
      "遊泳可否は当日の監視員・掲示・海況を優先。",
      "新島連絡船を含め、島間移動は同日に再確認。",
      "夜の温泉へ行くならライトと羽織るものを持つ。",
      "自転車は歩行者と集落の生活道路を優先する。",
    ],
    official: [
      { label: "式根島観光協会", url: "https://shikinejima.tokyo/" },
      { label: "新島村", url: "https://www.niijima.com/" },
      { label: "東海汽船｜式根島", url: "https://www.tokaikisen.co.jp/island/shikinejima/" },
      { label: "東海汽船｜時刻表", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
    ],
  },
  {
    slug: "miyakejima",
    order: "06",
    name: "三宅島",
    reading: "みやけじま",
    english: "MIYAKEJIMA",
    verifiedAt: "2026.08.12",
    oneLine: "噴火の痕跡を歩き、森の池で鳥を待つ。大地が動き続けることを隠さない島。",
    coverLine: "溶岩と森を車でつなぐ、火山の一日",
    shortIntro: "黒い溶岩原、再生する森、大路池の静けさが同じ環状道路の先にあります。火山を過去形で見ない旅です。",
    longIntro: "面積約55.5平方キロメートル。三宅島は1940年、1962年、1983年、2000年と噴火を経験し、避難と帰島を経て暮らしをつないできました。火山体験遊歩道、アカコッコ館、大路池を車で結ぶと、破壊と再生を一日の中で見比べられます。",
    sectionTitles: {
      plan: "大久保浜の営業確認と車を最初に揃える",
      conditions: "火山ガス、風、雨で見る場所を組み替える",
      missions: "溶岩と森を友達と読み比べる",
      map: "港、溶岩原、大路池を環状道路でつなぐ",
      stories: "噴火の島を、破壊だけで語らない",
      route: "三宅島の地形を車で読む一泊二日",
      food: "火山島の水と海の恵みを食べる",
      stay: "大久保浜でテントを張れる年か確認する",
      access: "早朝着から逆算し、車の受渡しを決める",
    },
    hero: photos.miyakejimaAerial,
    cover: photos.miyakejimaTrail,
    mapCenter: [34.079, 139.526],
    mapZoom: 11,
    facts: [
      { value: "約55.5 km²", label: "面積" },
      { value: "775 m", label: "雄山" },
      { value: "4回", label: "20世紀以降の主な噴火" },
      { value: "4–11月", label: "大久保浜の案内期間" },
      { value: "13区画", label: "テントサイト" },
    ],
    fit: [
      { label: "BEST FOR", value: "火山・野鳥・一周ドライブ" },
      { label: "PACE", value: "1泊2日。早朝着を休息込みで使う" },
      { label: "MOVE", value: "レンタカー" },
      { label: "CURRENT TRIP", value: "キャンプ2026営業の再確認が必要" },
    ],
    conditionPlans: [
      { label: "晴れ・規制なし", title: "火山体験遊歩道から大路池へ", lead: "午前に溶岩、午後に森。対照的な二地点へ絞る。", steps: ["火山・ガス情報を確認", "火山体験遊歩道", "アカコッコ館と大路池"], note: "立入規制と火山ガス情報は当日の自治体案内を優先。", sourceLabel: "三宅島観光協会", sourceUrl: "https://www.miyakejima.gr.jp/" },
      { label: "強風", title: "海岸を追わず、森と資料へ", lead: "岬を減らし、アカコッコ館と集落の展示に時間を使う。", steps: ["運航と風を確認", "アカコッコ館", "車で短い展望地"], note: "倒木、波しぶき、規制区間へ近づかない。", sourceLabel: "三宅村", sourceUrl: "https://www.vill.miyake.tokyo.jp/" },
      { label: "雨", title: "島の噴火史を先に読む", lead: "屋内で2000年噴火と帰島の記録を押さえ、止み間だけ森へ。", steps: ["施設開館を確認", "火山資料を読む", "買い出しとキャンプ判断"], note: "大雨時はテント設営を無理に進めず、管理者の指示に従う。", sourceLabel: "気象庁｜三宅島", sourceUrl: "https://www.data.jma.go.jp/vois/data/tokyo/320_Miyakejima/320_index.html" },
    ],
    friendMissions: [
      { number: "01", title: "黒と緑を同じ画角で探す", copy: "溶岩と植生回復が隣り合う場所を撮る。", payoff: "噴火後の時間が一枚に入る。" },
      { number: "02", title: "鳥の声を三つ記録する", copy: "大路池では姿より先に声を待つ。", payoff: "歩く速度が森に合う。" },
      { number: "03", title: "噴火年を地図へ置く", copy: "1940、1962、1983、2000年の痕跡を照合する。", payoff: "島全体が一冊の地層になる。" },
    ],
    spots: [
      { id: "miike", title: "三池港", label: "GATE", position: [34.0684, 139.5607], summary: "発着候補の一つ。港は当日決定。" },
      { id: "volcano", title: "火山体験遊歩道", label: "LAVA", position: [34.0567, 139.4847], summary: "1983年溶岩流と旧阿古小中学校の痕跡。" },
      { id: "tairo", title: "大路池", label: "FOREST", position: [34.0489, 139.5287], summary: "照葉樹林と野鳥の静かな火口湖。" },
      { id: "akakokko", title: "アカコッコ館", label: "BIRD", position: [34.0501, 139.5307], summary: "自然情報と観察の入口。" },
      { id: "okubo", title: "大久保浜キャンプ場", label: "CAMP", position: [34.1185, 139.5189], summary: "予約制の海辺の小規模サイト。" },
      { id: "nippana", title: "新鼻新山", label: "SCORIA", position: [34.0451, 139.5174], summary: "1983年噴火で一夜に生まれた火砕丘。" },
    ],
    chapters: [
      { number: "01", eyebrow: "ISLAND IN MOTION", title: "噴火年を覚えると、道沿いの景色が読める", copy: ["三宅島は一つの古い火山を眺める島ではありません。20世紀以降だけでも複数回の噴火があり、溶岩流は集落や学校、道路の輪郭を変えました。", "火山体験遊歩道では1983年噴火の溶岩と建物跡を歩けます。災害を見世物にせず、避難と復旧の時間まで含めて静かに読む場所です。"], image: photos.miyakejimaTrail, note: "立入区域と火山ガス情報を必ず確認。", sourceLabel: "気象庁｜三宅島の活動史", sourceUrl: "https://www.data.jma.go.jp/vois/data/tokyo/320_Miyakejima/320_history.html" },
      { number: "02", eyebrow: "2000 ERUPTION", title: "全島避難の五年を、現在の風景に重ねる", copy: ["2000年噴火では全島避難が行われ、島民は島外での生活を余儀なくされました。2005年の避難指示解除後も、火山ガスと規制を見ながら暮らしが再建されました。", "旅人が見る新しい道路や植生も、この帰島後の時間の上にあります。火山を勇ましい絶景だけで語らないことが、この島を訪ねる最低限の礼儀です。"], image: photos.miyakejimaCrater, note: "雄山山頂周辺は規制情報を確認し、許可のない区域へ入らない。", sourceLabel: "三宅村｜火山・防災", sourceUrl: "https://www.vill.miyake.tokyo.jp/disaster/" },
      { number: "03", eyebrow: "FOREST RETURNS", title: "大路池では、火山島のもう一つの時間が流れる", copy: ["大路池周辺には照葉樹林が残り、国の天然記念物アカコッコをはじめとする野鳥が暮らします。溶岩原から車で移ると、同じ島とは思えない湿り気と音に変わります。", "噴火後の再生を知るには、植物の名前を全部覚える必要はありません。黒い地面から緑が戻る境界と、長く残った森の両方を比べれば十分です。"], image: photos.miyakejimaAerial, note: "観察では静かに距離を取り、採取しない。", sourceLabel: "三宅島自然ふれあいセンター", sourceUrl: "https://www.wbsj.org/activity/conservation/habitat-conservation/miyake/" },
    ],
    itinerary: [
      { day: "DAY 1", theme: "溶岩から森へ", items: [
        { time: "EARLY", title: "港で車を受け取る", detail: "早朝着。眠気を残したまま急がない。", spotId: "miike" },
        { time: "AM", title: "火山体験遊歩道", detail: "1983年の溶岩を短く歩く。", spotId: "volcano" },
        { time: "PM", title: "大路池とアカコッコ館", detail: "森で速度を落とす。", spotId: "tairo" },
        { time: "EVENING", title: "大久保浜で設営", detail: "区画と風を確認して明るいうちに張る。", spotId: "okubo" },
      ] },
      { day: "DAY 2", theme: "新しい大地と海岸", items: [
        { time: "AM", title: "新鼻新山", detail: "規制と足元を見て短時間。", spotId: "nippana" },
        { time: "NOON", title: "給油・返車", detail: "港決定後に返却場所を合わせる。" },
        { time: "DEPART", title: "出港地へ", detail: "当日の港へ余裕を持って移動。" },
      ] },
    ],
    food: [
      { title: "明日葉", copy: "天ぷらや和え物。火山島の緑を食卓でも味わう。" },
      { title: "地魚", copy: "その日の水揚げを店で聞く。早朝着の日は営業開始まで急がない。" },
      { title: "キャンプの買い出し", copy: "島内商店の営業時間を先に見て、燃料の持込可否も船会社へ確認。" },
    ],
    stays: [
      { title: "大久保浜キャンプ場", type: "CONDITIONAL / RESERVATION", copy: "4月1日〜11月30日・予約制・13区画と観光協会が案内。ただし現行ページ表記が2025シーズンのため、2026年8月の受入を電話で再確認する。", url: "https://www.miyakejima.gr.jp/play/camp/", cta: "公式キャンプ案内" },
      { title: "三宅島のレンタカー", type: "CAR", copy: "早朝着に合わせた受渡し、港変更、返却時刻を予約時に相談する。", url: "https://www.miyakejima.gr.jp/", cta: "観光協会" },
    ],
    access: [
      { route: "竹芝 → 三宅島", time: "大型客船・翌5:00着", copy: "南航路3400便。港は当日決まる。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "島内", time: "レンタカー", copy: "環状道路で火山・森・キャンプ場をつなぐ。", url: "https://www.miyakejima.gr.jp/" },
      { route: "北航路の島々", time: "定期直結なし", copy: "大島・新島・神津島とは同じ定期航路ではない。3泊4日の混載案には大きな接続負担がある。", url: "https://www.tokaikisen.co.jp/boarding/route/" },
    ],
    rules: [
      "大久保浜の2026年営業・予約受付は、現行ページの年度表記を理由に電話で再確認する。",
      "火山ガス、立入規制、天候は三宅村と気象庁の当日情報を優先。",
      "早朝着の運転は休息を入れる。",
      "車をテント横へ付けられるオートキャンプとは決めつけない。指定駐車に従う。",
    ],
    official: [
      { label: "三宅島観光協会", url: "https://www.miyakejima.gr.jp/" },
      { label: "三宅村", url: "https://www.vill.miyake.tokyo.jp/" },
      { label: "気象庁｜三宅島", url: "https://www.data.jma.go.jp/vois/data/tokyo/320_Miyakejima/320_index.html" },
      { label: "東海汽船｜三宅島", url: "https://www.tokaikisen.co.jp/island/miyakejima/" },
    ],
  },
  {
    slug: "mikurajima",
    order: "07",
    name: "御蔵島",
    reading: "みくらじま",
    english: "MIKURAJIMA",
    verifiedAt: "2026.08.12",
    oneLine: "深い森から水が落ち、野生のイルカが島の周りで暮らす。予約なしでは降りられない島。",
    coverLine: "森と海へ、島のルールを借りて入る",
    shortIntro: "御蔵島では、自由に回ることより、宿・ガイド・海況の順序を守ることが旅そのものになります。",
    longIntro: "面積約20.6平方キロメートル。急峻な森から海へ水が落ち、周辺海域には野生のミナミハンドウイルカが暮らします。一方で野宿は禁止され、宿泊予約のない来島者は下船できません。魅力と受入条件を切り離さずに読む島です。",
    sectionTitles: {
      plan: "宿とガイドが取れてから船を押さえる",
      conditions: "着岸できない日を旅程に織り込む",
      missions: "距離を守って森と海を見る",
      map: "港、集落、森の入口を小さく読む",
      stories: "水の島を、イルカだけで終わらせない",
      route: "予約とガイドに沿う一泊二日",
      food: "宿の食卓で島の暮らしを知る",
      stay: "予約した宿が上陸条件になる",
      access: "条件付き寄港を前提にする",
    },
    hero: photos.mikurajimaIsland,
    cover: photos.mikurajimaDolphin,
    mapCenter: [33.875, 139.602],
    mapZoom: 12,
    facts: [
      { value: "約20.6 km²", label: "面積" },
      { value: "851 m", label: "御山" },
      { value: "宿予約必須", label: "上陸条件" },
      { value: "野営禁止", label: "島内ルール" },
      { value: "ガイド制", label: "森とイルカ" },
    ],
    fit: [
      { label: "BEST FOR", value: "原生林・巨樹・野生イルカ" },
      { label: "PACE", value: "最低1泊、欠航余白を持つ" },
      { label: "MOVE", value: "徒歩＋予約ガイド" },
      { label: "CURRENT TRIP", value: "テント泊禁止のため対象外" },
    ],
    conditionPlans: [
      { label: "海穏やか", title: "認定事業者のイルカ船へ", lead: "観察ルールを聞き、動物側の距離を優先する。", steps: ["体調と海況確認", "事業者の説明", "短い観察と記録"], note: "遭遇や入水を保証しない。船長とガイドの中止判断が最優先。", sourceLabel: "御蔵島観光協会", sourceUrl: "https://mikura-isle.com/" },
      { label: "海が荒れる", title: "集落と資料を静かに歩く", lead: "海へ出ず、宿の案内で集落の範囲に留まる。", steps: ["復路確認", "集落散歩", "宿で翌日相談"], note: "港周辺も波しぶきが強い。立入指示に従う。", sourceLabel: "東海汽船｜運航状況", sourceUrl: "https://www.tokaikisen.co.jp/schedule/" },
      { label: "雨", title: "森へ入らず、水の島を聞く", lead: "増水と滑落を避け、宿や資料から島の水利用を知る。", steps: ["ガイド判断", "集落内だけ歩く", "帰路の余白確認"], note: "無許可で山道や巨樹へ入らない。", sourceLabel: "御蔵島観光協会｜初めての方", sourceUrl: "https://mikura-isle.com/first-mikura/" },
    ],
    friendMissions: [
      { number: "01", title: "見つけるより、待つ", copy: "イルカや鳥を追わず、ガイドが示す距離で待つ。", payoff: "野生を予定表へ従わせない。" },
      { number: "02", title: "水音を三つ集める", copy: "雨、沢、海の音を言葉で記録する。", payoff: "島の水循環が残る。" },
      { number: "03", title: "できなかったことも記録する", copy: "海況で中止になった理由を残す。", payoff: "安全判断も旅の経験になる。" },
    ],
    spots: [
      { id: "port", title: "御蔵島港", label: "GATE", position: [33.8978, 139.596], summary: "着岸条件が厳しい島の玄関。" },
      { id: "village", title: "御蔵島集落", label: "VILLAGE", position: [33.896, 139.5987], summary: "港上の斜面にまとまる暮らし。" },
      { id: "inane", title: "稲根神社", label: "BELIEF", position: [33.8951, 139.6008], summary: "島の信仰をたどる入口。" },
      { id: "forest", title: "巨樹の森", label: "GUIDED", position: [33.882, 139.606], summary: "入域ルールとガイド案内が前提。" },
      { id: "dolphin", title: "イルカ観察海域", label: "WILDLIFE", position: [33.88, 139.58], summary: "野生個体の暮らす海。場所は海況次第。" },
    ],
    chapters: [
      { number: "01", eyebrow: "FOREST HOLDS WATER", title: "森の厚みが、海まで続く水をつくる", copy: ["御蔵島は急な斜面の大半が森に覆われ、雨を受けた水が沢や滝となって海へ落ちます。平地の少なさは不便だけでなく、森と海が近い理由でもあります。", "巨樹を訪ねる道は自由散策の公園ではありません。ガイド制度と入山ルールは、旅人を排除するためではなく、薄い土壌と暮らしを守る仕組みです。"], image: photos.mikurajimaIsland, note: "山域はガイドと最新ルールを確認。", sourceLabel: "御蔵島観光協会｜自然", sourceUrl: "https://mikura-isle.com/" },
      { number: "02", eyebrow: "WILD DOLPHINS", title: "イルカはアトラクションではなく、島の海の住民", copy: ["御蔵島周辺では野生のミナミハンドウイルカが継続的に観察されています。個体識別と調査が積み重ねられ、観光にも接近方法や時間のルールがあります。", "会えるか、泳げるかは海況と動物次第です。写真の成功より、追わない判断とガイドの指示を持ち帰る方が、この島らしい記録になります。"], image: photos.mikurajimaDolphin, note: "認定事業者を利用し、野生動物へ触れない・追わない。", sourceLabel: "御蔵島観光協会｜ドルフィンスイム", sourceUrl: "https://mikura-isle.com/dolphin/" },
      { number: "03", eyebrow: "RULES OF ARRIVAL", title: "宿予約がないと降りられない。その厳しさが島を支える", copy: ["御蔵島は受入規模が小さく、野宿も日帰り観光も認めていません。宿泊予約を済ませ、宿に船と到着日を伝えることが上陸の前提です。", "港は外海に面し、船が着岸できない日もあります。予定どおりに着く権利はないと理解し、前後の余白を用意することが、島との最初の約束です。"], image: photos.mikurajimaInane, note: "宿なし来島、野宿、無断入山はしない。", sourceLabel: "御蔵島観光協会｜初めての方", sourceUrl: "https://mikura-isle.com/first-mikura/" },
    ],
    itinerary: [
      { day: "DAY 1", theme: "島の案内に速度を合わせる", items: [
        { time: "ARRIVE", title: "宿の出迎えを確認", detail: "着岸できた場合のみ上陸。", spotId: "port" },
        { time: "AM", title: "集落と稲根神社", detail: "生活範囲を静かに歩く。", spotId: "inane" },
        { time: "PM", title: "予約ガイドの案内", detail: "森か海、成立する方だけ。" },
        { time: "NIGHT", title: "宿で明日の海況を聞く", detail: "復路を最優先。" },
      ] },
      { day: "DAY 2", theme: "海況に従い、帰路を守る", items: [
        { time: "AM", title: "成立すればイルカ船", detail: "中止も通常の選択。", spotId: "dolphin" },
        { time: "DEPART", title: "御蔵島港", detail: "条件付き運航を確認。", spotId: "port" },
      ] },
    ],
    food: [
      { title: "宿の食事", copy: "外食前提にせず、宿泊予約時に夕朝食を確認する。" },
      { title: "明日葉と地魚", copy: "その日に用意できる島のものを、宿の説明と一緒に食べる。" },
      { title: "水", copy: "森から海へ続く水の島。補給場所と持参量を宿へ確認する。" },
    ],
    stays: [
      { title: "今回のテント旅では選べない", type: "PROHIBITED", copy: "島内のキャンプ・野宿は禁止。宿泊施設の予約がない来島者は上陸できず、日帰り観光もできない。", url: "https://mikura-isle.com/first-mikura/", cta: "上陸条件を確認" },
      { title: "将来は宿とガイドを一緒に予約", type: "FUTURE TRIP", copy: "別の旅として訪ねるなら、宿、船、ガイド、欠航余白の順で組む。", url: "https://mikura-isle.com/category/stay/", cta: "宿の案内" },
    ],
    access: [
      { route: "竹芝 → 御蔵島", time: "大型客船・翌6:00着", copy: "着岸できない場合がある。宿へ便を共有する。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "島内", time: "徒歩＋ガイド", copy: "レンタカー旅行の島ではない。宿・ガイドの案内に従う。", url: "https://mikura-isle.com/first-mikura/" },
      { route: "北航路の島々", time: "定期直結なし", copy: "大島・新島・神津島と同じ定期航路ではない。", url: "https://www.tokaikisen.co.jp/boarding/route/" },
    ],
    rules: [
      "キャンプ・野宿は禁止。今回の固定条件とは両立しない。",
      "宿泊予約のない来島、日帰り観光は不可。",
      "森とイルカは認定ガイド・事業者のルールに従う。",
      "着岸できない可能性を前提に、前後の予定と費用に余白を持つ。",
    ],
    official: [
      { label: "御蔵島観光協会", url: "https://mikura-isle.com/" },
      { label: "初めて御蔵島へ来る方へ", url: "https://mikura-isle.com/first-mikura/" },
      { label: "東海汽船｜御蔵島", url: "https://www.tokaikisen.co.jp/island/mikurajima/" },
      { label: "東海汽船｜運航状況", url: "https://www.tokaikisen.co.jp/schedule/" },
    ],
  },
  {
    slug: "hachijojima",
    order: "08",
    name: "八丈島",
    reading: "はちじょうじま",
    english: "HACHIJOJIMA",
    verifiedAt: "2026.08.12",
    oneLine: "二つの火山、亜熱帯の森、黄八丈。広さを車で楽しむ南の島。",
    coverLine: "八丈富士から森と温泉へ、一周ドライブ",
    shortIntro: "八丈富士と三原山、海辺のキャンプ場、島の染織が一つの大きな島に同居します。車が旅の自由度を大きく上げます。",
    longIntro: "面積69.11平方キロメートル。円錐形の八丈富士と古い三原山がつながる八丈島は、伊豆諸島でも旅の選択肢が多い島です。裏見ヶ滝、温泉、黄八丈の工房、海岸を車でつなぎ、全部を回らず一日一つの地形へ絞ると輪郭が見えます。",
    sectionTitles: {
      plan: "底土の申請とレンタカーから決める",
      conditions: "山が雲なら森と文化へ切り替える",
      missions: "二つの火山と島の色を集める",
      map: "八丈富士と三原山を車でつなぐ",
      stories: "火山、流人文化、黄八丈を一つの島史で読む",
      route: "八丈島を車で味わう一泊二日",
      food: "島寿司と明日葉、くさやを少しずつ",
      stay: "底土の海辺でテント泊する",
      access: "船と飛行機を、帰路まで二本立てで持つ",
    },
    hero: photos.hachijojimaFuji,
    cover: photos.hachijojimaUrami,
    mapCenter: [33.108, 139.79],
    mapZoom: 10,
    facts: [
      { value: "69.11 km²", label: "面積" },
      { value: "854.3 m", label: "八丈富士" },
      { value: "約287 km", label: "東京から南へ" },
      { value: "100人", label: "底土キャンプ定員" },
      { value: "事前申請", label: "底土の利用" },
    ],
    fit: [
      { label: "BEST FOR", value: "一周ドライブ・火山・温泉・食" },
      { label: "PACE", value: "2泊以上で天候の余白を持つ" },
      { label: "MOVE", value: "レンタカー" },
      { label: "BOOK FIRST", value: "底土申請 → 車 → 船／飛行機" },
    ],
    conditionPlans: [
      { label: "晴れ・弱風", title: "八丈富士のお鉢か、牧野の展望へ", lead: "山頂条件が良い日だけ高所へ。午後は南原千畳敷へ回る。", steps: ["山頂天候確認", "鉢巻道路か登山", "南原千畳敷"], note: "山頂は強風・霧が出る。無理ならふれあい牧場で止める。", sourceLabel: "八丈島観光協会", sourceUrl: "https://www.hachijo.gr.jp/" },
      { label: "山が雲", title: "裏見ヶ滝と黄八丈へ", lead: "低い森を歩き、工房や歴史民俗資料館へつなぐ。", steps: ["裏見ヶ滝", "黄八丈の展示", "温泉"], note: "雨後の遊歩道は滑る。通行情報を確認。", sourceLabel: "八丈島観光協会｜観光", sourceUrl: "https://www.hachijo.gr.jp/sightseeing/" },
      { label: "雨・強風", title: "食と手仕事の島へ切り替える", lead: "島寿司、黄八丈、資料館を車で短くつなぐ。", steps: ["営業確認", "工房・資料", "早めに底土へ戻る"], note: "テントの風対策を優先し、管理者の中止判断に従う。", sourceLabel: "八丈町", sourceUrl: "https://www.town.hachijo.tokyo.jp/" },
    ],
    friendMissions: [
      { number: "01", title: "二つの火山を一枚に入れる", copy: "八丈富士側と三原山側の地形を見比べる。", payoff: "島の大きさが伝わる。" },
      { number: "02", title: "黄八丈の三色を探す", copy: "黄・樺・黒が植物から生まれる話を聞く。", payoff: "土産が技術の記憶になる。" },
      { number: "03", title: "島寿司を一貫ずつ交換する", copy: "魚と漬け方の違いを比べる。", payoff: "食事が小さな品評会になる。" },
    ],
    spots: [
      { id: "fuji", title: "八丈富士", label: "VOLCANO", position: [33.1368, 139.7668], summary: "伊豆諸島最高峰。天候で登山判断。" },
      { id: "sokodo", title: "底土キャンプ場", label: "CAMP", position: [33.125, 139.8197], summary: "港近くの無料・事前申請制キャンプ場。" },
      { id: "urami", title: "裏見ヶ滝", label: "FOREST", position: [33.0614, 139.8046], summary: "滝の裏を歩く亜熱帯の遊歩道。" },
      { id: "miharashi", title: "みはらしの湯", label: "ONSEN", position: [33.0687, 139.8462], summary: "末吉の高台から海を望む温泉。" },
      { id: "nanbara", title: "南原千畳敷", label: "LAVA COAST", position: [33.109, 139.7469], summary: "八丈富士の溶岩が海へ続く西岸。" },
      { id: "folk", title: "歴史民俗資料館", label: "HISTORY", position: [33.1057, 139.7882], summary: "流人史と島の暮らしを読む。" },
    ],
    chapters: [
      { number: "01", eyebrow: "TWO VOLCANOES", title: "若い八丈富士と古い三原山が、一つの島をつくる", copy: ["八丈島の西には円錐形の八丈富士、東には侵食の進んだ三原山があります。山の形、沢の深さ、海岸の表情が違うのは、できた時代と地質が異なるためです。", "車で一周するときは、観光地を数えるより、どちらの山の斜面にいるかを地図で確かめると景色がつながります。"], image: photos.hachijojimaFuji, note: "八丈富士は風・雲・登山道情報を確認。", sourceLabel: "気象庁｜八丈島", sourceUrl: "https://www.data.jma.go.jp/vois/data/tokyo/326_Hachijojima/326_index.html" },
      { number: "02", eyebrow: "EXILE & EXCHANGE", title: "流人の島という一語では、暮らしの往来を説明できない", copy: ["江戸時代の八丈島は流刑地として知られますが、島の歴史は流人だけではありません。海運、漁、農、織物、他地域から持ち込まれた技術が重なって暮らしが作られました。", "歴史民俗資料館では、誰が島へ来たかだけでなく、限られた資源をどう使い、何を本土へ送ったかまで見ると、孤島という固定観念がほどけます。"], image: photos.hachijojimaUrami, note: "展示の開館・移転情報は八丈町で確認。", sourceLabel: "八丈町｜歴史民俗資料館", sourceUrl: "https://www.town.hachijo.tokyo.jp/kanko-bunka/bunka/minzoku/" },
      { number: "03", eyebrow: "KIHACHIJŌ", title: "黄八丈の色は、島の植物と長い工程から生まれる", copy: ["黄八丈は、カリヤス、マダミ、椎など島の植物を用いて黄・樺・黒を染める絹織物です。鮮やかな色だけでなく、染めと媒染を重ねる手間に価値があります。", "工房や展示を訪ねるときは、完成品の価格だけでなく、一色ができるまでの工程を聞きたい。火山と森の島が、衣服の色として持ち帰られてきた歴史が見えます。"], image: photos.hachijojimaFreesia, note: "工房見学は営業日と予約条件を確認。", sourceLabel: "八丈島観光協会｜黄八丈", sourceUrl: "https://www.hachijo.gr.jp/" },
    ],
    itinerary: [
      { day: "DAY 1", theme: "八丈富士と西海岸", items: [
        { time: "ARRIVE", title: "港／空港で車を受け取る", detail: "返却場所と燃料を確認。" },
        { time: "AM", title: "八丈富士", detail: "天候でお鉢・牧野・中止を選ぶ。", spotId: "fuji" },
        { time: "PM", title: "南原千畳敷", detail: "溶岩海岸を短く歩く。", spotId: "nanbara" },
        { time: "EVENING", title: "底土で設営", detail: "駐車位置と風を確認。", spotId: "sokodo" },
      ] },
      { day: "DAY 2", theme: "森、文化、温泉", items: [
        { time: "AM", title: "裏見ヶ滝", detail: "足元が悪ければ資料館へ変更。", spotId: "urami" },
        { time: "NOON", title: "島寿司", detail: "営業・売切れを確認。" },
        { time: "PM", title: "みはらしの湯", detail: "帰路から逆算して入浴。", spotId: "miharashi" },
        { time: "DEPART", title: "港／空港へ", detail: "給油・返車を先に済ませる。" },
      ] },
    ],
    food: [
      { title: "島寿司", copy: "醤油漬けの魚と辛子。魚種と漬け具合を店で聞く。" },
      { title: "明日葉", copy: "天ぷら、麺、和え物。島の苦味を一皿に入れる。" },
      { title: "くさや", copy: "発酵文化として少量から。焼く場所と持帰りの配慮も含める。" },
      { title: "島酒", copy: "複数の焼酎蔵がある。運転者は夜のテント設営後だけ。" },
    ],
    stays: [
      { title: "底土野営場", type: "FIXED / FREE CAMP", copy: "無料・事前申請制・定員100人。底土港駐車場を使い、車をテント横へ置けるオートキャンプとは扱わない。", url: "https://www.hachijo.gr.jp/specials/sokodo-campsite/", cta: "公式申請案内" },
      { title: "八丈島のレンタカー", type: "CAR", copy: "港・空港送迎、営業時間、車種を比較。島が広いため早めに確保する。", url: "https://www.hachijo.gr.jp/traffic", cta: "交通一覧" },
    ],
    access: [
      { route: "竹芝 → 八丈島", time: "大型客船・翌8:55着", copy: "南航路3400便。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "羽田 → 八丈島", time: "飛行機", copy: "複数便。欠航時の代替を船と合わせて考える。", url: "https://www.hachijo.gr.jp/access" },
      { route: "島内", time: "レンタカー", copy: "二つの火山と温泉をつなぐなら車が有力。", url: "https://www.hachijo.gr.jp/traffic" },
      { route: "北航路の島々", time: "定期直結なし", copy: "大島・新島・神津島とは同じ定期航路ではない。", url: "https://www.tokaikisen.co.jp/boarding/route/" },
    ],
    rules: [
      "底土野営場は事前申請。駐車は底土港駐車場で、テント横付けを前提にしない。",
      "八丈富士は強風・霧・登山道情報で中止判断をする。",
      "温泉・工房・飲食店は休業日を先に確認。",
      "北航路3島案と同じ4日間へ混ぜるには、東京経由など大きな接続負担がある。",
    ],
    official: [
      { label: "八丈島観光協会", url: "https://www.hachijo.gr.jp/" },
      { label: "八丈町", url: "https://www.town.hachijo.tokyo.jp/" },
      { label: "底土キャンプ場", url: "https://www.hachijo.gr.jp/specials/sokodo-campsite/" },
      { label: "東海汽船｜八丈島", url: "https://www.tokaikisen.co.jp/island/hachijojima/" },
    ],
  },
];

export const islandsBySlug = Object.fromEntries(islands.map((island) => [island.slug, island])) as Record<Island["slug"], Island>;

export type CampReadiness = {
  slug: Island["slug"];
  status: "route-candidate" | "camp-possible" | "confirm-first" | "closed" | "prohibited";
  badge: string;
  verdict: string;
  campground: string;
  campRule: string;
  campUrl: string;
  car: string;
  carRule: string;
  carUrl: string;
};

export const campReadiness: CampReadiness[] = [
  {
    slug: "oshima",
    status: "camp-possible",
    badge: "次回候補",
    verdict: "テント＋車が成立",
    campground: "トウシキキャンプ場",
    campRule: "無料・Web事前予約必須。2026年4月更新の現行案内。港から車で約20〜25分。",
    campUrl: "https://www.town.oshima.tokyo.jp/soshiki/kankou/toshiki-camp.html",
    car: "島内レンタカー",
    carRule: "元町／岡田の発着港変更に対応できる受渡し条件を確認。",
    carUrl: "https://izu-oshima.or.jp/transportation.html",
  },
  {
    slug: "toshima",
    status: "prohibited",
    badge: "今回対象外",
    verdict: "固定条件と両立しない",
    campground: "キャンプ・野宿禁止",
    campRule: "村の観光案内が条例による禁止を明記。",
    campUrl: "https://www.toshimamura.org/tourism/come-to-toshima/access.html",
    car: "レンタカーなし",
    carRule: "バス、タクシー、レンタカー、レンタバイクはいずれもない。",
    carUrl: "https://www.toshimamura.org/tourism/come-to-toshima/access.html",
  },
  {
    slug: "niijima",
    status: "route-candidate",
    badge: "今回の3島案",
    verdict: "テント＋車が成立",
    campground: "都立羽伏浦野営場",
    campRule: "無料・予約不要・当日9:00〜16:00受付・先着100人。貸テントや電源なし。",
    campUrl: "https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html",
    car: "島内レンタカー",
    carRule: "テント装備を積める車種と港受渡しを事前予約。",
    carUrl: "https://niijima-info.jp/ido/",
  },
  {
    slug: "shikinejima",
    status: "closed",
    badge: "今回の3島・日帰り",
    verdict: "にしきで往復、新島泊",
    campground: "式根島地区の野営場",
    campRule: "新島村の現行案内で継続閉場中。島内の野宿も禁止。",
    campUrl: "https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html",
    car: "車があっても不成立",
    carRule: "キャンプ場を使えないため、今回の固定条件を満たさない。",
    carUrl: "https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html",
  },
  {
    slug: "kozushima",
    status: "route-candidate",
    badge: "今回の3島案",
    verdict: "車の確保が最難関",
    campground: "多幸湾ファミリーキャンプ場",
    campRule: "指定キャンプ場を予約。指定場所以外のキャンプ・野宿は禁止。2026年夏の受入を確認。",
    campUrl: "https://www.vill.kouzushima.tokyo.jp/camp/",
    car: "島内レンタカー",
    carRule: "夏は台数が少ない。あーす、アイラナ、神津島レンタカーへキャンプ利用での貸出を直接確認。",
    carUrl: "https://www.t-treasureislands.metro.tokyo.lg.jp/kouzushima/",
  },
  {
    slug: "miyakejima",
    status: "confirm-first",
    badge: "別航路・要確認",
    verdict: "2026営業を電話確認",
    campground: "大久保浜キャンプ場",
    campRule: "観光協会は4〜11月・予約制と案内するが、掲載年度が2025。2026年8月の受入確認が必要。",
    campUrl: "https://www.miyakejima.gr.jp/play/camp/",
    car: "島内レンタカー",
    carRule: "早朝着と当日の発着港に合わせた受渡しを予約。",
    carUrl: "https://www.miyakejima.gr.jp/",
  },
  {
    slug: "mikurajima",
    status: "prohibited",
    badge: "今回対象外",
    verdict: "テント泊禁止",
    campground: "キャンプ・野宿禁止",
    campRule: "宿泊予約のない上陸と日帰り観光も不可。",
    campUrl: "https://mikura-isle.com/first-mikura/",
    car: "レンタカー旅ではない",
    carRule: "徒歩と予約ガイドが基本。今回の固定条件を満たさない。",
    carUrl: "https://mikura-isle.com/first-mikura/",
  },
  {
    slug: "hachijojima",
    status: "camp-possible",
    badge: "別航路なら成立",
    verdict: "テント＋車が成立",
    campground: "底土野営場",
    campRule: "無料・事前申請制・定員100人。底土港駐車場を利用。",
    campUrl: "https://www.hachijo.gr.jp/specials/sokodo-campsite/",
    car: "島内レンタカー",
    carRule: "港／空港送迎と車種を早めに予約。北航路3島とは定期直結しない。",
    carUrl: "https://www.hachijo.gr.jp/traffic",
  },
];

export const campReadinessBySlug = Object.fromEntries(campReadiness.map((item) => [item.slug, item])) as Record<Island["slug"], CampReadiness>;

export const overviewPoints: MapPoint[] = [
  { id: "tokyo", title: "竹芝客船ターミナル", label: "TOKYO", position: [35.6537, 139.7628], summary: "島旅の船の起点。" },
  { id: "shikinejima", title: "式根島", label: "DAY 3 / DAY TRIP", position: [34.326, 139.219], summary: "連絡船にしきで日帰り冒険。" },
  { id: "niijima", title: "新島", label: "DAY 2+3 / STAY", position: [34.373, 139.259], summary: "確保済みの宿泊先で2泊目と3泊目。" },
  { id: "kozushima", title: "神津島", label: "DAY 1 / CAMP", position: [34.212, 139.139], summary: "多幸湾で1泊目。" },
];

export const overviewRoutes: MapRoute[] = [
  {
    label: "8/29 東京 → 神津島（1420便・空席未確認）",
    positions: [[35.6537, 139.7628], [34.212, 139.139]],
    color: "#ff4b2b",
    dash: true,
  },
  {
    label: "8/30 神津島 → 新島（2430便）",
    positions: [[34.212, 139.139], [34.373, 139.259]],
    color: "#0e6b77",
    dash: true,
  },
  {
    label: "8/31 新島8:20 → 式根島 / 式根島16:00 → 新島（連絡船にしき）",
    positions: [[34.373, 139.259], [34.326, 139.219], [34.373, 139.259]],
    color: "#d6ea4b",
    dash: true,
  },
  {
    label: "9/1 新島14:10 → 東京17:00（2430便・空席未確認）",
    positions: [[34.373, 139.259], [35.6537, 139.7628]],
    color: "#8a4d79",
    dash: true,
  },
];

export const bookingLinks = [
  { index: "01", title: "神津島の車を先に確保", detail: "夏の台数が最も厳しい。キャンプ利用でも貸出可能か直接確認。", status: "HARD GATE", url: "https://www.t-treasureislands.metro.tokyo.lg.jp/kouzushima/" },
  { index: "02", title: "神津島キャンプを朝確認", detail: "Botが受入状況を確認。新島の2泊分は確保済みとして扱い、詳細な宿名は公開しない。", status: "MORNING CHECK", url: "https://www.vill.kouzushima.tokyo.jp/camp/" },
  { index: "03", title: "船と連絡船を確認", detail: "8/29東京→神津、8/30神津→新島、8/31にしき往復、9/1新島→東京。", status: "LIVE CHECK", url: "https://www.tokaikisenyoyaku.com/app/login" },
  { index: "04", title: "テント装備を船の荷物規定へ合わせる", detail: "ジェット船は受託手荷物なし。アウトドアワゴン不可など2026年案内を確認。", status: "PACKING", url: "https://www.tokaikisen.co.jp/boarding/baggage/" },
  { index: "05", title: "最終日の新島発を確認", detail: "9/1は2430便14:10→17:00が第一候補。空席と当日の発着港を再確認。", status: "RETURN", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
];
