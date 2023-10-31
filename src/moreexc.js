import { Dialog, DialogContent } from "@mui/material";
import SearchExc from './searchExchange';
import { useState } from "react";


const MoreExc = ({id, rank, name,trustscore,image,volume,year }) => {
  const [openexc, setOpenexc] = useState(false);
  const handleClickOpenexc =  () => {
    setOpenexc(true);
  };
  const handleclickClose = () => {
   
    setOpenexc(false);
  };
  
  
    
    return (
        <>
        <tr className="homepage-container" onClick={handleClickOpenexc}>
        <td style={{ textAlign: "left" }}>{rank}</td>
        <td className="homepage-content" style={{display:"flex",justifyContent:"left"}}>
        <img src={image} alt={`${name} logo`}  />
        <span className="homepage-name"><span style={{ color: "white",width:"10px" }}>{name}</span></span>
      </td>
        <td>{trustscore}</td>
        <td>{year}</td>
        <td>{volume}</td>
      </tr>
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
            color:"white",
            backgroundColor:"rgb(10,10,10)" 
        }
    }}>
      <DialogContent className='dialog'>
        <SearchExc
        Key={id}
        />
     </DialogContent>
    </Dialog>
        </>
      
    );
  };
  
export default MoreExc;
