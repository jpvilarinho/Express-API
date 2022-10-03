Uma simples API REST feita em Node.js

Endpoints da API

| Métodos     | URLs             |Descrição                       |
| ----------- | -----------      | -----------                    |
| GET         | api/employees    |Lista todos os empregados       |
| GET         | api/employees/id |Lista um empregado específico   |
| POST        | api/employees    |Cria um novo empregado          |
| PUT         | api/employees/id |Atualiza um empregado existente |
| DELETE      | api/employees/id |Exclui um empregado existente   |


Passos a serem seguidos:

1º Clonar o repositório.
https://github.com/jpvilarinho/Express-API.git
cd express-api

2º Criar o arquivo .env com as seguintes informações:

```
    DB_URL = localhost/my-employees
    TEST_DB_URL = localhost/test-my-employees
    PORT = 5000
```

3º Instalar as dependências com o seguinte comando no terminal:

```
npm install
```

4º Para iniciar o servidor, rodar o seguinte comando no terminal:

```
npm run dev
```