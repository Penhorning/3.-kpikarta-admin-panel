import React, { useState, useEffect } from "react";
import { UserService } from "../../shared/_services";
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

const Countcard = () => {
    const [count, setCount] = useState('.');
    const { enqueueSnackbar } = useSnackbar();
    function getUserCount() {
        UserService.getUserCount(enqueueSnackbar).then(response => {
            if (!response.error) {
                setCount(response.count);
            } else if (response.error.statusCode === 400) {
                let variant = 'error';
                enqueueSnackbar("Something went worng", { variant });
            }
        })
    }

    useEffect(() => {
        getUserCount();
    }, [])

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 1,
                            width: 256,
                            height: 128,
                        },
                    }}
                >
                     <Paper>
                        <div className="d-flex flex-row" style={{ marginTop: '28px', marginLeft: '40px' }}>
                            <div className="round round-lg align-self-center round-warning">
                                <i className="mdi mdi-account-multiple" />
                            </div>
                            <div className="ml-2 align-self-center">
                                <h3 className="mb-0 font-lgiht">{count == '.' ? 0 : count}</h3>
                                <h5 className="text-muted mb-0">Total Users</h5>
                            </div>
                        </div>
                    </Paper>
                </Box>
            </CardContent>
        </Card>
    );
}

export default Countcard;
