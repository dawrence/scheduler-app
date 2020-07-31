import React, { useState, useEffect } from 'react'

function UrlList() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [visitError, setVisitError] = useState(null);

  const visitUrl = (shortUrl, evt) => {
    evt.preventDefault();
    fetch(`/api/v1/${shortUrl}`)
      .then(res => res.json())
      .then(
        (result) => {
          window.location.href =  result.data.attributes['original-url']
        },

        (error) => {
          setVisitError(error);
        }
      )
  }

  useEffect(() => {
    fetch("/api/v1/latest")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.data);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if(error) {
    return <div>Error: {error.message}</div>;
  }
  else if(!isLoaded) {
    return <div>Loading...</div>;
  }
  else {
    return (
      <table className="table highlight">
        <thead>
          <tr>
            <th scope="col">Short URL</th>
            <th scope="col">Original URL</th>
            <th scope="col">Created</th>
            <th scope="col">Clicks Count</th>
            <th scope="col">Stats</th>
          </tr>
        </thead>
        <tbody>
        { items.length > 0 && items.map(item => {
              return (
                <tr key={item.id}>
                  <th scope="row">
                    <a href={`${window.location.href.match(/^.*\//)}${item.attributes['short-url']}`}
                       onClick={(e) => visitUrl(item.attributes['short-url'], e)}>
                      {`${window.location.href.match(/^.*\//)}${item.attributes['short-url']}`}
                    </a>
                  </th>
                  <td>
                    <a href={item.attributes['original-url']}>
                      {item.attributes['original-url']}
                    </a>
                  </td>
                  <td>
                    {item.attributes['created-at'] }
                  </td>
                  <td>
                    { item.attributes['clicks-count'] }
                  </td>
                  <td>
                    <a href={`/${item.attributes['short-url']}/stats`}>
                      <svg className="octicon octicon-graph"
                          viewBox="0 0 16 16"
                          version="1.1"
                          width="16"
                          height="16"
                          aria-hidden="true">
                        <path fillRule="evenodd" d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"></path>
                      </svg>
                    </a>
                  </td>
                </tr>
              );
          })
        }
        </tbody>
      </table>
    );
  }
}

export default UrlList;
