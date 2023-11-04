import React from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavbarTop = ({connect, connected, becomeMember, isMember}) => {
  return (
    <Navbar
        collapseOnSelect
        expand='lg'
        bg='dark'
        variant='dark'
    >
        <Container fluid>
            <Navbar.Brand href='/'>Survey App</Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse>
                <Nav className='me-auto'>
                    <Nav.Link href='/votes'>
                        Votes
                    </Nav.Link>
                    <Nav.Link href='/create-survey'>
                        Create Survey
                    </Nav.Link>
                    {!isMember && <Button variant='success' onClick={becomeMember}>Become Member</Button>}
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