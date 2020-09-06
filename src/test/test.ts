import db from "../database/db";
import createProffy from "../database/proffy";

db.then(async (dataBase) => {
  try {
    console.log(
      await createProffy.create(dataBase, {
        name: "Diego Fernandes",
        avatar:
          "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d6",
        whats: "11970283949",
        bio:
          "Entusiasta das melhores tecnologias de química avançada.\n\nApaixonado por explodir coisas em laboratório.",
        subject: "1",
        cost: "20",
        weekday: ["3"],
        time_from: ["796"],
        time_to: ["990"],
      })
    );

    const x = await dataBase.all(`
    SELECT * FROM 'proffys';
  `);

    await dataBase
      .all(
        `
      SELECT * FROM 'classes';
  `
      )
      .then((array) => {
        array.forEach((value) => x.push(value));
      });

    console.log(x);
  } catch (err) {
    console.error(err);
  }
});
