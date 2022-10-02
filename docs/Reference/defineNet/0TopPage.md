<img src="../../../Figures/index-1.jpg" width=100%;>

# <div style="text-align: center;"><span style="font-size: 120%; color: black;">解析する電力ネットワークを作成する</span></div>

***
GUILDAでは電力ネットワークの情報をクラスを用いてパラメータをプロパティに格納し、各種の解析実行処理をmethodとしてモジュール化しています。この電力系統モデルを実装したクラスをGUILDAでは`power_network`というクラス名で定義しています。以降の解説ではこの`power_network`クラスを格納した変数を`net`としてコード解説していきます。

<div style="text-align: center;"><span style="font-size: 140%; color: black;">
本ページではこの変数netを定義することが目標となります。
</span></div>  
<br>


電力系統モデルを定義したpower_networkクラスのメンバ変数の構造については、[ソースコード解説ページ](../../SourceCode/0TopPage.md)を参照して下さい。


<br>


# __【power_networkクラスの定義方法】__
### __・既存のモデルを使う方法__

GUILDAでは以下のように実行することで既に作成されている電力系統モデルを呼び出すことができます。  

```matlab
net = network_sample3bus;  %3busモデルの情報をnetに格納する場合
net = network_IEEE68bus; %IEEE68busモデルの情報をnetに格納する場合
```

以降では新たな電力系統モデルを作成し`power_network`クラスとして定義するための設定方法を説明していきますが、上記のコマンドは既に作成された電力系統モデルを定義する一連のコマンドを記した関数ファイルを呼び出していることになります。  
</br>

### __・新しい電力系統モデルの実装__
現在GUILDAでは、同期発電機の機器として`generator_1axis`、負荷の機器として`load_impedance`というクラスが実装されています。この節では、これらの既に実装されている機器モデルを利用して新たな電力系統モデルを実装する方法を解説します。<br>__↓clickして解説ページへ__  
[<div align="center"><img src="../../../Figures/make_power_net.jpg" width=80%; style="border: 7px Gray solid;"></div>](./NewPowerNetwork.md)
</br>

### __・新たな機器クラスの定義__
上の節では、GUILDA上で実装されている`generator_1axis`、と`load_impedance`などの、既にGUILDA上に実装されているクラスのみで電力系統モデルを実装することを考えていましたが、本節では新たな動特性を持った機器モデルを実装する方法を解説します<br>__↓clickして解説ページへ__  
[<div align="center"><img src="../../../Figures/make_component.jpg" width=80%; style="border: 7px DarkSeaGreen solid;"></div>](./NewComponent.md)

<br><br><br>
