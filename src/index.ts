import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { calculateAge, validateDate } from "./utils.js";

const app = new Hono();

app.use("/assets/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  const error = c.req.query("error") || "";

  const errorDay = error.includes("day") ? error : "";
  const errorMonth = error.includes("month") ? error : "";
  const errorYear = error.includes("year") ? error : "";
  const errorDate = error.includes("date") ? error : "";

  const dayValue = c.req.query("day") || "";
  const monthValue = c.req.query("month") || "";
  const yearValue = c.req.query("year") || "";

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="./assets/main.css" />
        <title>Age Calculator App</title>
      </head>
      <body>
        <div class="age-card">
          <div class="container">
            <form action="/" method="POST">
              <div class="form-container">
                <div class="block">
                  <label for="day">Day</label>
                  <input type="number" id="day" name="day" placeholder="DD" value="${dayValue}" required />
                  <small>${errorDay}</small>
                </div>
                <div class="block">
                  <label for="month">Month</label>
                  <input type="number" id="month" name="month" placeholder="MM" value="${monthValue}" required />
                  <small>${errorMonth}</small>
                </div>
                <div class="block">
                  <label for="year">Year</label>
                  <input type="number" id="year" name="year" placeholder="YYYY" value="${yearValue}" required />
                  <small>${errorYear || errorDate}</small>
                </div>
              </div>
              <div class="submit-">
                <hr />
                <button type="submit" class="submit-btn">
                  <img class="arrow" src="assets/images/icon-arrow.svg" alt="icon" width="50" />
                </button>
              </div>
            </form>
            <div class="output-content">
              <h1><span>${c.req.query("years") || "--"}</span> years</h1>
              <h1><span>${c.req.query("months") || "--"}</span> months</h1>
              <h1><span>${c.req.query("days") || "--"}</span> days</h1>
              <h1><span>${c.req.query("hours") || "--"}</span> hours</h1>
              <h1><span>${c.req.query("minutes") || "--"}</span> minutes</h1>
              <h1><span>${c.req.query("seconds") || "--"}</span> seconds</h1>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.post("/", async (c) => {
  const body = await c.req.parseBody();
  const { day, month, year } = body;

  if (!day || !month || !year) {
    return c.redirect(`/?error=All fields are required.`);
  }

  const validation = validateDate(day as string, month as string, year as string);
  if (validation.error) {
    return c.redirect(`/?error=${validation.error}`);
  }

  const { d, m, y } = validation.parsed!;
  const birthDate = new Date(y, m - 1, d);
  const age = calculateAge(birthDate);

  return c.redirect(
    `/?years=${age.years}&months=${age.months}&days=${age.days}&hours=${age.hours}&minutes=${age.minutes}&seconds=${age.seconds}&day=${day}&month=${month}&year=${year}`
  );
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
