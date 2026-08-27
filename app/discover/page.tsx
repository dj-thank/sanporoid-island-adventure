/* eslint-disable @next/next/no-html-link-for-pages -- vinext Link navigation crashes at runtime; hard navigation is intentional. */
import type { Metadata } from "next";
import Image from "next/image";
import IslandMap from "./IslandMap";
import { islandDossiers } from "./island-dossiers";
import {
  bookingLinks,
  campReadiness,
  campReadinessBySlug,
  islands,
  islandsBySlug,
  overviewPoints,
  overviewRoutes,
  type Photo,
} from "./island-data";
import styles from "./discover.module.css";

export const metadata: Metadata = {
  title: "東海汽船で行く8島｜テント3泊の島選びと島の大特集",
  description: "大島、利島、新島、式根島、神津島、三宅島、御蔵島、八丈島を、歴史・火山・文化・キャンプ・レンタカー・航路から比較する島旅マガジン。",
};

function Credit({ photo }: { photo: Photo }) {
  return <a className={styles.photoCredit} href={photo.creditUrl} target="_blank" rel="noreferrer">{photo.credit}</a>;
}

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer"><span>{children}</span><b aria-hidden="true">↗</b></a>;
}

const northRoute = ["oshima", "toshima", "niijima", "shikinejima", "kozushima"] as const;
const southRoute = ["miyakejima", "mikurajima", "hachijojima"] as const;
const routeCandidate = ["kozushima", "niijima", "shikinejima"] as const;

export default function DiscoverPage() {
  const kozushima = islandsBySlug.kozushima;
  const niijima = islandsBySlug.niijima;
  const shikinejima = islandsBySlug.shikinejima;

  return (
    <main className={styles.magazine}>
      <header className={styles.masthead}>
        <a className={styles.wordmark} href="/discover"><span>OPENClOS</span><strong>ISLAND WEEKEND</strong></a>
        <nav aria-label="島旅マガジン">
          <a href="#camp-check">テント条件</a>
          <a href="#island-library">8島を読む</a>
          <a href="#map">旅程地図</a>
          <a href="#booking">次に取る</a>
        </nav>
        <a className={styles.ssotNav} href="/">俺たちの予定</a>
      </header>

      <section className={styles.coverStory}>
        <div className={styles.coverIntro}>
          <div className={styles.issueLine}><span>FIELD JOURNAL 003</span><span>ALL 8 TOKAI KISEN ISLANDS</span></div>
          <p className={styles.coverKicker}>3 ISLANDS / KOZUSHIMA CAMP + NIIJIMA 2 NIGHTS</p>
          <h1><span>三晩とも、</span><span>島で眠る。</span></h1>
          <p className={styles.coverDeck}>8月29日に神津島へ入り、新島に二晩泊まる。8月31日は連絡船にしきで式根島を日帰り冒険して、新島へ戻ります。神津島のキャンプ場だけ朝のBot確認待ちです。</p>
          <div className={styles.coverActions}>
            <a href="#camp-check">8島の成立条件を見る</a>
            <a href="#island-library">島の記事から選ぶ</a>
          </div>
        </div>

        <div className={styles.coverMosaic} aria-label="今回の三島候補の実景">
          <div className={styles.coverKozu}>
            <a className={styles.coverLink} href="/discover/kozushima">
              <Image src={kozushima.hero.src} alt={kozushima.hero.alt} fill sizes="(max-width: 820px) 100vw, 58vw" priority />
              <div><small>DAY 1 / TENT</small><strong>神津島</strong><span>多幸湾・天上山・星空</span></div>
            </a><Credit photo={kozushima.hero} />
          </div>
          <div className={styles.coverOshima}>
            <a className={styles.coverLink} href="/discover/shikinejima">
              <Image src={shikinejima.hero.src} alt={shikinejima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>DAY 3 / DAY TRIP</small><strong>式根島</strong></div>
            </a><Credit photo={shikinejima.hero} />
          </div>
          <div className={styles.coverNiijima}>
            <a className={styles.coverLink} href="/discover/niijima">
              <Image src={niijima.hero.src} alt={niijima.hero.alt} fill sizes="(max-width: 560px) 100vw, 29vw" />
              <div><small>DAY 2 / TENT</small><strong>新島</strong></div>
            </a><Credit photo={niijima.hero} />
          </div>
        </div>
      </section>

      <section className={styles.truthStrip} aria-labelledby="truth-title">
        <div><span className={styles.truthLight} /><p><small>CURRENT TRUTH / SSOT</small><strong id="truth-title">島順と宿泊地は決定、神津キャンプ確認中</strong></p></div>
        <p>島順は<strong>神津島 → 新島 → 式根島</strong>。宿泊は<strong>神津島 → 新島 → 新島</strong>です。式根島は日帰りし、野営しません。</p>
        <a href="/">予約前の作業表へ <b aria-hidden="true">→</b></a>
      </section>

      <section className={styles.campMatrixSection} id="camp-check" aria-labelledby="camp-check-title">
        <header>
          <div className={styles.sectionIndex}><span>00</span><p>FEASIBILITY FIRST</p></div>
          <div><p className={styles.eyebrow}>OFFICIAL CAMP + CAR CHECK</p><h2 id="camp-check-title">魅力の前に、泊まれるかを見る</h2></div>
          <p>「テント可」と「野宿できる」は別です。指定施設の営業、予約方法、車の有無を自治体・観光協会の現行案内で切り分けました。</p>
        </header>
        <div className={styles.campMatrix}>
          {campReadiness.map((item) => {
            const island = islandsBySlug[item.slug];
            return (
              <article className={styles[`campMatrix_${item.status.replace("-", "_")}`]} key={item.slug}>
                <a className={styles.campMatrixIsland} href={`/discover/${item.slug}`}>
                  <small>{island.order} / {island.english}</small><strong>{island.name}</strong><span>{item.badge}</span>
                </a>
                <div><small>VERDICT</small><strong>{item.verdict}</strong></div>
                <a href={item.campUrl} target="_blank" rel="noreferrer"><small>CAMP</small><strong>{item.campground}</strong><p>{item.campRule}</p></a>
                <a href={item.carUrl} target="_blank" rel="noreferrer"><small>CAR</small><strong>{item.car}</strong><p>{item.carRule}</p></a>
              </article>
            );
          })}
        </div>
        <aside className={styles.campDecisionNote}>
          <strong>今回の足切り</strong>
          <p>利島はキャンプ禁止・レンタカーなし。式根島の野営場は2026年度も継続閉場しているため、今回は連絡船にしきで日帰りします。御蔵島はキャンプ禁止で宿予約なしの上陸も不可です。</p>
          <ExternalLink href="https://www.tokaikisen.co.jp/cargo/">車は島ごとに借りる理由</ExternalLink>
        </aside>
      </section>

      <section className={styles.mapSection} id="map">
        <div className={styles.sectionIndex}><span>01</span><p>THE WORKING ROUTE</p></div>
        <div className={styles.mapCopy}>
          <p className={styles.eyebrow}>AUG 29 — SEP 1 / 2026</p>
          <h2>南から北へ、一晩ずつ</h2>
          <p>8/31は新島村の連絡船にしきで新島8:20発、式根島16:00発の日帰り。9/1は東海汽船2430便で新島14:10→東京17:00が時刻表上の第一候補です。空席と当日運航は未確認です。</p>
          <ul>
            <li><b>8/29 神津島</b><span>東京7:25 → 10:35。多幸湾で1泊目。</span></li>
            <li><b>8/30 新島</b><span>神津13:25 → 新島14:05。羽伏浦で2泊目。</span></li>
            <li><b>8/31 式根島</b><span>新島8:20 → 式根島。16:00発で新島へ戻り、確保済みの宿泊先で3泊目。</span></li>
            <li><b>9/1 東京</b><span>新島14:10 → 東京17:00。空席と当日運航を確認。</span></li>
          </ul>
        </div>
        <div className={styles.overviewMap}><IslandMap center={[34.42, 139.24]} zoom={9} points={overviewPoints} routes={overviewRoutes} label="神津島泊・新島2泊・式根島日帰りの3泊4日旅" tone="dark" /></div>
      </section>

      <section className={styles.operationStrip} aria-label="客船運休日と車の扱い">
        <article><small>8/31 OUT</small><strong>新島8:20 → 式根島</strong><p>連絡船にしき夏期第1便。予約不要、運航情報は当日確認。</p></article>
        <article><small>8/31 BACK</small><strong>式根島16:00 → 新島</strong><p>連絡船にしき夏期第3便で戻り、新島に宿泊。</p></article>
        <article><small>9/1</small><strong>新島14:10 → 東京17:00</strong><p>東海汽船2430便が時刻表上の第一候補。</p></article>
        <article><small>GEAR</small><strong>ジェット船は装備に制約</strong><p>受託手荷物なし。ワゴン不可など、テント一式を規定内へ収める。</p></article>
      </section>

      <section className={styles.allIslandLibrary} id="island-library" aria-labelledby="island-library-title">
        <header>
          <div className={styles.sectionIndex}><span>02</span><p>ALL ISLAND FILES</p></div>
          <div><p className={styles.eyebrow}>HISTORY / GEOLOGY / CULTURE / FIELD MAP</p><h2 id="island-library-title">東海汽船の8島を、漏れなく読む</h2></div>
          <p>北航路5島、南航路3島。面積や名所だけでなく、火山、海運、信仰、産業、上陸ルールまで、現地で景色の理由が分かる記事にしました。</p>
        </header>

        <div className={styles.routeBand}><span>NORTH ROUTE / 5 ISLANDS</span><p>東京 — 大島 — 利島 — 新島 — 式根島 — 神津島</p></div>
        <div className={styles.allIslandGrid}>
          {northRoute.map((slug) => <IslandCard slug={slug} key={slug} />)}
        </div>
        <div className={styles.routeBand}><span>SOUTH ROUTE / 3 ISLANDS</span><p>東京 — 三宅島 — 御蔵島 — 八丈島</p></div>
        <div className={`${styles.allIslandGrid} ${styles.allIslandGridSouth}`}>
          {southRoute.map((slug) => <IslandCard slug={slug} key={slug} />)}
        </div>
      </section>

      <section className={styles.chooseSection}>
        <div className={styles.chooseTitle}><p>COMPARE ALL 8</p><h2>今回の条件と、島そのものの性格</h2></div>
        <div className={styles.compareTable} role="table" aria-label="東海汽船8島の比較">
          <div className={styles.compareHead} role="row"><span role="columnheader">島</span><span role="columnheader">何が面白い</span><span role="columnheader">旅の速度</span><span role="columnheader">島内移動</span><span role="columnheader">テント3泊との相性</span></div>
          {[...islands].sort((a, b) => a.order.localeCompare(b.order)).map((island) => {
            const camp = campReadinessBySlug[island.slug];
            return <a className={styles.compareRow} href={`/discover/${island.slug}`} key={island.slug} role="row">
              <span className={styles.compareName} role="cell"><small>{island.order}</small><strong>{island.name}</strong><em>{island.english}</em></span>
              <span role="cell">{island.fit[0].value}</span><span role="cell">{island.fit[1].value}</span><span role="cell">{island.fit[2].value}</span><span role="cell">{camp.verdict}<b aria-hidden="true">→</b></span>
            </a>;
          })}
        </div>
      </section>

      <section className={styles.dossierPortal} aria-labelledby="deep-files-title">
        <header>
          <div className={styles.sectionIndex}><span>03</span><p>LONG READS</p></div>
          <div><p className={styles.eyebrow}>THE DEEP FILES</p><h2 id="deep-files-title">まず熱く読むなら、神津島と新島</h2></div>
          <p>神津島は水配り伝説と黒曜石、新島は流人史とコーガ石。今回の先頭二島だけは、年表と雑学まで踏み込む長編も用意しました。</p>
        </header>
        <nav className={styles.dossierPortalTabs} aria-label="長編特集を選ぶ">
          {routeCandidate.slice(0, 2).map((slug, index) => {
            const island = islandsBySlug[slug];
            const dossier = islandDossiers[slug];
            return <article key={slug}>
              <a href={`/discover/${slug}#about`}>
                <Image src={dossier.portrait.src} alt={dossier.portrait.alt} fill sizes="(max-width: 820px) 100vw, 50vw" />
                <span className={styles.dossierPortalShade} />
                <div className={styles.dossierPortalTop}><small>0{index + 1} / DEEP DOSSIER</small><b>OPEN FEATURE ↗</b></div>
                <div className={styles.dossierPortalCopy}><p>{island.english}</p><h3>{island.name}</h3><strong>{dossier.tabLine}</strong><span>{dossier.atlas.slice(0, 3).map((fact) => `${fact.value} ${fact.label}`).join(" / ")}</span></div>
              </a><Credit photo={dossier.portrait} />
            </article>;
          })}
        </nav>
      </section>

      <section className={styles.bookingSection} id="booking">
        <div className={styles.bookingIntro}>
          <div className={styles.sectionIndex}><span>04</span><p>BOOKING DESK</p></div>
          <p className={styles.eyebrow}>NEXT ACTIONS</p>
          <h2>神津キャンプの朝確認から</h2>
          <p>新島の宿泊先は確保済みです。残る最重要ゲートは、朝Botが確認する神津島のキャンプ場と、各船の当日運航・空席です。</p>
        </div>
        <div className={styles.bookingList}>
          {bookingLinks.map((item) => <ExternalLink className={styles.bookingRow} href={item.url} key={item.index}><small>{item.index}</small><strong>{item.title}</strong><p>{item.detail}</p><em>{item.status}</em></ExternalLink>)}
        </div>
        <p className={styles.bookingNote}>まだ予約・購入はしていません。予約枠、車両在庫、船の空席、発着港は旅行日を指定して確認します。キャンプの決定と、オートキャンプ可否の確認は別です。</p>
      </section>

      <section className={styles.editorNote}>
        <p>EDITOR&apos;S NOTE</p>
        <blockquote>三島を選ぶために、<br />八島をちゃんと知る。</blockquote>
        <div><p>条件で落ちた島も、つまらない島ではありません。今回は「三晩テント＋車」に合わないだけ。島の記事は次の旅の引き出しとして残し、現在の予定とは明確に分けて運用します。</p><div><a href="/">俺たちの予定へ</a><ExternalLink href="https://discord.com/channels/1535960563140796476/1535960564059213947">DiscordでOpenClosに相談</ExternalLink></div></div>
      </section>

      <footer className={styles.footer}>
        <div><span>OPENClOS</span><strong>ISLAND WEEKEND</strong></div>
        <nav aria-label="公式情報"><ExternalLink href="https://www.tokaikisen.co.jp/boarding/timetable/">東海汽船 時刻表</ExternalLink><ExternalLink href="https://www.tokaikisen.co.jp/schedule/">当日の運航</ExternalLink><ExternalLink href="https://www.tokyo-islands.com/">東京宝島</ExternalLink></nav>
        <p>公式情報を2026年8月12日に確認して編集。営業、予約、海況、火山、道路、発着港は出発前と当日の案内が優先です。</p>
      </footer>
    </main>
  );
}

function IslandCard({ slug }: { slug: keyof typeof islandsBySlug }) {
  const island = islandsBySlug[slug];
  const camp = campReadinessBySlug[slug];
  return (
    <article className={styles.allIslandCard}>
      <a href={`/discover/${slug}`}>
        <figure><Image src={island.cover.src} alt={island.cover.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 33vw" /></figure>
        <div><span>{island.order} / {island.english}</span><h3>{island.name}</h3><strong>{island.coverLine}</strong><p>{island.shortIntro}</p><small>{camp.badge} — {camp.verdict}</small><b>特集を読む →</b></div>
      </a>
      <Credit photo={island.cover} />
    </article>
  );
}
