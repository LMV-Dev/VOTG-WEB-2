import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import { Box, Tooltip, Typography, TextField, Divider } from '@mui/material'
import imageCompression from 'browser-image-compression'
import { FileDropzoneLogo } from '@components/base/drop-zone-logo'
import API from '@utils/API'
import { wait } from '@utils/wait'
import { UuidTool } from 'uuid-tool'
import { useAuth } from '@hooks/use-auth'

const Element_StaticInfo = (props) => {
    const auth = useAuth()
    const { user } = useAuth()
    const { mode, isFocusing, isEditing, mainItemInfo, onChangeEditThisItem_Info, onChangeEditThisItem_LogoImage } = props
    const [writeToggle, setWriteToggle] = useState(false)

    //File Drop
    const [files, setFiles] = useState([])
    const [imageUpload, setImageUpload] = useState(null)
    const [uploadPreviewPath, setUploadPreviewPath] = useState(null)

    const handleDrop = async (newFiles) => {
        // console.log('handleDrop', newFiles[0])
        let file = newFiles[0]
        const options = {
            maxSizeMB: 1, // 이미지 최대 용량
            maxWidthOrHeight: 300, // 최대 넓이(혹은 높이)
            useWebWorker: true,
        }

        try {
            const compressedFile = await imageCompression(file, options)
            setImageUpload(compressedFile)
            const promise = imageCompression.getDataUrlFromFile(compressedFile)
            // promise.then((result) => {
            //     setUploadPreview(result)
            // })
            // setFiles((prevFiles) => [...prevFiles, ...newFiles])
        } catch (error) {
            console.log(error)
        }
    }

    const handleRemove = (file) => {
        setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path))
        setImageUpload(null)
        setUploadPreviewPath(null)
        onChangeEditThisItem_LogoImage('')
    }

    const handleRemoveAll = () => {
        setFiles([])
        setImageUpload(null)
        setUploadPreviewPath(null)
        onChangeEditThisItem_LogoImage('')
    }

    useEffect(() => {
        if (imageUpload !== null) {
            let isMounted = true
            const formData = new FormData()
            formData.append('file', imageUpload)
            if (!auth.isAuthenticated) {
                formData.append('UserCode', `e93315b73c4f4713bf50167e8f2ae528`)
            } else {
                formData.append('UserCode', UuidTool.toString(user?.code.data).replace(/-/g, ''))
            }

            const fetchData = async () => {
                await API.post('online/upload/logo', formData)
                    .then((res) => {
                        if (res?.isSuccess) {
                            if (isMounted) {
                                // console.log('Logo Image path', res.payload.filePath)
                                const fileData = res.payload
                                setUploadPreviewPath(res.payload.filePath)
                                onChangeEditThisItem_LogoImage(res.payload.filePath)
                                // setFileName(fileData.filename)
                                // if (setUpdateFileName !== undefined) setUpdateFileName(fileData.filename)
                                // // globalThis.sessionStorage.removeItem('set-file-cache')
                                // globalThis.sessionStorage.setItem('set-file-cache', fileData.filename)
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
    }, [imageUpload])

    useEffect(() => {
        // console.log('mainItemInfo.logoImage', mainItemInfo.logoImage)
        if (mainItemInfo.logoImage?.length > 0) {
            setUploadPreviewPath(mainItemInfo.logoImage)
            setFiles((prevFiles) => [...prevFiles, mainItemInfo.logoImage])
        } else {
            setUploadPreviewPath('')
            setFiles([])
        }
    }, [mainItemInfo.logoImage?.length])

    useEffect(() => {
        if (mode == undefined || mode == 'read') {
            setWriteToggle(false)
        } else if (mode == 'write') {
            setWriteToggle(true)
        }

        if (isEditing !== true) {
            isEditing = false
        }
        if (isFocusing !== true) {
            isFocusing = false
        }
    }, [])

    return (
        <>
            {isEditing ? (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'top',
                        }}
                    >
                        {files?.length > 0 && (
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    minHeight: '30px',
                                    maxHeight: '50px',
                                }}
                            >
                                <Image src={`https://api.koaiarchitecture.com/${uploadPreviewPath}`} priority={true} layout="fill" objectFit="contain" objectPosition="left" />
                            </div>
                        )}
                        <FileDropzoneLogo accept={{ 'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.svg'] }} files={files} onDrop={handleDrop} onRemove={handleRemove} onRemoveAll={handleRemoveAll} />
                    </Box>
                    <Divider sx={{ mt: 3, visibility: 'hidden' }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'top',
                        }}
                    >
                        <Tooltip open={mainItemInfo.title?.length === 0} arrow title="설문지 제목 입력해주세요" placement="right" sx={{ my: 0 }}>
                            <TextField
                                focused={mainItemInfo.title?.length === 0}
                                multiline={true}
                                variant="standard"
                                // error={
                                //     mainItemInfo.title?.length < 5 ||
                                //     mainItemInfo.title?.length > 51
                                // }
                                size={'small'}
                                label=""
                                margin="normal"
                                name={'title'}
                                onChange={(e) => onChangeEditThisItem_Info(e)}
                                placeholder="설문지 제목을 입력해주세요"
                                type="text"
                                value={mainItemInfo.title}
                                sx={{
                                    // minWidth: '250px',
                                    // width: 'calc(100% - 50px)',
                                    width: '100%',
                                    maxWidth: '100%',
                                    fontSize: '1.3rem',
                                    fontWeight: '700',
                                    // mt: 2.4,
                                    ml: 1,
                                    mt: 0,
                                    mb: 0,
                                }}
                                inputProps={{
                                    style: {
                                        fontSize: '1.3rem',
                                        fontWeight: '700',
                                        lineHeight: '1.5',
                                    },
                                }}
                            />
                        </Tooltip>
                    </Box>
                    {/* </Tooltip> */}
                    <Divider sx={{ mt: 1.3, visibility: 'hidden' }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'top',
                        }}
                    >
                        <Tooltip open={mainItemInfo.description?.length === 0} arrow title="설문지 안내사항을 입력해주세요" placement="right" sx={{ my: 0 }}>
                            <TextField
                                // focused={false}
                                multiline={true}
                                variant="outlined"
                                // error={
                                //     mainItemInfo.title?.length < 5 ||
                                //     mainItemInfo.title?.length > 51
                                // }
                                color="secondary"
                                minRows={4}
                                size={'small'}
                                label=""
                                margin="normal"
                                name={'description'}
                                onChange={(e) => onChangeEditThisItem_Info(e)}
                                placeholder="설문지에 대한 안내사항을 입력해 주세요."
                                type="text"
                                value={mainItemInfo.description}
                                sx={{
                                    // minWidth: '250px',
                                    // width: 'calc(100% - 50px)',
                                    width: '100%',
                                    maxWidth: '100%',
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                    lineHeight: '1.8',
                                    // mt: 2.4,
                                    ml: 0,
                                    mt: 0,
                                    mb: 0,
                                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#F3F4F6',
                                    },
                                    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#F3F4F6',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid #9CA3AF',
                                    },
                                }}
                                inputProps={{
                                    style: {
                                        fontSize: '0.8rem',
                                        fontWeight: '400',
                                        lineHeight: '1.8',
                                    },
                                }}
                            />
                        </Tooltip>
                    </Box>
                </>
            ) : (
                <Box sx={{ pt: 0, pb: 1 }}>
                    {mainItemInfo.logoImage?.length > 0 && (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'top',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        minHeight: '50px',
                                        maxHeight: '70px',
                                    }}
                                >
                                    <Image src={`https://api.koaiarchitecture.com/${uploadPreviewPath}`} priority={true} layout="fill" objectFit="contain" objectPosition="left" />
                                </div>
                            </Box>
                            <Divider sx={{ mt: 3, visibility: 'hidden' }} />
                        </>
                    )}

                    {mainItemInfo.title?.length > 0 ? (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'top',
                                }}
                            >
                                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, whiteSpace: 'pre-wrap', ml: 1 }}>{`${mainItemInfo.title}`}</Typography>
                            </Box>
                        </>
                    ) : (
                        <>
                            {writeToggle ? (
                                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: 'error.light' }}>설문지 제목이 입력되지 않았습니다.</Typography>
                            ) : (
                                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: 'text.secondary' }}>설문지 제목을 입력해주세요</Typography>
                            )}
                        </>
                    )}
                    <Divider sx={{ mt: 1 }} />
                    {mainItemInfo.description?.length > 0 ? (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'top',
                                    mt: 2,
                                    ml: 1,
                                }}
                            >
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 400, lineHeight: '1.8', whiteSpace: 'pre-wrap', ml: 0.5 }}>{`${mainItemInfo.description}`}</Typography>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: '40px',
                                }}
                            >
                                {writeToggle ? (
                                    <Typography sx={{ fontSize: '1rem', fontWeight: '700', textAlign: 'center', color: 'error.main' }}>{/*WriteMode :  Preview  */} 설문지에 대한 안내사항이 입력되지 않았습니다.</Typography>
                                ) : (
                                    <Typography sx={{ fontSize: '1rem', fontWeight: '700', textAlign: 'center', color: 'secondary.main' }}> {/*EditMode   */} 설문지에 대한 안내사항을 입력해 주세요.</Typography>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            )}
        </>
    )
}

export default Element_StaticInfo
