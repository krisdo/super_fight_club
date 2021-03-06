import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Leaderboard from './components/Leaderboard.jsx';
import Choose from './components/Choose.jsx';
import Results from './components/Results.jsx';
import { Container, Row, Col, Button, Card} from 'react-bootstrap';
// import { Button } from 'react-bootstrap';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      battle : {
        user: {id: null, name: 'Choose one', url: 'https://media.giphy.com/media/eNdTUcTWKL7O0UvonE/giphy.gif'},
        computer: {id: null, name: 'Computer', url: 'https://media.giphy.com/media/eNdTUcTWKL7O0UvonE/giphy.gif'}
      },
      results: {heading: null,
                text: null,
                advice: null,
                url: null}
    },
    this.handleClickEvent = this.handleClickEvent.bind(this);

  }

  fetchStats() {
    //get request for leadboard
    fetch('/characters')
    .then( (res) => {
      return res.json();
    })
    .then( (data) => {
      this.setState({
        characters: data
      })
    })
    .catch((err)=> {
      if (err) throw err;
    });
  }

  // refreshonClick(e)



  search(name) {
    console.log(`Looking for ${name}`);
    //fetch post request to server with name
      //success
      //set user state and computer state
      let options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name})
    };

      fetch('/characters', options)
      .then( (res) => {
        return res.json()
      })
      .then( (data) => {
        console.log('Ready to Fight?');
        var user = data[0];
        var computer = data[1];
        this.setState({
          battle: {
            user: {id: user.id, name: user.name, url: user.image.url},
            computer: {id: computer.id, name: computer.name, url: computer.image.url}
        }});
      })
      .catch((err) => {
        console.log(err);
      })

  }

  handleClickEvent(e) {
    //on click, send post req to get results
    //set the results state with response from server
    e.preventDefault();
    console.log('Fight!');
    fetch('/results').
    then( (res) => {
      return res.json();
    })
    .then( (data) => {
      let results = data.data[0];
      this.setState({
        results: {heading: 'Results', text: results.text, advice: results.advice, url: results.url}
      })
    })
    .then( () => {
      this.fetchStats();
    })
    .catch( (err) =>{
      console.log(err);
    })


  }



  componentDidMount() {
    this.fetchStats();
  }

  render () {
    return (<div>
      <Container className="jumbotron text-center text-dark-50 bg-secondary" variant="primary">
        <h1 class='mx-auto'>Super Fight Club</h1>
        <p><small class="text-white-50">The first rule of Super Fight Club is: You do not talk about Super Fight Club. The second rule of Super Fight Club is: You do not talk about Super Fight Club. Third rule of Super Fight Club is: HAVE fun!</small></p>
      </Container>
        <Leaderboard class="text-center" characters={this.state.characters}/>
        <Choose class="text-center" onSearch={this.search.bind(this)}/>
      <Container variant="primary" className="text-center mx-auto bg-secondary" variant="dark">
        <Row>
          <Col center="xs"><h6 class="text-light">{this.state.battle.user.name}</h6></Col>
          <Col></Col>
          <Col center="xs"><h6 class="text-light">{this.state.battle.computer.name}</h6></Col>
        </Row>
        <Row>
          <Col><img src={this.state.battle.user.url} width='200'class="rounded"></img></Col>
          <Col center="xs" className="align-middle"><img src="https://media.giphy.com/media/eiXQYAYkIu6n6U2Aoe/giphy.gif" width='100'></img></Col>
          <Col><img src={this.state.battle.computer.url} width='200' class="rounded"></img></Col>
        </Row>
        <div class="text-center">
        <Button size="large" variant="dark" onClick={this.handleClickEvent}>Let's Fight!</Button>

        <Results user={this.state.user} computer={this.state.computer} results={this.state.results}/>
        </div>
      </Container>
      </div>
      )
    // return (<div>
    //   <h1>Super Fight Club</h1>
    //   <Leaderboard characters={this.state.characters}/>
    //   <Choose onSearch={this.search.bind(this)}/>
    //   <table class='table'>
    //   <tr>
    //     <td>{this.state.battle.user.name}</td><td></td><td>{this.state.battle.computer.name}</td>
    //   </tr>
    //   <tr>
    //   <td><img src={this.state.battle.user.url} width='200'></img></td><td>VS</td><td><img src={this.state.battle.computer.url} width='200'></img></td>
    //   </tr>
    //   </table>
    //   <button onClick={this.handleClickEvent}>Let's Fight!</button>
    //   <Results user={this.state.user} computer={this.state.computer} results={this.state.results}/>
    // </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));