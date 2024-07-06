import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './home';
import More from './more';
import { TextField, InputAdornment, IconButton, Select, MenuItem, createTheme, ThemeProvider, Popper, Paper, ClickAwayListener, MenuList } from '@mui/material';
import './App.css';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { CloseSharp, SearchSharp } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

import { Dialog, DialogContent } from '@mui/material';
import CoinDialog from './coindialog';
import SearchNft from './searchNft';
import SearchExc from './searchExchange';

function App() {
  const [coinKey, setCoinKey] = useState(null);
  const [opencoin, setOpencoin] = useState(false);
  const [opennft, setOpennft] = useState(false);
  const [openexc, setOpenexc] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState([]);
  const [currencysymb, setCurrencysymb] = useState("$");
  const [type, setType] = useState("Coins");
  const [searchTren, setSearchTren] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchcoin, setSearchCoin] = useState([]);
  const [searchexchange, setSearchExc] = useState([]);
  const [searchnft, setSearchNft] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpencoin = () => {
    setOpencoin(true);
  };

  const handleClickOpenexc = () => {
    setOpenexc(true);
  };

  const handleClickOpennft = () => {
    setOpennft(true);
  };

  const handleclickClose = () => {
    setOpencoin(false);
    setOpennft(false);
    setOpenexc(false);
    setCoinKey("");
  };

  const handleCurrencyChange = (event) => {
    if (type === "Coins") {
      const newCurrency = event.target.value;
      setCurrency(newCurrency);
      const matchingCurrencyObject = currencies.find((c) => c.name === newCurrency);
      if (matchingCurrencyObject) {
        setCurrencysymb(matchingCurrencyObject.symbol);
      }
    }
  };

  const fetchsearch = async (searchText) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${searchText}`);
      setSearchCoin(response.data.coins);
      setSearchExc(response.data.exchanges);
      setSearchNft(response.data.nfts);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const fetchCurr = async () => {
    try {
      const { data } = await axios.get(`https://api.coinstats.app/public/v1/fiats`);
      setCurrencies(data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const fetchTren = async () => {
    try {
      const Trend = await axios.get(`https://api.coingecko.com/api/v3/search/trending`);
      setSearchTren(Trend.data.coins);
      console.log(Trend.data.coins);
    } catch (error) {
      console.error("Error fetching trending:", error);
    }
  };

  const fetchData = async () => {
    await fetchCurr();
    await fetchTren();
    if (searchText !== "") {
      await fetchsearch(searchText);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [searchText]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="header">
          <div>
            CryptoTrack
            <TrendingUpIcon
              sx={{ color: "white" }}
            />
          </div>
          <div className='Search'>
            <TextField
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={handleClick}
              InputProps={{
                style: {
                  justifyContent: "space-around",
                  color: "black",
                  fontSize: "1vw",
                  margin: 5,
                  opacity: 100,
                  borderRadius: 10,
                  maxHeight: '3vw',
                  backgroundColor: "rgb(200, 200, 194)"
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={() => setSearchText('')}
                    >
                      {searchText === '' ? <SearchSharp /> : <CloseSharp />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
              <Paper>
                {searchText === "" &&
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="menu-list-grow" style={{ backgroundColor: "rgb(10,10,10)", color: "whitesmoke" }}>
                      Trending<TrendingUpIcon style={{ color: "red" }} />
                      {searchText === "" && searchTren.map((Trendi) => (
                        <MenuItem onClick={() => { handleClickOpencoin(); setCoinKey(Trendi.item.id); }} onChange={handleClose} style={{ color: "white" }}><img src={Trendi.item.thumb} alt={Trendi.id} />{Trendi.item.name}</MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                }
                <div style={{ display: "flex" }}>
                  {searchText !== "" && searchcoin.length > 0 &&
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="menu-list-grow" className="custom-scrollbar"
                        style={{
                          backgroundColor: "rgb(10,10,10)",
                          color: "whitesmoke",
                          fontFamily: "cursive",
                          maxHeight: '200px', // or any value that suits your design
                          overflow: 'auto'
                        }}>
                        Coin
                        {searchcoin.map((coin) => (
                          <MenuItem length={5} onClick={() => { handleClickOpencoin(); setCoinKey(coin.id); }} onChange={handleClose} style={{ color: "white" }} Key={coin.id}>{coin.name}</MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  }
                  {searchText !== "" && searchexchange.length > 0 &&
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="menu-list-grow" className="custom-scrollbar"
                        style={{
                          backgroundColor: "rgb(10,10,10)",
                          color: "whitesmoke",
                          fontFamily: "cursive",
                          maxHeight: '200px', // or any value that suits your design
                          overflow: 'auto',
                        }}>        Exchange
                        {searchexchange.map((EXC) => (
                          <MenuItem onClick={() => { handleClickOpenexc(); setCoinKey(EXC.id); }} onChange={handleClose} style={{ color: "white" }}>{EXC.name}</MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  }
                  {searchText !== "" && searchnft.length > 0 &&
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="menu-list-grow" className="custom-scrollbar"
                        style={{
                          backgroundColor: "rgb(10,10,10)",
                          color: "whitesmoke",
                          fontFamily: "cursive",
                          maxHeight: '200px', // or any value that suits your design
                          overflow: 'auto'
                        }}>          NFTs
                        {searchnft.map((NFT) => (
                          <MenuItem onClick={() => { handleClickOpennft(); setCoinKey(NFT.id); }} onChange={handleClose} style={{ color: "white" }}>{NFT.name}</MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  }
                </div>
              </Paper>
            </Popper>
            <Select
              value={currency}
              onChange={handleCurrencyChange}
              style={{
                color: "white",
                height: "5vh",
                marginRight: "1vw",
                pointerEvents: type === "NFTs" ? "none" : "auto",
                opacity: type === "NFTs" ? 0.6 : 1,
              }}
              IconComponent={props => (
                <ArrowDropDownIcon {...props} style={{ color: 'white' }} />
              )}
            >
              {currencies && currencies.map((c, index) => (
                <MenuItem
                  key={c.name}
                  symbol={c.symbol}
                  value={c.name}
                  style={currency === c.name ? { color: 'rgb(234, 206, 153)' } : {}}
                >
                  <span style={{ color: 'orange', paddingRight: '10px' }}>{c.symbol}</span> {c.name.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="App">
          <Router>
            <Routes>
              <Route
                path="/"
                element={<HomePage type={type} currency={currency} currencysymb={currencysymb} setType={setType} currencies={currencies} />}
              />
              <Route path="/more" element={<More />} />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>

      <Dialog
        open={opencoin}
        onClose={handleclickClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        maxWidth="lg" // Increase the max width
        fullWidth={true} // Make it full width
        sx={{
          '.MuiDialog-paper': {
            width: '50%',
            color: "white",
            backgroundColor: "rgb(10,10,10)"
          }
        }}>
        <DialogContent className='dialog'>
          <CoinDialog
            Key={coinKey}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={opennft}
        onClose={handleclickClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        maxWidth="lg" // Increase the max width
        fullWidth={true} // Make it full width
        sx={{
          '.MuiDialog-paper': {
            width: '50%',
            color: "white",
            backgroundColor: "rgb(10,10,10)"
          }
        }}>
        <DialogContent className='dialog'>
          <SearchNft
            Key={coinKey}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openexc}
        onClose={handleclickClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        maxWidth="lg" // Increase the max width
        fullWidth={true} // Make it full width
        sx={{
          '.MuiDialog-paper': {
            width: '50%',
            color: "white",
            backgroundColor: "rgb(10,10,10)"
          }
        }}>
        <DialogContent className='dialog'>
          <SearchExc
            Key={coinKey}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
