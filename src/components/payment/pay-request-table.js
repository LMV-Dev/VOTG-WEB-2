import { Avatar, Chip, Button, Box, Card, Checkbox, Divider, IconButton, InputAdornment, Link, Tab, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tabs, TextField, Typography } from '@mui/material'
import { Scrollbar } from '@components/layout/scrollbar'

import { formatInTimeZone } from 'date-fns-tz'

export const PayRequestTable = ({ data }) => {
    // const tableData = data
    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                mt: 3,
                p: 0,
            }}
        >
            <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 100 }}>결제상태</TableCell>
                            <TableCell sx={{ width: '50%' }}>주문명</TableCell>
                            <TableCell sx={{ width: 100 }}>결제시간</TableCell>
                            <TableCell align="right" sx={{ width: 100 }}>
                                결제금액
                            </TableCell>
                            <TableCell align="right" sx={{ pr: 2, width: 100 }}>
                                {/* 상세내역 */}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((v, index) => {
                            if (v.status === '0') {
                                return null
                            }
                            return (
                                <TableRow hover key={`pay-request-list-${index}`}>
                                    <TableCell>
                                        <Chip
                                            //'0:취소(회색), 1:승인(파랑), 2:실패(노랑), 3:오류(빨강)',
                                            label={v.status === '0' ? '결제취소' : v.status === '1' ? '결제완료' : v.status === '2' ? '결제실패' : '오류'}
                                            variant="outlined"
                                            color={v.status === '0' ? 'disable' : v.status === '1' ? 'info' : v.status === '2' ? 'warning' : 'error'}
                                            size="small"
                                            sx={{
                                                marginInline: 1,
                                                paddingInline: 0.5,
                                                height: '1.6rem',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{v.orderName}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, mb: 0 }}>{formatInTimeZone(v.updatedAt, 'Asia/Seoul', 'yyyy.MM.dd')}</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>{formatInTimeZone(v.updatedAt, 'Asia/Seoul', 'hh:mm a')}</Typography>
                                    </TableCell>
                                    <TableCell align="right">{v.amount}원</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>

            <TablePagination
                component="div"
                count={data?.length}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                page={0}
                rowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage=""
                labelDisplayedRows={({ from, to, count }) => `${from}-${to}`}
            />
        </Box>
    )
}
