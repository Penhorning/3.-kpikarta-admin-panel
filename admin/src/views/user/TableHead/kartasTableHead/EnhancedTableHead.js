import React from 'react';
import { visuallyHidden } from '@mui/utils';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    const headCells = [
        {
          id: 'name',
          numeric: false,
          disablePadding: true,
          label: 'Karta Name',
          headerKey: 'name'
        },
        {
          id: 'type',
          numeric: false,
          disablePadding: false,
          label: 'Type',
          headerKey: 'type'
        },
       
        {
          id: 'createdAt',
          numeric: false,
          disablePadding: false,
          label: 'Created',
          headerKey: 'createdAt'
        },
        {
          id: 'sharedTo',
          numeric: false,
          disablePadding: false,
          label: 'Share',
          headerKey: 'sharedTo'
        },
        {
          id: 'action',
          numeric: false,
          disablePadding: false,
          label: 'Action',
          headerKey: ''
        }

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
