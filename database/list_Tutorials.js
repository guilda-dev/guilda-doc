// The usage manual in _GUILDAtutorial: Step 0 (Main.mlx, the table of contents that
// GUILDA.tutorial() opens) and Steps 1-12, one Live Script per feature, in reading order;
// rendered by renderTutorials() in index.html.
// tutorialIndex: Step 0, shown above the list. tutorialData: one row per Step.
// step: Step number; file: path under _GUILDAtutorial; title/summary: one line each, *_ja for Japanese.
// The command shown is "open _GUILDAtutorial/<file>". The rows have no GIF; Step 0 shows the
// one GIF of the list, images/tutorial/main.gif (Main.mlx scrolled from top to bottom).
// The Live Scripts of the lecture Parts (Part0-8) are listed in list_Lectures.js.
const tutorialIndex = {
  step: "0",
  file: "Main.mlx",
  title: "Table of contents",
  title_ja: "目次",
  summary: "Lists Steps 1-12 and Parts 0-8 with a line on each, and suggests where to start. GUILDA.tutorial() opens it.",
  summary_ja: "Step1〜12 と Part0〜8 を一言の説明つきで並べ、どこから読めばよいかを案内します。GUILDA.tutorial() で開けます。"
};

const tutorialData = [
  {
    step: "1",
    file: "Step1_BuildNetwork.mlx",
    title: "Network and components",
    title_ja: "系統と機器",
    summary: "Load a bundled network, or build one from buses, branches and components chosen by Key; choose the slack bus, then add, replace and remove components.",
    summary_ja: "同梱の系統を読み込むか、Key で選んだ母線・ブランチ・機器から組み立てます。Slack 母線を決め、機器を追加・置き換え・取り外しします。"
  },
  {
    step: "2",
    file: "Step2_ComponentController.mlx",
    title: "Controllers",
    title_ja: "制御器",
    summary: "Choose controllers by Key, then add, replace and remove local controllers (AVR, PSS, governor) and global controllers (AGC).",
    summary_ja: "Key で制御器を選び、ローカル制御器（AVR・PSS・ガバナ）とグローバル制御器（AGC）を付け外しします。"
  },
  {
    step: "3",
    file: "Step3_NetworkData.mlx",
    title: "Reading and editing network data",
    title_ja: "系統データの見方と編集",
    summary: "Get buses, branches, components and controllers by number or tag, and read and write their parameters and equilibrium values.",
    summary_ja: "母線・ブランチ・機器・制御器を番号やタグで取り出し、パラメータと平衡点の値を読み書きします。"
  },
  {
    step: "4",
    file: "Step4_PowerFlow.mlx",
    title: "Power flow",
    title_ja: "潮流計算",
    summary: "Check the power-flow conditions, run calculate_powerflow with its options, and read ResultPF as tables and figures.",
    summary_ja: "潮流計算の条件を確かめ、calculate_powerflow をオプションつきで実行し、結果 ResultPF を表と図で読みます。"
  },
  {
    step: "5",
    file: "Step5_SimulationScenario.mlx",
    title: "Simulation scenarios",
    title_ja: "時間シミュレーションの条件",
    summary: "Create a scenario, add faults, branch openings, trips, offsets and inputs, and edit, copy and save it.",
    summary_ja: "シナリオを作り、地絡・ブランチの開放・解列・状態のずれ・入力を加え、書き換え・コピー・保存します。"
  },
  {
    step: "6",
    file: "Step6_SimulationResult.mlx",
    title: "Simulation results",
    title_ja: "シミュレーションの結果",
    summary: "Set the options of simulate and take the time series, variables and controller signals out of ResultODE.",
    summary_ja: "simulate のオプションを指定し、結果 ResultODE から時系列・変数・制御器の信号を取り出します。"
  },
  {
    step: "7",
    file: "Step7_Visualization.mlx",
    title: "Visualization",
    title_ja: "可視化",
    summary: "Draw network diagrams, power-flow figures, time responses and the spring-mass model, and restyle them through the figure object.",
    summary_ja: "系統図、潮流の図、時間応答、ばね質点モデルを描き、図のオブジェクトで見た目を変えます。"
  },
  {
    step: "8",
    file: "Step8_Linearization.mlx",
    title: "Approximate linearization",
    title_ja: "近似線形化",
    summary: "Linearize with get_sys, choose the model type, inputs and outputs, plot the eigenvalues and linearize parts of the network.",
    summary_ja: "get_sys で線形化し、モデルの形・入力・出力を選び、固有値を描き、系統の一部を線形化します。"
  },
  {
    step: "9",
    file: "Step9_OptimalPowerFlow.mlx",
    title: "Optimal power flow",
    title_ja: "最適潮流計算",
    summary: "Set costs and constraints, run ELD, DC OPF and AC OPF, and read the binding constraints and the LMP.",
    summary_ja: "費用と制約を設定して ELD・DC OPF・AC OPF を解き、効いている制約と LMP を読みます。"
  },
  {
    step: "10",
    file: "Step10_ContinuationPowerFlow.mlx",
    title: "Continuation power flow",
    title_ja: "連続潮流計算",
    summary: "Run calculate_continuation_powerflow, read ResultCPF, plot the PV curve and handle the operating limits.",
    summary_ja: "calculate_continuation_powerflow を実行し、ResultCPF を読み、PV カーブを描き、運転制約を扱います。"
  },
  {
    step: "11",
    file: "Step11_Setting.mlx",
    title: "Settings",
    title_ja: "設定",
    summary: "Read the default options with GUILDA.config, change them with GUILDA.setting, and override them in a call.",
    summary_ja: "既定のオプションを GUILDA.config で読み、GUILDA.setting で変え、呼び出しごとに上書きします。"
  },
  {
    step: "12",
    file: "Step12_DataIO.mlx",
    title: "Data import and export",
    title_ja: "データの入出力",
    summary: "Export a network and its scenarios to a folder, import it again or from MATPOWER, and export the results.",
    summary_ja: "系統モデルとシナリオをフォルダに書き出して読み込み直し、MATPOWER からも読み込み、結果を書き出します。"
  }
];

// Reference material in _GUILDAtutorial, listed under the Steps.
// file: path under _GUILDAtutorial (a folder ends with "/"); title/summary: *_ja for Japanese.
const tutorialReferenceData = [
  {
    file: "Supplement_CheetSheet.mlx",
    title: "Command cheat sheet",
    title_ja: "コマンド早見表",
    summary: "The common commands, from defining a network to linearization, on one page.",
    summary_ja: "系統モデルの定義から近似線形化まで、よく使うコマンドを一つにまとめています。"
  },
  {
    file: "Supplement_Tools.mlx",
    title: "Useful tools",
    title_ja: "便利な機能",
    summary: "Show a summary of the network in tables, search the classes, and find where to start a new model.",
    summary_ja: "系統モデルの概要を表で一覧する方法と、クラスの検索を紹介し、新しいモデルを作るときの手がかりを示します。"
  },
  {
    file: "ClassManual/",
    title: "Model manuals",
    title_ja: "モデルの解説",
    summary: "The models of branches, buses, generators, loads and controllers such as the AGC and LQR.",
    summary_ja: "ブランチ、母線、発電機、負荷、AGC や LQR などの制御器のモデルを解説します。"
  }
];
