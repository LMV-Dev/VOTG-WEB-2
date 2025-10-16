// components/layout/main-layout.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Footer } from '@components/layout/footer'
import { useMoveScroll } from '@hooks/use-move-scroll'
import HomeNavbar from '@components/layout/home-navbar'
import { MainSidebar } from '@components/layout/main-sidebar'

const MainLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 0,
}))

export const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    // [수정] 불필요한 useCallback 래핑을 제거하고 훅을 직접 호출합니다.
    // useMoveScroll 훅 내부에서 onMoveToElement 함수가 이미 useCallback으로 메모이제이션 되어 있습니다.
    const { element, onMoveToElement } = useMoveScroll()

    const element2 = useRef()
    
    // [수정] onScrollWrite 함수가 불필요하게 재생성되는 것을 막기 위해 useCallback으로 감싸줍니다.
    // 의존하는 상태나 props가 없으므로 의존성 배열은 비워둡니다.
    const onScrollWrite = useCallback(() => {
        element2.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, []) // 빈 의존성 배열 추가

    return (
        <>
            <MainLayoutRoot>
                <HomeNavbar onOpenSidebar={() => setIsSidebarOpen(true)} onMoveScroll={onMoveToElement} onMoveScrollWrite={onScrollWrite} />

                <MainSidebar onClose={() => setIsSidebarOpen(false)} open={isSidebarOpen} />
                {children}
                {/* Calc Payment Select Section Height */}
                <Box
                    ref={element2}
                    sx={{
                        position: 'absolute',
                        mt: { md: '-3800px', xs: '-5800px' },
                    }}
                />
                <Box
                    ref={element}
                    sx={{
                        position: 'absolute',
                        mt: { md: '-900px', xs: '-2100px' },
                    }}
                />
                <Footer />
            </MainLayoutRoot>
        </>
    )
}

MainLayout.propTypes = {
    children: PropTypes.node,
}