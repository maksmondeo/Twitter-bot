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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">🐦 Tweet Bot Config</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="api_key" placeholder="API Key" required className="input" onChange={handleChange} />
          <input type="text" name="api_secret" placeholder="API Secret" required className="input" onChange={handleChange} />
          <input type="text" name="bearer_token" placeholder="Bearer Token" required className="input" onChange={handleChange} />
          <input type="text" name="access_token" placeholder="Access Token" required className="input" onChange={handleChange} />
          <input type="text" name="access_token_secret" placeholder="Access Token Secret" required className="input" onChange={handleChange} />

          <div className="flex gap-4 items-center">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700">Wait Time (sec)</span>
              <input type="number" name="wait_time" value={formData.wait_time} className="input" onChange={handleChange} />
            </label>

            <label className="inline-flex items-center mt-6">
              <input type="checkbox" name="random_string" checked={formData.random_string} onChange={handleChange} className="mr-2" />
              <span className="text-sm">Add random string?</span>
            </label>
          </div>

          <textarea name="content" placeholder="Tweet content..." required rows="4" className="input resize-none" onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Attach Media (optional)</label>
            <input type="file" name="media" accept="image/*,video/*" className="mt-1" onChange={handleChange} />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
            ✈️ Send Tweet
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
