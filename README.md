# play-native-messaging-with-sea

Chrome Extension の Native Messaging 機能を使用するアプリケーションです。
Node.js の SEA (Single executable applications) 機能を利用して、ネイティブホストアプリケーションを単一の実行ファイルにパッケージ化しています。

基本的には [browser-extension](./browser-extension/) ディレクトリ以下と、 [native-host](./native-host/) ディレクトリ以下のコードを見ると良い。

native-host を開発していると、実際に JSON を飛ばしたりして動作確認したくなるケースが出てくるため、[native-host-client](./native-host-client/) ディレクトリ以下に、native-host と同じインターフェースを持つクライアントアプリケーションを用意している。
