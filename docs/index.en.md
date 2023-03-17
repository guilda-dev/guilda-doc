
<!-- h2: align-center$set -->
<!-- heading: no-link -->
# 　

This site is the official documentation site of GUILDA.

<!-- heading: use-hash#what-is-guilda -->
## What is GUILDA?

@[imgCentered](src="/Figures/GUILDAicon.png", width="70%")

GUILDA is a smart energy management algebraic simulator developed by Ishizaki Lab. and Assist. Prof. Kawaguchi, Gunma Univ.
It aims to provide an algebraic simulation environment that only requires minimum amount of E&E knowledge for the students and researchers in system & control area.
With the dense connection to the textbook (published early 2023, Corona-Sha), it is made possible to learning mathematical fundaments and simulation environment's usage in parallel.

このような活動を通して、電力システムを身近なベンチマークモデルの1つとしてシステム制御分野に定着させることにより、本分野の技術や知見が電力システム改革を推進する一助となることを目指しています。

## Models of GUILDA

GUILDAを構築する背景に使われている数理モデル等は上述した教科書の内容に即しており、こちらで紹介された理論をもとに解析に必要な一連の実行処理をプロシージャとして整理した形に構築されたものとなっています。大まかな電力システムの構成については以下にある 【電力システムって何で構成されているの？】 のページでも紹介していますので、こちらも参考にしてみてください。細かな数理モデルや状態空間モデルに関する数式も要所々々で紹介していますが、体系的に理解したい場合は教科書をご参照ください。

---

## Building Blocks of Power System

電力システムの構成について簡単に説明します。
@[imgLink](src="/Figures/index-3.jpg", href="aboutPowerSystem/0TopPage")

## Environment Settings

公開ソースコードのダウンロード及び環境設定について解説します。
@[imgLink](src="/Figures/set_GUILDA.jpeg", href="/SetEnvironment/0TopPage")

## Example by a Simple Model

テキストで紹介されていた3母線システムを解析対象として、そのモデルを本シミュレータ上で実装し実際にシミュレーションを実行し応答を見てみます。定義してから解析するまでの流れが１本のストーリーとなるよう構成しています。初めてGUILDAを触れる方はこちらを参考に全体の流れを掴んでいただければと思います。

@[imgLink](href="/SeriesAnalysis/0TopPage", src="/Figures/tuto-withText.jpg")

## References

モデル実装及び解析の実行を、各ステップごとに解説していきます。具体的には解析を行うにあたり使用するメソッドの使用方法や、新たな機器・制御器モデルをクラスとして定義する方法について解説します。
@[imgLink](href="/Reference/0TopPage.md", src="/Figures/tuto-newSystem.jpg")

## Source Code

@[imgLink](href="/SourceCode/0TopPage", src="/Figures/index-4.jpg")

## UI-based Operations

@[imgLink](href="/SourceCode/0TopPage", src="/Figures/index-GUI.jpg")

## Requirements

このシュミレータを動かすにあたって必要なToolbox。

- Optimization Toolbox
- Control System Toolbox
- Robust Control Toolbox
