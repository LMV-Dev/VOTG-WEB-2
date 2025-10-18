import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

/* MUI */
import { Box, Divider } from '@mui/material'
/* Layouts */
import { MainLayout } from '@layouts/main'
/* Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useMoveScroll } from '@hooks/use-move-scroll'
/* Compoent/Home */
import { HomeBoard } from '@components/home/home-board'
import { HomeSectionTop } from '@components/home/home-top'
import { HomeSectionDrag } from '@components/home/home-drag'
import { HomeServiceColumn } from '@components/home/home-service-column'
import { HomeNews } from '@components/home/home-news'
import { HomeIntro } from '@components/home/home-intro'
import { HomeSolution } from '@components/home/home-solution'
import { HomePrice } from '@components/home/home-price'
import { HomeSoon } from '@components/home/home-soon'

/*Popup*/
import IntroMediaPopover from '@components/popovers/popover-intro-media'

const Home = () => {
    const router = useRouter()
    const disableGuard = router.query.disableguard
    const { element, onMoveToElement } = useMoveScroll()

    // console.log('router', router.asPath)

    const { elementTop, onMoveToElementTop } = useMoveScroll()

    //Popup
    const [displayPopup, setDisplayPopup] = useState(false)

    useEffect(() => {
        if (router.asPath === '/') {
            setDisplayPopup(true)
        }
    }, [])

    useEffect(() => {
        // Restore the persistent state from local/session storage
        const value = globalThis.sessionStorage.getItem('dismiss-popup')

        if (value === 'true') {
            setDisplayPopup(false)
        }
    }, [])

    const handleDismissPopup = () => {
        // Update the persistent state
        globalThis.sessionStorage.setItem('dismiss-popup', 'true')
        setDisplayPopup(false)
    }

    const handleClosePopup = () => {
        // Update the persistent state
        // globalThis.sessionStorage.setItem('dismiss-popup', 'true')
        setDisplayPopup(false)
    }

    // useEffect(
    //     () => {
    //         if (!router.isReady) {
    //             return
    //         }
    //         console.log('disableGuard', disableGuard)

    //         // You should remove the "disableGuard" check, because it's meant to be used only in the demo.
    //         if (disableGuard !== 'true') {
    //             router.push('/welcome').catch(console.error)
    //         }
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [router.isReady],
    // )

    const auth = useAuth()

    // console.log('auth :: ', auth)

    return (
        <>
            {/* <IntroMediaPopover dismiss={handleDismissPopup} onClose={handleClosePopup} open={displayPopup} title={'변환이 완료되었습니다.'} description={'계속해서 설문지를 만들어보세요!'} buttonName={'닫기'} /> */}
            <Head>
                <title>AI Survey Maker - 인공지능 기반 스마트 설문 플랫폼</title>
                <meta name="description" content="AI 기반 설문 자동 제작 서비스. PDF를 드래그하면 자동으로 설문이 완성됩니다." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content="설문조사, AI, 인공지능, 자동화, PDF변환, 설문제작" />
                <meta property="og:title" content="AI Survey Maker - 스마트 설문 플랫폼" />
                <meta property="og:description" content="AI가 도와주는 스마트 설문 제작 서비스" />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/ico/favicon.png" />
            </Head>

            <main>
                <HomeSectionTop />
                <Box
                    sx={{
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.6) 25%, rgba(118, 75, 162, 0.8) 50%, rgba(240, 147, 251, 0.6) 75%, transparent 100%)',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                            animation: 'shimmer 2s ease-in-out infinite',
                        },
                        '@keyframes shimmer': {
                            '0%, 100%': {
                                transform: 'translateX(-100%)',
                            },
                            '50%': {
                                transform: 'translateX(100%)',
                            },
                        },
                    }}
                />
                <HomeSectionDrag onMoveScroll={onMoveToElement} />
            </main>
        </>
    )
}

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default Home

// import { useEffect, useState } from 'react'
// import Head from 'next/head'
// import Image from 'next/image'
// import { useRouter } from 'next/router'

// /* MUI */
// import { Box, Divider } from '@mui/material'
// /* Layouts */
// import { MainLayout } from '@layouts/main'
// /* Hooks*/
// import { useMoveScroll } from '@hooks/use-move-scroll'
// /* Compoent/Home */
// import { HomeSectionTop } from '@components/home/home-top'
// import { HomeSectionDrag } from '@components/home/home-drag'
// import { HomeIntro } from '@components/home/home-intro'
// import { HomePrice } from '@components/home/home-price'
// import { HomeSoon } from '@components/home/home-soon'

// const Home = () => {
//     const { element, onMoveToElement } = useMoveScroll()

//     const { elementTop, onMoveToElementTop } = useMoveScroll()

//     const router = useRouter()
//     const disableGuard = router.query.disableGuard

//     return (
//         <>
//             <Head>
//                 <title>뷰즈온더고 :: Views On the Go</title>
//             </Head>

//             <main>
//                 <HomeSoon />
//             </main>
//         </>
//     )
// }

// // Home.getLayout = (page) => <MainLayoeut>{page}</MainLayout>

// export default Home