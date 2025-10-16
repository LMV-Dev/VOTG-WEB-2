import React from 'react'

import {
    useMediaQuery,
    Box,
    Button,
    IconButton,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Container,
    Divider,
    Grid,
    MenuItem,
    Tooltip,
    TextField,
    Toolbar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    Collapse,
    Rating,
} from '@mui/material'

/*MUI Icon*/
import GroupIcon from '@mui/icons-material/Group'

/*Custom Icon*/
import { IconPanelsDirectDistribute } from '@public/votg/IconPanelsDirectDistribute'
import { SubRequest_Panels } from '@components/home/sub-request-panels'

const PnlsContents = (props) => {
    const { selectedPanels, onClickSelectedPanels } = props
    // console.log('selectedPanels', selectedPanels)
    return (
        <>
            <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {/* Intro TItle */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ color: 'text.black', fontSize: '1.8rem', fontWeight: 700, textAlignt: 'center' }}>응답자 설정</Typography>
                    {selectedPanels === null ? (
                        <Typography sx={{ py: 1, color: 'text.secondary', fontSize: '1.3rem', fontWeight: 500, textAlignt: 'center' }}>선택해주세요</Typography>
                    ) : (
                        <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ py: 1, color: selectedPanels?.selected === 0 ? '#72C1FA' : '#FF5353', fontSize: '1.3rem', fontWeight: 700, textAlignt: 'center' }}>{selectedPanels?.selected === 0 ? '패널 구매' : '직접 배포'}</Typography>
                            <Typography sx={{ py: 1, color: 'text.black', fontSize: '1.3rem', fontWeight: 500, textAlignt: 'center' }}>로 진행하기</Typography>
                        </Box>
                    )}
                </Box>
                <Divider sx={{ mb: 3 }} />
                {/* Service Card */}
                <Box sx={{ width: '100%', height: { sm: '45vh', xs: '20vh' }, pt: 3, display: 'flex', flexWrap: 'wrap', gap: '1rem', flexDirection: { sm: 'column', xs: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* <NextLink href={`/ws/survey/${createResourceCode()}/${surveyType[1].url}/editor`}> */}
                    <Box
                        onClick={() => onClickSelectedPanels(0)}
                        sx={{
                            flexGrow: 1,
                            width: { sm: '50%', xs: '100%' },
                            height: '100%',
                            background: '#72C1FA',
                            display: 'flex',
                            flexDirection: { sm: 'column', xs: 'row' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'all 0.5s',
                            '&:hover': {
                                cursor: 'pointer',
                                opacity: 0.8,
                                transition: 'all 0.5s',
                            },
                            px: 2,
                            ...(selectedPanels?.selected === 0 && {
                                borderColor: 'rgba(0,0,0,0.5)',
                                borderWidth: 10,
                                borderStyle: 'solid',
                                m: '-10px -5px',
                            }),
                        }}
                    >
                        <Typography
                            sx={{
                                mt: { sm: 5, xs: 'none' },
                                flexGrow: { sm: 0.5, xs: 'none' },
                                fontSize: { sm: '2rem', xs: '1.5rem' },
                                fontWeight: 700,
                                color: '#fff',
                                display: { sm: 'flex', xs: 'none' },
                                flexDirection: 'column',
                                justifyContent: 'top',
                            }}
                        >
                            패널 구매
                        </Typography>
                        <GroupIcon color="white" sx={{ flexGrow: { sm: 1, xs: 'none' }, width: { sm: '7rem', xs: '3.5rem' }, height: { sm: '7rem', xs: '3.5rem' }, mr: 2 }} />
                        <Typography
                            sx={{
                                flexGrow: { sm: 1, xs: 'none' },
                                textAlign: { sm: 'center', xs: 'left' },
                                fontSize: { sm: '1rem', xs: '0.8rem' },
                                fontWeight: 700,
                                color: '#fff',
                                display: { sm: 'flex', xs: 'none' },
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                            }}
                        >
                            원하는 조건의 대상으로 <br />
                            설문을 진행할 수 있습니다.
                            <br /> 응답자 조건과 리워드를 선택하시면
                            <br /> 뷰즈온더고에서 배포를 진행합니다.
                        </Typography>

                        <Typography
                            sx={{
                                mt: { sm: 5, xs: 'none' },
                                flexGrow: { sm: 0.5, xs: 'none' },
                                fontSize: { sm: '2rem', xs: '2rem' },
                                fontWeight: 700,
                                color: '#fff',
                                display: { sm: 'none', xs: 'flex' },
                                flexDirection: 'column',
                                justifyContent: 'top',
                            }}
                        >
                            패널 구매
                        </Typography>
                    </Box>
                    {/* </NextLink> */}
                    {/* <NextLink href={`/ws/survey/${createResourceCode()}/${surveyType[0].url}/editor`}> */}
                    <Box
                        onClick={() => onClickSelectedPanels(1)}
                        sx={{
                            flexGrow: 1,
                            width: { sm: '50%', xs: '100%' },
                            height: '100%',
                            background: '#FF5353',
                            display: 'flex',
                            flexDirection: { sm: 'column', xs: 'row' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'all 0.5s',
                            '&:hover': {
                                cursor: 'pointer',
                                opacity: 0.8,
                                transition: 'all 0.5s',
                            },
                            px: 2,
                            ...(selectedPanels?.selected === 1 && {
                                borderColor: 'rgba(0,0,0,0.5)',
                                borderWidth: 10,
                                borderStyle: 'solid',
                                m: '-10px -5px',
                            }),
                        }}
                    >
                        <Typography
                            sx={{
                                mt: { sm: 5, xs: 'none' },
                                flexGrow: { sm: 0.5, xs: 'none' },
                                fontSize: { sm: '2rem', xs: '1.5rem' },
                                fontWeight: 700,
                                color: '#fff',
                                display: { sm: 'flex', xs: 'none' },
                                flexDirection: 'column',
                                justifyContent: 'top',
                            }}
                        >
                            직접 배포
                        </Typography>
                        <IconPanelsDirectDistribute customColor="#fff" sx={{ flexGrow: { sm: 1, xs: 'none' }, width: { sm: '7rem', xs: '48px' }, mr: 2 }} />
                        <Typography
                            sx={{
                                flexGrow: { sm: 1, xs: 'none' },
                                textAlign: { sm: 'center', xs: 'left' },
                                fontSize: { sm: '1rem', xs: '0.8rem' },
                                fontWeight: 700,
                                color: '#fff',
                                display: { sm: 'flex', xs: 'none' },
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                            }}
                        >
                            자체 패널을 이용해 설문을 진행할 수 있습니다. <br />
                            배포 방법과 리워드를 선택하시면 설문이 진행됩니다.
                        </Typography>
                        <Typography
                            sx={{
                                mt: { sm: 5, xs: 'none' },
                                flexGrow: { sm: 0.5, xs: 'none' },
                                fontSize: { sm: '2rem', xs: '2rem' },
                                fontWeight: 700,
                                color: '#fff',
                                display: { sm: 'none', xs: 'flex' },
                                flexDirection: 'column',
                                justifyContent: 'top',
                            }}
                        >
                            직접 배포
                        </Typography>
                    </Box>
                    {/* </NextLink> */}
                </Box>
            </Box>
            {/* 패널 구매 문의글 */}
            {selectedPanels?.selected === 0 && (
                <Box sx={{ mt: { sm: 0, xs: 20 } }}>
                    <SubRequest_Panels />
                </Box>
            )}
        </>
    )
}

export default PnlsContents
