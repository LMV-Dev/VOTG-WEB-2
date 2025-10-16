import NextLink from 'next/link'
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Badge, Box, Button, CircularProgress, Dialog, DialogContent, Divider, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { X as XIcon } from '@components/icons/x'
import { wait } from '@utils/wait'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import { GuestGuard } from '@components/auth/guest-guard'
import ReactPlayer from 'react-player'
// import Vid from './public/media/intro.mp4'

const IntroMediaPopover = (props) => {
    const { onClose, open, dismiss, title, description, buttonName, ...other } = props

    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const onLoadedData = () => {
        setIsVideoLoaded(true)
    }

    return (
        <Dialog fullWidth maxWidth="lg" onClose={onClose} open={!!open} {...other} sx={{ maxWidth: '1100px', margin: '0 auto' }}>
            <DialogContent sx={{ p: 0 }}>
                <Box
                    sx={{
                        pt: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <ReactPlayer url={'/media/intro.mp4'} playing={true} controls={true} loop={true} muted={true} playsinline={true} onReady={onLoadedData} width="100%" height="100%" />
                </Box>
                {/* Modal Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: -2,
                    }}
                >
                    {dismiss !== undefined && (
                        <Box sx={{ position: 'relative' }}>
                            <Button fullWidth size="small" sx={{ mt: 2 }} variant="text" onClick={dismiss}>
                                다시보지 않기
                            </Button>
                        </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ position: 'relative' }}>
                        <Button fullWidth size="small" sx={{ mt: 2 }} variant="text" onClick={onClose}>
                            {buttonName ? buttonName : '확인'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

IntroMediaPopover.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

// IntroMediaPopover.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default IntroMediaPopover
