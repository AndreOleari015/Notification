﻿## Sobre o Projeto

Este projeto visa a criação de um template minimo para utilizar o push notification

![Group 1](https://user-images.githubusercontent.com/63087627/231480137-1e9f1440-06fc-41f5-ae6f-1b88d6d29e94.png)

### Pré-Requisitos
- Um servidor local rodando (Explico o porque em [Observações](#observações))
- [Para entender todo o background do app, assista esse video](https://www.youtube.com/watch?v=EaVG6wVZPyY&t=110s)


## Libs usadas
- [expo-notification](https://docs.expo.dev/versions/latest/sdk/notifications/) - Usada para auxiliar exibir as notificações quando o app estiver fechado
- [@react-native-firebase/app](https://rnfirebase.io) - Utilizada para tratar as notificações

### Como usar
Após seguir oque esta descrito nos [Pré-Requisitos](#pr%C3%A9-requisitos), faça o clone utilizando:

```sh
git clone -branch main https://github.com/AndreOleari015/Notification.git
```
### Observações

No código tem uma requição feita para o meu servidor local, o nome da rota é "/send", para cria-la, siga os seguintes passo:
- Instale no seu seu projeto Node o firebase-adimin (Saiba mais sobre a lib em [firebase-admin](https://firebase.google.com/docs/reference/admin/node?hl=pt-br))
```sh
npm install firebase-admin
```
Instancie a lib

```sh
var admin = require("firebase-admin");
```

Após isso ela precisará ser inicializada, para isso siga os seguintes passos:

Va no seu projeto firebase --> icone de configuração --> Configuração do projeto --> Contas de serviço e clique em gerar nova chave privada, renomei ela para "serviceAccountKey.json", cole dentro da raiz do seu projeto e instancie ela no seu prejeto node

```sh
var serviceAccount = require("./serviceAccountKey.json");
```

Agora inicialize ela

```sh
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
```

Após isso, coloque o seguinte código código:

```javaScript
app.post('/send', async (req, res) => {
    await admin.messaging().sendToDevice(
        req.body.token,
        {
            data: {
                title: `${req.body.notification.title}`,
                body: `${req.body.notification.body}`
            },
        },
        {
            contentAvailable: true,
            priority: 'high',
        },
    );
})
```

contentAvailable e priotity são utilizados para priorizar as notificações quando o app estiver fechado

Ai é só rodar o server que vai funcionar

Espero ter ajudado  :)
