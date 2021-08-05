import React from 'react';
import Countdown from 'react-countdown';
import Timeout from './Timeout';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      horas: 0,
      minutos: 0,
      segundos: 0,
      start: false,
      timeout: false,
    };

    this.setRef = this.setRef.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleClickReload = this.handleClickReload.bind(this);
    this.handleClickStop = this.handleClickStop.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    // this.handleStatus = this.handleStatus.bind(this);
  }

  setRef(countdown){ // função necessária para que funcione o pause, start, stop. ela habilita o acesso a api e através da api temos como acessar o pause, start etc. vide documentação
    if (countdown) {
      this.countdownApi = countdown.getApi();
    }
  };

  // handleStatus() {
  //   const condition = (this.countdownApi.isPaused() || this.countdownApi.isStopped())

  //   if(this.countdownApi.isCompleted()) {
  //     this.setState({
  //       horas: 0,
  //       minutos: 0,
  //       segundos: 0,
  //       start: false,
  //       timeout:true,
  //     })
  //   } else if (condition) {
  //       this.setState({
  //         start: false,
  //       })
  //   } else {
  //       this.setState({
  //         start: true,
  //       })
  //   }
  // }

  handleKeyPress(event) {
    if(isNaN(event.key)) {
      event.preventDefault();
    }
  }

  handleChange({ target }) {
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    })
  }

  handleClickPause() {
    this.countdownApi.pause();
    // this.setState({
    //   start: false,
    // })
  }

  handleClickStart() {
    this.countdownApi.start();
    this.setState({
      start: true,
    })
  }

  handleClickReload() {
    this.countdownApi.stop();
    this.setState({
      start: false,
    })
  }

  handleClickStop() {
    this.setState({
      horas: 0,
      minutos: 0,
      segundos: 0,
      start: false,
      timeout: false,
    })
  }

  render() {
    const horas = this.state.horas * 3600000;
    const minutos = this.state.minutos * 60000;
    const segundos = this.state.segundos * 1000;
    const tempo = minutos + segundos + horas;

    return (
      <div>
        { this.state.start && <div className="timing"></div> }
        <Countdown
          date={Date.now() + tempo}
          ref={this.setRef} // Necessário para ativar a api que pode pausar, startar, etc.
          autoStart={false}
          daysInHours={false}
          // onComplete={ this.handleStatus }
        >
          {this.state.timeout && <Timeout change={ this.handleStatus } />}
        </Countdown>
        <form action="" onSubmit={(event) => event.preventDefault()}>
        <div>
          <input type="text" name="horas" maxLength="2" placeholder="Horas" onChange={ this.handleChange } onKeyPress={this.handleKeyPress} />:
          <input type="text" name="minutos" maxLength="2" placeholder="Minutos" onChange={ this.handleChange } onKeyPress={this.handleKeyPress} />:
          <input type="text" name="segundos" maxLength="2" placeholder="Segundos" onChange={ this.handleChange } onKeyPress={this.handleKeyPress} />
        </div>
        <div>
          <button onClick={ this.handleClickPause }>Pausar</button>
          <button onClick={ this.handleClickStart }>Startar</button>
          <button onClick={ this.handleClickReload }>Recomeçar</button>
          <input type="reset" onClick={ this.handleClickStop } value="Zerar" />
        </div>
        </form>
      </div>
    );
  }
}

export default Timer;