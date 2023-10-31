import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Dialog, DialogContent } from '@mui/material';
import SearchNft from './searchNft';
import { useState } from 'react';

const HomeNft = ({ rank,id, name, symbol, image, floorPrice, marketCap, volume24h }) => {
    let color;
    let arrow;
    const [opennft, setOpennft] = useState(false);

    const handleclickClose = () => {
      setOpennft(false);
     
    };
    const handleClickOpen =  () => {
      setOpennft(true);
    };
    
    if (marketCap && marketCap.usd > 0) {
      color = "rgb(60, 203, 65)";
      arrow = <ArrowDropUpIcon style={{ verticalAlign: "middle" }} />;
    } else if (marketCap && marketCap.usd < 0) {
      color = "red";
      arrow = <ArrowDropDownIcon style={{ verticalAlign: "middle" }} />;
    } else {
      color = "grey";
    }
  
    return (
      <>
      <tr className="homepage-container" onClick={handleClickOpen}>
        <td style={{ textAlign: "left" }}>{rank}</td>
        <td className="homepage-content">
          <img src={image.small} alt={name} style={{ marginRight: '10px' }} />
          <span className="homepage-name">
            <span style={{ color: "white" }}>{name}</span>{" "}
            <span style={{ fontFamily: "Montserrat", fontSize: "12px" }}>({symbol})</span>
          </span>
        </td>
        <td className="homepage-price">$ {floorPrice && parseFloat(floorPrice.usd).toFixed(2)}</td>
        <td className="homepage-marketcap" style={{ color: color, textAlign: "right" }}>
          {arrow} $ {marketCap && parseFloat(marketCap.usd).toFixed(2)}
        </td>
        <td className="homepage-volume">$ {volume24h && parseFloat(volume24h.usd).toFixed(2)}</td>
      </tr>
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
               color:"white",
               backgroundColor:"rgb(10,10,10)" 
           }
       }}>
         <DialogContent  className='dialog'>
           <SearchNft
           Key={id}
           />
        </DialogContent>
       </Dialog>
       </>
    );
   
  };
  
export default HomeNft;
