import { useLocation, useNavigate } from 'react-router-dom'

export default function ResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const total = state?.total ?? 0
  const correct = state?.correct ?? 0
  const percent = state?.percent ?? 0
  const details = state?.details ?? []

  return (
    <div className="container">
      <h1>Results</h1>
      <div className="card">
        <p><b>Correct:</b> {correct} / {total}</p>
        <p><b>Score:</b> {percent}%</p>
      </div>
      {Array.isArray(details) && details.length>0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <h2>Answers Review</h2>
          {details.map((d, i) => (
            <div key={d.id || i} className="question">
              <div className="q-text">{i+1}. {d.text}</div>
              <div className="options">
                {d.options.map(o => {
                  const isCorrect = o.index === d.correctIndex
                  const isSelected = o.index === d.selectedIndex
                  const cls = isCorrect ? 'chip correct' : isSelected ? 'chip wrong' : 'chip'
                  return (
                    <div key={o.index} className={cls}>
                      <span>{o.text}</span>
                      {isCorrect && <span className="mini">(correct)</span>}
                      {isSelected && !isCorrect && <span className="mini">(your choice)</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn" onClick={() => navigate('/')}>Take Again</button>
    </div>
  )
}


