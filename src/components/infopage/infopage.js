import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Card, Button} from "react-bootstrap";
import './infopage.css';

class InfoPage extends Component {

  constructor(props) {
    super(props);
    this.state = {}

  }

  render() {

    return(

      <Container fluid className="info-container">
          
        <div className="infotext text-center">
          <h1>Project description</h1>
            <p>Descriptive text of project</p>
          <h2>(Insert video iframe if we do a video)</h2>
          <h2>Learning objectives reached</h2>
            <p>Answer here...</p>
          <h2>Tools used</h2>
            <p><b>D3</b> - JavaScript library to visualize data</p>
            <p><b>React</b> - Front-end framework (JavaScript)</p>
            <p><b>Firebase</b> - Page hosting</p>
            <p><b>GitHub</b> - Version control</p>
            <p><b>FB Messenger</b> - Communication tool</p>
        </div>

        <div className="profiles">
          <h1 className="text-center">The team</h1>
          <Row className="justify-content-center">
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src="https://sarangglobaltours.com/wp-content/uploads/2014/02/team.png" />
              <Card.Body>
                <Card.Title><b>Pierrick Gervasi</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Card.Link href="#">Mail</Card.Link>
                <Card.Link href="#">GitHub</Card.Link>
                <Card.Link href="#">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src={require("../../photos/pg.jpg")} />
              <Card.Body>
                <Card.Title><b>Paul Gorgis</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted"> Front-end, Data management, Repository management</Card.Subtitle>
                <Card.Text>
                  Responsible for setting up the project and website in React.js framework, adapting the visualizations in the React environment,
                  and making the interactions between them possible. Processed the given spreadsheet data into an appropriate data structure
                  for the application to use. Also maintained the GitHub repository and publishing of the website.
                </Card.Text>
                <Card.Link href="mailto:pagorgis@gmail.com">Mail</Card.Link>
                <Card.Link href="https://github.com/pagorgis">GitHub</Card.Link>
                <Card.Link href="https://www.linkedin.com/in/paul-gorgis/">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src="https://sarangglobaltours.com/wp-content/uploads/2014/02/team.png" />
              <Card.Body>
                <Card.Title><b>Cecilia Xia</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Card.Link href="#">Mail</Card.Link>
                <Card.Link href="#">GitHub</Card.Link>
                <Card.Link href="#">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
          </Row>

          <Row className="justify-content-center">
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src="https://sarangglobaltours.com/wp-content/uploads/2014/02/team.png" />
              <Card.Body>
                <Card.Title><b>Leo Bergqvist</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Card.Link href="#">Mail</Card.Link>
                <Card.Link href="#">GitHub</Card.Link>
                <Card.Link href="#">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src="https://sarangglobaltours.com/wp-content/uploads/2014/02/team.png" />
              <Card.Body>
                <Card.Title><b>Dianne Vasseur</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Card.Link href="#">Mail</Card.Link>
                <Card.Link href="#">GitHub</Card.Link>
                <Card.Link href="#">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src="https://sarangglobaltours.com/wp-content/uploads/2014/02/team.png" />
              <Card.Body>
                <Card.Title><b>Yutong Xu</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Card.Link href="#">Mail</Card.Link>
                <Card.Link href="#">GitHub</Card.Link>
                <Card.Link href="#">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
          </Row>
        </div>
        
      </Container>

    );

  }

}

export default InfoPage;