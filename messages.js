const userLang = chrome.i18n.getUILanguage().toLowerCase();

let langKey = 'en';
if (userLang.startsWith('ja')) langKey = 'ja';
else if (userLang.startsWith('es')) langKey = 'es';
else if (userLang.startsWith('pt')) langKey = 'pt';
else if (userLang.startsWith('id')) langKey = 'id';

const ALL_MESSAGES = {
  ja: [
    { title: "🧠 5分間の「超集中」が作れる時間です", body: "今からSNSを10分眺めて得られる情報は明日には忘れています。この10分で単語を覚える、本を2ページ読む、ストレッチをする方があなたの資産になります。" },
    { title: "⚡ 他人の人生を消費していませんか？", body: "SNSは他人の成果や意見で溢れています。他人の人生を観察する時間を、あなた自身のスキルや知識を磨く時間に変えましょう。" },
    { title: "📈 1日15分のSNS＝年間90時間", body: "1日わずか15分の無意識スクロールも、1年でまるまる3.7日分になります。今アクセスを止めるだけで未来の時間を回収できます。" },
    { title: "🎯 今、本当に達成したい目標は何ですか？", body: "無意識にタイムラインを開く前に、今日やるべき最高のタスクを思い出してください。1分でも手を付けるだけで集中モードに入れます。" },
    { title: "🚀 習慣が変われば未来が変わる", body: "スクロールの手を止め、今日の自分に小さな成功体験を与えましょう。この一瞬の判断が半年後のあなたの成果を作ります。" },
    { title: "💡 知識の消費者から生産者へ", body: "流れてくる情報を消費する側に回るのをやめ、自分のスキルや作品を作り出す側に立ちましょう。" },
    { title: "⏳ 時間は唯一買い直せない資産", body: "お金は増やすことができても、過ぎ去った10分間は二度と戻りません。その価値を今ここで守りましょう。" },
    { title: "🧘 脳に質の良い休憩を与えましょう", body: "SNSによる情報過多は脳を疲れさせます。画面を閉じて深呼吸し、本当の休息を取るか目の前の作業に戻りましょう。" },
    { title: "📚 10分あれば何ができますか？", body: "10分あれば記事を1本熟読する、アイデアをメモする、復習をするなど十分な学習が可能です。" },
    { title: "🔥 「あとでやる」を「今やる」に変える", body: "SNSへ逃げる誘惑を断ち切り、目の前のタスクに最初の一歩を踏み出しましょう。動き出せばやる気は後からついてきます。" }
  ],
  en: [
    { title: "🧠 Create 5 Minutes of Deep Focus", body: "Information gained from 10 minutes of scrolling will be forgotten tomorrow. Learning 5 words or reading 2 pages builds real lifetime assets." },
    { title: "⚡ Consuming Someone Else's Life?", body: "Your feed is filled with other people's achievements. Turn time spent watching others into time sharpening your own skills." },
    { title: "📈 15 Mins a Day = 90 Hours a Year", body: "15 minutes of daily scrolling adds up to nearly 4 full days a year. Stop now to reclaim your valuable time for the future." },
    { title: "🎯 What is Your #1 Goal Right Now?", body: "Before scrolling endlessly, recall your top task for today. Spending just 1 minute on it gets you into the flow state." },
    { title: "🚀 Change Habits, Change Your Future", body: "Stop scrolling and give yourself a small win today. This momentary choice shapes who you become 6 months from now." },
    { title: "💡 From Consumer to Creator", body: "Stop being a passive consumer of endless feeds. Step up and become a creator of your own skills and work." },
    { title: "⏳ Time Cannot Be Bought Back", body: "Money can be earned back, but the next 10 minutes are lost forever once wasted. Protect your time right here." },
    { title: "🧘 Give Your Brain True Rest", body: "Information overload from SNS tires your brain. Close the tab, take a deep breath, and give yourself real focus or rest." },
    { title: "📚 What Can You Do in 10 Minutes?", body: "In 10 minutes, you can read a valuable article, draft an idea, or review notes. Turn idle time into self-growth." },
    { title: "🔥 Turn 'Later' into 'Right Now'", body: "Resist the urge to escape into social media. Take the first step on your current task—action creates motivation." }
  ],
  es: [
    { title: "🧠 Crea 5 minutos de enfoque profundo", body: "Lo que veas en 10 minutos de redes se olvidará mañana. Dedicar ese tiempo a leer 2 páginas o aprender algo nuevo crea valor real." },
    { title: "⚡ ¿Consumiendo la vida de otros?", body: "Tu feed está lleno de logros ajenos. Transforma el tiempo de observación en tiempo para mejorar tus propias habilidades." },
    { title: "📈 15 min al día = 90 horas al año", body: "15 minutos diarios equivalen a casi 4 días enteros al año. Detente ahora y recupera tu tiempo para el futuro." },
    { title: "🎯 ¿Cuál es tu objetivo principal hoy?", body: "Antes de deslizar sin rumbo, recuerda tu tarea más importante. Dedicarle solo 1 minuto te pondrá en marcha." },
    { title: "🚀 Cambia hábitos, cambia tu futuro", body: "Detén el desplazamiento y regálate una pequeña victoria hoy. Esta decisión moldeará quién serás en 6 meses." },
    { title: "💡 De consumidor a creador", body: "Deja de consumir pasivamente la información de otros. Conviértete en creador de tus propias habilidades e ideas." },
    { title: "⏳ El tiempo no se puede comprar", body: "El dinero se recupera, pero estos 10 minutos no volverán. Protege tu activo más valioso ahora mismo." },
    { title: "🧘 Dale a tu cerebro un descanso real", body: "La sobrecarga de información fatiga la mente. Cierra la pestaña, respira hondo y vuelve a lo que importa." },
    { title: "📚 ¿Qué puedes hacer en 10 minutos?", body: "En 10 minutos puedes leer un artículo clave, anotar ideas o repasar. Convierte la inactividad en aprendizaje." },
    { title: "🔥 Convierte 'luego' en 'ahora mismo'", body: "Resiste la tentación de escapar a las redes. Da el primer paso en tu tarea actual; la acción genera motivación." }
  ],
  pt: [
    { title: "🧠 Crie 5 minutos de foco profundo", body: "O que você vê em 10 minutos de redes será esquecido amanhã. Ler 2 páginas ou aprender algo novo gera valor real." },
    { title: "⚡ Consumindo a vida dos outros?", body: "Seu feed está cheio de conquistas alheias. Transforme esse tempo em aprimoramento das suas próprias habilidades." },
    { title: "📈 15 min por dia = 90 horas por ano", body: "15 minutos diários somam quase 4 dias inteiros por ano. Pare agora e recupere seu tempo para o futuro." },
    { title: "🎯 Qual é a sua meta principal hoje?", body: "Antes de rolar o feed, lembre-se da sua tarefa mais importante. Dedicar 1 minuto a ela já te coloca no ritmo." },
    { title: "🚀 Mude hábitos, mude seu futuro", body: "Pare de rolar a tela e dê a si mesmo uma pequena vitória hoje. Essa escolha molda quem você será em 6 meses." },
    { title: "💡 De consumidor para criador", body: "Deixe de ser um consumidor passivo de informações. Torne-se o criador das suas próprias habilidades e projetos." },
    { title: "⏳ O tempo não pode ser comprado", body: "Dinheiro se recupera, mas os próximos 10 minutos nunca voltarão. Proteja seu bem mais precioso agora." },
    { title: "🧘 Dê ao seu cérebro um descanso real", body: "O excesso de informação cansa a mente. Feche a aba, respire fundo e volte ao que realmente importa." },
    { title: "📚 O que você pode fazer em 10 minutos?", body: "Em 10 minutos você pode ler um artigo, anotar ideias ou estudar. Transforme o tempo vago em evolução." },
    { title: "🔥 Transforme 'depois' em 'agora'", body: "Resista à tentação de escapar para as redes sociais. Dê o primeiro passo na sua tarefa; a ação gera motivação." }
  ],
  id: [
    { title: "🧠 Ciptakan 5 Menit Fokus Mendalam", body: "Informasi dari 10 menit medsos akan dilupakan besok. Belajar 5 kata baru atau membaca 2 halaman buku memberi nilai nyata." },
    { title: "⚡ Mengonsumsi Kehidupan Orang Lain?", body: "Linimasa Anda penuh dengan pencapaian orang lain. Ubah waktu melihat orang lain menjadi waktu mengasah skill sendiri." },
    { title: "📈 15 Mnt/Hari = 90 Jam/Tahun", body: "15 menit scroll harian setara dengan hampir 4 hari penuh dalam setahun. Hentikan sekarang untuk merebut waktu masa depan." },
    { title: "🎯 Apa Target Utama Anda Hari Ini?", body: "Sebelum scroll tanpa henti, ingat kembali tugas terpenting Anda. Melakukan 1 menit saja akan memicu fokus Anda." },
    { title: "🚀 Ubah Kebiasaan, Ubah Masa Depan", body: "Hentikan jempol Anda dan berikan kemenangan kecil hari ini. Keputusan singkat ini menentukan hasil Anda 6 bulan lagi." },
    { title: "💡 Dari Konsumen Menjadi Pencipta", body: "Berhentilah menjadi konsumen pasif dari konten orang lain. Mulailah mencipta dan mengembangkan keahlian Anda sendiri." },
    { title: "⏳ Waktu Adalah Aset Yang Tak Terbeli", body: "Uang bisa dicari lagi, tetapi 10 menit yang berlalu tidak akan kembali. Lindungi nilai waktu Anda sekarang." },
    { title: "🧘 Berikan Otak Anda Istirahat Nyata", body: "Informasi berlebih dari medsos membuat otak lelah. Tutup tab, tarik napas dalam, dan kembalilah fokus." },
    { title: "📚 Apa Yang Bisa Dilakukan dalam 10 Menit?", body: "Dalam 10 menit Anda bisa membaca artikel bermanfaat, mencatat ide, atau belajar. Ubah waktu luang jadi investasi diri." },
    { title: "🔥 Ubah 'Nanti' Menjadi 'Sekarang'", body: "Lawan godaan untuk kabur ke media sosial. Ambil langkah pertama pada tugas Anda—aksi akan mendatangkan motivasi." }
  ]
};

const AI_MESSAGES = ALL_MESSAGES[langKey];
