<img src="../../../Figures/index-5.jpg" width=100%;>

# <div style="text-align: center;"><span style="font-size: 130%; color: black;">制御器の付加</span></div>

***

<br>
前の章では電力ネットワークを定義し、その情報を変数`net`に格納する所までできたと思います。
本章では、その変数`net`をクラス内でメソッドとして定義されている関数を用いて、シュミレーションしていきます。まだ変数`net`を定義していない場合は、電力系統モデル作成の[解説ページ](../defineNet/0TopPage.md)を参考にして下さい。  
<br>
<span style="font-size: 110%; color: black;">__本章を始めるにあたって用意するもの：電力ネットワークの情報を格納した変数`net`__</span>  
<br><br>

本GUILDAは __「システム制御分野の学生や研究者を対象とした数値シミュレーション環境を提供すること」__ を目的としていますのでメインユーザーは制御器設計を目的とした方々を想定しています。そのため、本ページでは、

1. 自身の考える制御器モデルをcontrollerクラスとして実装する方法の解説。
2. 定義したcontrollerクラスをpower_networkクラスに付加する。
  
という順で解説を進めていきます。

---

## __【新しい制御器モデルを実装する】__
新たな制御器モデルをGUILDA上に実装する方法を解説します。その際に、実装すべきメソッドやプロパティをまとめています。既にGUILDA上で実装されている制御器モデルを利用する場合は、次の節に進んでいただいて問題ないです。__↓clickして解説ページへ__  
<br>
[<div align="center"><img src="../../../Figures/make_controller.jpg" width=80%; style="border: 7px CornflowerBlue solid;"></div>](./NewController.md)
</br>

## __【２種類のcontrollerクラス】__
GUILDAでは制御機モデルをローカルコントローラとグローバルコントローラの２つに分類しています。

- __local controller__：各機器にローカルに付加する制御器。  
    例)レトロフィットコントローラ
- __global controller__：複数の機器を対象とした制御器。  
    例)AGC

この２つのコントローラはどちらもcontrollerクラスのオブジェクトとして定義されます。違いは、localコントローラは観測値としてglobalコントローラからの指令値を取得することが出来るという点です。コード上ではcontrollerクラスでは`get_dx_u`というメソッドを定義しますが、以下のように呼び出され方が異なります。

- localコントローラの場合は
     ```matlab
     [dx, u] = get_dx_u(obj, t, x, X, V, I, u_global)
     ```
- globalコントローラの場合は
     ```matlab
     [dx, u] = get_dx_u(obj, t, x, X, V, I, [])
     ```

<br>

## __【controllerクラスを電力系統に付加する】__
付加するコントローラがlocalコントローラかglobalコントローラかによって、呼び出す関数が異なりますのでご注意ください。  
まず、初めにローカルコントローラを`con`という名前のインスタンス変数に定義したとします。**(※controllerクラスの定義の仕方は、各関数の実装方法によりますので、使いたいコントローラクラスのdocを参照してください。)**このコントローラを系統に付加する方法は、
```matlab
net.add_controller_local(con);
```
となり、一方でグローバルコントローラを`con`というインスタンス変数として定義した場合、このコントローラを系統に付加する方法は、
```matlab
net.add_controller_global(con);
```
となります。すると、`power_network`クラスの`a_controller_~`のプロパティにcell配列が生成され付加した順番にコントローラクラスの変数が並びます。
<div style="text-align: center;">
<img src="../../../Figures/con_workspace1.jpg" width=100%;>
</div>
以上でコントローラを電力系統に付加することができました。  
また、これらのコントローラを取り除く際は以下の様にできます。
```matlab
% a_controller_localのcell配列の内,1番目のコントローラを取り除きたい場合
net.remove_controller_local(1);
```
```matlab
% a_controller_globalのcell配列の内,3番目のコントローラを取り除きたい場合
net.remove_controller_global(3);
```
<br>

## __【実行例】__
最後に系統に制御機を付加する際の一連の実行例を紹介したいと思います。  
今回は`controller_broadcast_PI_AGC`というコントローラを例に行います。このコントローラはAGCのモデルを実装した制御器モデルですので、発電機の周波数偏差を観測し偏差を0にするよう各発電機に入力を与える制御器になります。このcontrollerクラスの使い方は、
```matlab
con = controller_broadcast_PI_AGC_normal(net, y_idx, u_idx, Kp, Ki);
```
となります。それぞれの引数は以下のようになります。

- 入力引数`net`  
    コントローラを追加する予定のネットワークのインスタンス（ *power_network* クラス）
- 入力引数`y_idx`  
    出力を観測するバスの番号．
- 入力引数`u_idx`  
    入力を印加するバスの番号．
- 入力引数`Kp` `Ki`  
    コントローラのPIゲイン．

では、IEEE68bus電力系統モデルにこのコントローラを孵化してみましょう。IEEE68busモデルは母線1から母線16まで発電機が付加されています。今回は16機全ての発電機から周波数偏差を観測し16機全てに入力を与えるようなコントローラを実装してみます。

- `net = network_IEEE68bus`  
    IEEE68busを実装した`power_network`クラスのインスタンスにコントローラを追加する
- `y_idx = 1:16`  
    母線1~16に接続された同期発電機の周波数偏差を観測する
- `u_idx = 1:16`  
    母線1~16に接続された同期発電機に入力を印加する
- `Kp = -10` `Ki = -500`  
    コントローラのPIゲイン．

```matlab
net = network_IEEE68bus;
con = controller_broadcast_PI_AGC_normal(net, 1:16, 1:16, -10, -500);
net.add_controller_global(con);
```
このようにして、電力系統にコントローラを付加することができました。この電力系統モデルを用いて、次の章(【作成した電力系統モデルの解析を行う】)では、シミュレーションを実行して時間応答を見たり、線形化システムを導出することを行います。

***
<br><br>
