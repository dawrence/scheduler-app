import React from 'react'
import UrlList from './UrlList'

class UrlForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { originalUrl: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: this.state.originalUrl })
    };
    fetch('/api/v1/urls', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ originalUrl: '' }));
    event.preventDefault();
    this.forceUpdate();
  }

  handleChange(evt) {
    this.setState({ originalUrl: evt.target.value })
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="col m12">
            <form onSubmit={this.handleSubmit}>
              <div className="card">
                <div className="card-content">
                  <div className="row">
                    <div className="col m8 offset-m2 center-align">
                      <span className="card-title">Create a new short URL</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col m6 offset-m2">
                      <input type='text'
                            value={ this.state.originalUrl }
                            onChange={this.handleChange}
                            className='validate form-control'
                            placeholder="Your original URL here" />
                    </div>
                    <div className="col m2">
                      <button type="submit" className="waves-effect waves-light btn">Shorten URL</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <UrlList />
      </>
    );
  }
}

export default UrlForm;
