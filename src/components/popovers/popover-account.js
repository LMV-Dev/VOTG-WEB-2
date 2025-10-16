import NextLink from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'
import { Avatar, Box, Divider, ListItemIcon, ListItemText, MenuItem, Popover, Typography } from '@mui/material'
/* Icons */
import LogoutIcon from '@mui/icons-material/Logout'
/* Hooks */
import { useAuth } from '@hooks/use-auth'
import { Cog as CogIcon } from '@components/icons/cog'
import { UserCircle as UserCircleIcon } from '@components/icons/user-circle'
import { SwitchHorizontalOutlined as SwitchHorizontalOutlinedIcon } from '@components/icons/switch-horizontal-outlined'

export const AccountPopover = (props) => {
    const { anchorEl, onClose, open, ...other } = props
    const router = useRouter()
    const { logout } = useAuth()
    // To get the user from the authContext, you can use
    const { user: userData } = useAuth()
    // console.log('userData', userData)

    const handleLogout = async () => {
        try {
            onClose?.()
            await logout()
            handlePushRoutingEvent()
            toast.success('로그아웃')
        } catch (err) {
            console.error(err)
            toast.error('Unable to logout.')
        }
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
        await router.push('/').catch(console.error)
    }

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
            }}
            keepMounted
            onClose={onClose}
            open={!!open}
            PaperProps={{ sx: { width: 300 } }}
            transitionDuration={0}
            {...other}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    p: 2,
                    display: 'flex',
                }}
            >
                <Avatar
                    src={userData?.profile === undefined ? '/' : userData.profile}
                    sx={{
                        height: 40,
                        width: 40,
                    }}
                >
                    <UserCircleIcon fontSize="small" />
                </Avatar>
                <Box
                    sx={{
                        ml: 1,
                    }}
                >
                    <Typography variant="body1">{userData?.name}</Typography>
                    <Typography color="textSecondary" variant="body2">
                        {userData?.type === 0 ? 'Starter' : userData?.type === 1 ? 'Standard' : userData?.type === 2 ? 'Professional' : 'Develop'}
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <Box sx={{ my: 1 }}>
                <NextLink href="/ws/mypage" passHref>
                    <MenuItem component="a">
                        <ListItemIcon>
                            <UserCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body1">마이페이지</Typography>} />
                    </MenuItem>
                </NextLink>

                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body1">로그아웃</Typography>} />
                </MenuItem>
            </Box>
        </Popover>
    )
}

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}
