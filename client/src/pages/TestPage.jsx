import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function TestPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(600)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/test/start?random=true')
      .then(r => r.json())
      .then(d => { setQuestions(d.questions || []); setLoading(false) })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [])

  useEffect(() => {
    if (loading) return
    if (secondsLeft <= 0) { handleSubmit(); return }
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [loading, secondsLeft])

  const mmss = useMemo(() => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
    const s = (secondsLeft % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }, [secondsLeft])

  const handleSelect = (qid, index) => {
    setAnswers(prev => ({ ...prev, [qid]: index }))
  }

  const handleSubmit = async () => {
    const payload = { answers: questions.map(q => ({ id: q.id, selectedIndex: answers[q.id] })) }
    const res = await fetch('/api/test/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    navigate('/result', { state: data })
  }

  const answeredCount = useMemo(() => {
    let count = 0
    for (const q of questions) if (answers[q.id] !== undefined) count++
    return count
  }, [answers, questions])

  if (loading) return <div className="container"><h2>Loading…</h2></div>
  if (error) return <div className="container"><p>{error}</p></div>

  return (
    <div className="container">
      <header className="row between sticky">
        <h1>IELTS Mock Test</h1>
        <div className="row" style={{ gap: 8 }}>
          <span className="badge">Answered {answeredCount}/{questions.length}</span>
          <div className="timer">⏱ {mmss}</div>
          <Link className="btn" to="/admin">Admin</Link>
        </div>
      </header>
      <div className="progress" aria-hidden>
        <div className="progress-bar" style={{ width: `${questions.length? Math.round((answeredCount/questions.length)*100) : 0}%` }} />
      </div>
      <div className="card">
        {questions.map((q, qi) => (
          <div key={q.id} className="question">
            <div className="q-text">{qi + 1}. {q.text}</div>
            <div className="options">
              {q.options.map((o) => (
                <label key={o.index} className="option">
                  <input type="radio" name={q.id} checked={answers[q.id] === o.index} onChange={() => handleSelect(q.id, o.index)} />
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="row end">
        <button className="btn" disabled={answeredCount===0} onClick={handleSubmit}>{answeredCount===0? 'Select an answer' : 'Submit'}</button>
      </div>
    </div>
  )
}


