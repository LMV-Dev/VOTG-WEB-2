import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { AppBar, Avatar, Badge, Box, Button, ButtonBase, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'

/*MUI Icon*/
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

/*Custom Icon*/
import { LogoSymbol } from '@public/votg/logoSymbol'
import { IconSurvey } from '@public/votg/IconSurvey'
import { IconPayment } from '@public/votg/IconPayment'
import { IconMypage } from '@public/votg/IconMypage'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/*Custom Icon*/

/*Import Components*/
import PopupWarningWithCancel_Logout from '@components/popup/popup-warning-with-cancel'
import PopupWarningWithCancel_MoveHome from '@components/popup/popup-warning-with-cancel'

/*Initial Data*/
// 1. Menu List
const menu = (color) => [
    {
        title: '설문지 관리',
        href: '/ws/manager',
        icon: <IconSurvey sx={{ width: 21 }} variant="color" customColor={color} />,
        iconActive: <IconSurvey sx={{ width: 21 }} variant="color" />,
    },
    // {
    //     title: '결제 관리',
    //     href: '/ws/payment',
    //     icon: <IconPayment sx={{ width: 21 }} variant="color" customColor={color} />,
    //     iconActive: <IconPayment sx={{ width: 21 }} variant="color" />,
    // },
    {
        title: '내정보',
        href: '/ws/mypage',
        icon: <IconMypage sx={{ width: 21 }} variant="color" customColor={color} />,
        iconActive: <IconMypage sx={{ width: 21 }} variant="color" />,
    },
]

/**
 *  워크스페이스 레이아웃 최상단 메뉴바
 *
 *  layouts -> ws -> layout-with-service-menu.js
 * */
const TopMenu = (props) => {
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // console.log('asPath', asPath)
    // Param Check
    const { code } = router.query

    /**
     * EVENT :: 로고
     */

    /*Warning Popup*/
    const [openDialogWarning_MoveHome, setopenDialogWarning_MoveHome] = useState(false)
    const handleOpenWarning_MoveHome = () => {
        //  setopenDialogWarning_MoveHome(true) // Popup Test Check
        if (code !== undefined) {
            setopenDialogWarning_MoveHome(true)
        } else {
            router.push('/').catch(console.error)
        }
    }
    const handleCloseWarning_MoveHome = async () => {
        setopenDialogWarning_MoveHome(false)
    }

    const handlePushRoutingEvent = async () => {
        globalThis.sessionStorage.removeItem('shared-check')
        globalThis.sessionStorage.removeItem('convert-pdf-cache')
        globalThis.sessionStorage.removeItem('convert-survey-question-init-check')
        globalThis.sessionStorage.removeItem('convert-survey-question')
        globalThis.sessionStorage.removeItem('create-survey-question')
        globalThis.sessionStorage.removeItem('current-create-survey')
        globalThis.sessionStorage.removeItem('set-file-cache')
        globalThis.sessionStorage.removeItem('send-phone-number')
        globalThis.sessionStorage.removeItem('send-type')
        await handleCloseWarning_MoveHome()
        await router.push('/').catch(console.error)
    }

    /**
     * EVENT :: 로그아웃
     */
    const { user, logout } = useAuth()
    const [openDialogWarning_Logout, setopenDialogWarning_Logout] = useState(false)
    const handleOpenWarning_Logout = () => {
        setopenDialogWarning_Logout(true)
    }
    const handleCloseWarning_Logout = async () => {
        setopenDialogWarning_Logout(false)
    }
    const event_Logout = async () => {
        try {
            await logout()
            handlePushRoutingEvent()
            toast.success('로그아웃')
        } catch (err) {
            console.error(err)
            toast.error('Unable to logout.')
        }
    }
    const handlePushLogoutEvent = async () => {
        // await handleCloseWarning_MoveHome()
        // await router.push('/dashboard').catch(console.error)

        await handleCloseWarning_Logout()
        await event_Logout()
    }

    return (
        <Box
            sx={{
                background: '#F9FAFC',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Popup Area */}
            <PopupWarningWithCancel_MoveHome
                onClose={handleCloseWarning_MoveHome}
                open={openDialogWarning_MoveHome}
                event={handlePushRoutingEvent}
                sw={true}
                title={'홈 화면으로 이동하시겠습니까?'}
                description={'설문지는 저장되지 않고 삭제됩니다.'}
                cancelName={'홈으로 이동'}
                confirmName={'계속 제작하기'}
                color={'primary'}
            />
            <PopupWarningWithCancel_Logout
                onClose={handleCloseWarning_Logout}
                open={openDialogWarning_Logout}
                event={handlePushLogoutEvent}
                sw={true}
                title={'로그아웃 하시겠습니까?'}
                description={'설문지를 만들고 있는 중이면 저장되지 않고 삭제됩니다.'}
                cancelName={'로그아웃'}
                confirmName={'계속 제작하기'}
                color={'primary'}
            />
            {/* Viwe Area */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                    background: '#fff',
                    boxShadow: (theme) => theme.shadows[3],
                    zIndex: 10,
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        justifyContent: 'stretch',
                        minHeight: 64,
                        left: 0,
                        px: 1,
                    }}
                >
                    {/* Left: 1. Logo */}
                    <IconButton
                        onClick={handleOpenWarning_MoveHome}
                        sx={{
                            justifyContent: 'left',
                            alignItems: 'left',
                            display: 'flex',
                            mr: 1,
                        }}
                    >
                        <LogoSymbol sx={{ width: 38, height: 'auto' }} variant="color" customColor={'#1C60FF'} />
                    </IconButton>

                    {/* empty space */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Right: 2. Menu List */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexFlow: 'row',
                            alignItems: 'stretch',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Logout Event Button */}
                        {menuTypeButtonWithEvent('outlined', '#65748B', '로그아웃', handleOpenWarning_Logout, <LogoutIcon width={40} />)}
                    </Box>
                </Toolbar>
            </Box>
        </Box>
    )
}

TopMenu.propTypes = {
    // onOpenSidebar: PropTypes.func,
}

export default TopMenu

//Type 1. Menu
const menuTypeDefatulLink = (menu, color, isSelected) => {
    return (
        <NextLink href={menu.href} passHref>
            <a>
                <Box
                    sx={{
                        minWidth: { sm: 120, xs: 70 },
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingInline: { sm: 4, xs: 0 },
                        '&:hover': {
                            backgroundColor: 'primary.main',
                            transition: 'all 0.5s',
                        },
                        '&:hover p': {
                            color: 'primary.contrastText',
                            transition: 'all 1s',
                        },
                        '&:hover :not(svg) svg path': {
                            fill: 'white',
                            transition: 'all 1s',
                        },
                    }}
                >
                    <Box
                        className="iconWrapper"
                        sx={{
                            display: 'flex',
                            marginRight: {
                                sm: 1,
                                xs: 0,
                            },
                        }}
                    >
                        {isSelected ? menu.iconActive : menu.icon}
                    </Box>
                </Box>
            </a>
        </NextLink>
    )
}

//Type 2. Button
const menuTypeButtonWithEvent = (variant, color, title, event, icon) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // background: '#000',
            }}
        >
            {/* Divider Icon */}
            <Box
                sx={{
                    width: '2px',
                    height: '30px',
                    background: '#eee',
                    borderRadius: '20px',
                    ml: 1,
                    mr: 2,
                }}
            />
            {/* 2. Mobile Icon */}
            <IconButton onClick={event} sx={{ display: 'flex' }}>
                {icon}
            </IconButton>
        </Box>
    )
}

//Type 3. Button With Link
const menuTypeButtonWithLink = (variant, color, title, link, icon) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // background: '#000',
            }}
        >
            {/* Divider Icon */}
            <Box
                sx={{
                    width: '2px',
                    height: '30px',
                    background: '#eee',
                    borderRadius: '20px',
                    ml: 1,
                    mr: 2,
                }}
            />

            {/* 2. Mobile Icon */}
            <IconButton component="a" href={link} sx={{ display: 'flex' }}>
                {icon}
            </IconButton>
        </Box>
    )
}
