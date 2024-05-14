import React, { useState } from 'react'
import { menu } from '../data/data'
import router from 'next/router'

const Section = () => {
    const [showMenuItem, setShowMenuItem] = useState({})

    const handleClick = index => {
        setShowMenuItem({
            ...showMenuItem,
            [index]: !showMenuItem[index]
        })
    }

    return (
        <div className='section w-100'>
            <div className="logo-box text-center">
            <img src="https://i.ibb.co/xSyHsDj/logo.png" alt="logo"/>
            </div>
            <ul className="menu position-relative">
                {
                    menu && menu.map((item, index) => {
                        return (
                            <div onClick={() => router.push(item.href)} className='d-flex p-2 align-items-center menu-item text-uppercase fw-bold' key={index}>
                                {item?.icon}
                                <a onClick={() => handleClick(index)} className='w-100' href="#">{item.title}</a>
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Section