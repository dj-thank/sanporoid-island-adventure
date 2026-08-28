import { useState } from "react";

type StandaloneNavigator = Navigator & { standalone?: boolean };

export default function PwaInstallGuide({ enabled }: { enabled: boolean }) {
  const [prompt, setPrompt] = useState(() => initialPrompt(enabled));

  if (!prompt.visible) return null;

  return (
    <aside className="pwa-install-guide" aria-label="スマートフォンへのインストール方法">
      <span aria-hidden="true">✦</span>
      <div>
        <small>PC接続なし</small>
        <strong>{prompt.ios ? "iPhoneに追加できます" : "ホーム画面に追加できます"}</strong>
        <p>{prompt.ios ? "Safariで共有ボタンを押し、「ホーム画面に追加」を選択。" : "ブラウザのメニューから「アプリをインストール」を選択。"}</p>
      </div>
      <button type="button" onClick={() => {
        try { sessionStorage.setItem("shioboshi-install-guide-dismissed", "1"); } catch { /* Session storage may be unavailable in privacy mode. */ }
        setPrompt((current) => ({ ...current, visible: false }));
      }}>閉じる</button>
    </aside>
  );
}

function initialPrompt(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return { visible: false, ios: false };
  const navigatorWithStandalone = navigator as StandaloneNavigator;
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
  const ipadDesktopMode = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || ipadDesktopMode;
  const mobile = ios || /Android/i.test(navigator.userAgent);
  let dismissed = false;
  try { dismissed = sessionStorage.getItem("shioboshi-install-guide-dismissed") === "1"; } catch { /* Session storage may be unavailable in privacy mode. */ }
  return { visible: mobile && !standalone && !dismissed, ios };
}
