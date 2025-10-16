import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

/*Import Components*/
import TopMenu from '@components/pn/top-menu'

/*Root*/
const LayoutRoot = styled('div')(({ theme }) => ({
    // background: '#fff',
    background: '#F9FAFC',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    // marginTop: '65px',
    // [theme.breakpoints.up('lg')]: {
    //     paddingInline: 100,
    // },
}))

const LayoutPanelTopNav = (props) => {
    const { children } = props
    const { asPath, pathname } = useRouter()

    return (
        <>
            <TopMenu />
            <LayoutRoot>{children}</LayoutRoot>
        </>
    )
}

LayoutPanelTopNav.propTypes = {
    children: PropTypes.node,
}

export default LayoutPanelTopNav
