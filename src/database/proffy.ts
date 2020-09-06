import * as types from "../etc/types";

async function create(
  db: import("../../sqlite-async/sqlite-async"),
  proffy: import("../etc/types").Proffy
) {
  try {
    let insertedProffy = await db.run(`
        INSERT INTO proffys (
            name,
            avatar,
            whats,
            bio
        ) VALUES (
            "${proffy.name}",
            "${proffy.avatar}",
            "${proffy.whats}",
            "${proffy.bio}"
        );
    `);

    let insertedClass = await db.run(`
            INSERT INTO classes (
                subject,
                cost,
                proffy_id
            ) VALUES (
                "${proffy.subject}",
                "${proffy.cost}",
                ${insertedProffy.lastID}
            );
    `);

    let insertedClassScheduleValues = await Promise.all(
      proffy.weekday.map((value, index) =>
        db.run(`
            INSERT INTO class_schedule (
                class_id,
                weekday,
                time_from,
                time_to
            ) VALUES (
                ${insertedClass.lastID},
                ${value},
                ${proffy.time_from[index]},
                ${proffy.time_to[index]}
            );
        `)
      )
    );

    return { insertedProffy, insertedClass, insertedClassScheduleValues };
  } catch (err) {
    throw err;
  }
}

async function getAll(db: import("../../sqlite-async/sqlite-async")) {
  return {
    proffys: (await db.all(`
      SELECT * FROM 'proffys';
    `)) as types.ProffyQuery[],
    classes: {
      class: (await db.all(`
        SELECT * FROM 'classes';
      `)) as types.ClassQuery[],
      schedule: (await db.all(`
        SELECT * FROM 'class_schedule';
      `)) as types.ScheduleQuery[],
    },
  };
}

export default { create, getAll };
