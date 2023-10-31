import { Pagination, createTheme, ThemeProvider } from "@mui/material";
import { styled } from '@mui/system';
import { useState, useEffect } from 'react'; // Import the useEffect and useState hooks

const CustomPaginationnft = ({ setpagenft, initialPage = 0, numberofPages = 10 }) => {

  const [page, setPage] = useState(initialPage); // Create a new state variable to keep track of the current page

  useEffect(() => {
    setPage(initialPage); // Reset the page number when the initialPage prop changes
  }, [initialPage]);

  const handlePageChange = (page) => {
    setPage(page); // Update the page number in this component
    setpagenft(parseInt(page));
    window.scroll(0,0);
  };

  const darkTheme = createTheme({
    palette: {
      type: 'dark',
      secondary: {
        main: '#FFA500', // This will set the selected page color to orange
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
        backgroundColor: 'black', // Add this to make the background black
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <StyledPaginationItem
          page={page} // Set the current page number
          onChange={(e) => handlePageChange(parseInt(e.target.textContent))}
          count={numberofPages}
          hideNextButton
          hidePrevButton
        />
      </ThemeProvider>
    </div>
  );
};

export default CustomPaginationnft;
