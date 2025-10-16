import { Fragment, useEffect, useState } from 'react'

import { Box, Card, Grid, Typography, Tooltip, TextField, Divider } from '@mui/material'

/* Components :: For Static Info Title */
import Element_StaticInfo from '../element/element-static-info'

const PContentsInfo = (props) => {
    const { mainItemInfo, currentSelected, focusingController } = props

    const [isFocusing, setIsFocusing] = useState(currentSelected === -1)

    useEffect(() => {
        setIsFocusing(currentSelected === -1)
    }, [currentSelected])

    return (
        <>
            <Grid container spacing={1}>
                {/**
                 *
                 *
                 * 0. Contents Card Setting Grid
                 *
                 *
                 * */}
                <Grid item xs={12} xmd={12} md={12}>
                    <Box sx={{ margin: '0 auto', my: 2, mx: 1 }}>
                        <Card
                            onClick={(e) => focusingController(e, -1, mainItemInfo)}
                            sx={{
                                minHeight: '200px',
                                height: '100%',
                                px: 5,
                                pt: 5,
                                pb: 4,
                                border: isFocusing ? '2px solid #eee' : '2px solid #fff',
                                ...(isFocusing && { boxShadow: (theme) => theme.shadows[15] }),
                                '&:hover': !isFocusing && {
                                    border: '2px solid #eee',
                                    cursor: 'pointer',
                                    transition: 'all 0.5s',
                                },
                            }}
                        >
                            <Element_StaticInfo mode={'write'} isFocusing={isFocusing} mainItemInfo={mainItemInfo} />
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default PContentsInfo
