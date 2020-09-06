import express from "express";
import * as nunjucks from "nunjucks";
import db from "./database/db";
import proffy from "./database/proffy";
import time from "./etc/time";
import * as types from "./etc/types";
import localtunnel from "localtunnel";

const server = express();
const subjects = [
  "Artes",
  "Biologia",
  "Ciências",
  "Educação Física",
  "Física",
  "Geografia",
  "História",
  "Álgebra",
  "Português",
  "Química",
];
const weekdays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

nunjucks.configure("public", {
  express: server,
  noCache: true,
});

const serv = server
  .use(express.static("public"))

  .get("/study", (req, res) => {
    db.then(
      (dataBase) => {
        proffy.getAll(dataBase).then(
          (proffys) => {
            res.render("study.html", {
              proffys: proffys.proffys,
              classes: proffys.classes,
              filters: req.query,
              is_not_searching:
                !req.query.time || !req.query.weekday || !req.query.subject,
              subjects,
              weekdays,
              time_fun: time.parseTime,
            });
          },

          (error) => console.error(error)
        );
      },

      (error) => console.error(error)
    );
  })

  .get("/give-classes", (req, res) => {
    if (req.query.name) {
      const { ...query } = req.query as types.Proffy;

      db.then((db) => {
        proffy
          .create(db, {
            ...query,
            time_from: time.parseTime(query.time_from),
            time_to: time.parseTime(query.time_to),
          })
          .then(console.log);
      });

      /* proffys.push({
        ...query,
        time_from: time.parseTime(query.time_from),
        time_to: time.parseTime(query.time_to),
      }); */

      return res.redirect("/study");
    }

    res.render("give-classes.html", { weekdays, subjects });
  })

  .listen(5631)
  .address() as import("net").AddressInfo;

localtunnel(serv.port, { subdomain: "levip" }).then((tunnel) =>
  console.log(`
  Server running...

  //IP Address: ${serv.address}
  //Port: ${serv.port}
  //URL: ${tunnel.url}`)
);
