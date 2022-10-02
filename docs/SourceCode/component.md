# バスに接続する機器について

[]( power_networkのリンクを入れる場所は"TODO_link" を挿入しておく )

## バスに接続する機器について取り扱っているチュートリアル

- [電力系統モデルの構成機器](../aboutPowerSystem/0TopPage.md)
- [一連の解析実行例](../SeriesAnalysis/0TopPage.md)
- [新たな機器モデルの定義](../Reference/defineNet/NewComponent.md)

## component

全てのComponentクラスの基底クラス

### 抽象メソッド
- **`set_equilibrium(Veq, Ieq)`**<br>
    componentの内部状態の平衡点を求めるメソッド<br>
    潮流計算で決定された電圧フェーザや電流フェーザから、各発電機の内部状態や各負荷のインピーダンス値を逆算するプロセス（テキストの3.1.2のステップBにあたる）
    - 入力変数　`Veq`：componentが接続された母線の電圧の平衡点（複素数値）
    - 入力変数　`Ieq`：componentが接続された母線の電流の平衡点（複素数値）

- **`nu = get_nu(varargin)`**<br>
    入力数を取得するメソッド  
    入力は任意だが、基本的には要らない

- **`[dx, constraint] = get_dx_constraint(t, x, V, I, u)`**
    状態の時間微分値と制約条件の出力
    - 入力変数 `t`：時刻
    - 入力変数 `x`：componentの内部状態
    - 入力変数 `V`：componentが接続された母線の電圧フェーザ（[実部;虚部]のベクトル）
    - 入力変数 `I`：componentが接続された母線の電流フェーザ（[実部;虚部]のベクトル）
    - 入力変数 `u`：外部入力
    - 出力変数 `dx`：componentの内部状態の時間微分値
    - 出力変数 `constraint`：制約条件（入力引数の電流フェーザと、内部状態と電圧フェーザから求まる電流フェーザとの差）

### メソッド
- **`nx = get_nx(obj)`**  
    componentの内部状態の数を取得するメソッド  
    入力引数は要らない
    - 出力引数 `nx`：componentの内部状態数
  

## component_empty

空の機器の実装（ ***component*** クラスの派生クラス）


## generator_1axis

１軸発電機モデルの実装（ ***component*** クラスの派生クラス）
### メンバ変数
- parameter：
    発電機のパラメータ（配列）  
    - `Xd, Xq`：（それぞれ d, q 軸周りの）同期リアクタンス
    - `Xd_prime`：（d軸周りの）過渡リアクタンス
    - `T`：d軸周りの回路時定数
    - `M`：慣性定数
    - `D`：制動係数
- x_equilibrium：
    発電機の内部状態の平衡点
    - `delta`：回転子偏角δ
    - `omega`：角周波数偏差Δω
    - `E`：内部電圧E
    - `x_avr`：AVRの状態
    - `x_gov`：governorの状態
    - `x_pss`：PSSの状態
    以上の要素が発電機ごとに並んだベクトル
- V_equilibrium：母線の電圧フェーザの平衡点(複素数値)
- I_equilibrium：母線の電流フェーザの平衡点(複素数値)
- avr：AVRのクラス  
メソッドset_avrで発電機に接続するAVRを設定できる<br>
avrクラスのメンバ変数は以下の通り
    - `Ka`：AVRゲイン
    - `Te`：励磁機時定数
- governor：governorのクラス
- pss：PSSのクラス  
メソッドset_pss発電機に接続するPSSを設定できる<br>
PSSクラスの変数は以下の通り
    - `Kpss`：PSSゲイン
    - `Tpss`：washoutフィルターの時定数
    - `TL1p, TL1`：第一ステージの位相進み遅れ時定数
    - `TL2p, TL2`：第一ステージの位相進み遅れ時定数
- omega0：基準角周波数

### メソッド
#### **`obj = generator_1axis(omega, parameter)`**
- 入力引数 `omega`：基準角周波数
- parameter：発電機のパラメータ（先述） 

## load_impedance

定インピーダンス負荷の実装（ ***component*** クラスの派生クラス）

### メソッド
**`obj = load_impedance(varargin)`**

平衡点電圧・電流からインピーダンス値を決定される<br>
引数は不要