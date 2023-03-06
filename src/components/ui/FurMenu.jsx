import React, { useEffect } from 'react'

export default function FurMenu(props) {

    useEffect(() => {
        console.log(props)
    }, [])

    return (
      <div style={{color: 'white', zIndex: '200', position: 'fixed', transform: `translate(${props.x}px, ${props.y}px)`}}>
        <ol>
            <li onPointerDown={() => props.removeFur(props.refKey)}>Remove</li>
        </ol>
      </div>
    )
}