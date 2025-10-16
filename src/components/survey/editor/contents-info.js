import { Fragment, useEffect, useState } from 'react'

import { Box, Card, Grid, Typography, Tooltip, TextField, Divider } from '@mui/material'

/* Components :: For Static Info Title */
import Element_StaticInfo from '../element/element-static-info'

const ContetnsInfo = (props) => {
    const { currentSelected, editModeController, mainItemInfo, onChangeEditThisItem_Info, onChangeEditThisItem_LogoImage } = props

    const [isEditing, setIsEditing] = useState(currentSelected === -1)

    useEffect(() => {
        setIsEditing(currentSelected === -1)
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
                <Grid item xs={8} xmd={8} md={9}>
                    <Box sx={{ margin: '0 auto', my: 2, mx: 1 }}>
                        <Card
                            onClick={(e) => editModeController(e, -1, mainItemInfo)}
                            elevation={0}
                            sx={{
                                minHeight: '250px',
                                height: '100%',
                                px: 5,
                                pt: 5,
                                pb: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                border: isEditing 
                                    ? '2px solid #667eea' 
                                    : '1px solid rgba(102, 126, 234, 0.2)',
                                boxShadow: isEditing
                                    ? '0 35px 70px rgba(102, 126, 234, 0.25)'
                                    : '0 15px 35px rgba(0, 0, 0, 0.08)',
                                position: 'relative',
                                overflow: 'visible',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': !isEditing && {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)',
                                    border: '1px solid rgba(102, 126, 234, 0.3)',
                                    cursor: 'pointer',
                                },
                                '&:before': isEditing && {
                                    content: '""',
                                    position: 'absolute',
                                    top: -2,
                                    left: -2,
                                    right: -2,
                                    bottom: -2,
                                    borderRadius: '26px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                    zIndex: -1,
                                    opacity: 0.1,
                                },
                            }}
                        >
                            <Element_StaticInfo 
                                isEditing={isEditing} 
                                mainItemInfo={mainItemInfo} 
                                onChangeEditThisItem_Info={onChangeEditThisItem_Info} 
                                onChangeEditThisItem_LogoImage={onChangeEditThisItem_LogoImage} 
                            />
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default ContetnsInfo