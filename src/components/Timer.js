import React from 'react';
import Countdown from 'react-countdown';
import Timeout from './Timeout';
import toasty from '../audios/toasty.mp3';
import rocknroll from '../audios/gunzerker_rocknroll.mp3';
import choose from '../audios/choose.mp3';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      horas: 0,
      minutos: 0,
      segundos: 0,
      start: false,
      timeout: false,
      disabled: false,
      audio: choose,
    };

    this.setRef = this.setRef.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleClickReload = this.handleClickReload.bind(this);
    this.handleClickStop = this.handleClickStop.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
    this.playAudio = this.playAudio.bind(this);
  }

  componentDidMount() {
    this.playAudio();
  }

  setRef(countdown){ // função necessária para que funcione o pause, start, stop. ela habilita o acesso a api e através da api temos como acessar o pause, start etc. vide documentação
    if (countdown) {
      this.countdownApi = countdown.getApi();
    }
  };

  handleStatus() {
    const condition = (this.countdownApi.isPaused() || this.countdownApi.isStopped())

    if(this.countdownApi.isCompleted()) {
      this.setState({
        start: false,
        timeout:true,
        disabled: false,
      })
    } else if (condition) {
        this.setState({
          start: false,
        })
    } else {
        this.setState({
          start: true,
        })
    }
  }

  handleKeyPress(event) {
    if(isNaN(event.key)) {
      event.preventDefault();
    }
    if (event.target.name === 'horas' && (event.target.value >= 24 || event.target.value >= '24')) {
      event.target.value = '';
    }
  }

  playAudio() {
    const audioEl = document.getElementsByClassName("audio-element")[0]
    audioEl.play()
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
  }

  handleClickStart() {
    const { horas, minutos, segundos } = this.state;
    if (horas != 0 || minutos != 0 || segundos != 0) {
      this.setState({
        start: true,
        disabled: true,
        audio: rocknroll,
      }, () => {
        this.countdownApi.start();
        this.playAudio();
      })
    }
  }

  handleClickReload() {
    this.countdownApi.stop();
  }

  handleClickStop() {
    this.setState({
      horas: 0,
      minutos: 0,
      segundos: 0,
      start: false,
      timeout: false,
      disabled: false,
    })
  }

  render() {
    const horas = this.state.horas * 3600000;
    const minutos = this.state.minutos * 60000;
    const segundos = this.state.segundos * 1000;
    const tempo = minutos + segundos + horas;

    return (
      <div>
        {/* { this.state.start && <div className="timing"></div> } */}
        <Countdown
          key={ Date.now() + tempo }
          date={ Date.now() + tempo }
          ref={this.setRef} // Necessário para ativar a api que pode pausar, startar, etc.
          autoStart={false}
          daysInHours={false}
          onComplete={ this.handleStatus }
          renderer={ (props) => {
              if (this.state.start) {
                // return <div className="timing"><span className='timer'>{`${props.formatted.days}:${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`}</span></div>
                return (
                  <div>
                    <iframe className="timing" width="420" height="345" src="https://www.youtube.com/embed/FhBnW7bZHEE?autoplay=1" frameborder="0" allowfullscreen allow="autoplay" autoStart="true"></iframe>
                    <div className='timer'>{`${props.formatted.days}:${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`}</div>
                  </div>
                )
              }

              if (this.state.timeout) {
                setTimeout(() => {
                  this.setState({
                    timeout: false,
                    audio: toasty,
                  })
                  this.playAudio();
                }, 4500)
                return <Timeout />;
              }

              return <span className='timer'>{`${props.formatted.days}:${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`}</span>;
          } }
        />
        <form action="" onSubmit={(event) => event.preventDefault()}>
        <div>
          <input type="text" name="horas" maxLength="2" placeholder="Horas" onChange={ this.handleChange } onKeyPress={this.handleKeyPress} disabled={this.state.disabled} />:
          <input type="text" name="minutos" maxLength="2" placeholder="Minutos" onChange={ this.handleChange } onKeyPress={this.handleKeyPress} disabled={this.state.disabled} />:
          <input type="text" name="segundos" maxLength="2" placeholder="Segundos" onChange={ this.handleChange } onKeyPress={this.handleKeyPress} disabled={this.state.disabled} />
        </div>
        <div>
          <button onClick={ this.handleClickPause }>Pausar</button>
          <button onClick={ this.handleClickStart } >Startar</button>
          <button onClick={ this.handleClickReload } disabled={this.state.disabled}>Recomeçar</button>
          <input type="reset" onClick={ this.handleClickStop } value="Zerar" />
        </div>
        <audio className="audio-element" src={this.state.audio}></audio>
        </form>
      </div>
    );
  }
}

export default Timer;