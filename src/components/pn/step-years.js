import { useState } from 'react'
import dayjs from 'dayjs'

/*MUI Element*/
import { LocalizationProvider, DatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

const title = '생년월일을 입력해주세요.\n(주민등록상 생년월일로 입력해주세요.)'
const item = [
    { text: '연도', conetents: '', count: 0 },
    { text: '새', conetents: '', count: 10 },
]

const Step_Years = () => {
    const [startDate, setStartDate] = useState(new Date())
    const [datePickerValue, setDatePickerValue] = useState(dayjs('2022-04-07'))

    // const onClickSelectedNumber = (value) => {
    //     setSelectedNumber(value)
    // }
    return (
        <>
            <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                <Box sx={{ width: '100%', my: 2 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left', whiteSpace: 'pre' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                <Box sx={{ mx: 0, my: 5 }}>
                    {/* <Typography sx={{ mb: 3, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>선택 :{startDate.toString()}</Typography> */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ mr: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={'fr'}>
                                    <MobileDatePicker
                                        label=""
                                        inputFormat="yyyy년 MM월 dd일"
                                        views={['year', 'month', 'day']}
                                        openTo={`year`}
                                        // toolbarPlaceholder="-"
                                        onChange={(newDate) => setStartDate(newDate)}
                                        renderInput={(inputProps) => (
                                            <Box sx={{ width: '300px', height: '200px', background: '#1C60FF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <TextField {...inputProps} variant="outlined" sx={{ color: '#fff', background: '#fff', borderRadius: '10px' }} />
                                            </Box>
                                        )}
                                        value={startDate}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_Years
