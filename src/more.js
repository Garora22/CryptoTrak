import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Tab } from '@mui/material';
import MoreCoins from './morecoins';
import MoreNft from './morenfts';
import CustomPagination from './pagination';
import CustomPaginationnft from './paginationnft';
import MoreExc from './moreexc';
function More() {
  const [type, setType] = useState("Coins");
  const [nfts, setNfts] = useState([]);
  const [coins, setCoins] = useState([]);
  const [Exc, setExc] = useState([]);
  const [numItems, setNumItems] = useState(100); // Default number of items
  const [page, setpage] = useState(0);
  const [pagenft, setpagenft] = useState(0);

  let currency = 'USD';
  let currencysymb='$';

  const handleTabChange = (event, newValue) => {
    setType(newValue);
  };

  const fetchCoins = async () => {
    const response = await axios.get(`https://api.coinstats.app/public/v1/coins?skip=0&limit=${numItems}&currency=${currency}`);
    setCoins(response.data.coins);
    console.log(response.data);
  };

  const fetchExchanges = async()=>{
    const respons = await axios.get(`https://api.coingecko.com/api/v3/exchanges?per_page=100&page=${page}`);
    setExc(respons.data);
    console.log(respons.data);
}

  const fetchNfts = async () => {
    try {
      const { data: nftList } = await axios.get(`https://api.coingecko.com/api/v3/nfts/list?per_page=10&page=${pagenft}`);
      const nftDetailsPromises = nftList.map(async (nft) => {
        const { data: nftDetails } = await axios.get(`https://api.coingecko.com/api/v3/nfts/${nft.id}`);
        return nftDetails;
      });
  
      const nftDetails = await Promise.all(nftDetailsPromises);
      setNfts(nftDetails);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNfts([]);
    }
  };
  

  useEffect(() => {
    fetchCoins();
    fetchNfts();
    fetchExchanges();
     // eslint-disable-next-line
  }, [currency, numItems, page, pagenft]);


  const handleNumItemsChange = (event) => {
    const value = event.target.value;
    if (value > 2000) {
      setNumItems(2000);
    } else if (value < 1) {
      setNumItems(1);
    } else {
      setNumItems(value);
    }
  };

  return (
    <>
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
           
          <Tabs
            style={{ marginBottom: "1.5%" }}
            value={type}
            className='tab'
            indicatorColor="orange"
            textColor="white"
            onChange={handleTabChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Coins" value="Coins" style={{ color: type === 'Coins' ? 'orange' : 'white' }} />
            <Tab label="Exchange" value="Exchange" style={{color: type === 'Exchange' ? 'orange' : 'white' }}/>
            <Tab label="NFTs" value="NFTs" style={{ color: type === 'NFTs' ? 'orange' : 'white' }} />
          </Tabs>
        </div>

        {type === "Coins" && (
        <div>
          <label for="numItems">Number of {type}: </label>
          <input type="number" id="numItems" name="numItems" value={numItems} onChange={handleNumItemsChange} />
          <table>
            <thead>
              <tr style={{ fontFamily: "Montserrat" }}>
                <th style={{ textAlign: "left" }}>Rank</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th>Price(Btc)</th>
                <th>Volume</th>
                <th>Change (24h)</th>
                <th>Graph (7d)</th>
              </tr>
            </thead>
            <tbody>
            {coins.map((coin, index) => (
                <MoreCoins
                  Key={coin.id}
                  rank={coin.rank}
                  name={coin.name}
                  price={coin.price}
                  Symbol={coin.symbol}
                  icon={coin.icon}
                  volume={coin.volume}
                  pricebtc={coin.priceBtc}
                  currencysymb={currencysymb}
                  pricechange={coin.priceChange1d}
                  />
              ))}
            </tbody>
          </table>
        </div>
      )}

        {type === "NFTs" && (
            <div>
          <table>
            <thead>
              <tr style={{ fontFamily: "Montserrat" }}>
                <th>S.No.</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th>Floor Price</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {nfts.map((nft, index) => (
                <MoreNft
                  id={nft.id}
                  key={index}
                  rank={100*(pagenft)+index + 1}
                  name={nft.name}
                  symbol={nft.symbol}
                  image={nft.image}
                  floorPrice={nft.floor_price}
                  marketCap={nft.market_cap}
                  volume24h={nft.volume_24h}
                />
              ))}
            </tbody>
          </table>
          <CustomPaginationnft initialPage={0} setpagenft={setpagenft} />
          </div>
        )}
      </div>

      {type === "Exchange" && (
  <div>
    <table>
      <thead>
        <tr style={{ fontFamily: "Montserrat" }}>
          <th>S.No.</th>
          <th style={{ textAlign: "left" }}>Name</th>
          <th>Trust_Score</th>
          <th>Year of Established</th>
          <th>Volume (24h)</th>
        </tr>
      </thead>
      <tbody>
        {Exc.map((exchange, index) => (
          <MoreExc
          id={exchange.id}
          trustscore={exchange.trust_score}
          rank={(page)*100+index+1}
          image={exchange.image}
          trustscorerank={exchange.trust_score_rank}
          volume={exchange.trade_volume_24h_btc}
          name={exchange.name}
          year={exchange.year_established}
          />
        ))}
      </tbody>
    </table>
    <CustomPagination setpage={setpage} />
  </div>
)}

    </>
  );
}

export default More;
