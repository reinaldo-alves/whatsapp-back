<h1 align="center">WhatsApp Web Clone | by Reinaldo Alves</h1>

## Sobre o projeto

WhatsApp Web Clone é um chat em tempo real inspirado no WhatsApp. Este sistema permite que os usuários criem contas com nome, email, senha e foto de perfil e façam login por meio desta conta. Uva vez logado, o usuário pode iniciar conversas com qualquer um que também esteja online, também pode criar chats em grupos e adicionar outros usuários nesses grupos. Para construir a interface do WhatsApp Web Clone, foi utilizado o framework **React** com **TypeScript** e **Styled Components**, enquanto que para o back-end foi utilizado **Node.js** com requisições através do **Socket.IO**, tecnologia baseada em web sockets que permite troca de informações em tempo real entre o servidor e os diversos clients conectados.

## Como utilizar o sistema?

### Preparando o ambiente

Para que o WhatsApp Web Clone possa funcionar na sua máquina, você precisa ter as ferramentas **Node.js** e o **Git** instaladas. Caso ainda não tenha, acesse os links abaixo para instalar.

- Node.js: https://nodejs.org/
- Git: https://git-scm.com/downloads/

Você também precisa rodar o sistema em um navegador sem CORS. Pesquise como fazer isto para seu sistema operacional e seu navegador. Caso esteja usando o Google Chrome no Windows, basta criar um atalho no desktop com o seguinte caminho `"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=%LOCALAPPDATA%\Google\chromeTemp`. 

### Instalando o sistema

Acesse o terminal do seu sistema operacional e navegue até o diretório onde deseja instalar o sistema. Em seguida, digite os seguintes comandos para clonar os repositórios do front-end e do back-end.

- Front-end: `git clone https://github.com/reinaldo-alves/whatsapp-front.git`
- Back-end: `git clone https://github.com/reinaldo-alves/whatsapp-back.git`

Após a clonagem, navegue até a pasta onde foi instalado o front-end e execute o comando `npm install` para instalar as dependências do projeto. Em seguida, repita o mesmo procedimento para o back-end.

### Executando o projeto

No terminal, navegue até a pasta do back-end e execute o seguinte comando `npm start`. O servidor estará funcionando quando a mensagem `Servidor rodando na porta 4000` for exibida no terminal.

Em seguida, abra outra aba ou janela do terminal, navegue até a pasta do front-end e execute o comando `npm start` para executar o projeto.

Por fim, clique no atalho criado para rodar o navegador sem CORS e acesse endereço http://localhost:3000 para começar a usar o WhatsApp Web Clone.

OBS: certifique-se de que as portas 3000 e 4000 estejam livres em sua máquina.

## Contribua com o WhatsApp Web Clone:

Se você tiver alguma dúvida, encontrar algum problema ou quiser fazer uma sugestão para melhorar a aplicação, abra uma issue neste repositório ou entre em contato por email ou pelas redes sociais:
- [E-mail](mailto:reinaldoasjr8@gmail.com)
- [Instagram](https://www.instagram.com/reinaldo.alves8/)
- [Linkedin](https://www.linkedin.com/in/reinaldo-alves-8639aba9/)
