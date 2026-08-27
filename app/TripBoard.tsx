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
  { date: "8/29", time: "DAY 1", title: "神津島｜多幸湾でテント泊", details: "竹芝7:25発→神津島10:35着の1420便候補。島で車を借り、多幸湾ファミリーキャンプ場へ。", state: "車が最優先" },
  { date: "8/30", time: "DAY 2", title: "新島｜羽伏浦でテント泊", details: "神津島13:25発→新島14:05着の2430便候補。車を受け取り、16:00までにキャンプ届を出す。", state: "受付時刻が要点" },
  { date: "8/31", time: "DAY 3", title: "式根島｜日帰り冒険して新島泊", details: "連絡船にしきで新島8:20発。式根島16:00発で戻り、確保済みの新島宿泊先で3泊目。", state: "にしき当日確認" },
  { date: "9/1", time: "DAY 4", title: "新島から東京へ戻る", details: "ジェット船2430便なら新島14:10発→東京17:00着。大型客船2000便は11:55発→18:40着の候補。", state: "空席未確認" },
];

const transportLegs = [
  {
    date: "8/29",
    route: "東京 → 神津島",
    note: "1420便なら10:35着。テント装備をジェット船の手荷物規定内へ収める。",
    options: [
      { mode: "ジェット船 1420", time: "竹芝 7:25 → 神津島 10:35", price: "空席未確認", detail: "毎日運航予定" },
    ],
  },
  {
    date: "8/30",
    route: "神津島 → 新島",
    note: "14:05着後、車の受渡しと16:00までの羽伏浦キャンプ届を続けて行う。",
    options: [
      { mode: "ジェット船 2430", time: "神津島 13:25 → 新島 14:05", price: "空席未確認", detail: "大型客船10:30→11:45も比較可能" },
    ],
  },
  {
    date: "8/31",
    route: "新島 ⇄ 式根島（日帰り）",
    note: "新島村の連絡船にしき夏期ダイヤを使う。予約不要だが、運航情報を当日確認する。",
    options: [
      { mode: "連絡船にしき 第1便", time: "新島 8:20 → 式根島", price: "予約不要", detail: "夏期ダイヤ" },
      { mode: "連絡船にしき 第3便", time: "式根島 16:00 → 新島", price: "予約不要", detail: "新島へ戻って宿泊" },
    ],
  },
  {
    date: "9/1",
    route: "新島 → 東京",
    note: "2430便を第一候補にし、当日の港、空席、荷物条件を公式情報で照合する。大型客船2000便も比較する。",
    options: [
      { mode: "ジェット船 2430", time: "新島 14:10 → 東京 17:00", price: "空席未確認", detail: "大島経由" },
      { mode: "大型客船 2000", time: "新島 11:55 → 東京 18:40", price: "空席未確認", detail: "9/1は運航予定" },
    ],
  },
] as const;

const campingNights = [
  {
    date: "8/29",
    island: "神津島",
    camp: "多幸湾ファミリーキャンプ場",
    rule: "指定キャンプ場。予約と2026年夏の受入状況を確認する。指定場所以外の野営は禁止。",
    car: "あーす／アイラナ／神津島レンタカーへ、キャンプ利用で借りられる車を先に確認。",
    status: "最難関",
    campUrl: "https://www.vill.kouzushima.tokyo.jp/camp/",
    carUrl: "https://www.t-treasureislands.metro.tokyo.lg.jp/kouzushima/",
  },
  {
    date: "8/30",
    island: "新島",
    camp: "都立羽伏浦野営場",
    rule: "無料・予約不要だが、利用開始日の9:00〜16:00にキャンプ届。先着100人。貸テント・電源なし。",
    car: "14:05着から受付終了まで1時間55分。港受渡しと装備を積める車種を予約する。",
    status: "時刻注意",
    campUrl: "https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html",
    carUrl: "https://niijima-info.jp/ido/",
  },
  {
    date: "8/31",
    island: "新島（式根島は日帰り）",
    camp: "新島の宿泊先は確保済み（詳細非公開）",
    rule: "式根島の野営場は2026年度も継続閉場。連絡船にしきで日帰りし、16:00発で新島へ戻る。式根島では野営しない。",
    car: "式根島は徒歩・レンタサイクル中心。新島側の移動手段へ戻る。",
    status: "宿泊確保済み",
    campUrl: "https://niijima-info.jp/",
    carUrl: "https://niijima.com/shoukai/access/nishiki/unkou.html",
  },
] as const;

const supersededProposalTerms = ["神津島＋伊豆大島", "神津島＋新島", "元町で島ごはん", "まました温泉"] as const;

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

  const proposals = useMemo(() => board?.plans.filter((plan) => plan.status === "proposed") ?? [], [board]);
  const otherProposals = useMemo(
    () => proposals.filter((plan) => !supersededProposalTerms.some((term) => plan.title.includes(term))),
    [proposals],
  );
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
            <p className="kicker">AUG 29 — SEP 1, 2026 · FRIENDS WELCOME</p>
            <h1><span>三島を渡る旅に、</span><span>あと1〜2人。</span></h1>
            <p className="lead">8月29日に神津島へ入り、新島、式根島へ進む3泊4日です。宿泊は神津島、新島、新島。式根島は日帰り冒険です。いまは{board.participants.length}人。神津島のキャンプ場だけ、朝のBot確認を待っています。</p>
          </div>

          <aside className="decision-card" aria-label="現在の結論">
            <span className="status status-plan">あと1〜2人、歓迎</span>
            <strong className="decision-card-title">
              <span>計画の今から、</span>
              <span>仲間になって</span>
              <span>ほしい。</span>
            </strong>
            <p>{shortDate(board.trip.startDate)} 出発 — {shortDate(board.trip.endDate)} 東京戻り。島順と宿泊地は決定済み。神津島キャンプ、空席、当日運航を確認中です。</p>
            <div className="people">
              {board.participants.map((person) => <span key={person.id}>{person.displayName}</span>)}
              <span className="open-seat">＋ YOU</span>
            </div>
            <a className="hero-action" href="#join">この旅の正直な話を読む</a>
            <a className="hero-magazine-action" href="/discover">島旅マガジンを読む <span>→</span></a>
          </aside>
        </div>
      </header>

      <section className="quick-status" aria-label="旅行の進み具合">
        <div><span className="dot confirmed" /><p><small>動かさない</small>3泊テント＋島ごとのレンタカー</p></div>
        <div><span className="dot confirmed" /><p><small>決定した島順</small>神津島 → 新島 → 式根島</p></div>
        <div><span className="dot locked" /><p><small>まだ未確認</small>3台の車・キャンプ枠・船の空席</p></div>
      </section>

      <section className="welcome-section" id="join" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="welcome-kicker">TO THE NEXT FRIENDS</p>
          <h2 id="welcome-title">朝の海も、テントを張る時間も、みんなで旅にする。</h2>
          <p>観光地を急いで回るだけの旅行ではありません。港で車を受け取り、食材を積み、海を見て、暗くなる前にテントを張る。うまくいかない日は、天気と船に合わせて予定を変える。その相談まで面白がれる人と行きたい旅です。</p>
          <p>テント経験の多さより、荷物や運転、買い出し、片づけを話し合って分担できることを大切にします。分からないことは、今いるメンバーも同じように調べています。</p>
          <div className="welcome-actions">
            <a href="https://discord.com/channels/1535960563140796476/1535960564059213947" target="_blank" rel="noreferrer">「気になる」と伝える ↗</a>
            <a href="/discover">8島の記事を見てみる</a>
          </div>
        </div>

        <aside className="welcome-seat" aria-label="現在の参加メンバーと募集人数">
          <small>CURRENT PARTY</small>
          <div>{board.participants.map((person) => <span key={person.id}>{person.displayName}</span>)}</div>
          <strong>あと1〜2人</strong>
          <p>3〜4人になれば、車内もテント設営もにぎやかになる。参加人数が決まったら、車種・共同装備・一人あたり費用を人数に合わせて確定します。</p>
          <em>参加表明の締切は、まだ決めていません。</em>
        </aside>

        <div className="welcome-scenes" aria-label="旅で出会う三つの景色">
          <article className="welcome-scene welcome-scene-kozu"><span>01</span><div><small>神津島</small><h3>山を歩いて、星を待つ。</h3><p>天上山と多幸湾。夜は指定キャンプ場へ。</p></div></article>
          <article className="welcome-scene welcome-scene-niijima"><span>02</span><div><small>新島</small><h3>白い海岸へ、車で抜ける。</h3><p>羽伏浦の受付は16時まで。到着後はみんなで動く。</p></div></article>
          <article className="welcome-scene welcome-scene-oshima"><span>03</span><div><small>式根島</small><h3>温泉と入り江を、近距離で冒険。</h3><p>野営はせず、指定宿泊先を拠点にチェックポイントを回る。</p></div></article>
        </div>
      </section>

      <section className="live-ideas" aria-labelledby="live-ideas-title">
        <header className="live-ideas-header">
          <p>WHAT WE KEEP TALKING ABOUT</p>
          <div>
            <h2 id="live-ideas-title">まだ予約はない。でも、やりたいことは増えてきた。</h2>
            <span>Discordで実際に出ている話を、決定事項と混ぜずに置いています。</span>
          </div>
        </header>

        <div className="live-idea-grid">
          <article className="live-idea">
            <small>01 / KOZUSHIMA / SEA</small>
            <h3>朝から海へ。潜れるなら、潜りたい。</h3>
            <p>体験ダイビングやスノーケルの店は公式掲載あり。海況、受付、テント設営の時間がそろう日だけ候補にします。</p>
            <a href="https://kozushima.com/shop/taiken/diving/499/" target="_blank" rel="noreferrer">神津島の公式掲載を見る ↗</a>
          </article>
          <article className="live-idea">
            <small>02 / NIIJIMA / WAVES</small>
            <h3>羽伏浦で、波に入ってみたい。</h3>
            <p>サーフィンやボディーボードの事業者が公式一覧にあります。初心者対応と所要時間を確認してから決めます。</p>
            <a href="https://niijima-info.jp/activity/" target="_blank" rel="noreferrer">新島のアクティビティ一覧 ↗</a>
          </article>
          <article className="live-idea">
            <small>03 / NIIJIMA / BOAT</small>
            <h3>イルカか、船釣りか。海へ出る案。</h3>
            <p>公式一覧にはイルカウォッチング、船釣り、クルージングの掲載があります。新島1泊の余白で成立するかは未確認です。</p>
            <a href="https://niijima-info.jp/activity/" target="_blank" rel="noreferrer">候補を公式で見る ↗</a>
          </article>
          <article className="live-idea">
            <small>04 / NIGHT / MOONRISE</small>
            <h3>海から上がる月を待つ。</h3>
            <p>Discordで出たばかりの希望です。正確な月の出、東向きの観賞場所、雲量は、場所を絞って出発直前に確認します。</p>
            <a href="https://discord.com/channels/1535960563140796476/1535960564059213947" target="_blank" rel="noreferrer">この相談の続きをする ↗</a>
          </article>
        </div>

        <p className="live-ideas-note"><strong>これは採用済みの予定ではありません。</strong> 車・キャンプ・船と参加人数が固まってから、全部を詰め込まず、1〜2個だけ選びます。</p>
      </section>

      <section className="invite-truth" aria-labelledby="invite-truth-title">
        <header>
          <p>BEFORE YOU SAY YES</p>
          <h2 id="invite-truth-title">良いところも、大変なところも、先に。</h2>
          <span>誘うために都合の悪いことを隠しません。いま確定している事実と、これから一緒に決めたいことです。</span>
        </header>
        <div>
          <article><small>決まっている</small><h3>神津島 → 新島 → 式根島</h3><p>8月29日に神津島へ入り、毎日ひとつ先の島へ進みます。</p></article>
          <article><small>宿泊は確保済み</small><h3>神津島 → 新島 → 新島</h3><p>式根島は日帰り。3日目も新島へ戻り、確保済みの宿泊先に泊まります。</p></article>
          <article><small>お金</small><h3>一人あたりは再計算中</h3><p>予約はまだ0件です。3〜4人の参加人数、車種、船の空席、共同装備をそろえてから実額を出します。</p></article>
          <article><small>一緒にやりたい</small><h3>相談と分担</h3><p>運転、買い出し、設営、写真、朝のコーヒー。得意なことを一つ持ち寄り、苦手なことは全員で補います。</p></article>
        </div>
      </section>

      <section className="section itinerary-section" aria-labelledby="itinerary-title">
        <div className="section-heading">
          <span>01</span>
          <div><p>OUR PLAN</p><h2 id="itinerary-title">俺たちの予定</h2></div>
          <span className="heading-note">神津島泊 · 新島2泊 · 式根島は日帰り</span>
        </div>
        <div className="timeline">
          {tripFrame.map((item, index) => (
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
          <div><p>CAMP + CAR + SHIP</p><h2 id="proposal-title">この三島で、本当に三晩張れるか</h2></div>
        </div>
        <>
            <p className="choice-intro">島順は神津島 → 新島 → 式根島で決定。宿泊は神津島 → 新島 → 新島です。式根島は連絡船にしきで日帰りし、野営しません。</p>
            <div className="transport-totals" aria-label="今回固定した旅行条件">
              <div><small>テント泊</small><strong>3晩</strong><span>宿には泊まらない</span></div>
              <div><small>レンタカー</small><strong>3台</strong><span>島ごとに借り直す</span></div>
              <p><b>予約はまだ0件。</b>神津島の車が最も厳しいため、そこから三つのキャンプと四区間の船を連鎖させます。</p>
            </div>
            <p className="choice-intro"><strong>まず寝床と車。</strong> どれか一つでも取れなければ、島順を確定せずに組み直します。</p>
            <div className="transport-grid">
              {campingNights.map((night) => (
                <article className="transport-leg" key={night.date}>
                  <div className="transport-leg-heading"><span>{night.date}</span><h3>{night.island}</h3></div>
                  <p>{night.camp}</p>
                  <div className="transport-options">
                    <div><span>CAMP</span><strong>{night.rule}</strong><b>{night.status}</b><a href={night.campUrl} target="_blank" rel="noreferrer">公式案内 ↗</a></div>
                    <div><span>CAR</span><strong>{night.car}</strong><b>未予約</b><a href={night.carUrl} target="_blank" rel="noreferrer">確認先 ↗</a></div>
                  </div>
                </article>
              ))}
            </div>
            <p className="choice-intro"><strong>次に四区間の船。</strong> 車は船へ載せず、返却してから次の島で借ります。</p>
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
              <p><strong>8/31は連絡船にしきで日帰り。</strong>新島8:20発、式根島16:00発の夏期ダイヤを使って新島へ戻ります。</p>
              <p><strong>9/1は新島から東京へ。</strong>ジェット船2430便なら14:10発→17:00着。大型客船2000便なら11:55発→18:40着です。</p>
              <p><strong>一台の車で三島は回れません。</strong>東海汽船は車両を貨物船で運び、人は同乗できず、旅行利用には勧めないと案内しています。各島で受取・返却するのが今回の前提です。</p>
              <p><strong>テント装備はジェット船仕様にします。</strong>ジェット船は受託手荷物を扱わず、2026年時刻表にはアウトドアワゴンを持ち込めない旨もあります。装備を分解・圧縮し、規定を予約前に照合します。</p>
            </div>
            <div className="transport-actions">
              <a href="https://www.tokaikisen.co.jp/boarding/timetable/" target="_blank" rel="noreferrer">船の時刻表を見る ↗</a>
              <a href="https://www.tokaikisenyoyaku.com/app/login" target="_blank" rel="noreferrer">船の空席を見る ↗</a>
              <a href="https://www.tokaikisen.co.jp/boarding/baggage/" target="_blank" rel="noreferrer">荷物の規定を見る ↗</a>
            </div>
        </>
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
          <div className="section-heading compact"><span>03</span><div><p>BUDGET</p><h2>三台の車まで取ってから、総額を出す</h2></div></div>
          <div className="cost-total"><span>現在の見積もり</span><strong>再計算中</strong></div>
          <dl>
            <div><dt>船</dt><dd>4区間 · 空席と割引を確認</dd></div>
            <div><dt>島内移動</dt><dd>神津島・新島は車候補、式根島は徒歩・自転車中心</dd></div>
            <div><dt>宿泊</dt><dd>神津島 → 新島 → 新島。新島2泊は確保済み</dd></div>
            <div><dt>装備・燃料・食事</dt><dd>持込と現地調達を分ける</dd></div>
            <div><dt>確定済み実費</dt><dd>{yen.format(confirmedTotal)}</dd></div>
            <div><dt>{participantCount}人で均等なら</dt><dd>{yen.format(Math.round(confirmedTotal / participantCount))} / 人</dd></div>
            <div><dt>確認待ち</dt><dd>{draftExpenses.length}件</dd></div>
          </dl>
          <p className="footnote">以前の二島・宿泊案の交通費は使いません。四区間の船と三台の車を同じ人数・受渡し時刻で確認してから、手帳割引、燃料、食事、装備を含む新しい見積もりを出します。</p>
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
              <label className="wide">費目<input name="title" required placeholder="例：神津島レンタカー代" /></label>
              <label>金額<input name="amountYen" required inputMode="numeric" type="number" min="0" placeholder="12000" /></label>
              <label>払った人<select name="payer"><option>共有</option>{board.participants.map((person) => <option key={person.id}>{person.displayName}</option>)}</select></label>
              <label>分類<select name="category"><option>キャンプ</option><option>船</option><option>レンタカー</option><option>食事</option><option>装備</option><option>体験</option><option>その他</option></select></label>
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
            <p><strong>神津島：</strong>神津島キャンプ場は朝Botが確認。受入状況と移動手段を確定する</p>
            <p><strong>新島：</strong>14:05着から16:00までに車受取と羽伏浦のキャンプ届を終えられるか</p>
            <p><strong>式根島：</strong>連絡船にしき第1便で入り、第3便で新島へ戻る日帰り冒険</p>
            <p><strong>船：</strong>4区間を2人分で確保し、テント装備がジェット船規定内に収まるか</p>
            <p><strong>現地：</strong>車をテント横へ置くオートキャンプは未確認。各施設の指定駐車に従う</p>
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
            <a href="https://www.tokaikisen.co.jp/boarding/timetable/" target="_blank" rel="noreferrer">2026年 時刻表<span>↗</span></a>
            <a href="https://www.vill.kouzushima.tokyo.jp/camp/" target="_blank" rel="noreferrer">神津島 キャンプ<span>↗</span></a>
            <a href="https://www.niijima.com/soshiki/sangyoukankouka/news/2023-1026-1806-101.html" target="_blank" rel="noreferrer">新島 キャンプ<span>↗</span></a>
            <a href="https://shikinejima.tokyo/stay/" target="_blank" rel="noreferrer">式根島 宿泊<span>↗</span></a>
            <a href="https://www.tokaikisen.co.jp/cargo/" target="_blank" rel="noreferrer">車両輸送の案内<span>↗</span></a>
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
