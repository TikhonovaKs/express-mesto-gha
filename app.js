const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");

const app = express();

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

// устанавливает middleware для парсинга JSON-тела запросов
app.use(express.json());

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: "64832af204556254303a9e8e",
  };

  next();
});

// регистрирует маршруты, определенные в router, в приложении Express
app.use(router);

app.listen(3000, () => {
  console.log("I am listening port 3000");
});
