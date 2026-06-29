import { useState } from 'react';
import Editor from "@monaco-editor/react";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import './App.css';
import Auth from "./pages/Auth";

// Boilerplate starter code configs for different languages
const LANGUAGE_TEMPLATES = {
  javascript: `function sum() {\n  return 1 + 1;\n}`,
  python: `def sum():\n    return 1 + 1`,
  cpp: `#include <iostream>\n\nint sum() {\n    return 1 + 1;\n}`
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  
  // Track selected language and current code input
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handles updating both language selection and changing default boilerplate
  function handleLanguageChange(e) {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(LANGUAGE_TEMPLATES[selectedLang]);
  }

  async function reviewCode() {
    setIsLoading(true);
    try {
      // Sent both code body and language meta data to the backend API endpoint
      const response = await axios.post('http://localhost:3000/ai/get-review', { 
        code, 
        language 
      });
      setReview(response.data);
    } catch (error) {
      setReview("### ❌ Error\nFailed to fetch review from the server.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogin() {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* --- NAVBAR --- */}
      <header className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🤖</span>
          <h1>AI Code Reviewer</h1>
        </div>
        
        {/* Language Selection Selector Dropdown */}
        <div className="language-selector-wrapper">
          <label htmlFor="language-select">Language:</label>
          <select 
            id="language-select" 
            value={language} 
            onChange={handleLanguageChange}
            className="lang-dropdown"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <nav className="nav-actions">
          <button className="nav-btn active">New Review</button>
          <button className="nav-btn">History</button>
          <button className="nav-btn">Settings</button>
          <button className="nav-btn btn-logout" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="workspace">
        <div className="left">
          <div className="code">
            <Editor
              height="100%"
              language={language} // Dynamically bound editor syntax parsing
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontFamily: "Fira Code, monospace"
              }}
            />
          </div>
          
          <button
            onClick={reviewCode}
            className="review"
            disabled={isLoading}
          >
            {isLoading ? "⏳ Reviewing..." : "🚀 Review Code"}
          </button>
        </div>

        <div className="right">
          {review ? (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          ) : (
            <div className="placeholder-text">
              Click "Review Code" to generate your AI feedback report here.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;