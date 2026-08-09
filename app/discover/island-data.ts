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
  oneLine: string;
  coverLine: string;
  shortIntro: string;
  longIntro: string;
  hero: Photo;
  cover: Photo;
  mapCenter: LatLng;
  mapZoom: number;
  facts: { value: string; label: string }[];
  fit: { label: string; value: string }[];
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
    oneLine: "山の白、海の青、夜の黒。ひとつの島で景色が三度反転する。",
    coverLine: "空まで、島の領域だ。",
    shortIntro: "朝は天上山、午後は透明な入り江、夜は光を守る島の星空へ。三つの旅を一泊ずつ重ねるような濃さがある。",
    longIntro: "神々が水を分けたという伝承の島には、標高572mの天上山、白い岩と青い入り江、そして東京都で初めて認定された星空保護区が同居する。移動を増やすより、朝・昼・夜で景色の人格が変わる瞬間を待つ。今回の三島特集では、ここを最も深く読む。",
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
    spots: [
      { id: "tenjo", title: "天上山", label: "HIKE", position: [34.2196, 139.1486], summary: "白砂の裏砂漠、池、断崖の展望をつなぐ島の主峰。" },
      { id: "akasaki", title: "赤崎遊歩道", label: "SWIM", position: [34.2429, 139.1305], summary: "木の遊歩道と入り江。夏は泳ぎとシュノーケルの拠点。" },
      { id: "maehama", title: "前浜海岸", label: "SUNSET", position: [34.2052, 139.1308], summary: "村のすぐ前に延びる砂浜。夕方の基準点。" },
      { id: "tako", title: "多幸湾", label: "COAST", position: [34.2153, 139.1621], summary: "天上山の白い崖を海側から見る東岸の入り江。" },
      { id: "onsen", title: "神津島温泉保養センター", label: "BATH", position: [34.2247, 139.1265], summary: "海辺の露天風呂。営業と利用条件は当日確認。" },
      { id: "yotane", title: "よたね広場周辺", label: "STARS", position: [34.2078, 139.1392], summary: "村から歩ける星空観察候補。照明と足元に配慮。" },
      { id: "port", title: "神津島港", label: "GATE", position: [34.2045, 139.1327], summary: "船の玄関口。海況で発着地や時刻が変わることがある。" },
      { id: "airport", title: "神津島空港", label: "FLIGHT", position: [34.1886, 139.1335], summary: "調布便の玄関口。荷物制限を予約前に確認。" },
    ],
    chapters: [
      {
        number: "01",
        eyebrow: "MORNING / MT. TENJŌ",
        title: "山頂なのに、白い砂漠がある。",
        copy: [
          "天上山は標高572m。数字だけなら低山だが、樹林、黒島登山口の急登、表砂漠と裏砂漠、池、断崖の展望が短い距離で切り替わる。山頂を一個取る登山ではなく、地形の章をめくっていく歩き方が似合う。",
          "友達旅なら、会話が止まる場所を目的地にする。白い砂の上でいったん離れて歩き、裏砂漠展望地で集合。写真係、地図係、水係を決めると、ただのハイキングが小さな遠征になる。",
        ],
        image: photos.kozushimaTenjo,
        note: "低山でも風・霧・強い日差しがある。明るいうちに下山し、当日の登山情報と装備を優先。",
        sourceLabel: "神津島観光協会｜天上山モデルコース",
        sourceUrl: "https://kozushima.com/tour/tourroute/866/",
      },
      {
        number: "02",
        eyebrow: "NOON / EAST COAST",
        title: "白い崖を、海から見返す。",
        copy: [
          "天上山を降りたら、島の反対側へ。多幸湾では、さっき歩いた白い山肌が海の向こうに立ち上がる。山と海を別々の名所にせず、同じ地形を上と下から見るのが神津島の面白さだ。",
          "泳ぐなら監視・海況・遊泳範囲が最優先。海に入れない日は、入り江の色と岩の形を観察するだけでいい。予定を成功させるのではなく、島の条件に遊び方を合わせる。",
        ],
        image: photos.kozushimaTako,
        note: "多幸湾へは村落から距離がある。バス時刻と帰路を先に確保し、海況が悪ければ展望中心へ切り替える。",
        sourceLabel: "神津島観光協会｜観光スポット",
        sourceUrl: "https://kozushima.com/kankospot/",
      },
      {
        number: "03",
        eyebrow: "AFTERNOON / AKASAKI",
        title: "入り江を縫う、500mの木道。",
        copy: [
          "島の北端にある赤崎遊歩道は、岩場と入り江を約500mの木道でつなぐ。海を上から眺め、階段を降り、同じ青へ入る。移動そのものがアトラクションになる場所だ。",
          "夏は売店やバスが動く一方、足元、飛び込み、岩場、波には注意がいる。写真を撮る人と泳ぐ人を無理に同じテンポにしない。集合時刻だけ決めて、それぞれの海を持ち帰る。",
        ],
        image: photos.kozushimaAkasaki,
        note: "港から車・バスで約15分の案内。季節運行、売店、遊泳条件は直前に公式情報を確認。",
        sourceLabel: "神津島観光協会｜赤崎遊歩道",
        sourceUrl: "https://kozushima.com/kanko/umi/beach/240/",
      },
      {
        number: "04",
        eyebrow: "NIGHT / DARK SKY ISLAND",
        title: "暗さは、島が守っている景色。",
        copy: [
          "神津島は2020年12月、東京都で初めて国際ダークスカイ協会の星空保護区に認定された。星が多いだけではない。屋外照明を見直し、暗い夜を島全体で残してきたことまで含めて、夜空が旅の目的地になる。",
          "夕食後に雲量を見て、晴れたら外へ。赤いライト、羽織るもの、温かい飲み物を持つ。曇ったら無理をせず、翌朝の海へ予定を戻す。星空は予約できないからこそ、旅に余白をつくって待つ。",
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
        theme: "海の青に、身体を合わせる",
        items: [
          { time: "ARRIVE", title: "港／空港 → 宿へ", detail: "まず宿に荷物を置き、翌日の天上山と帰路を確認。", spotId: "port" },
          { time: "PM", title: "赤崎遊歩道", detail: "バスの最終便から逆算。泳げない日は木道散歩へ。", spotId: "akasaki" },
          { time: "SUNSET", title: "前浜海岸", detail: "夕食前の30分を空け、水平線の色を見る。", spotId: "maehama" },
          { time: "NIGHT", title: "星空の第一候補", detail: "晴天時だけ実行。月齢と雲量で場所を変える。", spotId: "yotane" },
        ],
      },
      {
        day: "DAY 02",
        theme: "山と海で、同じ島を二度見る",
        items: [
          { time: "07:00", title: "天上山へ", detail: "早出。コースと下山時刻はガイド／宿に相談。", spotId: "tenjo" },
          { time: "NOON", title: "村で地魚の昼食", detail: "営業日と売り切れを想定し、第二候補まで持つ。" },
          { time: "PM", title: "多幸湾へ", detail: "朝に登った山を海側から見返す。", spotId: "tako" },
          { time: "EVENING", title: "温泉で回復", detail: "営業・送迎・水着条件を直前確認。", spotId: "onsen" },
        ],
      },
      {
        day: "DAY 03",
        theme: "風が決める、最後の半日",
        items: [
          { time: "AM", title: "前浜を散歩", detail: "欠航や条件付き運航の情報を先に確認。", spotId: "maehama" },
          { time: "DEPART", title: "港／空港へ", detail: "発着地・集合時刻・荷物制限をもう一度確認。", spotId: "airport" },
        ],
      },
    ],
    food: [
      { title: "金目鯛", copy: "島の水揚げを象徴する魚。煮付け、刺身、炙りなど、その日の入荷で選ぶ。" },
      { title: "地魚の夜", copy: "店を一軒に固定しすぎず、宿の食事か予約店を軸にして売り切れリスクを避ける。" },
      { title: "山の行動食", copy: "朝出発に備え、前日に飲み物と携行食を確保。島では夜間に買える場所が限られる。" },
    ],
    stays: [
      { title: "島の宿を公式予約", type: "OFFICIAL PORTAL", copy: "旅館・民宿・ゲストハウスを公式ポータルから比較。島内キャンプは禁止なので、交通より先に宿を確保する。", url: "https://kozushima.com/yado-list/", cta: "公式宿一覧" },
      { title: "星空ガイドと組み合わせる", type: "NIGHT GUIDE", copy: "星の場所・時間・安全を現地ガイドに委ねる選択肢。月齢と催行条件を確認する。", url: "https://kozushima.com/star/guide/", cta: "星空ガイド" },
      { title: "島の体験をまとめて探す", type: "ECOTOUR", copy: "山・海・自然体験は公式エコツアー窓口から。繁忙期は宿と並行して問い合わせる。", url: "https://kozushima.com/", cta: "公式観光サイト" },
    ],
    access: [
      { route: "調布 → 神津島", time: "約45分", copy: "飛行機。便数、運賃、手荷物上限、天候条件を予約画面で確認。", url: "https://central-air.co.jp/schedule-fee.html?stt_lang=ja" },
      { route: "竹芝 → 神津島", time: "高速船／大型客船", copy: "所要時間と運航日は季節で変動。宿を押さえてから往復を検索。", url: "https://www.tokaikisen.co.jp/boarding/timetable/" },
      { route: "新島 ↔ 神津島", time: "高速船 約25分の案内", copy: "島間移動は便・海況で成立条件が変わる。旅程の接続は同日便で再確認。", url: "https://www.tokyo-islands.com/access/" },
    ],
    rules: [
      "島内での野宿・キャンプは禁止。宿泊先を確保してから来島する。",
      "船・飛行機は欠航や条件付き運航がある。帰京日の予定を詰めすぎない。",
      "天上山は明るいうちに下山。低山という数字だけで装備を軽くしない。",
      "海は監視員・現地掲示・波の条件を優先。飛び込みや岩場は無理をしない。",
      "星を見る暗所では、足元・車・住宅・照明に配慮する。",
    ],
    official: [
      { label: "神津島観光協会", url: "https://kozushima.com/" },
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
    oneLine: "火山の黒を歩き、地球の時間を道路脇で読む。",
    coverLine: "東京から最も近い、地球の断面。",
    shortIntro: "三原山、裏砂漠、地層大切断面。到着した朝から大きく動ける、火山を中心にしたフィールドトリップ。",
    longIntro: "大島の主役は、名物よりも地面だ。標高758mの三原山、風の通り道に広がる裏砂漠、道路沿いに現れる約2万年の地層。友達と行くなら、火山を歩く朝、島を一周する午後、海辺の温泉で終わる夕方を一本の線にする。",
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
    ],
    chapters: [
      {
        number: "01",
        eyebrow: "MORNING / VOLCANO",
        title: "朝一番に、黒い地球へ。",
        copy: [
          "三原山は、景色を見る場所というより地面の変化を歩く場所だ。山頂口から火口周辺へ近づくにつれ、植物、溶岩、風の音が切り替わる。裏砂漠まで含めるなら、車とコース選びを先に決めたい。",
          "全員で同じ写真を撮るより、黒いものだけを拾う写真ビンゴにする。溶岩の割れ目、靴につく砂、遠くの海。火山という大きなテーマが、友達それぞれの視点に分かれていく。",
        ],
        image: photos.oshimaMihara,
        note: "山頂付近は風・霧・気温差が大きい。当日の火山・道路・バス情報を確認。",
        sourceLabel: "伊豆大島観光協会｜遊ぶ",
        sourceUrl: "https://izu-oshima.or.jp/play.html",
      },
      {
        number: "02",
        eyebrow: "AFTERNOON / EARTH ARCHIVE",
        title: "2万年が、道路脇に露出している。",
        copy: [
          "島の南西側を走ると、道路の壁が突然しま模様になる。高さ約24m、長さ約630mと案内される地層大切断面は、噴火と堆積の繰り返しを一度に見せる。名所に着くというより、移動中に地球の断面へ遭遇する感覚が強い。",
          "波浮港まで足を延ばすなら、地層を『途中の5分』にしない。遠景、近景、人を入れた大きさの比較を撮り、島が積み重ねた時間をちゃんと見る。",
        ],
        image: photos.oshimaStrata,
        note: "道路沿いのため駐停車と横断に注意。安全な見学場所と交通を優先。",
        sourceLabel: "東京宝島｜大島",
        sourceUrl: "https://www.tokyo-islands.com/about/oshima/",
      },
      {
        number: "03",
        eyebrow: "EVENING / WEST COAST",
        title: "夕日の終点を、温泉にする。",
        copy: [
          "西岸のサンセットパームラインから元町へ戻り、水着で浜の湯へ。海の色が変わる時間と温泉を一つの予定にすると、観光を終えて宿へ戻るだけの夕方が、旅のハイライトになる。",
          "大島は発着港が当日に変わることがある。だから元町固定の計画にせず、岡田港になった場合の移動と荷物を宿に相談しておく。予定を柔らかくしておくことが、島を余裕で遊ぶコツになる。",
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
        theme: "黒い地面を歩き、赤い夕日で終える",
        items: [
          { time: "ARRIVE", title: "到着港 → 宿／車", detail: "元町・岡田のどちらかを当日確認。", spotId: "motomachi" },
          { time: "AM", title: "三原山を歩く", detail: "風と霧でコースを短縮できる構成に。", spotId: "mihara" },
          { time: "PM", title: "裏砂漠または島一周へ", detail: "全員の体力と車の有無で二択。", spotId: "urasabaku" },
          { time: "SUNSET", title: "西岸 → 浜の湯", detail: "水着を朝からデイバッグへ。", spotId: "hamanoyu" },
        ],
      },
      {
        day: "DAY 02",
        theme: "地層と港町を一本の道で読む",
        items: [
          { time: "AM", title: "地層大切断面", detail: "南回りで波浮港へ。", spotId: "strata" },
          { time: "NOON", title: "波浮港を歩く", detail: "坂道と港町の時間をゆっくり取る。", spotId: "habu" },
          { time: "DEPART", title: "発着港へ戻る", detail: "当日の港とバス・送迎を再確認。", spotId: "okata" },
        ],
      },
    ],
    food: [
      { title: "べっこう", copy: "青唐辛子醤油に漬けた島の魚。寿司や丼で、店ごとの辛さを比べる。" },
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
      { label: "東海汽船", url: "https://www.tokaikisen.co.jp/" },
    ],
  },
  {
    slug: "niijima",
    order: "03",
    name: "新島",
    reading: "にいじま",
    english: "NIIJIMA",
    oneLine: "白い崖、白い海岸、オリーブ色のガラス。速度を落とす島。",
    coverLine: "白の中で、予定をほどく。",
    shortIntro: "羽伏浦の長い海岸、湯の浜露天温泉、新島ガラス。自転車の速度で余白を味わう。",
    longIntro: "新島は、予定を増やすほど良くなる島ではない。白ママ断崖と羽伏浦の白、海辺の露天温泉、淡いオリーブ色の新島ガラスを、自転車でゆっくりつなぐ。大島で動いた後に渡ると、景色だけでなく旅の速度まで反転する。",
    hero: photos.niijimaShiromama,
    cover: photos.niijimaHabushiura,
    mapCenter: [34.373, 139.259],
    mapZoom: 12,
    facts: [
      { value: "6.5km", label: "羽伏浦海岸" },
      { value: "24h", label: "湯の浜の公式案内" },
      { value: "約2,000", label: "島の人口" },
      { value: "0", label: "コンビニ" },
    ],
    fit: [
      { label: "GO FOR", value: "海・自転車・温泉・ガラス" },
      { label: "PACE", value: "1〜2泊、余白多め" },
      { label: "MOVE", value: "中心部は自転車、若郷は車" },
      { label: "BOOK FIRST", value: "宿 → 船 → 必要なら車" },
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
        title: "島の白は、砂ではなく地面の記憶。",
        copy: [
          "新島の東岸に続く白ママ断崖は、海の色を明るく見せる巨大な背景だ。羽伏浦の白い砂、白いメインゲート、新島ガラスの原料になるコーガ石まで、島の景色は同じ地質でつながっている。",
          "海岸を消費するのではなく、白の種類を探す。崖の粉っぽい白、波打ち際の青白さ、建物の白。それだけで一日の写真に編集の軸が生まれる。",
        ],
        image: photos.niijimaShiromama,
        note: "崖下や海岸は落石・波・通行規制に注意。現地掲示を優先し、危険区域へ入らない。",
        sourceLabel: "東京宝島｜新島",
        sourceUrl: "https://www.tokyo-islands.com/about/niijima/",
      },
      {
        number: "02",
        eyebrow: "BICYCLE / HABUSHIURA",
        title: "6.5kmを、急いで終わらせない。",
        copy: [
          "羽伏浦海岸は約6.5km。端から端まで制覇するより、風の向きと気分で止まる場所を決める。中心部から自転車で向かい、海を見た後はカフェかガラスへ。移動の小ささが、友達との会話を長くする。",
          "サーフスポットとして知られる海は、いつでも泳げる場所ではない。遊泳可否と監視員の案内を優先し、波が強ければ眺める日に変える。",
        ],
        image: photos.niijimaHabushiura,
        note: "中心部は自転車向き。若郷へ通じる平成新島トンネルは徒歩・自転車で通れない。",
        sourceLabel: "新島観光協会｜島内移動",
        sourceUrl: "https://niijima-info.jp/ido/",
      },
      {
        number: "03",
        eyebrow: "SUNSET / YUNOHAMA",
        title: "夕方を、予定ではなく温度で決める。",
        copy: [
          "海辺に現れるギリシャ神殿風の湯の浜露天温泉。公式案内では無料・24時間・水着着用。観光の最後に入れるのではなく、夕日がきれいなら早めに切り上げて向かう。予定より光を優先する場所だ。",
          "温泉の後は、予約した夕食へ行くか、テイクアウトで宿へ戻る。新島にはコンビニがなく、店の閉店も早い。だらだらするための準備だけは、先にしておく。",
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
        theme: "白い海と、夕方の温泉",
        items: [
          { time: "ARRIVE", title: "港 → 宿へ", detail: "送迎と帰りの集合場所を先に確認。", spotId: "port" },
          { time: "PM", title: "自転車で羽伏浦へ", detail: "波が強ければ海岸散歩と写真へ切り替え。", spotId: "habushiura" },
          { time: "SUNSET", title: "湯の浜露天温泉", detail: "水着とタオルを持って西岸へ。", spotId: "yunohama" },
          { time: "NIGHT", title: "予約店／宿で夕食", detail: "当日難民にならないよう一つだけ確保。" },
        ],
      },
      {
        day: "DAY 02",
        theme: "石の色を持ち帰る",
        items: [
          { time: "AM", title: "モヤイ探し", detail: "見つけた像に勝手な名前をつける。", spotId: "moyai" },
          { time: "PM", title: "新島ガラス体験", detail: "電話予約優先。約40分の公式案内。", spotId: "glass" },
          { time: "DEPART", title: "港／空港へ", detail: "船・飛行機の運航と荷物を再確認。", spotId: "airport" },
        ],
      },
    ],
    food: [
      { title: "島寿司と地魚", copy: "当日の魚と営業で選ぶ。店は席数が限られるため、夕食は予約候補を持つ。" },
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
      { route: "大島 → 新島", time: "島間船", copy: "現在のSSOTで採用中の移動。接続・海況・当日の発着港を直前確認。", url: "https://www.tokyo-islands.com/access/" },
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
    label: "現在のSSOT：竹芝 → 大島 → 新島",
    positions: [[35.6537, 139.7628], [34.737, 139.387], [34.373, 139.259]],
    color: "#ff4b2b",
  },
  {
    label: "神津島への島間ルート候補",
    positions: [[34.373, 139.259], [34.212, 139.139]],
    color: "#0e6b77",
    dash: true,
  },
  {
    label: "調布 → 神津島（空路）",
    positions: [[35.6717, 139.528], [34.1886, 139.1335]],
    color: "#d6ea4b",
    dash: true,
  },
];

export const bookingLinks = [
  { index: "01", title: "船の空席を調べる", detail: "竹芝・島間・復路を同じ日付で確認。", status: "LIVE CHECK", url: "https://www.tokaikisenyoyaku.com/app/login" },
  { index: "02", title: "神津島の宿を先に押さえる", detail: "野宿不可。繁忙期は宿が旅程の成立条件。", status: "FIRST", url: "https://kozushima.com/yado-list/" },
  { index: "03", title: "大島の宿と島内交通", detail: "発着港変更と送迎条件まで比較。", status: "COMPARE", url: "https://www.izu-oshima.or.jp/accommodation.html" },
  { index: "04", title: "新島の宿と夕食", detail: "宿・飲食店とも数が限られるため並行確認。", status: "EARLY", url: "https://niijima-info.jp/stay/" },
];
