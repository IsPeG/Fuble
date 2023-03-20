import React, { useEffect } from 'react'

import '../../assets/styles/furMenu.css'

export default function FurMenu(props) {
    return (
      <div className='furMenu' style={{transform: `translate(${props.x}px, ${props.y}px)`}}>
        <span>{props.furName}</span>
        <ol>
          <li onPointerDown={() => props.removeFur(props.refKey)}>Remove</li>
        </ol>
      </div>
    )
}