import React, { useEffect, useState } from 'react';
import './homecoins.css';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import axios from 'axios';
import { LineChart, Line, YAxis } from 'recharts';
import { Dialog, DialogContent } from '@mui/material';
import CoinDialog from './coindialog';


const MoreCoins = ({ name, price, pricechange, Symbol, icon, rank,volume,pricebtc, currencysymb, Key }) => {

  const [graphdata, setGraphData] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchgraph = async () => {
    try {
      const response = await axios.get(`https://api.coinstats.app/public/v1/charts?period=1w&coinId=${Key}`);
      const chartData = formatData(response.data);
      setGraphData(chartData);
    } catch (err) {
      console.error(err);
    }
  };
  
  const formatData = (data) => {
    
    return data.chart.map((c) => ({
      date: new Date(c[0] * 1000).toLocaleString(),
      value: c[1],
    }));
  };

  useEffect(() => {
    fetchgraph();
    // eslint-disable-next-line
  }, [Key]);

  let color;
  let arrow;
   if (pricechange > 0) {
    color = "rgb(60, 203, 65)";
    arrow = <ArrowDropUp style={{ verticalAlign: "middle" }} />;
  } else if (pricechange < 0) {
    color = "red";
    arrow = <ArrowDropDown style={{ verticalAlign: "middle" }} />;
  } else {
    color = "grey";
  }

  const handleClickOpen =  () => {
    setOpen(true);
};


const handleClose = () => {
    setOpen(false);
};

  return (
    <>
     <tr className="homepage-container" onClick={handleClickOpen}>
      <td className="homepage-rank">{rank}</td>
      <td className="homepage-content">
        <img src={icon} alt={`${name} logo`} style={{ marginRight: '10px'}} />
        <span className="homepage-name"><span style={{ color: "white" }}>{name}</span> <span style={{ fontFamily: "Montserrat", fontSize: "12px" }}>({Symbol})</span></span>
      </td>
      <td className="homepage-price"><span style={{ marginRight: "4px" }}>{currencysymb}</span>{parseFloat(price).toFixed(2)}</td>
      <td style={{color:"white"}}>{pricebtc}</td>
      <td style={{color:"white"}}>{currencysymb}{parseFloat(volume).toFixed(2)}</td>
      <td className="homepage-pricechange" style={{ color }}>{arrow} {pricechange}%</td>
      <td className="homepage-chart">
        <LineChart width={200} height={47} data={graphdata}>
        <YAxis 
  domain={['auto', 'auto']} hide={true}
/>
          <Line type="monotone" dataKey="value" stroke={color} dot={false} />
        </LineChart>
        
      </td>
    </tr>

    <Dialog


    open={open}
    onClose={handleClose}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    maxWidth="lg" // Increase the max width
    fullWidth={true} // Make it full width
    sx={{
        '.MuiDialog-paper': {
            width: '50%',
            color:"white",
            backgroundColor:"rgb(10,10,10)" 
        }
    }}>
      <DialogContent className='dialog'>
        <CoinDialog
        Key={Key}
        />
     </DialogContent>
    </Dialog>
    </>
  );
}

export default MoreCoins;
