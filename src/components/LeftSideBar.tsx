import styles from './LeftSideBar.module.scss'
import {Link} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import {useAutorisation} from "../hooks/authorisation";
function LeftSideBar() {
    const {isAdmin, isMember, logout} = useAutorisation()
    return (
        <Row className={styles.container + ' gx-0'}>
            <Col className={'d-flex flex-column align-items-start ps-5 ' + styles.wrapper}>
                {isAdmin() && <Link to="ActiviteList">Activités</Link>}
                {(isAdmin() || isMember()) && <Link to="OfficeList">Salles</Link>}
                {(isMember()) && <Link to='/UserModif'>Mon profil</Link>}
                {(isAdmin() || isMember()) && <Link to='ReservationList'>Réservations</Link>}
                {(isMember()) && <Link to='InvitationList'>Invitations</Link>}
                {(isAdmin() || isMember()) && <Link to='PlainteList'>Plaintes</Link>}
                {isAdmin() && <Link to='MembreList'>Membres</Link>}
                {(isAdmin() || isMember()) && <a onClick={()=>logout()}>Se déconnecter</a>}
            </Col>
        </Row>
    );
}

export default LeftSideBar;