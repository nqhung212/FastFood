import { useState } from 'react'
import MercedesLogo from './assets/images/Github-Mark-ea2971cee799.png'
import VietNam_flagLogo from './assets/images/Flag_of_Vietnam.svg.png'
import './assets/styles/Home.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.vietnam.vn" target="_blank">
          <img src={VietNam_flagLogo} className="logo" alt="Vietnam_flag logo" />
        </a>
        <a href="https://guthib.com" target="_blank">
          <img src={MercedesLogo} className="logo react" alt="Github logo" />
        </a>
      </div>
      <h1>Vite and React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
           {count}
        </button>
        <p>
          Test vui vẻ thôi
        </p>
      </div>
    </>
  )
}

export default App
