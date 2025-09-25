const database = "test";

const collection = "messages";

use(database);

//Mensagens listadas por data e hora de envio:
// db["messages"].find().sort({dataHora: 1});

//Mensagens listadas inversamente:
// db["messages"].find().sort({dataHora: -1});

//Procura por um trecho da mensagem
db["messages"].find({"mensagem":/aniversário/i});