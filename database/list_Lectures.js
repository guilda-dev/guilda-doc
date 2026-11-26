// The "Understanding power systems" pages in lecture/, one page per Part, in order; rendered by renderLectures() in index.html
// as the cards of "Understanding power systems" on the Tutorial tab.
// part: Part number; field: the area of analysis shown on the card; title/summary: one line each,
// *_ja for Japanese, the summary saying what the analysis shows; link: page relative to the site root;
// file: the Live Script of the Part under _GUILDAtutorial, shown on the card as
// "open _GUILDAtutorial/<file>" with a copy button.
// ready: true once the page has its content. A Part with ready: false is listed without a link,
// marked "In preparation"; its page exists already with the common layout only (notes/lecture-notes.md in the guilda repository).
const lectureData = [
  {
    part: "0",
    file: "Part0_Introduction.mlx",
    field: "Overview",
    field_ja: "全体像",
    title: "Introduction",
    title_ja: "導入",
    summary: "What a power system does, why supply and demand must match at every moment, and the map of the analyses in the Parts below.",
    summary_ja: "電力系統の役割と、需要と供給を常に一致させなければならない理由を知り、以下の Part で扱う解析の全体を見渡します。",
    link: "lecture/part0-introduction.html",
    ready: true
  },
  {
    part: "1",
    file: "Part1_NetworkComponents.mlx",
    field: "Modeling",
    field_ja: "モデル化",
    title: "Building a power system and its equipment",
    title_ja: "電力系統の作成と機器の種類",
    summary: "Model a network from buses, branches, components and controllers: per-unit values, lines and transformers, bus types, generator and load models, and the bundled benchmark networks.",
    summary_ja: "母線・ブランチ・機器・制御器で系統をモデル化します。単位法、送電線と変圧器、母線の種類、発電機と負荷のモデル、同梱のベンチマーク系統を扱います。",
    link: "lecture/part1-network-components.html",
    ready: true
  },
  {
    part: "2",
    file: "Part2_PowerFlow.mlx",
    field: "Steady state",
    field_ja: "定常状態",
    title: "Power flow",
    title_ja: "潮流計算",
    summary: "Find the operating state: the voltage of every bus and the power on every line, from what each bus fixes, solved by Newton's method.",
    summary_ja: "運転状態を求めます。母線ごとに決める量から、すべての母線の電圧と送電線の電力を、ニュートン法で解きます。",
    link: "lecture/part2-power-flow.html",
    ready: true
  },
  {
    part: "3",
    file: "Part3_TimeSimulation.mlx",
    field: "Dynamics",
    field_ja: "動特性",
    title: "Time-domain simulation",
    title_ja: "時間シミュレーション",
    summary: "Follow the response to faults and other disturbances in time: the swing of the generators, transient stability and the equal-area criterion, and the frequency after a disturbance.",
    summary_ja: "事故などの外乱への応答を時間を追って調べます。発電機の揺れ、過渡安定度と等面積法、外乱の後の周波数の変化を扱います。",
    link: "lecture/part3-time-simulation.html",
    ready: true
  },
  {
    part: "4",
    file: "Part4_SpringMassModel.mlx",
    field: "Visualization",
    field_ja: "可視化",
    title: "Visualization: the spring-mass model",
    title_ja: "可視化機能：ばね質点モデル",
    summary: "See voltage phasors as masses and reactances as springs: the power flow as a balance of springs, and the time response as oscillating masses.",
    summary_ja: "電圧フェーザを質点、リアクタンスをばねに見立てて、潮流計算をばねのつり合い、時間応答を質点の振動として見ます。",
    link: "lecture/part4-spring-mass-model.html",
    ready: true
  },
  {
    part: "5",
    file: "Part5_Linearization.mlx",
    field: "Small-signal stability",
    field_ja: "定態安定度",
    title: "Approximate linearization",
    title_ja: "近似線形化",
    summary: "Approximate small swings with a linear model and read its eigenvalues: modes of oscillation, damping ratios and participation factors.",
    summary_ja: "小さな揺れを線形モデルで近似し、固有値から揺れの型（モード）、ダンピング比、参加係数を読み取ります。",
    link: "lecture/part5-linearization.html",
    ready: true
  },
  {
    part: "6",
    file: "Part6_OptimalPowerFlow.mlx",
    field: "Optimization",
    field_ja: "最適化",
    title: "Optimal power flow and stability-constrained OPF",
    title_ja: "最適潮流計算と定態安定度制約付き OPF",
    summary: "Find the most economic operation under generation, voltage and line limits, read congestion and the LMP, and add an eigenvalue condition for stability.",
    summary_ja: "発電・電圧・線路容量の制約の下で、もっとも経済的な運転を求めます。混雑と LMP を読み取り、安定度のための固有値の条件も加えます。",
    link: "lecture/part6-optimal-power-flow.html",
    ready: true
  },
  {
    part: "7",
    file: "Part7_ContinuationPowerFlow.mlx",
    field: "Voltage stability",
    field_ja: "電圧安定性",
    title: "Continuation power flow and the power-flow Jacobian",
    title_ja: "連続潮流計算と電力方程式のヤコビアン",
    summary: "Raise the load step by step to trace the PV curve up to the nose point, and see why reactive power matters for voltage and where the Jacobian becomes singular.",
    summary_ja: "負荷を少しずつ増やして PV カーブをノーズ点までたどり、電圧にとって無効電力が大切な理由と、ヤコビアンが特異になる点を調べます。",
    link: "lecture/part7-continuation-power-flow.html",
    ready: true
  },
  {
    part: "8",
    file: "Part8_ControllerDesign.mlx",
    field: "Control",
    field_ja: "制御",
    title: "Designing and writing controllers",
    title_ja: "制御器の設計と自作の方法",
    summary: "Evaluate controllers: feedback basics, AVR, PSS and governor, the hierarchy of frequency control, global controllers and Retrofit control, and how to write your own.",
    summary_ja: "制御器の効果を評価します。フィードバックの基本、AVR・PSS・ガバナ、周波数制御の階層、グローバル制御器と Retrofit 制御、制御器の自作の考え方を扱います。",
    link: "lecture/part8-controller-design.html",
    ready: true
  }
];
