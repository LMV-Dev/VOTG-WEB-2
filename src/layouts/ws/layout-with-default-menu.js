import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

/* Hook */
import { useAuth } from '@hooks/use-auth'

/*Import Components*/
import TopMenu from '@components/ws/top-menu'

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

const LayoutWithDefaultMenu = (props) => {
    const { children } = props
    const router = useRouter()
    const { asPath, pathname } = useRouter()
    const { user } = useAuth()

    return (
        <>
            <TopMenu />
            <LayoutRoot>{children}</LayoutRoot>
        </>
    )
}

LayoutWithDefaultMenu.propTypes = {
    children: PropTypes.node,
}

export default LayoutWithDefaultMenu
