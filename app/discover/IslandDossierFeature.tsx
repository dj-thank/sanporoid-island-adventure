import Image from "next/image";
import { islandDossiers, type DossierSource, type IslandDossier } from "./island-dossiers";
import type { Island, Photo } from "./island-data";
import styles from "./discover.module.css";

function Credit({ photo }: { photo: Photo }) {
  return (
    <a className={styles.photoCredit} href={photo.creditUrl} target="_blank" rel="noreferrer">
      {photo.credit}
    </a>
  );
}

function SourceLinks({ sources }: { sources: DossierSource[] }) {
  return (
    <div className={styles.dossierSourceLinks} aria-label="この章の出典">
      {sources.map((source) => (
        <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
          <span>{source.label}</span><b aria-hidden="true">↗</b>
        </a>
      ))}
    </div>
  );
}

export default function IslandDossierFeature({ island, dossier }: { island: Island; dossier: IslandDossier }) {
  const tabs = [islandDossiers.kozushima, islandDossiers.niijima];

  return (
    <>
      <nav className={styles.dossierTabs} aria-label="神津島と新島の大型特集">
        <div className={styles.dossierTabLabel}>
          <small>THE BIG ISLAND FILE</small>
          <strong>島を知る</strong>
          <span>神津島と新島</span>
        </div>
        {tabs.map((tab, index) => {
          const active = tab.slug === island.slug;
          return (
            <a className={active ? styles.dossierTabActive : ""} href={`/discover/${tab.slug}#about`} aria-current={active ? "page" : undefined} key={tab.slug}>
              <small>{String(index + 1).padStart(2, "0")} / ISLAND</small>
              <strong>{tab.slug === "kozushima" ? "神津島" : "新島"}</strong>
              <span>{tab.tabLine}</span>
              <b aria-hidden="true">{active ? "READING" : "→"}</b>
            </a>
          );
        })}
      </nav>

      <section className={styles.dossierOpening} id="about" aria-labelledby="dossier-title">
        <div className={styles.dossierOpeningCopy}>
          <p className={styles.eyebrow}>ISLAND DOSSIER / {island.english}</p>
          <h2 id="dossier-title">{dossier.headline}</h2>
          <p>{dossier.lead}</p>
          <div className={styles.dossierReadingRoute}>
            <span>READING ROUTE</span>
            <a href="#history">成り立ちと歴史</a>
            <a href="#chronology">年表</a>
            <a href="#trivia">雑学</a>
            <a href="#field-notes">現地で確かめる</a>
          </div>
        </div>
        <figure className={styles.dossierPortrait}>
          <Image src={dossier.portrait.src} alt={dossier.portrait.alt} fill sizes="(max-width: 820px) 100vw, 46vw" />
          <Credit photo={dossier.portrait} />
          <figcaption><span>FIELD FILE</span><strong>{island.name}</strong><small>地質・歴史・暮らしを読む</small></figcaption>
        </figure>
        <div className={styles.dossierAtlas} aria-label={`${island.name}の大きさと基本データ`}>
          {dossier.atlas.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
              <small>{fact.note}</small>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.dossierChapters} id="history" aria-labelledby="history-title">
        <header className={styles.dossierSectionHead}>
          <div className={styles.sectionIndex}><span>01</span><p>READ THE ISLAND</p></div>
          <div>
            <p className={styles.eyebrow}>GEOLOGY / HISTORY / CULTURE</p>
            <h2 id="history-title">景色の理由を、足元からたどる</h2>
          </div>
          <p>場所の紹介だけでは見えない、島の成り立ちと暮らしの関係を四つの章で読む。各章の末尾から公的資料を開けます。</p>
        </header>

        <div className={styles.dossierChapterList}>
          {dossier.chapters.map((chapter, index) => (
            <article className={`${styles.dossierChapter} ${index % 2 === 1 ? styles.dossierChapterReverse : ""}`} key={chapter.number}>
              <figure>
                <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(max-width: 820px) 100vw, 50vw" />
                <Credit photo={chapter.image} />
                <figcaption>{chapter.caption}</figcaption>
              </figure>
              <div className={styles.dossierChapterCopy}>
                <span className={styles.dossierChapterNumber}>{chapter.number}</span>
                <p className={styles.eyebrow}>{chapter.eyebrow}</p>
                <h3>{chapter.title}</h3>
                {chapter.copy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <SourceLinks sources={chapter.sources} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.dossierChronology} id="chronology" aria-labelledby="chronology-title">
        <header>
          <p className={styles.eyebrow}>CHRONOLOGY</p>
          <h2 id="chronology-title">{island.name}をつくった出来事</h2>
          <p>年代の分かる出来事だけを選び、伝承や推定年代とは分けて並べました。</p>
        </header>
        <ol>
          {dossier.timeline.map((item) => (
            <li key={`${item.year}-${item.title}`}>
              <time>{item.year}</time>
              <div><strong>{item.title}</strong><p>{item.copy}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.dossierTrivia} id="trivia" aria-labelledby="trivia-title">
        <header>
          <div className={styles.sectionIndex}><span>03</span><p>FACT CHECK</p></div>
          <div><p className={styles.eyebrow}>ISLAND TRIVIA</p><h2 id="trivia-title">知っているようで、間違えやすいこと</h2></div>
        </header>
        <div className={styles.dossierTriviaGrid}>
          {dossier.trivia.map((item, index) => (
            <article key={item.question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.dossierFieldNotes} id="field-notes" aria-labelledby="field-notes-title">
        <header>
          <p className={styles.eyebrow}>FIELD NOTES</p>
          <h2 id="field-notes-title">現地では、この順で確かめる</h2>
          <p>記事を読んで終わらせず、島で見つけられる手がかりへつなぎます。営業、立入、天候は当日の案内を優先してください。</p>
        </header>
        <ol className={styles.dossierFieldList}>
          {dossier.fieldNotes.map((note, index) => (
            <li key={note.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{note.label}</small>
              <strong>{note.title}</strong>
              <p>{note.copy}</p>
            </li>
          ))}
        </ol>
        <div className={styles.dossierSources}>
          <div><small>SOURCES / CHECKED 2026.08.12</small><strong>数字と歴史の出典</strong></div>
          <SourceLinks sources={dossier.sources} />
          <p>人口・面積は資料ごとに基準年や集計範囲が異なります。この特集では各カードに基準を併記しました。交通、施設営業、登山道、海況は変動するため、出発前と当日に公式情報を再確認します。</p>
        </div>
      </section>
    </>
  );
}
