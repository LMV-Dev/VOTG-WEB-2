import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { Box, Button, Chip, Divider, Drawer, Typography, Tooltip, useMediaQuery, IconButton, TextField, InputAdornment, ListItem } from '@mui/material'

/*MUI Icon*/
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import LabelImportantIcon from '@mui/icons-material/LabelImportant'

/*Custom Icon*/
import { IconSurvey } from '@public/votg/IconSurvey'
import { IconPayment } from '@public/votg/IconPayment'
import { IconMypage } from '@public/votg/IconMypage'
import { IconCreateDragDrop } from '@public/votg/IconCreateDragDrop'
import { IconCreateOnlineForm } from '@public/votg/IconCreateOnlineForm'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { elementType, elementFunction } from '@schema/element-schema'

/*Drag Align*/
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

/* Component */
import { Scrollbar } from '@components/layout/scrollbar'

const EditorSidebar = (props) => {
    const { sidebarToggleHandler, open, autoScrollController, sideItemInfo, sideItemList, setSideItemList, currentSelected, setCurrentSelected, targets } = props
    const router = useRouter()

    /* Width Check */
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
        noSsr: true,
    })

    /* Sidebar Auto Spread Control */
    useEffect(() => {
        if (!open) {
            sidebarToggleHandler()
        }
    }, [lgUp])

    /* Drag Cotroller */
    // Drag Reorder
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return result
    }
    // Drage End Action
    const onDragEnd = (result) => {
        console.log('onDragEnd - result', result)
        // dropped outside the list
        if (!result.destination) {
            return
        }
        if (result.destination.index === result.source.index) {
            return
        }

        const items = reorder(sideItemList, result.source.index, result.destination.index)

        // console.log('onDragEnd - items', items)
        setSideItemList([...items])
        setCurrentSelected(result.destination.index)
    }

    /* Search Result */
    const [searchText, setSearchText] = useState('')
    const onChangeSearchText = (event) => {
        let inputText = event.target.value //.replace(/(^\s*)|(\s*$)/g, '')

        setSearchText(inputText)
    }
    const [itemListFiltered, setItemListFiltered] = useState([])

    useEffect(() => {
        // console.log('sideItemList', sideItemList)
        let resultItemList = sideItemList.filter((item) => item.title.includes(searchText) || item.typeText.includes(searchText))
        setItemListFiltered(resultItemList)
    }, [searchText])

    /* View Sidebar*/
    const content = (
        <>
            <Scrollbar
                sx={{
                    marginTop: '150px',
                    height: 'calc(100% - 150px)',
                    '& .simplebar-content': {
                        height: '100%',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        p: 2,
                    }}
                >
                    <>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="검색"
                                inputProps={{
                                    style: { fontSize: '0.8rem' },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {searchText.length > 0 && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setSearchText('')}
                                                    sx={{
                                                        color: '#667eea',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <HighlightOffIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            <SearchIcon fontSize="small" sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                value={searchText}
                                onChange={onChangeSearchText}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(102, 126, 234, 0.2)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            borderColor: 'rgba(102, 126, 234, 0.3)',
                                        },
                                        '&.Mui-focused': {
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            '& fieldset': {
                                                borderColor: '#667eea',
                                                borderWidth: '2px',
                                            },
                                        },
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </>
                    <Divider
                        sx={{
                            borderColor: 'rgba(102, 126, 234, 0.2)',
                            my: 2,
                        }}
                    />
                    {searchText.length > 0 ? (
                        // Filtered Item List View
                        <Box sx={{ flexGrow: 1 }}>
                            {itemListFiltered.map((item, itemIndex) => {
                                return (
                                    <ListItem
                                        key={itemIndex}
                                        disableGutters
                                        sx={{
                                            display: 'flex',
                                            mb: 1,
                                            py: 0,
                                            pl: 0,
                                        }}
                                    >
                                        <Button
                                            component="a"
                                            sx={{
                                                borderRadius: '12px',
                                                background: itemIndex === currentSelected 
                                                    ? 'rgba(102, 126, 234, 0.1)'
                                                    : 'rgba(255, 255, 255, 0.7)',
                                                backdropFilter: 'blur(10px)',
                                                border: itemIndex === currentSelected 
                                                    ? '1px solid rgba(102, 126, 234, 0.3)'
                                                    : '1px solid rgba(255, 255, 255, 0.3)',
                                                color: itemIndex === currentSelected ? '#667eea' : 'rgba(0, 0, 0, 0.7)',
                                                fontWeight: itemIndex === currentSelected ? 700 : 500,
                                                justifyContent: 'flex-start',
                                                pr: 3,
                                                textAlign: 'left',
                                                textTransform: 'none',
                                                width: '100%',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'rgba(102, 126, 234, 0.05)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                                },
                                            }}
                                            onClick={() => autoScrollController(itemIndex)}
                                        >
                                            <Box sx={{ flexGrow: 1, fontSize: '0.7rem' }}>
                                                {sideItemList.indexOf(item) + 1}.{` `}
                                                {item.title.length > 0 ? `${item.title.substring(0, 7)}${item.title.length > 7 ? `...` : ''}` : `문항 제목을 입력해주세요`}
                                            </Box>
                                            {item.type !== null && item.type !== undefined && (
                                                <Box
                                                    sx={{
                                                        flexGrow: 0.5,
                                                        fontSize: '0.7rem',
                                                        alignItems: 'left',
                                                        color: 'text.secondary',
                                                        fontWeight: itemIndex === currentSelected ? 700 : 500,
                                                    }}
                                                >
                                                    {`· `} {item.typeText} {!item.duplicate ? `단일` : '중복'}
                                                </Box>
                                            )}
                                        </Button>
                                    </ListItem>
                                )
                            })}
                        </Box>
                    ) : (
                        // Dragable Default Item List View
                        <>
                            {/* Item Infomation Fiexed Value */}
                            <Button
                                component="a"
                                sx={{
                                    borderRadius: '12px',
                                    background: currentSelected === -1 
                                        ? 'rgba(102, 126, 234, 0.1)'
                                        : 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: currentSelected === -1 
                                        ? '1px solid rgba(102, 126, 234, 0.3)'
                                        : '1px solid rgba(255, 255, 255, 0.3)',
                                    color: sideItemInfo.title.length == 0 
                                        ? '#f44336' 
                                        : currentSelected === -1 
                                            ? '#667eea' 
                                            : 'rgba(0, 0, 0, 0.7)',
                                    fontWeight: currentSelected === -1 ? 700 : 500,
                                    justifyContent: 'flex-start',
                                    pr: 3,
                                    textAlign: 'left',
                                    textTransform: 'none',
                                    width: '100%',
                                    mb: 1,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'rgba(102, 126, 234, 0.05)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                    },
                                }}
                                onClick={() => autoScrollController(-1)}
                                startIcon={<HistoryEduIcon size={'small'} />}
                            >
                                <Box sx={{ flexGrow: 1, fontSize: currentSelected === -1 ? '0.9rem' : '0.8rem' }}>
                                    {sideItemInfo.title.length > 0 ? `${sideItemInfo.title.substring(0, 15)}${sideItemInfo.title.length > 15 ? `...` : ''}` : `설문지 정보를 입력해주세요`}
                                </Box>
                            </Button>
                            {/* Item Qeustion List */}
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="side-question-list">
                                    {(provided) => (
                                        <Box sx={{ flexGrow: 1 }} ref={provided.innerRef} {...provided.droppableProps}>
                                            {sideItemList.map((item, itemIndex) => {
                                                return (
                                                    <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                                                        {(_provided, snapshot) => (
                                                            <ListItem
                                                                disableGutters
                                                                sx={{
                                                                    display: 'flex',
                                                                    mb: 1,
                                                                    py: 0,
                                                                    pl: 0,
                                                                    ..._provided.draggableProps.style,
                                                                }}
                                                                ref={_provided.innerRef}
                                                                snapshot={snapshot}
                                                                {..._provided.draggableProps}
                                                                {..._provided.dragHandleProps}
                                                            >
                                                                <Button
                                                                    component="a"
                                                                    sx={{
                                                                        borderRadius: '12px',
                                                                        background: itemIndex === currentSelected 
                                                                            ? 'rgba(102, 126, 234, 0.1)'
                                                                            : 'rgba(255, 255, 255, 0.7)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        border: itemIndex === currentSelected 
                                                                            ? '1px solid rgba(102, 126, 234, 0.3)'
                                                                            : '1px solid rgba(255, 255, 255, 0.3)',
                                                                        color: item.title.length == 0 
                                                                            ? '#f44336' 
                                                                            : itemIndex === currentSelected 
                                                                                ? '#667eea' 
                                                                                : 'rgba(0, 0, 0, 0.7)',
                                                                        fontWeight: itemIndex === currentSelected ? 700 : 500,
                                                                        justifyContent: 'flex-start',
                                                                        pr: 2,
                                                                        textAlign: 'left',
                                                                        textTransform: 'none',
                                                                        width: '100%',
                                                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                                                        transition: 'all 0.3s ease',
                                                                        '&:hover': {
                                                                            background: 'rgba(102, 126, 234, 0.05)',
                                                                            transform: 'translateY(-1px)',
                                                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                                                        },
                                                                    }}
                                                                    onClick={() => autoScrollController(itemIndex)}
                                                                    endIcon={
                                                                        <Tooltip title="원하는 위치에 끌어다 놓으세요" placement="right">
                                                                            <DragIndicatorIcon 
                                                                                size={'small'} 
                                                                                sx={{ 
                                                                                    color: itemIndex === currentSelected ? '#667eea' : 'rgba(0, 0, 0, 0.3)',
                                                                                    fontSize: '1rem'
                                                                                }} 
                                                                            />
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                                        <Box sx={{ flexGrow: 1, fontSize: itemIndex === currentSelected ? '0.8rem' : '0.7rem' }}>
                                                                            {itemIndex + 1}.{` `}
                                                                            {item.title.length > 0 ? `${item.title.substring(0, 15)}${item.title.length > 15 ? `...` : ''}` : `제목을 입력해주세요`}
                                                                        </Box>
                                                                        {item.type !== null && item.type !== undefined && (
                                                                            <Box
                                                                                sx={{
                                                                                    flexGrow: 1,
                                                                                    fontSize: itemIndex === currentSelected ? '0.7rem' : '0.6rem',
                                                                                    alignItems: 'left',
                                                                                    mt: 0,
                                                                                    pl: 1,
                                                                                    color: 'text.secondary',
                                                                                    fontWeight: itemIndex === currentSelected ? 700 : 500,
                                                                                }}
                                                                            >
                                                                                {`┗ `} {item.required && `*필수응답`} · {item.typeText} · {!item.duplicate ? `단일` : '중복'}
                                                                            </Box>
                                                                        )}
                                                                    </Box>
                                                                </Button>
                                                            </ListItem>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </>
                    )}
                </Box>
            </Scrollbar>
        </>
    )

    /* Size Check & View */
    if (lgUp) {
        let returnDiv = open ? (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRight: '1px solid rgba(102, 126, 234, 0.2)',
                        color: '#000',
                        width: 280,
                        zIndex: 9,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        ) : (
            <></>
        )
        return returnDiv
    }

    return (
        <Drawer
            anchor="left"
            onClose={sidebarToggleHandler}
            open={open}
            PaperProps={{
                sx: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    color: '#000',
                    width: 280,
                    zIndex: 9,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                },
            }}
            variant="temporary"
        >
            {content}
        </Drawer>
    )
}

export default EditorSidebar