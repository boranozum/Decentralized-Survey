import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { useState, useEffect } from 'react';
import {connect, getContract} from './services/contract';
import CreatePoll from './pages/PollCreatePage';
import Polls from './pages/PollsPage';

function App() {

  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    
    window.ethereum.request({method: "eth_accounts"})
      .then((accounts) => {
        if(accounts.length > 0){
          handleConnect();
        }
        // else{
        //   setConnected(true);
        //   // getContract().then((contract) => {
        //   //   setContract(contract);
        //   // })
        // }
      })
  }, []);

  
  const handleConnect = async () => {
    const {contract} = await connect();
    setContract(contract);

    if (contract) {
      setConnected(true);
    }
  }

  return (
    <Router>
      <Navbar 
        connect={handleConnect} 
        connected={connected} 
      />
      <div className='container'>
        <Routes>
            <Route path='create-poll' element={<CreatePoll contract={contract}/>}/>
            <Route path='polls' element={<Polls contract={contract}/>}/>
            <Route path="/" element={<Navigate replace to="/polls" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
