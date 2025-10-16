import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
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
    InputAdornment,
} from '@mui/material'
import { useRouter } from 'next/router'

/* M Icon */
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import CloseIcon from '@mui/icons-material/Close'

/* Icons */
import { IconUploadFile } from '@public/votg/IconUploadFile'
import { IconUploadTyping } from '@public/votg/IconUploadTyping'

/*Drop Zone*/
import { FileDropzone } from '@components/base/drop-zone-contact'

const ShareTypePhone = (props) => {
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // Param Check
    const { code, type } = router.query

    const { selectDistribute, setSelectDistribute, phoneNumberArrayList, setPhoneNumberArrayList } = props

    /* Selected :: Using Phone Number  - Upload Type*/
    const [selectUploadType, setSelectUploadType] = useState(1)

    /*MMS & KAKAO 배포*/
    /*연락처 업로드 */
    //File Drop
    const [files, setFiles] = useState([])

    const handleDrop = (newFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles])
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading failed')
        reader.onload = function () {
            // console.log(reader.result)

            const newContactArray = reader.result.split(/\r\n|\n/)

            newContactArray.shift()

            newContactArray = newContactArray.filter(Boolean)
            newContactArray = newContactArray.map((v) => v.trim())
            if (selectDistribute === 0 || selectDistribute === 1) {
                for (var i = 0; i < newContactArray.length; i++) {
                    console.log(i, newContactArray[i])
                    if (!newContactArray[i].match(/^([0])?1([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/)) {
                        alert(`${i + 2}번째 연락처 정보가 올바르지 않습니다.\n파일을 확인해주세요`)
                        setFiles([])
                        return
                    }
                }
            }

            newContactArray = newContactArray.map((v) => {
                console.log('phone', typeof v, v)
                // console.log('phone', typeof v)

                if (v.charAt(0) !== 0) {
                    return `0${v}`
                } else {
                    return v
                }
            })
            setPhoneNumberArrayList(newContactArray)
            setFiles([])
            return
        }
        newFiles.forEach((file) => reader.readAsBinaryString(file))
    }

    const handleRemove = (file) => {
        setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path))
        setPhoneNumberArrayList([])
    }

    const handleRemoveAll = () => {
        setFiles([])
        setPhoneNumberArrayList([])
    }

    /* 번호 수동으로 추가 */
    const [inputPhoneNumber, setInputPhoneNumber] = useState('')
    const onChangePhoneNumber = (event) => {
        // console.log('onChangePhoneNumber', event.target.value)
        event.stopPropagation()
        setInputPhoneNumber(event.target.value)
    }

    const addPhoneNumberArrayList = (phoneNumber) => {
        if (phoneNumberArrayList.includes(phoneNumber)) {
            alert('이미 추가한 번호입니다.')
        } else {
            setPhoneNumberArrayList([...phoneNumberArrayList, phoneNumber])
            setInputPhoneNumber('')
        }
    }

    const removePhoneNumberArrayList = (phoneNumber, index) => {
        const reNewPhoneNumberArrayList = phoneNumberArrayList.filter((item, itemIndex) => itemIndex !== index)
        setPhoneNumberArrayList(reNewPhoneNumberArrayList)
    }

    const removePhoneNumberAll = () => {
        setPhoneNumberArrayList([])
    }

    return (
        <>
            <Card sx={{ mb: 1 }}>
                <CardContent>
                    <Grid container spacing={0}>
                        <Grid item xs={12} minHeight={40}>
                            <Grid container justifyContent="space-between" spacing={3}>
                                <Grid item>
                                    <Typography variant="h5"> 응답자 추가</Typography>

                                    <Typography sx={{ fontSize: '1rem', mx: 0, my: 2, fontWeight: '500', color: '#777' }}>전송방식 : {selectDistribute === 0 ? `문자 메시지 ` : `카카오톡 `}</Typography>
                                </Grid>
                                <Grid item>
                                    {selectUploadType === 0 && (
                                        <Button variant="outlined" component="a" href="/sample/viewsonthego_contact_sample.csv" target="_blank" download startIcon={<FileDownloadIcon />} color="secondary" size="small">
                                            양식 받기
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                            {/* <Divider sx={{ my: 3 }} /> */}
                        </Grid>
                        <Grid container spacing={2} sx={{ my: 2 }}>
                            <Grid item sm={2} xs={12}></Grid>
                            <Grid item sm={4} xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <IconButton
                                    sx={{
                                        minWidth: '150px',
                                        minHeight: '130px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        background: selectUploadType === 0 ? '#FF5353' : '#BBBBBB',
                                        border: '2px solid rgba(0,0,0,0)',
                                        ':hover': {
                                            background: selectUploadType === 0 ? '#FF5353' : '#BBBBBB',
                                            border: '2px solid #FF5353',
                                        },
                                    }}
                                    onClick={() => setSelectUploadType(0)}
                                >
                                    <Box sx={{ width: '100%', minWidth: { sm: '200px', xs: '100px' }, mb: 2 }}>
                                        <Typography sx={{ fontSize: '1.3rem', fontWeight: 500, color: '#fff' }}>파일 업로드</Typography>
                                    </Box>
                                    <Box>
                                        <IconUploadFile customColor="#fff" />
                                    </Box>
                                </IconButton>
                            </Grid>
                            <Grid item sm={4} xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <IconButton
                                    sx={{
                                        minWidth: '150px',
                                        minHeight: '130px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        background: selectUploadType === 1 ? '#FF5353' : '#BBBBBB',
                                        border: '2px solid rgba(0,0,0,0)',
                                        ':hover': {
                                            background: selectUploadType === 1 ? '#FF5353' : '#BBBBBB',
                                            border: '2px solid #FF5353',
                                        },
                                    }}
                                    onClick={() => setSelectUploadType(1)}
                                >
                                    <Box sx={{ width: '100%', minWidth: { sm: '200px', xs: '100px' }, mb: 2 }}>
                                        <Typography sx={{ fontSize: '1.3rem', fontWeight: 500, color: '#fff' }}>직접 입력</Typography>
                                    </Box>
                                    <Box sx={{ mb: 1 }}>
                                        <IconUploadTyping customColor="#fff" />
                                    </Box>
                                </IconButton>
                            </Grid>
                        </Grid>
                        {selectUploadType !== 0 ? (
                            <Grid item xs={12}>
                                <Divider sx={{ my: 3 }} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        px: {
                                            sm: 10,
                                            xs: 0,
                                        },
                                    }}
                                >
                                    <Box sx={{ flexGrow: 2, mr: 1 }}>
                                        <TextField
                                            // disabled={sendCode}
                                            ///^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/
                                            error={inputPhoneNumber.length > 0 && !inputPhoneNumber.match(/^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/)}
                                            helperText={inputPhoneNumber.length > 0 && !inputPhoneNumber.match(/^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/) && '휴대폰번호를 입력해주세요 (ex.01012345678)'}
                                            fullWidth
                                            label={'응답자 연락처'}
                                            margin="normal"
                                            name="phone"
                                            value={inputPhoneNumber}
                                            onChange={onChangePhoneNumber}
                                        />
                                    </Box>
                                    <Box>
                                        <Button disabled={!inputPhoneNumber.match(/^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/)} variant="contained" color="secondary" size="large" onClick={() => addPhoneNumberArrayList(inputPhoneNumber)}>
                                            추가
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <Divider sx={{ my: 3 }} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        px: {
                                            sm: 10,
                                            xs: 0,
                                        },
                                    }}
                                >
                                    {phoneNumberArrayList.length === 0 && (
                                        <Box sx={{ flexGrow: 2 }}>
                                            {/* <Typography sx={{ textAlign: 'center', fontSize: '1rem', fontWeight: 500, my: 3 }}>연락처 파일을 선택 해주세요</Typography> */}

                                            <FileDropzone
                                                accept={{
                                                    'application/vnd.ms-excel': [],
                                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                                                    'text/csv': [],
                                                }}
                                                files={files}
                                                onDrop={handleDrop}
                                                onRemove={handleRemove}
                                                onRemoveAll={handleRemoveAll}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        )}
                        {phoneNumberArrayList.length > 0 && (
                            <Grid item xs={12}>
                                {/* <Divider sx={{ my: 3 }} /> */}

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        px: {
                                            sm: 10,
                                            xs: 0,
                                        },
                                        py: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Button onClick={removePhoneNumberAll} size="medium" variant="outlined" fullWidth>
                                        전체 삭제
                                    </Button>
                                </Box>
                                {phoneNumberArrayList.map((phone, pIndex) => {
                                    return (
                                        <Box
                                            sx={{
                                                mb: 2,
                                                px: {
                                                    sm: 10,
                                                    xs: 0,
                                                },
                                            }}
                                            key={`contact-list-${pIndex}`}
                                        >
                                            <Grid
                                                container
                                                justifyContent="space-between"
                                                spacing={3}
                                                sx={{
                                                    px: {
                                                        sm: 5,
                                                        xs: 2,
                                                    },
                                                }}
                                            >
                                                <Grid item>
                                                    <Typography sx={{}}>{pIndex + 1}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography sx={{}}>{phone}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton color="inherit" onClick={() => removePhoneNumberArrayList(phone, pIndex)}>
                                                        <CloseIcon fontSize="small" color="secondary" />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                            <Divider sx={{ my: 2 }} />
                                        </Box>
                                    )
                                })}
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default ShareTypePhone
