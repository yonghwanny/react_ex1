import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faWallet, faPlus} from "@fortawesome/free-solid-svg-icons";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
	return (
		<nav
			style={{
				backgroundColor: "black",
				height: 45,
				boxShadow: "0px 6px 7px 5px rgba(0,0,0,0.5)",
			}}
			className="navbar fixed-bottom navbar-light"
			role="navigation"
		>
      <Nav className="w-100" align="center">
      <div className=" d-flex flex-row justify-content-around w-100">
          <Link to="/" style={{fontSize: 20}}><FontAwesomeIcon color="white" size="lg" icon={faHome} />Home</Link>

					<Link to="/ticket" style={{fontSize: 20}}><FontAwesomeIcon color="white" size="lg" icon={faPlus} />Ticket</Link>

					<Link to="/goods" style={{fontSize: 20}}><FontAwesomeIcon color="white" size="lg" icon={faPlus} />Goods</Link>
          
					<Link to="/wallet" style={{fontSize: 20}}><FontAwesomeIcon color="white" size="lg" icon={faWallet} />Wallet</Link>
      </div>
      </Nav>
		</nav>
	);
};