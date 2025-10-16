import React from 'react'

/* MUI */
import { Box, Typography } from '@mui/material'

const SubTitle = (props) => {
    const { title, underTitle, src } = props
    return (
        <>
            {/* SUB TITLE */}
            <Box
                sx={{
                    backgroundColor: 'black',
                    backgroundImage: `url(${src})`,
                    backgroundSize: {
                        md: '100% auto',
                        xs: 'auto 100%',
                    },
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center top',
                    flexGrow: 1,
                    zIndex: 10,
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        pt: 5,
                        pb: 3,
                        px: { sm: 15, xs: 2 },
                        background: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <Typography align="center" sx={{ pb: 1, color: '#fff', fontSize: '1.5rem', fontWeight: '700' }}>
                        {title}
                    </Typography>
                    {underTitle?.length > 0 && (
                        <Typography align="center" sx={{ pb: 2, color: '#fff', fontSize: '0.8rem', fontWeight: '400' }}>
                            {underTitle}
                        </Typography>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default SubTitle
