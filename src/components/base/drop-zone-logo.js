import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import API from '@utils/API'
import { Box, Button, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { Duplicate as DuplicateIcon } from '@components/icons/duplicate'
import { X as XIcon } from '@components/icons/x'
import { bytesToSize } from '@utils/bytes-to-size'

import DefaultWarningPopover from '@components/popovers/popover-default-warning'

export const FileDropzoneLogo = (props) => {
    const {
        // Own props
        files = [],
        onRemove,
        onRemoveAll,
        onUpload,
        // DropzoneOptions props
        accept,
        disabled,
        getFilesFromEvent,
        maxSize,
        minSize,
        multiple,
        maxFiles,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop,
        onDropAccepted,
        onDropRejected,
        onFileDialogCancel,
        onFileDialogOpen,
        useFsAccessApi,
        autoFocus,
        preventDropOnDocument,
        noClick,
        noKeyboard,
        noDrag,
        noDragEventsBubbling,
        onError,
        validator,
        ...other
    } = props

    // We did not add the remaining props to avoid component complexity
    // but you can simply add it if you need to.
    const { getRootProps, getInputProps, isDragActive, open, acceptedFiles, fileRejections } = useDropzone({
        accept,
        maxFiles,
        maxSize,
        minSize,
        onDrop,
        noClick: true,
    })

    /*Warning Popup*/
    const [openDialogDefaultWarning, setOpenDialogDefaultWarning] = useState(false)
    const handleOpenDefaultWarning = () => {
        setOpenDialogDefaultWarning(true)
    }
    const handleCloseDefaultWarning = () => {
        setOpenDialogDefaultWarning(false)
    }

    useEffect(async () => {
        if (acceptedFiles.length !== 0) {
            // console.log('acceptedFiles - formData', acceptedFiles)
        }
    }, [acceptedFiles])
    useEffect(() => {
        if (fileRejections.length !== 0) {
            // console.log('fileRejections', fileRejections)
            handleOpenDefaultWarning()
        }
    }, [fileRejections])

    return (
        <div {...other}>
            <DefaultWarningPopover onClose={handleCloseDefaultWarning} open={openDialogDefaultWarning} title={'파일 사이즈를 확인해주세요.'} />

            {files.length == 0 && (
                <Box
                    sx={{
                        alignItems: 'center',
                        border: 1,
                        borderRadius: 1,
                        borderStyle: 'dashed',
                        borderColor: 'divider',
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        outline: 'none',
                        p: 1,
                        ...(isDragActive && {
                            backgroundColor: 'action.active',
                            opacity: 0.5,
                        }),
                        // '&:hover': {
                        //     backgroundColor: 'action.hover',
                        //     cursor: 'pointer',
                        //     opacity: 0.5,
                        // },
                    }}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <Box
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            p: 2,
                        }}
                    >
                        <Typography variant="button" fontSize={'0.8rem'}>
                            로고 파일을 선택해주세요. (jpg, png, gif 형식)
                        </Typography>
                    </Box>
                    <Button
                        onClick={open}
                        size="small"
                        sx={{
                            height: '20px',
                            // borderRadius: '20px 0px 20px 0px',
                            fontSize: '0.8rem',
                        }}
                        type="button"
                        variant="text"
                    >
                        파일선택
                    </Button>
                </Box>
            )}
            {files.length > 0 && (
                <Box sx={{ mt: 0 }}>
                    <List>
                        {files.map((file, index) => (
                            <ListItem
                                key={`${file.path}-${index}`}
                                sx={{
                                    // border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    '& + &': {
                                        mt: 1,
                                    },
                                }}
                            >
                                {/* <ListItemIcon>
                                    <DuplicateIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={file.name}
                                    primaryTypographyProps={{
                                        color: 'textPrimary',
                                        variant: 'subtitle2',
                                    }}
                                    secondary={bytesToSize(file.size)}
                                /> */}
                                <Tooltip title="삭제">
                                    <IconButton edge="end" onClick={() => onRemove?.(file)}>
                                        <XIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        ))}
                    </List>
                    {/* <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            mb: 3,
                        }}
                    >
                        <Button
                            onClick={onUpload}
                            size="large"
                            sx={{ ml: 2 }}
                            type="button"
                            variant="contained"
                        >
                            설문조사 계속 만들기
                        </Button>
                    </Box> */}
                </Box>
            )}
        </div>
    )
}

FileDropzoneLogo.propTypes = {
    files: PropTypes.array,
    onRemove: PropTypes.func,
    onRemoveAll: PropTypes.func,
    onUpload: PropTypes.func,
    accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    disabled: PropTypes.bool,
    getFilesFromEvent: PropTypes.func,
    maxFiles: PropTypes.number,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    noClick: PropTypes.bool,
    noDrag: PropTypes.bool,
    noDragEventsBubbling: PropTypes.bool,
    noKeyboard: PropTypes.bool,
    onDrop: PropTypes.func,
    onDropAccepted: PropTypes.func,
    onDropRejected: PropTypes.func,
    onFileDialogCancel: PropTypes.func,
    preventDropOnDocument: PropTypes.bool,
}
