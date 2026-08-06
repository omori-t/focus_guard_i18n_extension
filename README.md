# FeedBrake

Chrome 拡張機能 — SNS アクセス時にワンクッション置き、集中と自己投資へ意識を戻します。

対象サイト: X (Twitter) / YouTube / Instagram / Reddit

対応言語: 日本語 / English / Español / Português / Bahasa Indonesia

---

## 日本語

**SNSに人生の時間を費やしてしまう前に、自分自身のことを考え、理解し、行動する時間へ**

無意識に SNS を開いたとき、全画面のアドバイスを表示します。「今すぐ作業・学習に戻る」か、5秒後に有効になる「理解して SNS を閲覧する」を選べます。ページをリロードすると、再度表示されます。

「今すぐ作業・学習に戻る」を選ぶと、このタブは `about:blank` に移動します。Esc キーでもオーバーレイを閉じられます。

---

## English

**Before social media takes your time, turn it into time to reflect, understand yourself, and take action.**

When you open a social site, FeedBrake shows a full-screen pause with a short focus tip. Choose “Back to Work / Study Now,” or wait 5 seconds to continue. Reloading the page shows the overlay again.

“Back to Work / Study Now” navigates this tab to `about:blank`. You can also dismiss the overlay with Esc.

---

## Español

**Antes de que las redes sociales te quiten el tiempo, conviértelo en tiempo para reflexionar, entenderte a ti mismo y actuar.**

Al abrir una red social, FeedBrake muestra una pausa a pantalla completa con un consejo breve. Puedes volver al trabajo o al estudio de inmediato, o esperar 5 segundos para continuar. Al recargar la página, el aviso vuelve a aparecer.

---

## Português

**Antes que as redes sociais tomem o seu tempo, transforme-o em tempo para refletir, compreender a si mesmo e agir.**

Ao abrir uma rede social, o FeedBrake exibe uma pausa em tela cheia com uma dica rápida. Você pode voltar ao trabalho ou aos estudos agora, ou esperar 5 segundos para continuar. Ao recarregar a página, o aviso aparece novamente.

---

## Bahasa Indonesia

**Sebelum media sosial mengambil waktu Anda, ubah menjadi waktu untuk merenung, memahami diri sendiri, dan bertindak.**

Saat Anda membuka situs media sosial, FeedBrake menampilkan jeda layar penuh dengan saran fokus singkat. Pilih kembali ke kerja/belajar sekarang, atau tunggu 5 detik untuk melanjutkan. Memuat ulang halaman akan menampilkan overlay lagi.

---

## Privacy

FeedBrake does not collect personal data. See [Privacy Policy](https://gist.github.com/omori-t/b399c2c447ed49767145faa35c746996).

---

## Chrome Web Store notes

- **Single purpose:** Show a mindful pause / focus tip before using selected social media sites.
- **Sites:** `x.com`, `twitter.com`, `youtube.com`, `instagram.com`, `reddit.com`
- **No remote code / no tracking**
- Store assets: `icons/` and `store/screenshot-1280x800.png`

---

## ファイル構成の説明

| ファイル | 役割 |
|---|---|
| `manifest.json` | Chrome拡張の設定書。拡張の名前、対象サイト、使うファイルを定義 |
| `content.js` | メイン処理。ポップアップの表示・ボタン・カウントダウンを実行 |
| `content.css` | ポップアップの見た目（色・サイズ・配置）を定義 |
| `messages.js` | 表示するアドバイス文を5言語分定義し、言語を自動判定 |
| `_locales/*/messages.json` | ボタンや拡張名などの短いUI文言を各言語で定義 |
| `icons/` | 拡張のアイコン画像（16/48/128px） |
| `PRIVACY.md` | プライバシーポリシー |

---

## Install (Developer mode)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this repository folder
