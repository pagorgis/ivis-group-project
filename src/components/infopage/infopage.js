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
          
        <div className="infotext">
          <h1>Background</h1>
          
          <div className="video-container">
            <iframe className="video" src="https://player.vimeo.com/video/398055870" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
          </div>

            <p>When working with this project we designed and implemented visual mappings and structures based on the insights in the course Information Visualization
               at KTH to end up with the website you’re using right now. It’s primarily created as a tool for the director of studies Jarmo Laaksolahti and other teachers 
               at KTH to give overview of the courses and teachers.</p>
            <p>The project was proposed by director of studies Jarmo Laaksolahti at KTH to aid his work situation. His work as director involved using simple spreadsheets 
              to make decisions on how to assign teacher hours and budgeting for courses. This failed to provide quick overview of important data as well as being error prone 
              and difficult to communicate to other teachers, therefore we created this tool which provides all the data in a way that gives overview more effectively. It 
              allows for prof. Laaksolahti to get an overview of projects/teachers, rapidly find the teacher and courses which needs his attention, explain numbers to teachers 
              easily and for teachers to see their contribution to courses.
            </p>
            <p><b>Goals</b></p>
            <ul>
              <li>Create a tool that will be used by KTH staff</li>
              <li>Give it an intuitive design that’s easily used</li>
            </ul>
            <p><b>Challenges</b></p>
            <ul>
              <li>Handling large amounts of data variables and presenting them in a limited space</li>
              <li>Making the design simple for all involved parties</li>
              <li>Using unfamiliar web frameworks</li>
            </ul>
          <h2>Visual structures</h2>
            <p>We took data from the original spreadsheet and created many different visual structures to best suit the different variables:</p>
            <ul>
              <li>Three static frames displaying varying data at different times</li>
              <li>Main frame showing teacher or courses as bubbles using preattentive features such as color and size</li>
              <li>Frame showing selected teacher data such as bar chart over years goal, icicle for semester dividation of periods and courses, and pie chart for showing involvement in courses</li>
              <li>Frame showing detailed course information with bar charts for course parts and showing goal hours reached</li>
            </ul>
          <h2>Learning objectives reached</h2>
            <p>We as a group worked towards making a comprehensible staffing tool that followed the visual information seeking mantra of: overview, zoom, filtering and details on demand. We learned 
              to assess the functionality of a system for meeting end user needs by collaborating with our stakeholders, and by by learning to criticize a design from perspectives of effectiveness, 
              efficiency, usability and usefulness we learned to improve our own. By building this tool we have learned the practical tools necessary to build interactive visualizations and design 
              them in a way as to facilitate action and insights on our stakeholders behalf. Lastly we improved our presentation skills, both to peers and stakeholders with the feedback we received 
              throughout the course.</p>
          <h2>Tools used</h2>
            <p className="project-tools"><b>D3</b> - JavaScript library to visualize data</p>
            <p className="project-tools"><b>React</b> - Front-end framework (JavaScript)</p>
            <p className="project-tools"><b>Firebase</b> - Page hosting</p>
            <p className="project-tools"><b>GitHub</b> - Version control</p>
            <p className="project-tools"><b>FB Messenger</b> - Communication tool</p>
            <p className="project-tools"><b>Google Drive</b> - File sharing</p>
        </div>

        <div className="profiles">
          <h1 className="the-team">The team</h1>
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
              <Card.Img variant="top" src={require("../../photos/cx.JPG")} />
              <Card.Body>
                <Card.Title><b>Ziqi Xia</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Front-end</Card.Subtitle>
                <Card.Text>
                  Responsible for creating the interactable prototype for user testing, creating the visualization of a teacher's detailed information, 
                  which includes the teacher profile and stacked bar showing the percentage of various work allocation from each teacher,
                  and adapt the function in the React environment. 
                </Card.Text>
                <Card.Link href="mailto:ceciliaxia118@gmail.com">Mail</Card.Link>
                <Card.Link href="https://github.com/CeciliaXZQ">GitHub</Card.Link>
                <Card.Link href="https://www.linkedin.com/in/ziqi-xia-a9935a115/">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
          </Row>

          <Row className="justify-content-center">
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src={require("../../photos/lb.jpg")} />
              <Card.Body>
                <Card.Title><b>Leo Bergqvist</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">UX design, Presentation, Front-end</Card.Subtitle>
                <Card.Text>
                  Responsible for icicle visual structure on teacher page, presenting work and involved in UX design of tool  
                </Card.Text>
                <Card.Link href="mailto:leo.bergqvist@hotmail.se">Mail</Card.Link>
                <Card.Link href="https://github.com/LeoBergqvist/">GitHub</Card.Link>
              </Card.Body>
            </Card>
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src={require("../../photos/dv.jpg")} />
              <Card.Body>
                <Card.Title><b>Dianne Vasseur</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">UI Design, Design Visual Structure</Card.Subtitle>
                <Card.Text>
                Responsible for the design of the Staffiz visualizations, together with two team members. Researching what has been done and performing 
                brainstorm sessions to come up with a design that is informative, as well as esthetically pleasing and user friendly. Also gained some 
                step-by-step front-end experience by attempting to partially create the detailed course overview in the React environment.
                </Card.Text>
                <Card.Link href="mailto:dmva@kth.se">Mail</Card.Link>
                <Card.Link href="https://github.com/Dmvasseur">GitHub</Card.Link>
                <Card.Link href="https://www.linkedin.com/in/dianne-vasseur-ba06a0133/">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
            <Card className="profile-cards" style={{ width: '20rem' }}>
              <Card.Img variant="top" src={require("../../photos/yt.png")} />
              <Card.Body>
                <Card.Title><b>Yutong Xu</b></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Front-end</Card.Subtitle>
                <Card.Text>
                  Responsible for creating the creating visualization of the course detail, including course profile and time allocation of each course, which is visualized with a stacked bar.
                </Card.Text>
                <Card.Link href="mailto:yutongx@kth.se">Mail</Card.Link>
                <Card.Link href="https://github.com/Mangobiubiu">GitHub</Card.Link>
                <Card.Link href="https://www.linkedin.com/in/yutong-xu-03035219b/">LinkedIn</Card.Link>
              </Card.Body>
            </Card>
          </Row>
        </div>
        
      </Container>

    );

  }

}

export default InfoPage;