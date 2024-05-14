import { HashRouter as Router, Route, Routes} from "react-router-dom";
import KlipWallet from '../routes/KlipWallet';
import KlipWalletDetail from '../routes/KlipWalletDetail';
import Market from "../routes/Market";
import Ticket from "../routes/Ticket";
import Goods from "../routes/Goods";
import Header from "./Header";
import NavBar from "./NavBar";

import { Styles } from "../styles/styles"

const AppRouter = () => {
  return (
    <Router>
      <Styles />
      <Header />
      <Routes>
        <Route path="/" element={<Market/>} />
        <Route path="/wallet" element={<KlipWallet/>} />
        <Route path="/wallet/:tid" element={<KlipWalletDetail/>} />
        <Route path="/ticket" element={<Ticket/>} />
        <Route path="/goods" element={<Goods/>} />
      </Routes>
      <NavBar />
    </Router>
  );
};

export default AppRouter;