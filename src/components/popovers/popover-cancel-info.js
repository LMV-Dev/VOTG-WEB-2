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

const CancelInfoPopover = (props) => {
    const { onClose, open, event, title, description, cancelName, confirmName, color, ...other } = props

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
                    <Button
                        color="secondary"
                        sx={{
                            mr: 2,
                        }}
                        // variant="outlined"
                        onClick={onClose}
                    >
                        {cancelName}
                    </Button>
                    {confirmName !== '' && (
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button color={color || 'success'} size="large" variant="contained" onClick={event}>
                                {confirmName}
                            </Button>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

CancelInfoPopover.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

// DefaultWarningPopover.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default CancelInfoPopover
