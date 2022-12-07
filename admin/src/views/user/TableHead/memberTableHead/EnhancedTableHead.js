import React from 'react';
import { visuallyHidden } from '@mui/utils';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const headCells = [
        {
            id: 'fullName',
            numeric: false,
            disablePadding: true,
            label: 'Full Name',
            headerKey: 'fullName'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
            headerKey: 'email'
        },
        {
            id: 'Role',
            numeric: false,
            disablePadding: false,
            label: 'Role',
            headerKey: 'Role'
        },
        {
            id: 'license',
            numeric: false,
            disablePadding: false,
            label: 'License',
            headerKey: 'license'
        },
        {
            id: 'department',
            numeric: false,
            disablePadding: false,
            label: 'Department',
            headerKey: 'department'
        },
        {
            id: 'mobile',
            numeric: false,
            disablePadding: false,
            label: 'Mobile',
            headerKey: 'mobile'
        },
        {
            id: 'createdAt',
            numeric: false,
            disablePadding: false,
            label: 'Created',
            headerKey: 'createdAt'
        },
        {
            id: 'active',
            numeric: false,
            disablePadding: false,
            label: 'Status',
            headerKey: 'active'
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: false,
            label: 'Action',
            headerKey: 'action'
        },
    ];

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        style={{ fontWeight: 'bold', paddingLeft: '25px', whiteSpace: 'nowrap' }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.headerKey}
                            direction={orderBy === headCell.headerKey ? order : 'asc'}
                            onClick={createSortHandler(headCell.headerKey)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id
                                ? (<Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>)
                                : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};