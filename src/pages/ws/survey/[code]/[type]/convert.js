import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { pdfjs, Document, Page } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const STORAGE_PATH = process.env.NEXT_PUBLIC_STORAGE_PATH
//File Drop
import { FileDropzone } from '@components/convert/home-file-dropzone-demo'
import { PDFViewr } from '@components/convert/home-file-pdfviewer-demo'
//NEW
import { PDFHashPreviewer } from '@components/convert/pdf-hash-new'

import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery, Box, Button, IconButton, Card, CardHeader, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Toolbar, Typography, Radio, CircularProgress } from '@mui/material'
import { AuthGuard } from '@components/auth/auth-guard'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
import LayoutSurveyProgressMenu from '@layouts/ws/layout-survey-progress-menu'

/* Icons */
import { ArrowRight as ArrowRightIcon } from '@components/icons/arrow-right'

/*Popup*/
import DefaultInfoPopoverInfoConvert from '@components/popovers/popover-default-info'
/*Popup*/
import ConvertGuidePopover from '@components/popovers/popover-convert-guide'

const Survey_Convert = () => {
    const theme = useTheme()
    const router = useRouter()
    const { name } = router.query
    const deviceUp_xsl = useMediaQuery(theme.breakpoints.up('xsl'))
    const deviceUp_lg = useMediaQuery(theme.breakpoints.up('lg'))
    const deviceUp_xmd = useMediaQuery(theme.breakpoints.up('xmd'))
    const deviceUp_sm = useMediaQuery(theme.breakpoints.up('sm'))

    const [widthForDocument, setWidthForDocument] = useState(600)
    useEffect(() => {
        setWidthForDocument(deviceUp_xsl ? 600 : deviceUp_lg ? 430 : deviceUp_xmd ? 450 : deviceUp_sm ? 600 : 400)
    }, [deviceUp_xsl, deviceUp_lg, deviceUp_xmd, deviceUp_sm])
    /* Sidebar */
    const [isSidebarOpen, setSidebarOpen] = useState(true)

    /*Document*/
    const documentRef = useRef(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState(null)

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }

    const [fileName, setFileName] = useState(null)
    //File Drop
    const [files, setFiles] = useState([])

    const handleDrop = (newFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }

    const handleRemove = (file) => {
        setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path))
        globalThis.sessionStorage.removeItem('set-file-cache')
    }

    const handleRemoveAll = () => {
        setFiles([])
    }

    useEffect(() => {
        const file = globalThis.sessionStorage.getItem('set-file-cache')
        setFileName(file)
    }, [])

    /*Info Popup*/
    const [openDialogDefaultInfo, setOpenDialogDefaultInfo] = useState(false)
    const handleOpenDefaultInfo = () => {
        setOpenDialogDefaultInfo(true)
    }
    const handleCloseDefaultInfo = () => {
        setOpenDialogDefaultInfo(false)
    }

    /*Popup Setting*/
    useEffect(() => {
        if (fileName !== null) {
            handleOpenDefaultInfo()
        }
    }, [fileName])

    /*file Setting*/
    useEffect(() => {
        // console.log('fileName', fileName)
        if (fileName !== null && name !== fileName) {
            router.push(`/ws/survey/${fileName}/cnvt/convert`).catch(console.error)
        }
    }, [fileName])

    /*Guide Popup*/
    const [openDialogConvertGuide, setOpenDialogConvertGuide] = useState(false)
    const handleOpenConvertGuide = () => {
        setOpenDialogConvertGuide(true)
    }
    const handleCloseConvertGuide = async () => {
        setOpenDialogConvertGuide(false)
    }

    return (
        <>
            <ConvertGuidePopover onClose={handleCloseConvertGuide} open={openDialogConvertGuide} title={'변환방법 가이드'} description={''} buttonName={'닫기'} />
            <DefaultInfoPopoverInfoConvert onClose={handleCloseDefaultInfo} open={openDialogDefaultInfo} title={'변환이 완료되었습니다.'} description={'모든 문항이 "객관식 단일응답"으로 자동 변환되었습니다.'} />
            <Head>
                <title>설문조사 제작 | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            {/* <ElementSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} /> */}

            <LayoutSurveyProgressMenu editMode={false}>
                <Container maxWidth="xl" disableGutters={true}>
                    {fileName === null && (
                        <Box
                            sx={{
                                pt: 8,
                                pb: 10,
                                paddingInline: {
                                    xsl: 20,
                                    lg: 10,
                                    md: 0,
                                    xs: 'none',
                                },
                            }}
                        >
                            <Card
                                sx={{
                                    position: 'relative',
                                    '& + &': {
                                        mt: 6,
                                    },
                                    paddingBlock: {
                                        md: 1,
                                        xs: 'none',
                                    },
                                    paddingInline: {
                                        md: 3,
                                        xs: 'none',
                                    },
                                    borderRadius: 0,
                                    // boxShadow: theme.shadows[15],
                                }}
                            >
                                <CardContent>
                                    {/* Contents */}
                                    <Box
                                        sx={{
                                            justifyContent: 'left',
                                            alignItems: 'center',
                                            display: 'flex',
                                        }}
                                    >
                                        <img alt="" src="/origin/symbol_color_exp.svg" width={40} />
                                        <Typography
                                            color="text.black"
                                            sx={{
                                                fontSize: {
                                                    md: '1.3rem',
                                                    xs: '1rem',
                                                },
                                                fontWeight: 700,
                                                // height: 48,
                                                overflow: 'hidden',
                                                fontFamily: 'Noto Sans KR',
                                                textOverflow: 'ellipsis',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                ml: 2,
                                            }}
                                        >
                                            변환해서 설문지를 만들어보세요
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />

                                        <Button onClick={handleOpenConvertGuide} variant="contained" size="medium" align="right" sx={{ ml: 2, color: 'primary.text', display: { sm: 'flex', xs: 'none' } }} target="_blank" download>
                                            변환 방법 가이드
                                        </Button>
                                    </Box>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            mt: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex',
                                            }}
                                        >
                                            <Typography variant="subtitle2">설문지 양식 다운받기 </Typography>
                                        </Box>
                                        <Button variant="outlined" component="a" href="/sample/viewsonthego_sample_pdf.pdf" size="medium" align="right" sx={{ ml: 2, color: 'primary.main' }} target="_blank" download>
                                            PDF 설문지 샘플
                                        </Button>
                                        <Button variant="outlined" component="a" href="/sample/viewsonthego_sample_doc.docx" size="medium" align="right" sx={{ ml: 2, color: 'primary.main' }} target="_blank" download>
                                            WORD 설문지 양식
                                        </Button>
                                        <Button variant="outlined" component="a" href="/sample/viewsonthego_sample_hwp.hwp" size="medium" align="right" sx={{ ml: 2, color: 'primary.main' }} target="_blank" download>
                                            HWP 설문지 양식
                                        </Button>
                                    </Box>
                                    <Box
                                        sx={{
                                            mt: 2,
                                        }}
                                    >
                                        <FileDropzone
                                            accept={{
                                                'application/pdf': [],
                                            }}
                                            files={files}
                                            onDrop={handleDrop}
                                            onRemove={handleRemove}
                                            onRemoveAll={handleRemoveAll}
                                        />
                                    </Box>
                                    <PDFViewr files={files} openPopup={() => {}} setUpdateFileName={setFileName} />
                                </CardContent>
                            </Card>
                        </Box>
                    )}

                    {fileName !== null && (
                        <>
                            <Box sx={{ mt: 3, mx: 1 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                mx: 1,
                                                my: 1,
                                            }}
                                        >
                                            {pageNumber > 1 && (
                                                <Button align="left" onClick={() => setPageNumber((prev) => prev + -1)}>
                                                    이전페이지
                                                </Button>
                                            )}
                                            <Box sx={{ flexGrow: 1 }} />
                                            {pageNumber < numPages && (
                                                <Button align="right" onClick={() => setPageNumber((prev) => prev + +1)}>
                                                    다음페이지
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        xmd={6}
                                        md={5}
                                        sx={{
                                            display: {
                                                md: 'block',
                                                xs: 'none',
                                            },
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                height: '100%',
                                                pb: 8,
                                                '& canvas': {
                                                    margin: '0 auto',
                                                    width: '100%',
                                                },
                                            }}
                                        >
                                            <CardHeader title={`원본`} />
                                            <Divider />
                                            <Document
                                                ref={documentRef}
                                                sx={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    width: '100%',
                                                    height: 'auto',
                                                }}
                                                // file={'http://localhost:7701/pdf/type_sample_00.pdf'}
                                                file={`https://api.koaiarchitecture.com/uploads/${fileName}`}
                                                onLoadSuccess={onDocumentLoadSuccess}
                                                onLoadError={console.error}
                                                loading={
                                                    <CircularProgress
                                                        size={50}
                                                        sx={{
                                                            color: 'primary.main',
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            marginTop: '-12px',
                                                            marginLeft: '-12px',
                                                        }}
                                                    />
                                                }
                                            >
                                                <Page width={widthForDocument} pageNumber={pageNumber} />
                                            </Document>
                                        </Card>
                                    </Grid>
                                    {/* <Grid item xs={12} xmd={12} md={7}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        pb: 8,
                                        '& canvas': {
                                            margin: '0 auto',
                                            width: '100%',
                                        },
                                    }}
                                >
                                    <CardHeader title={`변환`} />
                                    <Divider />
                                    <PDFExtractSvg
                                        docWidth={widthForDocument}
                                        fileName={fileName}
                                        pageNumber={pageNumber}
                                    />
                                </Card>
                            </Grid> */}

                                    {/* <Grid item xs={12} xmd={12} md={7}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        pb: 8,
                                    }}
                                >
                                    <CardHeader title={`변환결과`} />
                                    <Divider />
                                    <Container>
                                        <PDFExtractJson pageNumber={pageNumber} />
                                    </Container>
                                </Card>
                            </Grid> */}

                                    {/* <Grid item xs={12} xmd={12} md={7}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        pb: 8,
                                    }}
                                >
                                    <CardHeader title={`변환결과`} />
                                    <Divider />
                                    <Container>
                                        <PDFHashService pageNumber={pageNumber} />
                                    </Container>
                                </Card>
                            </Grid> */}

                                    <Grid item xs={12} xmd={12} md={7}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                pb: 8,
                                            }}
                                        >
                                            <CardHeader title={`변환결과`} />
                                            <Divider />
                                            <Container sx={{ width: '500px', mt: '100px' }}>
                                                <PDFHashPreviewer pageNumber={pageNumber} pageLength={numPages} />
                                            </Container>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    )}
                </Container>
            </LayoutSurveyProgressMenu>
        </>
    )
}

Survey_Convert.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default Survey_Convert
