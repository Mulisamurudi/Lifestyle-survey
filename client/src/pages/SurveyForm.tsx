import React, { useState } from 'react';
import api from '../../api';

const initialRatings = {
  rate_eat_out: 0,
  rate_watch_movies: 0,
  rate_watch_tv: 0,
  rate_listen_radio: 0
};

const SurveyForm = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    age: '',
    date_of_survey: '',
    favourite_foods: [] as string[],
    ...initialRatings
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const foodOptions = ['Pizza', 'Pasta', 'Pap and Wors', 'Chicken Stir Fry', 'Beef Stir Fry', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (food: string) => {
    setForm(prev => ({
      ...prev,
      favourite_foods: prev.favourite_foods.includes(food)
        ? prev.favourite_foods.filter(f => f !== food)
        : [...prev.favourite_foods, food]
    }));
  };

  const handleRatingChange = (name: string, value: number) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
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
    } = form;

    if (!full_name || !email || !age || !date_of_survey) return 'All fields are required.';
    if (+age < 5 || +age > 120) return 'Age must be between 5 and 120.';
    if (favourite_foods.length === 0) return 'Select at least one favourite food.';
    if (![rate_eat_out, rate_watch_movies, rate_watch_tv, rate_listen_radio].every(n => n >= 1 && n <= 5))
      return 'Please select a rating from 1 to 5 for all questions.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    try {
      await api.post('/', {
        ...form,
        age: Number(form.age),
        favourite_foods: form.favourite_foods
      });
      setSuccess('Survey submitted successfully!');
      setError('');
      setForm({ full_name: '', email: '', age: '', date_of_survey: '', favourite_foods: [], ...initialRatings });
    } catch (err) {
      setError('Failed to submit survey. Try again.');
    }
  };

  return (
    <div className="survey-container">
      <h2>Fill Out Survey</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Personal Info */}
        <fieldset>
          <legend>Personal Information</legend>
          <div className="form-group">
            <label>Full Name:</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Date of Survey:</label>
            <input name="date_of_survey" type="date" value={form.date_of_survey} onChange={handleChange} />
          </div>
        </fieldset>

        {/* Favourite Foods */}
        <fieldset>
          <legend>Favourite Foods (select all that apply)</legend>
          <div className="checkbox-group">
            {foodOptions.map(food => (
              <label key={food} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.favourite_foods.includes(food)}
                  onChange={() => handleCheckboxChange(food)}
                />
                {food}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Ratings Table */}
        <fieldset>
          <legend>Rate how often you do the following (1 = Never, 5 = Always)</legend>
          <div className="ratings-table-container">
            <table className="ratings-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  {[1, 2, 3, 4, 5].map(n => (
                    <th key={n}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Eat Out', key: 'rate_eat_out' },
                  { label: 'Watch Movies', key: 'rate_watch_movies' },
                  { label: 'Watch TV', key: 'rate_watch_tv' },
                  { label: 'Listen to Radio', key: 'rate_listen_radio' }
                ].map(({ label, key }) => (
                  <tr key={key}>
                    <td>{label}</td>
                    {[1, 2, 3, 4, 5].map(num => (
                      <td key={num}>
                        <input
                          type="radio"
                          name={key}
                          value={num}
                          checked={form[key as keyof typeof form] === num}
                          onChange={() => handleRatingChange(key, num)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Submit Survey</button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
