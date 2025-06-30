import React, { useEffect, useState } from "react";
import "./App.css";

// ------------------ CONSTANT CONFIG ------------------
const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:3001"; // Backend base URL
const PRIMARY_COLOR = "#1976d2";
const SECONDARY_COLOR = "#424242";
const ACCENT_COLOR = "#ffd600";

// ------------------ UTILS ------------------
function fetchWithAuth(url, opts = {}, token = null) {
  return fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
}

function formatDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleString();
}

// ------------------ COMPONENTS ------------------

// PUBLIC_INTERFACE
function Navbar({ user, onLogout, onThemeToggle, theme }) {
  /**
   * Responsive top navigation bar.
   * Displays app title, theme toggle, and login/user menu.
   */
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        background: PRIMARY_COLOR,
        color: "#fff",
        minHeight: 56,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1.3rem" }}>
        📝 NoteSaver
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          style={{
            background: ACCENT_COLOR,
            color: "#212121",
            marginRight: 10,
            minWidth: 64,
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {user ? (
          <UserMenu user={user} onLogout={onLogout} />
        ) : null}
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function UserMenu({ user, onLogout }) {
  /**
   * User menu for display in navbar.
   */
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>Hi, {user.username}</span>
      <button
        style={{
          background: SECONDARY_COLOR,
          color: "#fff",
          border: "none",
          borderRadius: 5,
          padding: "0.35rem 0.7rem",
          cursor: "pointer",
          fontSize: 14,
        }}
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function AuthScreen({
  mode,
  onSwitch,
  onLogin,
  isLoading,
  error,
}) {
  /**
   * Login/register UI component.
   */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Reset on mode switch
  useEffect(() => {
    setUsername(""); setPassword("");
  }, [mode]);
  return (
    <div style={{
      maxWidth: 340,
      margin: "40px auto",
      padding: 28,
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(60,64,67,0.1)",
      background: "#fff",
    }}>
      <h2 style={{ margin: '0 0 18px 0' }}>
        {mode === "login" ? "Sign In" : "Register"}
      </h2>
      {error ? (
        <div style={{
          color: "#c00",
          background: "#fee",
          borderRadius: 7,
          fontSize: 14,
          padding: "6px 10px",
          marginBottom: 10,
        }}>{error}</div>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault(); onLogin(username, password);
        }}
        autoComplete="on"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          autoFocus
          onChange={e => setUsername(e.target.value)}
          style={{
            width: "100%", marginBottom: 8, padding: 10, borderRadius: 4, border: "1px solid #ddd",
            background: "#fafbfc"
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%", marginBottom: 10, padding: 10, borderRadius: 4, border: "1px solid #ddd",
            background: "#fafbfc"
          }}
          required
        />
        <button
          disabled={isLoading || !username || !password}
          style={{
            width: "100%",
            background: PRIMARY_COLOR,
            color: "#fff",
            border: "none",
            padding: "11px 0",
            borderRadius: 5,
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 6,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "wait" : "pointer"
          }}
          type="submit"
        >
          {isLoading ? (mode === "login" ? "Signing in..." : "Registering...") : (mode === "login" ? "Login" : "Register")}
        </button>
      </form>
      <div style={{ textAlign: "center", fontSize: 15, color: "#555" }}>
        {mode === "login" ? "No account?" : "Already registered?"}
        <button
          style={{
            color: PRIMARY_COLOR,
            background: "none",
            border: "none",
            textDecoration: "underline",
            padding: 0,
            marginLeft: 6,
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={onSwitch}
        >{mode === "login" ? "Sign up" : "Sign in"}</button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function NotesList({ notes, selectedId, onSelect, onNew, onDelete }) {
  /**
   * Responsive notes list on the left side.
   * Shows preview cards and delete buttons.
   */
  return (
    <div style={{
      width: "100%",
      maxWidth: 370,
      minWidth: 215,
      flex: 1,
      borderRight: "1px solid var(--border-color)",
      background: "var(--bg-secondary)",
      padding: "0.5rem 0",
      minHeight: "60vh",
      transition: "background 0.2s",
      overflowY: "auto",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 1.1rem 0.4rem",
        borderBottom: "1px solid var(--border-color)",
      }}>
        <h2 style={{ fontSize: 20, color: PRIMARY_COLOR, margin: 0, fontWeight: 700 }}>Notes</h2>
        <button
          style={{
            background: ACCENT_COLOR, color: "#222", fontWeight: 600, border: "none", borderRadius: 12, padding: "0.43rem 1.1rem", marginLeft: 2, fontSize: 16, cursor: "pointer"
          }}
          onClick={onNew}
        >
          +
        </button>
      </div>
      <div>
        {notes && notes.length === 0 && (
          <div style={{ padding: "2.5rem 20px", textAlign: "center", color: "#aaa" }}>
            No notes yet.
            <div>
              <button style={{
                marginTop: 10,
                background: ACCENT_COLOR, color: "#282c34", border: "none", borderRadius: 6, fontWeight: 600, padding: "6px 16px"
              }} onClick={onNew}>Create your first note</button>
            </div>
          </div>
        )}
        {notes.map(note => (
          <div key={note.id}
            className="note-list-card"
            style={{
              margin: "10px 10px",
              background: (note.id === selectedId) ? "#f1f7ff" : "#fff",
              borderLeft: `6px solid ${note.id === selectedId ? PRIMARY_COLOR : "#eee"}`,
              borderRadius: 10,
              boxShadow: "0 1px 5px rgba(40,44,52,0.07)",
              cursor: "pointer",
              padding: "0.8rem 1.2rem 0.6rem 1rem",
              position: "relative",
              transition: "background 0.15s"
            }}
            onClick={() => onSelect(note.id)}
          >
            <div style={{ fontWeight: 600, color: "#222", fontSize: 16, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {note.title || <span style={{ color: "#969db3" }}>[Untitled Note]</span>}
            </div>
            <div style={{
              fontSize: 13,
              color: "#666",
              marginBottom: 3,
              minHeight: 18,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>{note.content && note.content.slice(0, 38)}</div>
            <div style={{
              fontSize: 11, color: "#98a", textAlign: "right"
            }}>{formatDate(note.updated_at)}</div>
            <button
              aria-label="Delete note"
              title="Delete note"
              style={{
                position: "absolute",
                right: 12,
                top: 9,
                background: "#fff",
                color: "#c00",
                border: "none",
                fontSize: 18,
                borderRadius: "50%",
                width: 26, height: 26,
                cursor: "pointer",
                zIndex: 2,
                padding: 0,
              }}
              onClick={e => { e.stopPropagation(); onDelete(note.id); }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function NoteEditor({ note, onChange, onSave, onDelete, isSaving }) {
  /**
   * Note detail and edit view.
   */
  const [localNote, setLocalNote] = useState({ ...note });

  // Sync local on note.id change
  useEffect(() => {
    setLocalNote({ ...note });
  }, [note?.id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setLocalNote((prev) => ({ ...prev, [name]: value }));
    if (onChange) onChange({ ...localNote, [name]: value });
  }

  if (!note) {
    return <div style={{
      margin: "auto",
      minHeight: 150,
      textAlign: "center",
      color: "#888"
    }}>Select or create a note</div>;
  }
  return (
    <div style={{
      padding: "2.0rem 2rem 1.3rem 2.4rem",
      maxWidth: 800,
      margin: "15px auto",
      flex: 3,
      minWidth: 220,
      display: "flex",
      flexDirection: "column",
    }}>
      <input
        name="title"
        value={localNote.title || ""}
        onChange={handleChange}
        style={{
          fontSize: 22,
          fontWeight: 700,
          border: "none",
          outline: "none",
          marginBottom: 12,
          padding: "2px 4px",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
        maxLength={80}
        placeholder="Note title"
      />
      <textarea
        name="content"
        rows={13}
        value={localNote.content || ""}
        onChange={handleChange}
        style={{
          fontSize: 16,
          border: "1px solid #e1e0e4",
          borderRadius: 7,
          padding: "1em",
          resize: "vertical",
          background: "#fafafb",
          color: "#2a2a2a",
          marginBottom: 16,
          minHeight: 100
        }}
        placeholder="Write your note here..."
        maxLength={2000}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          onClick={onSave}
          style={{
            background: PRIMARY_COLOR,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontWeight: 600,
            fontSize: 16,
            padding: "0.7rem 2.2rem",
            marginRight: 10,
            cursor: "pointer",
            opacity: isSaving ? 0.6 : 1,
          }}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onDelete}
          style={{
            background: "#fff",
            border: `1.5px solid #f55`,
            borderRadius: 7,
            color: "#d22",
            fontWeight: 600,
            fontSize: 16,
            padding: "0.7rem 1.5rem",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ---------------- MAIN APP LOGIC -----------------

// PUBLIC_INTERFACE
function App() {
  /**
   * Orchestrates authentication, CRUD, responsive layout, and backend API integration.
   * Top Bar, Auth/Login, SideBar, Note Editor.
   */

  // ---- THEME ----
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ---- AUTH STATE ----
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // ---- SESSION PERSISTENCE ----
  useEffect(() => {
    // Check token in localStorage on load
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) {
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
    }
  }, []);

  // ---- NOTES STATE ----
  const [token, setToken] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mainError, setMainError] = useState(""); // General error

  // ---- AUTH API ----

  // PUBLIC_INTERFACE
  async function handleAuth(username, password) {
    /** Handles login/register based on authMode */
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const endpoint =
        authMode === "login"
          ? `${API_BASE}/auth/login`
          : `${API_BASE}/auth/register`;
      const resp = await fetchWithAuth(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
        },
        null
      );
      if (!resp.ok) {
        const data = await resp.json();
        setAuthError(data.detail || "Invalid credentials");
        setIsAuthLoading(false);
        return;
      }
      const data = await resp.json();
      if (!data.access_token || !data.user) {
        setAuthError("Malformed server response");
        setIsAuthLoading(false);
        return;
      }
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthError("");
    } catch (err) {
      setAuthError("Network error");
    }
    setIsAuthLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    setUser(null);
    setToken(null);
    setNotes([]);
    setSelectedNote(null);
    setSelectedNoteId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // ---- NOTES CRUD API ----

  // PUBLIC_INTERFACE
  async function fetchNotes() {
    /** Fetches all notes for user */
    setIsNotesLoading(true);
    try {
      const resp = await fetchWithAuth(`${API_BASE}/notes`, {}, token);
      if (!resp.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await resp.json();
      setNotes(data || []);
      // If nothing selected, select most recent note
      if (data.length && (!selectedNoteId || !data.some(n => n.id === selectedNoteId))) {
        setSelectedNoteId(data[0].id);
      }
    } catch (err) {
      setMainError("Could not fetch notes.");
    } finally {
      setIsNotesLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function fetchSingleNote(noteId) {
    setIsNotesLoading(true);
    try {
      const resp = await fetchWithAuth(
        `${API_BASE}/notes/${noteId}`,
        {},
        token
      );
      if (!resp.ok) throw new Error("Failed to fetch note");
      const data = await resp.json();
      setSelectedNote(data);
    } catch {
      setSelectedNote(null);
    } finally {
      setIsNotesLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function handleNoteSave() {
    /** Create new or update existing note */
    if (!selectedNote) return;
    setIsSaving(true);
    setMainError("");
    const isNew = !selectedNote.id;
    const endpoint = isNew
      ? `${API_BASE}/notes`
      : `${API_BASE}/notes/${selectedNote.id}`;
    try {
      const resp = await fetchWithAuth(endpoint, {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify({
          title: selectedNote.title,
          content: selectedNote.content,
        }),
      }, token);
      if (!resp.ok) {
        setMainError("Could not save note.");
        setIsSaving(false);
        return;
      }
      await fetchNotes();
      if (isNew) {
        // Refresh and jump to the newly-created note
        const fresh = await resp.json();
        setSelectedNoteId(fresh.id);
        setSelectedNote(fresh);
      }
    } catch (e) {
      setMainError("Network error");
    }
    setIsSaving(false);
  }

  // PUBLIC_INTERFACE
  async function handleNoteDelete(noteId = null) {
    /** Delete note with confirmation */
    const id = noteId || selectedNoteId;
    if (!id) return;
    if (!window.confirm("Delete this note?")) return;
    try {
      const resp = await fetchWithAuth(`${API_BASE}/notes/${id}`, {
        method: "DELETE"
      }, token);
      if (!resp.ok) throw new Error("Cannot delete");
      // Refresh
      await fetchNotes();
      setSelectedNoteId(null);
      setSelectedNote(null);
    } catch (e) {
      setMainError("Could not delete note.");
    }
  }

  // ---- HOOKS ----

  // When user is set, fetch notes
  useEffect(() => {
    if (token && user) {
      fetchNotes();
    }
    // eslint-disable-next-line
  }, [token, user]);

  // When selectedNoteId changes, fetch that note
  useEffect(() => {
    if (selectedNoteId && token) {
      fetchSingleNote(selectedNoteId);
    } else {
      setSelectedNote(null);
    }
    // eslint-disable-next-line
  }, [selectedNoteId, token]);

  // ----------- RENDER -----------

  if (!user || !token) {
    // Not logged in
    return (
      <div className="App">
        <Navbar
          user={null}
          onThemeToggle={() =>
            setTheme((t) => (t === "light" ? "dark" : "light"))
          }
          theme={theme}
        />
        <AuthScreen
          mode={authMode}
          onSwitch={() => setAuthMode(authMode === "login" ? "register" : "login")}
          onLogin={handleAuth}
          isLoading={isAuthLoading}
          error={authError}
        />
      </div>
    );
  }

  // Logged in UI
  return (
    <div className="App" style={{ background: "var(--bg-primary)" }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onThemeToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        theme={theme}
      />
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "stretch",
        width: "100%",
        minHeight: "80vh",
        background: "var(--bg-primary)",
        boxSizing: "border-box"
      }}>
        {/* Notes List */}
        <div className="notes-sidebar"
          style={{
            minHeight: "calc(100vh - 56px)",
            width: "22vw",
            minWidth: 195,
            background: "var(--bg-secondary)",
            borderRight: "1px solid var(--border-color)"
          }}>
          <NotesList
            notes={notes}
            selectedId={selectedNoteId}
            onSelect={id => setSelectedNoteId(id)}
            onNew={() => {
              setSelectedNoteId(null);
              setSelectedNote({ title: "", content: "" });
            }}
            onDelete={handleNoteDelete}
          />
        </div>
        {/* Note Detail/Editor */}
        <main
          style={{
            flex: 1,
            height: "100%",
            background: "var(--bg-primary)",
            minHeight: "calc(100vh - 56px)",
            display: "flex", flexDirection: "column"
          }}
        >
          {mainError ? (
            <div style={{
              background: "#ffebee",
              color: "#b22",
              padding: "0.6rem 2rem",
              borderRadius: 8,
              margin: "2rem",
              fontSize: 17,
            }}>{mainError}</div>
          ) : null}
          {isNotesLoading ? (
            <div style={{
              textAlign: "center", fontSize: 24, margin: "4rem"
            }}>Loading...</div>
          ) : (
            <NoteEditor
              note={selectedNote}
              onChange={n => setSelectedNote(n)}
              onSave={handleNoteSave}
              onDelete={handleNoteDelete}
              isSaving={isSaving}
            />
          )}
        </main>
      </div>
      <footer style={{
        textAlign: "center",
        fontSize: 13,
        color: "#888",
        marginTop: 30,
        padding: 20
      }}>
        Made with <span style={{ color: ACCENT_COLOR, fontWeight: 700 }}>Kavia + React</span>
      </footer>
      {/* Responsive: Stack columns on mobile */}
      <style>{`
        @media (max-width: 767px) {
          .App .notes-sidebar {
            width: 100vw; min-width: unset; max-width: unset; border-right: none; border-bottom: 1.5px solid #ddd;
          }
          .App .notes-sidebar { min-height: 140px; }
          main { padding: 0 0.1rem !important; }
          .note-list-card { margin: 9px 3vw !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
