/* eslint-disable @next/next/no-html-link-for-pages -- vinext Link navigation crashes at runtime; hard navigation is intentional. */
import type { Metadata } from "next";
import Image from "next/image";
import IslandMap from "./IslandMap";
import { bookingLinks, islands, overviewPoints, overviewRoutes, type Photo } from "./island-data";
import styles from "./discover.module.css";

export const metadata: Metadata = {
  title: "神津島から、大島か新島へ｜ISLAND WEEKEND",
  description: "神津島を共通に、大島と新島の2案を比べる友達との島旅ガイド。地図、モデルコース、雨の日、食、宿、交通、公式予約先をまとめました。",
};

function Credit({ photo }: { photo: Photo }) {
  return (
    <a className={styles.photoCredit} href={photo.creditUrl} target="_blank" rel="noreferrer">
      {photo.credit}
    </a>
  );
}

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <span>{children}</span><b aria-hidden="true">↗</b>
    </a>
  );
}

export default function DiscoverPage() {
  const [kozushima, oshima, niijima] = islands;

  return (
    <main className={styles.magazine}>
      <header className={styles.masthead}>
        <a className={styles.wordmark} href="/discover">
          <span>OPENClOS</span>
          <strong>ISLAND WEEKEND</strong>
        </a>
        <nav aria-label="島旅マガジン">
          <a href="/discover/kozushima">神津島</a>
          <a href="/discover/oshima">大島</a>
          <a href="/discover/niijima">新島</a>
          <a href="#map">地図</a>
          <a href="#booking">予約</a>
        </nav>
        <a className={styles.ssotNav} href="/">俺たちの予定</a>
      </header>

      <section className={styles.coverStory}>
        <div className={styles.coverIntro}>
          <div className={styles.issueLine}>
            <span>FIELD JOURNAL 002</span>
            <span>IZU ISLANDS / TOKYO</span>
          </div>
          <p className={styles.coverKicker}>KŌZUSHIMA · ŌSHIMA / NIIJIMA</p>
          <h1><span>神津島から、</span><span>大島か新島へ</span><span>友達との島旅</span></h1>
          <p className={styles.coverDeck}>8月29日に神津島へ。その先を、火山の大島にするか、白い海の新島にするか。友達と過ごしたい時間から、二つの旅を比べます。</p>
          <div className={styles.coverActions}>
            <a href="#map">2つの案を地図で見る</a>
            <a href="/discover/kozushima">まず神津島を読む</a>
          </div>
        </div>

        <div className={styles.coverMosaic} aria-label="大島、新島、神津島の実景">
          <div className={styles.coverKozu}>
            <a className={styles.coverLink} href="/discover/kozushima">
              <Image src={kozushima.hero.src} alt={kozushima.hero.alt} fill sizes="(max-width: 820px) 100vw, 58vw" priority />
              <div><small>01 / 2 NIGHTS</small><strong>神津島</strong><span>天上山・海・星空</span></div>
            </a>
            <Credit photo={kozushima.hero} />
          </div>
          <div className={styles.coverOshima}>
            <a className={styles.coverLink} href="/discover/oshima">
              <Image src={oshima.hero.src} alt={oshima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>02 / 1 NIGHT</small><strong>大島</strong></div>
            </a>
            <Credit photo={oshima.hero} />
          </div>
          <div className={styles.coverNiijima}>
            <a className={styles.coverLink} href="/discover/niijima">
              <Image src={niijima.hero.src} alt={niijima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>03 / 1 NIGHT</small><strong>新島</strong></div>
            </a>
            <Credit photo={niijima.hero} />
          </div>
        </div>
      </section>

      <section className={styles.truthStrip} aria-labelledby="truth-title">
        <div>
          <span className={styles.truthLight} />
          <p><small>CURRENT TRUTH / SSOT</small><strong id="truth-title">神津島を共通に、第二の島を相談中</strong></p>
        </div>
        <p>候補は<strong>伊豆大島と新島</strong>の二つ。8/30の接続は両案とも公式時刻表で確認済み。空席と宿がそろってから決めます。</p>
        <a href="/">現在の予定を見る <b aria-hidden="true">→</b></a>
      </section>

      <section className={styles.mapSection} id="map">
        <div className={styles.sectionIndex}>
          <span>01</span>
          <p>GEOGRAPHY FIRST</p>
        </div>
        <div className={styles.mapCopy}>
          <p className={styles.eyebrow}>MAP &amp; ROUTES</p>
          <h2>大島・新島・神津島の位置と移動</h2>
          <p>破線は予約済みの経路ではありません。8/29に神津島へ入り、8/30に大島か新島へ移る二つの候補です。時刻表には両方の便がありますが、空席と当日の発着港は未確認です。</p>
          <ul>
            <li><b>大島</b><span>東京に近く、到着日から火山を歩ける。</span></li>
            <li><b>新島</b><span>大島から南へ。自転車の速度で白い海岸をつなぐ。</span></li>
            <li><b>神津島</b><span>さらに南へ。調布からは飛行機で約45分の案内。</span></li>
          </ul>
        </div>
        <div className={styles.overviewMap}>
          <IslandMap center={[34.82, 139.36]} zoom={8} points={overviewPoints} routes={overviewRoutes} label="東京・大島・新島・神津島の位置と移動候補" tone="dark" />
        </div>
      </section>

      <section className={styles.chooseSection}>
        <div className={styles.chooseTitle}>
          <p>COMPARE THE ISLANDS</p>
          <h2>神津島の次を、過ごし方で選ぶ</h2>
        </div>
        <div className={styles.compareTable} role="table" aria-label="三島の旅の性格比較">
          <div className={styles.compareHead} role="row">
            <span role="columnheader">島</span>
            <span role="columnheader">やりたいこと</span>
            <span role="columnheader">日数</span>
            <span role="columnheader">島内移動</span>
            <span role="columnheader">先に予約</span>
          </div>
          {islands.map((island) => (
            <a className={styles.compareRow} href={`/discover/${island.slug}`} key={island.slug} role="row">
              <span className={styles.compareName} role="cell"><small>{island.order}</small><strong>{island.name}</strong><em>{island.english}</em></span>
              <span role="cell">{island.fit[0].value}</span>
              <span role="cell">{island.fit[1].value}</span>
              <span role="cell">{island.fit[2].value}</span>
              <span role="cell">{island.fit[3].value}<b aria-hidden="true">→</b></span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.kozushimaLead} id="kozushima">
        <div className={styles.kozuPhoto}>
          <Image src={kozushima.cover.src} alt={kozushima.cover.alt} fill sizes="(max-width: 820px) 100vw, 57vw" />
          <Credit photo={kozushima.cover} />
          <div className={styles.verticalLabel}>KŌZUSHIMA / TOKYO DARK SKY ISLAND</div>
        </div>
        <div className={styles.kozuStory}>
          <div className={styles.featureNumber}><span>01</span><small>2泊3日ガイド</small></div>
          <p className={styles.eyebrow}>MOUNTAIN / SEA / STARS</p>
          <h2>{kozushima.coverLine}</h2>
          <p className={styles.featureLead}>{kozushima.longIntro}</p>
          <div className={styles.factRail}>
            {kozushima.facts.map((fact) => <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}
          </div>
          <a className={styles.featureCta} href="/discover/kozushima">
            <span>神津島のモデルコースを見る</span><b aria-hidden="true">→</b>
          </a>
        </div>
      </section>

      <section className={styles.oshimaLead} id="oshima">
        <div className={styles.oshimaCopy}>
          <div className={styles.featureNumber}><span>02</span><small>1泊2日ガイド</small></div>
          <p className={styles.eyebrow}>VOLCANO / GEOLOGY / ONSEN</p>
          <h2>{oshima.coverLine}</h2>
          <p>{oshima.longIntro}</p>
          <div className={styles.inlineFacts}>{oshima.facts.map((fact) => <span key={fact.label}><b>{fact.value}</b>{fact.label}</span>)}</div>
          <a className={styles.darkCta} href="/discover/oshima">大島のモデルコースを見る <b aria-hidden="true">→</b></a>
        </div>
        <div className={styles.oshimaImage}>
          <Image src={oshima.cover.src} alt={oshima.cover.alt} fill sizes="(max-width: 820px) 100vw, 59vw" />
          <Credit photo={oshima.cover} />
        </div>
      </section>

      <section className={styles.niijimaLead} id="niijima">
        <div className={styles.niijimaImage}>
          <Image src={niijima.cover.src} alt={niijima.cover.alt} fill sizes="(max-width: 820px) 100vw, 59vw" />
          <Credit photo={niijima.cover} />
        </div>
        <div className={styles.niijimaCopy}>
          <div className={styles.featureNumber}><span>03</span><small>1泊2日ガイド</small></div>
          <p className={styles.eyebrow}>BEACH / BICYCLE / GLASS</p>
          <h2>{niijima.coverLine}</h2>
          <p>{niijima.longIntro}</p>
          <blockquote>羽伏浦で急がず過ごし、<br />夕方は湯の浜露天温泉へ。</blockquote>
          <a className={styles.darkCta} href="/discover/niijima">新島のモデルコースを見る <b aria-hidden="true">→</b></a>
        </div>
      </section>

      <section className={styles.bookingSection} id="booking">
        <div className={styles.bookingIntro}>
          <div className={styles.sectionIndex}><span>02</span><p>BOOKING DESK</p></div>
          <p className={styles.eyebrow}>BOOKING</p>
          <h2>決める前に、宿と交通を確かめる</h2>
          <p>時刻と運賃は公式情報で確認しました。次は同じ人数で空席と宿を照合し、取れる組み合わせだけをSSOTへ移します。</p>
        </div>
        <div className={styles.bookingList}>
          {bookingLinks.map((item) => (
            <ExternalLink className={styles.bookingRow} href={item.url} key={item.index}>
              <small>{item.index}</small>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <em>{item.status}</em>
            </ExternalLink>
          ))}
        </div>
        <p className={styles.bookingNote}>予約はまだしていません。運賃、運航、空席、空室、営業時間は、リンク先で旅行日を指定して確認します。</p>
      </section>

      <section className={styles.editorNote}>
        <p>HOW TO USE THIS GUIDE</p>
        <blockquote>まず神津島を読む。次に大島と新島を比べる。<br />決めた予定だけをSSOTに残す。</blockquote>
        <div>
          <p>このマガジンには、行き先を相談するための候補を載せています。採用した予定、金額、経費、領収書は「俺たちの予定」で管理します。</p>
          <div>
            <a href="/">俺たちの予定へ</a>
            <ExternalLink href="https://discord.com/channels/1535960563140796476/1535960564059213947">DiscordでOpenClosに相談</ExternalLink>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div><span>OPENClOS</span><strong>ISLAND WEEKEND</strong></div>
        <nav aria-label="公式情報">
          <ExternalLink href="https://kozushima.com/">神津島観光協会</ExternalLink>
          <ExternalLink href="https://izu-oshima.or.jp/">伊豆大島観光協会</ExternalLink>
          <ExternalLink href="https://niijima-info.jp/">新島観光協会</ExternalLink>
          <ExternalLink href="https://www.tokyo-islands.com/">東京宝島</ExternalLink>
        </nav>
        <p>掲載内容は公式観光情報をもとに編集しています。出発前と当日は最新情報を確認してください。</p>
      </footer>
    </main>
  );
}
