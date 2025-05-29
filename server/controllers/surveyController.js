import db from '../db.js';

export const submitSurvey = async (req, res) => {
  try {
    const {
      full_name,
      email,
      age,
      date_of_survey,
      favourite_foods,
      rate_eat_out,
      rate_watch_movies,
      rate_watch_tv,
      rate_listen_radio
    } = req.body;

    await db.query(
      `INSERT INTO surveys 
      (full_name, email, age, date_of_survey, favourite_foods, rate_eat_out, rate_watch_movies, rate_watch_tv, rate_listen_radio)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        full_name,
        email,
        age,
        date_of_survey,
        favourite_foods,
        rate_eat_out,
        rate_watch_movies,
        rate_watch_tv,
        rate_listen_radio
      ]
    );

    res.status(201).json({ message: 'Survey submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getSurveyStats = async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM surveys');
    const total = rows.length;

    if (total === 0) return res.json({ message: 'No Surveys Available' });

    const ages = rows.map(r => r.age);
    const avgAge = (ages.reduce((a, b) => a + b, 0) / total).toFixed(1);
    const oldest = Math.max(...ages);
    const youngest = Math.min(...ages);

    const pizzaFans = rows.filter(r => r.favourite_foods.includes('Pizza')).length;
    const pizzaPercent = ((pizzaFans / total) * 100).toFixed(1);

    const avgEatOut = (
      rows.reduce((sum, r) => sum + r.rate_eat_out, 0) / total
    ).toFixed(1);

    res.json({
      total,
      avgAge,
      oldest,
      youngest,
      pizzaPercent,
      avgEatOut
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
