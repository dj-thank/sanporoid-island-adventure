import { photos, type Island, type Photo } from "./island-data";

type DossierSlug = Extract<Island["slug"], "kozushima" | "niijima">;

export type DossierSource = {
  label: string;
  url: string;
};

export type IslandDossier = {
  slug: DossierSlug;
  tabLine: string;
  headline: string;
  lead: string;
  portrait: Photo;
  atlas: { value: string; label: string; note: string }[];
  chapters: {
    number: string;
    eyebrow: string;
    title: string;
    copy: string[];
    image: Photo;
    caption: string;
    sources: DossierSource[];
  }[];
  timeline: { year: string; title: string; copy: string }[];
  trivia: { question: string; answer: string }[];
  fieldNotes: { label: string; title: string; copy: string }[];
  sources: DossierSource[];
};

export const islandDossiers: Record<DossierSlug, IslandDossier> = {
  kozushima: {
    slug: "kozushima",
    tabLine: "水の神話、黒曜石、838年の噴火",
    headline: "神々が水を分け、火山が島を重ねた。",
    lead: "東京から南へ約180km。神津島には、神々が集まって水を分けたという伝承が残る。その足元では約3万年前から火山活動が続き、838年の噴火が天上山を形づくった。神話、地質、漁、祭り、星空を別々の名物にせず、一つの島の履歴として読む。",
    portrait: photos.kozushimaAerial,
    atlas: [
      { value: "18.58 km²", label: "面積", note: "神津島村の島勢概要" },
      { value: "約22 km", label: "島の周囲", note: "観光協会の掲載値" },
      { value: "572 m", label: "最高点", note: "活火山・天上山" },
      { value: "1,737人", label: "人口", note: "2025年1月・住民基本台帳" },
      { value: "約180 km", label: "東京都心から", note: "東京の南、伊豆諸島中部" },
      { value: "2020年", label: "星空保護区認定", note: "東京都で初めて認定" },
    ],
    chapters: [
      {
        number: "01",
        eyebrow: "VOLCANIC LAYERS",
        title: "一つの山ではない。複数の火山が、いまの島をつくった",
        copy: [
          "神津島は、きれいな円錐形の火山が一つ立つ島ではない。国土地理院の火山土地条件図には、年代の異なる溶岩ドーム、火砕丘、火砕流の堆積面が重なって記録されている。南部には約3万年前までさかのぼる地形があり、北部にも7〜9世紀の火山活動でできた山が並ぶ。",
          "島の中央にそびえる天上山は、西暦838年の噴火でできた溶岩ドームだ。白い砂地、池、岩場、草原が山頂部に同居するのは、この若い火山地形と侵食の結果である。『神津島は838年に誕生した』のではなく、長い火山史の最後に天上山が加わった、と理解したい。",
        ],
        image: photos.kozushimaTenjo,
        caption: "天上山では、白い火山地形と池、草地が短い距離の中で切り替わる。",
        sources: [
          { label: "国土地理院｜火山土地条件図「神津島」", url: "https://www.gsi.go.jp/bousaichiri/bousaichiri61054.html" },
          { label: "気象庁｜神津島の火山活動", url: "https://www.data.jma.go.jp/vois/data/tokyo/319_Kozushima/319_history.html" },
        ],
      },
      {
        number: "02",
        eyebrow: "WATER & BELIEF",
        title: "島の名に残る、水配りの会議",
        copy: [
          "神津島には、事代主命が伊豆諸島の神々を集め、水の配分を相談したという伝承がある。古い表記として伝わる『神集島』も、神々が集まった島という物語につながる。会議の舞台は、天上山山頂の不入が沢。現在も立ち入ってはいけない聖域として扱われている。",
          "神話と地質学は同じ説明ではない。ただ、天上山からの伏流水や島内の湧水が暮らしを支えている事実と並べると、水が島の信仰の中心になった理由が見えてくる。現地では物忌奈命神社、郷土資料館、天上山の案内を順にたどると、伝承を観光コピーで終わらせずに読める。",
        ],
        image: photos.kozushimaTako,
        caption: "多幸湾側から見る天上山。山の水は、伝承と現在の暮らしの両方に続く。",
        sources: [
          { label: "東京都環境局｜神津島の歴史", url: "https://www.kankyo1.metro.tokyo.lg.jp/naturepark/know/park/introduction/kokuritsu/fujihakone/koudushima/history.html" },
          { label: "環境省｜神津島エコツーリズム", url: "https://www.env.go.jp/nature/ecotourism/try-ecotourism/certification/kozushima/" },
        ],
      },
      {
        number: "03",
        eyebrow: "OBSIDIAN & SEA",
        title: "黒曜石は、旅行者より先に海を渡っていた",
        copy: [
          "神津島産の黒曜石は、関東各地の遺跡から石器として見つかっている。本土から見れば約180km沖の島だが、先史時代の人びとは海を越え、この石を運んだ。港もエンジンもない時代から、神津島は孤立した島ではなく、広い交易圏の一部だった。",
          "郷土資料館では考古資料だけでなく、古文書、民具、船具も見られる。黒曜石から漁具、千石船の遺物と考えられる錨までを同じ展示室で見ると、海が島を隔てるものではなく、人と物を動かす道だったことが分かる。",
        ],
        image: photos.kozushimaMaehama,
        caption: "前浜と集落。海は境界であると同時に、古代から人と物を運ぶ道だった。",
        sources: [
          { label: "東京都環境局｜神津島の歴史", url: "https://www.kankyo1.metro.tokyo.lg.jp/naturepark/know/park/introduction/kokuritsu/fujihakone/koudushima/history.html" },
          { label: "神津島村｜郷土資料館案内", url: "https://www.vill.kouzushima.tokyo.jp/kankou/" },
        ],
      },
      {
        number: "04",
        eyebrow: "FISHING, RITUAL, NIGHT",
        title: "鰹を釣る祭りと、暗さを守る夜",
        copy: [
          "物忌奈命神社の例大祭では、青竹の舟と疑似魚を使い、出船、一本釣り、帰港、入札までを演じる『神津島のかつお釣り行事』が奉納される。国の重要無形民俗文化財であり、漁業が仕事だけでなく、祈りと共同体の記憶でもあることを伝える。",
          "2020年、神津島は東京都で初めて星空保護区に認定された。価値があるのは星の数だけではない。照明を見直し、光害を抑え、島ぐるみで夜の暗さを守る仕組みまで含めた認定である。雲や月明かりは選べないが、暗い空を次代へ残す努力は現地で確かめられる。",
        ],
        image: photos.kozushimaAkasaki,
        caption: "海の仕事と夜の環境。どちらも島の暮らしが守ってきた風景だ。",
        sources: [
          { label: "文化庁｜神津島のかつお釣り行事", url: "https://online.bunka.go.jp/heritages/detail/200376" },
          { label: "神津島村｜星空保護区認定", url: "https://www.vill.kouzushima.tokyo.jp/images/2023/03/20201202-nintei.pdf" },
        ],
      },
    ],
    timeline: [
      { year: "先史時代", title: "黒曜石が本土へ渡る", copy: "神津島産の黒曜石が関東各地の遺跡に残る。海上交通の古さを示す手がかり。" },
      { year: "838", title: "天上山が噴火", copy: "承和5年の噴火が記録に残る。現在の天上山周辺を形づくった大きな活動。" },
      { year: "1999", title: "かつお釣り行事を国が指定", copy: "物忌奈命神社の奉納行事が、国の重要無形民俗文化財に指定された。" },
      { year: "2020", title: "星空保護区になる", copy: "照明と光害対策を含め、東京都初のダークスカイ・アイランドに認定。" },
    ],
    trivia: [
      { question: "神津島は838年にできた？", answer: "いいえ。838年は天上山の噴火年。島内には約3万年前までさかのぼる火山地形がある。" },
      { question: "水配り伝説の場所へ入れる？", answer: "不入が沢は神聖な場所で、立ち入ってはいけないと案内されている。遠くから敬意を払って読む場所だ。" },
      { question: "天上山は572mだから軽い登山？", answer: "標高だけでは判断できない。風、霧、岩場、日差しがあり、登山道と天候の確認が必要。" },
      { question: "星空保護区なら毎晩満天の星？", answer: "認定は晴天保証ではない。天候や月齢に左右される一方、島の光害対策はいつでも知ることができる。" },
    ],
    fieldNotes: [
      { label: "港から", title: "郷土資料館で、島の時間軸をつかむ", copy: "黒曜石、古文書、民具、船具を先に見る。山や海の景色に、歴史の奥行きが加わる。" },
      { label: "集落で", title: "物忌奈命神社を、祭りの舞台として見る", copy: "鎮守としての役割とかつお釣り行事を知る。祭礼や境内では現地の作法を優先する。" },
      { label: "天上山で", title: "白い砂地、池、草地の切り替わりを歩く", copy: "複数の火山地形を短い距離で見比べる。不入が沢の立入範囲には入らない。" },
      { label: "夜に", title: "星より先に、街の照明を見る", copy: "星空保護区を写真だけで終わらせず、暗さを守る照明や観察ルールまで確認する。" },
    ],
    sources: [
      { label: "神津島村｜島の概要", url: "https://www.vill.kouzushima.tokyo.jp/about/" },
      { label: "国土地理院｜火山土地条件図", url: "https://www.gsi.go.jp/bousaichiri/bousaichiri61054.html" },
      { label: "気象庁｜活火山としての神津島", url: "https://www.data.jma.go.jp/vois/data/tokyo/319_Kozushima/319_history.html" },
      { label: "東京都環境局｜神津島の歴史", url: "https://www.kankyo1.metro.tokyo.lg.jp/naturepark/know/park/introduction/kokuritsu/fujihakone/koudushima/history.html" },
      { label: "環境省｜エコツーリズム", url: "https://www.env.go.jp/nature/ecotourism/try-ecotourism/certification/kozushima/" },
      { label: "文化庁｜かつお釣り行事", url: "https://online.bunka.go.jp/heritages/detail/200376" },
    ],
  },
  niijima: {
    slug: "niijima",
    tabLine: "886年の噴火、流人史、コーガ石",
    headline: "白い火山が、暮らしの形と色を決めた。",
    lead: "東京から南へ約151km。新島の白い海岸は、風景の入口にすぎない。886年の噴火でできた向山、加工しやすく火に強いコーガ石、石造りの建物、モヤイ像、オリーブ色のガラス。そこに流人の知識、漁と保存食、太平洋の波が重なる。島の白を、地質から暮らしまで追いかける。",
    portrait: photos.niijimaShiromama,
    atlas: [
      { value: "23.87 km²", label: "面積", note: "2025年資料・属島を含む" },
      { value: "11.5 km", label: "南北の長さ", note: "東西は約3.2km" },
      { value: "41.6 km", label: "海岸延長", note: "2025年資料・属島を含む" },
      { value: "432 m", label: "最高点", note: "宮塚山・観光地図掲載値" },
      { value: "1,885人", label: "新島本島の人口", note: "本村＋若郷・2025年1月" },
      { value: "886年", label: "向山の噴火", note: "南部の地形を形成" },
    ],
    chapters: [
      {
        number: "01",
        eyebrow: "RHYOLITE ISLAND",
        title: "新島南部の白は、886年の噴火から始まる",
        copy: [
          "新島は、流紋岩質の火砕丘と溶岩ドームが重なる火山島だ。大島の黒い玄武岩質の景観とは、火山の材料も見え方も違う。南部の向山は西暦886年の大噴火で形成され、島を覆った白い火山灰とともに、現在の景観を考える基準になっている。",
          "ただし、新島全体が886年に初めて現れたわけではない。北部を含む複数の火山体があり、砂浜の白、断崖の白、建物の白は同じものとも限らない。羽伏浦から白ママ、向山へ進むと、『白い島』という呼び名の内側にある違いが見えてくる。",
        ],
        image: photos.niijimaShiromama,
        caption: "白ママ断崖。砂浜、火山灰層、コーガ石を一つの『白』で片づけない。",
        sources: [
          { label: "国土地理院｜伊豆諸島の火山地形", url: "https://www.gsi.go.jp/REPORT/JIHO/vol84-5-1.html" },
          { label: "新島村｜新島村の紹介", url: "https://www.niijima.com/shoukai/index.html" },
        ],
      },
      {
        number: "02",
        eyebrow: "KOGA STONE",
        title: "切る、積む、彫る、溶かす。コーガ石は四つの姿を持つ",
        copy: [
          "向山から産出するコーガ石は、黒雲母流紋岩の一種だ。多孔質で加工しやすく、軽量で火や酸にも強い。島では建物、石倉、墓、便所などに使われ、やがてモヤイ像をはじめとする野外彫刻の素材になった。軽い石は水に浮くほど比重が小さい。",
          "さらに石を原料として溶かすと、鉄分が発色したオリーブグリーンの新島ガラスになる。島の資源が建材、公共アート、工芸へ移り変わった歴史は、モヤイ像、コーガ石建築、ガラスアートセンターを歩くと一日でつながる。",
        ],
        image: photos.niijimaYunohama,
        caption: "湯の浜露天温泉もコーガ石の景観の一部。利用条件は村の最新告知で確認する。",
        sources: [
          { label: "東京都｜地域資源・コーガ石", url: "https://www.chiikishigen.metro.tokyo.lg.jp/introduction/details/introduction_124.html" },
          { label: "東京都｜東京宝島・新島ガラス", url: "https://www.t-treasureislands.metro.tokyo.lg.jp/about/branding/" },
        ],
      },
      {
        number: "03",
        eyebrow: "EXILE & KNOWLEDGE",
        title: "1,333人の流人を、島はどう受け止めたか",
        copy: [
          "新島村の資料では、江戸時代に1,333人が新島へ流されたとされる。犯罪だけでなく、政治や宗教上の理由で送られた人もいた。流人第1号と伝わる天宥法印は、読み書き、農耕、養蚕を島へ伝えた人物として紹介されている。",
          "一方で、新島には縄文時代から人が暮らし、漁や祭礼を続けてきた歴史がある。流人が島文化を一方的に『つくった』のではない。在来の暮らしに外から来た知識が重なり、教育、医療、農業へ影響した歴史として読む。新島村博物館、流人墓地、天宥法印墓は、その複雑さを現地で考える入口になる。",
        ],
        image: photos.niijimaHabushiura,
        caption: "海に囲まれた流刑地で、知識や技術もまた海を越えて残った。",
        sources: [
          { label: "新島村｜第3次総合計画", url: "https://www.niijima.com/soshiki/kikakuzaiseika/news/files/koukisoan.pdf" },
          { label: "新島村｜DATA NIIJIMA 2025", url: "https://www.niijima.com/gyousei/keikaku/files/dataniijima_2025_final.pdf" },
        ],
      },
      {
        number: "04",
        eyebrow: "FOUR COASTS",
        title: "羽伏浦だけではない。海岸ごとに、波も砂も役割も違う",
        copy: [
          "東岸の羽伏浦は約6〜7kmの白い海岸が続き、強い波で知られるサーフポイントだ。西岸の前浜は集落から近く、比較的穏やか。間々下には磯と砂浜があり、若郷前浜は黒い砂を見せる。新島の海を一枚のビーチ写真で代表させると、この違いを落としてしまう。",
          "海で遊べるかどうかは、景色の美しさとは別の判断になる。羽伏浦は特に、波、風、漂着物、工事や立入情報を優先する。海況が悪い日は、博物館、ガラス、モヤイ、コーガ石建築へ切り替えても、新島の核心から外れない。",
        ],
        image: photos.niijimaHabushiura,
        caption: "羽伏浦は眺望地であると同時に、波を読む必要がある海岸だ。",
        sources: [
          { label: "新島村｜サーフィン", url: "https://www.niijima.com/kankou/niijima/active/2014-0313-0955-90.html" },
          { label: "新島村｜海水浴場", url: "https://niijima.com/kankou/niijima/spot/2014-0214-1318-90.html" },
        ],
      },
    ],
    timeline: [
      { year: "縄文時代", title: "島に人が暮らす", copy: "本村・若郷の遺跡から、人の営みが長く続いてきたことが分かる。" },
      { year: "886", title: "向山が噴火", copy: "大噴火が南部の火山地形とコーガ石の母体をつくる。" },
      { year: "江戸時代", title: "流刑地になる", copy: "村資料では1,333人が流罪となり、外から来た知識も島の暮らしに重なった。" },
      { year: "1977", title: "渋谷区へモヤイ像を寄贈", copy: "東京移管100年を記念し、コーガ石の像が島外へ渡る。" },
      { year: "1987–88", title: "新島ガラスの拠点が生まれる", copy: "石を建材からガラスと国際的な工芸交流へ展開した。" },
      { year: "2022", title: "大踊がユネスコ無形文化遺産へ", copy: "国指定重要無形民俗文化財『新島の大踊』が『風流踊』の構成要素となった。" },
    ],
    trivia: [
      { question: "コーガ石は普通の軽石？", answer: "東京都資料では黒雲母流紋岩。商品名や島内呼称と、岩石学上の名前を分けて考える。" },
      { question: "石なのに水に浮く？", answer: "多孔質で比重が小さく、軽いコーガ石は水に浮く。加工しやすさも島の建築を支えた。" },
      { question: "モヤイはモアイのコピー？", answer: "造形上の連想に加え、新島方言の『モヤイ』には助け合い・協力という意味がある。" },
      { question: "新島ガラスの色は着色料？", answer: "オリーブ色はコーガ石由来の成分、とくに鉄分が発色したものと説明されている。" },
      { question: "くさやは腐った魚？", answer: "違う。塩が貴重だった時代に生まれた、くさや汁と乾燥による保存技術である。" },
    ],
    fieldNotes: [
      { label: "最初に", title: "新島村博物館で、自然と流人史を一度につかむ", copy: "縄文遺跡、流人資料、民具、コーガ石建築を見てから島へ出ると、各地点がつながる。" },
      { label: "本村で", title: "コーガ石を、建物とモヤイ像で見比べる", copy: "素材の加工痕、積み方、彫刻への変化を見る。私有地や墓域には入らない。" },
      { label: "南部で", title: "ガラスの色を、石の成分から見る", copy: "ガラスアートセンターで見学・体験の可否を確認し、オリーブ色の由来をたどる。" },
      { label: "海岸で", title: "羽伏浦、前浜、間々下の違いを記録する", copy: "砂の色、波、集落との距離を同じ項目で比べる。遊泳と立入は現地表示を優先する。" },
    ],
    sources: [
      { label: "新島村｜DATA NIIJIMA 2025", url: "https://www.niijima.com/gyousei/keikaku/files/dataniijima_2025_final.pdf" },
      { label: "新島村｜村の紹介", url: "https://www.niijima.com/shoukai/index.html" },
      { label: "国土地理院｜伊豆諸島の火山地形", url: "https://www.gsi.go.jp/REPORT/JIHO/vol84-5-1.html" },
      { label: "東京都｜コーガ石", url: "https://www.chiikishigen.metro.tokyo.lg.jp/introduction/details/introduction_124.html" },
      { label: "新島村｜第3次総合計画", url: "https://www.niijima.com/soshiki/kikakuzaiseika/news/files/koukisoan.pdf" },
      { label: "新島村｜観光案内", url: "https://www.niijima.com/kankou/" },
    ],
  },
};
