import type { Metadata } from "next";
import Link from "next/link";
import styles from "./discover.module.css";

export const metadata: Metadata = {
  title: "島旅マガジン｜黒い大島から、白い新島へ",
  description: "大島と新島の景色、遊び、宿、移動、公式予約先を、友達旅行の目線で集めた Island Weekend の旅マガジン。",
};

const discordUrl = "https://discord.com/channels/1535960563140796476/1535960564059213947";

const oshimaStories = [
  {
    scene: 1 as const,
    number: "01",
    label: "VOLCANO WALK",
    title: "朝6時、地球じゃない黒へ",
    copy: "大島に着いたら、まず島の黒を見に行く。三原山の東側に広がる裏砂漠は、観光協会が「砂漠」と表記される国内唯一の場所として紹介する火山景観。友達と歩けば、会話より足音が面白い朝になる。",
    note: "風と霧で景色が一変。装備と当日の情報を優先。",
    href: "https://izu-oshima.or.jp/play.html",
    link: "大島観光協会で見る",
  },
  {
    scene: 2 as const,
    number: "02",
    label: "EARTH ARCHIVE",
    title: "2万年の縞を、道端で読む",
    copy: "島の西側に現れる巨大な地層切断面。約2万年、100回ほどの噴火の積み重なりが縞になって見える。移動の途中に突然現れるからこそ、旅の「何これ」が最大になる場所。",
    note: "ドライブの寄り道候補。安全な場所で停車して眺める。",
    href: "https://izu-oshima.or.jp/play.html",
    link: "公式スポット情報",
  },
  {
    scene: 3 as const,
    number: "03",
    label: "SUNSET RITUAL",
    title: "夕日は、温泉までがワンセット",
    copy: "サンセットパームラインで海の色が変わるのを待ち、そのまま元町浜の湯へ。水着で入る男女混浴の露天風呂だから、友達旅行の夕方にちょうどいい。8月は19時までの案内だが、天候による変更がある。",
    note: "水着をデイバッグへ。元町港から徒歩約3分。",
    href: "https://www.town.oshima.tokyo.jp/soshiki/kankou/hamanoyu.html",
    link: "大島町の案内",
  },
];

const niijimaStories = [
  {
    scene: 4 as const,
    number: "04",
    label: "WHITE HORIZON",
    title: "白が6.5km、終わらない",
    copy: "羽伏浦海岸は、白い砂浜と海へ続く白いゲートが新島らしさを一発で教えてくれる場所。約6.5kmの海岸はサーフスポットとして有名。眺める日と泳げる日は同じとは限らないから、海況を見て遊び方を変える。",
    note: "遊泳可否は当日の掲示と監視員の案内が最優先。",
    href: "https://www.tokyo-islands.com/about/niijima/",
    link: "東京宝島で読む",
  },
  {
    scene: 5 as const,
    number: "05",
    label: "GREEK SUNSET",
    title: "島なのに、急にエーゲ海",
    copy: "海辺に現れるギリシャ神殿風の湯の浜露天温泉。公式案内では無料・24時間・水着着用。夕日から星空まで、予定を詰め込まずに友達とだらだらすること自体を旅のイベントにする。",
    note: "設備や利用可否は最新のお知らせと現地掲示で確認。",
    href: "https://niijima-info.jp/hotspring/",
    link: "新島観光協会で見る",
  },
  {
    scene: 6 as const,
    number: "06",
    label: "ISLAND COLOR",
    title: "オリーブ色のガラスを持ち帰る",
    copy: "新島のコーガ石から生まれる、淡いオリーブ色の新島ガラス。ガラスアートセンターでは、公式ページ上で40分の彫刻体験を案内している。島に点在するモヤイも同じ石の仲間。旅の記憶を色と形で残せる。",
    note: "体験は予約優先・電話受付。営業情報は直前に再確認。",
    href: "https://niijima-info.jp/spot/2301/",
    link: "体験の公式案内",
  },
];

const bookingDesk = [
  {
    step: "01",
    kind: "SHIP · WEB",
    title: "東京 → 大島 → 新島 → 東京",
    copy: "今回の移動3区間。Web予約は無料会員登録とカード決済が必要。2026年8月29日出発分は予約受付期間内だが、空席はログイン後に確認する。",
    status: "空席未確認",
    href: "https://www.tokaikisenyoyaku.com/app/login",
    cta: "東海汽船で空席を見る",
  },
  {
    step: "02",
    kind: "OSHIMA · DIRECT",
    title: "大島温泉ホテル",
    copy: "三原山を望む温泉宿。火山歩きの前後を温泉で締めたいチーム向け。公式サイトから宿泊プランと空室へ進める。",
    status: "空室・2名料金未確認",
    href: "https://www.oshima-onsen.co.jp/",
    cta: "公式サイトで確認",
  },
  {
    step: "03",
    kind: "OSHIMA · DIRECT",
    title: "Book Tea Bed 伊豆大島",
    copy: "元町港から徒歩約2分。カフェ＆バー、バギー、BBQまで一か所にまとまる、身軽な友達旅向きの候補。",
    status: "空室・2名料金未確認",
    href: "https://btb-oshima.jp/",
    cta: "公式サイトで確認",
  },
  {
    step: "04",
    kind: "OSHIMA · DIRECTORY",
    title: "大島の宿を横断して探す",
    copy: "旅館、民宿、ホテル、ゲストハウスを公式一覧から比較。船が元町港・岡田港のどちらに着くか当日決まることも踏まえて、送迎条件も見る。",
    status: "候補選定前",
    href: "https://www.izu-oshima.or.jp/accommodation.html",
    cta: "公式宿一覧を開く",
  },
  {
    step: "05",
    kind: "NIIJIMA · DIRECTORY",
    title: "新島の宿を押さえる",
    copy: "Hostel NABLA、Villa BENI、一棟貸し、民宿などを公式一覧で比較。宿数が限られ、観光案内所は予約代行をしないため、船と並行して直接問い合わせる。",
    status: "最優先・空室未確認",
    href: "https://niijima-info.jp/stay/",
    cta: "公式宿一覧を開く",
  },
  {
    step: "06",
    kind: "OSHIMA · MOBILITY",
    title: "大島の足：バスかレンタカー",
    copy: "火山景観を広く回るなら車、範囲を絞るならバス。タクシーは流し営業が基本的にないため予約前提で考える。",
    status: "移動方針未決定",
    href: "https://izu-oshima.or.jp/transportation.html",
    cta: "公式交通一覧を開く",
  },
  {
    step: "07",
    kind: "NIIJIMA · MOBILITY",
    title: "新島の足：自転車＋必要なら車",
    copy: "中心部は自転車で楽しみやすい。若郷へ抜ける平成新島トンネルは徒歩・自転車不可なので、行き先に応じて車を先に予約する。",
    status: "車両未予約",
    href: "https://niijima-info.jp/ido/",
    cta: "レンタル店一覧を見る",
  },
  {
    step: "08",
    kind: "NIIJIMA · PHONE",
    title: "新島ガラス彫刻体験",
    copy: "公式案内は約40分・3,300円・最大4名、13:30／14:30／15:30。予約優先で電話受付（04992-5-1540）。",
    status: "枠・料金の再確認が必要",
    href: "https://niijima-info.jp/spot/2301/",
    cta: "公式案内を確認",
  },
  {
    step: "09",
    kind: "FOOD · DIRECTORY",
    title: "島の夜ごはんを難民にしない",
    copy: "新島は飲食店の数と席が限られる。営業日を直前確認し、予約かテイクアウトを一つ確保してから、余白を残す。",
    status: "店・席未確認",
    href: "https://niijima-info.jp/restaurant/",
    cta: "新島の飲食店一覧",
  },
];

function Scene({ scene, label }: { scene: 1 | 2 | 3 | 4 | 5 | 6; label: string }) {
  return (
    <div
      className={`${styles.scene} ${styles[`scene${scene}`]}`}
      role="img"
      aria-label={`${label}をイメージした編集ビジュアル`}
    >
      <span>EDITORIAL VISUAL</span>
    </div>
  );
}

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}<span aria-hidden="true">↗</span>
    </a>
  );
}

export default function DiscoverPage() {
  return (
    <main className={styles.magazine}>
      <header className={styles.masthead}>
        <Link className={styles.brand} href="/">
          <span>OPENClOS</span>
          <strong>ISLAND WEEKEND</strong>
        </Link>
        <nav aria-label="マガジン内ナビゲーション">
          <a href="#oshima">大島</a>
          <a href="#niijima">新島</a>
          <a href="#booking">予約デスク</a>
          <Link href="/">俺たちの予定</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.issueRow}>
            <span>FIELD NOTES / ISSUE 001</span>
            <time dateTime="2026-08-29">29 AUG — 01 SEP 2026</time>
          </div>
          <p className={styles.overline}>TOKYO → OSHIMA → NIIJIMA → TOKYO</p>
          <h1>黒い島から、<br />白い島へ。</h1>
          <p className={styles.deck}>火山の朝、白い海、ギリシャみたいな温泉。友達と行くなら「名所を消化する」より、島の色が変わるたびに遊び方を変えたい。</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#stories">島を読んでみる</a>
            <Link className={styles.secondaryAction} href="/">採用済み予定を見る</Link>
          </div>
        </div>
        <div className={styles.heroArt}>
          <Scene scene={1} label="大島の黒い火山原" />
          <div className={styles.heroStamp}><b>2</b><span>ISLANDS<br />4 DAYS</span></div>
          <p>現地の特徴をもとに制作した編集ビジュアルです</p>
        </div>
      </section>

      <section className={styles.nowStrip} aria-labelledby="now-title">
        <div>
          <span className={styles.liveDot} />
          <p><small>OPENClOS BOOKING WATCH</small><strong id="now-title">いま押さえる順番</strong></p>
        </div>
        <ol>
          <li><b>01</b><span>船3区間</span><em>空席未確認</em></li>
          <li><b>02</b><span>大島の宿</span><em>空室未確認</em></li>
          <li><b>03</b><span>新島の宿</span><em>最優先</em></li>
          <li><b>04</b><span>島内の足</span><em>方針未決定</em></li>
        </ol>
      </section>

      <section className={styles.editorLetter} id="stories">
        <p>EDITOR&apos;S LETTER</p>
        <blockquote>「どこへ行くか」ではなく、<br />「どんな時間が友達と面白いか」から組み立てる。</blockquote>
        <div>
          <p>今回の旅は、東京から夜行船で大島へ入り、翌日に新島へ渡る3泊4日の仮案。大島では動き、新島ではゆるむ。その対比が、この旅のいちばん強いコンセプトです。</p>
          <p>ここは予約サイトのコピーではなく、OpenClosが公式情報を読み解いて「こう遊ぶと面白そう」を集める旅の読み物。採用された予定だけが、別ページのSSOT「俺たちの予定」に入ります。</p>
        </div>
      </section>

      <section className={styles.islandChapter} id="oshima">
        <div className={styles.chapterHead}>
          <div><span>CHAPTER ONE</span><b>01</b></div>
          <p>ACTIVE / VOLCANIC / DEEP GREEN</p>
          <h2>大島は、<br />黒を遊ぶ島。</h2>
          <p className={styles.chapterLead}>到着した朝から景色が強い。火山、地層、海辺の温泉を一本のストーリーにして、「動く日」をつくる。</p>
        </div>
        <div className={styles.storyGrid}>
          {oshimaStories.map((story) => (
            <article className={styles.storyCard} key={story.number}>
              <Scene scene={story.scene} label={story.title} />
              <div className={styles.storyMeta}><span>{story.number}</span><p>{story.label}</p></div>
              <h3>{story.title}</h3>
              <p>{story.copy}</p>
              <aside>{story.note}</aside>
              <ExternalLink href={story.href}>{story.link}</ExternalLink>
            </article>
          ))}
        </div>
        <div className={styles.islandAside}>
          <span>OSHIMA SIDE QUEST</span>
          <strong>「黒いもの」だけで写真ビンゴ</strong>
          <p>溶岩、地層、べっこう寿司の漬け、夜の海。名所の数ではなく、旅の色を集めて一枚のアルバムにする。</p>
          <ExternalLink href="https://www.izu-oshima.or.jp/eat.html">島の食を公式一覧で探す</ExternalLink>
        </div>
      </section>

      <section className={`${styles.islandChapter} ${styles.niijimaChapter}`} id="niijima">
        <div className={styles.chapterHead}>
          <div><span>CHAPTER TWO</span><b>02</b></div>
          <p>SLOW / WHITE / OLIVE GLASS</p>
          <h2>新島は、<br />白でほどける島。</h2>
          <p className={styles.chapterLead}>大島で動いた翌日は、海と温泉の間に余白をつくる。急いで回らないことが、いちばん贅沢な遊びになる。</p>
        </div>
        <div className={styles.storyGrid}>
          {niijimaStories.map((story) => (
            <article className={styles.storyCard} key={story.number}>
              <Scene scene={story.scene} label={story.title} />
              <div className={styles.storyMeta}><span>{story.number}</span><p>{story.label}</p></div>
              <h3>{story.title}</h3>
              <p>{story.copy}</p>
              <aside>{story.note}</aside>
              <ExternalLink href={story.href}>{story.link}</ExternalLink>
            </article>
          ))}
        </div>
        <div className={styles.islandAside}>
          <span>NIIJIMA SIDE QUEST</span>
          <strong>モヤイに勝手な名前をつける</strong>
          <p>島のあちこちにいる石像を見つけたら、全員で名前とプロフィールを考える。モヤイの語源は、島の言葉で「力を合わせる」こと。</p>
          <ExternalLink href="https://www.tokyo-islands.com/about/niijima/">新島の物語をもっと読む</ExternalLink>
        </div>
      </section>

      <section className={styles.bookingSection} id="booking">
        <div className={styles.bookingHead}>
          <div>
            <p>OFFICIAL BOOKING DESK</p>
            <h2>予約先は、<br />ここから。</h2>
          </div>
          <p>公式サイト・公式観光協会だけを入口にしました。表示価格は確定額ではありません。空席・空室・営業時間は、リンク先で旅行日を指定して最終確認します。</p>
        </div>
        <div className={styles.bookingGrid}>
          {bookingDesk.map((item) => (
            <article className={styles.bookingCard} key={item.step}>
              <div className={styles.bookingTop}><span>{item.step}</span><em>{item.kind}</em></div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <div className={styles.bookingStatus}><i />{item.status}</div>
              <ExternalLink className={styles.bookingLink} href={item.href}>{item.cta}</ExternalLink>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stayShortlist}>
        <div className={styles.shortlistIntro}>
          <span>STAY BOOKMARKS</span>
          <h2>宿は「寝る場所」より、<br />旅の性格で選ぶ。</h2>
          <p>まだ空室は見ていない。だから今は、友達旅行として面白い性格の違う候補を並べておく。</p>
        </div>
        <div className={styles.shortlistList}>
          <article><span>OS / HOT SPRING</span><h3>大島温泉ホテル</h3><p>火山と温泉を旅の中心にする。</p></article>
          <article><span>OS / PORT & BAR</span><h3>Book Tea Bed</h3><p>港近・バー・遊びを一か所に集める。</p></article>
          <article><span>NI / HOSTEL</span><h3>Hostel NABLA</h3><p>旅人の空気ごと楽しむ。</p></article>
          <article><span>NI / ONE GROUP</span><h3>Villa BENI</h3><p>羽伏浦の近くで、仲間だけの基地に。</p></article>
          <article><span>NI / WHOLE HOUSE</span><h3>CASA YAMAZEN</h3><p>2026年登場の一棟貸しを候補に。</p></article>
        </div>
        <div className={styles.shortlistLinks}>
          <ExternalLink href="https://www.izu-oshima.or.jp/accommodation.html">大島の公式宿一覧</ExternalLink>
          <ExternalLink href="https://niijima-info.jp/stay/">新島の公式宿一覧</ExternalLink>
        </div>
      </section>

      <section className={styles.weatherSection}>
        <div className={styles.weatherTitle}><p>WEATHER SWITCH</p><h2>島は、予定どおりじゃない方が面白い。</h2></div>
        <div className={styles.weatherGrid}>
          <article>
            <span className={styles.weatherIcon}>☀</span>
            <div><small>晴れ・風おだやか</small><h3>外へ全部ひらく</h3></div>
            <ol><li>三原山・裏砂漠</li><li>羽伏浦の白い水平線</li><li>夕日から露天温泉</li></ol>
          </article>
          <article>
            <span className={styles.weatherIcon}>≋</span>
            <div><small>風が強い・海が荒い</small><h3>島の内側を読む</h3></div>
            <ol><li>大島の地層切断面</li><li>新島ガラスアート</li><li>カフェと早めの夕食</li></ol>
          </article>
          <article>
            <span className={styles.weatherIcon}>☂</span>
            <div><small>雨・予定変更</small><h3>余白をイベントにする</h3></div>
            <ol><li>宿で作戦会議</li><li>食の候補を開拓</li><li>翌日の港を最優先確認</li></ol>
          </article>
        </div>
        <p className={styles.weatherNote}>船の発着港・運航、海水浴、屋外温泉は当日の公式情報と現地案内を優先します。</p>
      </section>

      <section className={styles.agentSection}>
        <div className={styles.agentMark}>OC</div>
        <div className={styles.agentCopy}>
          <p>OPENClOS NEXT PICKS</p>
          <h2>次にサイトへ載せたい、<br />3つの遊び。</h2>
        </div>
        <div className={styles.agentIdeas}>
          <article><b>01</b><div><h3>島色フォトビンゴ</h3><p>黒・白・オリーブ・夕焼け・船の青を二人で集める。</p></div></article>
          <article><b>02</b><div><h3>旅の勝手な表彰式</h3><p>最終日の船で「一番意味不明だった瞬間」を決める。</p></div></article>
          <article><b>03</b><div><h3>1万円だけ自由枠</h3><p>予定外の体験や食に使う共通予算を、最初から確保する。</p></div></article>
        </div>
        <div className={styles.agentActions}>
          <ExternalLink className={styles.discordAction} href={discordUrl}>DiscordでOpenClosに相談</ExternalLink>
          <Link href="/">採用済みの「俺たちの予定」へ</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div><span>ISLAND WEEKEND</span><strong>旅の読み物はここ。<br />決定はSSOTへ。</strong></div>
        <div className={styles.footerLinks}>
          <Link href="/">俺たちの予定</Link>
          <ExternalLink href="https://izu-oshima.or.jp/">大島観光協会</ExternalLink>
          <ExternalLink href="https://niijima-info.jp/">新島観光協会</ExternalLink>
          <ExternalLink href="https://www.tokaikisen.co.jp/boarding/reservation_flow/">東海汽船 予約案内</ExternalLink>
        </div>
        <p>Research checked 09 AUG 2026 · Images are original editorial visuals, not documentary photographs. No booking has been made.</p>
      </footer>
    </main>
  );
}
