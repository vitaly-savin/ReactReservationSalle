import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import styles from './Header.module.scss'

function Footer() {
    return (
        <Navbar
            fixed="bottom"
            className={styles.navbar}>
            <Container fluid className={''}>
                <span>&copy; {new Date().getFullYear()} Réservé par TGVD</span>
            </Container>
        </Navbar>
    );
}

export default Footer;