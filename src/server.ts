import express from "express";
import * as nunjucks from "nunjucks";
import db from "./database/db";
import proffy from "./database/proffy";
import time from "./etc/time";
import * as types from "./etc/types";
import localtunnel from "localtunnel";
import readline from "readline";
import bodyParser from "body-parser";

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

const address = server
  .use(express.static("public"))

  .get("/study", (req, res) => {
    const proffyList: {
      proffyData: types.ProffyQuery;
      subject: string;
      cost: string;
    }[] = [];

    db.then(async (dataBase) => {
      const proffys = await proffy.getAll(dataBase);
      const keys = {
        time: time.parseTime(req.query.time as string),
        weekday: req.query.weekday as string,
        subject: req.query.subject as string,
      };

      if (req.query.weekday && req.query.subject && req.query.time) {
        proffys.forEach((item) => {
          if (proffy.has(item, keys)) {
            proffyList.push({
              proffyData: item.proffy,
              subject: item.class.this.subject,
              cost: item.class.this.cost,
            });
          }
        });
      } else {
        proffys.forEach((item) => {
          proffyList.push({
            proffyData: item.proffy,
            subject: item.class.this.subject,
            cost: item.class.this.cost,
          });
        });
      }

      res.render("study.html", {
        proffyList,
        weekdays,
        subjects,
        filters: req.query,
      });
    });
  })

  .get("/give-classes", (_, res) =>
    res.render("give-classes.html", { weekdays, subjects })
  )

  .post(
    "/give-classes",
    bodyParser.urlencoded({ extended: true }),
    (req, res) => {
      const { ...body } = req.body as types.Proffy;

      db.then((db) => {
        proffy
          .create(db, {
            ...body,
            time_from: body.time_from.map((value) =>
              time.parseTime(value).toString()
            ),
            time_to: body.time_to.map((value) =>
              time.parseTime(value).toString()
            ),
          })
          .then(console.log);

        res.redirect("/study");
      });
    }
  )

  .listen(5631)
  .address() as import("net").AddressInfo;

localtunnel(address.port, { subdomain: "levip" }).then((tunnel) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_, key) => {
    if (key.ctrl && key.name == "c") {
      console.log("\nClosing tunnel...");
      tunnel.close();
      process.exit(0);
    }
  });

  console.log(`
  Server running...

  //IP Address: ${address.address}
  //Port: ${address.port}
  //URL: ${tunnel.url}`);
});
