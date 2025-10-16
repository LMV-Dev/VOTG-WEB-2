import Head from 'next/head'
import Image from 'next/image'

/* MUI */
import { Box, Typography, Divider } from '@mui/material'

//ELEMENT
const PAGE_TITLE = '개인정보보호정책'

/* Layouts */
import SubLayout from '@layouts/sub'
/* Compoent/Home */
import { SubPrivacy } from '@components/home/sub-privacy'

const Privacy = () => {
    return (
        <>
            <Head>
                <title>{PAGE_TITLE} - 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>

            <main>
                <Box
                    sx={{
                        backgroundColor: 'black',
                        backgroundImage: "url('/background/service_bg_05.jpeg')",
                        backgroundSize: {
                            xs: 'auto 100%',
                        },
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center',
                        flexGrow: 1,
                        zIndex: 10,
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            pt: 5,
                            pb: 3,
                            px: { sm: 15, xs: 2 },
                            background: 'rgba(0,0,0,0.5)',
                        }}
                    >
                        <Typography align="center" sx={{ pb: 1, color: '#fff', fontSize: '1.5rem', fontWeight: '700' }}>
                            {PAGE_TITLE}
                        </Typography>
                        {/* <Typography align="center" sx={{ pb: 2, color: '#fff', fontSize: '0.8rem', fontWeight: '400' }}>
                            Academic Survey Research
                        </Typography> */}
                    </Box>
                </Box>
                <SubPrivacy />
            </main>
        </>
    )
}

Privacy.getLayout = (page) => <SubLayout>{page}</SubLayout>

export default Privacy
