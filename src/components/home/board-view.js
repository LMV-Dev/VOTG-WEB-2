import { Fragment, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

import 'react-quill/dist/quill.snow.css'
import {
    Card,
    CardContent,
    CircularProgress,
    Button,
    FormGroup,
    FormControlLabel,
    TextareaAutosize,
    Avatar,
    TextField,
    Checkbox,
    Box,
    Container,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { formatInTimeZone } from 'date-fns-tz'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useAuth } from '@hooks/use-auth'
import { UuidTool } from 'uuid-tool'
import { toast } from 'react-toastify'
import API from '@utils/API'
import axios from 'axios'
import { wait } from '@utils/wait'

import { Scrollbar } from '@components/layout/scrollbar'
import { Logo } from '@components/layout/logo'

/* Survey Id Creater*/
import { createResourceCode, createResourceId } from '@utils/create-resource-id'

const Editor = dynamic(() => import('@components/base/editor'), { ssr: false })

/* Compoent :: Popup */

import PopupWarningWithCancel_DeletePost from '@components/popup/popup-warning-with-cancel'

const BoardView = (props) => {
    const { title, contents } = props
    const { user } = useAuth()
    const now = new Date()
    const theme = useTheme()
    const router = useRouter()
    const { type, code } = router.query
    const [isLoading, setIsLoading] = useState(false)

    // Delete Post
    const [openDialogWarning_DeletePost, setopenDialogWarning_DeletePost] = useState(false)
    const handleOpenWarning_DeletePost = () => {
        setopenDialogWarning_DeletePost(true)
    }
    const handleCloseWarning_DeletePost = async () => {
        setopenDialogWarning_DeletePost(false)
    }
    const handleDeletePostEvent = async () => {
        await handleDeletePost()
        await handleCloseWarning_DeletePost()
    }

    const handleDeletePost = async () => {
        try {
            let deleteUrl = 'board/notice/delete'
            let returnUrl = '/board/notice'
            if (type === '1') {
                deleteUrl = 'board/notice/delete'
                returnUrl = '/board/notice'
            } else if (type === '2') {
                deleteUrl = 'board/learn/delete'
                returnUrl = '/board/learn'
            } else if (type === '3') {
                deleteUrl = 'board/media/delete'
                returnUrl = '/board/media'
            }
            const res = await API.delete(deleteUrl, {
                UserCode: UuidTool.toString(user?.code.data).replace(/-/g, ''),
                BoardCode: code,
            })

            toast.success('삭제완료')
            await router.push(returnUrl).catch(console.error)
        } catch (error) {
            console.error(error)
            toast.error('Distribute Error: ' + error)
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                mt: 2,
                pb: 10,
            }}
        >
            <PopupWarningWithCancel_DeletePost
                sw={true}
                onClose={handleCloseWarning_DeletePost}
                open={openDialogWarning_DeletePost}
                event={handleDeletePostEvent}
                title={'게시글을 삭제하시겠습니까?'}
                description={'게시글을 삭제하면 데이터가 완전히 삭제되며, 복구할 수 없습니다.'}
                cancelName={'삭제하기'}
                confirmName={'취소'}
                color="error"
            />
            <Container maxWidth="md">
                {/* <Paper> */}
                <Scrollbar>
                    <Card sx={{ mt: 4 }}>
                        <CardContent>
                            <Typography variant="h6">{title}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ mt: 4, pb: 3, minHeight: '500px' }}>
                        <CardContent
                            sx={{
                                '& .ql-editor > iframe': { width: '100%', height: '56.25vw', maxHeight: 'calc(800px / 16 * 9)' },
                            }}
                        >
                            <div
                                className="ql-editor"
                                dangerouslySetInnerHTML={{
                                    __html: contents,
                                }}
                            />
                        </CardContent>
                        {/* <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Button onClick={handleSaveBoard} variant="contained" size="large" sx={{ width: '300px' }}>
                                작성완료
                            </Button>
                        </Box> */}
                    </Card>
                </Scrollbar>
                {/* </Paper> */}
                <Box sx={{ display: 'flex', alignItems: 'cneter', justifyContent: 'center', background: 'fff', mt: 2 }}>
                    {/* <Typography sx={{ p: 1, fontWeight: 700, color: 'secondary.main', fontSize: '1.1rem' }}>관리자 모드</Typography> */}
                    {/* <Box sx={{ mx: '10px' }} /> */}

                    <NextLink href={`/board/${type == 1 ? 'notice' : type == 2 ? 'learn' : type == 3 ? 'media' : 'notice'}`}>
                        <Button component="a" variant="outlined" color="disable">
                            목록으로
                        </Button>
                    </NextLink>
                    {user?.mode >= 2 && (
                        <>
                            <Box sx={{ mx: '10px' }} />
                            <NextLink href={`/board/update?type=${type}&code=${code}`}>
                                <Button component="a" variant="outlined" color="success">
                                    게시글 수정
                                </Button>
                            </NextLink>
                            <Box sx={{ mx: '10px' }} />
                            <Button onClick={handleOpenWarning_DeletePost} variant="outlined" color="error">
                                게시글 삭제
                            </Button>
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    )
}

export default BoardView
