"use client";

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
    void refresh();
    const timer = window.setInterval(() => void refresh(true), 15000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const adopted = useMemo(() => board?.plans.filter((plan) => plan.status === "adopted") ?? [], [board]);
  const proposals = useMemo(() => board?.plans.filter((plan) => plan.status === "proposed") ?? [], [board]);
  const shipTotal = adopted.reduce((total, plan) => total + Number(plan.costYen || 0), 0);
  const confirmedExpenses = board?.expenses.filter((expense) => expense.status === "confirmed") ?? [];
  const draftExpenses = board?.expenses.filter((expense) => expense.status === "draft") ?? [];
  const confirmedTotal = confirmedExpenses.reduce((total, expense) => total + Number(expense.amountYen), 0);
  const participantCount = Math.max(1, board?.participants.length ?? 1);

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
          <span className="updated">自動更新 · 15秒</span>
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
            <span className="status status-plan">採用中の仮案</span>
            <strong>{board.trip.routeLabel}</strong>
            <p>{shortDate(board.trip.startDate)} 夜発 — {shortDate(board.trip.endDate)} 東京戻り</p>
            <div className="people">
              {board.participants.map((person) => <span key={person.id}>{person.displayName}</span>)}
            </div>
            <a className="hero-action" href={viewer ? "#add" : signInPath}>
              {viewer ? "サイトに追加する" : "ChatGPTでサインイン"}
            </a>
          </aside>
        </div>
      </header>

      <section className="quick-status" aria-label="旅行の進み具合">
        <div><span className="dot confirmed" /><p><small>SSOT</small>採用中 {adopted.length}件</p></div>
        <div><span className="dot pending" /><p><small>相談中</small>提案 {proposals.length}件</p></div>
        <div><span className="dot locked" /><p><small>要確認</small>空席・宿・予約は未確定</p></div>
      </section>

      <section className="section itinerary-section" aria-labelledby="itinerary-title">
        <div className="section-heading">
          <span>01</span>
          <div><p>OUR PLAN</p><h2 id="itinerary-title">俺たちの予定</h2></div>
          <span className="heading-note">ここにある採用済み予定が正本です</span>
        </div>
        <div className="timeline">
          {adopted.map((item, index) => (
            <article className="timeline-item" key={item.id}>
              <div className="timeline-marker" aria-hidden="true"><span>{index + 1}</span></div>
              <p className="date">{item.date || "DATE TBD"}</p>
              <p className="time">{item.time || "時間未定"}</p>
              <div className="timeline-copy"><h3>{item.title}</h3><p>{item.details}</p></div>
              <span className="micro-status">{item.source === "official" ? "公式確認済み" : "採用済み"}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section proposal-section" aria-labelledby="proposal-title">
        <div className="section-heading">
          <span>02</span>
          <div><p>HOW ABOUT THIS?</p><h2 id="proposal-title">こんなのはどうだろう</h2></div>
        </div>
        {proposals.length ? (
          <div className="proposal-grid">
            {proposals.map((proposal) => (
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
        ) : (
          <div className="empty-state"><strong>いま相談中の提案はありません。</strong><p>DiscordでOpenClosに相談するか、下のフォームから追加できます。</p></div>
        )}
      </section>

      <section className="split money-section" aria-label="お金の管理">
        <article className="cost-card">
          <div className="section-heading compact"><span>03</span><div><p>BUDGET</p><h2>お金の見通し</h2></div></div>
          <div className="cost-total"><span>1人の旅全体</span><strong>{compactYen(board.trip.budgetMinYen)}–{compactYen(board.trip.budgetMaxYen)}</strong></div>
          <dl>
            <div><dt>採用済みの船代</dt><dd>{yen.format(shipTotal)} / 人</dd></div>
            <div><dt>確定済み実費</dt><dd>{yen.format(confirmedTotal)}</dd></div>
            <div><dt>{participantCount}人で均等なら</dt><dd>{yen.format(Math.round(confirmedTotal / participantCount))} / 人</dd></div>
            <div><dt>確認待ち</dt><dd>{draftExpenses.length}件</dd></div>
          </dl>
          <p className="footnote">船代は8月運賃と9月運賃を分け、9/1 新島→東京を13,280円として再計算しています。</p>
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
              <label className="wide">何をしたい？<input name="title" required placeholder="例：新島で夕日を見ながら温泉" /></label>
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
              <label className="wide">費目<input name="title" required placeholder="例：大島の宿代" /></label>
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
              <p>サイトからは安全に保管して「読み取り待ち」にします。DiscordでOpenClosへ画像を送ると、店名・金額をOCRして費用の下書きまで作れます。</p>
              <button className="submit-button">{busy ? "保存中…" : "領収書を保存"}</button>
            </fieldset>
          </form>
        )}
      </section>

      <section className="section details-grid" aria-label="未確認と更新履歴">
        <details open>
          <summary><span>まだ確定していないこと</span><small>OpenClosが次に進める</small></summary>
          <div className="details-content alternatives">
            <p><strong>最優先：</strong>船3区間の空席（公式予約サイトのログイン後に確認）</p>
            <p><strong>次：</strong>大島・新島の宿空室と2名料金</p>
            <p><strong>その後：</strong>大島をバス中心にするかレンタカーにするか</p>
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
