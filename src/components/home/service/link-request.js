import React from 'react'
import NextLink from 'next/link'

/* MUI */
import { Box, Button, Container, Card, Typography, Paper, Grid } from '@mui/material'

/* MUI Icon */
import EmailIcon from '@mui/icons-material/Email'

/* Component */
// import LinkRequest from '@Components/home/service/link-request'

const LinkRequest = () => {
    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, my: 1 }}>
                {/* <Typography
                    color="text.main"
                    align="center"
                    sx={{
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        fontFamily: 'Poppins',
                        paddingInline: {
                            md: 5,
                            xs: 'none',
                        },
                    }}
                >
                    데이터 분석이 필요하신가요?
                </Typography> */}
                <NextLink href="/request">
                    <Button variant="contained" color="success" size="large" sx={{ minWidth: '220px' }} startIcon={<EmailIcon />}>
                        상담신청
                    </Button>
                </NextLink>
            </Card>
        </>
    )
}

export default LinkRequest
