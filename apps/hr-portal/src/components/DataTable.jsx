import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const STICKY_COLUMN_WIDTH = 150;

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#f5f5f5',
  },
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  '& td': {
    paddingTop: 10,
    paddingBottom: 10,
  }
}));


const StyledCheckboxCell = styled(TableCell)(() => ({
 
}));

export default function DataTable({
  columns,
  rows,
  selected = [],
  setSelected,
  setSelectedCaller,
  selectedCaller=[],
  setSelectedCandidateCheck,
  selectedCandidateCheck=[],
  checkboxSetting = {visible:true, sticky:false},
}) {

  const handleCheckboxClick = (event, id,mobile,name) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let newSelectedMobile = [];
    let newSelectedCandidate = [];
  
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
      newSelectedMobile = [...selectedCaller, mobile];
      newSelectedCandidate = [...selectedCandidateCheck, name];


    } else {
      newSelected = selected.filter((item) => item !== id);
      newSelectedMobile = selectedCaller.filter((item) => item !== mobile);
      newSelectedCandidate  = selectedCandidateCheck.filter((item) => item !== name);

    }
  
    setSelected(newSelected);
    setSelectedCaller(newSelectedMobile);
    setSelectedCandidateCheck(newSelectedCandidate);
  };
  
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id); 
      const newSelectedMobile = rows.map((row) => row.mobile); 
      const newSelectedCandidate =  rows.map((row) => row.name); 
      setSelected(newSelected);
      setSelectedCaller(newSelectedMobile);
      setSelectedCandidateCheck(newSelectedCandidate);
    } else {
      setSelected([]);
      setSelectedCaller([]);
      setSelectedCandidateCheck([]);
    }
  };
  
  const visibleColumns = columns
  .filter(col => col.visible !== false)
  .sort((a, b) => {
    if (a.sticky && !b.sticky) return -1;
    if (!a.sticky && b.sticky) return 1;
    return 0;
  });

  const getStickyLeft = (columnIndex) => {
    let offset = checkboxSetting?.visible ? 50 : 0;
    for (let i = 0; i < columnIndex; i++) {
      const col = visibleColumns[i];
      if (col.sticky) {
        offset += col.width || STICKY_COLUMN_WIDTH;
      }
    }
    return offset;
  };
  


  return (
    <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{height:32,
            '& th': {
              paddingTop: '10px',
              paddingBottom: '10px',
            }}}>
            {checkboxSetting?.visible && (
             <TableCell
             sx={{
               width: 50,
               maxWidth: 50,
               minWidth: 50,
               ...(checkboxSetting?.sticky  && {
                position: 'sticky',
              }),
               top: 0, 
               left: checkboxSetting?.sticky ? 0 : 'auto', 
               zIndex: 1300, 
               backgroundColor: "#1976d2", 
               color: "#fff",
               overflow: 'hidden',
             }}
           >
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                />

              </TableCell>
            )}
          {visibleColumns.map((col, index) => {
  const isSticky = !!col.sticky;
  return (
    <TableCell
      key={col.field}
      align={col.align || 'left'}
      sx={{
        minWidth: col.width || STICKY_COLUMN_WIDTH,
        maxWidth: col.width || STICKY_COLUMN_WIDTH,
        width: col.width || STICKY_COLUMN_WIDTH,
        backgroundColor: "#1976d2",
        color: "#fff",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        borderRight: '1px solid #ffffff',
        fontWeight: 'bold',
        padding: '6px 12px',
        ...(isSticky && {
          position: 'sticky',
          left: getStickyLeft(index),
          zIndex: 1100,
        }),
      }}
    >
      {col.headerName}
    </TableCell>
  );
})}


          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const isItemSelected = selected.includes(row.id);
            return ( 
            <StyledTableRow key={row.id} selected={isItemSelected} sx={{ height: 32 }}>
                 {checkboxSetting?.visible &&  (
                  <TableCell sx={{ 
                    width: 50,
                    maxWidth: 50,
                    minWidth: 50,
                    position: checkboxSetting?.sticky ? 'sticky' : 'static',
                    top: checkboxSetting?.sticky ? 0 : 'auto', 
                    left: checkboxSetting?.sticky ? 0 : 'auto', 
                    background: 'white',
                    zIndex: 999,
                    }}>
                   <Checkbox
                      color="primary"
                      checked={selected.includes(row.id)}
                      onClick={(event) => handleCheckboxClick(event, row.id,row.mobile,row.name)}
                    />

                  </TableCell>
                )}
             {visibleColumns.map((col, index) => {
                const isSticky = !!col.sticky;
                return (
                  <TableCell
                    key={col.field}
                    align={col.align || 'left'}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: col.width || STICKY_COLUMN_WIDTH,
                      maxWidth: col.width || STICKY_COLUMN_WIDTH,
                      width: col.width || STICKY_COLUMN_WIDTH,
                      ...(isSticky && {
                        position: 'sticky',
                        left: getStickyLeft(index),
                        background: 'white',
                        zIndex: 999,
                      }),
                    }}
                  >
                    {col.renderCell
                      ? col.renderCell({ row, value: row[col.field] })
                      : row[col.field] ?? 'N/A'}
                  </TableCell>
                );
              })}
              </StyledTableRow>
                        );
                      })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
