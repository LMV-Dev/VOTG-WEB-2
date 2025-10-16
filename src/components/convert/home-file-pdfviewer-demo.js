import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { pdfjs, Document, Page } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

import API from '@utils/API'
import PDF from '@utils/PDF'
import { wait } from '@utils/wait'
import { UuidTool } from 'uuid-tool'

import { useMediaQuery, Avatar, Box, Button, Checkbox, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, autocompleteClasses } from '@mui/material'

import { useAuth } from '@hooks/use-auth'
import { Scrollbar } from '@components/layout/scrollbar'
import { Logo } from '@components/layout/logo'

import { PDFHashPreviewer } from '@components/convert/pdf-hash-previewer'

export const PDFViewr = (props) => {
    const theme = useTheme()

    const auth = useAuth()
    const { user } = useAuth()
    const deviceUp_xsl = useMediaQuery(theme.breakpoints.up('xsl'))
    const deviceUp_lg = useMediaQuery(theme.breakpoints.up('lg'))
    const deviceUp_md = useMediaQuery(theme.breakpoints.up('md'))
    const deviceUp_sm = useMediaQuery(theme.breakpoints.up('sm'))
    const deviceUp_xs = useMediaQuery(theme.breakpoints.up('xs'))

    const documentRef = useRef(null)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const { files = [], openPopup, setUpdateFileName } = props
    const [file, setFile] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState(null)

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }

    //* Upload */
    const [fileName, setFileName] = useState('')
    let formData = new FormData() // formData 객체를 생성한다.

    useEffect(() => {
        // console.log('PDFViewr-demo')

        if (files.length > 0) {
            setFile(files[0])
            setHeight(documentRef.current.offsetHeight)
            setWidth(documentRef.current.offsetWidth)
            // console.log('documentRef.current.parentElement', documentRef.current.parentElement)
            // console.log('File Uploaded', files[0])
            let isMounted = true
            formData.append('file', files[0])
            if (!auth.isAuthenticated) {
                formData.append('UserCode', `e93315b73c4f4713bf50167e8f2ae528`)
            } else {
                formData.append('UserCode', UuidTool.toString(user?.code.data).replace(/-/g, ''))
            }

            const fetchData = async () => {
                await PDF.post('storage/upload', formData)
                    .then((res) => {
                        if (res?.isSuccess) {
                            if (isMounted) {
                                console.log('PDF res', res.payload)
                                const fileData = res.payload
                                setFileName(fileData.filename)
                                if (setUpdateFileName !== undefined) setUpdateFileName(fileData.filename)
                                // globalThis.sessionStorage.removeItem('set-file-cache')
                                globalThis.sessionStorage.setItem('set-file-cache', fileData.filename)
                            }
                        }
                    })
                    .catch((error) => console.log(error))
            }
            fetchData().catch(console.error)
            return () => {
                isMounted = false
            }
        }
    }, [files])

    // useEffect(() => {}, [deviceUp_lg])

    const [fileScaleForDeviceSize, setFileScaleForDeviceSize] = useState(1)
    useEffect(() => {
        // console.log('---------------------------')
        if (deviceUp_xsl) {
            // console.log('deviceUp_xsl', deviceUp_xsl)
            setFileScaleForDeviceSize(1)
        } else if (deviceUp_lg) {
            // console.log('deviceUp_lg', deviceUp_lg)
            setFileScaleForDeviceSize(0.75)
        } else if (deviceUp_md) {
            // console.log('deviceUp_md', deviceUp_md)
            setFileScaleForDeviceSize(0.7)
        } else if (deviceUp_sm) {
            // console.log('deviceUp_sm', deviceUp_sm)
            setFileScaleForDeviceSize(1)
        } else if (deviceUp_xs) {
            // console.log('deviceUp_xs', deviceUp_xs)
            setFileScaleForDeviceSize(1)
        }
    }, [deviceUp_xsl, deviceUp_lg, deviceUp_md, deviceUp_sm, deviceUp_xs])

    return (
        files.length > 0 && (
            <>
                <Box
                    sx={{
                        backgroundColor: 'background.default',
                        py: 3,
                    }}
                >
                    <Container maxWidth="lg">
                        <Paper>
                            <Scrollbar>
                                <Box>
                                    <Grid
                                        container
                                        justifyContent="space-between"
                                        sx={{
                                            // minWidth: 800,
                                            p: 5,
                                        }}
                                    >
                                        <Grid item alignItems="center">
                                            <Logo />
                                            <Typography variant="h6">DRAG AND SURVEY</Typography>
                                        </Grid>
                                        <Grid item>
                                            {/* <Typography align="right" variant="h4">
                                                Original
                                            </Typography> */}
                                            <Typography align="right" variant="subtitle2">
                                                {/* {file.name} */}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            overflow: 'hidden',
                                            mt: 3,
                                        }}
                                        // onContextMenu={(e) => e.preventDefault()}
                                    >
                                        <Grid container justifyContent="space-between">
                                            <Grid
                                                item
                                                xs={12}
                                                md={4}
                                                xsl={6}
                                                sx={{
                                                    px: { xs: 0, sm: 3 },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        transform: `scale(${fileScaleForDeviceSize})`,
                                                        // minHeight: 700,
                                                        // maxeight: 750,
                                                        backgroundColor: 'background.default',
                                                        '& canvas': {
                                                            margin: '0 auto',
                                                            width: '100%',
                                                        },
                                                        py: { xs: 0, sm: 2 },
                                                    }}
                                                >
                                                    <Document
                                                        ref={documentRef}
                                                        sx={{
                                                            position: 'relative',
                                                            display: 'flex',
                                                            width: '100%',
                                                            height: 'auto',
                                                        }}
                                                        // file={file}
                                                        file={`https://api.koaiarchitecture.com/uploads/${fileName}`}
                                                        onLoadSuccess={onDocumentLoadSuccess}
                                                        onLoadError={console.error}
                                                    >
                                                        <Page width={deviceUp_sm ? 500 : 300} pageNumber={pageNumber} />
                                                    </Document>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={8} xsl={6}>
                                                {openPopup ? (
                                                    <Box
                                                        sx={{
                                                            transform: `scale(${fileScaleForDeviceSize})`,
                                                            backgroundColor: 'background.default',
                                                            py: { xs: 0, sm: 3 },
                                                            px: 2,
                                                            '&:hover': {
                                                                backgroundColor: '#EEE',
                                                                cursor: 'pointer',
                                                                opacity: 0.8,
                                                                transition: 'all 0.5s',
                                                            },
                                                        }}
                                                        onClick={openPopup}
                                                    >
                                                        <Container
                                                            maxWidth="xs"
                                                            sx={{
                                                                backgroundColor: '#fff',
                                                                py: 5,
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <PDFHashPreviewer pageNumber={pageNumber} fileNameTriger={fileName} />
                                                            {/* <PDFHashService
                                                                pageNumber={pageNumber}
                                                            /> */}
                                                        </Container>
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            transform: `scale(${fileScaleForDeviceSize})`,
                                                            backgroundColor: 'background.default',
                                                            py: { xs: 0, sm: 3 },
                                                            px: 2,
                                                        }}
                                                    >
                                                        <Container
                                                            maxWidth="xs"
                                                            sx={{
                                                                backgroundColor: '#fff',
                                                                py: 5,
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <PDFHashPreviewer pageNumber={pageNumber} fileNameTriger={fileName} />
                                                            {/* <PDFHashService
                                                                pageNumber={pageNumber}
                                                            /> */}
                                                        </Container>
                                                    </Box>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            m: 5,
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
                                </Box>
                            </Scrollbar>
                        </Paper>
                    </Container>
                </Box>
            </>
        )
    )
}

PDFViewr.propTypes = {
    files: PropTypes.array,
}
