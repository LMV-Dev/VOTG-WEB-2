import { MenuItem, Popover } from '@mui/material'

const organizations = ['Splash', 'ASH etc.']

export const OrganizationPopover = (props) => {
    const { anchorEl, onClose, open, ...other } = props

    const handleChange = (organization) => {
        onClose?.()
    }

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom',
            }}
            keepMounted
            onClose={onClose}
            open={!!open}
            PaperProps={{ sx: { width: 248 } }}
            transitionDuration={0}
            {...other}
        >
            {organizations.map((organization) => (
                <MenuItem
                    key={organization}
                    onClick={() => handleChange(organization)}
                    sx={{
                        color: 'text.primary',
                        fontSize: '13px',
                    }}
                >
                    {organization}
                </MenuItem>
            ))}
        </Popover>
    )
}
