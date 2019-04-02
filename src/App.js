import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  state = {
    gists: null
  }

  componentDidMount() {
    fetch('https://api.github.com/gists')
      .then(result => result.json())
      .then(gists => this.setState({ gists: gists }));
  }

  render() {
    const { gists } = this.state;
    // console.log(gists);
    return (
      <Router>
        <Root>
          <Sidebar>
            {gists ? (
              gists.map(gist => (
                <SidebarItem key={gist.id}>
                  {/* Note use of back tick to make a template literal
                  string that allows an embedded JS variable with ${} */}
                  <Link to={`/g/${gist.id}`}>
                    {gist.description || '[no description]'}
                  </Link>
                </SidebarItem>
              ))
            ) : <div>Loading...</div>}
          </Sidebar>
          <Main>
            <Route exact path='/' render={() => (
              <h1>Welcome!</h1>
            )} />
            {gists &&
              <Route path='/g/:gistId' render={({ match }) => (
                <Gist gist={gists.find(g => g.id === match.params.gistId)} />
              )} />
            }
          </Main>
        </Root>
      </Router>
    );
  }
}

const Gist = ({ gist }) => {
  // Guard against chance that there is no gist, such as when reloading page
  // and the last selected gist has fallen off the list.
  if (!gist) return null;

  return (
    <div>
      <h1>{gist.description || 'No Description'}</h1>
      <ul>
        {Object.keys(gist.files).map(key => (
          <li key={key}>
            <b>{key}</b>
            <LoadFile url={gist.files[key].raw_url}>
              {(text) => (
                <pre>{text}</pre>
              )}
            </LoadFile>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Root = (props) => (
  <div style={{ display: 'flex' }} {...props} />
)

const Sidebar = (props) => (
  <div style={{
    width: '33vw',
    height: '100vh',    // keep in viewport to make it scrollable
    overflow: 'auto',
    background: '#eee',
    WebkitOverflowScrolling: 'touch',   // inertia on touchscreens
  }} {...props} />
)

const SidebarItem = (props) => (
  <div style={{
    whiteSpace: 'nowrap',     // keep on one line
    textOverflow: 'ellipsis', // end with ... if it overflows
    overflow: 'hidden',       // prevent horizontal scrollbar
    padding: '5px 10px',
  }} {...props} />
)

const Main = (props) => (
  <div style={{
    flex: 1,            // fill remaining space (in flex direction)
    height: '100vh',    // match viewport height, autoscroll if needed
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',   // inertia on touchscreens
  }}>
    <div style={{ padding: '20px' }} {...props} />
  </div>
)

// Loadfile needs to be a full Component to hold state and thus
// trigger another rendering once the file has been fetched.
// Initially this will return null, but then React will detect
// the state change (file state is set) and call render() again.
class LoadFile extends Component {
  state = {
    file: null
  }

  componentDidMount() {
    fetch(this.props.url)
      .then(res => res.text())
      .then(file => {
        this.setState({ file })
      })
  }

  render() {
    const { file } = this.state;
    // console.log(`LoadFile(${this.props.url}): ${file}`)
    return (
      file && this.props.children(file)
    );
  }
}

// A simple stateless function like this won't work for LoadFile.
// There is nothing to return when it is first called, and then
// no way to trigger a re-rendering of the component once the fetch
// and text() completes.  This also doesn't return props.children,
// so there is no easy way to pass the retrieved file to them.
// The full stateful component above is the way to go.
//
// const LoadFile = async (url) => {
//   console.log(url);
//   const response = await fetch(url);
//   const bodyTxt = await response.text();
//   console.log(bodyTxt);
//   return bodyTxt;
// }

export default App;
