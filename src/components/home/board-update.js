import { Fragment, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

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

const BoardUpdate = (props) => {
    const { existData } = props
    const { user } = useAuth()
    const now = new Date()
    const theme = useTheme()
    const router = useRouter()
    const { type, code } = router.query
    const [isLoading, setIsLoading] = useState(false)

    const [title, setTitle] = useState('')
    const onChangeTitle = (e) => {
        setTitle(e.target.value.toString())
    }

    // Editor Setting
    const [htmlStr, setHtmlStr] = useState('')

    // useEffect(() => {
    //     console.log('setHtmlStr', htmlStr)
    // }, [htmlStr])

    useEffect(() => {
        if (existData !== null && existData !== undefined) {
            setTitle(existData.title)
            setHtmlStr(existData.contents)
        }
    }, [existData])

    const handleUpdateBoard = async () => {
        try {
            let postUrl = 'board/notice/update'
            let returnUrl = `/board/view?type=${type}&code=${code}`
            if (type === '1') {
                postUrl = 'board/notice/update'
                returnUrl = `/board/view?type=${type}&code=${code}`
            } else if (type === '2') {
                postUrl = 'board/learn/update'
                returnUrl = `/board/view?type=${type}&code=${code}`
            } else if (type === '3') {
                postUrl = 'board/media/update'
                returnUrl = `/board/view?type=${type}&code=${code}`
            }

            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            const boardCode = code

            const res = await API.post(postUrl, {
                UserCode: uuidString,
                BoardCode: boardCode,
                title: title,
                contents: htmlStr.toString(),
            })
            // console.log(res)
            toast.success('수정완료')
            await router.push(returnUrl).catch(console.error)
            // await router.push(returnUrl).catch(console.error)
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
            {...props}
        >
            <Container maxWidth="md">
                {/* <Paper> */}
                {/* <Scrollbar sx={{ overflow: 'visible' }}> */}
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6">게시글 제목</Typography>
                        <Box sx={{ mt: 3 }}>
                            <TextField fullWidth label="제목을 입력해주세요." name="title" onChange={onChangeTitle} value={title} />
                        </Box>
                    </CardContent>
                </Card>
                <Card sx={{ mt: 4, pb: 3, overflow: 'visible' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            내용
                        </Typography>
                        <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
                    </CardContent>
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Button onClick={handleUpdateBoard} variant="contained" size="large" sx={{ width: '300px' }}>
                            수정 완료
                        </Button>
                    </Box>
                </Card>
                {/* </Scrollbar> */}
                {/* </Paper> */}
            </Container>
        </Box>
    )
}

export default BoardUpdate
