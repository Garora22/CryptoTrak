import { Pagination, createTheme, ThemeProvider } from "@mui/material";
import { styled } from '@mui/system';
import { useEffect, useState } from "react";

const CustomPagination = ({ setpage, initialPage = 0, numberofPages = 7 }) => {

    const [page, setPage] = useState(initialPage); 

    useEffect(() => {
        setPage(initialPage); 
    }, [initialPage]);

    const handlePageChange = (page) => {
        setPage(page); 
        setpage(page);
        window.scroll(0,0);
    };

    const darkTheme = createTheme({
        palette: {
          type: 'dark',
          secondary: {
            main: '#FFA500',
          },
        },
    });

    const StyledPaginationItem = styled(Pagination)(({ theme }) => ({
        '& .MuiPaginationItem-page.Mui-selected': {
          backgroundColor: theme.palette.secondary.main,
        },
        '& .MuiPaginationItem-page': {
          color: '#FFFFFF',
        },
    }));

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                backgroundColor: 'black', 
            }}
        >
        <ThemeProvider theme={darkTheme}>
        <StyledPaginationItem
          page={page}
          onChange={(e) => handlePageChange(parseInt(e.target.textContent))}
          count={numberofPages}
          hideNextButton
          hidePrevButton
        />
        </ThemeProvider>
        </div>
    );
};

export default CustomPagination;
