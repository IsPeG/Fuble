import React, { useEffect, useState } from 'react'
import FurSelectorItem from './FurSelectorItem'

import data from '../../furnitureData/data.json'

import '../../assets/styles/furSelector.css'

export default function FurSelector(props) {

    const furData = [...data];

    return (
    <div className='furSelectorWrapper'> 
      <div className='furSelector'>
        {furData.map((furniture, key) => 
            <FurSelectorItem
            key={key}
            furId={furniture.id}
            furName={furniture.name}
            furSize={furniture.size}
            />
        )}
      </div>
    </div>  
    )
}