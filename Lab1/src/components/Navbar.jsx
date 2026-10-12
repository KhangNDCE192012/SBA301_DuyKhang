import {Navbar, Container, Nav} from "react-bootstrap"


function AppNavbar(){

    return(
        <Navbar bg="dark" data-bs-theme="dark">

            <Container>

                <Navbar.Brand>
                    Orchid Gallery
                </Navbar.Brand>


                <Nav>
                    <Nav.Link>
                        Home
                    </Nav.Link>

                    <Nav.Link>
                        Orchids
                    </Nav.Link>

                </Nav>


            </Container>


        </Navbar>
    )

}


export default AppNavbar;