import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Footer } from '@components/layout/footer'
import { useMoveScroll } from '@hooks/use-move-scroll'
import HomeNavbar from '@components/layout/home-navbar'
import { MainSidebar } from '@components/layout/main-sidebar'

const SubLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 64,
}))

const SubLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { element, onMoveToElement } = useCallback(useMoveScroll())

    const element2 = useRef()
    // const onScrollWrite = () => {
    //     element2.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // }
    return (
        <>
            <SubLayoutRoot>
                {/* <HomeNavbar onOpenSidebar={() => setIsSidebarOpen(true)} onMoveScroll={onMoveToElement} onMoveScrollWrite={onScrollWrite} />

                <MainSidebar onClose={() => setIsSidebarOpen(false)} open={isSidebarOpen} onMoveScroll={onMoveToElement} onMoveScrollWrite={onScrollWrite} /> */}

                <HomeNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

                <MainSidebar onClose={() => setIsSidebarOpen(false)} open={isSidebarOpen} />
                {children}
                {/* Calc Payment Select Section Height */}
                <Box
                    ref={element2}
                    sx={{
                        position: 'absolute',
                        mt: { md: '-1400px', xs: '-3400px' },
                    }}
                />
                <Box
                    ref={element}
                    sx={{
                        position: 'absolute',
                        mt: { md: '-500px', xs: '-1700px' },
                    }}
                />
                {/* <Footer onMoveScroll={onMoveToElement} onMoveScrollWrite={onScrollWrite} /> */}
                <Footer />
            </SubLayoutRoot>
        </>
    )
}

SubLayout.propTypes = {
    children: PropTypes.node,
}

export default SubLayout
