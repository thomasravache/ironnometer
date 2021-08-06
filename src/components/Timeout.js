import React from 'react';
import senjutsu from '../images/senjutsu.gif'

class Timeout extends React.Component {
  render() {
    const { onClick } = this.props;

    return(
      <div onClick={onClick} className="time-out" >
        <p>Time is over</p>
      </div>
    )
  }
}

export default Timeout;