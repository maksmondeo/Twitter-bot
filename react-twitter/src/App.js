import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    api_key: "",
    api_secret: "",
    bearer_token: "",
    access_token: "",
    access_token_secret: "",
    wait_time: 30,
    random_string: true,
    content: "",
    media: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) {
        payload.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/tweet/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Tweet submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Tweet submission failed", error);
      alert("Failed to send tweet");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Tweet Bot Config</h2>
      <form onSubmit={handleSubmit}>
        <input name="api_key" placeholder="API Key" onChange={handleChange} required /><br />
        <input name="api_secret" placeholder="API Secret" onChange={handleChange} required /><br />
        <input name="bearer_token" placeholder="Bearer Token" onChange={handleChange} required /><br />
        <input name="access_token" placeholder="Access Token" onChange={handleChange} required /><br />
        <input name="access_token_secret" placeholder="Access Token Secret" onChange={handleChange} required /><br />
        <input name="wait_time" type="number" placeholder="Wait Time (sec)" onChange={handleChange} value={formData.wait_time} /><br />
        <label>
          Add Random String?
          <input name="random_string" type="checkbox" checked={formData.random_string} onChange={handleChange} />
        </label><br />
        <textarea name="content" placeholder="Tweet content..." onChange={handleChange} required /><br />
        <input name="media" type="file" accept="image/*,video/*" onChange={handleChange} /><br /><br />
        <button type="submit">Send Tweet</button>
      </form>
    </div>
  );
}

export default App;
