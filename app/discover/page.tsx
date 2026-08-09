/* eslint-disable @next/next/no-html-link-for-pages -- vinext Link navigation crashes at runtime; hard navigation is intentional. */
import type { Metadata } from "next";
import Image from "next/image";
import IslandMap from "./IslandMap";
import { bookingLinks, islands, overviewPoints, overviewRoutes, type Photo } from "./island-data";
import styles from "./discover.module.css";

export const metadata: Metadata = {
  title: "東京離島、三つの別世界へ。｜大島・新島・神津島",
  description: "火山の大島、白い新島、山・海・星の神津島。地図、回り方、食、宿、交通、公式予約先までつないだ Island Weekend 三島特集。",
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
          <p className={styles.coverKicker}>ŌSHIMA · NIIJIMA · KŌZUSHIMA</p>
          <h1><span>東京から、</span><span>三つの</span><span>別世界へ。</span></h1>
          <p className={styles.coverDeck}>火山の黒。断崖の白。山と海と、守られた夜の黒。近い順ではなく、友達とどんな時間を過ごしたいかで島を選ぶ。</p>
          <div className={styles.coverActions}>
            <a href="#map">地図から旅をひらく</a>
            <a href="/discover/kozushima">神津島を深く読む</a>
          </div>
        </div>

        <div className={styles.coverMosaic} aria-label="大島、新島、神津島の実景">
          <div className={styles.coverKozu}>
            <a className={styles.coverLink} href="/discover/kozushima">
              <Image src={kozushima.hero.src} alt={kozushima.hero.alt} fill sizes="(max-width: 820px) 100vw, 58vw" priority />
              <div><small>01 / DEEPEST FEATURE</small><strong>神津島</strong><span>山・海・星</span></div>
            </a>
            <Credit photo={kozushima.hero} />
          </div>
          <div className={styles.coverOshima}>
            <a className={styles.coverLink} href="/discover/oshima">
              <Image src={oshima.hero.src} alt={oshima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>02 / VOLCANO</small><strong>大島</strong></div>
            </a>
            <Credit photo={oshima.hero} />
          </div>
          <div className={styles.coverNiijima}>
            <a className={styles.coverLink} href="/discover/niijima">
              <Image src={niijima.hero.src} alt={niijima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>03 / WHITE</small><strong>新島</strong></div>
            </a>
            <Credit photo={niijima.hero} />
          </div>
        </div>
      </section>

      <section className={styles.truthStrip} aria-labelledby="truth-title">
        <div>
          <span className={styles.truthLight} />
          <p><small>CURRENT TRUTH / SSOT</small><strong id="truth-title">採用中は「大島 → 新島」</strong></p>
        </div>
        <p>神津島は、この特集で比較する<strong>提案中の第三案</strong>。読んで行きたくなったら、Discordから提案をSSOTへ移す。</p>
        <a href="/">現在の予定を見る <b aria-hidden="true">→</b></a>
      </section>

      <section className={styles.mapSection} id="map">
        <div className={styles.sectionIndex}>
          <span>01</span>
          <p>GEOGRAPHY FIRST</p>
        </div>
        <div className={styles.mapCopy}>
          <p className={styles.eyebrow}>ONE ARCHIPELAGO, THREE TEMPOS</p>
          <h2>位置がわかると、<br />旅の組み方が変わる。</h2>
          <p>赤い実線は、いまSSOTに入っている竹芝→大島→新島。破線は神津島を加える場合の候補。地図の点を押すと、スポットと役割が見える。</p>
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
          <p>CHOOSE BY THE DAY YOU WANT</p>
          <h2>島ではなく、<br />過ごしたい一日を選ぶ。</h2>
        </div>
        <div className={styles.compareTable} role="table" aria-label="三島の旅の性格比較">
          <div className={styles.compareHead} role="row">
            <span role="columnheader">ISLAND</span>
            <span role="columnheader">THE DAY</span>
            <span role="columnheader">PACE</span>
            <span role="columnheader">MOVE</span>
            <span role="columnheader">FIRST BOOKING</span>
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
          <div className={styles.featureNumber}><span>01</span><small>DEEPEST FEATURE</small></div>
          <p className={styles.eyebrow}>MOUNTAIN · SEA · STARS</p>
          <h2>{kozushima.coverLine}</h2>
          <p className={styles.featureLead}>{kozushima.longIntro}</p>
          <div className={styles.factRail}>
            {kozushima.facts.map((fact) => <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}
          </div>
          <a className={styles.featureCta} href="/discover/kozushima">
            <span>神津島完全ガイドへ</span><b aria-hidden="true">→</b>
          </a>
        </div>
      </section>

      <section className={styles.oshimaLead} id="oshima">
        <div className={styles.oshimaCopy}>
          <div className={styles.featureNumber}><span>02</span><small>VOLCANO FEATURE</small></div>
          <p className={styles.eyebrow}>BLACK GROUND / DEEP TIME</p>
          <h2>{oshima.coverLine}</h2>
          <p>{oshima.longIntro}</p>
          <div className={styles.inlineFacts}>{oshima.facts.map((fact) => <span key={fact.label}><b>{fact.value}</b>{fact.label}</span>)}</div>
          <a className={styles.darkCta} href="/discover/oshima">大島の火山ルートを読む <b aria-hidden="true">→</b></a>
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
          <div className={styles.featureNumber}><span>03</span><small>SLOW FEATURE</small></div>
          <p className={styles.eyebrow}>WHITE COAST / BICYCLE PACE</p>
          <h2>{niijima.coverLine}</h2>
          <p>{niijima.longIntro}</p>
          <blockquote>予定を減らすほど、<br />海の時間が増えていく。</blockquote>
          <a className={styles.darkCta} href="/discover/niijima">新島の白い一日を読む <b aria-hidden="true">→</b></a>
        </div>
      </section>

      <section className={styles.bookingSection} id="booking">
        <div className={styles.bookingIntro}>
          <div className={styles.sectionIndex}><span>02</span><p>BOOKING DESK</p></div>
          <p className={styles.eyebrow}>OFFICIAL DOORS ONLY</p>
          <h2>予約は、旅の順番で。</h2>
          <p>空席・空室・価格はまだ確定していない。ここでは公式サイトだけを入口にし、宿と交通が成立してから予定をSSOTへ移す。</p>
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
        <p className={styles.bookingNote}>No booking has been made. 運賃・運航・空席・空室・営業時間はリンク先で旅行日を指定して確認します。</p>
      </section>

      <section className={styles.editorNote}>
        <p>EDITOR&apos;S NOTE</p>
        <blockquote>名所を増やすのではなく、<br />友達と話したくなる場面を増やす。</blockquote>
        <div>
          <p>このマガジンは候補を熱く紹介する場所。採用された予定、金額、経費、領収書は「俺たちの予定」にだけ置く。読み物とSSOTを混ぜないことで、面白さと正確さの両方を守る。</p>
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
        <p>Editorial feature built from official tourism information. Live conditions always win.</p>
      </footer>
    </main>
  );
}
