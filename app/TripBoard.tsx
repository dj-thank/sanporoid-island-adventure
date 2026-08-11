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
  { date: "8/29", time: "DAY 1", title: "東京から神津島へ", details: "竹芝7:25発のジェット船、または調布発の飛行機。空席と神津島の宿は未確認。", state: "便を選ぶ" },
  { date: "8/30", time: "DAY 2", title: "神津島から新島へ", details: "大型客船10:30→11:45、またはジェット船13:25→14:05。島の順番は決定済み。", state: "行き先決定" },
  { date: "8/31", time: "DAY 3", title: "新島を、自転車の速さで", details: "羽伏浦、新島ガラス、夕方は湯の浜露天温泉へ。天気で順番を入れ替える。", state: "島で遊ぶ" },
  { date: "9/1", time: "DAY 4", title: "新島から東京へ戻る", details: "船なら14:10→17:00の直行便、飛行機なら約40分。帰り方と新島の宿は未確認。", state: "便を選ぶ" },
];

const transportLegs = [
  {
    date: "8/29",
    route: "東京 → 神津島",
    note: "早く島へ着くなら飛行機。荷物と価格の気楽さなら船。",
    options: [
      { mode: "ジェット船", time: "竹芝 7:25 → 10:35", price: "8,400円", detail: "手帳割引 50%" },
      { mode: "飛行機", time: "調布 8:50 → 9:35", price: "15,400円", detail: "8月繁忙期の障害者運賃" },
    ],
  },
  {
    date: "8/30",
    route: "神津島 → 新島",
    note: "ここは船だけ。朝を取るか、神津島を昼まで楽しむかで決める。",
    options: [
      { mode: "大型客船 2等", time: "10:30 → 11:45", price: "595円", detail: "手帳割引 50%" },
      { mode: "ジェット船", time: "13:25 → 14:05", price: "1,225円", detail: "手帳割引 50%" },
    ],
  },
  {
    date: "9/1",
    route: "新島 → 東京",
    note: "昼前に戻るなら飛行機。船の直行便は14:10発。",
    options: [
      { mode: "ジェット船", time: "14:10 → 17:00", price: "6,640円", detail: "9月運賃・手帳割引 50%" },
      { mode: "飛行機", time: "11:00 → 11:40 ほか", price: "12,500円", detail: "通常期の障害者運賃" },
    ],
  },
] as const;

const routeOptionCopy = [
  {
    key: "oshima",
    match: "神津島＋伊豆大島",
    label: "案 A / 山と火山",
    title: "神津島のあと、大島へ",
    hook: "天上山から三原山へ。歩く旅を二つの島でつなぐ。",
    verdict: "便の選択肢で一歩リード",
    schedule: [
      { label: "最短", time: "10:45 → 11:45", mode: "ジェット船", cost: "4,620円" },
      { label: "午後発", time: "13:25 → 15:05", mode: "ジェット船", cost: "4,620円" },
      { label: "安く", time: "10:30 → 13:55", mode: "大型客船 2等", cost: "2,100円" },
    ],
    returnTrip: "9/1 大島→東京はジェット船が4便候補。10:20、14:55、15:15、15:50発。",
    moments: ["三原山", "地層大切断面", "温泉", "元町で島ごはん"],
    unknown: "各便の空席、神津島と大島の宿、出発当日の発着港。",
    relatedMatch: "元町で島ごはん",
    href: "/discover/oshima",
  },
  {
    key: "niijima",
    match: "神津島＋新島",
    label: "案 B / 山と白い海",
    title: "神津島のあと、新島へ",
    hook: "天上山を歩いた次の日は、羽伏浦を自転車の速さで巡る。",
    verdict: "移動の短さと安さが魅力",
    schedule: [
      { label: "安く", time: "10:30 → 11:45", mode: "大型客船 2等", cost: "1,190円" },
      { label: "午後発", time: "13:25 → 14:05", mode: "ジェット船", cost: "2,450円" },
    ],
    returnTrip: "9/1 新島→東京はジェット船14:10→17:00、または大型客船11:55→18:40。",
    moments: ["羽伏浦", "レンタサイクル", "新島ガラス", "まました温泉"],
    unknown: "各便の空席、神津島と新島の宿、出発当日の発着港。",
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
  const confirmedExpenses = board?.expenses.filter((expense) => expense.status === "confirmed") ?? [];
  const draftExpenses = board?.expenses.filter((expense) => expense.status === "draft") ?? [];
  const confirmedTotal = confirmedExpenses.reduce((total, expense) => total + Number(expense.amountYen), 0);
  const participantCount = Math.max(1, board?.participants.length ?? 1);
  const reconsidering = board?.trip.status === "reconsidering";
  const niijimaSelected = board?.trip.status === "planning" && board.trip.routeLabel === "決定｜神津島 → 新島";

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
            <span className="status status-plan">{niijimaSelected ? "行き先決定" : reconsidering ? "再調整中" : "採用中"}</span>
            <strong>{board.trip.routeLabel}</strong>
            <p>{shortDate(board.trip.startDate)} 出発 — {shortDate(board.trip.endDate)} 東京戻り · 交通と宿は未予約</p>
            <div className="people">
              {board.participants.map((person) => <span key={person.id}>{person.displayName}</span>)}
            </div>
            <a className="hero-action" href={niijimaSelected ? "#route-choice" : reconsidering ? "#route-choice" : viewer ? "#add" : signInPath}>
              {niijimaSelected ? "船と飛行機を比べる" : reconsidering ? "2つの案を比べる" : viewer ? "サイトに追加する" : "ChatGPTでサインイン"}
            </a>
            <a className="hero-magazine-action" href="/discover">島旅マガジンを読む <span>→</span></a>
          </aside>
        </div>
      </header>

      <section className="quick-status" aria-label="旅行の進み具合">
        <div><span className="dot confirmed" /><p><small>行き先</small>{niijimaSelected ? "神津島 → 新島で決定" : board.trip.routeLabel}</p></div>
        <div><span className="dot pending" /><p><small>次に決める</small>往復を船にするか、飛行機にするか</p></div>
        <div><span className="dot locked" /><p><small>まだ未確認</small>空席・宿・当日の港</p></div>
      </section>

      <section className="section itinerary-section" aria-labelledby="itinerary-title">
        <div className="section-heading">
          <span>01</span>
          <div><p>OUR PLAN</p><h2 id="itinerary-title">俺たちの予定</h2></div>
          <span className="heading-note">神津島 → 新島は決定 · 便と宿は未予約</span>
        </div>
        <div className="timeline">
          {(niijimaSelected || reconsidering ? tripFrame : adopted).map((item, index) => (
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
          <div><p>GETTING THERE</p><h2 id="proposal-title">行き先は決まった。次は、どう渡る？</h2></div>
        </div>
        {niijimaSelected ? (
          <>
            <p className="choice-intro">神津島から新島へ行くことは決定済み。残っているのは三つの区間の乗り方です。障害者手帳の割引を入れた1人分で比べました。</p>
            <div className="transport-totals" aria-label="交通費の比較">
              <div><small>船を中心に組む</small><strong>15,635–16,265円</strong><span>1人 · 3区間</span></div>
              <div><small>外側2区間を飛行機</small><strong>28,495–29,125円</strong><span>1人 · 島間は船</span></div>
              <p><b>差は約12,860円。</b>時間を買う区間だけ飛行機にする混ぜ方もできます。</p>
            </div>
            <div className="transport-grid">
              {transportLegs.map((leg) => (
                <article className="transport-leg" key={leg.date}>
                  <div className="transport-leg-heading"><span>{leg.date}</span><h3>{leg.route}</h3></div>
                  <p>{leg.note}</p>
                  <div className="transport-options">
                    {leg.options.map((option) => (
                      <div key={`${option.mode}-${option.time}`}>
                        <span>{option.mode}</span><strong>{option.time}</strong><b>{option.price}</b><small>{option.detail}</small>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="fare-notes">
              <p><strong>9/1の時刻を訂正しました。</strong>新島9:50発は東京13:40着の直行便ではありません。大島で乗り継ぎ、東京は16:40ごろ。直行便は14:10→17:00です。</p>
              <p><strong>手帳割引について。</strong>東海汽船は本人と介護者1名まで50%割引。予約後、窓口で手帳を提示して購入します。飛行機も本人と同便の介護者1名が対象で、電話または空港窓口で確認します。</p>
            </div>
            <div className="transport-actions">
              <a href="https://www.tokaikisen.co.jp/boarding/timetable/" target="_blank" rel="noreferrer">船の時刻表を見る ↗</a>
              <a href="https://www.tokaikisenyoyaku.com/app/login" target="_blank" rel="noreferrer">船の空席を見る ↗</a>
              <a href="https://central-air.co.jp/schedule-fee.html?stt_lang=ja" target="_blank" rel="noreferrer">飛行機の時刻・運賃を見る ↗</a>
            </div>
          </>
        ) : (
          <>
            <p className="choice-intro">神津島は共通。8/30は大島にも新島にも移れます。空席と宿がそろうかを同じ人数で比べます。</p>
            <div className="route-choice-grid">
              {routeOptionCopy.map((option) => {
                const proposal = routeIdeas.find((idea) => idea.title.includes(option.match));
                const related = attachedIdeas.find((idea) => idea.title.includes(option.relatedMatch));
                return (
                  <article className={`route-choice-card ${option.key}`} key={option.key}>
                    <div className="route-choice-top"><span>{option.label}</span><small>未採用</small></div>
                    <h3>{option.title}</h3>
                    <p className="route-hook">{option.hook}</p>
                    <p className="route-verdict"><span className="dot confirmed" /><small>公式ダイヤあり</small><strong>{option.verdict}</strong></p>
                    <div className="route-schedule" aria-label="8月30日の移動候補">
                      {option.schedule.map((row) => <div key={`${row.time}-${row.mode}`}><small>{row.label}</small><strong>{row.time}</strong><span>{row.mode}</span><b>{row.cost}</b></div>)}
                    </div>
                    <p className="route-return"><strong>帰り</strong>{option.returnTrip}</p>
                    <div className="route-moments" aria-label="この案で楽しめること">{option.moments.map((moment) => <span key={moment}>{moment}</span>)}</div>
                    <p className="route-flow">{proposal?.details ?? "Discordの案を旅行ボードへ反映しています。"}</p>
                    {related && <p className="route-side-idea"><strong>この案なら</strong>{related.title}。{related.details}</p>}
                    <p className="route-unknown"><strong>先に確認</strong>{option.unknown}</p>
                    <div className="route-source-links"><a href="https://www.tokaikisen.co.jp/boarding/timetable/" target="_blank" rel="noreferrer">公式時刻表 ↗</a><a href="https://www.tokaikisenyoyaku.com/app/login" target="_blank" rel="noreferrer">空席を確認 ↗</a></div>
                    <a href={option.href}>{option.key === "oshima" ? "大島" : "新島"}の記事を読む <span aria-hidden="true">→</span></a>
                  </article>
                );
              })}
            </div>
          </>
        )}
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
          <div className="section-heading compact"><span>03</span><div><p>BUDGET</p><h2>いま分かるのは、交通費まで</h2></div></div>
          <div className="cost-total"><span>船を中心に · 1人</span><strong>15,635円〜</strong></div>
          <dl>
            <div><dt>船中心の3区間</dt><dd>15,635–16,265円 / 人</dd></div>
            <div><dt>往復だけ飛行機</dt><dd>28,495–29,125円 / 人</dd></div>
            <div><dt>宿・食事・島内移動</dt><dd>これから追加</dd></div>
            <div><dt>確定済み実費</dt><dd>{yen.format(confirmedTotal)}</dd></div>
            <div><dt>{participantCount}人で均等なら</dt><dd>{yen.format(Math.round(confirmedTotal / participantCount))} / 人</dd></div>
            <div><dt>確認待ち</dt><dd>{draftExpenses.length}件</dd></div>
          </dl>
          <p className="footnote">手帳割引を適用した単純計算です。実際の適用条件と空席は予約時に確認します。ここには宿、食事、島内移動、調布空港・竹芝までの交通を含めていません。</p>
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
            <p><strong>交通：</strong>8/29と9/1を船にするか、時間を買って飛行機にするか</p>
            <p><strong>空席：</strong>June・りもの2人分を同じ便で取れるか。手帳割引の適用も予約時に確認する</p>
            <p><strong>宿：</strong>8/29の神津島1泊、8/30・31の新島2泊を押さえる</p>
            <p><strong>港：</strong>出発前日に当日の発着港と欠航情報をもう一度見る</p>
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
