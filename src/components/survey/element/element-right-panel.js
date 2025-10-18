import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { Box, IconButton, Typography, Grid, Card } from '@mui/material'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { elementType, elementFunction } from '@schema/element-schema'

/*Transition*/
import { Transition, TransitionGroup, CSSTransition } from 'react-transition-group'

/*Transition Style*/
const duration = 300
const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}
const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
}

const Element_RightPanel = (props) => {
    const { questionItem, questionIndex, isEditing, currentSelected, onChangeEditThisItem_Type, onChangeEditThisItem_Func } = props
    return (
        <Transition unmountOnExit in={isEditing} timeout={duration}>
            {(state) => (
                <Grid
                    item
                    xs={4}
                    xmd={4}
                    md={3}
                    sx={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                        cursor: 'Default',
                    }}
                >
                    <Card onClick={(e) => e.stopPropagation()}>
                        <Grid
                            container
                            spacing={1}
                            sx={{
                                justifyContent: 'center',
                                px: 1,
                                py: 2,
                            }}
                        >
                            {/*Side Edit Menu : 1. Type */}
                            <Grid item xs={5} xmd={5} md={5}>
                                {elementType.map((typeItem, typeIndex) => {
                                    let activeCheck = false
                                    if (questionItem.type === typeIndex) {
                                        activeCheck = true
                                    }
                                    return (
                                        <Box
                                            key={`menu-left-type-${typeIndex}`}
                                            sx={{
                                                display: 'flex',
                                                flexFlow: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <IconButton disabled={activeCheck} onClick={() => onChangeEditThisItem_Type(currentSelected, typeItem)}>
                                                <Box
                                                    sx={{
                                                        minWidth: {
                                                            sm: 120,
                                                            xs: 40,
                                                        },
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: {
                                                                xs: 'inline',
                                                            },
                                                        }}
                                                    >
                                                        {!activeCheck ? typeItem.icon : typeItem.iconActive}
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            color: !activeCheck ? 'text.black' : 'primary.main',
                                                            display: {
                                                                md: 'inline',
                                                                xs: 'none',
                                                            },
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {typeItem.title}
                                                    </Typography>
                                                </Box>
                                            </IconButton>
                                        </Box>
                                    )
                                })}
                            </Grid>

                            {/* Side Edit Menu : 2. Fuction */}
                            <Grid item xs={5} xmd={5} md={5}>
                                {elementFunction.map((funcItem, funcIndex) => {
                                    // Disable Check
                                    let disable = false
                                    if (questionItem.type === null) {
                                        disable = true
                                    }
                                    /* 문항 타입에 따른 중복 => (fuction === 1) 활성화 */
                                    if (questionItem.type === 1 && funcIndex === 1) {
                                        disable = true
                                    }
                                    if (questionItem.type === 3 && funcIndex === 1) {
                                        disable = true
                                    }
                                    if (questionItem.type === 4 && funcIndex === 1) {
                                        disable = true
                                    }
                                    /* 문항 타입에 따른 로직 => (fuction === 2) 활성화 */
                                    if (questionItem.type === 0 && questionItem.duplicate && funcIndex === 2) {
                                        disable = true
                                    }

                                    // Active Check
                                    let activeCheck = false
                                    // 1. & 2. Duplicate
                                    if (questionItem.duplicate === false && funcIndex === 0) {
                                        activeCheck = true
                                    } else if (questionItem.duplicate === true && funcIndex === 1) {
                                        activeCheck = true
                                    }
                                    // 3. Logic
                                    if (questionItem.logicActive === true && funcIndex === 2) {
                                        activeCheck = true
                                    }
                                    // 4. Required
                                    if (questionItem.required === true && funcIndex === 3) {
                                        activeCheck = true
                                    }

                                    return (
                                        <Box
                                            key={`menu-right-func-${funcIndex}`}
                                            sx={{
                                                display: 'flex',
                                                flexFlow: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <IconButton disabled={disable} onClick={() => onChangeEditThisItem_Func(currentSelected, funcItem, questionItem)}>
                                                <Box
                                                    sx={{
                                                        minWidth: {
                                                            sm: 120,
                                                            xs: 40,
                                                        },
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        opacity: disable ? '0.3' : '1',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: {
                                                                xs: 'inline',
                                                            },
                                                        }}
                                                    >
                                                        {!activeCheck ? funcItem.icon : funcItem.iconActive}
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            color: !activeCheck ? 'text.black' : 'primary.main',
                                                            display: {
                                                                md: 'inline',
                                                                xs: 'none',
                                                            },
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {funcItem.title}
                                                    </Typography>
                                                </Box>
                                            </IconButton>
                                        </Box>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            )}
        </Transition>
    )
}

export default Element_RightPanel
