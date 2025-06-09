import React from "react";

import ItemForm from "./ItemForm";

const Marks = ({ setForm, formData, navigation }) => {
  const { s4marks, s5marks,s6marks} = formData;

  const { previous, next } = navigation;

  return (
    <div className="form">
        <h4>Marks</h4>
      <ItemForm
        label="Senior Four Marks"
        name="s4marks"
        value={s4marks}
        onChange={setForm}
      />
      <ItemForm
        label="Senior Five Marks"
        name="s5marks"
        value={s5marks}
        onChange={setForm}
      />
      <ItemForm
        label="Senior Six Marks"
        name="s6marks"
        value={s6marks}
        onChange={setForm}
      />
      <div>
        <button onClick={previous}>Previous</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default Marks;
