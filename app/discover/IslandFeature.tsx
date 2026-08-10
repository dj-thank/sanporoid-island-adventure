/* eslint-disable @next/next/no-html-link-for-pages -- vinext Link navigation crashes at runtime; hard navigation is intentional. */
import Image from "next/image";
import IslandMap from "./IslandMap";
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

  return (
    <main className={`${styles.magazine} ${styles.featurePage} ${styles[`${island.slug}Theme`]}`}>
      <header className={`${styles.masthead} ${styles.featureMasthead}`}>
        <a className={styles.wordmark} href="/discover">
          <span>OPENClOS</span>
          <strong>ISLAND WEEKEND</strong>
        </a>
        <nav aria-label="特集内ナビゲーション">
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
            <a href="#plan">旅の組み方を見る</a>
            <a href="#map">地図から読む</a>
          </div>
        </div>
        <Credit photo={island.hero} />
      </section>

      <section className={styles.featureFactStrip} aria-label={`${island.name}の基本情報`}>
        {island.facts.map((fact) => (
          <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>
        ))}
      </section>

      <section className={styles.featureOpening}>
        <div className={styles.sectionIndex}><span>00</span><p>WHY THIS ISLAND</p></div>
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
          <p className={styles.eyebrow}>01 / START HERE</p>
          <h2 id="planning-title">まず決めるのは、<br />宿と帰り道。</h2>
          <p>島では天気や海況が予定を変える。細かな時刻を埋める前に、滞在の基地、時間帯の骨格、往復の選択肢を押さえる。</p>
        </div>
        <div className={styles.planningActions}>
          <a className={styles.planningAction} href={island.stays[0].url} target="_blank" rel="noreferrer">
            <small>01 / STAY</small>
            <strong>宿を先に押さえる</strong>
            <p>{island.stays[0].copy}</p>
            <em>{island.stays[0].cta}</em>
          </a>
          <a className={styles.planningAction} href="#conditions">
            <small>02 / CONDITIONS</small>
            <strong>天気で組み替える</strong>
            <p>晴れ、強風、雨。現地の条件から選べる三つの旅にして、予定を壊さず入れ替える。</p>
            <em>条件別プランへ</em>
          </a>
          <a className={styles.planningAction} href="#route">
            <small>03 / ROUTE</small>
            <strong>{tripShape}の骨格を見る</strong>
            <p>晴れ・風・海況に合わせて、同じ日の中で入れ替えられる旅程にする。</p>
            <em>旅程へ進む</em>
          </a>
          <a className={styles.planningAction} href="#access">
            <small>04 / ACCESS</small>
            <strong>往復を比較する</strong>
            <p>船と飛行機の行きだけでなく、帰りの便と変更余地まで同時に確認する。</p>
            <em>交通を確認</em>
          </a>
        </div>
      </section>

      <section className={styles.conditionSection} id="conditions" aria-labelledby="conditions-title">
        <header className={styles.conditionHead}>
          <div className={styles.sectionIndex}><span>02</span><p>IF / THEN</p></div>
          <div>
            <p className={styles.eyebrow}>THE PLAN CHANGES. THE TRIP CONTINUES.</p>
            <h2 id="conditions-title">晴れだけを、<br />前提にしない。</h2>
          </div>
          <p>島の予定は固定表ではなく、条件で選ぶ三枚のカード。朝の風、雲、海、運航を見て、その日に成立する一枚へ切り替える。</p>
        </header>
        <div className={styles.conditionGrid}>
          {island.conditionPlans.map((plan, index) => (
            <article className={styles.conditionCard} key={plan.label}>
              <header><span>{String(index + 1).padStart(2, "0")}</span><small>{plan.label}</small></header>
              <h3>{plan.title}</h3>
              <p>{plan.lead}</p>
              <ol>{plan.steps.map((step) => <li key={step}>{step}</li>)}</ol>
              <aside><small>SWITCH NOTE</small>{plan.note}</aside>
              <ExternalLink className={styles.conditionSource} href={plan.sourceUrl}>{plan.sourceLabel}</ExternalLink>
            </article>
          ))}
        </div>
        <div className={styles.friendMissions}>
          <header>
            <p className={styles.eyebrow}>FRIENDS ONLY / THREE SMALL MISSIONS</p>
            <h2>友達と行くなら、<br />観光をゲームにする。</h2>
            <p>全員が同じものを見る必要はない。役割と遊びを一つだけ決めると、自由時間まで同じ旅になる。</p>
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
            <p className={styles.eyebrow}>SPOTS BEFORE SCHEDULES</p>
            <h2>まず、島の形を<br />頭に入れる。</h2>
          </div>
          <p>点を押すと場所の役割が見える。予定表より先に距離と方角を掴み、同じ側にある場所を一つの時間帯へまとめる。</p>
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
          <div className={styles.sectionIndex}><span>04</span><p>LONG READ</p></div>
          <p className={styles.eyebrow}>THE ISLAND, ONE SCENE AT A TIME</p>
          <h2>{island.name}を、<br />景色の順番で読む。</h2>
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
              <aside><small>FIELD NOTE</small>{chapter.note}</aside>
              <ExternalLink className={styles.sourceLink} href={chapter.sourceUrl}>{chapter.sourceLabel}</ExternalLink>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.routeSection} id="route">
        <div className={styles.routeIntro}>
          <div className={styles.sectionIndex}><span>05</span><p>ROUTE</p></div>
          <p className={styles.eyebrow}>A PLAN THAT CAN BEND</p>
          <h2>こう回る。<br />ただし、島に従う。</h2>
          <p>時刻表ではなく、時間帯の骨格。天気・風・海況・運航が変わったら、同じ日の中で順番を入れ替える。</p>
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
        <p className={styles.routeDisclaimer}>これは提案用の骨格です。具体的な船便・営業・予約が確定するまで、SSOTの採用済み予定には入りません。</p>
      </section>

      <section className={styles.foodStaySection} id="food">
        <div className={styles.foodColumn}>
          <div className={styles.sectionIndex}><span>06</span><p>EAT</p></div>
          <p className={styles.eyebrow}>TASTE THE CONDITION</p>
          <h2>食べるものも、<br />その日の島で決める。</h2>
          <div className={styles.foodList}>
            {island.food.map((item, index) => (
              <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>
            ))}
          </div>
        </div>
        <div className={styles.stayColumn}>
          <div className={styles.sectionIndex}><span>07</span><p>SLEEP</p></div>
          <p className={styles.eyebrow}>THE BASE CHANGES THE TRIP</p>
          <h2>宿を、旅の基地として選ぶ。</h2>
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
          <p className={styles.eyebrow}>GET THERE, GET BACK</p>
          <h2>行き方より先に、<br />帰り方も見る。</h2>
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
          <div><p>BEFORE YOU GO</p><h3>島で困らないための<br />フィールドルール</h3></div>
          <ol>{island.rules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
        </div>
      </section>

      <section className={styles.officialSection}>
        <div><p>{`PRIMARY SOURCES / FACT CHECKED ${island.verifiedAt}`}</p><h2>最後は、公式情報へ。</h2></div>
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
