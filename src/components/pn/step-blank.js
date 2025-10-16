import { useState } from 'react'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

const title = '성별을 선택해주세요.'
const item = [
    { text: '남성', count: 0 },
    { text: '여성', count: 10 },
]

const Step_Blank = () => {
    const [selectedNumber, setSelectedNumber] = useState(null)

    const onClickSelectedNumber = (value) => {
        setSelectedNumber(value)
    }
    return (
        <>
            <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                <Box sx={{ width: '100%', my: 2 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                <Box sx={{ mx: 0, my: 5 }}>
                    <Typography sx={{ mb: 3, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>선택 : {item[selectedNumber]?.text}</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Box
                                onClick={() => onClickSelectedNumber(0)}
                                sx={{
                                    width: '130px',
                                    height: '130px',
                                    pt: 3,
                                    background: '#64B6F7',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 0 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                }}
                            >
                                <MaleIcon sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} />
                                <Typography sx={{ color: 'text.white', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }}>{item[0].text}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                onClick={() => onClickSelectedNumber(1)}
                                sx={{
                                    width: '130px',
                                    height: '130px',
                                    pt: 3,
                                    background: '#FF8264',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 1 && {
                                        background: '#EC605A',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                }}
                            >
                                <FemaleIcon sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} />
                                <Typography sx={{ color: 'text.white', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }}>{item[1].text}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_Blank
