/* eslint-disable @next/next/no-html-link-for-pages -- vinext Link navigation crashes at runtime; hard navigation is intentional. */
import Image from "next/image";
import IslandDossierFeature from "./IslandDossierFeature";
import IslandMap from "./IslandMap";
import { islandDossiers } from "./island-dossiers";
import { islands, type Island, type Photo } from "./island-data";
import styles from "./discover.module.css";

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

export default function IslandFeature({ island }: { island: Island }) {
  const others = islands.filter((candidate) => candidate.slug !== island.slug);
  const tripShape = island.itinerary.length === 3 ? "2泊3日" : "1泊2日";
  const dossier = island.slug === "kozushima" || island.slug === "niijima" ? islandDossiers[island.slug] : null;

  return (
    <main className={`${styles.magazine} ${styles.featurePage} ${styles[`${island.slug}Theme`]}`}>
      <header className={`${styles.masthead} ${styles.featureMasthead}`}>
        <a className={styles.wordmark} href="/discover">
          <span>OPENClOS</span>
          <strong>ISLAND WEEKEND</strong>
        </a>
        <nav aria-label="特集内ナビゲーション">
          {dossier && <a className={styles.dossierNavLink} href="#about">島を知る</a>}
          <a href="#map">地図</a>
          <a href="#conditions">天気別</a>
          <a href="#stories">見どころ</a>
          <a href="#route">旅程</a>
          <a href="#food">宿・食</a>
          <a href="#access">交通</a>
        </nav>
        <a className={styles.ssotNav} href="/">俺たちの予定</a>
      </header>

      <section className={styles.featureHero}>
        <Image src={island.hero.src} alt={island.hero.alt} fill sizes="100vw" priority />
        <div className={styles.featureHeroShade} />
        <div className={styles.featureHeroTop}>
          <span>ISLAND FILE {island.order}</span>
          <span>IZU ISLANDS / TOKYO</span>
        </div>
        <div className={styles.featureHeroCopy}>
          <p>{island.english}</p>
          <h1>{island.name}</h1>
          <strong>{island.coverLine}</strong>
        </div>
        <div className={styles.featureHeroBottom}>
          <p>{island.oneLine}</p>
          <div className={styles.featureHeroActions}>
            <a href={dossier ? "#about" : "#plan"}>{dossier ? "島の歴史から読む" : "最初に決めること"}</a>
            <a href="#map">スポット地図を見る</a>
          </div>
        </div>
        <Credit photo={island.hero} />
      </section>

      <section className={styles.featureFactStrip} aria-label={`${island.name}の基本情報`}>
        {island.facts.map((fact) => (
          <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>
        ))}
      </section>

      {dossier && <IslandDossierFeature island={island} dossier={dossier} />}

      <section className={styles.featureOpening}>
        <div className={styles.sectionIndex}><span>00</span><p>TRIP PROFILE</p></div>
        <blockquote>{island.shortIntro}</blockquote>
        <div>
          <p>{island.longIntro}</p>
          <dl>
            {island.fit.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className={styles.planningPanel} id="plan" aria-labelledby="planning-title">
        <div className={styles.planningIntro}>
          <p className={styles.eyebrow}>01 / PLAN</p>
          <h2 id="planning-title">{island.sectionTitles.plan}</h2>
          <p>島旅は宿と復路が決まると組みやすい。次に朝・昼・夜の大枠を置き、天気や海況に合わせて立ち寄り先を選ぶ。</p>
        </div>
        <div className={styles.planningActions}>
          <a className={styles.planningAction} href={island.stays[0].url} target="_blank" rel="noreferrer">
            <small>01 / STAY</small>
            <strong>宿の空きを確認する</strong>
            <p>{island.stays[0].copy}</p>
            <em>{island.stays[0].cta}</em>
          </a>
          <a className={styles.planningAction} href="#conditions">
            <small>02 / CONDITIONS</small>
            <strong>天気別の候補を持つ</strong>
            <p>晴れ、強風、雨の3案を用意し、朝の状況に合う行程を選ぶ。</p>
            <em>条件別プランへ</em>
          </a>
          <a className={styles.planningAction} href="#route">
            <small>03 / ROUTE</small>
            <strong>{tripShape}の流れを見る</strong>
            <p>移動時間を詰め込みすぎず、同じ方面の場所をまとめて回る。</p>
            <em>旅程へ進む</em>
          </a>
          <a className={styles.planningAction} href="#access">
            <small>04 / ACCESS</small>
            <strong>行きと帰りを比べる</strong>
            <p>船と飛行機の便を往復で調べ、欠航した場合の戻り方も確認する。</p>
            <em>交通を確認</em>
          </a>
        </div>
      </section>

      <section className={styles.conditionSection} id="conditions" aria-labelledby="conditions-title">
        <header className={styles.conditionHead}>
          <div className={styles.sectionIndex}><span>02</span><p>IF / THEN</p></div>
          <div>
            <p className={styles.eyebrow}>WEATHER OPTIONS</p>
            <h2 id="conditions-title">{island.sectionTitles.conditions}</h2>
          </div>
          <p>朝に天気、風、海況、運航を確認する。下の3案から、その日に無理なく動ける行程を選ぶ。</p>
        </header>
        <div className={styles.conditionGrid}>
          {island.conditionPlans.map((plan, index) => (
            <article className={styles.conditionCard} key={plan.label}>
              <header><span>{String(index + 1).padStart(2, "0")}</span><small>{plan.label}</small></header>
              <h3>{plan.title}</h3>
              <p>{plan.lead}</p>
              <ol>{plan.steps.map((step) => <li key={step}>{step}</li>)}</ol>
              <aside><small>変更時の確認</small>{plan.note}</aside>
              <ExternalLink className={styles.conditionSource} href={plan.sourceUrl}>{plan.sourceLabel}</ExternalLink>
            </article>
          ))}
        </div>
        <div className={styles.friendMissions}>
          <header>
            <p className={styles.eyebrow}>WITH FRIENDS</p>
            <h2>{island.sectionTitles.missions}</h2>
            <p>2人で同じ順路をこなすだけではもったいない。写真や店選びを少し分担すると、あとで話せる出来事が増える。</p>
          </header>
          <div className={styles.missionGrid}>
            {island.friendMissions.map((mission) => (
              <article key={mission.number}>
                <span>{mission.number}</span>
                <h3>{mission.title}</h3>
                <p>{mission.copy}</p>
                <strong>{mission.payoff}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featureMapSection} id="map">
        <div className={styles.featureMapHead}>
          <div className={styles.sectionIndex}><span>03</span><p>FIELD MAP</p></div>
          <div>
            <p className={styles.eyebrow}>MAP</p>
            <h2>{island.sectionTitles.map}</h2>
          </div>
          <p>地図の点を押すと、各スポットの概要が開く。距離と方角を確認し、同じ方面の場所を同じ時間帯にまとめる。</p>
        </div>
        <div className={styles.featureMapGrid}>
          <IslandMap center={island.mapCenter} zoom={island.mapZoom} points={island.spots} label={`${island.name}のスポット地図`} />
          <ol className={styles.spotIndex}>
            {island.spots.map((spot, index) => (
              <li key={spot.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><small>{spot.label}</small><strong>{spot.title}</strong><p>{spot.summary}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.longRead} id="stories">
        <header>
          <div className={styles.sectionIndex}><span>04</span><p>PLACES</p></div>
          <p className={styles.eyebrow}>WHAT TO SEE</p>
          <h2>{island.sectionTitles.stories}</h2>
        </header>
        {island.chapters.map((chapter, index) => (
          <article className={`${styles.featureChapter} ${index % 2 === 1 ? styles.featureChapterReverse : ""}`} key={chapter.number}>
            <figure>
              <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(max-width: 820px) 100vw, 58vw" />
              <Credit photo={chapter.image} />
              <figcaption>{chapter.eyebrow}</figcaption>
            </figure>
            <div className={styles.chapterCopy}>
              <span>{chapter.number}</span>
              <p className={styles.eyebrow}>{chapter.eyebrow}</p>
              <h3>{chapter.title}</h3>
              {chapter.copy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <aside><small>現地で確認</small>{chapter.note}</aside>
              <ExternalLink className={styles.sourceLink} href={chapter.sourceUrl}>{chapter.sourceLabel}</ExternalLink>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.routeSection} id="route">
        <div className={styles.routeIntro}>
          <div className={styles.sectionIndex}><span>05</span><p>ROUTE</p></div>
          <p className={styles.eyebrow}>ITINERARY</p>
          <h2>{island.sectionTitles.route}</h2>
          <p>まずは時間帯ごとの流れを決める。天気、風、海況、運航が変わったら、近い場所どうしで順番を入れ替える。</p>
        </div>
        <div className={styles.dayRoutes}>
          {island.itinerary.map((day) => (
            <article key={day.day}>
              <header><span>{day.day}</span><h3>{day.theme}</h3></header>
              <ol>
                {day.items.map((item) => (
                  <li key={`${day.day}-${item.time}-${item.title}`}>
                    <time>{item.time}</time>
                    <div><strong>{item.title}</strong><p>{item.detail}</p></div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
        <p className={styles.routeDisclaimer}>この旅程は検討用です。船便、営業日、予約が決まった予定だけをSSOTへ反映します。</p>
      </section>

      <section className={styles.foodStaySection} id="food">
        <div className={styles.foodColumn}>
          <div className={styles.sectionIndex}><span>06</span><p>EAT</p></div>
          <p className={styles.eyebrow}>FOOD</p>
          <h2>{island.sectionTitles.food}</h2>
          <div className={styles.foodList}>
            {island.food.map((item, index) => (
              <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>
            ))}
          </div>
        </div>
        <div className={styles.stayColumn}>
          <div className={styles.sectionIndex}><span>07</span><p>SLEEP</p></div>
          <p className={styles.eyebrow}>STAY</p>
          <h2>{island.sectionTitles.stay}</h2>
          <div className={styles.stayList}>
            {island.stays.map((stay) => (
              <ExternalLink className={styles.stayItem} href={stay.url} key={`${stay.type}-${stay.title}`}>
                <small>{stay.type}</small><strong>{stay.title}</strong><p>{stay.copy}</p><em>{stay.cta}</em>
              </ExternalLink>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.accessSection} id="access">
        <div className={styles.accessTitle}>
          <div className={styles.sectionIndex}><span>08</span><p>ACCESS</p></div>
          <p className={styles.eyebrow}>ACCESS</p>
          <h2>{island.sectionTitles.access}</h2>
        </div>
        <div className={styles.accessRows}>
          {island.access.map((item, index) => (
            <a className={styles.accessRow} href={item.url} target="_blank" rel="noreferrer" key={item.route}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.route}</strong>
              <em>{item.time}</em>
              <p>{item.copy}</p>
              <b>公式で確認</b>
            </a>
          ))}
        </div>
        <div className={styles.fieldRules}>
          <div><p>BEFORE YOU GO</p><h3>出発前に確認すること</h3></div>
          <ol>{island.rules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
        </div>
      </section>

      <section className={styles.officialSection}>
        <div><p>{`OFFICIAL LINKS / CHECKED ${island.verifiedAt}`}</p><h2>予約前と出発当日に見る公式サイト</h2></div>
        <div className={styles.officialLinks}>
          {island.official.map((source) => <ExternalLink href={source.url} key={source.url}>{source.label}</ExternalLink>)}
        </div>
        <p>所要時間・運賃・運航・営業・遊泳・登山情報は変わります。予約前と当日に、公式ページと現地案内を再確認してください。</p>
      </section>

      <section className={styles.nextIslands}>
        <p>NEXT ISLAND</p>
        <div>
          {others.map((other) => (
            <a href={`/discover/${other.slug}`} key={other.slug}>
              <Image src={other.cover.src} alt="" fill sizes="(max-width: 560px) 100vw, 50vw" />
              <span><small>{other.english}</small><strong>{other.name}</strong><b aria-hidden="true">→</b></span>
            </a>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div><span>OPENClOS</span><strong>ISLAND WEEKEND</strong></div>
        <nav>
          <a href="/discover">三島特集トップ</a>
          <a href="/">俺たちの予定</a>
          <ExternalLink href="https://discord.com/channels/1535960563140796476/1535960564059213947">Discordで相談</ExternalLink>
        </nav>
        <p>Official information first. Weather, sea and local guidance always override this editorial plan.</p>
      </footer>
    </main>
  );
}
