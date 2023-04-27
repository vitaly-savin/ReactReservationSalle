import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import Header from "./components/Header";
import Footer from "./components/Footer";
import LeftSideBar from "./components/LeftSideBar";
import Container from "react-bootstrap/Container";
import styles from './main.module.scss'
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
      <BrowserRouter>
          <Header />
          <LeftSideBar />
          <Container fluid className={styles.container + ' gx-5 pt-3 pb-3'}>
            <App />
          </Container>
          <Footer />
      </BrowserRouter>
  </>,
)
