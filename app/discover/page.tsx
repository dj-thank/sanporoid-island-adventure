/* eslint-disable @next/next/no-html-link-for-pages -- vinext Link navigation crashes at runtime; hard navigation is intentional. */
import type { Metadata } from "next";
import Image from "next/image";
import IslandMap from "./IslandMap";
import { islandDossiers } from "./island-dossiers";
import { bookingLinks, islands, overviewPoints, overviewRoutes, type Photo } from "./island-data";
import styles from "./discover.module.css";

export const metadata: Metadata = {
  title: "神津島・新島 大特集｜ISLAND WEEKEND",
  description: "神津島と新島の歴史、火山地質、大きさ、暮らし、文化、雑学を公的資料から読む大型特集。地図、モデルコース、宿、交通も掲載。",
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
          <a href="#island-library">島を知る</a>
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
          <p className={styles.coverKicker}>KŌZUSHIMA × NIIJIMA</p>
          <h1><span>神津島から、</span><span>新島へ</span><span>友達との島旅</span></h1>
          <p className={styles.coverDeck}>8月29日に神津島へ渡り、30日に新島へ。山と星の夜から、白い海と自転車の二日間へつなぐ3泊4日です。大島の記事も、次の旅のために残しました。</p>
          <div className={styles.coverActions}>
            <a href="#map">決まったルートを地図で見る</a>
            <a href="/discover/kozushima#about">神津島の歴史から読む</a>
          </div>
        </div>

        <div className={styles.coverMosaic} aria-label="神津島、新島、大島の実景">
          <div className={styles.coverKozu}>
            <a className={styles.coverLink} href="/discover/kozushima">
              <Image src={kozushima.hero.src} alt={kozushima.hero.alt} fill sizes="(max-width: 820px) 100vw, 58vw" priority />
              <div><small>01 / 1 NIGHT</small><strong>神津島</strong><span>天上山・海・星空</span></div>
            </a>
            <Credit photo={kozushima.hero} />
          </div>
          <div className={styles.coverOshima}>
            <a className={styles.coverLink} href="/discover/oshima">
              <Image src={oshima.hero.src} alt={oshima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>SIDE STORY</small><strong>大島</strong></div>
            </a>
            <Credit photo={oshima.hero} />
          </div>
          <div className={styles.coverNiijima}>
            <a className={styles.coverLink} href="/discover/niijima">
              <Image src={niijima.hero.src} alt={niijima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>02 / 2 NIGHTS</small><strong>新島</strong></div>
            </a>
            <Credit photo={niijima.hero} />
          </div>
        </div>
      </section>

      <section className={styles.truthStrip} aria-labelledby="truth-title">
        <div>
          <span className={styles.truthLight} />
          <p><small>CURRENT TRUTH / SSOT</small><strong id="truth-title">神津島 → 新島で決定</strong></p>
        </div>
        <p>8/30に<strong>神津島から新島へ</strong>移る予定を採用しました。船か飛行機か、空席と宿はこれから決めます。</p>
        <a href="/">現在の予定を見る <b aria-hidden="true">→</b></a>
      </section>

      <section className={styles.dossierPortal} id="island-library" aria-labelledby="island-library-title">
        <header>
          <div className={styles.sectionIndex}><span>00</span><p>THE BIG ISLAND FILE</p></div>
          <div>
            <p className={styles.eyebrow}>NEW / HISTORY, GEOLOGY &amp; CULTURE</p>
            <h2 id="island-library-title">島の輪郭を、旅の前に読む</h2>
          </div>
          <p>神津島は水配り伝説と黒曜石、新島は流人史とコーガ石。景色の名前を覚える前に、その場所ができた理由から始めます。</p>
        </header>
        <nav className={styles.dossierPortalTabs} aria-label="読む島を選ぶ">
          {[
            { island: kozushima, dossier: islandDossiers.kozushima, number: "01" },
            { island: niijima, dossier: islandDossiers.niijima, number: "02" },
          ].map(({ island, dossier, number }) => (
            <article key={island.slug}>
              <a href={`/discover/${island.slug}#about`}>
                <Image src={dossier.portrait.src} alt={dossier.portrait.alt} fill sizes="(max-width: 820px) 100vw, 50vw" />
                <span className={styles.dossierPortalShade} />
                <div className={styles.dossierPortalTop}><small>{number} / ISLAND DOSSIER</small><b>OPEN FEATURE ↗</b></div>
                <div className={styles.dossierPortalCopy}>
                  <p>{island.english}</p>
                  <h3>{island.name}</h3>
                  <strong>{dossier.tabLine}</strong>
                  <span>{dossier.atlas.slice(0, 3).map((fact) => `${fact.value} ${fact.label}`).join(" / ")}</span>
                </div>
              </a>
              <Credit photo={dossier.portrait} />
            </article>
          ))}
        </nav>
        <div className={styles.dossierPortalNote}>
          <strong>読むのに約8分 / 島</strong>
          <p>基礎データ、火山地質、歴史年表、暮らし、文化、雑学、現地で確かめる場所まで。自治体・国土地理院・文化庁などの公的資料をもとに編集しました。</p>
          <a href="#map">旅程と地図へ進む <b aria-hidden="true">↓</b></a>
        </div>
      </section>

      <section className={styles.mapSection} id="map">
        <div className={styles.sectionIndex}>
          <span>01</span>
          <p>GEOGRAPHY FIRST</p>
        </div>
        <div className={styles.mapCopy}>
          <p className={styles.eyebrow}>MAP &amp; ROUTES</p>
          <h2>東京から神津島へ。翌日、新島へ</h2>
          <p>地図には距離感が分かるよう大島も残しています。この旅は8/29に神津島へ入り、8/30に新島へ移る順番で決定。線はルートを示すもので、予約済みの意味ではありません。</p>
          <ul>
            <li><b>大島</b><span>東京に近く、到着日から火山を歩ける。</span></li>
            <li><b>新島</b><span>大島から南へ。自転車の速度で白い海岸をつなぐ。</span></li>
            <li><b>神津島</b><span>さらに南へ。調布からは飛行機で約45分の案内。</span></li>
          </ul>
        </div>
        <div className={styles.overviewMap}>
          <IslandMap center={[34.82, 139.36]} zoom={8} points={overviewPoints} routes={overviewRoutes} label="東京・神津島・新島の旅程と大島の位置" tone="dark" />
        </div>
      </section>

      <section className={styles.chooseSection}>
        <div className={styles.chooseTitle}>
          <p>READ THE ISLANDS</p>
          <h2>この旅の二島と、次に読みたい大島</h2>
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
          <h2>決まった順番で、空席と宿を探す</h2>
          <p>時刻と運賃は公式情報で確認しました。次は2人分の空席と、神津島1泊・新島2泊の宿を照合します。</p>
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
        <blockquote>まず、今回行く神津島と新島を読む。<br />大島は、次の週末のために取っておく。</blockquote>
        <div>
          <p>このマガジンは、島で何をするか考える場所。採用した予定、交通費、経費、領収書は「俺たちの予定」で一つに管理します。</p>
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
