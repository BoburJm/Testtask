import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const emptyForm = () => ({
  text: '',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]
})

export default function AdminPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/questions').then(r=>r.json()).then(setItems).catch(()=>setError('Failed to load')).finally(()=>setLoading(false))
  }

  useEffect(() => { load() }, [])

  const setCorrect = (index) => {
    setForm(f => ({ ...f, options: f.options.map((o,i) => ({ ...o, isCorrect: i===index })) }))
  }

  const updateOptionText = (index, text) => {
    setForm(f => ({ ...f, options: f.options.map((o,i) => i===index? { ...o, text } : o) }))
  }

  const save = async () => {
    const correctCount = form.options.filter(o=>o.isCorrect).length
    if (correctCount !== 1) { alert('Select exactly one correct option'); return }
    setBusy(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/questions/${editingId}` : '/api/questions'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!res.ok) { alert('Save failed'); setBusy(false); return }
    setForm(emptyForm()); setEditingId(null); setBusy(false); load()
  }

  const editItem = (it) => {
    setEditingId(it._id)
    setForm({ text: it.text, options: it.options.map(o=>({ text:o.text, isCorrect: !!o.isCorrect })) })
  }

  const remove = async (id) => {
    if (!confirm('Delete this question?')) return
    await fetch(`/api/questions/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="container">
      <div className="row between">
        <h1>Admin – Questions</h1>
        <Link className="btn" to="/">Go to Test</Link>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="q-text">{editingId ? 'Edit Question' : 'New Question'}</div>
        <input
          placeholder="Question text"
          value={form.text}
          onChange={e=>setForm(f=>({ ...f, text:e.target.value }))}
          style={{ width:'100%', padding:8, borderRadius:8, border:'1px solid #1f2937', background:'#0b1220', color:'white', margin:'8px 0' }}
        />
        <div className="options">
          {form.options.map((o, i) => (
            <label key={i} className="option">
              <input type="radio" name="correct" checked={o.isCorrect} onChange={() => setCorrect(i)} />
              <input
                placeholder={`Option ${i+1}`}
                value={o.text}
                onChange={e=>updateOptionText(i, e.target.value)}
                style={{ flex:1, padding:8, borderRadius:6, border:'1px solid #1f2937', background:'#0b1220', color:'white' }}
              />
            </label>
          ))}
        </div>
        <div className="row end" style={{ marginTop: 12 }}>
          <button disabled={busy} className="btn" onClick={save}>{busy?'Saving…':'Save'}</button>
        </div>
      </div>

      <div className="card">
        {loading? <p>Loading…</p> : error? <p>{error}</p> : (
          items.length===0? <p>No questions yet</p> : items.map((it, idx) => (
            <div key={it._id} className="question">
              <div className="row between">
                <div className="q-text">{idx+1}. {it.text}</div>
                <div className="row">
                  <button className="btn" onClick={() => editItem(it)}>Edit</button>
                  <button className="btn" style={{ background:'#ef4444', color:'#111' }} onClick={() => remove(it._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


