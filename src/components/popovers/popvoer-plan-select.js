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

import { IconLogin } from '@public/votg/IconLogin'

const PlanSelectPopover = (props) => {
    const { onClose, open, ...other } = props

    return (
        <Dialog fullWidth maxWidth="xs" onClose={onClose} open={!!open} {...other}>
            <DialogContent>Info</DialogContent>
        </Dialog>
    )
}

PlanSelectPopover.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

PlanSelectPopover.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default PlanSelectPopover
