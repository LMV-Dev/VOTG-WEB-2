import { Fragment, useState, useEffect } from 'react'
import { Avatar, Checkbox, Box, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import { Scrollbar } from '@components/layout/scrollbar'
import { Logo } from '@components/layout/logo'

export const HomeSoon = (props) => {
    const now = new Date()
    const theme = useTheme()

    const handleChangeFeature = (index) => {
        setSelectedFeature(index)
    }
    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                py: 3,
            }}
            {...props}
        >
            <Container maxWidth="lg">
                <Paper>
                    <Scrollbar>
                        <Box
                            sx={{
                                // minWidth: 800,
                                p: 6,
                            }}
                        >
                            <Grid container justifyContent="center">
                                <Grid item alignItems="center">
                                    <Logo width={300} style={{ marginRight: '40px' }} />
                                    <Typography textAlign={'center'} sx={{ my: 1, fontWeight: 700, fontSize: '2rem' }}>
                                        뷰즈온더고
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ my: 2 }}>
                                {/* DIVIDED */}
                                <br />
                                <Typography variant="body1" textAlign={'center'} sx={{ fontWeight: 700 }}>
                                    곧 더 좋은서비스로 찾아뵙겠습니다.
                                </Typography>
                                <br />
                                <Typography variant="body1" textAlign={'center'} sx={{ fontWeight: 700 }}>
                                    OPEN : 2022.10.12
                                </Typography>
                                <br />
                            </Box>
                        </Box>
                    </Scrollbar>
                </Paper>
            </Container>
        </Box>
    )
}
