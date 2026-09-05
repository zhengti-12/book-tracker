import { useState, useEffect } from 'react'
import './App.css';
import { useAuth } from './AuthContext';
import { BookService } from './BookService';

function App() {
  const { currentUser, login, register, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'blush');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!currentUser) {
    return <LoginForm login={login} register={register} theme={theme} setTheme={setTheme} />;
  }

  return <BookTracker currentUser={currentUser} logout={logout} theme={theme} setTheme={setTheme} />;
}

function LoginForm({ login, register, theme, setTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRegister() {
    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={`app login-page theme-${theme}`}>
      <div className="heading" style={{ position: 'relative' }}>
        <h1>Book tracker and recommender</h1>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
      <div className="book">
        <h2>Log in or create an account</h2>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleLogin}>Log in</button>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

function BookTracker({ currentUser, logout, theme, setTheme }) {
  const [books, setbooks] = useState([])
  const [title, settitle] = useState('')
  const [genre, setgenre] = useState('')
  const [date, setdate] = useState('')
  const [popup, setpopup] = useState(false)
  const [recgenre, setrec] = useState('')
  const [wantsrec, setwrec] = useState(false)


  useEffect(() => {
    const unsubscribe = BookService.subscribeToBooks(currentUser.uid, setbooks);
    return unsubscribe;
  }, [currentUser]);

  function Addbook () {
    if (title === "") {
      alert("type a book title")
    }
    else {
      setpopup(true)
      BookService.addBook(currentUser.uid, { title, genre, date });
      settitle('');
      setgenre('');
      setdate('');
    }
  }

  const closepopup = () => {
    setpopup(false)
    setwrec(false)
    setrec('')
  }

  const genretally = {}

  books.forEach((book) => {
    const x = book.genre;
    if (genretally[x]) {
      genretally[x] = genretally[x] + 1
    } else {
      genretally[x] = 1
    }
  })

  return (
    <div className={`app theme-${theme}`}>
      <div className="heading" style={{ position: 'relative' }}>
        <h1>Book tracker and recommender</h1>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>

      <div className="toplayout">
        <div className="appheader">
          <div className="book">
            <h2>Log a new book</h2>
            <input
              type="text"
              placeholder="book title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
            <select value={genre} onChange={(e) => setgenre(e.target.value)}>
              <option value="">select a genre</option>
              <option value="romance">romance</option>
              <option value="comedy">comedy</option>
              <option value="sci_fi">sci-fi</option>
              <option value="action">action</option>
              <option value="horror">horror</option>
              <option value="non_fiction">non-fiction</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setdate(e.target.value)} />
            <button onClick={Addbook}> Add book </button>
          </div>

          <div className="genresidebar-wrap">
            <div className="genresidebar">
              <h3>Genre Tally</h3>
              <p>Romance: <strong>{genretally["romance"] || 0}</strong></p>
              <p>Action: <strong>{genretally["action"] || 0}</strong></p>
              <p>Sci-Fi: <strong>{genretally["sci_fi"] || 0}</strong></p>
              <p>Horror: <strong>{genretally["horror"] || 0}</strong></p>
              <p>Comedy: <strong>{genretally["comedy"] || 0}</strong></p>
              <p>Non-Fiction: <strong>{genretally["non_fiction"] || 0}</strong></p>
              <hr />
              <p>Total: <strong>{books.length}</strong></p>
            </div>
            <button className="popupbutton" onClick={logout}>Log out</button>
          </div>
        </div>
      </div>

      <div className="booklog">
        <h2>Book Log</h2>
        <table className="btable">
          <thead>
            <tr>
              <th>Book title</th>
              <th>Genre</th>
              <th>Date read</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.genre}</td>
                <td>{book.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popup && (
        <Recpopup
          wantsrec={wantsrec}
          setwrec={setwrec}
          recgenre={recgenre}
          setrec={setrec}
          recs={recs}
          onclose={closepopup} />
      )}
    </div>
  )
}

function Recpopup({wantsrec, setwrec, recgenre, setrec, recs, onclose}) {
  return (
    <div className="popupoverlay">
      <div className="popupcontent">
        {!wantsrec ? (
          <>
            <h3>Book logged! Would you like a recommendation?</h3>
            <button className="popupbutton" onClick={() => setwrec(true)}>yes</button>
            <button className="popupbutton" onClick={onclose}>No</button>
          </>
        ) : (
          <>
            <p>Pick a genre:</p>
            <select onChange={(e) => setrec(e.target.value)}>
              <option value="">Choose</option>
              <option value="romance">romance</option>
              <option value="sci_fi">sci-fi</option>
              <option value="non_fiction">non-fiction</option>
              <option value="horror">horror</option>
              <option value="comedy">comedy</option>
              <option value="action">action</option>
            </select>
            {recgenre && (
              <div className="result">
                <p>You should read: <b>{recs[recgenre]}</b></p>
                <button className="popupbutton" onClick={onclose}>Exit</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ThemeSwitcher({ theme, setTheme }) {
  return (
    <div style={{ position: 'fixed', top: '20px', right: '40px', display: 'flex', gap: '8px' }}>
      {['blush', 'mono', 'ocean'].map((name) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          title={name}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: theme === name ? '3px solid #333' : '2px solid #ccc',
            backgroundColor: { blush: '#9b6a5b', mono: '#1a1a1a', ocean: '#3a6ea5' }[name],
            cursor: 'pointer',
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

const recs = {
  romance: "Twilight",
  comedy: "The Princess Bride",
  action: "The Maze Runner",
  horror: "It",
  sci_fi: "The Expanse",
  non_fiction: "outliers"
}

export default App;
