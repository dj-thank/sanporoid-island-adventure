"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- vinext Link navigation crashes at runtime; hard navigation is intentional. */

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Trip = {
  id: number;
  title: string;
  concept: string;
  routeLabel: string;
  startDate: string;
  endDate: string;
  status: string;
  budgetMinYen: number;
  budgetMaxYen: number;
  updatedAt: string;
};

type Plan = {
  id: number;
  date: string;
  time: string;
  title: string;
  details: string;
  status: "proposed" | "adopted" | "rejected";
  source: string;
  sortOrder: number;
  costYen: number;
  createdBy: string;
  createdAt: string;
};

type Expense = {
  id: number;
  title: string;
  amountYen: number;
  payer: string;
  category: string;
  occurredOn: string;
  status: "draft" | "confirmed";
  source: string;
  createdBy: string;
  createdAt: string;
};

type Receipt = {
  id: number;
  filename: string;
  merchant: string;
  amountYen: number;
  ocrStatus: "pending" | "read" | "needs-review" | "confirmed";
  uploadedBy: string;
  createdAt: string;
};

type Activity = {
  id: number;
  kind: string;
  summary: string;
  actor: string;
  createdAt: string;
};

type Board = {
  trip: Trip;
  participants: Array<{ id: number; discordUserId: string; displayName: string }>;
  plans: Plan[];
  expenses: Expense[];
  receipts: Receipt[];
  activity: Activity[];
};

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });

const tripFrame = [
  { date: "8/29", time: "DAY 1", title: "本土から神津島へ", details: "神津島は2案に共通。船か飛行機か、到着時刻と宿を見て決める。", state: "共通" },
  { date: "8/30", time: "DAY 2", title: "神津島から、もう一つの島へ", details: "伊豆大島か新島へ移る想定。同日の接続が成立するかは未確認。", state: "選択" },
  { date: "8/31", time: "DAY 3", title: "第二の島で一日過ごす", details: "大島なら火山と温泉、新島なら海と自転車。どちらもこの日に宿泊する。", state: "選択" },
  { date: "9/1", time: "DAY 4", title: "東京へ戻る", details: "帰りの便が合わなければ9/2まで延ばす。復路と宿はまだ押さえていない。", state: "予備日あり" },
];

const routeOptionCopy = [
  {
    key: "oshima",
    match: "神津島＋伊豆大島",
    label: "案 A / 山と火山",
    title: "神津島のあと、大島へ",
    hook: "天上山から三原山へ。歩く旅を二つの島でつなぐ。",
    moments: ["三原山", "地層大切断面", "温泉", "元町で島ごはん"],
    unknown: "8/30の神津島→大島が同日でつながるか。大島の宿、復路、総額も確認が必要。",
    relatedMatch: "元町で島ごはん",
    href: "/discover/oshima",
  },
  {
    key: "niijima",
    match: "神津島＋新島",
    label: "案 B / 山と白い海",
    title: "神津島のあと、新島へ",
    hook: "天上山を歩いた次の日は、羽伏浦を自転車の速さで巡る。",
    moments: ["羽伏浦", "レンタサイクル", "新島ガラス", "まました温泉"],
    unknown: "8/30の神津島→新島が同日でつながるか。新島の宿、復路、総額も確認が必要。",
    relatedMatch: "まました温泉",
    href: "/discover/niijima",
  },
] as const;

async function readJson(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "更新できませんでした");
  return data;
}

type TripBoardProps = {
  viewer: { displayName: string } | null;
  signInPath: string;
  signOutPath: string;
};

export function TripBoard({ viewer, signInPath, signOutPath }: TripBoardProps) {
  const [board, setBoard] = useState<Board | null>(null);
  const [mode, setMode] = useState<"plan" | "expense" | "receipt">("plan");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (quiet = false) => {
    try {
      const response = await fetch("/api/trip", { cache: "no-store" });
      const data = await readJson(response);
      setBoard(data);
      if (!quiet) setError("");
    } catch (cause) {
      if (!quiet) setError(cause instanceof Error ? cause.message : "旅行データを読めませんでした");
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(true), 15000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [refresh]);

  const adopted = useMemo(() => board?.plans.filter((plan) => plan.status === "adopted") ?? [], [board]);
  const proposals = useMemo(() => board?.plans.filter((plan) => plan.status === "proposed") ?? [], [board]);
  const routeIdeas = useMemo(() => proposals.filter((plan) => routeOptionCopy.some((option) => plan.title.includes(option.match))), [proposals]);
  const attachedIdeas = useMemo(() => proposals.filter((plan) => routeOptionCopy.some((option) => plan.title.includes(option.relatedMatch))), [proposals]);
  const otherProposals = useMemo(() => proposals.filter((plan) => !routeIdeas.includes(plan) && !attachedIdeas.includes(plan)), [attachedIdeas, proposals, routeIdeas]);
  const shipTotal = adopted.reduce((total, plan) => total + Number(plan.costYen || 0), 0);
  const confirmedExpenses = board?.expenses.filter((expense) => expense.status === "confirmed") ?? [];
  const draftExpenses = board?.expenses.filter((expense) => expense.status === "draft") ?? [];
  const confirmedTotal = confirmedExpenses.reduce((total, expense) => total + Number(expense.amountYen), 0);
  const participantCount = Math.max(1, board?.participants.length ?? 1);
  const reconsidering = board?.trip.status === "reconsidering";
  const budgetPending = board?.trip.budgetMinYen === 0 && board?.trip.budgetMaxYen === 0;

  async function mutate(url: string, init: RequestInit) {
    setBusy(true);
    setError("");
    try {
      const data = await readJson(await fetch(url, init));
      if (data.board) setBoard(data.board);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "更新できませんでした");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function submitPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const saved = await mutate("/api/proposals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        date: data.get("date"),
        time: data.get("time"),
        details: data.get("details"),
        costYen: Number(data.get("costYen") || 0),
      }),
    });
    if (saved) form.reset();
  }

  async function submitExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const saved = await mutate("/api/expenses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        amountYen: Number(data.get("amountYen")),
        payer: data.get("payer"),
        category: data.get("category"),
        occurredOn: data.get("occurredOn"),
        status: data.get("confirmed") === "on" ? "confirmed" : "draft",
      }),
    });
    if (saved) form.reset();
  }

  async function submitReceipt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const saved = await mutate("/api/receipts", { method: "POST", body: new FormData(form) });
    if (saved) form.reset();
  }

  if (!board) {
    return (
      <main className="loading-screen">
        <div className="loading-mark">OC</div>
        <p>{error || "俺たちの予定を読み込んでいます…"}</p>
        {error && <button onClick={() => void refresh()}>もう一度</button>}
      </main>
    );
  }

  return (
    <main>
      <header className="hero">
        <nav className="eyebrow" aria-label="ページ情報">
          <span>OPENClOS · TRIP SSOT</span>
          <div className="eyebrow-actions">
            <a className="magazine-link" href="/discover">写真で島を知る ↗</a>
            <span className="updated">自動更新 · 15秒</span>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <div className="ssot-row">
              <span className="status status-plan">SINGLE SOURCE OF TRUTH</span>
              <span className="last-updated">最終更新 {formatDateTime(board.trip.updatedAt)}</span>
            </div>
            <p className="kicker">FRIENDS TRIP · {board.participants.length} PEOPLE · 3 NIGHTS</p>
            <h1>{board.trip.title}</h1>
            <p className="lead">{board.trip.concept}</p>
          </div>

          <aside className="decision-card" aria-label="現在の結論">
            <span className="status status-plan">{reconsidering ? "再調整中" : "採用中の仮案"}</span>
            <strong>{board.trip.routeLabel}</strong>
            <p>{shortDate(board.trip.startDate)} 出発 — {shortDate(board.trip.endDate)} 東京戻り · 9/2延長も予備案</p>
            <div className="people">
              {board.participants.map((person) => <span key={person.id}>{person.displayName}</span>)}
            </div>
            <a className="hero-action" href={reconsidering ? "#route-choice" : viewer ? "#add" : signInPath}>
              {reconsidering ? "2つの案を比べる" : viewer ? "サイトに追加する" : "ChatGPTでサインイン"}
            </a>
            <a className="hero-magazine-action" href="/discover">島旅マガジンを読む <span>→</span></a>
          </aside>
        </div>
      </header>

      <section className="quick-status" aria-label="旅行の進み具合">
        <div><span className="dot pending" /><p><small>現在</small>{reconsidering ? "ルートを再調整中" : `採用中 ${adopted.length}件`}</p></div>
        <div><span className="dot confirmed" /><p><small>共通</small>8/29に神津島へ</p></div>
        <div><span className="dot locked" /><p><small>未確認</small>島間接続・宿・料金</p></div>
      </section>

      <section className="section itinerary-section" aria-labelledby="itinerary-title">
        <div className="section-heading">
          <span>01</span>
          <div><p>OUR PLAN</p><h2 id="itinerary-title">俺たちの予定</h2></div>
          <span className="heading-note">島の組み合わせはまだ未採用</span>
        </div>
        <div className="timeline">
          {(reconsidering ? tripFrame : adopted).map((item, index) => (
            <article className="timeline-item" key={"id" in item ? item.id : item.date}>
              <div className="timeline-marker" aria-hidden="true"><span>{index + 1}</span></div>
              <p className="date">{item.date || "DATE TBD"}</p>
              <p className="time">{item.time || "時間未定"}</p>
              <div className="timeline-copy"><h3>{item.title}</h3><p>{item.details}</p></div>
              <span className="micro-status">{"state" in item ? item.state : item.source === "official" ? "公式確認済み" : "採用済み"}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section proposal-section" id="route-choice" aria-labelledby="proposal-title">
        <div className="section-heading">
          <span>02</span>
          <div><p>CHOOSE THE SECOND ISLAND</p><h2 id="proposal-title">第二の島、どっちにする？</h2></div>
        </div>
        <p className="choice-intro">神津島は共通。旅の性格が変わるのは、その次です。まだどちらも採用せず、まず8/30の接続が成立するかを確かめます。</p>
        <div className="route-choice-grid">
          {routeOptionCopy.map((option) => {
            const proposal = routeIdeas.find((idea) => idea.title.includes(option.match));
            const related = attachedIdeas.find((idea) => idea.title.includes(option.relatedMatch));
            return (
              <article className={`route-choice-card ${option.key}`} key={option.key}>
                <div className="route-choice-top"><span>{option.label}</span><small>未採用</small></div>
                <h3>{option.title}</h3>
                <p className="route-hook">{option.hook}</p>
                <div className="route-moments" aria-label="この案で楽しめること">
                  {option.moments.map((moment) => <span key={moment}>{moment}</span>)}
                </div>
                <p className="route-flow">{proposal?.details ?? "Discordの案を旅行ボードへ反映しています。"}</p>
                {related && <p className="route-side-idea"><strong>この案なら</strong>{related.title}。{related.details}</p>}
                <p className="route-unknown"><strong>先に確認</strong>{option.unknown}</p>
                <a href={option.href}>{option.key === "oshima" ? "大島" : "新島"}の記事を読む <span aria-hidden="true">→</span></a>
              </article>
            );
          })}
        </div>
        {otherProposals.length ? (
          <div className="proposal-followups">
            <h3>そのほかのアイデア</h3>
            <div className="proposal-grid">
              {otherProposals.map((proposal) => (
                <article className="proposal-card" key={proposal.id}>
                  <div><span>提案</span><small>{proposal.createdBy}</small></div>
                  <p className="proposal-date">{proposal.date || "日付未定"} {proposal.time}</p>
                  <h3>{proposal.title}</h3>
                  <p>{proposal.details || "詳細は相談しながら決める"}</p>
                  {proposal.costYen > 0 && <strong>{yen.format(proposal.costYen)}</strong>}
                  <button disabled={!viewer || busy} title={viewer ? undefined : "採用にはサインインが必要です"} onClick={() => void mutate(`/api/proposals/${proposal.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: "adopted" }) })}>この予定を採用</button>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="split money-section" aria-label="お金の管理">
        <article className="cost-card">
          <div className="section-heading compact"><span>03</span><div><p>BUDGET</p><h2>お金の見通し</h2></div></div>
          <div className="cost-total"><span>1人の旅全体</span><strong>{budgetPending ? "再計算中" : `${compactYen(board.trip.budgetMinYen)}–${compactYen(board.trip.budgetMaxYen)}`}</strong></div>
          <dl>
            <div><dt>採用済みの交通費</dt><dd>{adopted.length ? `${yen.format(shipTotal)} / 人` : "未確定"}</dd></div>
            <div><dt>確定済み実費</dt><dd>{yen.format(confirmedTotal)}</dd></div>
            <div><dt>{participantCount}人で均等なら</dt><dd>{yen.format(Math.round(confirmedTotal / participantCount))} / 人</dd></div>
            <div><dt>確認待ち</dt><dd>{draftExpenses.length}件</dd></div>
          </dl>
          <p className="footnote">第二の島を選んだあと、交通・宿・食事を公式の条件で積み上げます。以前の「大島→新島」案の金額は現在の予算に含めません。</p>
        </article>

        <article className="expense-card">
          <div className="section-heading compact light"><span>04</span><div><p>SHARED COSTS</p><h2>みんなの費用</h2></div></div>
          {board.expenses.length ? (
            <div className="expense-list">
              {board.expenses.slice(0, 8).map((expense) => (
                <div key={expense.id}>
                  <span className={`expense-state ${expense.status}`}>{expense.status === "confirmed" ? "確定" : "確認待ち"}</span>
                  <div><strong>{expense.title}</strong><small>{expense.payer} · {expense.category}</small></div>
                  <b>{yen.format(expense.amountYen)}</b>
                </div>
              ))}
            </div>
          ) : <p className="expense-empty">費用はまだありません。領収書や金額を送るとここに増えます。</p>}
        </article>
      </section>

      <section className="section composer-section" id="add" aria-labelledby="add-title">
        <div className="section-heading"><span>05</span><div><p>ADD TO OUR TRIP</p><h2 id="add-title">サイトに追加</h2></div></div>
        <div className="composer-tabs" role="tablist" aria-label="追加する内容">
          <button className={mode === "plan" ? "active" : ""} onClick={() => setMode("plan")}>予定を提案</button>
          <button className={mode === "expense" ? "active" : ""} onClick={() => setMode("expense")}>費用を追加</button>
          <button className={mode === "receipt" ? "active" : ""} onClick={() => setMode("receipt")}>領収書を追加</button>
        </div>
        {viewer ? (
          <div className="auth-banner signed-in">
            <p><strong>{viewer.displayName}</strong> として追加できます</p>
            <a href={signOutPath}>サインアウト</a>
          </div>
        ) : (
          <div className="auth-banner">
            <p><strong>見るだけならこのままでOK。</strong>予定・費用・領収書の追加にはChatGPTサインインが必要です。</p>
            <a href={signInPath}>サインインして追加する</a>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}

        {mode === "plan" && (
          <form className="composer-form" onSubmit={submitPlan}>
            <fieldset disabled={!viewer || busy}>
              <label className="wide">何をしたい？<input name="title" required placeholder="例：神津島で星を見てから温泉" /></label>
              <label>日付<input name="date" placeholder="8/31" /></label>
              <label>時間<input name="time" placeholder="17:30ごろ" /></label>
              <label>目安金額<input name="costYen" inputMode="numeric" type="number" min="0" placeholder="0" /></label>
              <label className="wide">ひとこと<textarea name="details" rows={3} placeholder="楽しそうな理由や注意点" /></label>
              <button className="submit-button">{busy ? "追加中…" : "相談中の予定に追加"}</button>
            </fieldset>
          </form>
        )}

        {mode === "expense" && (
          <form className="composer-form" onSubmit={submitExpense}>
            <fieldset disabled={!viewer || busy}>
              <label className="wide">費目<input name="title" required placeholder="例：神津島の宿代" /></label>
              <label>金額<input name="amountYen" required inputMode="numeric" type="number" min="0" placeholder="12000" /></label>
              <label>払った人<select name="payer"><option>共有</option>{board.participants.map((person) => <option key={person.id}>{person.displayName}</option>)}</select></label>
              <label>分類<select name="category"><option>宿</option><option>船</option><option>食事</option><option>島内移動</option><option>体験</option><option>その他</option></select></label>
              <label>日付<input name="occurredOn" type="date" /></label>
              <label className="check-label"><input name="confirmed" type="checkbox" /> 金額を確認済みにする</label>
              <button className="submit-button">{busy ? "追加中…" : "費用に追加"}</button>
            </fieldset>
          </form>
        )}

        {mode === "receipt" && (
          <form className="composer-form receipt-form" onSubmit={submitReceipt}>
            <fieldset disabled={!viewer || busy}>
              <label className="wide">領収書・レシート画像<input name="file" required type="file" accept="image/jpeg,image/png,image/webp,application/pdf" /></label>
              <p>サイトからは安全に保管して「読み取り待ち」にします。Discordから店名・金額をOCRして費用へ反映する連携は、まだ準備中です。</p>
              <button className="submit-button">{busy ? "保存中…" : "領収書を保存"}</button>
            </fieldset>
          </form>
        )}
      </section>

      <section className="section details-grid" aria-label="未確認と更新履歴">
        <details open>
          <summary><span>まだ確定していないこと</span><small>OpenClosが次に進める</small></summary>
          <div className="details-content alternatives">
            <p><strong>まず：</strong>第二の島を大島か新島から選ぶ</p>
            <p><strong>選ぶ前に：</strong>8/30の神津島→各島が同日でつながるか確認する</p>
            <p><strong>決めたら：</strong>神津島と第二の島の宿、往路、復路、総額をそろえる</p>
          </div>
        </details>
        <details>
          <summary><span>更新履歴</span><small>{board.activity.length}件</small></summary>
          <div className="details-content activity-list">
            {board.activity.map((entry) => <p key={entry.id}><strong>{entry.actor}</strong> {entry.summary}<small>{formatDateTime(entry.createdAt)}</small></p>)}
          </div>
        </details>
      </section>

      <footer>
        <div>
          <p className="footer-title">OFFICIAL SOURCES</p>
          <div className="source-links">
            <a href="/discover">島旅マガジン<span>→</span></a>
            <a href="https://kozushima.com/" target="_blank" rel="noreferrer">神津島観光協会<span>↗</span></a>
            <a href="https://www.tokaikisen.co.jp/boarding/timetable/" target="_blank" rel="noreferrer">2026年 時刻表<span>↗</span></a>
            <a href="https://www.tokaikisen.co.jp/boarding/fare/2026%E5%B9%B48%E6%9C%88/" target="_blank" rel="noreferrer">8月 運賃<span>↗</span></a>
            <a href="https://www.tokaikisen.co.jp/boarding/fare/2026%E5%B9%B49%E6%9C%88/" target="_blank" rel="noreferrer">9月 運賃<span>↗</span></a>
            <a href="https://www.tokaikisen.co.jp/boarding/vacantseat/" target="_blank" rel="noreferrer">空席照会<span>↗</span></a>
          </div>
        </div>
        <p className="disclaimer">OpenClosがDiscordの相談を整理し、採用・提案・費用をこのSSOTへ反映します。予約・購入は人間の承認まで行いません。</p>
      </footer>
    </main>
  );
}

function compactYen(value: number) {
  return `${Math.round(Number(value) / 10000)}万円`;
}

function shortDate(value: string) {
  const [, month, day] = value.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function formatDateTime(value: string) {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}
