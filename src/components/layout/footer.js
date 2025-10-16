import NextLink from 'next/link'
import { Box, Container, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Typography, Button, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { MinusOutlined as MinusOutlinedIcon } from '@components/icons/minus-outlined'
import { useSettings } from '@hooks/use-settings'
import { useAuth } from '@hooks/use-auth'
import { toast } from 'react-toastify'
import { Logo } from '@components/layout/logo'
import { Fragment } from 'react'

/* MUI icon */
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'

export const Footer = (props) => {
    // 디자인 맞춤 푸터
    return (
        <Box
            sx={{
                backgroundColor: '#181a23',
                color: '#fff',
                borderTop: '1px solid #232533',
                pt: { xs: 5, md: 7 },
                pb: { xs: 2, md: 3 },
                fontSize: '0.92rem',
                textAlign: { xs: 'left', md: 'left' },
            }}
            component="footer"
            {...props}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, md: 0 }, overflowX: 'hidden' }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent={{ xs: 'left', md: 'flex-start' }}
                    textAlign={{ xs: 'left', md: 'left' }}
                >
                    <Grid item xs={12} md={8}>
                        <Box>
                            <Box sx={{ mb: 1.2 }}>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontWeight: 700,
                                        minWidth: 90,
                                        display: 'inline-block',
                                        fontSize: '0.97em',
                                    }}
                                >
                                    Address
                                </Typography>
                                <Typography
                                    component="span"
                                    sx={{
                                        ml: 2,
                                        color: '#bfc3d4',
                                        fontSize: '0.97em',
                                    }}
                                >
                                    41566 대구광역시 북구 대학로 80 (산격동,경북대학교) 글로벌플라자 1101호
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1.2 }}>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontWeight: 700,
                                        minWidth: 90,
                                        display: 'inline-block',
                                        fontSize: '0.97em',
                                    }}
                                >
                                    Tel
                                </Typography>
                                <Typography
                                    component="span"
                                    sx={{
                                        ml: 2,
                                        color: '#bfc3d4',
                                        fontSize: '0.97em',
                                    }}
                                >
                                    053-950-6410~6412
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontWeight: 700,
                                        minWidth: 90,
                                        display: 'inline-block',
                                        fontSize: '0.97em',
                                    }}
                                >
                                    E-mail
                                </Typography>
                                <Typography
                                    component="span"
                                    sx={{
                                        ml: 2,
                                        color: '#bfc3d4',
                                        fontSize: '0.97em',
                                    }}
                                >
                                    <Link
                                        href="mailto:a3archi@knu.ac.kr"
                                        color="#bfc3d4"
                                        underline="always"
                                        sx={{ fontSize: '0.97em' }}
                                    >
                                        a3archi@knu.ac.kr
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3, borderColor: '#232533' }} />
                <Grid
                    container
                    alignItems="center"
                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                    textAlign={{ xs: 'center', md: 'left' }}
                    sx={{ fontSize: '0.66rem' }}
                >
                    <Grid item xs={12} md={8}>
                        <Typography sx={{ color: '#bfc3d4', fontSize: '0.66rem' }}>
                            Copyright(c) [AIBIM]인공지능 기반의 건축설계 자동화 기술개발 연구단. All rights reserved.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )

    
                    // <Grid
                    //     item
                    //     xs={12}
                    //     md={4}
                    //     sx={{
                    //         display: 'flex',
                    //         flexDirection: 'column',
                    //         alignItems: { xs: 'left', md: 'flex-start' },
                    //         justifyContent: 'center',
                    //         maxWidth: 320,
                    //     }}
                    // >
                    //     <Typography sx={{ fontWeight: '100%', mb: 1, fontSize: '0.97em' }}>
                    //         Family Site
                    //     </Typography>
                    //     <Box component="form" sx={{ maxWidth: 260, width: '100%' }}>
                    //         <Box
                    //             component="select"
                    //             sx={{
                    //                 maxWidth: 260,
                    //                 width: '100%',
                    //                 p: 1.2,
                    //                 borderRadius: 1,
                    //                 border: '1px solid #232533',
                    //                 background: 'none',
                    //                 color: '#bfc3d4',
                    //                 outline: 'none',
                    //                 mt: 0.5,
                    //                 fontSize: '0.97em',
                    //                 boxSizing: 'border-box',
                    //             }}
                    //             defaultValue=""
                    //         >
                    //             <option value="" disabled>
                    //                 관련사이트 바로가기
                    //             </option>
                    //             <option value="https://aibim.kr">AIBIM 공식 홈페이지</option>
                    //             {/* 추가 사이트 필요시 여기에 option 추가 */}
                    //         </Box>
                    //     </Box>
                    // </Grid>


                    
                    // <Grid
                    //     item
                    //     xs={12}
                    //     md={4}
                    //     sx={{
                    //         mt: { xs: 1, md: 0 },
                    //     }}
                    // >
                    //     <Box>
                    //         <Link
                    //             href="#"
                    //             color="#bfc3d4"
                    //             underline="hover"
                    //             sx={{ mx: 1, fontSize: '0.66rem' }}
                    //         >
                    //             개인정보처리방침
                    //         </Link>
                    //         <Link
                    //             href="#"
                    //             color="#bfc3d4"
                    //             underline="hover"
                    //             sx={{ mx: 1, fontSize: '0.66rem' }}
                    //         >
                    //             이용약관
                    //         </Link>
                    //         <Link
                    //             href="#"
                    //             color="#bfc3d4"
                    //             underline="hover"
                    //             sx={{ mx: 1, fontSize: '0.66rem' }}
                    //         >
                    //             이메일무단수집거부
                    //         </Link>
                    //         <Link
                    //             href="#"
                    //             color="#bfc3d4"
                    //             underline="hover"
                    //             sx={{ mx: 1, fontSize: '0.66rem' }}
                    //         >
                    //             사이트맵
                    //         </Link>
                    //     </Box>
                    // </Grid>
}
