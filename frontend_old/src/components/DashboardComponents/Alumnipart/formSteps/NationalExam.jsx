import React from "react";

import ItemForm from "./ItemForm";

const NationalExam = ({ setForm, formData, navigation }) => {
  const { ne, maxforne,decision,life_status } = formData;

  const { previous, next } = navigation;

  return (
    <div className="form">
      <h3>National Examination Results </h3>
      <ItemForm label="Maximum Aggregate" name="maxforne" value={maxforne} onChange={setForm} />
      <ItemForm label="Aggregate got" name="ne" value={ne} onChange={setForm} />
      <center>
        <label htmlFor="Decision">
        Decision
        </label>
        <select name="decision" value={decision} onChange={setForm}>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>
      </center>
      <center>
        <label htmlFor="Life_Status">
        Life Status 
        </label>
        <select name="life_status" value={life_status} onChange={setForm}>
          <option value="Alive">Alive</option>
          <option value="Died">Died</option>
        </select>
      </center>
      <div>
        <button onClick={previous}>Previous</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default NationalExam;
