// Import React hooks for managing state and side effects
import { useState, useEffect } from "react";

// Main App component
function App() {
  // State for switching between Problems and Patterns tabs
  const [activeTab, setActiveTab] = useState("problems");

  // State for storing all problems fetched from the backend
  const [problems, setProblems] = useState([]);

  // State for storing all patterns fetched from the backend
  const [patterns, setPatterns] = useState([]);

  // State for the new problem form fields
  const [newProblem, setNewProblem] = useState({
    name: "", difficulty: "Easy", category: "", url: "", notes: "", solution: "", solved: 0,
    date_added: new Date().toISOString().split("T")[0]
  });

  // State for the new pattern form fields
  const [newPattern, setNewPattern] = useState({
    topic: "", description: "", template: "",
    date_added: new Date().toISOString().split("T")[0]
  });

  // Fetch all problems from the backend when the page loads
  useEffect(() => {
    fetchProblems();
    fetchPatterns();
  }, []);

  // Function to GET all problems from the FastAPI backend
  const fetchProblems = async () => {
    const res = await fetch("https://leetcode-tracker-study-tool.onrender.com/problems");
    const data = await res.json();
    setProblems(data);
  };

  // Function to GET all patterns from the FastAPI backend
  const fetchPatterns = async () => {
    const res = await fetch("https://leetcode-tracker-study-tool.onrender.com/patterns");
    const data = await res.json();
    setPatterns(data);
  };

  // Function to POST a new problem to the FastAPI backend
  const addProblem = async () => {
    if (!newProblem.name || !newProblem.category) return;
    await fetch("https://leetcode-tracker-study-tool.onrender.com/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProblem)
    });
    // Refresh the problems list after adding
    fetchProblems();
    // Reset the form
    setNewProblem({ name: "", difficulty: "Easy", category: "", url: "", notes: "", solution: "", solved: 0, date_added: new Date().toISOString().split("T")[0] });
  };

  // Function to DELETE a problem by ID
  const deleteProblem = async (id) => {
    await fetch(`https://leetcode-tracker-study-tool.onrender.com/problems/${id}`, { method: "DELETE" });
    fetchProblems();
  };

  // Function to POST a new pattern to the FastAPI backend
  const addPattern = async () => {
    if (!newPattern.topic) return;
    await fetch("https://leetcode-tracker-study-tool.onrender.com/patterns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPattern)
    });
    fetchPatterns();
    setNewPattern({ topic: "", description: "", template: "", date_added: new Date().toISOString().split("T")[0] });
  };

  // Function to DELETE a pattern by ID
  const deletePattern = async (id) => {
    await fetch(`https://leetcode-tracker-study-tool.onrender.com/patterns/${id}`, { method: "DELETE" });
    fetchPatterns();
  };

  // Styles
  const styles = {
    container: { maxWidth: "900px", margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" },
    tab: { padding: "10px 24px", marginRight: "8px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px" },
    activeTab: { backgroundColor: "#0070f3", color: "white" },
    inactiveTab: { backgroundColor: "#eee", color: "#333" },
    input: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
    textarea: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", height: "80px" },
    button: { padding: "10px 20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    deleteButton: { padding: "6px 12px", backgroundColor: "#e00", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    card: { backgroundColor: "#f9f9f9", padding: "16px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #eee" },
    badge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", marginRight: "8px" }
  };

  // Color for difficulty badge
  const difficultyColor = (d) => d === "Easy" ? "#00b300" : d === "Medium" ? "#ff9900" : "#e00";

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#333" }}>LeetCode Tracker</h1>

      {/* Tab buttons */}
      <div style={{ marginBottom: "24px" }}>
        <button style={{ ...styles.tab, ...(activeTab === "problems" ? styles.activeTab : styles.inactiveTab) }} onClick={() => setActiveTab("problems")}>Problems</button>
        <button style={{ ...styles.tab, ...(activeTab === "patterns" ? styles.activeTab : styles.inactiveTab) }} onClick={() => setActiveTab("patterns")}>Patterns</button>
      </div>

      {/* Problems Tab */}
      {activeTab === "problems" && (
        <div>
          <h2>Add Problem</h2>
          <input style={styles.input} placeholder="Problem name *" value={newProblem.name} onChange={e => setNewProblem({ ...newProblem, name: e.target.value })} />
          <select style={styles.input} value={newProblem.difficulty} onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value })}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <input style={styles.input} placeholder="Category (e.g. Arrays, Trees) *" value={newProblem.category} onChange={e => setNewProblem({ ...newProblem, category: e.target.value })} />
          <input style={styles.input} placeholder="LeetCode URL (optional)" value={newProblem.url} onChange={e => setNewProblem({ ...newProblem, url: e.target.value })} />
          <textarea style={styles.textarea} placeholder="Notes on your approach..." value={newProblem.notes} onChange={e => setNewProblem({ ...newProblem, notes: e.target.value })} />
          <textarea style={styles.textarea} placeholder="Your solution..." value={newProblem.solution} onChange={e => setNewProblem({ ...newProblem, solution: e.target.value })} />
          <div style={{ marginBottom: "12px" }}>
            <label><input type="checkbox" checked={newProblem.solved === 1} onChange={e => setNewProblem({ ...newProblem, solved: e.target.checked ? 1 : 0 })} /> Mark as solved</label>
          </div>
          <button style={styles.button} onClick={addProblem}>Add Problem</button>

          <h2 style={{ marginTop: "32px" }}>Problems ({problems.length})</h2>
          {problems.length === 0 && <p style={{ color: "#999" }}>No problems added yet.</p>}
          {problems.map(p => (
            <div key={p.id} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{p.name}</strong>
                  <span style={{ ...styles.badge, color: difficultyColor(p.difficulty) }}>{p.difficulty}</span>
                  <span style={{ ...styles.badge, backgroundColor: "#eef", color: "#339" }}>{p.category}</span>
                  {p.solved === 1 && <span style={{ ...styles.badge, backgroundColor: "#e6ffe6", color: "#006600" }}>✓ Solved</span>}
                </div>
                <button style={styles.deleteButton} onClick={() => deleteProblem(p.id)}>Delete</button>
              </div>
              {p.url && <p style={{ margin: "8px 0 0" }}><a href={p.url} target="_blank" rel="noreferrer">LeetCode Link</a></p>}
              {p.notes && <p style={{ margin: "8px 0 0", color: "#555" }}><strong>Notes:</strong> {p.notes}</p>}
              {p.solution && <p style={{ margin: "8px 0 0", color: "#555" }}><strong>Solution:</strong> {p.solution}</p>}
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#999" }}>Added: {p.date_added}</p>
            </div>
          ))}
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === "patterns" && (
        <div>
          <h2>Add Pattern</h2>
          <input style={styles.input} placeholder="Topic (e.g. Sliding Window) *" value={newPattern.topic} onChange={e => setNewPattern({ ...newPattern, topic: e.target.value })} />
          <textarea style={styles.textarea} placeholder="Description of the pattern..." value={newPattern.description} onChange={e => setNewPattern({ ...newPattern, description: e.target.value })} />
          <textarea style={styles.textarea} placeholder="Code template or example..." value={newPattern.template} onChange={e => setNewPattern({ ...newPattern, template: e.target.value })} />
          <button style={styles.button} onClick={addPattern}>Add Pattern</button>

          <h2 style={{ marginTop: "32px" }}>Patterns ({patterns.length})</h2>
          {patterns.length === 0 && <p style={{ color: "#999" }}>No patterns added yet.</p>}
          {patterns.map(p => (
            <div key={p.id} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{p.topic}</strong>
                <button style={styles.deleteButton} onClick={() => deletePattern(p.id)}>Delete</button>
              </div>
              {p.description && <p style={{ margin: "8px 0 0", color: "#555" }}><strong>Description:</strong> {p.description}</p>}
              {p.template && <p style={{ margin: "8px 0 0", color: "#555" }}><strong>Template:</strong> {p.template}</p>}
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#999" }}>Added: {p.date_added}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;