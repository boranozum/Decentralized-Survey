import React from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavbarTop = ({connect, connected}) => {
    
  return (
    <Navbar
        collapseOnSelect
        expand='lg'
        bg='dark'
        variant='dark'
    >
        <Container fluid>
            <Navbar.Brand href='/'>Poll App</Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse>
                <Nav className='me-auto'>
                    <Nav.Item>
                        <Nav.Link href='/polls'>
                            Polls
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href='/create-poll'>
                            Create Poll
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {!connected ?
                    <Nav>
                        <Button onClick={connect}>Connect to Metamask</Button>
                    </Nav>
                    :
                    <p style={{color: 'white'}}>Connected to MetaMask.</p>                    
                }
            </Navbar.Collapse>
        </Container>

    </Navbar>
  )
}

export default NavbarTop;