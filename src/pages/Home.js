import React, { useState } from 'react';
import BootJumbo from '../components/BootJumbo'

export default function Home() {
    const [login, setLogin] = useState(null)
    const [welcome, setWelcome] = useState(true)

    return (
        <>
            <BootJumbo />
        </>
    )
}
