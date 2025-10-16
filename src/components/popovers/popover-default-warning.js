import NextLink from 'next/link'
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import {
    Badge,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { X as XIcon } from '@components/icons/x'
import { wait } from '@utils/wait'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import { GuestGuard } from '@components/auth/guest-guard'

const DefaultWarningPopover = (props) => {
    const { onClose, open, dismiss, title, description, buttonName, ...other } = props

    return (
        <Dialog fullWidth maxWidth="xs" onClose={onClose} open={!!open} {...other}>
            <DialogContent>
                <Box
                    sx={{
                        pt: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* <Avatar
                        sx={{
                            backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
                            color: 'success.main',
                            mb: 2,
                        }}
                    >
                        <CheckIcon fontSize="small" />
                    </Avatar> */}
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: '500' }}>{title}</Typography>
                    <Typography align="center" color="textSecondary" sx={{ mt: 1 }} variant="body2">
                        {description}
                    </Typography>
                    <Button
                        fullWidth
                        size="large"
                        sx={{ mt: 4 }}
                        variant="contained"
                        onClick={onClose}
                    >
                        {buttonName ? buttonName : '확인'}
                    </Button>
                </Box>
                {/* Modal Button */}
                {/* <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 5,
                    }}
                >
                    {dismiss && (
                        <Button
                            sx={{
                                mr: 2,
                            }}
                            // variant="outlined"
                            onClick={dismiss}
                        >
                            다시보지 않기
                        </Button>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button size="large" variant="contained" onClick={onClose}>
                            확인
                        </Button>
                    </Box>
                </Box> */}
            </DialogContent>
        </Dialog>
    )
}

DefaultWarningPopover.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

// DefaultWarningPopover.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default DefaultWarningPopover
