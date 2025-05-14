import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSettings } from "react-icons/fi";
import { PiBirdFill } from "react-icons/pi";

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

  const [isRunning, setIsRunning] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);

  const addLog = (message) => {
    setLogMessages((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

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

  const sendTweet = async () => {
    const payload = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) payload.append(key, formData[key]);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/tweet/", payload);
      addLog("✅ Tweet sent successfully");
    } catch (error) {
      addLog("❌ Failed to send tweet: " + error);
      stopBot();
    }
  };

  const startBot = () => {
    if (isRunning) return;
    setIsRunning(true);
    addLog("🟢 Bot started");
    setSecondsLeft(formData.wait_time);

    sendTweet(); // Initial send

    intervalRef.current = setInterval(() => {
      sendTweet();
      setSecondsLeft(formData.wait_time);
    }, formData.wait_time * 1000);
  };

  useEffect(() => {
    let countdown;
    if (isRunning) {
      countdown = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isRunning]);

  const stopBot = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    addLog("🔴 Bot stopped");
  };

  const exportKeys = () => {
    const keys = {
      api_key: formData.api_key,
      api_secret: formData.api_secret,
      bearer_token: formData.bearer_token,
      access_token: formData.access_token,
      access_token_secret: formData.access_token_secret,
      random_string: formData.random_string,
    };
    const blob = new Blob([JSON.stringify(keys, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "twitter_keys.json";
    a.click();
  };

  const importKeys = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const imported = JSON.parse(event.target.result);
      setFormData((prev) => ({ ...prev, ...imported }));
    };
    fileReader.readAsText(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4 ">
          <PiBirdFill size={24} color="#2b7fff" />
          <h2 className="text-2xl font-bold"> Tweet Bot</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <FiSettings size={24} />
          </button>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-700 ease-in-out ${
            showSettings ? "max-h-[530px]" : "max-h-0"
          }`}
        >
          {[
            "api_key",
            "api_secret",
            "bearer_token",
            "access_token",
            "access_token_secret",
          ].map((key) => (
            <label>
              <span className="text-sm">{key}</span>
              <input
                key={key}
                name={key}
                value={formData[key] || ""}
                placeholder={key.replaceAll("_", " ")}
                onChange={handleChange}
                className="input"
              />
            </label>
          ))}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="random_string"
              checked={formData.random_string}
              onChange={handleChange}
            />
            <span className="text-sm">Add random string?</span>
          </label>
          <div className="flex gap-4 mb-8">
            <button
              onClick={exportKeys}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Export Keys
            </button>
            <label className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
              Import Keys
              <input
                type="file"
                accept=".json"
                onChange={importKeys}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col space-y-4 mb-8">
          <label>
            <span className="text-sm">Tweet text</span>
            <textarea
              name="content"
              placeholder="Write your tweet here..."
              onChange={handleChange}
              rows="4"
              className="input"
            ></textarea>
          </label>

          <label>
            <span className="text-sm">Wait time (in seconds)</span>
            <input
              type="number"
              name="wait_time"
              value={formData.wait_time}
              onChange={handleChange}
              className="input"
              placeholder="Wait time (in seconds)"
            />
          </label>

          <label>
            <span className="text-sm">Attachement</span>
            <input
              type="file"
              name="media"
              accept="image/*,video/*"
              onChange={handleChange}
              className="input"
            />
          </label>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={startBot}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            Start Bot
          </button>
          <button
            onClick={stopBot}
            disabled={!isRunning}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
          >
            Stop Bot
          </button>
        </div>

        <div className="bg-black rounded">
          <div className="text-green-400 font-mono text-sm p-4 mt-6 h-48 overflow-y-auto">
            {logMessages.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
          <div className="border-t-4 border-green-950 text-green-400 font-mono text-sm p-4 ">
            📟 {isRunning ? `Next in ${secondsLeft}s` : "Idle"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
