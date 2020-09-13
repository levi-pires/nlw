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
  const proffys = (await db.all(
    "SELECT * FROM 'proffys'"
  )) as types.ProffyQuery[];

  return await Promise.all(
    proffys.map(async (item) => {
      const claz = (await db.get(
        `SELECT * FROM 'classes' WHERE proffy_id = ${item.id}`
      )) as types.ClassQuery;

      return {
        proffy: item,
        class: {
          this: claz,
          schedule: (await db.all(
            `SELECT * FROM 'class_schedule' WHERE class_id = ${claz.id}`
          )) as types.ScheduleQuery[],
        },
      };
    })
  );
}

function has(
  item: {
    proffy: types.ProffyQuery;
    class: {
      this: types.ClassQuery;
      schedule: types.ScheduleQuery[];
    };
  },
  { time, weekday, subject }: { time: number; weekday: string; subject: string }
) {
  return (
    item.class.schedule.some(
      (item) =>
        item.weekday == weekday &&
        item.time_from <= time &&
        item.time_to >= time
    ) && item.class.this.subject == subject
  );
}

export default { create, getAll, has };
