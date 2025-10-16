import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

/* Hook */
import { useAuth } from '@hooks/use-auth'

/*Import Components*/
import TopMenu from '@components/ws/top-menu'
import HomeSubNavbar from '@components/layout/home-navbar'

/*Root*/
const LayoutRoot = styled('div')(({ theme }) => ({
    // background: '#fff',
    background: '#F9FAFC',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    marginTop: '65px',
    // [theme.breakpoints.up('lg')]: {
    //     paddingInline: 100,
    // },
}))

const LayoutWithServiceMenu = (props) => {
    const { children } = props
    const router = useRouter()
    const { asPath, pathname } = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        // console.log('adminPanel', user?.mode >= 2)
        if (!router.isReady) {
            return
        }
        if (user?.status == 0 || user?.status == 2) router.push(`/ws/mypage`).catch(console.error)
    }, [user])

    return (
        <>
            <HomeSubNavbar />
            <LayoutRoot>{children}</LayoutRoot>
        </>
    )
}

LayoutWithServiceMenu.propTypes = {
    children: PropTypes.node,
}

export default LayoutWithServiceMenu
