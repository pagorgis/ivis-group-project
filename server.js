const express = require('express');
const app = express();



let sampleTeachers = [
    {id: 101, firstName: 'Mario', lastName: 'Romero'},
    {id: 102, firstName: 'Björn', lastName: 'Bear'},
    {id: 103, firstName: 'Jarmo', lastName: 'Laakhosomething'}
];
let sampleCourses = [
    {id: 501, name: 'Information Visualization', code: 'DH2321'},
    {id: 502, name: 'Interaction Design Methods', code: 'DH2628'},
    {id: 503, name: 'Ratatouille basics', code: 'COOK2100'}
];



app.get('/api/teachersss', (req, res) => {
    res.json(sampleTeachers);
});

app.get('/api/coursesss', (req, res) => {
    res.json(sampleCourses);
});



const port = 5000;
app.listen(port, () => console.log("Server started on port " + port));
