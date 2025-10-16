import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { keyframes } from '@emotion/react'
import { Logo } from './logo'
import { useRouter } from 'next/router'

const bounce1 = keyframes`
    0% {
        transform: translate3d(0, 0, 0);
    }
    50% {
        transform: translate3d(0, 1px, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
`

const bounce3 = keyframes`
    0% {
        transform: translate3d(0, 0, 0);
    }
    50% {
        transform: translate3d(0, 3px, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
`
const rotateX = keyframes`
    from {
        transform: rotateX(0deg);
    }
    to {
        transform: rotateX(360deg);
    }
`

const rotateY = keyframes`
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(360deg);
    }
`

export const SplashScreen = ({ theme }) => {
    const router = useRouter()
    // console.log('SplashScreen ', router.asPath)
    useEffect(() => {
        if (!router.isReady) {
            return
        }
    }, [])
    return (
        <Box
            sx={{
                alignItems: 'center',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center',
                left: 0,
                p: 3,
                position: 'fixed',
                top: 0,
                width: '100vw',
                zIndex: 2000,
		        pointerEvents:'none'
            }}
        >
            <Logo
                sx={{
                    width: 300,
                    height: 80,
                    animation: `${rotateX} 1s infinite linear;`,
                }}
                customColor={router.asPath.includes('panel') ? '#1C60FF' : '#FF5353'}
            />
        </Box>
    )
}
