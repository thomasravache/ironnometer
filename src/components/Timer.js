import React from 'react';
import Countdown from 'react-countdown';
import Timeout from './Timeout';
import toasty from '../audios/toasty.mp3';
import rocknroll from '../audios/gunzerker_rocknroll.mp3';
import gameover from '../audios/game_over.mp3';

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
      audio: '',
      displayButtonStart: 'initial',
    };

    this.setRef = this.setRef.bind(this);
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickStop = this.handleClickStop.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
    this.playAudio = this.playAudio.bind(this);
  }

  setRef(countdown){ // função necessária para que funcione o pause, start, stop. ela habilita o acesso a api e através da api temos como acessar o pause, start etc. vide documentação
    if (countdown) {
      this.countdownApi = countdown.getApi();
    }
  };

  handleStatus() {
    if(this.countdownApi.isCompleted()) {
      this.setState({
        start: false,
        timeout:true,
        disabled: false,
        audio: gameover,
      })
    }
  }

  handleKeyPress(event) {
    if(isNaN(event.key)) {
      event.preventDefault();
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

  handleClickStart() {
    const { horas, minutos, segundos } = this.state;
    const myStates = [horas, minutos, segundos];

    const isValidInputValue = myStates.some((state) => parseInt(state) !== 0 && state !== '') // verifica se cada estado tem o valor diferente de zero e se não está vazio.

    // const condition = (parseInt(horas) !== 0 || parseInt(minutos) !== 0 || parseInt(segundos) !== 0) // implementação anterior a de cima;
    
    if (isValidInputValue) { // se o valor que o usuario digitar for somente 0 não inicia o cronometro, e vazio também não.
      this.setState({
        start: true,
        disabled: true,
        audio: rocknroll,
        displayButtonStart: 'none',
      }, () => {
        this.countdownApi.start();
        this.playAudio();
      })
    } else {
      this.setState({
        audio: toasty,
      }, () => this.playAudio())
    }
  }

  handleClickStop() {
    this.setState({
      horas: 0,
      minutos: 0,
      segundos: 0,
      start: false,
      timeout: false,
      disabled: false,
      audio: toasty,
      displayButtonStart: 'initial',
    }, () => this.playAudio())
  }

  render() {
    const horas = this.state.horas * 3600000;
    const minutos = this.state.minutos * 60000;
    const segundos = this.state.segundos * 1000;
    const tempo = minutos + segundos + horas;

    return (
      <div className="render">
        <Countdown className="countdown"
          key={ Date.now() + tempo }
          date={ Date.now() + tempo }
          ref={this.setRef} // Necessário para ativar a api que pode pausar, startar, etc.
          autoStart={false}
          daysInHours={false}
          onComplete={ this.handleStatus }
          renderer={ (props) => {
              if (this.state.start) {
                return (
                  <div className="video">
                    <iframe title="youtube-video" className="timing" width="420" height="345" src="https://www.youtube.com/embed/FhBnW7bZHEE?autoplay=1" frameBorder="0" allowFullScreen allow="autoplay" autostart="true"></iframe>
                    <div className='timer'>{`${props.formatted.days}:${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`}</div>
                  </div>
                )
              }

              if (this.state.timeout) {
                this.playAudio();

                setTimeout(() => {
                  this.setState({
                    timeout: false,
                    displayButtonStart: 'initial',
                  })
                }, 3040)
                return <Timeout />;
              }

              return <span className='timer'>{`${props.formatted.days}:${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`}</span>;
          } }
        />
        <form className="form" action="" onSubmit={(event) => event.preventDefault()}>
        <div className="inputs-text">
          <input type="text" inputMode="numeric" name="horas" maxLength="2" placeholder="Hr." onChange={ this.handleChange } onKeyPress={this.handleKeyPress} disabled={this.state.disabled} />:
          <input type="text" inputMode="numeric" name="minutos" maxLength="2" placeholder="Min." onChange={ this.handleChange } onKeyPress={this.handleKeyPress} disabled={this.state.disabled} />:
          <input type="text" inputMode="numeric" name="segundos" maxLength="2" placeholder="Sec." onChange={ this.handleChange } onKeyPress={this.handleKeyPress} disabled={this.state.disabled} />
        </div>
        <div className="buttons">
          <button style={{display: this.state.displayButtonStart }} onClick={ this.handleClickStart } disabled={this.state.disabled}>Start</button>
          <input type="reset" onClick={ this.handleClickStop } value="Clear" />
        </div>
        <audio className="audio-element" autoPlay src={this.state.audio}></audio>
        </form>
      </div>
    );
  }
}

export default Timer;