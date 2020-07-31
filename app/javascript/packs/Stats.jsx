import React, { useState, useEffect } from 'react'

function Stats(props){
  const stats = props.stats

  if(!stats) {
    return '';
  }
  else {
    return (
      <>
        <div>
          <p><strong> Clicks Per Day: </strong> { stats.clicks_per_day }</p>
          <p><strong> Browsers: </strong> { stats.browsers }</p>
          <p><strong> Platforms: </strong> { stats.platforms }</p>
        </div>
      </>
    );
  }
}

export default Stats;
