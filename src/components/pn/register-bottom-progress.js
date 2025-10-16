import React from 'react'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton, LinearProgress } from '@mui/material'

/*Mui Icon */
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

const RegisterBottomProgress = ({ pageStep, maxPageStep, totalSection, sectionEachStep }) => {
    return (
        <Box
            sx={{
                px: 2,
                pt: 2,
                pb: 5,
                height: '80px',
                position: 'fixed',
                bottom: '80px',
                background: 'transparent',
                boxShadow: (theme) => theme.shadows[3],
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Container component="main" maxWidth="sm" sx={{}}>
                <Grid container spacing={1}>
                    {sectionEachStep.map((v, index) => {
                        var current = sectionEachStep.slice(0, index).length == 0 ? 0 : sectionEachStep.slice(0, index).reduce((p, n) => p + n)
                        var next = sectionEachStep.slice(0, index + 1).reduce((p, n) => p + n)
                        var percent = 0
                        if (pageStep > current && pageStep < next) {
                            percent = (pageStep / next) * 100
                        }
                        return (
                            <Grid item xs={12 / totalSection} key={`prgrs-${index}`}>
                                <LinearProgress variant="determinate" value={percent} />
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </Box>
    )
}

export default RegisterBottomProgress
