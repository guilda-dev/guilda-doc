<img src="../../Figures/index-3.jpg" width=100%;>

# <div style="text-align: center;"><span style="font-size: 130%; color: black;">電力ネットワークの構成について</span></div>

### <div style="text-align: center;"><span style="font-size: 130%; color: black;">【電力システムとはどのようなもの？】</span></div>
シミュレーションを行う前に本シミュレータで扱う電力系統モデルの構成を紹介させていただきます。ここでは、GUILDAで既に実装されているIEEE68busモデルを例に解説していきます。  

<div style="text-align: center;">
<span style="font-size: 160%; color: black;">IEEE68busモデル</span>
<img src="../../Figures/IEEE68bus.png" width=80%;>
</div>

<br>

このモデルは以下のものによって構成されています。

- 68個の母線(図中のBus)
- 16個の発電機(図中のGen)
- 35個の負荷(図中の▼)
- そして各母線どうしをつなぐブランチ(各母線間を繋ぐ線ー)  
---
では、これらの各構成要素について順番に説明していきます。

### <div style="text-align: center;"><span style="font-size: 130%; color: black;">【母線(バス)とは？】</span></div>
母線とは発電機や負荷と送電網の中継点の様なものです。  
電力の需給バランスを決定する潮流計算では、この母線に送られてくる(逆に送り出される)有効電力Pと無効電力Q、さらに各母線での電圧の大きさ|V|、位相∠Vを考えることで所望の需給バランスを実現させるパラメータを導出していきます。

<br><br>

### <div style="text-align: center;"><span style="font-size: 130%; color: black;">【ブランチとは？】</span></div>
母線間の送電線のことです。現実世界の電線にあたります。

<br><br>

### <div style="text-align: center;"><span style="font-size: 130%; color: black;">【コンポーネントという概念は？】</span></div>
コンポーネントとはその名の通り「機器」のことです。具体的には「発電機」や「負荷」などの母線に付加するものたちの総称のことです。GUILDAではこれらの機器群を`component`というクラスで定義しているため、ここではコンポーネントと書かせていただきます。コードを参照していただくと、その子クラスに負荷や発電機のクラスが定義されていることがわかると思います。  

<div style="text-align: center;">
<img src="../../Figures/intro-1.jpg" width=60%;>
</div>

* コンポーネントの枠に発電機が付加されたものを**発電機母線(バス)**と呼びます。  
    発電機母線は一般的にPVバスに分類されますが、電力ネットワーク内の発電機母線のうち1つだけslackバスという特別な母線が存在します。  
* コンポーネントの枠に負荷が付加されたものを**負荷母線(バス)**と呼びます。  
    負荷母線は一般にPQバスに分類されます。  
* またコンポーネントの枠に何も付加されていない母線も存在し、**non-unit母線(バス)**と呼びます。送電線と送電線の中継点としての役割のみを担います。  
     この母線は負荷母線の負荷の値が無限大としたときと同じとみなせるためPQバスに分類されます。  


<br><br>

### <div style="text-align: center;"><span style="font-size: 130%; color: black;">【PVバス、PQバス、slackバスって？？】</span></div>
母線についての説明の際にも触れましたが、潮流計算では各母線に送られてくる(逆に送り出される)有効電力Pと無効電力Qと、各母線の電圧の大きさ|V|,位相∠Vの計4つのパラメータ、n個の母線で構成された電力ネットワークならば、計４n個のパラメータを考えます。当然この中のいくつかのパラメータを指定しないと、他のパラメータは一意に定まりません。そのため各母線の4つのパラメータのうちいくつかのパラメータを指定します。  
この指定するパラメータが

- 有効電力Pと無効電力Qの母線を`PQバス`
- 有効電力Pと電圧の大きさ|V|の母線を`PVバス`
- 電圧の大きさ|V|と電圧の位相∠Vの母線を`slackバス`

といいます。  
  
潮流計算では一般に各母線の電圧の位相差は求まりますが、各母線の位相は一意に定まりません。そのため電力ネットワークに電圧の位相角を指定するslackバスという母線を置くことで、各母線の電圧の位相を一意に定められるようにしているのです。逆にslackバスを複数定義してしまうと、今度は全ての指定したパラメータを満たす解がないということが起きえてしまいます。そのためslackバスは全母線で１つだけになっているのです。  


<br><br>

### <div style="text-align: center;"><span style="font-size: 130%; color: black;">【電力系統モデルの求め方】</span></div>

電力システムをモデリングする際、大きく分けて２つのシステムに分けて考えます。１つ目が送電線によって定められる代数方程式モデル。２つ目が各母線と機器の間に成り立つ微分代数方程式モデルです。  
電力系統全体のモデルは、各母線に接続された機器が動的なダイナミクスを持ち、それらの機器が送電網の代数方程式により相互接続されることで相互に影響を与え合うような動特性を持った一つのシステムとして働いているのです。

<div style="text-align: center;">
<img src="../../Figures/intro-2.jpg" width=80%;>
</div>
<br><br><br>
