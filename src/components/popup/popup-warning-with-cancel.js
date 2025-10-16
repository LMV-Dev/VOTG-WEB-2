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

const PopupWarningWithCancel = (props) => {
    const { onClose, open, event, sw, title, description, cancelName, confirmName, color, ...other } = props

    if (sw == undefined || sw == null) {
        sw = false
    }
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
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: '500', textAlign: 'center' }}>{title}</Typography>
                    <Typography align="center" color="textSecondary" sx={{ mt: 3, whiteSpace: 'pre-wrap', lineHeight: '2' }} variant="body2">
                        {description}
                    </Typography>
                </Box>
                {/* Modal Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 5,
                    }}
                >
                    <Box sx={{ flexGrow: 1 }} />
                    {cancelName?.length > 0 && (
                        <Button
                            color={color || 'primary'}
                            sx={{
                                mr: 2,
                            }}
                            // variant="outlined"
                            onClick={sw ? event : onClose}
                        >
                            {cancelName}
                        </Button>
                    )}
                    {confirmName?.length > 0 && (
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button color={color || 'primary'} size="large" variant="contained" onClick={sw ? onClose : event}>
                                {confirmName}
                            </Button>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

PopupWarningWithCancel.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

// DefaultWarningPopover.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default PopupWarningWithCancel
