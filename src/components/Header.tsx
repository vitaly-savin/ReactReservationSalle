import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {Button} from "react-bootstrap";
import styles from './Header.module.scss'
import {Link, useNavigate} from "react-router-dom";
import {useAutorisation} from "../hooks/authorisation";

function Header() {
    const {isAdmin, isMember, logout, userName} = useAutorisation()
    const navigate = useNavigate();
    return (
        <Navbar
            fixed="top"
            className={styles.navbar}>
            <Container fluid>
                <Link className={'logo ' + styles.logo} to="/">
                    <Navbar.Brand className={styles.brand}>
                        <img
                            alt="Logo Reservation de salle"
                            src="/src/assets/logo192.png"
                            width="60"
                            height="60"
                            className="d-inline-block align-top"/>
                        Reservation de salle
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className={styles.buttons + ' justify-content-between  gap-2 align-items-center'}>
                        {(isAdmin() || isMember()) && <div className={styles.name}>Bonjour, {userName()} {isAdmin() && "(admin)"}</div>}
                        {isMember() && <Button onClick={() => navigate('/UserModif')} variant="dark">Mon profil</Button>}
                        {(isAdmin() || isMember()) && <Button onClick={() => logout()} variant="dark">Sortir</Button>}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;