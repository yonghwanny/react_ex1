import { HashRouter as Router, Route, Routes} from "react-router-dom";
import KlipWallet from '../routes/KlipWallet';
import Market from "../routes/Market";
import Mint from "../routes/Mint";
import Header from "./Header";
import NavBar from "./NavBar";

import { Styles } from "../styles/styles"

const AppRouter = () => {
  return (
    <Router>
      <Styles />
      <Header />
      <Routes>
        <Route exact={true} path="/" element={<Market/>} />
        <Route exact={true} path="/wallet" element={<KlipWallet/>} />
        <Route exact={true} path="/mint" element={<Mint/>} />
      </Routes>
      <NavBar />
    </Router>
  );
};

export default AppRouter;