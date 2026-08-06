/*
 * ============================================================
 * content.js — メインの処理ファイル
 * ============================================================
 * このファイルは、対象のSNSサイトを開いたときに
 * 「全画面の警告ポップアップ（オーバーレイ）」を表示する処理です。
 *
 * 【処理の流れ】
 * 1. SNSサイトを開く → この処理が自動的に実行される
 * 2. 画面全体を覆うポップアップを表示する
 * 3. ユーザーが選択する：
 *    - 「作業・学習に戻る」ボタン → 白紙ページ(about:blank)へ移動
 *    - 「SNSを閲覧する」ボタン   → 5秒待ってから押せるようになり、ポップアップが閉じる
 *    - Escキー                    → ポップアップが閉じる
 * 4. ページをリロードすると、ポップアップが再度表示される
 *
 * 【YouTube等への対応】
 * YouTubeなどのサイトはページの中身を動的に作り直すため、
 * ポップアップが勝手に消されることがある。
 * それを検知して自動的に再表示する仕組み（MutationObserver）を入れている。
 * ============================================================
 */

(function () {
  // --- 古いバージョンの設定を削除（互換性のため） ---
  try {
    sessionStorage.removeItem("guard_dismissed");
  } catch (_) {}

  // --- 状態を管理する変数 ---
  let userDismissed = false;      // ユーザーが「閲覧する」を押したかどうか（リロードでリセット）
  let timerId = null;             // 5秒カウントダウン用のタイマー
  let observerStarted = false;    // ページ変更の監視を開始したかどうか
  let remountScheduled = false;   // 再表示の予約があるかどうか

  /*
   * ----------------------------------------------------------
   * mountOverlay() — ポップアップを画面に表示する処理
   * ----------------------------------------------------------
   * ランダムに1件のアドバイスメッセージを選び、
   * 全画面のオーバーレイとして画面に追加する。
   * 「戻る」ボタンと「続行」ボタン（5秒後に有効）を設置する。
   */
  function mountOverlay() {
    // すでに閲覧を許可済み or すでに表示中なら何もしない
    if (userDismissed) return;
    if (document.getElementById("feed-brake-overlay")) return;
    if (!document.documentElement) return;

    // messages.js で定義されたアドバイス一覧からランダムに1件選ぶ
    const msg = AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];

    // ボタンやバッジのテキストをユーザーの言語に合わせて取得
    const badgeText = chrome.i18n.getMessage("badgeText");
    const btnReturnText = chrome.i18n.getMessage("btnReturn");
    const btnContinueText = chrome.i18n.getMessage("btnContinue");

    // ポップアップのHTML構造を作成
    const overlay = document.createElement("div");
    overlay.id = "feed-brake-overlay";
    overlay.innerHTML = `
      <div class="fg-card">
        <div class="fg-badge">${badgeText}</div>
        <h2 class="fg-title">${msg.title}</h2>
        <p class="fg-body">${msg.body.replace(/\n/g, "<br>")}</p>
        <div class="fg-actions">
          <button id="fg-close-btn" class="fg-btn-primary" type="button">${btnReturnText}</button>
          <button id="fg-continue-btn" class="fg-btn-secondary" type="button" disabled>${btnContinueText} (5)</button>
        </div>
      </div>
    `;

    // ポップアップをページに追加（bodyがなければhtmlに追加）
    (document.body || document.documentElement).appendChild(overlay);

    // --- 5秒カウントダウンの処理 ---
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    let count = 5; // 5秒からスタート
    const continueBtn = overlay.querySelector("#fg-continue-btn");
    timerId = setInterval(() => {
      count--;
      if (count > 0) {
        // カウントダウン中：ボタンに残り秒数を表示
        continueBtn.innerText = `${btnContinueText} (${count})`;
      } else {
        // カウント完了：ボタンを押せるようにする
        clearInterval(timerId);
        timerId = null;
        continueBtn.innerText = btnContinueText;
        continueBtn.removeAttribute("disabled");
      }
    }, 1000); // 1000ミリ秒 = 1秒ごとに実行

    // --- 「作業・学習に戻る」ボタンの処理 ---
    // 押すと白紙ページへ移動する
    overlay.querySelector("#fg-close-btn").addEventListener("click", () => {
      window.location.href = "about:blank";
    });

    // --- 「SNSを閲覧する」ボタンの処理 ---
    // 押すとポップアップを閉じてSNSを表示する
    continueBtn.addEventListener("click", () => {
      dismissOverlay(overlay);
    });
  }

  /*
   * ----------------------------------------------------------
   * dismissOverlay() — ポップアップを閉じる処理
   * ----------------------------------------------------------
   * ユーザーが「閲覧する」を選んだとき、またはEscキーを押したときに呼ばれる。
   * ポップアップを削除し、タイマーを停止する。
   */
  function dismissOverlay(overlay) {
    userDismissed = true;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (overlay) overlay.remove();
    else {
      const existing = document.getElementById("feed-brake-overlay");
      if (existing) existing.remove();
    }
  }

  /*
   * ----------------------------------------------------------
   * ensureOverlay() — ポップアップが表示されていなければ表示する
   * ----------------------------------------------------------
   */
  function ensureOverlay() {
    if (userDismissed) return;
    mountOverlay();
  }

  /*
   * ----------------------------------------------------------
   * startObserver() — ページ変更の監視を開始する
   * ----------------------------------------------------------
   * YouTube等はページ読み込み後にDOMを作り直すため、
   * 挿入したポップアップが消されることがある。
   * この監視機能で「消されたら再表示」を自動的に行う。
   */
  function startObserver() {
    if (observerStarted) return;
    observerStarted = true;

    const observer = new MutationObserver(() => {
      if (userDismissed) return;
      if (document.getElementById("feed-brake-overlay")) return;
      if (remountScheduled) return;
      remountScheduled = true;
      requestAnimationFrame(() => {
        remountScheduled = false;
        mountOverlay();
      });
    });

    // ページ全体の子要素の変更を監視する
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  /*
   * ----------------------------------------------------------
   * boot() — 起動処理（ポップアップ表示 + 監視開始）
   * ----------------------------------------------------------
   */
  function boot() {
    userDismissed = false;
    ensureOverlay();
    startObserver();

    // ページのbodyがまだ無い場合は、準備完了後に再度表示を試みる
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", ensureOverlay, { once: true });
    }
  }

  // --- アプリ起動 ---
  boot();

  // --- Escキーでポップアップを閉じる ---
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape" || userDismissed) return;
      dismissOverlay();
    },
    true
  );

  // --- ブラウザの「戻る」で復元されたページでも再表示する ---
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      boot();
    }
  });
})();
