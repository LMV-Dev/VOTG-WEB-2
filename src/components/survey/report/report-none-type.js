import React from 'react'

import { CardContent, Box, Typography } from '@mui/material'

const Report_NoneType = () => {
    return (
        <CardContent>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: '40px',
                    mb: '80px',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        textAlign: 'center',
                    }}
                >
                    응답형태가 선택되지 않았습니다.
                </Typography>
            </Box>
        </CardContent>
    )
}

export default Report_NoneType
