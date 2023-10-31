import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Tab } from '@mui/material';
import Homecoins from './homecoins';
import HomeNft from './homenft';
import { Link } from 'react-router-dom';

function Homepage({type, currency, currencysymb, setType }) {
  const [coins, setCoins] = useState([]);
  const [nfts, setNfts] = useState([]);

  const handleTabChange = (event, newValue) => {
    setType(newValue);
  };


  const fetchCoins = async () => {
    const response = await axios.get(`https://api.coinstats.app/public/v1/coins?skip=0&limit=5&currency=${currency}`);
    setCoins(response.data.coins);
  };

  const fetchNfts = async () => {
    try {
      const { data: nftList } = await axios.get(`https://api.coingecko.com/api/v3/nfts/list?per_page=5&page=1`);

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
    // eslint-disable-next-line
  }, [currency]);

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
            <Tab label="NFTs" value="NFTs" style={{ color: type === 'NFTs' ? 'orange' : 'white' }} />
          </Tabs>
        </div>

        {type === "Coins" && (
          <table>
            <thead>
              <tr style={{ fontFamily: "Montserrat" }}>
                <th style={{ textAlign: "left" }}>Rank</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th>Change (24h)</th>
                <th>Graph (7d)</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <Homecoins
                  Key={coin.id}
                  rank={coin.rank}
                  name={coin.name}
                  price={coin.price}
                  Symbol={coin.symbol}
                  icon={coin.icon}
                  pricechange={coin.priceChange1d}
                  currencysymb={currencysymb}
                />
              ))}
            </tbody>
          </table>
        )}

        {type === "NFTs" && (
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
                <HomeNft
                  key={index}
                  id={nft.id}
                  rank={index + 1}
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
        )}
      </div>
      <div style={{ textAlign: 'center' , marginTop:"2.5%"}}>
      <Link  onClick={() => setType("NFTs")}to={{ pathname: "/more"}} className="see-more-btn" style={{color:"whitesmoke"}}>See More</Link>    </div>
    </>
  );
}

export default Homepage;
